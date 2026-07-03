
import nodemailer, { Transporter } from 'nodemailer';

let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (_transporter) return _transporter;

  const host = process.env.EMAIL_SMTP_HOST;
  const port = parseInt(process.env.EMAIL_SMTP_PORT || '465', 10);
  const user = process.env.EMAIL_SMTP_USER;
  const pass = process.env.EMAIL_SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'Missing email env vars: EMAIL_SMTP_HOST, EMAIL_SMTP_USER, and EMAIL_SMTP_PASS are required.'
    );
  }

  // Port 465 = implicit SSL; port 587 = STARTTLS
  const secure = port === 465;

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return _transporter;
}

const FROM = () => process.env.EMAIL_FROM || 'hello@sansmercantile.com';

function getBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (configured && !configured.includes('localhost')) {
    return configured;
  }
  return 'https://sansmercantile.com';
}

const BASE_URL = getBaseUrl;

// ─── Portal account emails ────────────────────────────────────────────────────

export async function sendAdminApprovalRequest(user: {
  name: string;
  email: string;
  approvalToken: string;
}) {
  const approvalUrl = `${BASE_URL()}/api/portal/approve?token=${encodeURIComponent(user.approvalToken)}`;
  const denyUrl = `${BASE_URL()}/api/portal/deny?token=${encodeURIComponent(user.approvalToken)}`;

  await getTransporter().sendMail({
    from: FROM(),
    to: 'hello@sansmercantile.com',
    subject: 'New Portal Account Application',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#c9a84c">New Portal Account Request</h2>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <div style="margin-top:24px">
          <a href="${approvalUrl}"
             style="background:#c9a84c;color:#000;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin-right:12px">
            ✅ Approve
          </a>
          <a href="${denyUrl}"
             style="background:#b91c1c;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
            ❌ Deny
          </a>
        </div>
      </div>`,
  });
}

export async function sendUserApprovedEmail(email: string, name: string) {
  await getTransporter().sendMail({
    from: FROM(),
    to: email,
    subject: 'Your Sans Mercantile Portal Access is Approved',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#c9a84c">Welcome, ${name}!</h2>
        <p>Your Sans Mercantile portal account has been approved.</p>
        <p>
          <a href="${BASE_URL()}/portal"
             style="background:#c9a84c;color:#000;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
            Log In to Portal →
          </a>
        </p>
      </div>`,
  });
}

export async function sendUserDeniedEmail(email: string) {
  await getTransporter().sendMail({
    from: FROM(),
    to: email,
    subject: 'Portal Access Request Update',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2>Sans Mercantile Portal Access</h2>
        <p>Your application for portal access has not been approved at this time.</p>
        <p>If you believe this is an error, please contact
           <a href="mailto:hello@sansmercantile.com">hello@sansmercantile.com</a>.
        </p>
      </div>`,
  });
}

// ─── Career application confirmation ─────────────────────────────────────────

export async function sendApplicationConfirmation(applicant: {
  name: string;
  email: string;
  jobTitle: string;
  jobId: string;
}) {
  await getTransporter().sendMail({
    from: FROM(),
    to: applicant.email,
    subject: `Application Received – ${applicant.jobTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#c9a84c">Thank you, ${applicant.name}!</h2>
        <p>We have received your application for <strong>${applicant.jobTitle}</strong>.</p>
        <p>Please complete your assessments to move forward:</p>
        <p>
          <a href="${BASE_URL()}/onboarding?jobId=${applicant.jobId}&email=${encodeURIComponent(applicant.email)}"
             style="background:#c9a84c;color:#000;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
            Start Assessments →
          </a>
        </p>
        <p style="color:#888;font-size:13px;margin-top:24px">
          Questions? Contact <a href="mailto:hello@sansmercantile.com">hello@sansmercantile.com</a>
        </p>
      </div>`,
  });
}

export async function sendAdminNewApplicationAlert(applicant: {
  name: string;
  email: string;
  jobTitle: string;
  jobId: string;
}) {
  await getTransporter().sendMail({
    from: FROM(),
    to: 'hello@sansmercantile.com',
    subject: `New Job Application – ${applicant.jobTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#c9a84c">New Application Received</h2>
        <p><strong>Role:</strong> ${applicant.jobTitle} (${applicant.jobId})</p>
        <p><strong>Applicant:</strong> ${applicant.name}</p>
        <p><strong>Email:</strong> ${applicant.email}</p>
      </div>`,
  });
}
