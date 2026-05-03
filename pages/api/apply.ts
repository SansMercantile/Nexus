import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';

type ApplicationRequestBody = {
  jobId: string;
  name: string;
  email: string;
  phone?: string;
  resume: string;
  coverLetter?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).json({
      success: false,
      message: 'Method not allowed. Use POST to submit applications.',
    });
  }

  const { jobId, name, email, phone, resume, coverLetter } = req.body as ApplicationRequestBody;

  if (!jobId || !name || !email || !resume) {
    return res.status(400).json({
      success: false,
      message: 'Required fields missing: jobId, name, email, and resume are required.',
    });
  }

  try {
    const db = await getDb();
    const application = {
      jobId,
      applicantName: name,
      applicantEmail: email,
      phone: phone || null,
      resume,
      coverLetter: coverLetter || null,
      appliedAt: new Date().toISOString(),
      status: 'applied',
      source: 'careers-page',
    };

    const result = await db.collection('job_applications').insertOne(application);

    return res.status(201).json({
      success: true,
      insertedId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Error saving application to MongoDB:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to save application. Check MongoDB connection and configuration.',
    });
  }
}
