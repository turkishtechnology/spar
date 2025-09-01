---
applyTo: '**/*.{ts,tsx}'
---

# TypeScript Instructions for TK Headless

<identity>
You are writing TypeScript code for TK Headless components.
ALWAYS use strict TypeScript with comprehensive type safety.
NEVER use `any` type unless absolutely necessary with justification.
</identity>

## TypeScript Configuration

Your code MUST work with these tsconfig settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Type Definition Rules

### Interfaces vs Types

```typescript
// ✅ CORRECT: Use interfaces for object shapes
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  isDisabled?: boolean;
}

// ✅ CORRECT: Use types for unions, intersections, and mapped types
type ButtonVariant = 'primary' | 'secondary' | 'danger';
type Size = 'sm' | 'md' | 'lg';
```

### Generic Components

```typescript
// ✅ CORRECT: Properly typed generic component
interface SelectProps<T> {
  items: T[];
  value?: T;
  onChange: (value: T) => void;
  getItemLabel: (item: T) => string;
  getItemKey: (item: T) => string;
}

// Component implementation
export function Select<T>({ items, value, onChange }: SelectProps<T>) {
  // Implementation
}
```

### Event Handlers

```typescript
// ✅ CORRECT: Properly typed event handlers
interface ComponentProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
}
```

## Component Patterns

### Ref Forwarding

```typescript
// ✅ CORRECT: Proper ref forwarding with TypeScript
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', ...props }, ref) => {
    return <button ref={ref} data-variant={variant} {...props} />;
  }
);

Button.displayName = 'Button';
```

### Polymorphic Components

```typescript
// ✅ CORRECT: Type-safe polymorphic component
type PolymorphicProps<E extends React.ElementType> = {
  as?: E;
} & React.ComponentPropsWithoutRef<E>;

type ButtonProps<E extends React.ElementType = 'button'> = PolymorphicProps<E> & {
  variant?: 'primary' | 'secondary';
};

export function Button<E extends React.ElementType = 'button'>({
  as,
  variant = 'primary',
  ...props
}: ButtonProps<E>) {
  const Component = as || 'button';
  return <Component data-variant={variant} {...props} />;
}
```

### Custom Hooks

```typescript
// ✅ CORRECT: Properly typed custom hook
interface UseButtonProps {
  isDisabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

interface UseButtonReturn {
  buttonProps: {
    role?: string;
    tabIndex?: number;
    'aria-disabled'?: boolean;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  };
}

export function useButton(props: UseButtonProps): UseButtonReturn {
  // Implementation
}
```

## Utility Types

### Required Utility Types

```typescript
// Component state types
type ComponentState = 'idle' | 'loading' | 'error' | 'success';

// Discriminated unions for state management
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };

// Strict omit utility
type StrictOmit<T, K extends keyof T> = Omit<T, K>;

// Deep partial for configuration objects
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
```

## Import/Export Patterns

```typescript
// ✅ CORRECT: Named exports for better tree-shaking
export { Button } from './Button';
export type { ButtonProps } from './Button';

// ✅ CORRECT: Separate type exports
export type { DialogProps, DialogState } from './types';
export { Dialog, useDialog } from './Dialog';

// ❌ WRONG: Avoid default exports
export default Button; // Don't use this
```

## Error Handling

```typescript
// ✅ CORRECT: Type-safe error handling
class ComponentError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly component: string,
  ) {
    super(message);
    this.name = 'ComponentError';
  }
}

// Usage
if (!props['aria-label'] && props.isIconOnly) {
  throw new ComponentError(
    'Icon-only buttons must have an aria-label',
    'MISSING_ARIA_LABEL',
    'Button',
  );
}
```

## Type Guards

```typescript
// ✅ CORRECT: Type guards for runtime safety
function isButtonElement(element: HTMLElement): element is HTMLButtonElement {
  return element.tagName === 'BUTTON';
}

function hasRequiredProps<T extends { required: string }>(props: unknown): props is T {
  return (
    typeof props === 'object' &&
    props !== null &&
    'required' in props &&
    typeof (props as any).required === 'string'
  );
}
```

## JSDoc Comments

````typescript
/**
 * A fully accessible button component that supports multiple variants and states.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export interface ButtonProps {
  /**
   * The visual variant of the button
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger';

  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
}
````

<reminders>
REMEMBER: TypeScript is MANDATORY for all TK Headless code.
REMEMBER: NEVER use `any` without explicit justification.
REMEMBER: ALWAYS export types separately from implementations.
REMEMBER: Use discriminated unions for state management.
REMEMBER: Type guards ensure runtime type safety.
</reminders>
