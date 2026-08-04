import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SansMercantileLogo } from '@/components/SansMercantileLogo';
import { AnimatedIcon } from '@/components/AnimatedIcons';
import { useTheme } from '@/components/ThemeProvider';

export function Navbar() {
  const [mounted, setMounted] = useState(false);

  // Toggle this to true whenever you want the link to show up again
  const showServices = false;

  useEffect(() => {
    setMounted(true);
  }, []);

  // ThemeProvider itself already returns a safe 'dark' default before mount, so this
  // must be called unconditionally — it used to be `mounted ? useTheme() : {...}`,
  // which calls the hook conditionally and violates React's Rules of Hooks (the number
  // of hooks this component calls would differ between the pre-mount and post-mount
  // render, which is exactly what React's hook-call-order tracking forbids and can
  // corrupt state or break hydration).
  const { theme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    if (!mounted) return 'sun';
    switch (theme) {
      case 'dark':
        return 'sun'; // Sun icon for switching to light
      case 'light':
        return 'moon'; // Moon icon for switching to angelic
      case 'angelic':
        return 'monitor'; // Monitor icon for switching to system
      case 'system':
        return 'moon'; // Moon icon for switching to dark
      default:
        return 'sun';
    }
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-nexus-accent/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <SansMercantileLogo />

          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/systems" className="hover:text-nexus-gold transition">
              Systems
            </Link>
            
            {showServices && (
              <Link href="/services" className="hover:text-nexus-gold transition">
                Services
              </Link>
            )}

            <Link href="/platform" className="hover:text-nexus-gold transition">
              Platform
            </Link>
            <Link href="/about" className="hover:text-nexus-gold transition">
              About
            </Link>
            <Link href="/media" className="hover:text-nexus-gold transition">
              Media
            </Link>
            <Link href="/contact" className="hover:text-nexus-gold transition">
              Contact
            </Link>
            <Link href="/careers" className="hover:text-nexus-gold transition">
              Careers
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/portal" className="btn btn-secondary text-xs">
              Portal
            </Link>
            <div className="p-2 rounded-lg opacity-50">
              <AnimatedIcon type="sun" size={24} />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-nexus-accent/20 dark:bg-slate-950/80 dark:border-nexus-accent/20 light:bg-white/90 light:backdrop-blur-md light:border-gray-200 angelic:bg-white/95 angelic:backdrop-blur-md angelic:border-gold-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <SansMercantileLogo />

        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/systems" className="text-nexus-gold dark:text-nexus-gold light:text-amber-700 angelic:text-amber-700 hover:text-nexus-gold transition dark:hover:text-nexus-gold light:hover:text-amber-600 angelic:hover:text-amber-600">
            Systems
          </Link>

          {showServices && (
            <Link href="/services" className="text-nexus-gold dark:text-nexus-gold light:text-amber-700 angelic:text-amber-700 hover:text-nexus-gold transition dark:hover:text-nexus-gold light:hover:text-amber-600 angelic:hover:text-amber-600">
              Services
            </Link>
          )}

          <Link href="/platform" className="text-nexus-gold dark:text-nexus-gold light:text-amber-700 angelic:text-amber-700 hover:text-nexus-gold transition dark:hover:text-nexus-gold light:hover:text-amber-600 angelic:hover:text-amber-600">
            Platform
          </Link>
          <Link href="/about" className="text-nexus-gold dark:text-nexus-gold light:text-amber-700 angelic:text-amber-700 hover:text-nexus-gold transition dark:hover:text-nexus-gold light:hover:text-amber-600 angelic:hover:text-amber-600">
            About
          </Link>
          <Link href="/media" className="text-nexus-gold dark:text-nexus-gold light:text-amber-700 angelic:text-amber-700 hover:text-nexus-gold transition dark:hover:text-nexus-gold light:hover:text-amber-600 angelic:hover:text-amber-600">
            Media
          </Link>
          <Link href="/contact" className="text-nexus-gold dark:text-nexus-gold light:text-amber-700 angelic:text-amber-700 hover:text-nexus-gold transition dark:hover:text-nexus-gold light:hover:text-amber-600 angelic:hover:text-amber-600">
            Contact
          </Link>
          <Link href="/careers" className="text-nexus-gold dark:text-nexus-gold light:text-amber-700 angelic:text-amber-700 hover:text-nexus-gold transition dark:hover:text-nexus-gold light:hover:text-amber-600 angelic:hover:text-amber-600">
            Careers
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/portal" className="btn btn-secondary text-xs dark:btn-secondary light:bg-amber-100 light:text-amber-800 light:border-amber-300 light:hover:bg-amber-200 angelic:bg-amber-50 angelic:text-amber-900 angelic:border-amber-300 angelic:hover:bg-amber-100">
            Portal
          </Link>
          <motion.button
            onClick={toggleTheme}
            className="p-2 hover:bg-white/10 rounded-lg transition text-nexus-gold dark:text-nexus-gold dark:hover:bg-white/10 light:text-amber-600 light:hover:bg-amber-100 angelic:text-amber-700 angelic:hover:bg-amber-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Current theme: ${theme}. Click to switch theme.`}
            title={`Theme: ${theme}`}
          >
            <AnimatedIcon type={getThemeIcon()} size={24} />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}