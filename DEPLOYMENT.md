# Uniqcall Education — Deployment Guide

Complete guide for deploying the Uniqcall Education platform to production.

| Component | Target | URL |
|-----------|--------|-----|
| Web (Next.js) | Render | `https://uniqcall-web.onrender.com` |
| Mobile (Expo) | EAS Build | Google Play (internal track) |
| Database | Supabase | `https://your-project.supabase.co` |

---

## A. Prerequisites

Before deploying, ensure you have:

- **Node.js 20+** and **npm 10+** installed
- **Git** configured with access to the repository
- **Supabase CLI** installed: `npm install -g supabase`
- **EAS CLI** installed: `npm install -g eas-cli`
- **Render CLI** installed (optional): `npm install -g @render-cli/cli`
- Repository pushed to **GitHub**

Verify installations:

```bash
node --version    # v20.x+
npm --version     # 10.x+
supabase --version
eas --version
```

---

## B. Supabase Setup

### 1. Create Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Select **Southeast Asia (Singapore)** region for lowest latency to Indonesia
3. Set a strong database password and save it securely
4. Wait for the project to finish provisioning

### 2. Get Credentials

From your Supabase project dashboard → **Settings → API**:

| Key | Where to Find |
|-----|---------------|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_ANON_KEY` | `anon` / `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (keep secret!) |

### 3. Run Migrations

```bash
# Link to your remote project
supabase link --project-ref your-project-ref

# Push all migrations
supabase db push
```

Migrations are in `packages/supabase/migrations/`:
- `00001_initial_schema.sql` — Tables, RLS policies, indexes
- `00002_seed_data.sql` — Seed data (archetypes, badges, etc.)

### 4. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials (Web application type)
3. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
4. In Supabase Dashboard → **Authentication → Providers → Google**:
   - Enable Google provider
   - Paste Client ID and Client Secret
5. Configure redirect URLs in Supabase → **Authentication → URL Configuration**:
   - Site URL: `https://uniqcall-web.onrender.com`
   - Redirect URLs:
     - `https://uniqcall-web.onrender.com/auth/callback`
     - `uniqcall://auth/callback` (for mobile deep linking)

---

## C. Web Deployment (Render)

### Option 1: Blueprint (Recommended)

The repository includes a `render.yaml` blueprint for automated setup.

1. Push your code to GitHub (`main` branch)
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New → Blueprint**
4. Connect your GitHub repository
5. Render will detect `render.yaml` and create the service
6. Set environment variables when prompted:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_APP_URL` | `https://uniqcall-web.onrender.com` |

7. Click **Apply** to deploy

### Option 2: Manual Setup

1. Go to Render Dashboard → **New → Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `uniqcall-web`
   - **Region:** Singapore
   - **Branch:** `main`
   - **Build Command:** `npm install && npx turbo build --filter=web`
   - **Start Command:** `npm run start --workspace=apps/web`
   - **Plan:** Starter
4. Add environment variables (same as above)
5. Click **Create Web Service**

### Option 3: Docker

The repository includes a `Dockerfile` for containerized deployment.

1. In Render, select **Docker** as the runtime instead of Node
2. Render will auto-detect the `Dockerfile`
3. Set the same environment variables
4. Deploy

### Verify Web Deployment

```bash
# Check service status (if using Render CLI)
render services list

# View logs
render logs --service uniqcall-web

# Or simply visit
curl https://uniqcall-web.onrender.com
```

---

## D. Mobile Build (EAS)

### 1. Login to EAS

```bash
eas login
```

### 2. Set Secrets

Set environment variables as EAS secrets (so they're not committed to code):

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key"
```

### 3. Build Preview APK (Android)

```bash
cd apps/mobile
eas build --platform android --profile preview
```

This creates a standalone `.apk` file you can install directly on Android devices for testing.

### 4. Build Production (Android)

```bash
eas build --platform android --profile production
```

This creates an `.aab` (Android App Bundle) for Google Play submission.

### 5. Submit to Google Play

```bash
eas submit --platform android --profile production
```

Requires a `google-services.json` service account key file in `apps/mobile/`.

### 6. OTA Updates

Push updates without rebuilding the app:

```bash
eas update --branch preview --message "Description of changes"
```

### Check Build Status

```bash
eas build:list
```

---

## E. Environment Variables Checklist

### Web (Render)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | Set to `production` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of the web app |

### Mobile (EAS Secrets)

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |

### Local Development

Copy from templates:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
```

Fill in your Supabase credentials from the dashboard.

---

## F. Post-Deploy Verification

After deployment, run through this checklist:

### Web App

- [ ] Web app loads at Render URL (`https://uniqcall-web.onrender.com`)
- [ ] Login page renders correctly
- [ ] Google OAuth login redirects to Google and back
- [ ] After login, correct dashboard loads (teacher/parent/admin)
- [ ] Supabase data loads (student lists, assessments, etc.)
- [ ] No console errors in browser DevTools

### Mobile App

- [ ] APK installs on Android device / emulator
- [ ] App launches and shows login screen
- [ ] Google OAuth login works via deep link (`uniqcall://auth/callback`)
- [ ] Student dashboard loads after login
- [ ] Assessment flow completes without errors
- [ ] Archetype result displays correctly

### Database

- [ ] All migrations applied (`supabase db push` shows no pending)
- [ ] RLS policies are active (test unauthorized access returns 403)
- [ ] Seed data present (archetypes, badges, VARK questions)

---

## G. CI/CD (Future)

GitHub Actions workflow for automated deployment is planned for Phase 2. The pipeline will:

1. Run tests on pull requests
2. Type-check with `tsc --noEmit`
3. Build web app
4. Deploy to Render on merge to `main`
5. Trigger EAS build for tagged releases

---

## H. Troubleshooting

### Render build fails

```bash
# Test build locally first
npm install
npx turbo build --filter=web
```

Common issues:
- Missing environment variables → Check Render dashboard
- TypeScript errors → Run `npx tsc --noEmit` locally
- Dependency issues → Delete `node_modules` and `npm install` again

### EAS build fails

```bash
# Check build logs
eas build:list
eas build:view <build-id>
```

Common issues:
- Missing `app.json` fields → Ensure `android.package` is set
- Native dependency issues → Check Expo SDK compatibility
- Secrets not set → Verify with `eas secret:list`

### Supabase connection fails

- Verify URL and keys are correct (no trailing slashes)
- Check RLS policies aren't blocking authenticated requests
- Ensure the Supabase project is not paused (free tier pauses after inactivity)

### Google OAuth not working

- Verify redirect URIs match exactly in Google Cloud Console
- Check Supabase Auth provider configuration
- Ensure `uniqcall://` scheme is registered in `app.json` for mobile
