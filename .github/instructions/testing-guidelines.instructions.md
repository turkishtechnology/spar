# Testing Guidelines - Glide

## Test Types Required

- **Unit Tests**: Component logic, props, state, events
- **Accessibility Tests**: jest-axe compliance, keyboard navigation
- **Integration Tests**: User workflows, component interactions

## Testing Tools

- Jest + React Testing Library
- jest-axe for accessibility
- Testing Library Jest DOM

## Requirements

- Test coverage > 90%
- jest-axe zero violations
- All user interactions tested
- Edge cases covered
- Follow RTL patterns

## Test Structure

```typescript
describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<ComponentName onClick={mockFn} />);

    await user.click(screen.getByRole('button'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```

## Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<ComponentName />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```
