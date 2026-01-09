import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../Checkbox';

expect.extend(toHaveNoViolations);

describe('Checkbox - Accessibility Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('jest-axe Compliance', () => {
    it('passes accessibility checks in default state', async () => {
      const { container } = render(<Checkbox>Subscribe to newsletter</Checkbox>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks when checked', async () => {
      const { container } = render(<Checkbox checked>Subscribe to newsletter</Checkbox>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks when indeterminate', async () => {
      const { container } = render(
        <Checkbox checked='indeterminate'>Subscribe to newsletter</Checkbox>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks when disabled', async () => {
      const { container } = render(<Checkbox disabled>Subscribe to newsletter</Checkbox>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks when required', async () => {
      const { container } = render(<Checkbox required>Subscribe to newsletter</Checkbox>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks with external label', async () => {
      const { container } = render(
        <div>
          <label id='checkbox-label'>Subscribe to newsletter</label>
          <Checkbox aria-labelledby='checkbox-label' />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks with aria-label', async () => {
      const { container } = render(<Checkbox aria-label='Subscribe to newsletter' />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes', () => {
    it('has correct role', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('role', 'checkbox');
    });

    it('announces checked state correctly', () => {
      const { rerender } = render(<Checkbox checked={false} />);
      let checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-checked', 'false');

      rerender(<Checkbox checked />);
      checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');

      rerender(<Checkbox checked='indeterminate' />);
      checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });

    it('announces disabled state', () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    });

    it('announces required state', () => {
      render(<Checkbox required />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-required', 'true');
    });

    it('supports aria-label for accessible name', () => {
      render(<Checkbox aria-label='Subscribe to newsletter' />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-label', 'Subscribe to newsletter');
    });

    it('supports aria-labelledby for external label', () => {
      render(
        <div>
          <span id='checkbox-label'>Subscribe to newsletter</span>
          <Checkbox aria-labelledby='checkbox-label' />
        </div>,
      );
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-labelledby', 'checkbox-label');
    });

    it('supports aria-describedby for descriptions', () => {
      render(
        <div>
          <Checkbox aria-describedby='checkbox-desc' />
          <span id='checkbox-desc'>Get updates about new features</span>
        </div>,
      );
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-describedby', 'checkbox-desc');
    });

    it('does not set aria-invalid by default', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('Keyboard Navigation', () => {
    it('is focusable with Tab key', async () => {
      const user = userEvent.setup();

      render(<Checkbox>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      await user.tab();

      expect(checkbox).toHaveFocus();
    });

    it('is skipped when disabled and Tab key is pressed', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button type='button'>Before</button>
          <Checkbox disabled>Subscribe to newsletter</Checkbox>
          <button type='button'>After</button>
        </div>,
      );

      const beforeButton = screen.getByRole('button', { name: 'Before' });
      const afterButton = screen.getByRole('button', { name: 'After' });

      beforeButton.focus();
      await user.tab();

      expect(afterButton).toHaveFocus();
    });

    it('toggles state with Space key', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox onChange={handleChange}>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledWith(true);
      expect(checkbox).toHaveAttribute('aria-checked', 'true'); // Should be true in uncontrolled mode
    });

    it('does not toggle with Enter key', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox onChange={handleChange}>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      await user.keyboard('{Enter}');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('prevents default on Space key to avoid page scroll', async () => {
      const user = userEvent.setup();
      const handleKeyDown = jest.fn();

      render(<Checkbox onKeyDown={handleKeyDown}>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      await user.keyboard(' ');

      expect(handleKeyDown).toHaveBeenCalled();
      const event = handleKeyDown.mock.calls[0][0];
      expect(event.defaultPrevented).toBe(true);
    });

    it('allows Tab navigation when read-only', async () => {
      const user = userEvent.setup();

      render(<Checkbox readOnly>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      await user.tab();

      expect(checkbox).toHaveFocus();
    });

    it('does not respond to Space key when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Checkbox disabled onChange={handleChange}>
          Subscribe to newsletter
        </Checkbox>,
      );
      const checkbox = screen.getByRole('checkbox');

      // Focus programmatically since Tab skips disabled elements
      checkbox.focus();
      await user.keyboard(' ');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not respond to Space key when read-only', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Checkbox readOnly onChange={handleChange}>
          Subscribe to newsletter
        </Checkbox>,
      );
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      await user.keyboard(' ');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('receives focus with correct tabindex', () => {
      render(<Checkbox>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('tabindex', '0');
    });

    it('has tabindex -1 when disabled', () => {
      render(<Checkbox disabled>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('tabindex', '-1');
    });

    it('maintains tabindex 0 when read-only', () => {
      render(<Checkbox readOnly>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('tabindex', '0');
    });

    it('supports custom tabindex', () => {
      render(<Checkbox tabIndex={5}>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('tabindex', '5');
    });

    it('provides focus indicators via data attributes', async () => {
      const user = userEvent.setup();

      render(<Checkbox>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      // Initially not focused
      expect(checkbox).not.toHaveAttribute('data-focus');

      // Focus the checkbox
      await user.tab();
      expect(checkbox).toHaveAttribute('data-focus', '');

      // Blur the checkbox
      await user.tab();
      expect(checkbox).not.toHaveAttribute('data-focus');
    });
  });

  describe('Screen Reader Announcements', () => {
    it('has accessible name from children', () => {
      render(<Checkbox>Subscribe to newsletter</Checkbox>);

      expect(screen.getByRole('checkbox', { name: 'Subscribe to newsletter' })).toBeInTheDocument();
    });

    it('has accessible name from aria-label', () => {
      render(<Checkbox aria-label='Subscribe to newsletter' />);

      expect(screen.getByRole('checkbox', { name: 'Subscribe to newsletter' })).toBeInTheDocument();
    });

    it('announces state changes', async () => {
      const user = userEvent.setup();

      render(<Checkbox>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      // Initial state
      expect(checkbox).toHaveAttribute('aria-checked', 'false');

      // After click
      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('announces indeterminate state correctly', () => {
      render(<Checkbox checked='indeterminate'>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });

    it('announces required state to screen readers', () => {
      render(<Checkbox required>Subscribe to newsletter</Checkbox>);

      const checkbox = screen.getByRole('checkbox', { name: 'Subscribe to newsletter' });
      expect(checkbox).toHaveAttribute('aria-required', 'true');
    });

    it('announces disabled state to screen readers', () => {
      render(<Checkbox disabled>Subscribe to newsletter</Checkbox>);

      const checkbox = screen.getByRole('checkbox', { name: 'Subscribe to newsletter' });
      expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Name/Role/Value Pattern', () => {
    it('exposes correct role', () => {
      render(<Checkbox>Subscribe to newsletter</Checkbox>);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('exposes correct name via children', () => {
      render(<Checkbox>Subscribe to newsletter</Checkbox>);

      expect(screen.getByRole('checkbox', { name: 'Subscribe to newsletter' })).toBeInTheDocument();
    });

    it('exposes correct name via aria-label', () => {
      render(<Checkbox aria-label='Accept terms and conditions' />);

      expect(
        screen.getByRole('checkbox', { name: 'Accept terms and conditions' }),
      ).toBeInTheDocument();
    });

    it('exposes correct value (checked state)', () => {
      const { rerender } = render(<Checkbox>Subscribe to newsletter</Checkbox>);
      let checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-checked', 'false');

      rerender(<Checkbox checked>Subscribe to newsletter</Checkbox>);
      checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');

      rerender(<Checkbox checked='indeterminate'>Subscribe to newsletter</Checkbox>);
      checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });
  });

  describe('Complex Scenarios', () => {
    it('maintains accessibility when used with external labels', async () => {
      const { container } = render(
        <div>
          <label htmlFor='newsletter-checkbox'>Subscribe to newsletter</label>
          <Checkbox id='newsletter-checkbox' aria-labelledby='newsletter-label' />
          <span id='newsletter-label'>Subscribe to newsletter</span>
          <span id='newsletter-desc'>Get updates about new features and releases</span>
        </div>,
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'newsletter-checkbox');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('works correctly in forms', async () => {
      const { container } = render(
        <form>
          <fieldset>
            <legend>Newsletter Preferences</legend>
            <Checkbox name='weekly' required>
              Weekly newsletter
            </Checkbox>
            <Checkbox name='monthly'>Monthly newsletter</Checkbox>
          </fieldset>
        </form>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      const weeklyCheckbox = screen.getByRole('checkbox', { name: 'Weekly newsletter' });
      const monthlyCheckbox = screen.getByRole('checkbox', { name: 'Monthly newsletter' });

      expect(weeklyCheckbox).toHaveAttribute('aria-required', 'true');
      expect(monthlyCheckbox).not.toHaveAttribute('aria-required');
    });

    it('maintains accessibility with render props', async () => {
      const { container } = render(
        <Checkbox>
          {({ checked, disabled }) => (
            <span>
              {checked ? '✓' : '○'} Subscribe to newsletter
              {disabled && ' (disabled)'}
            </span>
          )}
        </Checkbox>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('announces state changes correctly during user interaction', async () => {
      const user = userEvent.setup();

      render(<Checkbox>Subscribe to newsletter</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      // Verify initial state announcement
      expect(checkbox).toHaveAttribute('aria-checked', 'false');

      // Click and verify state change announcement
      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');

      // Click again and verify
      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });
  });
});
