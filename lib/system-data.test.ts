import { describe, it, expect } from 'vitest';
import { getSystemBySlug, getSystemById, getAllSystems } from './system-data';

describe('getSystemBySlug', () => {
  it('resolves lowercase slugs', () => {
    expect(getSystemBySlug('priv')?.name).toBe('Priv');
    expect(getSystemBySlug('kev')?.name).toBe('KEV');
  });

  it('resolves mixed-case ids case-insensitively', () => {
    expect(getSystemBySlug('ptah')?.name).toBe('Ptah');
    expect(getSystemBySlug('Ptah')?.name).toBe('Ptah');
    expect(getSystemBySlug('PTAH')?.name).toBe('Ptah');
    expect(getSystemBySlug('KEV')?.name).toBe('KEV');
  });

  it('returns undefined for unknown slugs', () => {
    expect(getSystemBySlug('no-such-system')).toBeUndefined();
  });

  it('every system has three flagship applications where defined', () => {
    const priv = getSystemById('priv');
    expect(priv?.applications?.map((a) => a.name)).toEqual(['Priv Core', 'Priv Pay', 'Priv Philanthropy']);
    expect(getSystemById('Ptah')?.applications?.map((a) => a.name)).toEqual([
      'Ptah Core',
      'Ptah Real Estates',
      'Ptah Philanthropy',
    ]);
    expect(getSystemById('kev')?.applications?.map((a) => a.name)).toEqual([
      'KEV Core',
      'KEV Schools',
      'KEV Philanthropy',
    ]);
  });

  it('every application has a waitlist or live route (no dead buttons)', () => {
    for (const system of getAllSystems()) {
      for (const app of system.applications ?? []) {
        expect(app.platforms.length).toBeGreaterThan(0);
        const hasLivePlatform = Object.keys(app.platformUrls ?? {}).length > 0;
        expect(hasLivePlatform || app.waitlistUrl || app.liveUrl).toBeTruthy();
      }
    }
  });

  it('web app is primary for every product except Priv Pay', () => {
    for (const system of getAllSystems()) {
      for (const app of system.applications ?? []) {
        if (app.name === 'Priv Pay') {
          expect(app.platforms).not.toContain('web');
        } else {
          expect(app.platforms).toContain('web');
        }
      }
    }
  });

  it('Ptah Real Estates links to its live site', () => {
    const realty = getSystemById('Ptah')?.applications?.find((a) => a.name === 'Ptah Real Estates');
    expect(realty?.liveUrl).toBe('https://ptahrealty.sansmercantile.com');
    expect(realty?.platformUrls?.web).toBe('https://ptahrealty.sansmercantile.com');
  });

  it('flagship and philanthropy web apps link to their live sites', () => {
    const liveLinks: Array<[systemId: string, appName: string, url: string]> = [
      ['priv', 'Priv Core', 'https://priv.sansmercantile.com'],
      ['priv', 'Priv Philanthropy', 'https://privphil.sansmercantile.com'],
      ['Ptah', 'Ptah Core', 'https://ptahcore.sansmercantile.com'],
      ['Ptah', 'Ptah Philanthropy', 'https://ptahphil.sansmercantile.com'],
      ['kev', 'KEV Philanthropy', 'https://kevphil.sansmercantile.com'],
    ];
    for (const [systemId, appName, url] of liveLinks) {
      const app = getSystemById(systemId)?.applications?.find((a) => a.name === appName);
      expect(app?.liveUrl).toBe(url);
      expect(app?.platformUrls?.web).toBe(url);
    }
  });

  it('KEV Schools stays on the waitlist until its education domain is registered', () => {
    const schools = getSystemById('kev')?.applications?.find((a) => a.name === 'KEV Schools');
    expect(schools?.liveUrl).toBeUndefined();
    expect(schools?.platformUrls?.web).toBeUndefined();
    expect(schools?.waitlistUrl).toContain('KEV Schools');
  });
});
