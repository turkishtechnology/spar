---
applyTo: '**/components/**/*.tsx'
---

# Coding Standards - Spar

## TypeScript Standards

### Component Props Pattern

```typescript
// ALWAYS: Use ComponentProps<'element'> to extend HTML element props
// This includes all HTML attributes, event handlers, ref, className, style, children, etc.
interface ButtonProps extends ComponentProps<'button'> {
  orientation?: Orientation;
}

// ALWAYS: children, ref, className, style, disabled, etc. are inherited from ComponentProps
interface TabsProps extends ComponentProps<'div'> {
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  // children, ref, className, disabled, etc. are already available - no need to declare
}

// NEVER: Redundant prop declarations
interface TabsProps extends ComponentProps<'div'> {
  value?: string;
  children: React.ReactNode; // Unnecessary - already in ComponentProps
  disabled?: boolean; // Unnecessary - already in ComponentProps
  className?: string; // Unnecessary - already in ComponentProps
  ref?: React.Ref<HTMLDivElement>; // Unnecessary - already in ComponentProps
}
```

**Rule:** Never explicitly declare props that are already included in `ComponentProps<'element'>`:
- `children?: ReactNode`
- `ref?: Ref<HTMLElement>`
- `className?: string`
- `style?: CSSProperties`
- `disabled?: boolean` (for form elements)
- Event handlers like `onClick`, `onKeyDown`, etc.
- All HTML attributes for the specific element

**Available ComponentProps patterns:**
- `ComponentProps<'button'>` - button elements
- `ComponentProps<'div'>` - div elements
- `ComponentProps<'span'>` - span elements
- `ComponentProps<'input'>` - input elements
- `ComponentProps<'label'>` - label elements
- `ComponentProps<'a'>` - anchor elements
- `ComponentProps<'nav'>` - nav elements
- `ComponentProps<'li'>` - list item elements
- `ComponentProps<'ol'>` - ordered list elements
- `ComponentProps<'h1'>` through `ComponentProps<'h6'>` - heading elements
- `ComponentProps<'p'>` - paragraph elements

## React Patterns

### Component Structure (React 19+)

```typescript
// MODERN: React 19+ pattern (no forwardRef needed)
// ref is already included in ComponentProps
interface LabelProps extends ComponentProps<'label'> {}

export const Label = ({ ref, ...props }: LabelProps) => {
  return <label ref={ref} {...props} />;
};

```

### Hooks Usage

```typescript
// ALWAYS: Typed state with imported types
import type { RequestStatus } from './types';

const [count, setCount] = useState<number>(0);
const [status, setStatus] = useState<RequestStatus>(RequestStatus.IDLE);

// ALWAYS: Dependency arrays with justification
useEffect(() => {
  // Effect logic
  return () => {
    // Cleanup
  };
}, [dependency]); // Clear why dependency is needed
```

### Ref Usage

**Rule:** Always use `RefObject<T>` instead of `MutableRefObject<T>`.

## ARIA Attributes Standards

### Type Safety for ARIA Properties

```typescript
// ALWAYS: Use React.AriaAttributes for aria-* props when available
interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * EXAMPLE: Use React's typed ARIA attributes
   */
  'aria-label'?: React.AriaAttributes['aria-label'];
  'aria-describedby'?: React.AriaAttributes['aria-describedby'];
  
  /**
   * Role with React's predefined types
   */
  role?: React.AriaRole;
}

// NEVER: Generic string for standard ARIA attributes
interface BadProps {
  'aria-label'?: string; // Should use React.AriaAttributes['aria-label']
}
```

### ARIA Implementation Priority

1. **First Priority**: Use `React.AriaAttributes['aria-*']` if available
2. **Fallback**: Use `string` only for truly custom attributes

## ID Generation Convention

### Single `useId()` + Suffix Pattern

**ALWAYS**: Generate a single base ID per component instance using `useId()`, then derive sub-element IDs with descriptive suffixes.

```typescript
// ALWAYS: Single useId() call, suffix-based derivation
const generatedId = useId();
const baseId = providedId ?? generatedId;
const triggerId = `${baseId}-trigger`;
const contentId = `${baseId}-content`;

// NEVER: Multiple useId() calls per component
const triggerId = useId();  // Wasteful, unrelated IDs
const contentId = useId();  // No shared base

// NEVER: Prefix pattern
const contentId = `content-${baseId}`;  // Use suffix, not prefix
```

### External ID Override

**ALWAYS**: Accept an optional `id` prop that overrides the generated base ID. Use nullish coalescing (`??`), not logical OR (`||`).

