---
applyTo: 'packages/**/src/**/*.{ts,tsx}'
---

# Performance Instructions - TK Headless

<identity>
You are optimizing performance in TK Headless.
Performance improvements MUST be measured and verified.
NEVER sacrifice accessibility for performance.
</identity>

## Performance Optimization Process

### 1. Performance Analysis

**BEFORE optimizing:**

1. Measure current performance baseline
2. Identify actual bottlenecks (not assumed)
3. Profile component render times
4. Analyze bundle size impact
5. Check memory usage patterns

### 2. Measurement Tools

**Use these tools:**

- React DevTools Profiler
- Chrome Performance tab
- Lighthouse CI
- Bundle analyzer
- Custom performance marks

```typescript
// Performance measurement example
performance.mark('ComponentStart');
// Component logic
performance.mark('ComponentEnd');
performance.measure('ComponentRender', 'ComponentStart', 'ComponentEnd');
```

### 3. Common Performance Optimizations

#### React.memo for Pure Components

```typescript
// BEFORE: Re-renders on every parent render
export const Button = (props: ButtonProps) => {
  return <button {...props} />;
};

// AFTER: Only re-renders when props change
export const Button = React.memo((props: ButtonProps) => {
  return <button {...props} />;
});
```

#### useMemo for Expensive Calculations

```typescript
// BEFORE: Recalculates on every render
const Component = ({ items }) => {
  const expensiveValue = items.reduce((acc, item) => {
    return acc + complexCalculation(item);
  }, 0);
};

// AFTER: Only recalculates when items change
const Component = ({ items }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + complexCalculation(item);
    }, 0);
  }, [items]);
};
```

#### useCallback for Stable References

```typescript
// BEFORE: New function reference every render
const Component = ({ onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick(e);
  };
};

// AFTER: Stable function reference
const Component = ({ onClick }) => {
  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      onClick(e);
    },
    [onClick],
  );
};
```

### 4. Bundle Size Optimization

#### Dynamic Imports

```typescript
// BEFORE: Everything loaded upfront
import { HeavyComponent } from './HeavyComponent';

// AFTER: Loaded when needed
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Usage with Suspense
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

#### Tree Shaking

```typescript
// BEFORE: Import entire library
import * as utils from '@tk-headless/utils';

// AFTER: Import only what's needed
import { mergeProps, useId } from '@tk-headless/utils';
```

### 5. Render Optimization

#### Virtualization for Long Lists

```typescript
// For lists with many items
import { VirtualList } from '@tk-headless/virtual';

const LongList = ({ items }) => {
  return (
    <VirtualList
      items={items}
      itemHeight={50}
      renderItem={(item) => <ListItem {...item} />}
    />
  );
};
```

#### Debouncing Updates

```typescript
// BEFORE: Updates on every keystroke
const SearchInput = ({ onSearch }) => {
  return <input onChange={(e) => onSearch(e.target.value)} />;
};

// AFTER: Debounced updates
const SearchInput = ({ onSearch }) => {
  const debouncedSearch = useMemo(
    () => debounce(onSearch, 300),
    [onSearch]
  );

  return <input onChange={(e) => debouncedSearch(e.target.value)} />;
};
```

### 6. State Management Performance

#### Avoid Unnecessary State

```typescript
// BEFORE: State causes re-renders
const [derivedValue, setDerivedValue] = useState(calculateValue(props));

useEffect(() => {
  setDerivedValue(calculateValue(props));
}, [props]);

// AFTER: Derive during render
const derivedValue = calculateValue(props);
```

### 7. Performance Testing

**Required performance tests:**

```typescript
describe('Performance', () => {
  it('should render within performance budget', () => {
    const start = performance.now();
    render(<Component {...largeProps} />);
    const end = performance.now();

    expect(end - start).toBeLessThan(100); // 100ms budget
  });

  it('should not exceed memory limit', () => {
    const initialMemory = performance.memory.usedJSHeapSize;
    const { unmount } = render(<Component />);
    unmount();

    const finalMemory = performance.memory.usedJSHeapSize;
    expect(finalMemory - initialMemory).toBeLessThan(1000000); // 1MB
  });
});
```

### 8. Performance Checklist

Before committing performance changes:

- [ ] Baseline performance measured
- [ ] Improvement quantified (X% faster)
- [ ] No functionality regression
- [ ] No accessibility regression
- [ ] Bundle size impact checked
- [ ] Memory usage verified
- [ ] Performance tests added
- [ ] Documentation updated

### 9. Performance Budget

**Component performance budgets:**

- Initial render: < 100ms
- Re-render: < 16ms
- Bundle size contribution: < 10KB gzipped
- Memory usage: < 1MB per instance

### 10. Anti-Patterns to Avoid

**DON'T do these:**

- Premature optimization
- Inline function definitions in render
- Large objects as dependencies
- Synchronous expensive operations
- Blocking the main thread

<reminders>
REMEMBER: Measure before and after optimization.
REMEMBER: User-perceived performance matters most.
REMEMBER: Accessibility is never negotiable for performance.
REMEMBER: Update tracking per [Post-Task Instructions](./post-task.instructions.md).
</reminders>
