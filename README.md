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

Edit `.env.local` if needed to configure your local Gemma endpoint:

```bash
NEXT_PUBLIC_GEMMA_HOST=http://localhost:11434
NEXT_PUBLIC_GEMMA_MODEL=gemma4:2b
LINKEDIN_ACCESS_TOKEN=your_token_here
```

> The local model endpoint is the core BYOM integration point for this repo.

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Local Gemma 4 BYOM Setup

This repository is configured to use a local Gemma 4 instance for AI/LLM work.

1. Install Ollama on Windows:

```powershell
winget install --id Ollama.Ollama -e --silent --accept-package-agreements --accept-source-agreements
```

2. Run the local model:

```powershell
ollama run gemma4:2b
```

3. In VS Code, install the AI Toolkit / GitHub Copilot extensions and choose the custom local model option.

4. Point the local endpoint to:

```text
http://localhost:11434
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
