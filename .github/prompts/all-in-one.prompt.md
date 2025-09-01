---
mode: 'agent'
description: 'Create complete production-ready implementation with all features'
tools: ['codebase', 'githubRepo']
---

# All-in-One Comprehensive Implementation Prompt

<taskScope>
You are creating a COMPLETE, PRODUCTION-READY implementation.
This includes core functionality, accessibility, tests, and documentation.
Use this ONLY when explicitly requested with "all-in-one" modifier.
</taskScope>

## Complete Implementation Includes

<comprehensiveList>
### 1. Core Component
- Full TypeScript interfaces and types
- Component structure with all features
- Ref forwarding
- Controlled and uncontrolled modes
- Event handlers
- State management
- Error boundaries
- Composition patterns

### 2. Accessibility (Full)

- Complete ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support
- Live regions
- RTL/LTR support
- Motion preferences

### 3. Tests (Comprehensive)

- Unit tests
- Integration tests
- Accessibility tests
- Edge case coverage
- Error scenarios
- 90%+ coverage

### 4. Documentation

- README with examples
- JSDoc comments
- Props documentation
- Usage examples
- API reference
  </comprehensiveList>

## Implementation Order

<implementationSteps>
1. **Design Phase**
   - Define TypeScript interfaces
   - Plan component structure
   - Design API surface

2. **Core Implementation**
   - Build basic component
   - Add state management
   - Implement core features

3. **Accessibility Layer**
   - Add ARIA attributes
   - Implement keyboard support
   - Add focus management

4. **Testing Suite**
   - Write unit tests
   - Add integration tests
   - Test accessibility

5. **Documentation**
   - Write README
   - Add JSDoc comments
   - Create examples
     </implementationSteps>

## Complete Component Template

````typescript
// types.ts
export interface ComponentNameProps {
  // All props with JSDoc
  /** The value of the component */
  value?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Whether the component is disabled */
  disabled?: boolean;
  // ... more props
}

// Component.tsx
import { forwardRef, useEffect, useRef } from 'react';

/**
 * ComponentName provides [comprehensive description]
 *
 * @example
 * ```tsx
 * <ComponentName value="test" onChange={handleChange} />
 * ```
 */
export const ComponentName = forwardRef<HTMLElement, ComponentNameProps>(
  ({
    value,
    onChange,
    disabled = false,
    ...props
  }, ref) => {
    // State management
    const [internalValue, setInternalValue] = useState(value);

    // Refs for focus management
    const containerRef = useRef<HTMLDivElement>(null);

    // Keyboard handling
    const handleKeyDown = (e: React.KeyboardEvent) => {
      switch(e.key) {
        case 'Enter':
        case ' ':
          // Handle activation
          break;
        case 'Escape':
          // Handle dismissal
          break;
        case 'ArrowDown':
          // Handle navigation
          break;
      }
    };

    // Focus management
    useEffect(() => {
      // Focus trap implementation
    }, []);

    return (
      <div
        ref={ref}
        role="[appropriate-role]"
        aria-label="[descriptive-label]"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        data-disabled={disabled}
        {...props}
      >
        {/* Complete implementation */}
      </div>
    );
  }
);

ComponentName.displayName = 'ComponentName';

// Compound components if applicable
ComponentName.Item = ItemComponent;
ComponentName.Group = GroupComponent;

// Custom hook if applicable
export const useComponentName = () => {
  // Hook implementation
};
````

## Test Suite Template

```typescript
// Component.test.tsx
describe('ComponentName', () => {
  // Comprehensive test coverage
  describe('Rendering', () => {
    it('renders correctly', () => {});
    it('forwards ref', () => {});
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {});
    it('supports keyboard navigation', () => {});
    it('manages focus correctly', () => {});
    it('announces to screen readers', () => {});
  });

  describe('Interactions', () => {
    it('handles user input', () => {});
    it('updates state correctly', () => {});
  });

  describe('Edge Cases', () => {
    it('handles errors gracefully', () => {});
    it('works with edge values', () => {});
  });
});
```

## Quality Checklist

<qualityChecklist>
□ **Core Functionality**
  □ All features implemented
  □ TypeScript fully typed
  □ Ref forwarding works
  □ Controlled/uncontrolled modes

□ **Accessibility**
□ ARIA attributes complete
□ Keyboard fully supported
□ Focus properly managed
□ Screen reader friendly

□ **Testing**
□ 90%+ code coverage
□ All paths tested
□ Accessibility tested
□ Edge cases covered

□ **Documentation**
□ README complete
□ JSDoc present
□ Examples provided
□ API documented

□ **Code Quality**
□ Follows patterns
□ No linting errors
□ Performance optimized
□ Error handling complete
</qualityChecklist>

<reminders>
REMEMBER: This is COMPREHENSIVE mode.
REMEMBER: Include EVERYTHING - core, a11y, tests, docs.
REMEMBER: Follow all best practices.
REMEMBER: Make it production-ready.
REMEMBER: This mode takes more time - be thorough.
</reminders>
