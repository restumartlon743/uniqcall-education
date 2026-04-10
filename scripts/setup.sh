#!/bin/bash
echo "🚀 Uniqcall Education — Setup"
echo "=============================="

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm required"; exit 1; }

echo "✅ Node.js $(node --version)"
echo "✅ npm $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Copy env files
echo ""
echo "📝 Setting up environment files..."

if [ ! -f .env ]; then
  cp .env.example .env
  echo "   Created .env from template — please fill in your values"
else
  echo "   .env already exists — skipping"
fi

if [ ! -f apps/web/.env.local ]; then
  cp apps/web/.env.example apps/web/.env.local
  echo "   Created apps/web/.env.local from template"
else
  echo "   apps/web/.env.local already exists — skipping"
fi

if [ ! -f apps/mobile/.env ]; then
  cp apps/mobile/.env.example apps/mobile/.env
  echo "   Created apps/mobile/.env from template"
else
  echo "   apps/mobile/.env already exists — skipping"
fi

# Build shared packages
echo ""
echo "🔧 Building shared packages..."
npx turbo build --filter=shared

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Fill in .env files with your Supabase credentials"
echo "  2. Run 'supabase start' for local database"
echo "  3. Run 'supabase db push' to apply migrations"
echo "  4. Run 'npm run dev --workspace=apps/web' for web"
echo "  5. Run 'npm run dev --workspace=apps/mobile' for mobile"
