import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';

type DiagResult = {
  mongodb: { ok: boolean; detail: string };
  smtp: { ok: boolean; detail: string };
  env: Record<string, boolean>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = req.query.key;
  if (key !== (process.env.DIAG_KEY || 'sm-diag-2026')) {
    return res.status(403).json({ message: 'Forbidden. Add ?key=... to access diagnostics.' });
  }

  const result: DiagResult = {
    mongodb: { ok: false, detail: '' },
    smtp: { ok: false, detail: '' },
    env: {
      MONGODB_URI: !!process.env.MONGODB_URI,
      MONGODB_DB: !!process.env.MONGODB_DB,
      EMAIL_SMTP_HOST: !!process.env.EMAIL_SMTP_HOST,
      EMAIL_SMTP_PORT: !!process.env.EMAIL_SMTP_PORT,
      EMAIL_SMTP_USER: !!process.env.EMAIL_SMTP_USER,
      EMAIL_SMTP_PASS: !!process.env.EMAIL_SMTP_PASS,
      EMAIL_FROM: !!process.env.EMAIL_FROM,
      PORTAL_JWT_SECRET: !!process.env.PORTAL_JWT_SECRET,
      NEXT_PUBLIC_API_URL: !!process.env.NEXT_PUBLIC_API_URL,
    },
  };

  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    const collections = await db.listCollections().toArray();
    result.mongodb = {
      ok: true,
      detail: `Connected to db "${db.databaseName}". Collections: ${collections.map(c => c.name).join(', ') || '(none yet)'}`,
    };
  } catch (err: any) {
    result.mongodb = { ok: false, detail: err?.message || String(err) };
  }

  try {
    const nodemailer = await import('nodemailer');
    const host = process.env.EMAIL_SMTP_HOST;
    const port = parseInt(process.env.EMAIL_SMTP_PORT || '465', 10);
    const user = process.env.EMAIL_SMTP_USER;
    const pass = process.env.EMAIL_SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error('Missing one of EMAIL_SMTP_HOST / EMAIL_SMTP_USER / EMAIL_SMTP_PASS');
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.verify();
    result.smtp = { ok: true, detail: `SMTP verified for ${user} via ${host}:${port}` };
  } catch (err: any) {
    result.smtp = { ok: false, detail: err?.message || String(err) };
  }

  const httpStatus = result.mongodb.ok && result.smtp.ok ? 200 : 207;
  return res.status(httpStatus).json(result);
}
