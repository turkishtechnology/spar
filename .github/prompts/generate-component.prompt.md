---
mode: agent
model: Claude Sonnet 4 (copilot)
description: Generate headless component implementation (logic only - no tests, no docs)
---

# Generate Component Logic

Create the core implementation for **${input:ComponentName}** component.

## Prerequisites

Check that `.github/instructions/components/${component-name}.md` exists.
If not, ask the user to run `.github/prompts/create-component-instructions.prompt.md` first.
IMPORTANT: ALWAYS read `.github/instructions/coding-standards.instructions.md` for general coding guidelines.

## Task Scope - LOGIC ONLY

Generate ONLY the component implementation. DO NOT run tests or create test files.

### Files to Create

**For Simple Components:**
```
packages/glide/src/components/${ComponentName}/
├── ${ComponentName}.tsx    # Core component logic
├── types.ts                # TypeScript interfaces
└── index.ts                # Barrel exports
```

**For Compound Components:**
```
packages/glide/src/components/${ComponentName}/
├── ${ComponentName}.tsx        # Root component
├── ${ComponentName}Item.tsx    # Child parts (if applicable)
├── ${ComponentName}Trigger.tsx # Interactive parts (if applicable)
├── ${ComponentName}Content.tsx # Content parts (if applicable)
├── types.ts                    # Shared TypeScript interfaces
└── index.ts                    # Compound exports with dot notation
```

**CRITICAL**: Each logical component part MUST be in its own file for maintainability, tree-shaking, and consistency.

### Implementation Requirements

- Follow component specific instructions in `.github/instructions/components/${component-name}.md`
- Compound component pattern if applicable
- Controlled/uncontrolled support
- Ref forwarding support
- Props spreading (className, style, data-_, aria-_)
- NO styling, NO CSS imports
- NO default ARIA (will be added in accessibility phase)
- NO test files (tests will be generated in a separate phase)

### Export Patterns

For compound components, use the dual export pattern to support both usage styles:

```typescript
// index.ts
import { Accordion } from './Accordion';
import { AccordionItem } from './AccordionItem';
import { AccordionTrigger } from './AccordionTrigger';
import { AccordionContent } from './AccordionContent';

// Create aliases for grouped pattern
const Root = Accordion;
const Item = AccordionItem;
const Trigger = AccordionTrigger;
const Content = AccordionContent;

// Export both patterns
export {
  // Named exports (tree-shakeable)
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,

  // Aliased exports (for grouped usage)
  Root,
  Item,
  Trigger,
  Content,
};

// Export types
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './types';
```

## Success Criteria

- Component builds without errors
- TypeScript strict mode passes (run type checking using `pnpm check-types`)
- ESLint passes (run `pnpm lint` to verify)
- Exports are tree-shakeable
- DO NOT run `pnpm test` (tests will be created separately)
