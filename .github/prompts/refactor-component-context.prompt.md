---
agent: Edit
description: Refactor component Context to hooks/ folder following hybrid pattern
---

# Refactor Component Context to hooks/ Folder

Refactor the **${input:ComponentName:Dialog}** component's Context to follow the hybrid pattern.

## Objective

Move Context and Context Hook to a dedicated `hooks/` folder:
- ✅ Extract Context + Hook to `hooks/useComponentContext.ts`
- ✅ If `useComponent.ts` hook exists, move it to `hooks/`
- ❌ DO NOT create new `useComponent.ts` if it doesn't exist
- ❌ DO NOT extract business logic from component to a new hook

## Rules

### 1. Context Migration (ALWAYS)

Create `hooks/` folder if it doesn't exist, then create `hooks/useComponentContext.ts`:

```typescript
import { createContext, useContext } from 'react';
import type { ComponentContextValue } from '../types';

export const ComponentContext = createContext<ComponentContextValue | null>(null);

export const useComponentContext = () => {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error('Component parts must be used within Component');
  }
  return context;
};
```

Create `hooks/index.ts` for re-exports:

```typescript
export { ComponentContext, useComponentContext } from './useComponentContext';
```

### 2. Existing Hook Migration (CONDITIONAL)

**IF** a `useComponent.ts` hook exists (e.g., `usePopover`, `useTooltip`):
- **THEN** move it to `hooks/useComponent.ts`
- Update `hooks/index.ts` to export it

**ELSE** do nothing (don't create new hooks)

### 3. Update Imports

- Root component: `import { ComponentContext } from './hooks'`
- Child components: `import { useComponentContext } from './hooks'`
- Public exports in `index.ts`: Add `useComponentContext` export

### 4. Preserve Everything

- Keep all business logic in root component
- Keep all props, types, behaviors unchanged
- Maintain backwards compatibility
- Do NOT add/remove functionality

## Expected Structure

### Simple Component (no existing hook)

```
Component/
├── hooks/
│   ├── useComponentContext.ts   ✅ NEW
│   └── index.ts                 ✅ NEW
├── Component.tsx                ✅ UPDATED (import from hooks)
├── ComponentChild.tsx           ✅ UPDATED (import from hooks)
├── types.ts
└── index.ts                     ✅ UPDATED (export useComponentContext)
```

### Complex Component (has existing useComponent hook)

```
Component/
├── hooks/
│   ├── useComponentContext.ts   ✅ NEW
│   ├── useComponent.ts          ✅ MOVED (if exists)
│   └── index.ts                 ✅ NEW
├── Component.tsx                ✅ UPDATED
├── types.ts
└── index.ts                     ✅ UPDATED
```

## Steps

1. **Analyze**: Check if `useComponent.ts` hook already exists
2. **Create**: `hooks/` folder
3. **Extract**: Context + Hook to `hooks/useComponentContext.ts`
4. **Move**: Existing `useComponent.ts` if present (don't create new)
5. **Create**: `hooks/index.ts` with proper exports
6. **Update**: Import paths in all component files
7. **Update**: Public exports in `index.ts`
8. **Verify**: No functionality changed, only organization

## What NOT to Do

❌ Do NOT create new `useComponent.ts` hooks  
❌ Do NOT extract business logic to hooks  
❌ Do NOT modify component behavior  
❌ Do NOT change public API  
❌ Do NOT add new features  
❌ Do NOT remove existing code (except moved context)

## Example: Accordion

### Before

```tsx
// Accordion.tsx
const AccordionContext = createContext<AccordionContextValue | null>(null);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('...');
  return context;
};

export const Accordion = (props) => {
  const [value, setValue] = useState(); // ← STAYS HERE
  const handleToggle = useCallback(...); // ← STAYS HERE
  // ... all business logic stays here
  
  const contextValue = useMemo(() => ({ ... }), [...]);
  
  return (
    <AccordionContext.Provider value={contextValue}>
      {children}
    </AccordionContext.Provider>
  );
};
```

### After

```tsx
// hooks/useAccordionContext.ts
export const AccordionContext = createContext<AccordionContextValue | null>(null);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('...');
  return context;
};

// hooks/index.ts
export { AccordionContext, useAccordionContext } from './useAccordionContext';

// Accordion.tsx
import { AccordionContext } from './hooks';

export const Accordion = (props) => {
  const [value, setValue] = useState(); // ← STILL HERE
  const handleToggle = useCallback(...); // ← STILL HERE
  // ... all business logic still here
  
  const contextValue = useMemo(() => ({ ... }), [...]);
  
  return (
    <AccordionContext.Provider value={contextValue}>
      {children}
    </AccordionContext.Provider>
  );
};

// index.ts
export { Accordion } from './Accordion';
export { useAccordionContext } from './hooks'; // ← ADDED
```

## Validation Checklist

After refactoring:

- [ ] `hooks/useComponentContext.ts` exists and contains Context + Hook
- [ ] `hooks/index.ts` exports correctly
- [ ] Root component imports Context from `./hooks`
- [ ] Child components import hook from `./hooks`
- [ ] Public `index.ts` exports `useComponentContext`
- [ ] No business logic moved (unless useComponent hook already existed)
- [ ] All imports updated correctly
- [ ] No TypeScript errors

## Target Components Priority

1. ✅ Accordion (completed - reference implementation)
2. Collapsible (simple)
3. Dialog (medium)
4. Select (complex)
5. Tabs (medium)
6. Input (simple)
7. Breadcrumb (very simple - already partially done)
8. Tooltip (already has hooks/, needs cleanup)
9. Popover (already has hooks/, reference)
10. DropdownMenu (has contexts.ts, needs migration)

## Usage

Replace `${ComponentName}` with the actual component name (e.g., Dialog, Select, Tabs) and execute the refactoring following all rules above.
