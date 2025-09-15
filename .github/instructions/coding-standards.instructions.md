---
applyTo: '**/components/**/*.tsx'
---

# Coding Standards - Glide

> **Reference**: Based on [SonarSource TypeScript Rules](https://rules.sonarsource.com/typescript/) for code quality and security standards.

## TypeScript Standards

### Type Safety (SonarQube Compliant)

```typescript
// ✅ ALWAYS: Explicit typing with union types
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  orientation?: 'horizontal' | 'vertical';
  isDisabled?: boolean;
  onValueChange?: (value: string) => void;
}
```

### Null Safety & Optional Chaining

```typescript
// ✅ ALWAYS: Safe access patterns
const Component = ({ user }: { user: User | null }) => (
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

// LEGACY: Only when supporting React 18
const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => (
  <label ref={ref} {...props} />
));
```

### Hooks Rules

```typescript
// ✅ ALWAYS: Proper hooks usage
const Component = ({ shouldUseState, userId }: Props) => {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(prevCount => prevCount + 1); // Functional update
  }, []);

  // Exhaustive dependencies
  useEffect(() => {
    if (shouldUseState) {
      fetchUser(userId);
    }
    return () => {
      // Cleanup
    };
  }, [shouldUseState, userId]); // All dependencies included

  return <div>{shouldUseState ? count : null}</div>;
};
```

### Rendering Best Practices

```typescript
// ✅ ALWAYS: Stable keys and memoized handlers
const ItemList = ({ items }: { items: Item[] }) => {
  const handleItemClick = useCallback((id: string) => {
    handleClick(id);
  }, []);

  return (
    <ul>
      {items.map(item => (
        <ItemButton
          key={item.id} // Stable unique key
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </ul>
  );
};
```

## Component Architecture

### Component Template

````typescript
import type { ComponentProps } from './Component.types';

/**
 * Brief component description focusing on behavior and accessibility.
 *
 * @example
 * ```tsx
 * <Component orientation="vertical" isDisabled={false}>
 *   Content
 * </Component>
 * ```
 */
export const Component = ({
  orientation = 'horizontal',
  isDisabled = false,
  children,
  ...props
}: ComponentProps) => {
  return (
    <div
      data-orientation={orientation}
      data-disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {children}
    </div>
  );
};

Component.displayName = 'Component';
````

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

### Compound Pattern

```typescript
// ✅ ALWAYS: Compound pattern for complex components
const Dialog = ({ children, ...props }: DialogProps) => (
  <div role="dialog" {...props}>{children}</div>
);

const DialogHeader = ({ children }: DialogHeaderProps) => (
  <header>{children}</header>
);

const DialogContent = ({ children }: DialogContentProps) => (
  <main>{children}</main>
);

// Compound composition
Dialog.Header = DialogHeader;
Dialog.Content = DialogContent;

export { Dialog };
```

## State Management

### Complex State

```typescript
// ✅ ALWAYS: Discriminated unions for complex state
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: unknown }
  | { status: 'error'; error: Error };

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

### Styling Approach

```typescript
// ✅ ALWAYS: Pure behavior, zero styling
const Button = ({ children, ...props }: ButtonProps) => (
  <button {...props}>{children}</button>
);

// ✅ ALWAYS: Provide data attributes for external styling
const Button = ({ variant, isDisabled, children, ...props }: ButtonProps) => (
  <button
    data-variant={variant}
    data-disabled={isDisabled}
    data-state={isDisabled ? 'disabled' : 'enabled'}
    {...props}
  >
    {children}
  </button>
);
```

## Naming Conventions

### Components and Types

- **Components**: PascalCase (`Button`, `DialogOverlay`)
- **Props**: PascalCase + "Props" suffix (`ButtonProps`)
- **Hooks**: camelCase + "use" prefix (`useButton`, `useDialog`)
- **Utilities**: camelCase (`formatDate`, `validateEmail`)
- **Handlers** : handle + Action ( `handleClick`, `handleSubmit` )
- **Booleans** : is/has/should/can ( `isDisabled`, `hasError` )
- **Types** : PascalCase ( `Orientation`, `Variant` )

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

### XSS Prevention

```typescript
// ❌ NEVER: Unsafe HTML injection
const Component = ({ htmlContent }: { htmlContent: string }) => (
  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
);

// ✅ ALWAYS: Sanitized content or safe alternatives
import DOMPurify from 'dompurify';

const Component = ({ htmlContent }: { htmlContent: string }) => (
  <div dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(htmlContent)
  }} />
);
```

## Accessibility

### Event Handler Naming

```typescript
// ❌ NEVER: Non-standard event handler names
interface ButtonProps {
  click?: () => void; // Should start with "on"
  handlePress?: () => void; // Not a prop name
}

// ✅ ALWAYS: Standard event handler naming
interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onPress?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onValueChange?: (value: string) => void;
}
```

### ARIA Compliance

```typescript
// ✅ ALWAYS: Proper ARIA attributes
const Button = ({
  isPressed,
  isExpanded,
  children,
  'aria-label': ariaLabel,
  ...props
}: ButtonProps) => (
  <button
    aria-pressed={isPressed}
    aria-expanded={isExpanded}
    aria-label={ariaLabel}
    {...props}
  >
    {children}
  </button>
);
```

## 🔧 ESLint Configuration

Required rules for SonarQube compliance:

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
