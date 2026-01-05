# Spar - Headless UI Library

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

1. **Task Scope**: Execute EXACTLY what's requested - no more, no less. Stay within the defined scope
2. **File Strategy**: ALWAYS prefer editing existing files over creating new ones
3. **Documentation**: Only create .md files when explicitly requested
4. **Testing**: Tests are created in a separate phase after component logic is complete
5. **Conventions**: Match existing patterns. Check neighboring files for context
6. **Package Management**: Use `pnpm dlx` instead of `npx` for running packages

## Task-Specific Instructions

Based on your task, follow these focused guidelines in the .github/instructions folder:

### Component Development Helper

[//]: # '→ `/headless-guidelines.instructions.md`'

### Accessibility Implementation

→ `./accessibility-guidelines.instructions.md`

### Test Creation

→ `/testing-guidelines.instructions.md`

### Documentation

[//]: # '→ `/docs-guidelines.instructions.md`'

## Component Structure

### Simple Components
```
packages/spar/src/components/{Component}/
├── {Component}.tsx          # Core component logic + accessibility
├── types.ts                 # TypeScript definitions (shared across component parts)
├── __tests__/
│   ├── {Component}.test.tsx     # Unit tests
│   ├── {Component}.a11y.test.tsx # Accessibility tests
│   └── {Component}.integration.test.tsx # Integration tests
└── index.ts                 # Named exports
```

### Compound Components
```
packages/spar/src/components/{Component}/
├── {Component}.tsx          # Root component (e.g., Accordion)
├── {Component}Item.tsx      # Child component parts (e.g., AccordionItem)
├── {Component}Trigger.tsx   # Interactive parts (e.g., AccordionTrigger)
├── {Component}Content.tsx   # Content parts (e.g., AccordionContent)
├── {Component}Header.tsx    # Additional parts as needed
├── types.ts                 # Shared TypeScript definitions
├── __tests__/
│   ├── {Component}.test.tsx     # Unit tests
│   ├── {Component}.a11y.test.tsx # Accessibility tests
│   └── {Component}.integration.test.tsx # Integration tests
└── index.ts                 # Compound exports with dot notation
```

**Rule**: Each logical component part gets its own file. Never mix multiple component definitions in a single file.

## Key Commands

- `pnpm install` - Install deps
- `pnpm test` - Run all tests (only after test files exist)
- `pnpm build` - Build package
- `pnpm lint` - Check code quality (run after creating/editing components)
- `pnpm lint:fix` - Auto-fix linting issues (use when lint errors need fixing)
- `pnpm check-types` - Verify TypeScript types
- `pnpm dlx <package>` - Execute package (instead of npx)

## Remembers

- ALWAYS scope changes to the exact task; do not add extras or exceed requested scope
- ALWAYS edit related files; do not create new files unless requested
- ALWAYS match existing patterns and public API; preserve backwards compatibility
- ALWAYS use TypeScript strict, explicit public types, named exports, zero side effects
- ALWAYS use PNPM for package management (pnpm dlx instead of npx)
- ALWAYS read referenced instruction files BEFORE starting
- ALWAYS keep components UNSTYLED by design
- ALWAYS run `pnpm lint` after creating/modifying components
- ALWAYS use `pnpm lint:fix` to auto-fix linting issues when errors occur
- NEVER introduce styling/opinions; never modify docs unless asked; follow guideline files
- NEVER run tests during component creation phase (tests are created separately)
