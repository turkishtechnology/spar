# Coding Standards - Glide

## Context
Glide is a headless React component library with TypeScript. These standards ensure consistency, maintainability, and accessibility across all components.

## Core Principles
- **Headless Design**: Zero styling opinions, behavior only
- **Tree-Shakeable**: Named exports, no side effects
- **Performance**: Minimal re-renders, proper memoization

## TypeScript Standards

### Type Safety Rules
```typescript
// ✅ ALWAYS: Explicit interfaces
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

// ❌ NEVER: Loose types or any
interface ButtonProps {
  variant: string; // Too loose
  onClick: any; // Never use any
  children?: any; // Implicit any
}
```

### Component Props Pattern
```typescript
// ✅ ALWAYS: Extend appropriate HTML element props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  isDisabled?: boolean;
}

// ✅ ALWAYS: Use boolean prefixes
isDisabled, hasError, shouldAutoFocus, canSubmit

// ❌ NEVER: Ambiguous boolean names
disabled, error, focus, submit
```

### Generic Types
```typescript
// ✅ ALWAYS: Constrained generics
interface SelectProps<T extends string | number> {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}

// ❌ NEVER: Unconstrained generics
interface SelectProps<T> {
  value: T; // Too loose
  onChange: (value: any) => void; // Any usage
}
```

## React Patterns

### Component Structure (React 19+)
```typescript
// ✅ MODERN: React 19+ pattern (no forwardRef needed)
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  ref?: React.Ref<HTMLLabelElement>;
}

export const Label = ({ ref, ...props }: LabelProps) => {
  return <label ref={ref} {...props} />;
};

// ⚠️ LEGACY: Only when supporting React 18
const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => (
  <label ref={ref} {...props} />
));
```

### Event Handlers
```typescript
// ✅ ALWAYS: Typed event handlers
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  event.preventDefault();
  // Implementation
};

const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    handleActivate();
  }
};

// ❌ NEVER: Untyped handlers
const handleClick = (e) => { // Missing types
  e.preventDefault();
};
```

### Hooks Usage
```typescript
// ✅ ALWAYS: Typed state with imported types
import type { RequestStatus } from './types';

const [count, setCount] = useState<number>(0);
const [status, setStatus] = useState<RequestStatus>('idle');

// ✅ ALWAYS: Dependency arrays with justification
useEffect(() => {
  // Effect logic
  return () => {
    // Cleanup
  };
}, [dependency]); // Clear why dependency is needed

// ❌ NEVER: Missing types or unclear dependencies
const [count, setCount] = useState(); // Missing type
useEffect(() => {
  // Logic
}, []); // Empty array without clear reason
```

## Component Architecture

### File Structure
```
packages/glide/src/components/Component/
├── Component.tsx               # Main component implementation
├── Component.types.ts          # TypeScript type definitions  
├── index.ts                   # Named exports only
└── __tests__/                 # Test directory
    ├── Component.test.tsx           # Unit tests
    ├── Component.a11y.test.tsx      # Accessibility tests
    └── Component.integration.test.tsx # Integration tests
```

### Component Template
```typescript
import type { ComponentProps } from './Component.types';

/**
 * Component description following WAI-ARIA patterns
 * 
 * @example
 * ```tsx
 * <Component variant="primary" onClick={handleClick}>
 *   Content
 * </Component>
 * ```
 */
export const Component = ({
  variant = 'primary',
  isDisabled = false,
  children,
  'aria-label': ariaLabel,
  ...rest
}: ComponentProps) => {
  // ARIA attributes object
  const ariaProps: React.AriaAttributes = {
    'aria-disabled': isDisabled || undefined,
    'aria-label': ariaLabel,
  };

  return (
    <div {...rest} {...ariaProps}>
      {children}
    </div>
  );
};

Component.displayName = 'Component';
```

### Props Interface Template
```typescript
/**
 * Props for Component
 * @remarks Fully accessible, headless component
 */
export interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual variant affecting behavior */
  variant?: 'primary' | 'secondary';
  
  /** Disabled state - properly announced to screen readers */
  isDisabled?: boolean;
  
  /** Loading state with screen reader support */
  isLoading?: boolean;
  
  /** Required for icon-only variants */
  'aria-label'?: string;
  
  /** Component content */
  children?: React.ReactNode;
}
```

## State Management

### Component State
```typescript
// ✅ ALWAYS: Typed state with clear intent
const [isOpen, setIsOpen] = useState<boolean>(false);
const [selectedId, setSelectedId] = useState<string | null>(null);

const toggleOpen = (): void => setIsOpen(prev => !prev);

// ❌ NEVER: Let variables or direct mutation
let isOpen = false; // Don't use let
isOpen = !isOpen; // Don't mutate directly
```

### Complex State
```typescript
// ✅ ALWAYS: Import discriminated unions from types
import type { RequestState } from './types';

// types.ts:
// export type RequestState =
//   | { status: 'idle' }
//   | { status: 'loading' }
//   | { status: 'success'; data: unknown }
//   | { status: 'error'; error: Error };

const [requestState, setRequestState] = useState<RequestState>({
  status: 'idle'
});
```

## Performance Optimization

