import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

interface SystemHeroProps {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  face?: string;
}

const getSystemUrl = (systemId: string) => `https://${systemId}.sansmercantile.com`;
const getSystemDemoUrl = (systemId: string) => `https://${systemId}.sansmercantile.com/demo`;

const getFaceSrc = (face?: string) => {
  if (!face) return null;
  return encodeURI(`/faces/${face}`);
};

export function SystemHero({ id, name, subtitle, color, face }: SystemHeroProps) {
  const systemUrl = getSystemUrl(id);
  const systemDemoUrl = getSystemDemoUrl(id);
  const faceSrc = getFaceSrc(face);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 grid-background opacity-20" />

      {/* Glow Elements */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: color }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {faceSrc && (
          <motion.div variants={fadeInUp} className="mx-auto mb-8 max-w-md rounded-3xl overflow-hidden border border-white/10 bg-nexus-dark/80 shadow-2xl">
            <div className="relative h-80 w-full">
              <Image
                src={faceSrc}
                alt={`${name} face`}
                fill
                className="object-cover"
              />
            </div>
            <div className="px-4 py-3 bg-black/60 text-left text-sm text-white/80">
              <p className="font-semibold">System Face</p>
              <p className="truncate text-white/70">{face}</p>
            </div>
          </motion.div>
        )}

        <motion.div variants={fadeInUp} className="mb-6">
          <div className="text-8xl font-black mb-6" style={{ color }}>
            {name}
          </div>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="text-3xl text-white/80 mb-8 font-light"
        >
          {subtitle}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex gap-4 justify-center flex-wrap"
        >
          <a
            href={systemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ backgroundColor: color, color: '#0a0e27' }}
          >
            Get Started
          </a>
          <a
            href={systemDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
