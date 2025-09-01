---
applyTo: '**/*'
---

# Coding Standards - TK Headless

## Core Principles

1. **Accessibility First**
   - ALWAYS design with accessibility in mind from the start
   - NEVER compromise on accessibility features
   - ALWAYS include ARIA attributes
   - ALWAYS support keyboard navigation

2. **TypeScript Everywhere**
   - ALWAYS use TypeScript for all new code
   - NEVER use `any` type
   - ALWAYS include comprehensive type definitions
   - ALWAYS export component prop types

## Component Architecture

### Component Structure

```typescript
// Component file structure
import { forwardRef } from 'react';
import type { ComponentProps } from './types';

export interface ButtonProps extends ComponentProps {
  // Props interface
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  // Component implementation
});

Button.displayName = 'Button';
```

### Naming Conventions

- Components: PascalCase (e.g., `Button`, `Dialog`)
- Props: PascalCase with "Props" suffix (e.g., `ButtonProps`)
- Hooks: camelCase with "use" prefix (e.g., `useButton`)
- Event handlers: camelCase with "handle" prefix (e.g., `handleClick`)
- Boolean props: "is/has/should" prefix (e.g., `isDisabled`)

## TypeScript Usage

### Type Definitions

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

// ❌ Bad
interface ButtonProps {
  variant: string; // Too loose
  onClick: any; // Avoid any
}
```

### Generic Types

```typescript
// ✅ Good
function select<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

// ❌ Bad
function select(items: any[], predicate: Function): any[] {
  return items.filter(predicate);
}
```

## React Patterns

### Hooks Usage

```typescript
// ✅ Good
const [value, setValue] = useState<string>('');
useEffect(() => {
  // Cleanup
  return () => cleanup();
}, [dependency]);

// ❌ Bad
const [value, setValue] = useState(); // Missing type
useEffect(() => {
  // No cleanup
}, []); // Empty deps array without justification
```

### Event Handling

```typescript
// ✅ Good
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  event.preventDefault();
};

// ❌ Bad
const handleClick = (e) => {
  // Missing type
  e.preventDefault();
};
```

### Ref Forwarding and React 19

- Starting from **React 19**, `ref` is automatically passed to function components as a prop.
- Do **not** use `forwardRef` unless:
  - You need to support React 18 or earlier
  - You’re writing a cross-version library
  - You need fine-grained control (e.g., class interop, legacy code)
- For imperative handle cases, use `useImperativeHandle` directly with the `ref` prop.
- Example:

```typescript
// ✅ Good (React 19+)
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  ref?: React.Ref<HTMLLabelElement>;
}

export const Label = ({ ref, ...props }: LabelProps) => {
  useImperativeHandle(ref, () => ({
    // custom methods (optional)
  }), []);
  return <label ref={ref} {...props}>Label</label>;
};

// ⚠️ Legacy pattern (React 18 and before)
const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => (
  <label ref={ref} {...props}>Label</label>
));
```

## Accessibility Standards

### ARIA Attributes

```typescript
// ✅ Good
<button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  onClick={handleClick}
>
  {children}
</button>

// ❌ Bad
<div onClick={handleClick}> // Not semantic
  {children}
</div>
```

### Keyboard Navigation

```typescript
// ✅ Good
const handleKeyDown = (event: React.KeyboardEvent): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    handleClick();
  }
};

// ❌ Bad
// Missing keyboard support entirely
```

## State Management

### Component State

```typescript
// ✅ Good
const [isOpen, setIsOpen] = useState<boolean>(false);
const toggleOpen = (): void => setIsOpen((prev) => !prev);

// ❌ Bad
let isOpen = false; // Don't use let for component state
const toggleOpen = () => (isOpen = !isOpen); // Don't mutate directly
```

## Error Handling

### Error Boundaries

```typescript
// ✅ Good
class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }
}

// ❌ Bad
// Missing error boundaries entirely
```

## Performance Optimization

### Memoization

```typescript
// ✅ Good
const MemoizedComponent = React.memo(Component);
const memoizedValue = useMemo(() => compute(value), [value]);

// ❌ Bad
// Re-computing expensive values on every render
```

## Code Style

### Variable Declaration

```typescript
// ✅ Good
const MAX_ITEMS = 10;
const [count, setCount] = useState<number>(0);

// ❌ Bad
var maxItems = 10; // Never use var
let count = 0; // Don't use let for state
```

### Function Declaration

```typescript
// ✅ Good
const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  // Implementation
};

// ❌ Bad
function handleChange(e) {
  // Missing types
  // Implementation
}
```

## Documentation

### JSDoc Comments

```typescript
// ✅ Good
/**
 * Button component that follows WAI-ARIA button pattern
 * @param {ButtonProps} props - Component props
 * @returns {JSX.Element} Accessible button element
 */

// ❌ Bad
// Missing documentation
```

## Testing Requirements

### Test Coverage

- MUST achieve minimum 90% coverage
- MUST test all accessibility features
- MUST test keyboard navigation
- MUST test error states

```typescript
// ✅ Good
describe('Button', () => {
  it('should handle keyboard navigation', () => {
    // Test implementation
  });
});

// ❌ Bad
// Missing critical test cases
```

## Import/Export Rules

### Module Exports

```typescript
// ✅ Good
export { Button } from './Button';
export type { ButtonProps } from './types';

// ❌ Bad
export default Button; // Avoid default exports
```

## File Organization

### Project Structure

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   └── ...
├── hooks/
├── utils/
└── types/
```

<reminders>
REMEMBER: These standards are non-negotiable
REMEMBER: Accessibility is fundamental
REMEMBER: TypeScript types are mandatory
REMEMBER: Always write tests
REMEMBER: Document your code
</reminders>