```typescript
// ALWAYS: Accept id prop, use ?? operator
interface MyComponentOwnProps {
  /** Custom base ID for ARIA relationships. */
  id?: string;
}

export const MyComponent = ({ id: providedId, ...props }: MyComponentProps) => {
  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  // ...
};

// NEVER: Use || operator (treats "" as falsy)
const baseId = providedId || generatedId;
```

### Context ID Sharing

**ALWAYS**: Pass pre-computed string IDs through context. Children consume raw strings directly.

```typescript
// ALWAYS: Raw strings in context
interface MyContextValue {
  triggerId: string;
  contentId: string;
}

// In root: compute IDs and pass as strings
const contextValue = useMemo(() => ({
  triggerId: `${baseId}-trigger`,
  contentId: `${baseId}-content`,
}), [baseId]);

// In children: use directly
const { triggerId, contentId } = useMyContext();
<button id={triggerId} aria-controls={contentId} />

// NEVER: Getter functions in context
interface BadContextValue {
  getTriggerId: (value: string) => string;  // Unnecessary abstraction
}
```

### `aria-controls` Usage

**ALWAYS**: Set `aria-controls` unconditionally. The referenced element may not be in the DOM yet, but the attribute should still be present.

```typescript
// ALWAYS: Unconditional
<button aria-controls={contentId} />

// NEVER: Conditional on open state
<button aria-controls={isOpen ? contentId : undefined} />
```

## File Organization Standards

### File Separation Rule
**ALWAYS**: Each logical component gets its own file. Never mix multiple component definitions in a single file.

**Simple Component Example:**
```
Button/
└── Button.tsx    # Single component
```

**Compound Component Example:**
```
Accordion/
├── Accordion.tsx        # Root component
├── AccordionItem.tsx    # Item component
├── AccordionTrigger.tsx # Trigger component
└── AccordionContent.tsx # Content component
```



## Component Architecture

### Component Template

```typescript
import type { ComponentProps } from './Component.types';

/**
 Brief component description in 2-3 sentences maximum. Explain what the component does without going into excessive detail. Focus on the main purpose and functionality.
 */
export const Component = ({}: ComponentProps) => {
  return (
    <div>
      {Content}
    </div>
  );
};

Component.displayName = 'Component';
```

### Props Interface Template

```typescript
import type { ComponentProps } from 'react';

export type Orientation = 'vertical' | 'horizontal';

/**
 * Props for Component
 * @remarks Fully accessible, headless component
 */
export interface MyComponentProps extends ComponentProps<'div'> {
  /**
   * Visual variant affecting behavior
   * @defaultValue 'horizontal'
   */
  orientation?: Orientation;

  /**
   * Loading state with screen reader support
   * @defaultValue false
   */
  isLoading?: boolean;

  // Note: disabled, children, ref, className, style, aria-label, etc.
  // are already included via ComponentProps<'div'>
}
```

## State Management

### Complex State

```typescript
// ALWAYS: Import discriminated unions from types
import type { RequestState } from './types';

// types.ts:
// export type RequestState =
//   | { status: 'idle' }
//   | { status: 'loading' }
//   | { status: 'success'; data: unknown }
//   | { status: 'error'; error: Error };

const [requestState, setRequestState] = useState<RequestState>({
  status: 'idle',
});
```

## Item Registry Pattern

**When to use `useItemRegistry`:**
- Components with keyboard navigation between items
- Components needing item order tracking or index-based access
- Dynamic child component registration/unregistration

**When NOT to use:**
- Static navigation structures
- Components without keyboard navigation
- Components where DOM order is sufficient

### Usage Pattern

```typescript
// Root component
import { useItemRegistry } from '@/hooks';

// For ID-only tracking
const { registerItem, unregisterItem, getItemIds } = useItemRegistry<void>();
const items = getItemIds(); // Returns string[]

// For data tracking
const { registerItem, unregisterItem, getItemAtIndex } = useItemRegistry<ItemData>();
```

### Child Component Registration

```typescript
// Child component
useEffect(() => {
  registerItem(id, data); // data optional for ID-only tracking
  return () => unregisterItem(id);
}, [id, registerItem, unregisterItem]);
```

**Critical:** Use `items.size` in dependency arrays, NOT `items` Map directly (prevents infinite loops).

## Import/Export Standards

### Module Exports

**Important: Avoid Generic Aliases**
Never export generic names like `Root`, `Item`, `Trigger` from component index files as they cause naming conflicts when multiple components have the same part names. Always use component-specific names or dot notation patterns.

