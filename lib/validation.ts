/**
 * Shared input validation for public write endpoints (apply, register, assess).
 * Deliberately dependency-free so API routes and unit tests stay light.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  return EMAIL_PATTERN.test(trimmed);
}

export function isWithinLength(value: unknown, max: number): boolean {
  if (value === undefined || value === null) return true;
  return typeof value === 'string' && value.length <= max;
}
