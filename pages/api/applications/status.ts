import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const token = String(req.query.token || '').trim();
  if (!token) {
    return res.status(400).json({ success: false, message: 'Application token is required.' });
  }

  try {
    const db = await getDb();
    const application = await db.collection('job_applications').findOne({ viewToken: token });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or invalid token.' });
    }

    return res.status(200).json({
      success: true,
      application: {
        jobId: application.jobId,
        jobTitle: application.jobTitle,
        applicantEmail: application.applicantEmail,
        status: application.status,
        appliedAt: application.appliedAt,
      },
    });
  } catch (error) {
    console.error('Application status error:', error);
    return res.status(500).json({ success: false, message: 'Unable to validate application token.' });
  }
}
