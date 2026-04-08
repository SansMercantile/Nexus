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
    <footer className="bg-nexus-dark border-t border-nexus-accent/20 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div>
            <SansMercantileLogo />
            <p className="text-white/70 text-sm mt-2">Reimagine • Rebuild • Transcend</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/systems" className="hover:text-nexus-gold">Systems</Link></li>
              <li><Link href="/services" className="hover:text-nexus-gold">Services</Link></li>
              <li><Link href="/platform" className="hover:text-nexus-gold">Platform</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-nexus-gold">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-nexus-gold">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-nexus-gold">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/legal/faq" className="hover:text-nexus-gold">FAQ</Link></li>
              <li><Link href="/media" className="hover:text-nexus-gold">Media</Link></li>
              <li><Link href="/knowledge-base" className="hover:text-nexus-gold">Knowledge Base</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="mailto:support@sansmercantile.com" className="hover:text-nexus-gold">Support</a></li>
              <li><a href="mailto:api@sansmercantile.com" className="hover:text-nexus-gold">API Help</a></li>
              <li><a href="https://status.sansmercantile.com" target="_blank" rel="noopener noreferrer" className="hover:text-nexus-gold">Status</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/legal/terms" className="hover:text-nexus-gold">Terms</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-nexus-gold">Privacy</Link></li>
              <li><Link href="/legal/cookie" className="hover:text-nexus-gold">Cookies</Link></li>
              <li><Link href="/legal/eula" className="hover:text-nexus-gold">EULA</Link></li>
              <li><Link href="/legal/compliance" className="hover:text-nexus-gold">Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-nexus-accent/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © {currentYear} {COMPANY_INFO.name}. All rights reserved. | Regulatory Compliance: SARS, FATCA, GDPR, SADC
          </p>
          <div className="flex gap-4 text-sm text-white/50">
            <a href="https://linkedin.com/company/sans-mercantile" target="_blank" rel="noopener noreferrer" className="hover:text-nexus-gold">
              LinkedIn
            </a>
            <a href="https://twitter.com/sansmercantile" target="_blank" rel="noopener noreferrer" className="hover:text-nexus-gold">
              Twitter
            </a>
            <a href="https://github.com/sansmercantile" target="_blank" rel="noopener noreferrer" className="hover:text-nexus-gold">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
