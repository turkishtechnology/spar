---
applyTo: 'packages/**/src/**/*.{ts,tsx}'
---

# Refactoring Instructions - TK Headless

<identity>
You are refactoring code in TK Headless.
Refactoring MUST improve code quality without changing behavior.
ALWAYS maintain backward compatibility unless explicitly approved.
</identity>

## Refactoring Guidelines

### 1. Refactoring Principles

**Valid reasons to refactor:**

- Improve code readability
- Reduce complexity
- Eliminate duplication
- Improve performance
- Enhance maintainability
- Better separation of concerns
- Align with new patterns

**NOT valid reasons:**

- Personal preference alone
- "Might need it later"
- Different but not better

### 2. Pre-Refactoring Checklist

**BEFORE starting any refactor:**

- [ ] All tests pass
- [ ] Code coverage is adequate
- [ ] Behavior is well understood
- [ ] Changes are scoped properly
- [ ] Backward compatibility plan exists
- [ ] Performance baseline measured

### 3. Common Refactoring Patterns

#### Extract Custom Hook

```typescript
// BEFORE: Logic mixed in component
const Button = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsPressed(true);
    }
  };
  // More logic...
};

// AFTER: Logic extracted to hook
const useButton = (props) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const buttonProps = {
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsPressed(true);
      }
    },
    // More props...
  };

  return { buttonProps, isPressed, isFocused };
};

const Button = (props) => {
  const { buttonProps } = useButton(props);
  return <button {...buttonProps} />;
};
```

#### Extract Constants

```typescript
// BEFORE: Magic numbers
if (delay > 5000) {
  timeout = 5000;
}

// AFTER: Named constants
const MAX_DELAY = 5000;
const DEFAULT_TIMEOUT = 5000;

if (delay > MAX_DELAY) {
  timeout = DEFAULT_TIMEOUT;
}
```

#### Simplify Conditionals

```typescript
// BEFORE: Nested conditionals
if (isLoading) {
  if (hasError) {
    return <Error />;
  } else {
    return <Loading />;
  }
} else {
  if (hasData) {
    return <Data />;
  } else {
    return <Empty />;
  }
}

// AFTER: Early returns
if (isLoading && hasError) return <Error />;
if (isLoading) return <Loading />;
if (hasData) return <Data />;
return <Empty />;
```

### 4. Component Refactoring

#### Split Large Components

```typescript
// BEFORE: Monolithic component
const Form = () => {
  // 500 lines of mixed concerns
};

// AFTER: Composed components
const Form = () => {
  return (
    <>
      <FormHeader />
      <FormBody />
      <FormFooter />
    </>
  );
};
```

#### Extract Shared Logic

```typescript
// BEFORE: Duplicated logic
const ButtonA = () => {
  const handleKeyboard = () => {
    /* logic */
  };
};

const ButtonB = () => {
  const handleKeyboard = () => {
    /* same logic */
  };
};

// AFTER: Shared hook
const useKeyboardHandler = () => {
  return { handleKeyboard };
};
```

### 5. Type Refactoring

#### Consolidate Types

```typescript
// BEFORE: Scattered types
interface ButtonProps {
  variant: string;
}
interface LinkProps {
  variant: string;
}

// AFTER: Shared types
type Variant = 'primary' | 'secondary';
interface ButtonProps {
  variant: Variant;
}
interface LinkProps {
  variant: Variant;
}
```

### 6. Performance Refactoring

#### Memoization

```typescript
// BEFORE: Expensive recalculation
const Component = ({ items }) => {
  const sorted = items.sort((a, b) => a.value - b.value);
};

// AFTER: Memoized calculation
const Component = ({ items }) => {
  const sorted = useMemo(() => items.sort((a, b) => a.value - b.value), [items]);
};
```

### 7. Testing After Refactoring

**REQUIRED tests:**

1. All existing tests still pass
2. Behavior unchanged tests
3. Performance benchmarks
4. Integration tests
5. Backward compatibility tests

### 8. Migration Guide

**For breaking changes, provide:**

````markdown
## Migration from v1 to v2

### Changed: useButton hook signature

```diff
- const { props } = useButton(onClick);
+ const { buttonProps } = useButton({ onClick });
```
````

### Why: Better extensibility and consistency

### When: Required immediately

### Effort: Low - Find and replace

````

### 9. Refactoring Checklist

**Before committing:**
- [ ] All tests pass
- [ ] No behavior changes
- [ ] Code is cleaner/simpler
- [ ] Performance unchanged or improved
- [ ] Backward compatible (or migration guide)
- [ ] Documentation updated
- [ ] Types are correct
- [ ] No accessibility regressions

### 10. Gradual Refactoring

**For large refactors:**
1. Create compatibility layer
2. Mark old API as deprecated
3. Migrate incrementally
4. Remove deprecated code later

```typescript
/**
 * @deprecated Use `useButton` instead. Will be removed in v3.0.
 */
export const useOldButton = (props) => {
  console.warn('useOldButton is deprecated. Use useButton instead.');
  return useButton(props);
};
````

<reminders>
REMEMBER: Refactoring is about improving code, not changing behavior.
REMEMBER: Always maintain backward compatibility when possible.
REMEMBER: Small, incremental refactors are safer than big rewrites.
REMEMBER: Update tracking per [Post-Task Instructions](./post-task.instructions.md).
</reminders>
