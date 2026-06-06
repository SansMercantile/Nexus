-- Sans Mercantile Supabase Schema
-- Run this in Supabase → SQL Editor to create all required tables
-- These mirror MongoDB collections and act as redundant storage

-- ── Portal Users ─────────────────────────────────────────────────────────────
create table if not exists portal_users (
  id             uuid primary key default gen_random_uuid(),
  email          text not null unique,
  name           text not null,
  role           text not null default 'user',
  active         boolean not null default false,
  pending        boolean not null default true,
  approval_token text,
  approved_at    timestamptz,
  created_at     timestamptz not null default now()
);

alter table portal_users enable row level security;
create policy "Service role full access on portal_users"
  on portal_users for all
  using (auth.role() = 'service_role');

-- ── Job Applications ──────────────────────────────────────────────────────────
create table if not exists job_applications (
  id              uuid primary key default gen_random_uuid(),
  job_id          text not null,
  job_title       text,
  applicant_name  text not null,
  applicant_email text not null,
  phone           text,
  resume          text not null,
  cover_letter    text,
  applied_at      timestamptz not null default now(),
  status          text not null default 'applied',
  source          text default 'careers-page'
);

alter table job_applications enable row level security;
create policy "Service role full access on job_applications"
  on job_applications for all
  using (auth.role() = 'service_role');

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists idx_portal_users_email    on portal_users(email);
create index if not exists idx_portal_users_pending  on portal_users(pending) where pending = true;
create index if not exists idx_applications_email    on job_applications(applicant_email);
create index if not exists idx_applications_job      on job_applications(job_id);
create index if not exists idx_applications_status   on job_applications(status);
