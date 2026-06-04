# Echoes of Yesterday

**မနေ့ကရဲ့ ပဲ့တင်သံ** — A vintage/retro web archive showcasing Myanmar's cultural history through images, timelines, and interactive comparisons.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Internationalization**: next-intl (Myanmar, English, Chinese, German)
- **Styling**: Tailwind CSS with custom vintage theme
- **Animations**: Framer Motion
- **State Management**: Zustand
- **AI Integration**: Google Gemini (image analysis)
- **Image Comparison**: react-compare-slider

## Project Structure

```
├── app/
│   ├── [locale]/              # Localized routes
│   │   ├── archive/           # Archive browsing
│   │   ├── compare/           # Before/after comparison
│   │   ├── image/[id]/       # Individual image details
│   │   ├── scrapbook/        # Personal collection
│   │   ├── submit/           # Submit new images
│   │   └── timeline/         # Historical timeline
│   ├── api/
│   │   └── analyze-image/     # AI image analysis endpoint
│   ├── layout.tsx             # Root layout
│   └── not-found.tsx          # 404 page
├── components/
│   ├── motion/                # Framer Motion wrappers
│   ├── providers/             # Context providers
│   └── *.tsx                  # Feature components
├── lib/
│   ├── stores/                # Zustand stores
│   │   ├── useCommentStore.ts
│   │   ├── useFilterStore.ts
│   │   ├── useScrapbookStore.ts
│   │   └── useSepiaStore.ts
│   ├── data.ts                # Sample data
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
├── messages/                  # i18n translation files
└── public/                   # Static assets
```

## Features

- **Archive**: Browse historical Myanmar images with filtering by era/decade
- **Timeline**: Explore history through an interactive timeline
- **Image Comparison**: Side-by-side before/after comparison with sepia toggle
- **AI Analysis**: Upload images for AI-powered historical context analysis
- **Scrapbook**: Save favorite images to personal collection
- **i18n**: Full support for Myanmar, English, Chinese, and German

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Then edit .env.local with your API keys

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key for image analysis |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## License

Private — All rights reserved