---
applyTo: '**/components/**/*.tsx'
---

# Coding Standards - Spar

## TypeScript Standards

### Component Props Pattern

```typescript
// ALWAYS: Extend appropriate HTML element props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  orientation?: Orientation;
}

// ALWAYS: children is inherited from HTMLAttributes/ButtonHTMLAttributes
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  // children is already available - no need to declare
}

// NEVER: Redundant children declaration
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  children: React.ReactNode; // Unnecessary - already in HTMLAttributes
}
```

**Rule:** Never explicitly declare `children: React.ReactNode` when extending:
- `React.HTMLAttributes<T>`
- `React.ButtonHTMLAttributes<T>`
- `React.LabelHTMLAttributes<T>`
- Any other React HTML element attributes

These interfaces already include `children?: ReactNode`.

## React Patterns

### Component Structure (React 19+)

```typescript
// MODERN: React 19+ pattern (no forwardRef needed)
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  ref?: React.Ref<HTMLLabelElement>;
}

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
export type Orientation = 'vertical' | 'horizontal';
/**
 * Props for Component
 * @remarks Fully accessible, headless component
 */
export interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual variant affecting behavior
   * @defaultValue 'horizontal'
   */
  orientation?: Orientation;

  /**
   * Disabled state - properly announced to screen readers
   * @defaultValue false
   */
  isDisabled?: boolean;

  /**
   * Loading state with screen reader support
   * @defaultValue false
   */
  isLoading?: boolean;

  /**
   * Required for icon-only variants
   */
  'aria-label'?: React.AriaAttributes['aria-label'];

  /**
   * Component content
   */
  children?: React.ReactNode;
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
//    <Accordion.Root><Accordion.Trigger /></Accordion.Root>
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
// ALWAYS: is/has/should/can prefix
(isDisabled, hasError, shouldAutoFocus, canSubmit);

// NEVER: Ambiguous names
(disabled, error, focus, submit);
```

## Performance Guidelines

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
const { variant, isDisabled, children, ...safeProps } = props;
return <button {...safeProps}>{children}</button>;

// NEVER: Blind prop spreading with sensitive props
return <button {...props} />; // Could override critical props
```
