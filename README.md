# Sans Mercantile Constellation - Professional Constellation Website

A next-generation, animated, professional website showcasing the 21 autonomous systems of the Sans Mercantile constellation.

## Features

✨ **21 Dynamic System Pages** - Each system (Priv, KEL, Mezzo, Brigit, etc.) gets its own branded subdomain
✨ **Parent Hub Site** - Central navigation with systems gallery and web portal access
✨ **Smooth Animations** - Framer Motion for parallax, morphing, and UI transitions
✨ **Secure API Routes** - Environment-based API keys for LLM support (never exposed)
✨ **Knowledge Base** - Docs, FAQ, integration guides
✨ **Blog Integration** - LinkedIn company page sync ready
✨ **Login Portal** - Web app access for system dashboards
✨ **Dark Mode** - Professional luxury theme with light mode option
✨ **Deployment Ready** - GitHub Pages (static export) and Vercel (dynamic) support

## Tech Stack

- **Next.js 14** - React framework with API routes
- **TypeScript** - Type safety
- **Tailwind CSS** - Modern styling with luxury theme
- **Framer Motion** - Smooth animations and transitions
- **Next Themes** - Dark mode support
- **Axios** - HTTP client for API calls

## Project Structure

```
sansmercantile-nexus/
├── pages/
│   ├── index.tsx                 # Parent site homepage
│   ├── systems.tsx               # All 21 systems gallery
│   ├── [system]/
│   │   ├── index.tsx             # Dynamic system home page
│   │   ├── about.tsx             # About this system
│   │   ├── features.tsx          # System features
│   │   ├── pricing.tsx           # Pricing tiers
│   │   └── contact.tsx           # Contact form
│   ├── api/
│   │   ├── llm-support.ts        # LLM API (environment-secured)
│   │   ├── system-data.ts        # System data endpoints
│   │   └── linkedin-sync.ts      # Blog/content sync
│   ├── knowledge-base/
│   │   ├── docs/
│   │   ├── faq.tsx
│   │   └── blog.tsx
│   └── login.tsx                 # Portal login
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── animations/
│   │   ├── AnimatedText.tsx
│   │   ├── ParallaxSection.tsx
│   │   ├── MorphingCard.tsx
│   │   └── GlowEffect.tsx
│   ├── systems/
│   │   ├── SystemCard.tsx
│   │   ├── SystemHero.tsx
│   │   └── SystemGrid.tsx
│   └── forms/
│       ├── ContactForm.tsx
│       └── LoginForm.tsx
├── lib/
│   ├── api-client.ts             # Secure API calls
│   ├── system-data.ts            # System configurations
│   ├── animations.ts             # Reusable animations
│   └── constants.ts              # App constants
├── data/
│   └── systems.json              # All 21 systems metadata
├── styles/
│   └── globals.css               # Global styles
├── public/
│   └── faces/                    # System face images
└── .env.local                    # Environment variables (not committed)
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` to configure AWS Bedrock (the sole AI provider for this repo):

```bash
AWS_ACCESS_KEY_ID=your_aws_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
BEDROCK_MODEL=amazon.titan-text-express-v1
LINKEDIN_ACCESS_TOKEN=your_token_here
```

> AWS Bedrock is the core AI integration point for this repo (see `BEDROCK_SETUP.md`).

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## AWS Bedrock Setup

This repository uses AWS Bedrock for all AI/LLM work (see `BEDROCK_SETUP.md`).

1. Create an IAM user/role with `bedrock:InvokeModel` permission for your model.

2. Set the environment variables:

```powershell
$env:AWS_ACCESS_KEY_ID="your_aws_key_id"
$env:AWS_SECRET_ACCESS_KEY="your_aws_secret"
$env:AWS_REGION="us-east-1"
$env:BEDROCK_MODEL="amazon.titan-text-express-v1"
```

3. Test the proxy endpoint:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/bedrock `
  -ContentType 'application/json' `
  -Body '{"prompt":"Hello Bedrock"}'
```

## Deployment

### GitHub Pages (Static Export)

```bash
npm run build
# Outputs to ./out folder
# Push ./out to GitHub Pages branch
```

### Vercel (Recommended - Free Tier)

```bash
npm run build-vercel
vercel deploy
```

Set up subdomains in Vercel dashboard:
- `priv.sansmercantile.com`
- `kel.sansmercantile.com`
- `mezzo.sansmercantile.com`
- etc.

## System Configuration

All 21 systems are defined in `data/systems.json`:

```json
{
  "priv": {
    "name": "Priv",
    "subtitle": "Wealth Intelligence",
    "color": "#d4af37",
    "face": "Sans- Zajuma Priv.png",
    "vision": "...",
    "mission": "...",
    "values": ["...", "..."],
    "features": ["..."],
    "pricing": [{tier: "Starter", price: "..."}]
  }
}
```

## API Routes (Secure)

All API keys are stored in `.env.local` and never exposed to the client.

### LLM Support Endpoint

**Endpoint:** `POST /api/llm-support`

```javascript
// Client-side call (safe - key is on server)
const response = await fetch('/api/llm-support', {
  method: 'POST',
  body: JSON.stringify({
    messages: [{role: 'user', content: 'Hello'}],
    system: 'You are a customer support agent for System X'
  })
});
```

The API key never leaves the server. ✅ Secure.

## Animations & Motion

Uses Framer Motion for:
- Parallax scrolling
- Text morphing effects
- Card hover animations
- Page transitions
- Staggered list items
- Scroll-triggered animations

## Dark Mode

Powered by `next-themes`:

```tsx
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />;
}
```

## Customization

### System Colors

Edit `tailwind.config.ts`:
```ts
colors: {
  'priv-primary': '#d4af37',
  'kel-primary': '#8b6914',
  // ... etc
}
```

### Animations

Edit `tailwind.config.ts` keyframes section.

## Performance

- ✅ Image optimization with Next.js Image component
- ✅ Code splitting per page
- ✅ CSS purging (Tailwind)
- ✅ API route compression
- ✅ Lazy loading components

## SEO

- ✅ Meta tags per system page
- ✅ Sitemap generation
- ✅ Open Graph tags
- ✅ Structured data (JSON-LD)

## Security

- ✅ No API keys in source code (environment variables only)
- ✅ API calls proxied through Next.js (client never sees keys)
- ✅ CORS configured per domain
- ✅ Rate limiting recommended for production

## Support

For issues or improvements, contact the development team.

---

**Deployed at:** https://sansmercantile.com (parent) + subdomains for each system
**Maintained By:** Sans Mercantile™ - Constellation Division
**Last Updated:** March 16, 2026
