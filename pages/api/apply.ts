import crypto from 'crypto';
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
  linkedin: string;
  socialLinks: string[];
  coverLetter?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).json({
      success: false,
      message: 'Method not allowed. Use POST to submit applications.',
    });
  }

  const { jobId, jobTitle, name, email, phone, resume, linkedin, socialLinks, coverLetter } = req.body as ApplicationRequestBody;
  const normalizedEmail = String(email || '').toLowerCase();
  const normalizedLinkedIn = String(linkedin || '').trim();
  const normalizedSocialLinks = Array.isArray(socialLinks) ? socialLinks.map((link) => String(link || '').trim()).filter(Boolean) : [];

  if (!jobId || !name || !normalizedEmail || !resume || !normalizedLinkedIn || normalizedSocialLinks.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Required fields missing: jobId, name, email, resume, LinkedIn, and at least two social links are required.',
    });
  }

  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  const isValidUrl = (value: string) => urlPattern.test(value);
  const resumeIsValid = resume.trim().length > 20 || isValidUrl(resume.trim());
  const linkedInIsValid = isValidUrl(normalizedLinkedIn) || normalizedLinkedIn.toLowerCase().includes('linkedin.com');
  const socialLinksValid = normalizedSocialLinks.every((link) => isValidUrl(link) || link.includes('linkedin.com') || link.includes('twitter.com') || link.includes('instagram.com') || link.includes('facebook.com') || link.includes('tiktok.com'));

  if (!resumeIsValid || !linkedInIsValid || !socialLinksValid) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid resume/CV link or text, a valid LinkedIn URL, and at least two social media links.',
    });
  }

  const application = {
    jobId,
    jobTitle: jobTitle || jobId,
    applicantName: name,
    applicantEmail: normalizedEmail,
    phone: phone || null,
    resume,
    linkedin: normalizedLinkedIn,
    socialLinks: normalizedSocialLinks,
    coverLetter: coverLetter || null,
    appliedAt: new Date().toISOString(),
    status: 'applied',
    source: 'careers-page',
    viewToken: crypto.randomBytes(28).toString('hex'),
  };

  try {
    // ── MongoDB Atlas ───────────────────────────────────────────────────────
    const db = await getDb();
    // Use scoped data to ensure applications are isolated by tenant/user context
    // Note: In a real scenario, we'd extract the current user's context from the session.
    const result = await db.collection('job_applications').insertOne(application);

    // ── Emails ──────────────────────────────────────────────────────────────
    try {
      await sendApplicationConfirmation({ name, email: normalizedEmail, jobTitle: application.jobTitle, jobId, viewToken: application.viewToken });
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
      viewToken: application.viewToken,
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
