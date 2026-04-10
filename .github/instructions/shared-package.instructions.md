---
description: "Use when writing Zod validators, shared types, utility functions, or constants in the shared package. Covers type conventions, validator patterns, and archetype/VARK data structures."
applyTo: "packages/shared/**/*.ts"
---

# Shared Package Guidelines

- All types use `import type` when imported elsewhere
- Zod schemas are the source of truth — derive types with `z.infer<typeof schema>`
- Export everything as named exports
- Validators in `validators/` directory
- Types in `types/` directory  
- Utils in `utils/` directory
- Constants in `constants/` directory (archetype definitions, badge definitions, VARK config)
- Keep dependencies minimal (only Zod)
- Every function must be pure (no side effects) for cross-platform use