### Memoization
```typescript
// ✅ ALWAYS: Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ ALWAYS: Memoize callbacks passed to children
const handleItemClick = useCallback((id: string) => {
  setSelectedId(id);
}, [setSelectedId]);
```

### Component Memoization
```typescript
// ✅ WHEN NEEDED: Memo for expensive renders
export const ExpensiveComponent = React.memo(Component);

// ✅ ALWAYS: Custom comparison for complex props
export const Component = React.memo(ComponentImpl, (prevProps, nextProps) => {
  return prevProps.complexProp.id === nextProps.complexProp.id;
});
```

## Error Handling

### Component Error States
```typescript
// ✅ ALWAYS: Handle error states gracefully
const Component = ({ data, ...props }: ComponentProps) => {
  if (!data) {
    console.warn('Component: data prop is required');
    return null;
  }
  
  return <div {...props}>{data.content}</div>;
};
```

### Runtime Validation
```typescript
// ✅ ALWAYS: Validate required props
export const IconButton = ({ children, 'aria-label': ariaLabel, ...props }: IconButtonProps) => {
  if (!ariaLabel && typeof children === 'string') {
    console.warn('IconButton: aria-label is required for accessibility');
  }
  
  return <button aria-label={ariaLabel} {...props}>{children}</button>;
};
```

## Import/Export Standards

### Module Exports
```typescript
// ✅ ALWAYS: Named exports
export { Button } from './Button';
export type { ButtonProps } from './Button.types';

// ✅ ALWAYS: Index files for clean imports
// packages/glide/src/components/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';

// ❌ NEVER: Default exports
export default Button; // Avoid default exports
```

### Component Registration Steps
```typescript
// ✅ ALWAYS: Add to main components index after creating component
// packages/glide/src/components/index.ts
export { NewComponent } from './NewComponent';
export type { NewComponentProps } from './NewComponent';
```

### Import Organization
```typescript
// ✅ ALWAYS: Group imports logically
// 1. React imports
import * as React from 'react';
import { useState, useCallback } from 'react';

// 2. Type-only imports
import type { ComponentProps } from './Component.types';

// 3. Internal imports
import { useButton } from '../hooks';

// 4. Constants/utilities
import { BUTTON_VARIANTS } from './constants';
```

## Documentation Standards

### JSDoc Comments
```typescript
/**
 * Button component following WAI-ARIA button pattern
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleSubmit}>
 *   Submit Form
 * </Button>
 * ```
 * 
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
export const Button = (props: ButtonProps) => {
  // Implementation
};
```

### Inline Comments
```typescript
// ✅ ALWAYS: Explain why, not what
const handleKeyDown = (event: React.KeyboardEvent): void => {
  // Prevent default to avoid form submission on Space key
  if (event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
};

// ❌ NEVER: Obvious comments
const isDisabled = props.isDisabled; // Set disabled state
```

## Code Style

### Variable Declaration
```typescript
// ✅ ALWAYS: const for immutable, let for mutable
const MAX_ITEMS = 10;
const config = { theme: 'dark' };
let currentIndex = 0;

// ❌ NEVER: var declarations
var maxItems = 10; // Don't use var
```

### Function Declaration
```typescript
// ✅ ALWAYS: Arrow functions for consistency
const handleSubmit = (data: FormData): void => {
  // Implementation
};

const computeValue = (input: number): number => {
  return input * 2;
};

// ✅ WHEN NEEDED: Function expressions for hoisting
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
// ✅ ALWAYS: handle prefix
const handleClick = () => {};
const handleInputChange = () => {};
const handleKeyDown = () => {};

// ❌ NEVER: on prefix or unclear names
const onClick = () => {}; // Confusing with prop
const click = () => {}; // Unclear
```

### Boolean Props
```typescript
// ✅ ALWAYS: is/has/should/can prefix
isDisabled, hasError, shouldAutoFocus, canSubmit

// ❌ NEVER: Ambiguous names
disabled, error, focus, submit
```

## Performance Guidelines

### Avoid Unnecessary Re-renders
```typescript
// ✅ ALWAYS: Stable references
const memoizedCallback = useCallback(() => {
  // Implementation
}, [dependency]);

// ✅ ALWAYS: Extract static objects
const STATIC_PROPS = { role: 'button' };

const Component = () => {
  return <div {...STATIC_PROPS} />; // Reuse static object
};

// ❌ NEVER: Inline objects in render
const Component = () => {
  return <div style={{ margin: 0 }} />; // New object every render
};
```

### Conditional Rendering
```typescript
// ✅ ALWAYS: Early returns for conditionals
if (isLoading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <MainContent />;

// ❌ NEVER: Nested ternaries
return isLoading ? <Spinner /> : error ? <Error /> : <Content />; // Hard to read
```

## Security Considerations

### XSS Prevention
```typescript
// ✅ ALWAYS: Sanitize user content
const sanitizedHtml = DOMPurify.sanitize(userContent);

// ❌ NEVER: Direct HTML insertion
dangerouslySetInnerHTML={{ __html: userContent }} // Potential XSS
```

### Safe Prop Spreading
```typescript
// ✅ ALWAYS: Extract known props
const { variant, isDisabled, children, ...safeProps } = props;
return <button {...safeProps}>{children}</button>;

// ❌ NEVER: Blind prop spreading with sensitive props
return <button {...props} />; // Could override critical props
```
