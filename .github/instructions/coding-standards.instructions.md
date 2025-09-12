---
applyTo: '**/components/**/*.tsx'
---

# Coding Standards - Glide

> **Reference**: Based on [SonarSource TypeScript Rules](https://rules.sonarsource.com/typescript/) for code quality and security standards.

## TypeScript Standards

### Type Safety (SonarQube Compliant)

```typescript
// NEVER: Using any type
interface ComponentProps {
  data: any; // Breaks type safety
}

// ALWAYS: Explicit typing with union types
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  orientation?: 'horizontal' | 'vertical';
  isDisabled?: boolean;
  onValueChange?: (value: string) => void;
}
```

### Null Safety

```typescript
// NEVER: Access without null checks
const Component = ({ user }: { user: User }) => (
  <div>{user.name.length}</div> // Runtime error if user.name is null
);

// ALWAYS: Optional chaining and conditional rendering
const Component = ({ user }: { user: User }) => (
  <div>
    {user?.name && <span>{user.name}</span>}
    <p>Length: {user?.name?.length ?? 0}</p>
  </div>
);
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

Label.displayName = 'Label';
```

### Hooks Rules

```typescript
// NEVER: Hooks inside conditions or loops
const Component = ({ shouldUseState }: { shouldUseState: boolean }) => {
  if (shouldUseState) {
    const [state, setState] = useState(0); // Breaks rules of hooks
  }
  return <div>Content</div>;
};

// ALWAYS: Hooks at top level with functional updates
const Component = ({ shouldUseState }: { shouldUseState: boolean }) => {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(prevCount => prevCount + 1); // Functional update
  }, []);

  useEffect(() => {
    // Effect logic with cleanup
    return () => {
      // Cleanup
    };
  }, [count]); // Clear dependency justification

  return <div>{shouldUseState ? count : null}</div>;
};
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

### Compound Pattern (Glide Standard)

```typescript
// NEVER: Monolithic component
function ComplexComponent() {
  return (
    <div>
      <header>...</header>
      <main>...</main>
      <footer>...</footer>
    </div>
  );
}

// ALWAYS: Compound pattern
const Dialog = ({ children, ...props }: DialogProps) => (
  <div role="dialog" {...props}>{children}</div>
);

const DialogHeader = ({ children }: DialogHeaderProps) => (
  <header>{children}</header>
);

const DialogContent = ({ children }: DialogContentProps) => (
  <main>{children}</main>
);

Dialog.Header = DialogHeader;
Dialog.Content = DialogContent;
```

### Headless Pattern

```typescript
// NEVER: Styling in component logic
const Button = ({ variant }: ButtonProps) => {
  const className = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return <button className={className} />;
};

// ALWAYS: Headless pattern - data attributes only
const Button = ({ variant, className, ...props }: ButtonProps) => {
  return (
    <button
      className={className}
      data-variant={variant}
      {...props}
    />
  );
};
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

### Rendering Best Practices

```typescript
// NEVER: Missing keys in dynamic lists
const ItemList = ({ items }: { items: Item[] }) => (
  <ul>
    {items.map((item, index) =>
      <ListItem data={item} /> // Missing key!
    )}
  </ul>
);

// ALWAYS: Stable unique keys
const ItemList = ({ items }: { items: Item[] }) => (
  <ul>
    {items.map(item =>
      <ListItem key={item.id} data={item} />
    )}
  </ul>
);

// NEVER: Inline functions causing unnecessary re-renders
const Component = ({ items }: { items: Item[] }) => (
  <div>
    {items.map(item =>
      <button key={item.id} onClick={() => handleClick(item.id)}>
        {item.name}
      </button>
    )}
  </div>
);

// ALWAYS: Memoized event handlers
const Component = ({ items }: { items: Item[] }) => {
  const handleItemClick = useCallback((id: string) => {
    handleClick(id);
  }, []);

  return (
    <div>
      {items.map(item =>
        <ItemButton
          key={item.id}
          item={item}
          onClick={handleItemClick}
        />
      )}
    </div>
  );
};
```

## Import/Export Standards

### Module Exports

```typescript
// ALWAYS: Index files for clean imports
// packages/glide/src/components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';

// ALWAYS: Index files for clean imports
// packages/glide/src/components/index.ts
export * from './Button';
export * from './Dialog';
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

## ESLint Configuration

Required ESLint rules for quality compliance:

```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/no-autofocus": "off"
  }
}
```
