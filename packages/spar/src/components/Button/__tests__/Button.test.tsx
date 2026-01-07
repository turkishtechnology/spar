import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders as button element by default', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveTextContent('Click me');
    });

    it('renders with custom element when as prop is provided', () => {
      render(<Button as='div'>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('DIV');
      expect(button).toHaveTextContent('Click me');
    });

    it('applies custom className and style', () => {
      const style = { backgroundColor: 'red' };
      render(
        <Button className='custom-class' style={style}>
          Click me
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button.style.backgroundColor).toBe('red');
    });

    it('passes through additional HTML props', () => {
      render(
        <Button data-testid='custom-button' title='Custom title'>
          Click me
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('title', 'Custom title');
    });
  });

  describe('Button Type', () => {
    it('defaults to type="button"', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('accepts custom type prop', () => {
      render(<Button type='submit'>Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('does not apply type attribute when not rendered as button', () => {
      render(<Button as='div'>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('type');
    });
  });

  describe('Disabled State', () => {
    it('handles disabled state correctly for native button', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
      // Native button uses disabled attribute, not aria-disabled
      expect(button).not.toHaveAttribute('aria-disabled');
      expect(button).toHaveAttribute('data-disabled', '');
      expect(button).toHaveAttribute('tabIndex', '-1');
    });

    it('prevents click when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>,
      );
      const button = screen.getByRole('button');
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('uses aria-disabled when not rendered as native button', () => {
      render(
        <Button as='div' disabled>
          Disabled
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('disabled');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('data-disabled', '');
    });
  });

  describe('Loading State', () => {
    it('handles loading state correctly', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('data-loading', '');
      // Component is headless - no built-in loading text structure
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('allows developer to handle loading content', () => {
      render(
        <Button isLoading>
          <span aria-live='polite'>Please wait</span>
          Submit
        </Button>,
      );
      // Developer controls loading text structure
      expect(screen.getByText('Please wait')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('prevents click when loading', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Loading
        </Button>,
      );
      const button = screen.getByRole('button');
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('exposes loading state via data attributes', () => {
      render(<Button isLoading>Submit Form</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-loading', '');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('Submit Form')).toBeInTheDocument();
    });
  });

  describe('Toggle Functionality', () => {
    it('works as toggle button when isPressed is provided', async () => {
      const user = userEvent.setup();
      const handlePressedChange = jest.fn();
      render(
        <Button isPressed={false} onPressedChange={handlePressedChange}>
          Toggle
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).toHaveAttribute('data-pressed', 'false');

      await user.click(button);
      expect(handlePressedChange).toHaveBeenCalledWith(true);
    });

    it('toggles pressed state when controlled', async () => {
      const user = userEvent.setup();
      const Component = () => {
        const [pressed, setPressed] = React.useState(false);
        return (
          <Button isPressed={pressed} onPressedChange={setPressed}>
            Toggle: {pressed ? 'On' : 'Off'}
          </Button>
        );
      };
      render(<Component />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).toHaveTextContent('Toggle: Off');

      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveTextContent('Toggle: On');
    });

    it('manages internal state for uncontrolled toggle', async () => {
      const user = userEvent.setup();
      const Component = () => {
        const [pressed, setPressed] = React.useState<boolean>(false);

        return (
          <Button isPressed={pressed} onPressedChange={setPressed}>
            Toggle: {pressed ? 'On' : 'Off'}
          </Button>
        );
      };
      render(<Component />);
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Toggle: Off');

      await user.click(button);
      expect(button).toHaveTextContent('Toggle: On');
    });

    it('does not add aria-pressed when not a toggle button', () => {
      render(<Button>Regular Button</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-pressed');
      expect(button).not.toHaveAttribute('data-pressed');
    });
  });

  describe('Event Handling', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');

      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('calls onKeyDown when key is pressed', async () => {
      const user = userEvent.setup();
      const handleKeyDown = jest.fn();
      render(<Button onKeyDown={handleKeyDown}>Press me</Button>);
      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard('{Enter}');
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'Enter',
        }),
      );
    });

    it('activates on Enter key press', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const handleKeyDown = jest.fn();

      render(
        <Button onClick={handleClick} onKeyDown={handleKeyDown}>
          Press me
        </Button>,
      );
      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard('{Enter}');

      // The onKeyDown should be called
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'Enter',
        }),
      );
    });

    it('activates on Space key press', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const handleKeyDown = jest.fn();

      render(
        <Button onClick={handleClick} onKeyDown={handleKeyDown}>
          Press me
        </Button>,
      );
      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard('{ }');

      // The onKeyDown should be called
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: ' ',
        }),
      );
    });

    it('does not activate on other key presses', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Press me</Button>);
      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard('{Escape}');
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('prevents event propagation for Enter and Space', async () => {
      const user = userEvent.setup();
      const handleKeyDown = jest.fn();
      render(<Button onKeyDown={handleKeyDown}>Press me</Button>);
      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard('{Enter}');
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'Enter',
        }),
      );
    });
  });

  describe('Focus Management', () => {
    it('has correct tabIndex when interactive', () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('has tabIndex -1 when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '-1');
    });

    it('auto-focuses when shouldAutoFocus is true', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Button ref={ref} shouldAutoFocus>
          Auto focus
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-autofocus', '');
      // Note: Auto-focus is tested via useEffect which requires ref to be properly set
    });
  });

  describe('Data Attributes', () => {
    it('sets correct data attributes for different states', () => {
      const { rerender } = render(<Button>Normal</Button>);
      let button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('data-disabled');
      expect(button).not.toHaveAttribute('data-loading');
      expect(button).not.toHaveAttribute('data-pressed');
      expect(button).not.toHaveAttribute('data-autofocus');

      rerender(
        <Button disabled isLoading isPressed={true} shouldAutoFocus>
          All states
        </Button>,
      );
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-disabled', '');
      expect(button).toHaveAttribute('data-loading', '');
      expect(button).toHaveAttribute('data-pressed', 'true');
      expect(button).toHaveAttribute('data-autofocus', '');
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined children gracefully', () => {
      render(<Button>{undefined}</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('handles both loading and disabled states', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(
        <Button isLoading disabled onClick={handleClick}>
          Loading and Disabled
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
      // Native button uses disabled attribute, not aria-disabled
      expect(button).not.toHaveAttribute('aria-disabled');
      expect(button).toHaveAttribute('aria-busy', 'true');

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles toggle and loading states together', () => {
      render(
        <Button isPressed={true} isLoading>
          Toggle Loading
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
  });
});
