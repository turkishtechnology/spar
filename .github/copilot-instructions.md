# Glide - Headless UI Library

## Context

You're developing headless React components with TypeScript. Focus on behavior-only primitives with zero styling opinions.

## Core Rules

- **Headless Only**: No styling, CSS imports, or visual opinions
- **Accessibility First**: WCAG 2.2 AA compliant with full keyboard support
- **TypeScript Strict**: Explicit types, no `any`, strict mode
- **Tree-Shakeable**: Named exports, zero side effects
- **Compound Pattern**: Granular parts (Root, Trigger, Content) for composition

## Tech Stack

- **Core**: React, TypeScript
- **Build**: Rspack (bundler), Turborepo (monorepo), pnpm workspaces
- **Testing**: Jest + React Testing Library
- **Standards**: TypeScript strict mode, ESLint, Prettier

## Workflow Rules

1. **Task Scope**: Execute EXACTLY what's requested - no more, no less
2. **File Strategy**: ALWAYS prefer editing existing files over creating new ones
3. **Documentation**: Only create .md files when explicitly requested
4. **Testing**: Run tests after changes. Components need unit, a11y, and integration tests
5. **Conventions**: Match existing patterns. Check neighboring files for context

## Task-Specific Instructions

Based on your task, follow these focused guidelines in the .github/instructions folder:

### Component Development Helper

[//]: # '→ `/headless-guidelines.instructions.md`'

### Accessibility Implementation

→ `./accessibility-guidelines.instructions.md`

### Test Creation

'→ `/testing-guidelines.instructions.md`'

### Documentation

[//]: # '→ `/docs-guidelines.instructions.md`'

## Component Structure

```
packages/glide/src/components/{Component}/
├── {Component}.tsx          # Core logic + accessibility
├── {Component}.types.ts     # TypeScript definitions
├── {Component}.test.tsx     # Unit tests
├── {Component}.a11y.test.tsx # Accessibility tests
└── index.ts                 # Named exports
```

## Key Commands

- `pnpm install` - Install deps
- `pnpm test` - Run all tests
- `pnpm build` - Build package
- `pnpm lint` - Check code quality

## Remembers

- ALWAYS scope changes to the exact task; do not add extras
- ALWAYS edit related files; do not create new files unless requested
- ALWAYS match existing patterns and public API; preserve backwards compatibility
- ALWAYS use TypeScript strict, explicit public types, named exports, zero side effects
- ALWAYS use PNPM for package management.
- ALWAYS read referenced instruction files BEFORE starting.
- ALWAYS keep components UNSTYLED by design.
- NEVER introduce styling/opinions; never modify docs unless asked; follow guideline files
