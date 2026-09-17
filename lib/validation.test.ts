import { describe, it, expect } from 'vitest';
import { isValidEmail, isWithinLength } from './validation';

describe('isValidEmail', () => {
  it('accepts well-formed addresses', () => {
    expect(isValidEmail('jane.doe@example.com')).toBe(true);
    expect(isValidEmail('a+b@sub.domain.co')).toBe(true);
  });

  it('rejects malformed addresses', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('missing@tld')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('spaces in@example.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(42)).toBe(false);
  });

  it('rejects overlong addresses', () => {
    expect(isValidEmail(`${'a'.repeat(250)}@example.com`)).toBe(false);
  });
});

describe('isWithinLength', () => {
  it('treats missing values as valid', () => {
    expect(isWithinLength(undefined, 10)).toBe(true);
    expect(isWithinLength(null, 10)).toBe(true);
  });

  it('enforces the cap', () => {
    expect(isWithinLength('abc', 3)).toBe(true);
    expect(isWithinLength('abcd', 3)).toBe(false);
  });
});
