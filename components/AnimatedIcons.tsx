import React from 'react';
import { motion } from 'framer-motion';

export type IconType = 'rocket' | 'lock' | 'lightning' | 'globe' | 'chart' | 'handshake' | 'sun' | 'moon' | 'target' | 'star' | 'diamond';

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
