---
mode: 'agent'
description: 'Refactor code for better structure and performance'
---

# Refactor Prompt

<taskScope>
You are refactoring existing code for better structure/performance.
Focus on improving code quality WITHOUT changing external behavior.
DO NOT add new features or modify the public API.
</taskScope>

## Refactoring Goals

<goals>
- Improve code readability
- Enhance maintainability
- Optimize performance
- Reduce complexity
- Follow better patterns
- Eliminate code duplication
- Improve type safety
</goals>

## What to Include

<includeList>
- Code reorganization
- Pattern improvements (e.g., hooks extraction)
- Performance optimizations
- Complexity reduction
- Code deduplication
- Better naming
- Type improvements
- Internal structure improvements
</includeList>

## What to Exclude

<excludeList>
- Public API changes
- New features
- Behavior changes
- Breaking changes
- External dependency updates
- Accessibility additions
- Test additions (unless updating existing)
</excludeList>

## Common Refactoring Patterns

### Extract Custom Hook

```typescript
// BEFORE
const Component = () => {
  const [state, setState] = useState();
  // Complex logic here

  return <div>{/* UI */}</div>;
};

// AFTER
const useComponentLogic = () => {
  const [state, setState] = useState();
  // Complex logic extracted
  return { state, handlers };
};

const Component = () => {
  const { state, handlers } = useComponentLogic();
  return <div>{/* UI */}</div>;
};
```

### Compound Component Pattern

```typescript
// BEFORE
<Component
  header="Title"
  body="Content"
  footer="Footer"
/>

// AFTER
<Component>
  <Component.Header>Title</Component.Header>
  <Component.Body>Content</Component.Body>
  <Component.Footer>Footer</Component.Footer>
</Component>
```

### Reduce Complexity

```typescript
// BEFORE
if (condition1) {
  if (condition2) {
    if (condition3) {
      // Deep nesting
    }
  }
}

// AFTER
if (!condition1) return;
if (!condition2) return;
if (!condition3) return;
// Flat structure
```

### Memoization

```typescript
// BEFORE
const expensiveValue = calculateExpensive(props);

// AFTER
const expensiveValue = useMemo(() => calculateExpensive(props), [props.dependency]);
```

### Type Safety

```typescript
// BEFORE
const handleEvent = (e: any) => {
  // Loose typing
};

// AFTER
const handleEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
  // Proper typing
};
```

## Refactoring Checklist

<checklist>
□ All tests still pass
□ No behavior changes
□ No API changes
□ Code is more readable
□ Complexity reduced
□ Performance improved (if applicable)
□ Types improved
□ No new dependencies
□ Patterns consistent
</checklist>

## Migration Guide (if needed)

If internal changes affect how developers use private APIs:

```typescript
// Migration notes
// OLD: import { internalHelper } from './Component';
// NEW: import { internalHelper } from './Component/utils';
```

<reminders>
REMEMBER: Don't change external behavior.
REMEMBER: Keep public API stable.
REMEMBER: All tests must pass.
REMEMBER: Focus on code quality.
REMEMBER: Document only if migration needed.
</reminders>
