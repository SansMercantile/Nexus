import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/mongodb';

type DiagResult = {
  mongodb: { ok: boolean; detail: string };
  smtp: { ok: boolean; detail: string };
  portal: {
    jwtConfigured: boolean;
    users: number | null;
    accountQueried: string | null;
    accountExists: boolean | null;
    accountActive: boolean | null;
  };
  env: Record<string, boolean>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // No default key: without DIAG_KEY configured this endpoint does not exist.
  // (A 404 instead of 403 avoids confirming the endpoint to scanners.)
  const expected = process.env.DIAG_KEY;
  const key = req.query.key;
  if (!expected || key !== expected) {
    return res.status(404).json({ message: 'Not found.' });
  }

  const result: DiagResult = {
    mongodb: { ok: false, detail: '' },
    smtp: { ok: false, detail: '' },
    portal: {
      jwtConfigured: !!process.env.PORTAL_JWT_SECRET,
      users: null,
      accountQueried: null,
      accountExists: null,
      accountActive: null,
    },
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

    // Portal account diagnostics. Add &email= to check one account's
    // existence + active flag (safe: key-gated, no hashes or PII beyond
    // the queried address itself). Answers "is my login 401 because the
    // account is missing, inactive, or the password?"
    result.portal.users = await db.collection('portal_users').countDocuments();
    const queriedEmail = typeof req.query.email === 'string' ? req.query.email.toLowerCase().trim() : '';
    if (queriedEmail) {
      result.portal.accountQueried = queriedEmail;
      const account = await db.collection('portal_users').findOne(
        { email: queriedEmail },
        { projection: { active: 1 } }
      );
      result.portal.accountExists = !!account;
      result.portal.accountActive = account ? account.active !== false : null;
    }
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
