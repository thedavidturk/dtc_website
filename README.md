# DT+C — David Turk Creative

A premium, one-scroll agency positioning website built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and React Three Fiber.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion
- **3D Graphics**: React Three Fiber + drei
- **Fonts**: Geist Sans & Geist Mono

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd dtc_website

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
dtc_website/
├── app/
│   ├── globals.css      # Global styles and CSS variables
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main page component
├── components/
│   ├── Navbar.tsx       # Fixed navigation with mobile menu
│   ├── ScrollProgress.tsx # Scroll progress indicator
│   ├── Hero.tsx         # Hero section with 3D background
│   ├── CreativeEngine.tsx # Three.js 3D scene
│   ├── Pillars.tsx      # Capabilities/services section
│   ├── Process.tsx      # How we work section
│   ├── Proof.tsx        # Social proof and case studies
│   ├── Fit.tsx          # Fit qualification section
│   ├── CTA.tsx          # Call-to-action section
│   ├── Footer.tsx       # Site footer
│   └── ContactModal.tsx # Contact form modal
├── data/
│   └── siteContent.ts   # ALL site copy in one file
└── public/
    ├── logos/           # Client logo placeholders
    └── work/            # Portfolio thumbnails
```

## Editing Content

**All marketing copy is centralized in `/data/siteContent.ts`.**

This file contains:
- Meta information (title, description, OG tags)
- Navigation links and CTAs
- Hero section copy
- All pillar/capability descriptions
- Process steps
- Case studies and proof points
- Fit qualification criteria
- Footer content
- Contact form labels

To edit any text on the site:

1. Open `/data/siteContent.ts`
2. Find the relevant section
3. Update the text
4. Save — changes appear immediately in dev mode

### Example: Changing the Hero Headline

```typescript
// In /data/siteContent.ts
hero: {
  headline: "Your New Headline Here",
  subhead: "Your new subheadline...",
  // ...
}
```

### Adding Client Logos

1. Add SVG files to `/public/logos/`
2. Update the `trustedBy.logos` array in `siteContent.ts`

### Adding Portfolio Items

1. Add images to `/public/work/`
2. Update the `workGallery.items` array in `siteContent.ts`

## Performance Features

- **Lazy-loaded 3D**: The Three.js scene loads dynamically
- **Offscreen pause**: 3D rendering pauses when not visible
- **Mobile fallback**: Gradient background on mobile/low-power devices
- **Reduced motion**: Respects `prefers-reduced-motion` preference
- **Optimized fonts**: Geist fonts loaded via `next/font`

## SEO Features

- Full meta tags (title, description)
- OpenGraph tags for social sharing
- Twitter card support
- Schema.org structured data (ProfessionalService)
- Semantic HTML structure

## Accessibility

- Semantic HTML elements
- Keyboard navigation support
- Focus states on interactive elements
- Escape key closes modals
- Reduced motion support

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Deploy to Vercel

The easiest deployment option:

1. Push to GitHub
2. Connect to Vercel
3. Deploy

## Next Improvements

### Priority 1: Production Ready
- [ ] Connect contact form to backend (Resend, SendGrid, or serverless function)
- [ ] Add real client logos to `/public/logos/`
- [ ] Add portfolio images to `/public/work/`
- [ ] Create OG image at `/public/og-image.jpg` (1200x630)
- [ ] Update Calendly link in `siteContent.ts`

### Priority 2: Analytics & Tracking
- [ ] Add Vercel Analytics or Plausible
- [ ] Set up Google Search Console
- [ ] Add conversion tracking for CTA clicks
- [ ] Configure cookie consent if needed (EU)

### Priority 3: CMS Integration
- [ ] Consider Sanity, Contentful, or Notion for non-technical editing
- [ ] Move `siteContent.ts` to CMS
- [ ] Enable preview mode for drafts

### Priority 4: Enhancements
- [ ] Add page transitions between sections
- [ ] Create a dedicated `/work` page with full case studies
- [ ] Add blog/insights section
- [ ] Implement dark/light mode toggle (currently dark only)

## License

Private — David Turk Creative
