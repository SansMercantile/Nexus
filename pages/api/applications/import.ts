import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';
import { requireStaffRole, type AdminRole } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import { sendApplicationConfirmation } from '@/lib/mailer';
import { getMergedOpenJobs } from '@/lib/job-board';
import {
  parseApplicantsCsv,
  validateImportRow,
  MAX_IMPORT_ROWS,
} from '@/lib/applicant-import';

/**
 * POST /api/applications/import (roles hr, administrator, ceo)
 * Bulk-creates job applications from pasted CSV rows (e.g. LinkedIn
 * Recruiter exports) and sends each candidate the standard assessment
 * invitation email. Duplicates (same email + job) are skipped, never
 * re-created. Per-row results are reported so HR can fix and re-run.
 *
 * Body: { csv: string } or { rows: Array<Record<string, unknown>> }
 * CSV headers (case-insensitive): name, email, phone, jobId, jobTitle,
 * postUrl, postDate, location, coverLetter.
 */

const MANAGERIAL_ROLES: AdminRole[] = ['hr', 'administrator', 'ceo'];

type RowResult = { row: number; status: 'created' | 'duplicate' | 'error'; message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const session = await requireStaffRole(req, res, MANAGERIAL_ROLES);
  if (!session) return;

  if (!enforceRateLimit(req, res, 'applications-import', 10, 60 * 60 * 1000)) return;

  const { csv, rows } = (req.body || {}) as { csv?: unknown; rows?: unknown };

  let records: Array<Record<string, unknown>>;
  try {
    if (typeof csv === 'string') {
      if (csv.length > 2_000_000) {
        return res.status(400).json({ success: false, message: 'CSV payload too large (max ~2MB).' });
      }
      records = parseApplicantsCsv(csv);
    } else if (Array.isArray(rows)) {
      if (rows.length === 0 || rows.length > MAX_IMPORT_ROWS) {
        return res.status(400).json({ success: false, message: `rows must hold 1-${MAX_IMPORT_ROWS} entries.` });
      }
      records = rows.filter((row) => row !== null && typeof row === 'object') as Array<Record<string, unknown>>;
    } else {
      return res.status(400).json({ success: false, message: 'Provide csv text or a rows array.' });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: err instanceof Error ? err.message : 'Invalid input.' });
  }

  try {
    const db = await getDb();
    const collection = db.collection('job_applications');
    const openJobs = await getMergedOpenJobs();
    const results: RowResult[] = [];
    let created = 0;
    let duplicates = 0;

    for (let index = 0; index < records.length; index++) {
      const rowNumber = index + 1;
      const checked = validateImportRow(records[index], openJobs);
      if (!checked.ok || !checked.job || !checked.email || !checked.name) {
        results.push({ row: rowNumber, status: 'error', message: checked.message || 'Invalid row.' });
        continue;
      }

      const duplicate = await collection.findOne({
        applicantEmail: checked.email,
        jobId: checked.job.id,
      });
      if (duplicate) {
        duplicates += 1;
        results.push({ row: rowNumber, status: 'duplicate', message: 'Application already exists for this email and role.' });
        continue;
      }

      const viewToken = crypto.randomBytes(28).toString('hex');
      const record = records[index];
      const phone = typeof record.phone === 'string' ? record.phone.slice(0, 40) : null;
      const location = typeof record.location === 'string' ? record.location.slice(0, 120) : null;
      await collection.insertOne({
        jobId: checked.job.id,
        jobTitle: checked.job.title,
        applicantName: checked.name,
        applicantEmail: checked.email,
        phone,
        location,
        resume: `Imported applicant record (${checked.email}). Resume on file with hiring team.`,
        linkedin: '',
        socialLinks: [],
        coverLetter:
          typeof record.coverLetter === 'string' ? String(record.coverLetter).slice(0, 10000) : null,
        appliedAt: new Date().toISOString(),
        status: 'applied',
        source: 'csv-import',
        sourcePost: {
          url: checked.postUrl || null,
          advertisedAt: checked.postDate || null,
        },
        viewToken,
      });

      try {
        await sendApplicationConfirmation({
          name: checked.name,
          email: checked.email,
          jobTitle: checked.job.title,
          jobId: checked.job.id,
          viewToken,
        });
        created += 1;
        results.push({ row: rowNumber, status: 'created', message: 'Application created; invitation sent.' });
      } catch (emailErr) {
        console.error('Import invitation email failed (record kept):', emailErr);
        created += 1;
        results.push({ row: rowNumber, status: 'created', message: 'Application created; invitation email failed — resend manually.' });
      }
    }

    return res.status(200).json({
      success: true,
      created,
      duplicates,
      errors: results.filter((r) => r.status === 'error').length,
      results,
    });
  } catch (error) {
    console.error('Application import error:', error);
    return res.status(500).json({ success: false, message: 'Unable to import applications.' });
  }
}