#### Simple Components

```typescript
// packages/spar/src/components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

#### Compound/Grouped Components - Dual Export Pattern

```typescript
// packages/spar/src/components/Accordion/index.ts
import { Accordion } from './Accordion';
import { AccordionItem } from './AccordionItem';
import { AccordionHeader } from './AccordionHeader';
import { AccordionTrigger } from './AccordionTrigger';
import { AccordionContent } from './AccordionContent';

// Create compound component with dot notation support
const AccordionCompound = Accordion as typeof Accordion & {
  Root: typeof Accordion;
  Item: typeof AccordionItem;
  Header: typeof AccordionHeader;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
};

AccordionCompound.Root = Accordion;
AccordionCompound.Item = AccordionItem;
AccordionCompound.Header = AccordionHeader;
AccordionCompound.Trigger = AccordionTrigger;
AccordionCompound.Content = AccordionContent;

// Export both patterns
export {
  // Compound component (with dot notation)
  Accordion: AccordionCompound,

  // Named exports (tree-shakeable)
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,

  // Root alias for explicit usage
  AccordionRoot: Accordion,
};

// Export types
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from './types';

// Usage examples:
// 1. Dot notation (compound): 
//    import { Accordion } from '@spar/components';
//    <AccordionRoot><AccordionTrigger /></AccordionRoot>
// 
// 2. Named imports (tree-shakeable): 
//    import { AccordionRoot, AccordionTrigger } from '@spar/components';
//    <AccordionRoot><AccordionTrigger /></AccordionRoot>
```

#### Root Index Exports

```typescript
// packages/spar/src/components/index.ts
export * from './Button';
export * from './Dialog';
export * from './Accordion';
```

## Code Style

### Function Declaration

```typescript
// ALWAYS: Arrow functions for consistency
const handleSubmit = (data: FormData): void => {
  // Implementation
};

const computeValue = (input: number): number => {
  return input * 2;
};

// WHEN NEEDED: Function expressions for hoisting
function utilityFunction(param: string): string {
  return param.toUpperCase();
}
```

## Naming Conventions

### Components and Types

- **Components**: PascalCase (`Button`, `DialogOverlay`)
- **Props**: PascalCase + "Props" suffix (`ButtonProps`)
- **Hooks**: camelCase + "use" prefix (`useButton`, `useDialog`)
- **Utilities**: camelCase (`formatDate`, `validateEmail`)

### Event Handlers

```typescript
// ALWAYS: handle prefix
const handleClick = () => {};
const handleInputChange = () => {};
const handleKeyDown = () => {};

// NEVER: on prefix or unclear names
const onClick = () => {}; // Confusing with prop
const click = () => {}; // Unclear
```

### Boolean Props

```typescript
// ALWAYS: is/has/can prefix
(hasError, canSubmit);

// NEVER: Ambiguous names
(error, submit);
```

## Performance Guidelines

### Context Value Memoization

**ALWAYS**: Wrap context provider values with `useMemo` to prevent unnecessary re-renders of all consumers on every parent render.

```typescript
// ALWAYS: Memoize context value objects
const contextValue = useMemo<MyContextValue>(
  () => ({
    value,
    onChange: handleChange,
    disabled,
  }),
  [value, handleChange, disabled],
);

return (
  <MyContext.Provider value={contextValue}>
    {children}
  </MyContext.Provider>
);

// NEVER: Inline object literals as context value
// This creates a new object reference on every render,
// causing ALL consumers to re-render unnecessarily
const contextValue: MyContextValue = {
  value,
  onChange: handleChange,
  disabled,
};

return (
  <MyContext.Provider value={contextValue}>
    {children}
  </MyContext.Provider>
);
```

**Rule:** Every `Context.Provider` value must be wrapped in `useMemo` with appropriate dependencies. Without memoization, a new object reference is created on every render, triggering re-renders in all consuming components even when the actual values haven't changed.

### Conditional Rendering

```typescript
// ALWAYS: Early returns for conditionals
if (isLoading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <MainContent />;

// NEVER: Nested ternaries
return isLoading ? <Spinner /> : error ? <Error /> : <Content />; // Hard to read
```

## Security Considerations

### Safe Prop Spreading

```typescript
// ALWAYS: Extract known props
const { variant, disabled, children, ...safeProps } = props;
return <button {...safeProps}>{children}</button>;

// NEVER: Blind prop spreading with sensitive props
return <button {...props} />; // Could override critical props
```
