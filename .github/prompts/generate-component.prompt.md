---
mode: agent
model: claude-4.1-opus
description: Generate headless component implementation (logic only - no tests, no docs)
---

# Generate Component Logic

Create the core implementation for **${input:ComponentName:Button}** component.

## Prerequisites

Check that `.github/instructions/components/${ComponentName}.md` exists.
If not, ask the user to run `.github/prompts/create-component-instructions.prompt.md` first.

## Task Scope - LOGIC ONLY

Generate ONLY the component implementation:

### Files to Create

```
packages/glide/src/components/${ComponentName}/
├── ${ComponentName}.tsx    # Core component logic
├── types.ts                # TypeScript interfaces
└── index.ts                # Barrel exports
```

### Implementation Requirements

- Follow component specific instructions in `.github/instructions/components/${ComponentName}.md`
- Compound component pattern if applicable
- Controlled/uncontrolled support
- Ref forwarding with forwardRef
- Props spreading (className, style, data-_, aria-_)
- NO styling, NO CSS imports
- NO default ARIA (will be added in accessibility phase)

## Success Criteria

- Component builds without errors
- TypeScript strict mode passes
- Exports are tree-shakeable
