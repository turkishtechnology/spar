import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../Checkbox';
import type { CheckboxRenderProps } from '../types';

describe('Checkbox - Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
      expect(checkbox).not.toBeDisabled();
    });

    it('renders with custom element using as prop', () => {
      render(<Checkbox as='button' />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox.tagName).toBe('BUTTON');
    });

    it('renders with children content', () => {
      render(<Checkbox>Accept terms</Checkbox>);

      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('renders with render prop children', () => {
      render(
        <Checkbox>
          {({ checked, disabled }) => (
            <span>
              {checked ? 'Checked' : 'Unchecked'} - {disabled ? 'Disabled' : 'Enabled'}
            </span>
          )}
        </Checkbox>,
      );

      expect(screen.getByText('Unchecked - Enabled')).toBeInTheDocument();
    });

    it('applies custom className and style', () => {
      render(<Checkbox className='custom-checkbox' style={{ backgroundColor: 'red' }} />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveClass('custom-checkbox');
      expect(checkbox).toHaveAttribute('style', expect.stringContaining('background-color: red'));
    });

    it('generates unique non-empty IDs when not provided', () => {
      render(
        <>
          <Checkbox aria-label='first checkbox' />
          <Checkbox aria-label='second checkbox' />
        </>,
      );

      const firstCheckbox = screen.getByRole('checkbox', { name: 'first checkbox' });
      const secondCheckbox = screen.getByRole('checkbox', { name: 'second checkbox' });

      expect(firstCheckbox.id).toBeTruthy();
      expect(secondCheckbox.id).toBeTruthy();
      expect(firstCheckbox.id).not.toBe(secondCheckbox.id);
    });

    it('uses provided ID', () => {
      render(<Checkbox id='custom-id' />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Controlled Mode', () => {
    it('respects controlled checked state', () => {
      const { rerender } = render(<Checkbox checked={false} />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-checked', 'false');

      rerender(<Checkbox checked={true} />);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');

      rerender(<Checkbox checked='indeterminate' />);
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });

    it('calls onChange when toggled in controlled mode', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox checked={false} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('does not change state internally when controlled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox checked={false} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);

      // Should still be false since it's controlled
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Uncontrolled Mode', () => {
    it('uses defaultChecked for initial state', () => {
      render(<Checkbox defaultChecked={true} />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('supports indeterminate default state', () => {
      render(<Checkbox defaultChecked='indeterminate' />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });

    it('toggles state internally when uncontrolled', async () => {
      const user = userEvent.setup();

      render(<Checkbox defaultChecked={false} />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-checked', 'false');

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');

      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('calls onChange with new state in uncontrolled mode', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox defaultChecked={false} onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(true);

      await user.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Indeterminate State', () => {
    it('transitions from indeterminate to checked when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox checked='indeterminate' onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');

      await user.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('shows correct data attributes for indeterminate state', () => {
      render(<Checkbox checked='indeterminate' />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('data-indeterminate', '');
      expect(checkbox).not.toHaveAttribute('data-checked');
    });
  });

  describe('Disabled State', () => {
    it('renders as disabled when disabled is true (non-button)', () => {
      render(<Checkbox as='span' disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-disabled', 'true');
      expect(checkbox).toHaveAttribute('data-disabled', '');
      expect(checkbox).toHaveAttribute('tabIndex', '-1');
      expect(checkbox).not.toHaveAttribute('disabled');
    });

    it('renders as disabled when disabled is true (button)', () => {
      render(<Checkbox as='button' disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('disabled');
      expect(checkbox).not.toHaveAttribute('aria-disabled');
      expect(checkbox).toHaveAttribute('data-disabled', '');
      expect(checkbox).toHaveAttribute('tabIndex', '-1');
    });

    it('does not respond to clicks when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox disabled onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('does not respond to keyboard when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox disabled onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      act(() => {
        checkbox.focus();
      });
      await user.keyboard(' ');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Read-only State', () => {
    it('does not change state when read-only', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox readOnly onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('remains focusable when read-only', () => {
      render(<Checkbox readOnly />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('tabIndex', '0');
      expect(checkbox).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('Required State', () => {
    it('sets aria-required when required is true', () => {
      render(<Checkbox required />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-required', 'true');
      expect(checkbox).toHaveAttribute('data-required', '');
    });
  });

  describe('Keyboard Interaction', () => {
    it('toggles state with Space key', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      act(() => {
        checkbox.focus();
      });
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('does not toggle state with Enter key', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      act(() => {
        checkbox.focus();
      });
      await user.keyboard('{Enter}');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('calls custom onKeyDown handler', async () => {
      const user = userEvent.setup();
      const handleKeyDown = jest.fn();

      render(<Checkbox onKeyDown={handleKeyDown} />);
      const checkbox = screen.getByRole('checkbox');

      act(() => {
        checkbox.focus();
      });
      await user.keyboard(' ');

      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('sets focus state data attribute when focused', async () => {
      const user = userEvent.setup();

      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');

      await user.tab();
      expect(checkbox).toHaveAttribute('data-focus', '');

      await user.tab();
      expect(checkbox).not.toHaveAttribute('data-focus');
    });

    it('calls focus and blur handlers', async () => {
      const user = userEvent.setup();
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();

      render(<Checkbox onFocus={handleFocus} onBlur={handleBlur} />);

      await user.tab();
      expect(handleFocus).toHaveBeenCalled();

      await user.tab();
      expect(handleBlur).toHaveBeenCalled();
    });

    it('should auto-focus when autoFocus is true', async () => {
      render(<Checkbox autoFocus />);
      const checkbox = screen.getByRole('checkbox');
      await waitFor(() => {
        expect(checkbox).toHaveFocus();
      });
    });
  });

  describe('Mouse Interaction', () => {
    it('sets hover state on mouse enter/leave', async () => {
      const user = userEvent.setup();

      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');

      await user.hover(checkbox);
      expect(checkbox).toHaveAttribute('data-hover', '');

      await user.unhover(checkbox);
      expect(checkbox).not.toHaveAttribute('data-hover');
    });

    it('does not set hover state when disabled', async () => {
      const user = userEvent.setup();

      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');

      await user.hover(checkbox);
      expect(checkbox).not.toHaveAttribute('data-hover');
    });

    it('calls custom onClick handler', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<Checkbox onClick={handleClick} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Form Integration', () => {
    it('creates hidden input when name is provided', () => {
      render(<Checkbox name='subscribe' />);

      const hiddenInput = document.querySelector('input[type="checkbox"][name="subscribe"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('aria-hidden', 'true');
      expect(hiddenInput).toHaveAttribute('tabIndex', '-1');
    });

    it('keeps hidden input out of the accessibility tree', () => {
      render(<Checkbox name='subscribe' />);

      const visibleCheckboxes = screen.getAllByRole('checkbox');
      expect(visibleCheckboxes).toHaveLength(1);
    });

    it('syncs hidden input with checkbox state', async () => {
      const user = userEvent.setup();

      render(<Checkbox name='subscribe' defaultChecked={false} />);
      const checkbox = screen.getByRole('checkbox');
      const hiddenInput = document.querySelector('input[name="subscribe"]') as HTMLInputElement;

      expect(hiddenInput.checked).toBe(false);
      expect(hiddenInput.indeterminate).toBe(false);

      await user.click(checkbox);

      expect(hiddenInput.checked).toBe(true);
    });

    it('sets indeterminate property on hidden input', () => {
      render(<Checkbox name='subscribe' checked='indeterminate' />);
      const hiddenInput = document.querySelector('input[name="subscribe"]') as HTMLInputElement;

      expect(hiddenInput.indeterminate).toBe(true);
      expect(hiddenInput.checked).toBe(false);
    });

    it('uses custom value for form submission', () => {
      render(<Checkbox name='subscribe' value='yes' />);
      const hiddenInput = document.querySelector('input[name="subscribe"]') as HTMLInputElement;

      expect(hiddenInput.value).toBe('yes');
    });

    it('sets form attribute on hidden input', () => {
      render(<Checkbox name='subscribe' form='my-form' />);
      const hiddenInput = document.querySelector('input[name="subscribe"]') as HTMLInputElement;

      expect(hiddenInput).toHaveAttribute('form', 'my-form');
    });
  });

  describe('Data Attributes', () => {
    it('sets correct data attributes for checked state', () => {
      render(<Checkbox checked={true} />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('data-checked', '');
      expect(checkbox).not.toHaveAttribute('data-indeterminate');
    });

    it('sets correct data attributes for various states', () => {
      render(<Checkbox disabled required checked={true} />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('data-checked', '');
      expect(checkbox).toHaveAttribute('data-disabled', '');
      expect(checkbox).toHaveAttribute('data-required', '');
    });
  });

  describe('Render Props', () => {
    it('provides correct state to render prop children', async () => {
      const user = userEvent.setup();
      const renderFn = jest.fn((_props: CheckboxRenderProps) => <span>Render prop content</span>);

      render(<Checkbox disabled>{renderFn}</Checkbox>);

      expect(renderFn).toHaveBeenCalledWith(
        expect.objectContaining({
          checked: false,
          disabled: true,
          isFocused: false,
          isHovered: false,
          isPressed: false,
        }),
      );
      // Verify setChecked is a function
      const firstCallProps = renderFn.mock.calls[0]?.[0];
      expect(firstCallProps).toBeDefined();
      expect(typeof firstCallProps?.setChecked).toBe('function');

      const checkbox = screen.getByRole('checkbox');
      await user.hover(checkbox);

      // Should not update hover state when disabled
      expect(renderFn).toHaveBeenLastCalledWith(
        expect.objectContaining({
          checked: false,
          disabled: true,
          isFocused: false,
          isHovered: false,
          isPressed: false,
        }),
      );
    });

    it('updates render props on interaction', async () => {
      const user = userEvent.setup();
      const renderFn = jest.fn((_props: CheckboxRenderProps) => <span>Render prop content</span>);

      render(<Checkbox>{renderFn}</Checkbox>);
      const checkbox = screen.getByRole('checkbox');

      await user.hover(checkbox);

      expect(renderFn).toHaveBeenLastCalledWith(
        expect.objectContaining({
          checked: false,
          disabled: false,
          isFocused: false,
          isHovered: true,
          isPressed: false,
        }),
      );
    });

    it('provides setChecked function that updates state', async () => {
      const handleChange = jest.fn();
      let setCheckedFn: ((checked: boolean | 'indeterminate') => void) | undefined;

      render(
        <Checkbox onChange={handleChange}>
          {({ checked, setChecked }) => {
            setCheckedFn = setChecked;
            return <span>{checked ? 'Checked' : 'Unchecked'}</span>;
          }}
        </Checkbox>,
      );

      expect(screen.getByText('Unchecked')).toBeInTheDocument();

      // Call setChecked programmatically
      act(() => {
        setCheckedFn?.(true);
      });

      expect(screen.getByText('Checked')).toBeInTheDocument();
      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid state changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox onChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');

      // Rapid clicks
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenNthCalledWith(1, true);
      expect(handleChange).toHaveBeenNthCalledWith(2, false);
      expect(handleChange).toHaveBeenNthCalledWith(3, true);
    });

    it('handles undefined onChange gracefully', async () => {
      const user = userEvent.setup();

      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');

      // Should not throw
      await user.click(checkbox);
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('spreads additional props to root element', () => {
      render(<Checkbox data-testid='custom-checkbox' />);
      const checkbox = screen.getByTestId('custom-checkbox');

      expect(checkbox).toHaveAttribute('role', 'checkbox');
    });
  });
});
