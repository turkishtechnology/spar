---
applyTo: 'packages/**/src/**/*.{ts,tsx}'
---

# Feature Development Instructions - TK Headless

<identity>
You are implementing a new feature for TK Headless.
Features MUST be fully accessible and type-safe.
NEVER compromise on quality for speed.
</identity>

## Feature Development Process

### 1. Pre-Development Analysis

Before writing ANY code:

- Review existing similar components for patterns
- Identify accessibility requirements from WCAG 2.1
- Research ARIA authoring practices for the component type
- Plan the TypeScript interface structure
- Consider all possible states and edge cases

### 2. Development Checklist

**REQUIRED for every feature:**

- [ ] TypeScript interfaces defined
- [ ] Props documented with JSDoc
- [ ] Keyboard navigation implemented
- [ ] ARIA attributes complete
- [ ] Focus management handled
- [ ] Error boundaries implemented
- [ ] Loading states accessible
- [ ] Ref forwarding supported
- [ ] Controlled/uncontrolled modes
- [ ] Custom hook created
- [ ] Zero runtime errors
- [ ] No TypeScript errors

### 3. Implementation Order

1. **Type Definitions First**

   ```typescript
   // Start with comprehensive types
   interface ComponentProps {
     // All props with JSDoc
   }

   interface ComponentState {
     // All possible states
   }
   ```

2. **Hook Implementation**

   ```typescript
   // Create the logic hook
   export function useComponent(props: ComponentProps) {
     // State management
     // Event handlers
     // ARIA props
     // Return standardized interface
   }
   ```

3. **Component Implementation**
   ```typescript
   // Implement the headless component
   export const Component = forwardRef<HTMLElement, ComponentProps>((props, ref) => {
     const { componentProps } = useComponent(props);
     // Render with data attributes
   });
   ```

### 4. Accessibility Requirements

**EVERY feature MUST include:**

- Keyboard event handlers (onKeyDown, onKeyUp)
- Proper ARIA roles and properties
- Focus visible indicators via data attributes
- Screen reader announcements for state changes
- Support for high contrast mode
- Respect for prefers-reduced-motion

### 5. State Management

Features MUST handle:

- Initial state
- Loading state
- Error state
- Success state
- Disabled state
- Interactive states (hover, focus, active)

### 6. Testing Requirements

Before marking feature complete:

- [ ] Unit tests achieve 90%+ coverage
- [ ] Accessibility tests pass (jest-axe)
- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] Cross-browser tested
- [ ] RTL layout tested

### 7. Documentation Requirements

**MUST document:**

- Component purpose and use cases
- Complete props table with types
- Accessibility features
- Keyboard shortcuts table
- Usage examples (basic and advanced)
- Migration guide (if replacing existing)

## Common Patterns

### Error Handling Pattern

```typescript
try {
  // Feature logic
} catch (error) {
  console.error(`[TKHeadless.${ComponentName}]:`, error);
  // Graceful fallback
}
```

### Event Handler Pattern

```typescript
const handleEvent = useCallback(
  (event: React.SomeEvent) => {
    if (isDisabled || isLoading) return;

    event.preventDefault();
    // Handle event

    // Announce to screen readers if needed
    announce('Action completed');
  },
  [isDisabled, isLoading],
);
```

### Ref Handling Pattern

```typescript
const componentRef = useRef<HTMLElement>(null);
const mergedRef = useMergeRefs(ref, componentRef, internalRef);
```

## Feature Validation

Before submitting:

1. Run `pnpm test` - all tests pass
2. Run `pnpm lint` - no errors
3. Run `pnpm typecheck` - no TypeScript errors
4. Test with keyboard only
5. Test with screen reader
6. Update tracking files per [Post-Task Instructions](./post-task.instructions.md)

<reminders>
REMEMBER: Features are NOT complete without tests and documentation.
REMEMBER: Accessibility is a FEATURE, not an enhancement.
REMEMBER: TypeScript types are part of the API contract.
</reminders>
