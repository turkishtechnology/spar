---
applyTo: '**/components/**/*.tsx'
---

# Coding Standards - Glide

## TypeScript Standards

### Component Props Pattern

```typescript
// ALWAYS: Extend appropriate HTML element props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  orientation?: Orientation;
}
```

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

// LEGACY: Only when supporting React 18
const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => (
  <label ref={ref} {...props} />
));
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

## Import/Export Standards

### Module Exports

#### Simple Components

```typescript
// packages/glide/src/components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

#### Compound/Grouped Components - Dual Export Pattern

```typescript
// packages/glide/src/components/Accordion/index.ts
import { Accordion } from './Accordion';
import { AccordionItem } from './AccordionItem';
import { AccordionHeader } from './AccordionHeader';
import { AccordionTrigger } from './AccordionTrigger';
import { AccordionContent } from './AccordionContent';

// Aliased exports for grouped usage
const Root = Accordion;
const Item = AccordionItem;
const Header = AccordionHeader;
const Trigger = AccordionTrigger;
const Content = AccordionContent;

// Export both named components AND aliases
export {
  // Utility functions if any
  createAccordionScope,

  // Named exports (for direct imports)
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,

  // Aliased exports (for grouped pattern)
  Root,
  Item,
  Header,
  Trigger,
  Content,
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
// Direct import: import { AccordionTrigger } from '@glide/components';
// Grouped import: import { Root, Trigger, Content } from '@glide/components/Accordion';
```

#### Root Index Exports

```typescript
// packages/glide/src/components/index.ts
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
