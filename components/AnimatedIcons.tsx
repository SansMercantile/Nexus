import React from 'react';
import { motion } from 'framer-motion';

export type IconType = 'rocket' | 'lock' | 'lightning' | 'globe' | 'chart' | 'handshake' | 'sun' | 'moon' | 'target' | 'star' | 'diamond' | 'brain' | 'integration' | 'code' | 'graduation' | 'shield' | 'expertise' | 'innovation' | 'security' | 'support' | 'scalability' | 'results' | 'collaboration' | 'flexibility' | 'portal' | 'phone' | 'email' | 'location' | 'check' | 'accessibility' | 'deployment' | 'documentation' | 'presentation' | 'computer' | 'team' | 'monitor';

interface AnimatedIconProps {
  type: IconType;
  size?: number;
  className?: string;
}

export function AnimatedIcon({ type, size = 40, className = '' }: AnimatedIconProps) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const containerVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  const rotateVariants = {
    animate: { rotate: 360 },
  };

  const pulseVariants = {
    animate: { opacity: [1, 0.6, 1] },
  };

  const bounceVariants = {
    animate: { y: [0, -4, 0] },
  };

  const floatVariants = {
    animate: { y: [0, -8, 0], x: [0, 2, 0] },
  };

  switch (type) {
    case 'rocket':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.g
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <path d="M22 16.13v-5.4c0-.59-.42-1.1-.98-1.22l-5.1-1.02c-.55-.11-1.1-.11-1.64 0l-5.1 1.02c-.56.12-.98.63-.98 1.22v5.4c0 .98.94 1.78 1.88 1.6 2.02-.4 3.97-.4 5.98 0 .94.18 1.88-.62 1.88-1.6Z" />
            <path d="M12 14.01v.01M7 13v1M17 13v1" />
            <path d="M15 2V.5m2 2.85 1.41 1.41M10 2V.5m-2 2.85-1.41 1.41" />
          </motion.g>
        </motion.svg>
      );

    case 'lock':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.g
            animate={{ rotateZ: [0, -2, 0, 2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </motion.g>
        </motion.svg>
      );

    case 'lightning':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'globe':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            animate={{ rotateZ: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
        </motion.svg>
      );

    case 'chart':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.g>
            <rect x="3" y="13" width="2" height="8" />
            <motion.rect
              x="9" y="5" width="2" height="16"
              animate={{ height: [16, 20, 16] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.rect
              x="15" y="9" width="2" height="12"
              animate={{ height: [12, 14, 12] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <path d="M3 21h18" />
          </motion.g>
        </motion.svg>
      );

    case 'handshake':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.g>
            <path d="M17 12h4l-4.586-4.586a2 2 0 0 0-2.828 0L12 11" />
            <path d="M7 12H3l4.586-4.586a2 2 0 0 1 2.828 0L12 11" />
            <motion.path
              d="M12 11v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3"
              animate={{ strokeDashoffset: [0, -8] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.path
              d="M12 11V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3"
              animate={{ strokeDashoffset: [0, -8] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.1 }}
            />
          </motion.g>
        </motion.svg>
      );

    case 'sun':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.circle
            cx="12"
            cy="12"
            r="5"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </motion.g>
        </motion.svg>
      );

    case 'moon':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
            animate={{ rotateZ: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'target':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.circle
            cx="12"
            cy="12"
            r="5"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        </motion.svg>
      );

    case 'star':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M12 2l2.9 7.5h7.9l-6.4 4.7 2.5 7.8-6.4-4.6-6.4 4.6 2.5-7.8-6.4-4.7h7.9Z"
            animate={{ rotateZ: [0, 10, 0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'diamond':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.polygon
            points="12 3 20 12 12 21 4 12"
            animate={{ rotateZ: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          <motion.line x1="12" y1="3" x2="12" y2="21" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <motion.line x1="4" y1="12" x2="20" y2="12" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </motion.svg>
      );

    case 'brain':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M9.5 2a2.5 2.5 0 0 1 5 0v1.5a.5.5 0 0 0 1 0V2a3.5 3.5 0 0 0-7 0v1.5a.5.5 0 0 0 1 0V2Z"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M12 2v1.5M9 5.5h6M9 8h6M9 10.5h6M12 13v1.5"
            animate={{ strokeDashoffset: [0, -4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.circle
            cx="12" cy="7" r="3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'integration':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.g>
            <circle cx="6" cy="6" r="2" />
            <circle cx="18" cy="6" r="2" />
            <circle cx="6" cy="18" r="2" />
            <circle cx="18" cy="18" r="2" />
            <motion.path
              d="M8 6h8M6 8v8M18 8v8M8 18h8"
              animate={{ strokeDashoffset: [0, -8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.g>
        </motion.svg>
      );

    case 'code':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.polyline
            points="16,18 22,12 16,6"
            animate={{ strokeDashoffset: [0, -6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.polyline
            points="8,6 2,12 8,18"
            animate={{ strokeDashoffset: [0, -6] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
        </motion.svg>
      );

    case 'graduation':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M22 10v6M2 10l10-5 10 5-10 5z"
            animate={{ y: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M6 12v5c3 3 9 3 12 0v-5"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'shield':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'expertise':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.circle
            cx="12" cy="8" r="4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M18 20a6 6 0 0 0-12 0"
            animate={{ strokeDashoffset: [0, -4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'innovation':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
            animate={{ rotateZ: [0, 5, 0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'security':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.rect
            x="3" y="11" width="18" height="11" rx="2" ry="2"
            animate={{ y: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="12" cy="16" r="1"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.path
            d="M7 11V7a5 5 0 0 1 10 0v4"
            animate={{ strokeDashoffset: [0, -4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'support':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.circle
            cx="12" cy="12" r="10"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
            animate={{ rotateZ: [0, 5, 0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M12 17l.01 0"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'scalability':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M3 6l3-3 3 3M3 6v12M3 18l3-3 3 3M21 6l-3-3-3 3M21 6v12M21 18l-3-3-3 3"
            animate={{ strokeDashoffset: [0, -8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M12 3v18"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'results':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.polyline
            points="23 6 13.5 15.5 8.5 10.5 1 18"
            animate={{ strokeDashoffset: [0, -12] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.polyline
            points="17 6 23 6 23 12"
            animate={{ strokeDashoffset: [0, -6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </motion.svg>
      );

    case 'collaboration':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.circle
            cx="18" cy="5" r="3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="6" cy="12" r="3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
          <motion.circle
            cx="18" cy="19" r="3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          />
          <motion.path
            d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'flexibility':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M21 12a9 9 0 1 1-6.219-8.56"
            animate={{ rotateZ: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M21 12a9 9 0 1 1-6.219-8.56"
            animate={{ rotateZ: [360, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.circle
            cx="12" cy="12" r="2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'portal':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.rect
            x="2" y="3" width="20" height="14" rx="2" ry="2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.line
            x1="8" y1="21" x2="16" y2="21"
            animate={{ strokeDashoffset: [0, -4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.line
            x1="12" y1="17" x2="12" y2="21"
            animate={{ strokeDashoffset: [0, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'phone':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'email':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
            animate={{ y: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.polyline
            points="22,6 12,13 2,6"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'location':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="12" cy="10" r="3"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'check':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.polyline
            points="20 6 9 17 4 12"
            animate={{ strokeDashoffset: [0, -12] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'accessibility':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.circle
            cx="16" cy="4" r="1"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M18 19V9a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v10"
            animate={{ strokeDashoffset: [0, -4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.path
            d="M5 14l4-4 4 4"
            animate={{ strokeDashoffset: [0, -6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'deployment':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.g>
            <circle cx="12" cy="12" r="3" />
            <motion.path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              animate={{ rotateZ: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
          </motion.g>
        </motion.svg>
      );

    case 'documentation':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            animate={{ y: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.polyline
            points="14,2 14,8 20,8"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.line
            x1="16" y1="13" x2="8" y2="13"
            animate={{ strokeDashoffset: [0, -4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.line
            x1="16" y1="17" x2="8" y2="17"
            animate={{ strokeDashoffset: [0, -4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          />
          <motion.polyline
            points="10,9 9,9 8,9"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'presentation':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.path
            d="M2 3h20M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3M7 21h10M9 8l2 2 4-4"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'computer':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.rect
            x="2" y="3" width="20" height="14" rx="2" ry="2"
            animate={{ y: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.line
            x1="8" y1="21" x2="16" y2="21"
            animate={{ strokeDashoffset: [0, -4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.line
            x1="12" y1="17" x2="12" y2="21"
            animate={{ strokeDashoffset: [0, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.svg>
      );

    case 'team':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.circle
            cx="9" cy="7" r="2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M4 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
            animate={{ strokeDashoffset: [0, -4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.circle
            cx="9" cy="7" r="4"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M16 3.13a4 4 0 0 1 0 7.75"
            animate={{ strokeDashoffset: [0, -4] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
          <motion.path
            d="M21 21v-2a4 4 0 0 0-3-3.85"
            animate={{ strokeDashoffset: [0, -4] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </motion.svg>
      );

    case 'monitor':
      return (
        <motion.svg
          {...commonProps}
          className={className}
          whileHover="hover"
          whileTap="tap"
          variants={containerVariants}
        >
          <motion.rect
            x="2" y="3" width="20" height="14" rx="2" ry="2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.line
            x1="8" y1="21" x2="16" y2="21"
            animate={{ strokeDashoffset: [0, -4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.line
            x1="12" y1="17" x2="12" y2="21"
            animate={{ strokeDashoffset: [0, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            cx="7" cy="8" r="1"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.circle
            cx="12" cy="8" r="1"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
          <motion.circle
            cx="17" cy="8" r="1"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
        </motion.svg>
      );

    default:
      return null;
  }
}

// Feature highlight icons mapping
export const featureIcons: Record<string, IconType> = {
  'Advanced Technology': 'rocket',
  'Enterprise Security': 'lock',
  'High Performance': 'lightning',
  'Global Scale': 'globe',
  'Real-time Analytics': 'chart',
  'Full Integration': 'handshake',
};

// System-specific emoticon mappings
export const systemEmoticonMap: Record<string, IconType> = {
  '💰': 'chart',
  '💊': 'chart',
  '🏥': 'globe',
  '🧬': 'chart',
  '👥': 'handshake',
  '📚': 'chart',
  '🎓': 'globe',
  '🧩': 'globe',
  '📖': 'chart',
  '⚠️': 'lock',
  '✅': 'chart',
  '🔮': 'globe',
  '🔌': 'lock',
};
