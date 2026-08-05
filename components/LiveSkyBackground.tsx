import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from './ThemeProvider';
import { getDayPhase, DayPhase } from '@/lib/sun-position';

// Gradient stops per phase (top -> bottom). Two adjacent phases are cross-faded using
// `progress` so the transition doesn't visibly snap at exact sunrise/sunset moments.
const PHASE_GRADIENTS: Record<DayPhase, [string, string, string]> = {
  night: ['#020617', '#0a0e27', '#0f172a'],
  dawn: ['#4c1d95', '#c2410c', '#fbbf24'],
  day: ['#0ea5e9', '#38bdf8', '#bae6fd'],
  dusk: ['#7c2d12', '#c2410c', '#4c1d95'],
};

const PHASE_ORDER: DayPhase[] = ['night', 'dawn', 'day', 'dusk'];

function nextPhase(phase: DayPhase): DayPhase {
  return PHASE_ORDER[(PHASE_ORDER.indexOf(phase) + 1) % PHASE_ORDER.length];
}

function lerpColor(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 255, ag = (pa >> 8) & 255, ab = pa & 255;
  const br = (pb >> 16) & 255, bg = (pb >> 8) & 255, bb = pb & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bch = Math.round(ab + (bb - ab) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bch).toString(16).slice(1)}`;
}

/**
 * Live sky gradient — only active when the user has explicitly selected the "system"
 * theme, which (per the site's live-weather concept) means "follow real conditions",
 * not just OS light/dark preference. Dark/Light/Angelic stay fully static, unaffected.
 *
 * Requests geolocation once; if denied or unavailable, this renders nothing and the
 * normal .dark/.light/.angelic background from globals.css applies as the fallback —
 * no broken or blank state either way.
 */
export function LiveSkyBackground() {
  const { theme } = useTheme();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [denied, setDenied] = useState(false);
  const [gradient, setGradient] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setDenied(true),
      { timeout: 10000, maximumAge: 30 * 60 * 1000 }
    );
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system' || !coords) return;

    const update = () => {
      const { phase, progress } = getDayPhase(new Date(), coords.lat, coords.lng);
      const [t1, m1, b1] = PHASE_GRADIENTS[phase];
      const [t2, m2, b2] = PHASE_GRADIENTS[nextPhase(phase)];
      const top = lerpColor(t1, t2, progress);
      const mid = lerpColor(m1, m2, progress);
      const bottom = lerpColor(b1, b2, progress);
      setGradient(`linear-gradient(to bottom, ${top}, ${mid}, ${bottom})`);
    };

    update();
    const interval = setInterval(update, 60 * 1000); // recompute every minute — smooth enough for a sky gradient, cheap on battery
    return () => clearInterval(interval);
  }, [theme, coords]);

  useEffect(() => {
    if (theme !== 'system' || !gradient) return;
    // Applied directly to <body> rather than as a separate fixed/positioned layer —
    // body already has its own opaque bg-nexus-dark/.light background from
    // globals.css, which would otherwise paint over a sibling layer regardless of
    // z-index tricks. Overwriting body's own background is the reliable way to
    // actually show the live sky gradient.
    document.body.style.backgroundImage = gradient;
    return () => {
      document.body.style.backgroundImage = '';
    };
  }, [theme, gradient]);

  return null;
}
