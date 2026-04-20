import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { COMPANY_INFO } from '@/lib/constants';
import { SansMercantileLogo } from '@/components/SansMercantileLogo';

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative bg-slate-950/80 backdrop-blur-md border-t border-nexus-accent/20 py-12 mt-20 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-12 relative z-50">
          {/* Brand */}
          <div>
            <SansMercantileLogo />
            <p className="text-white/80 text-sm mt-2">Reimagine • Rebuild • Transcend</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/systems" className="hover:text-nexus-gold transition-colors">Systems</Link></li>
              <li><Link href="/services" className="hover:text-nexus-gold transition-colors">Services</Link></li>
              <li><Link href="/platform" className="hover:text-nexus-gold transition-colors">Platform</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/about" className="hover:text-nexus-gold transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-nexus-gold transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-nexus-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/legal/faq" className="hover:text-nexus-gold transition-colors">FAQ</Link></li>
              <li><Link href="/media" className="hover:text-nexus-gold transition-colors">Media</Link></li>
              <li><Link href="/knowledge-base" className="hover:text-nexus-gold transition-colors">Knowledge Base</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="mailto:support@sansmercantile.com" className="hover:text-nexus-gold transition-colors">Support</a></li>
              <li><a href="mailto:api@sansmercantile.com" className="hover:text-nexus-gold transition-colors">API Help</a></li>
              <li><a href="https://status.sansmercantile.com" target="_blank" rel="noopener noreferrer" className="hover:text-nexus-gold transition-colors">Status</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link href="/legal/terms" className="hover:text-nexus-gold transition-colors">Terms</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-nexus-gold transition-colors">Privacy</Link></li>
              <li><Link href="/legal/cookie" className="hover:text-nexus-gold transition-colors">Cookies</Link></li>
              <li><Link href="/legal/eula" className="hover:text-nexus-gold transition-colors">EULA</Link></li>
              <li><Link href="/legal/compliance" className="hover:text-nexus-gold transition-colors">Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-nexus-accent/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            © {currentYear} {COMPANY_INFO.name}. All rights reserved. | Regulatory Compliance: SARS, FATCA, GDPR, SADC
          </p>
          <div className="flex gap-4 text-sm text-white/80">
            <a href="https://linkedin.com/company/sans-mercantile" target="_blank" rel="noopener noreferrer" className="hover:text-nexus-gold transition-colors">
              LinkedIn
            </a>
            <a href="https://twitter.com/sansmercantile" target="_blank" rel="noopener noreferrer" className="hover:text-nexus-gold transition-colors">
              Twitter
            </a>
            <a href="https://github.com/sansmercantile" target="_blank" rel="noopener noreferrer" className="hover:text-nexus-gold transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
