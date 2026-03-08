import { render, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('has no axe violations in core states', async () => {
    const { container, rerender } = render(<Button>Action</Button>);
    expect(await axe(container)).toHaveNoViolations();

    rerender(<Button disabled>Action</Button>);
    expect(await axe(container)).toHaveNoViolations();

    rerender(<Button isLoading>Action</Button>);
    expect(await axe(container)).toHaveNoViolations();

    rerender(<Button as='div'>Action</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps a valid accessible name across states', () => {
    const { rerender } = render(<Button>Save changes</Button>);
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();

    rerender(<Button isLoading>Save changes</Button>);
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
  });

  it('applies correct ARIA attributes for native and custom disabled buttons', () => {
    const { rerender } = render(<Button disabled>Native disabled</Button>);
    const nativeButton = screen.getByRole('button', { name: 'Native disabled' });
    expect(nativeButton).toHaveAttribute('disabled');
    expect(nativeButton).not.toHaveAttribute('aria-disabled');

    rerender(
      <Button as='div' disabled>
        Custom disabled
      </Button>,
    );
    const customButton = screen.getByRole('button', { name: 'Custom disabled' });
    expect(customButton).not.toHaveAttribute('disabled');
    expect(customButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('exposes loading and toggle states for assistive technologies', () => {
    const { rerender } = render(<Button isLoading>Loading action</Button>);
    let button = screen.getByRole('button', { name: 'Loading action' });

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-live', 'polite');

    rerender(<Button isPressed={true}>Pinned</Button>);
    button = screen.getByRole('button', { name: 'Pinned' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports keyboard activation for non-native button semantics', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <Button as='div' onClick={onClick}>
        Keyboard action
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Keyboard action' });
    button.focus();

    await user.keyboard('{Enter}');
    await user.keyboard('{ }');

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('manages focus with tabIndex and autoFocus', async () => {
    render(
      <>
        <Button>First</Button>
        <Button autoFocus>Second</Button>
      </>,
    );

    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('tabIndex', '0');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
    });
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('data-autofocus', '');
  });

  it('updates aria-pressed in a controlled toggle flow', async () => {
    const user = userEvent.setup();

    const ToggleExample = () => {
      const [pressed, setPressed] = React.useState(false);
      return (
        <Button isPressed={pressed} onPressedChange={setPressed}>
          {pressed ? 'On' : 'Off'}
        </Button>
      );
    };

    render(<ToggleExample />);
    const button = screen.getByRole('button', { name: 'Off' });

    expect(button).toHaveAttribute('aria-pressed', 'false');
    await user.click(button);
    expect(screen.getByRole('button', { name: 'On' })).toHaveAttribute('aria-pressed', 'true');
  });
});
