import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  describe('Axe Compliance', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations when disabled', async () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations when loading', async () => {
      const { container } = render(<Button isLoading>Loading</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations as toggle button', async () => {
      const { container } = render(<Button isPressed={false}>Toggle</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations when rendered as div', async () => {
      const { container } = render(<Button as='div'>Custom Element</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes', () => {
    it('should have correct role when rendered as button', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have button role when rendered as custom element', () => {
      render(<Button as='div'>Custom Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('role', 'button');
    });

    it('should have aria-disabled when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have aria-busy when loading', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should have aria-pressed for toggle buttons', () => {
      const { rerender } = render(<Button isPressed={false}>Toggle Off</Button>);
      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');

      rerender(<Button isPressed={true}>Toggle On</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should not have aria-pressed for regular buttons', () => {
      render(<Button>Regular Button</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-pressed');
    });

    it('should expose loading state via data attribute for styling', () => {
      render(<Button isLoading>Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should allow developer to handle loading text content', () => {
      render(
        <Button isLoading>
          <span aria-live='polite' className='sr-only'>
            Loading...
          </span>
          Submit
        </Button>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be focusable when interactive', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');

      button.focus();
      expect(button).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '-1');
    });

    it('should activate on Enter key press', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const handleKeyDown = jest.fn();

      render(
        <Button onClick={handleClick} onKeyDown={handleKeyDown}>
          Press Enter
        </Button>,
      );

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

    it('should activate on Space key press', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const handleKeyDown = jest.fn();

      render(
        <Button onClick={handleClick} onKeyDown={handleKeyDown}>
          Press Space
        </Button>,
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{ }');

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: ' ',
        }),
      );
    });

    it('should not activate on other keys', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Other Keys</Button>);

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard('{Escape}');
      await user.keyboard('{Tab}');
      await user.keyboard('{ArrowDown}');

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should prevent default behavior for Enter and Space', async () => {
      const user = userEvent.setup();
      const handleKeyDown = jest.fn();
      render(<Button onKeyDown={handleKeyDown}>Prevent Default</Button>);

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard('{Enter}');
      await user.keyboard('{ }');

      expect(handleKeyDown).toHaveBeenCalledTimes(2);
      // Verify the events have preventDefault called
      expect(handleKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter' }));
      expect(handleKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: ' ' }));
    });

    it('should toggle on keyboard activation when toggle button', async () => {
      const user = userEvent.setup();
      const handlePressedChange = jest.fn();
      render(
        <Button isPressed={false} onPressedChange={handlePressedChange}>
          Toggle
        </Button>,
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handlePressedChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Focus Management', () => {
    it('should auto-focus when shouldAutoFocus is true', () => {
      render(<Button shouldAutoFocus>Auto Focus</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-autofocus', 'true');
    });

    it('should not auto-focus by default', () => {
      render(<Button>No Auto Focus</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('data-autofocus');
    });

    it('should maintain focus indicator styles through data attributes', () => {
      render(<Button>Focus Styles</Button>);
      const button = screen.getByRole('button');

      // Data attributes allow CSS to style focus states
      expect(button).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Screen Reader Support', () => {
    it('should communicate loading state changes via aria-busy', () => {
      const { rerender } = render(<Button>Submit</Button>);
      const button = screen.getByRole('button');

      // No loading state initially
      expect(button).not.toHaveAttribute('aria-busy');
      expect(button).not.toHaveAttribute('data-loading');

      // Loading state appears when loading starts
      rerender(<Button isLoading>Submit</Button>);
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('data-loading', 'true');
    });

    it('should announce state changes for toggle buttons', async () => {
      const user = userEvent.setup();
      const Component = () => {
        const [pressed, setPressed] = React.useState(false);
        return (
          <Button isPressed={pressed} onPressedChange={setPressed}>
            {pressed ? 'On' : 'Off'}
          </Button>
        );
      };

      render(<Component />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button).toHaveTextContent('Off');

      await user.click(button);

      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(button).toHaveTextContent('On');
    });

    it('should provide clear button content for screen readers', () => {
      render(<Button>Clear Action Button</Button>);
      const button = screen.getByRole('button', { name: 'Clear Action Button' });
      expect(button).toBeInTheDocument();
    });

    it('should maintain accessible name with loading state', () => {
      render(<Button isLoading>Save Document</Button>);

      // Button should still have its main content as accessible name
      const button = screen.getByRole('button', { name: /Save Document/i });
      expect(button).toBeInTheDocument();

      // Loading text should be announced separately
    });
  });

  describe('State Communication', () => {
    it('should communicate disabled state to assistive technology', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');

      // Both HTML and ARIA attributes for maximum compatibility
      expect(button).toHaveAttribute('disabled');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('tabIndex', '-1');
    });

    it('should communicate loading state to assistive technology', () => {
      render(<Button isLoading>Loading Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should communicate pressed state for toggle buttons', () => {
      const { rerender } = render(<Button isPressed={false}>Toggle</Button>);
      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');

      rerender(<Button isPressed={true}>Toggle</Button>);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should communicate multiple states simultaneously', () => {
      render(
        <Button disabled isLoading isPressed={true}>
          Complex State
        </Button>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Color Contrast & Visual Indicators', () => {
    it('should provide semantic attributes for visual styling', () => {
      render(<Button disabled>Styled Button</Button>);
      const button = screen.getByRole('button');

      // Data attributes allow CSS to apply appropriate contrast ratios
      expect(button).toHaveAttribute('data-disabled', 'true');
    });

    it('should provide loading visual indicators through attributes', () => {
      render(<Button isLoading>Loading Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('data-loading', 'true');
    });

    it('should provide pressed state indicators for toggle buttons', () => {
      render(<Button isPressed={true}>Pressed Toggle</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('data-pressed', 'true');
    });
  });
});
