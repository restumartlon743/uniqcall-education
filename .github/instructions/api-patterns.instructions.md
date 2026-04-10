---
description: "Use when writing API routes, server actions, or backend endpoint logic. Covers Next.js App Router API patterns, Zod validation, auth checks, and error handling."
applyTo: ["apps/web/app/api/**/*.ts", "apps/web/app/**/actions.ts"]
---

# API & Server Action Guidelines

- Always check auth first: `supabase.auth.getUser()`
- Return 401 for unauthenticated, 403 for unauthorized
- Validate all input with Zod: `schema.safeParse(body)`
- Return 400 with `error.flatten()` for validation failures
- Consistent response shape: `{ data }` or `{ error }` 
- Use `NextResponse.json()` for API routes
- Use `createClient` from `@/lib/supabase/server` (not browser client)
- Server actions must have `'use server'` at the top
- Call `revalidatePath()` after mutations in server actions
- Never expose `SUPABASE_SERVICE_ROLE_KEY` on client-side
