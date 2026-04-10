---
description: "Use when writing or editing React components in TypeScript. Covers component patterns, Tailwind styling, Uniqcall futuristic theme, props typing, and shadcn/ui usage."
applyTo: ["apps/web/**/*.tsx", "packages/ui/**/*.tsx"]
---

# React Component Guidelines (Web)

- Use `"use client"` directive only when the component uses hooks, event handlers, or browser APIs
- Props interface named `{ComponentName}Props`
- Use shadcn/ui primitives when available (`Button`, `Card`, `Dialog`, `Table`, etc.)
- Tailwind only — never inline styles
- Dark theme classes: `bg-[#0A0E27]`, `text-white`, `border-purple-500/30`
- Neon glow: `shadow-[0_0_15px_rgba(139,92,246,0.3)]`
- Glassmorphism: `bg-white/5 backdrop-blur-xl border border-white/10`
- Use `cn()` utility from `@/lib/utils` for conditional classes
