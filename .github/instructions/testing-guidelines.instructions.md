```instructions
# Testing Guidelines - Glide

## Context
Every component requires comprehensive testing: **Unit**, **Accessibility**, and **Integration** tests. No component ships without full test coverage.

## Coverage Requirements
- **Statements**: 90%
- **Branches**: 90%
- **Functions**: 90%
- **Lines**: 90%

## Test Structure
Each component must have 3 test files in `__tests__/` directory:
```

Component/
├── **tests**/
│ ├── Component.test.tsx # Unit tests
│ ├── Component.a11y.test.tsx # Accessibility tests  
│ └── Component.integration.test.tsx # Integration tests

````

## Testing Tools
- **Framework**: Jest + React Testing Library
- **A11y**: jest-axe (mandatory, zero violations)
- **Interactions**: userEvent (prefer over fireEvent)
- **Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`

## Test Examples

**Basic Test Pattern:**
```tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';

expect.extend(toHaveNoViolations);

describe('Component', () => {
  it('renders and handles interactions', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Component onClick={handleClick}>Click</Component>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalled();
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<Component>Content</Component>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
````

## Mandatory Test Categories

### 1. Unit Tests (`Component.test.tsx`)

- Rendering with different props
- Event handling (onClick, onKeyDown, etc.)
- State changes and prop validation
- Edge cases and error handling
- API surface testing

### 2. Accessibility Tests (`Component.a11y.test.tsx`)

- **jest-axe**: Zero violations (mandatory)
- ARIA attributes and roles
- Keyboard navigation (Enter, Space, arrows, Escape)
- Focus management
- Screen reader announcements

### 3. Integration Tests (`Component.integration.test.tsx`)

- Form integration
- Multi-component interactions
- Event propagation
- Async operations
- Real-world usage scenarios

## Error Boundary Testing

```tsx
it('should throw error for invalid props', () => {
  jest.spyOn(console, 'error').mockImplementation();
  expect(() =>
    render(
      <Button isIconOnly>
        <Icon />
      </Button>,
    ),
  ).toThrow('Icon-only buttons must have an aria-label');
});
```

## Testing Best Practices

1. **Use Testing Library queries correctly:**
   - Prefer `getByRole` for accessibility
   - Use `getByLabelText` for form controls
   - Avoid `getByTestId` unless necessary

2. **Test user behavior, not implementation:**
   - Click buttons, don't call onClick directly
   - Type in inputs, don't set value directly
   - Focus on what users see and do

3. **Use userEvent for realistic interactions:**

   ```tsx
   const user = userEvent.setup();
   await user.click(button);
   ```

4. **Clean up after tests:**
   ```tsx
   afterEach(() => jest.clearAllMocks());
   ```

## Running Tests

**Root level (Turborepo):**

```bash
# Run tests across all workspace packages
pnpm exec turbo test

# Run tests for specific package only
pnpm exec turbo test --filter=@turkish-technology/glide

# Alternative: Navigate to package first
cd packages/glide
pnpm test
```

**Package level (packages/glide):**

```bash
# Check available test scripts
pnpm run

# Available test commands:
pnpm test                    # All tests
pnpm test:coverage          # With coverage
pnpm test:watch            # Watch mode
pnpm test:unit             # Unit tests (all test files)
pnpm test:integration      # Integration tests only
pnpm test:a11y-unit       # A11y tests only
```

**Prerequisites:** Run `pnpm install` at root level first to install all dependencies.

Every component ships with complete test coverage. No exceptions.

```

```
