import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a native button by default and uses type="button"', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });

    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('tabIndex', '0');
  });

  it('supports polymorphic rendering with accessible button semantics', () => {
    render(
      <Button as='div' id='custom-action' title='Custom action'>
        Custom action
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Custom action' });

    expect(button.tagName).toBe('DIV');
    expect(button).toHaveAttribute('id', 'custom-action');
    expect(button).toHaveAttribute('role', 'button');
    expect(button).not.toHaveAttribute('type');
  });

  it('prevents activation while disabled or loading', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const onPressedChange = jest.fn();

    render(
      <>
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
        <Button isLoading isPressed={false} onPressedChange={onPressedChange} onClick={onClick}>
          Loading toggle
        </Button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Disabled' }));
    await user.click(screen.getByRole('button', { name: 'Loading toggle' }));

    expect(onClick).not.toHaveBeenCalled();
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it('activates on Enter and Space, but not on unrelated keys', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const onKeyDown = jest.fn();

    render(
      <Button as='div' onClick={onClick} onKeyDown={onKeyDown}>
        Keyboard trigger
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Keyboard trigger' });
    button.focus();

    await user.keyboard('{Enter}');
    await user.keyboard('{ }');
    await user.keyboard('{Escape}');

    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter' }));
    expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: ' ' }));
    expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Escape' }));
  });

  it('supports controlled toggle contract with aria-pressed', async () => {
    const user = userEvent.setup();

    const ControlledToggle = () => {
      const [pressed, setPressed] = React.useState(false);
      return (
        <Button isPressed={pressed} onPressedChange={setPressed}>
          Toggle: {pressed ? 'On' : 'Off'}
        </Button>
      );
    };

    render(<ControlledToggle />);
    const button = screen.getByRole('button', { name: 'Toggle: Off' });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);

    expect(screen.getByRole('button', { name: 'Toggle: On' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('keeps pressed state prop-driven when no onPressedChange is provided', async () => {
    const user = userEvent.setup();
    render(<Button isPressed={false}>Static toggle</Button>);

    const button = screen.getByRole('button', { name: 'Static toggle' });
    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies autofocus behavior and state data attribute', async () => {
    render(<Button autoFocus>Auto focus</Button>);
    const button = screen.getByRole('button', { name: 'Auto focus' });

    await waitFor(() => {
      expect(button).toHaveFocus();
    });
    expect(button).toHaveAttribute('data-autofocus', '');
  });

  it('exposes stable displayName', () => {
    expect(Button.displayName).toBe('Button');
  });
});
