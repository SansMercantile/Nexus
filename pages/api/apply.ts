import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { sendApplicationConfirmation, sendAdminNewApplicationAlert } from '@/lib/mailer';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

type ApplicationRequestBody = {
  jobId: string;
  jobTitle?: string;
  name: string;
  email: string;
  phone?: string;
  resume: string;
  coverLetter?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).json({
      success: false,
      message: 'Method not allowed. Use POST to submit applications.',
    });
  }

  const { jobId, jobTitle, name, email, phone, resume, coverLetter } = req.body as ApplicationRequestBody;

  if (!jobId || !name || !email || !resume) {
    return res.status(400).json({
      success: false,
      message: 'Required fields missing: jobId, name, email, and resume are required.',
    });
  }

  const application = {
    jobId,
    jobTitle: jobTitle || jobId,
    applicantName: name,
    applicantEmail: email,
    phone: phone || null,
    resume,
    coverLetter: coverLetter || null,
    appliedAt: new Date().toISOString(),
    status: 'applied',
    source: 'careers-page',
  };

  try {
    // ── Primary: MongoDB Atlas ──────────────────────────────────────────────
    const db = await getDb();
    const result = await db.collection('job_applications').insertOne(application);

    // ── Redundancy: Supabase ────────────────────────────────────────────────
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseAdmin();
        await supabase.from('job_applications').insert({
          job_id: application.jobId,
          job_title: application.jobTitle,
          applicant_name: application.applicantName,
          applicant_email: application.applicantEmail,
          phone: application.phone,
          resume: application.resume,
          cover_letter: application.coverLetter,
          applied_at: application.appliedAt,
          status: application.status,
          source: application.source,
        });
      } catch (supaErr) {
        console.error('Supabase redundancy write failed on apply (non-fatal):', supaErr);
      }
    }

    // ── Emails ──────────────────────────────────────────────────────────────
    try {
      await sendApplicationConfirmation({ name, email, jobTitle: application.jobTitle, jobId });
    } catch (emailErr) {
      console.error('Applicant confirmation email failed (non-fatal):', emailErr);
    }

    try {
      await sendAdminNewApplicationAlert({ name, email, jobTitle: application.jobTitle, jobId });
    } catch (emailErr) {
      console.error('Admin alert email failed (non-fatal):', emailErr);
    }

    return res.status(201).json({
      success: true,
      insertedId: result.insertedId.toString(),
      message: 'Application submitted successfully. Check your email for next steps.',
    });
  } catch (error: any) {
    console.error('Error saving application:', error);
    return res.status(500).json({
      success: false,
      message: error?.message?.includes('MONGODB_URI')
        ? 'Database not configured. Contact the administrator.'
        : 'Unable to save application. Please try again later.',
    });
  }
}
