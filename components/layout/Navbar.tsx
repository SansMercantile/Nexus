import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { SansMercantileLogo } from '@/components/SansMercantileLogo';
import { AnimatedIcon } from '@/components/AnimatedIcons';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-nexus-dark/80 backdrop-blur-md border-b border-nexus-accent/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <SansMercantileLogo />

        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/systems" className="hover:text-nexus-gold transition">
            Systems
          </Link>
          <Link href="/services" className="hover:text-nexus-gold transition">
            Services
          </Link>
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
          <Link href="/login" className="btn btn-secondary text-xs">
            Portal
          </Link>
          {mounted && (
            <motion.button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-white/10 rounded-lg transition text-nexus-gold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              <AnimatedIcon type={theme === 'dark' ? 'sun' : 'moon'} size={24} />
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}
