---
applyTo: '**/*.test.{ts,tsx}, **/*.spec.{ts,tsx}, **/__tests__/**/*.{ts,tsx}'
---

# Testing Instructions - TK Headless

<identity>
You are writing tests for TK Headless components.
Tests MUST cover functionality, accessibility, and edge cases.
NEVER ship untested code.
</identity>

## Testing Requirements

### 1. Test Coverage Requirements

**Minimum coverage targets:**

- Statements: 90%
- Branches: 85%
- Functions: 90%
- Lines: 90%

**MUST test:**

- All public APIs
- All user interactions
- All accessibility features
- All error scenarios
- All edge cases

### 2. Test File Structure

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  // Component rendering tests
  describe('Rendering', () => {
    it('should render with default props', () => {
      // Test implementation
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    it('should handle click events', async () => {
      // Test implementation
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      // Test implementation
    });
  });

  // Keyboard navigation tests
  describe('Keyboard Navigation', () => {
    it('should activate on Enter key', () => {
      // Test implementation
    });
  });

  // State management tests
  describe('States', () => {
    it('should handle loading state', () => {
      // Test implementation
    });
  });
});
```

### 3. Accessibility Testing

**EVERY component test file MUST include:**

```typescript
describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(<Button isLoading>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('should announce to screen readers', () => {
    render(<Button isLoading loadingText="Saving...">Save</Button>);
    expect(screen.getByRole('status')).toHaveTextContent('Saving...');
  });
});
```

### 4. Keyboard Testing

**Test ALL keyboard interactions:**

```typescript
describe('Keyboard Navigation', () => {
  it('should activate on Enter key', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should activate on Space key', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: ' ' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not activate when disabled', () => {
    const handleClick = jest.fn();
    render(<Button isDisabled onClick={handleClick}>Click</Button>);

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### 5. State Testing

**Test ALL component states:**

```typescript
describe('Component States', () => {
  it('should handle disabled state', () => {
    const { rerender } = render(<Button>Click</Button>);
    const button = screen.getByRole('button');

    expect(button).not.toHaveAttribute('aria-disabled');

    rerender(<Button isDisabled>Click</Button>);
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should handle loading state', async () => {
    const { rerender } = render(<Button>Save</Button>);

    rerender(<Button isLoading>Save</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
```

### 6. Error Boundary Testing

```typescript
describe('Error Handling', () => {
  it('should throw error for icon-only button without aria-label', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<Button isIconOnly><Icon /></Button>);
    }).toThrow('Icon-only buttons must have an aria-label');

    consoleSpy.mockRestore();
  });
});
```

### 7. Integration Testing

Test component integration with others:

```typescript
describe('Integration', () => {
  it('should work within a form', async () => {
    const handleSubmit = jest.fn();

    render(
      <form onSubmit={handleSubmit}>
        <input name="email" />
        <Button type="submit">Submit</Button>
      </form>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
```

### 8. Snapshot Testing

Use sparingly for stable UI:

```typescript
it('should match snapshot', () => {
  const { container } = render(
    <Button variant="primary" size="md">
      Click me
    </Button>
  );

  expect(container.firstChild).toMatchSnapshot();
});
```

### 9. Performance Testing

```typescript
describe('Performance', () => {
  it('should not re-render unnecessarily', () => {
    const renderSpy = jest.fn();

    function TestComponent() {
      renderSpy();
      return <Button>Click</Button>;
    }

    const { rerender } = render(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(1);

    rerender(<TestComponent />);
    expect(renderSpy).toHaveBeenCalledTimes(2); // Should use React.memo
  });
});
```

## Test File Location

All component test files MUST be placed under a `__tests__` subfolder within the component directory. For example:

```
components/
  Dialog/
    Dialog.tsx
    __tests__/
      Dialog.test.tsx
```

Do NOT use `tests` or place test files in the component root.

## Testing Best Practices

1. **Use Testing Library queries correctly:**
   - Prefer `getByRole` for accessibility
   - Use `getByLabelText` for form controls
   - Avoid `getByTestId` unless necessary

2. **Test user behavior, not implementation:**
   - Click buttons, don't call onClick directly
   - Type in inputs, don't set value directly
   - Focus on what users see and do

3. **Clean up after tests:**

   ```typescript
   afterEach(() => {
     jest.clearAllMocks();
   });
   ```

4. **Use userEvent for realistic interactions:**
   ```typescript
   const user = userEvent.setup();
   await user.click(button);
   await user.type(input, 'Hello');
   ```

<reminders>
REMEMBER: Tests are documentation of behavior.
REMEMBER: Test accessibility FIRST, not last.
REMEMBER: Every bug should become a test.
REMEMBER: Update tracking per [Post-Task Instructions](./post-task.instructions.md).
</reminders>
