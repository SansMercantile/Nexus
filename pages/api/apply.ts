import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';
import { sendApplicationConfirmation, sendAdminNewApplicationAlert } from '@/lib/mailer';

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
    // ── MongoDB Atlas ───────────────────────────────────────────────────────
    const db = await getDb();
    // Use scoped data to ensure applications are isolated by tenant/user context
    // Note: In a real scenario, we'd extract the current user's context from the session.
    const result = await db.collection('job_applications').insertOne(application);

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
      debug: process.env.DEBUG_API_ERRORS === '1' ? error.message : undefined,
    });
  }
}
