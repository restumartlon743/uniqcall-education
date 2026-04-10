---
description: "Use when writing test files: Vitest unit tests, React Testing Library component tests, Playwright E2E tests. Covers test naming, patterns, and assertion conventions."
applyTo: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"]
---

# Test File Guidelines

- Test file lives next to source: `component.tsx` → `component.test.tsx`
- Use `describe` for grouping, `it` for cases (not `test`)
- Test names: `it('should [expected behavior] when [condition]')`
- Unit tests: Vitest — test pure functions, validators, classifiers
- Component tests: React Testing Library — test rendering, interactions, accessibility
- E2E tests: Playwright — test full user flows
- Mock Supabase client for unit/component tests
- Never test implementation details — test behavior
- Minimum: happy path + one error case + one edge case per function
