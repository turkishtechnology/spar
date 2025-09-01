---
mode: 'agent'
description: 'Write comprehensive tests for existing components'
tools: ['codebase']
---

# Test Implementation Prompt

<taskScope>
You are writing tests for an EXISTING component.
Focus ONLY on test coverage and quality.
DO NOT modify the component implementation unless fixing a bug discovered during testing.
ALWAYS follow the instructions in .github/instructions/test.instructions.md file.
</taskScope>

## What to Include

<includeList>
- Unit tests using Jest and React Testing Library
- Integration tests for component interactions
- Accessibility tests (keyboard, ARIA, focus)
- Edge case testing
- Error boundary testing
- Prop validation tests
- Event handler tests
- State management tests
- Snapshot tests where appropriate
- Coverage reports
</includeList>

## What to Exclude

<excludeList>
- Component implementation changes (unless fixing bugs)
- New features
- Documentation updates
- Styling changes
- Performance optimizations
- Refactoring
</excludeList>

## Test Structure

<testStructure>
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
describe('Rendering', () => {
it('should render with default props', () => {});
it('should render with custom props', () => {});
it('should forward ref correctly', () => {});
});

describe('Interactions', () => {
it('should handle click events', () => {});
it('should handle keyboard events', () => {});
it('should manage focus correctly', () => {});
});

describe('Accessibility', () => {
it('should have correct ARIA attributes', () => {});
it('should be keyboard navigable', () => {});
it('should announce changes to screen readers', () => {});
});

describe('State Management', () => {
it('should work in controlled mode', () => {});
it('should work in uncontrolled mode', () => {});
it('should handle state transitions', () => {});
});

describe('Error Handling', () => {
it('should handle invalid props gracefully', () => {});
it('should recover from errors', () => {});
});
});

````
</testStructure>

## Testing Patterns

### Accessibility Testing
```typescript
it('should be keyboard accessible', async () => {
  const user = userEvent.setup();
  render(<ComponentName />);

  const element = screen.getByRole('button');
  await user.tab();
  expect(element).toHaveFocus();

  await user.keyboard('{Enter}');
  // Assert behavior
});
````

### Event Testing

```typescript
it('should call onClick handler', async () => {
  const handleClick = jest.fn();
  render(<ComponentName onClick={handleClick} />);

  const element = screen.getByRole('button');
  await userEvent.click(element);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### ARIA Testing

```typescript
it('should have correct ARIA attributes', () => {
  render(<ComponentName expanded={true} />);

  const element = screen.getByRole('button');
  expect(element).toHaveAttribute('aria-expanded', 'true');
});
```

## Coverage Requirements

<coverageRequirements>
- Minimum 90% code coverage
- 100% coverage for critical paths
- All public API methods tested
- All props combinations tested
- All event handlers tested
- All error boundaries tested
</coverageRequirements>

<reminders>
REMEMBER: Focus ONLY on testing.
REMEMBER: Don't modify implementation unless fixing bugs.
REMEMBER: Test accessibility thoroughly.
REMEMBER: Cover edge cases.
REMEMBER: Use React Testing Library best practices.
</reminders>
