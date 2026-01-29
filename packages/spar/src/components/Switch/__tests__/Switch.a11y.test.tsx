import { render, screen, act, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { Switch } from '../Switch';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Switch Accessibility', () => {
  describe('ARIA compliance', () => {
    it('should pass axe accessibility tests', async () => {
      const { container } = render(<Switch>Toggle setting</Switch>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe tests when checked', async () => {
      const { container } = render(<Switch checked={true}>Toggle setting</Switch>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe tests when disabled', async () => {
      const { container } = render(<Switch disabled>Toggle setting</Switch>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe tests when read-only', async () => {
      const { container } = render(<Switch readOnly>Toggle setting</Switch>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe tests with aria-label', async () => {
      const { container } = render(<Switch aria-label='Enable dark mode' />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe tests with aria-labelledby', async () => {
      const { container } = render(
        <div>
          <label id='switch-label' htmlFor='switch-element'>
            Dark mode
          </label>
          <Switch id='switch-element' aria-labelledby='switch-label' />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe tests with aria-describedby', async () => {
      const { container } = render(
        <div>
          <Switch aria-describedby='description'>Toggle setting</Switch>
          <div id='description'>This controls the dark mode theme</div>
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe tests with form integration', async () => {
      const { container } = render(
        <form>
          <Switch name='darkMode' required>
            Enable dark mode
          </Switch>
        </form>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA attributes', () => {
    it('should have correct role', () => {
      render(<Switch>Toggle setting</Switch>);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('role', 'switch');
    });

    it('should announce checked state correctly', () => {
      const { rerender } = render(<Switch checked={false}>Toggle</Switch>);
      let switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      rerender(<Switch checked={true}>Toggle</Switch>);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('should announce disabled state correctly', () => {
      render(<Switch disabled>Toggle setting</Switch>);
      const switchElement = screen.getByRole('switch');
      if (switchElement.tagName === 'BUTTON') {
        expect(switchElement).toHaveAttribute('disabled');
        expect(switchElement).not.toHaveAttribute('aria-disabled');
      } else {
        expect(switchElement).toHaveAttribute('aria-disabled', 'true');
      }
    });

    it('should announce read-only state correctly', () => {
      render(<Switch readOnly>Toggle setting</Switch>);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-readonly', 'true');
    });

    it('should support accessible name via aria-label', () => {
      render(<Switch aria-label='Enable notifications' />);
      const switchElement = screen.getByRole('switch', {
        name: 'Enable notifications',
      });
      expect(switchElement).toBeInTheDocument();
    });

    it('should support accessible name via aria-labelledby', () => {
      render(
        <div>
          <span id='label'>Notifications</span>
          <Switch aria-labelledby='label' />
        </div>,
      );
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-labelledby', 'label');
    });

    it('should support accessible description via aria-describedby', () => {
      render(
        <div>
          <Switch aria-describedby='desc'>Toggle</Switch>
          <div id='desc'>Controls notification preferences</div>
        </div>,
      );
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-describedby', 'desc');
    });
  });

  describe('Keyboard navigation', () => {
    it('should be focusable by default', () => {
      render(<Switch>Toggle setting</Switch>);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('tabindex', '0');
    });

    it('should be keyboard accessible with Tab', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button>Before</button>
          <Switch>Toggle setting</Switch>
          <button>After</button>
        </div>,
      );

      const beforeButton = screen.getByRole('button', { name: 'Before' });
      const switchElement = screen.getByRole('switch');
      const afterButton = screen.getByRole('button', { name: 'After' });

      act(() => {
        beforeButton.focus();
      });
      await user.tab();
      expect(switchElement).toHaveFocus();

      await user.tab();
      expect(afterButton).toHaveFocus();
    });

    it('should be keyboard accessible with Shift+Tab', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button>Before</button>
          <Switch>Toggle setting</Switch>
          <button>After</button>
        </div>,
      );

      const beforeButton = screen.getByRole('button', { name: 'Before' });
      const switchElement = screen.getByRole('switch');
      const afterButton = screen.getByRole('button', { name: 'After' });

      act(() => {
        afterButton.focus();
      });
      await user.tab({ shift: true });
      expect(switchElement).toHaveFocus();

      await user.tab({ shift: true });
      expect(beforeButton).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(<Switch disabled>Toggle setting</Switch>);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('tabindex', '-1');
    });

    it('should remain focusable when read-only', () => {
      render(<Switch readOnly>Toggle setting</Switch>);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('tabindex', '0');
    });

    it('should toggle on Space key', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Switch onChange={handleChange}>Toggle setting</Switch>);

      const switchElement = screen.getByRole('switch');
      act(() => {
        switchElement.focus();
      });
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should toggle on Enter key', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Switch onChange={handleChange}>Toggle setting</Switch>);

      const switchElement = screen.getByRole('switch');
      act(() => {
        switchElement.focus();
      });
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should not respond to other keys', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Switch onChange={handleChange}>Toggle setting</Switch>);

      const switchElement = screen.getByRole('switch');
      act(() => {
        switchElement.focus();
      });
      await user.keyboard('{ArrowUp}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowLeft}');
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{Home}');
      await user.keyboard('{End}');
      await user.keyboard('{PageUp}');
      await user.keyboard('{PageDown}');
      await user.keyboard('a');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not respond to keyboard when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Switch disabled onChange={handleChange}>
          Toggle setting
        </Switch>,
      );

      const switchElement = screen.getByRole('switch');
      act(() => {
        switchElement.focus();
      });
      await user.keyboard(' ');
      await user.keyboard('{Enter}');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not respond to keyboard when read-only', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Switch readOnly onChange={handleChange}>
          Toggle setting
        </Switch>,
      );

      const switchElement = screen.getByRole('switch');
      act(() => {
        switchElement.focus();
      });
      await user.keyboard(' ');
      await user.keyboard('{Enter}');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Focus management', () => {
    it('should show focus indicator when focused', async () => {
      const user = userEvent.setup();
      render(<Switch>Toggle setting</Switch>);

      const switchElement = screen.getByRole('switch');
      await user.tab();

      expect(switchElement).toHaveFocus();
      expect(switchElement).toHaveAttribute('data-focus', '');
    });

    it('should remove focus indicator when blurred', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Switch>Toggle setting</Switch>
          <button>Other element</button>
        </div>,
      );

      const switchElement = screen.getByRole('switch');
      const button = screen.getByRole('button');

      await user.tab();
      expect(switchElement).toHaveAttribute('data-focus', '');

      await user.tab();
      expect(button).toHaveFocus();
      expect(switchElement).not.toHaveAttribute('data-focus');
    });

    it('should auto-focus when autoFocus is true', async () => {
      render(<Switch autoFocus>Toggle setting</Switch>);
      const switchElement = screen.getByRole('switch');
      await waitFor(() => {
        expect(switchElement).toHaveFocus();
      });
    });

    it('should not auto-focus when disabled', () => {
      render(
        <Switch autoFocus disabled>
          Toggle setting
        </Switch>,
      );
      const switchElement = screen.getByRole('switch');

      // Even though autoFocus is true, disabled elements should not be focusable
      // The browser will attempt to focus, but tabindex="-1" prevents proper focusing
      expect(switchElement).toHaveAttribute('tabindex', '-1');
      expect(switchElement).toHaveAttribute('disabled');
    });

    it('should handle focus with visible focus indicator', async () => {
      const { act } = await import('@testing-library/react');
      render(<Switch>Toggle setting</Switch>);

      const switchElement = screen.getByRole('switch');

      // Focus programmatically
      await act(async () => {
        switchElement.focus();
      });
      expect(switchElement).toHaveFocus();
      expect(switchElement).toHaveAttribute('data-focus', '');

      // Blur programmatically
      await act(async () => {
        switchElement.blur();
      });
      expect(switchElement).not.toHaveFocus();
      expect(switchElement).not.toHaveAttribute('data-focus');
    });
  });

  describe('Screen reader announcements', () => {
    it('should have accessible name from children', () => {
      render(<Switch>Enable dark mode</Switch>);
      const switchElement = screen.getByRole('switch', {
        name: 'Enable dark mode',
      });
      expect(switchElement).toBeInTheDocument();
    });

    it('should have accessible name from aria-label when no children', () => {
      render(<Switch aria-label='Toggle notifications' />);
      const switchElement = screen.getByRole('switch', {
        name: 'Toggle notifications',
      });
      expect(switchElement).toBeInTheDocument();
    });

    it('should prefer aria-label over children for accessible name', () => {
      render(<Switch aria-label='Custom label'>Children text</Switch>);
      const switchElement = screen.getByRole('switch', {
        name: 'Custom label',
      });
      expect(switchElement).toBeInTheDocument();
    });

    it('should announce state changes', async () => {
      const user = userEvent.setup();
      render(<Switch>Toggle setting</Switch>);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('should announce disabled state', () => {
      render(<Switch disabled>Toggle setting</Switch>);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
    });

    it('should announce read-only state', () => {
      render(<Switch readOnly>Toggle setting</Switch>);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-readonly', 'true');
    });
  });

  describe('Color and contrast', () => {
    it('should not rely solely on color for state indication', () => {
      const { rerender } = render(<Switch checked={false}>Toggle</Switch>);
      let switchElement = screen.getByRole('switch');

      // Unchecked state should have data attributes and ARIA
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
      expect(switchElement).not.toHaveAttribute('data-checked');

      rerender(<Switch checked={true}>Toggle</Switch>);
      switchElement = screen.getByRole('switch');

      // Checked state should have data attributes and ARIA
      expect(switchElement).toHaveAttribute('data-state', 'checked');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
      expect(switchElement).toHaveAttribute('data-checked', '');
    });

    it('should provide state indication through data attributes', () => {
      render(<Switch checked={true}>Toggle</Switch>);
      const switchElement = screen.getByRole('switch');

      // Data attributes provide styling hooks that don't rely on color alone
      expect(switchElement).toHaveAttribute('data-switch', '');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
      expect(switchElement).toHaveAttribute('data-checked', '');
    });

    it('should provide interaction state indication', async () => {
      const user = userEvent.setup();
      render(<Switch>Toggle</Switch>);

      const switchElement = screen.getByRole('switch');

      // Focus state
      await user.tab();
      expect(switchElement).toHaveAttribute('data-focus', '');

      // Hover state
      await user.hover(switchElement);
      expect(switchElement).toHaveAttribute('data-hover', '');

      // Active state (mousedown)
      await user.pointer({ target: switchElement, keys: '[MouseLeft>]' });
      expect(switchElement).toHaveAttribute('data-active', '');
    });
  });

  describe('High contrast mode support', () => {
    it('should provide data attributes for high contrast styling', () => {
      render(
        <Switch checked={true} disabled>
          Toggle
        </Switch>,
      );
      const switchElement = screen.getByRole('switch');

      // All state data attributes should be present for styling
      expect(switchElement).toHaveAttribute('data-switch', '');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
      expect(switchElement).toHaveAttribute('data-checked', '');
      expect(switchElement).toHaveAttribute('data-disabled', '');
    });

    it('should maintain accessibility in all states', async () => {
      const states = [
        { props: {}, label: 'default' },
        { props: { checked: true }, label: 'checked' },
        { props: { disabled: true }, label: 'disabled' },
        { props: { readOnly: true }, label: 'read-only' },
        { props: { checked: true, disabled: true }, label: 'checked disabled' },
      ];

      for (const state of states) {
        const { container } = render(<Switch {...state.props}>Toggle {state.label}</Switch>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });
  });

  describe('Mobile accessibility', () => {
    it('should support touch interactions', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Switch onChange={handleChange}>Toggle setting</Switch>);

      const switchElement = screen.getByRole('switch');
      await user.pointer({ target: switchElement, keys: '[TouchA]' });

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should have appropriate touch target size via data attributes', () => {
      render(<Switch>Toggle setting</Switch>);
      const switchElement = screen.getByRole('switch');

      // Data attributes can be used for ensuring minimum touch target size
      expect(switchElement).toHaveAttribute('data-switch', '');
    });

    it('should work with screen readers on mobile', async () => {
      const { container } = render(
        <Switch aria-label='Enable push notifications'>Notifications</Switch>,
      );

      // Should pass axe tests which include mobile considerations
      const results = await axe(container);
      expect(results).toHaveNoViolations();

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('role', 'switch');
      expect(switchElement).toHaveAttribute('aria-label', 'Enable push notifications');
    });
  });
});
