# Uniqcall Education — Project Guidelines

## Project Overview
Uniqcall Education is a personalized education ecosystem platform ("Sistem Navigasi Masa Depan Siswa"). See [PRD.md](../../PRD.md) for full spec.

## Tech Stack
- **Web**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts, Zustand, React Hook Form + Zod, TanStack Query
- **Mobile**: React Native Expo (SDK 52+), Expo Router, NativeWind, react-native-svg, React Native Reanimated, Lottie
- **Backend/DB**: Supabase (PostgreSQL, Auth, Realtime, Storage, Edge Functions)
- **Auth**: Google OAuth via Supabase Auth
- **Monorepo**: Turborepo with shared packages
- **Deployment**: Render (web), EAS Build (mobile)

## Architecture
Monorepo structure:
- `apps/web/` — Next.js website (Teacher, Parent, Admin dashboards)
- `apps/mobile/` — React Native Expo app (Student dashboard)
- `packages/shared/` — Shared types, utils, validators, constants
- `packages/supabase/` — Migrations, seed data, edge functions, config
- `packages/ui/` — Shared UI components (optional)

## Code Style
- TypeScript strict mode everywhere
- Use `import type` for type-only imports
- Prefer named exports over default exports
- Use Zod schemas for all validation (shared in `packages/shared/validators/`)
- Use server actions and API routes in Next.js (not pages API)
- Tailwind CSS classes — never inline styles
- Components: PascalCase files, one component per file
- Hooks: `use` prefix, in `hooks/` directory
- Utils: camelCase, in `lib/` or `utils/` directory

## Database Conventions
- Supabase CLI for all migrations (`supabase migration new <name>`)
- Table names: snake_case, plural
- Column names: snake_case
- Always add RLS policies on new tables
- Use `gen_random_uuid()` for primary keys
- Always add `created_at TIMESTAMPTZ DEFAULT now()`
- Foreign keys with explicit references

## Testing
- Unit tests: Vitest
- Component tests: React Testing Library
- E2E/UI tests: Playwright
- Test files: `*.test.ts` or `*.test.tsx` next to source
- Minimum coverage goal: 80% for shared packages

## Commit Messages
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- Reference PRD section when applicable

## Build & Run Commands
```bash
# Install all dependencies
npm install

# Run web dev server
npm run dev --workspace=apps/web

# Run mobile dev server  
npm run dev --workspace=apps/mobile

# Run all tests
npm test

# Supabase local
supabase start
supabase db push

# Deploy web to Render
render deploy

# Build mobile
eas build --platform android --profile preview
```

## UI Theme
- Dark futuristic theme: deep navy background, electric purple/cyan accents, neon glow effects
- See PRD.md Section 18 for full design guidelines
- Reference dashboard images in project root for visual fidelity
