import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioItem } from '../index';

const getRadioByText = (text: string) => {
  const radios = screen.getAllByRole('radio', { name: text });
  const interactiveRadio = radios.find((radio) => radio.tagName !== 'INPUT');
  if (!interactiveRadio) {
    throw new Error(`Interactive radio with text "${text}" not found`);
  }
  return interactiveRadio as HTMLElement;
};

describe('Radio', () => {
  describe('RadioGroup', () => {
    describe('Rendering', () => {
      it('renders with default props', () => {
        render(
          <RadioGroup>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toBeInTheDocument();
        expect(radioGroup).toHaveAttribute('data-orientation', 'vertical');
      });

      it('renders with custom orientation', () => {
        render(
          <RadioGroup orientation='horizontal'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('data-orientation', 'horizontal');
      });

      it('renders with aria-label', () => {
        render(
          <RadioGroup aria-label='Choose an option'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-label', 'Choose an option');
      });

      it('renders with aria-labelledby', () => {
        render(
          <div>
            <h2 id='label-id'>Select Option</h2>
            <RadioGroup aria-labelledby='label-id'>
              <RadioItem value='option1'>Option 1</RadioItem>
              <RadioItem value='option2'>Option 2</RadioItem>
            </RadioGroup>
          </div>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-labelledby', 'label-id');
      });

      it('renders with aria-describedby', () => {
        render(
          <div>
            <p id='description'>Choose your preferred option</p>
            <RadioGroup aria-describedby='description'>
              <RadioItem value='option1'>Option 1</RadioItem>
              <RadioItem value='option2'>Option 2</RadioItem>
            </RadioGroup>
          </div>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-describedby', 'description');
      });

      it('renders as custom element when as prop is provided', () => {
        render(
          <RadioGroup as='fieldset'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup.tagName).toBe('FIELDSET');
      });
    });

    describe('State Management', () => {
      it('handles uncontrolled state with defaultValue', () => {
        const { container } = render(
          <RadioGroup defaultValue='option2'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </RadioGroup>,
        );

        const hiddenRadio = container.querySelector(
          'input[type="radio"][value="option2"]',
        ) as HTMLInputElement;
        expect(hiddenRadio).toBeChecked();
      });

      it('handles controlled state with value prop', () => {
        const { rerender } = render(
          <RadioGroup value='option1'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </RadioGroup>,
        );

        const option1 = getRadioByText('Option 1');
        expect(option1).toHaveAttribute('aria-checked', 'true');

        rerender(
          <RadioGroup value='option3'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </RadioGroup>,
        );

        const option3After = getRadioByText('Option 3');
        const option1After = getRadioByText('Option 1');
        expect(option3After).toHaveAttribute('aria-checked', 'true');
        expect(option1After).toHaveAttribute('aria-checked', 'false');
      });

      it('keeps selection unchanged in controlled mode until parent updates value', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        render(
          <RadioGroup value='option1' onValueChange={handleValueChange}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const option1 = getRadioByText('Option 1');
        const option2 = getRadioByText('Option 2');
        await user.click(option2);

        expect(handleValueChange).toHaveBeenCalledWith('option2');
        expect(option1).toHaveAttribute('aria-checked', 'true');
        expect(option2).toHaveAttribute('aria-checked', 'false');
      });

      it('calls onValueChange when selection changes', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        const { container } = render(
          <RadioGroup onValueChange={handleValueChange}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        await user.click(option1);

        expect(handleValueChange).toHaveBeenCalledWith('option1');
      });

      it('updates uncontrolled state when clicking items', async () => {
        const user = userEvent.setup();

        const { container } = render(
          <RadioGroup>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        const option2 = labels[1] as HTMLElement;

        await user.click(option1);
        expect(option1).toHaveAttribute('aria-checked', 'true');
        expect(option2).toHaveAttribute('aria-checked', 'false');

        await user.click(option2);
        expect(option1).toHaveAttribute('aria-checked', 'false');
        expect(option2).toHaveAttribute('aria-checked', 'true');
      });
    });

    describe('Disabled State', () => {
      it('disables entire group when disabled prop is true', () => {
        const { container } = render(
          <RadioGroup disabled>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('data-disabled');

        const inputs = container.querySelectorAll('input[type="radio"]');
        inputs.forEach((input) => {
          expect(input).toBeDisabled();
        });
      });

      it('prevents interaction when group is disabled', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        const { container } = render(
          <RadioGroup disabled onValueChange={handleValueChange}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        await user.click(option1);

        expect(handleValueChange).not.toHaveBeenCalled();
        expect(option1).toHaveAttribute('aria-checked', 'false');
      });
    });

    describe('Required State', () => {
      it('sets aria-required when required prop is true', () => {
        render(
          <RadioGroup required>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-required', 'true');
        expect(radioGroup).toHaveAttribute('data-required');
      });
    });

    describe('Form Integration', () => {
      it('creates hidden input for form submission when value is selected', () => {
        const { container } = render(
          <RadioGroup name='test-radio' value='option1'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const hiddenInput = container.querySelector('input[type="hidden"]');
        expect(hiddenInput).toBeInTheDocument();
        expect(hiddenInput).toHaveAttribute('name', 'test-radio');
        expect(hiddenInput).toHaveAttribute('value', 'option1');
      });

      it('does not create hidden input when no value is selected', () => {
        const { container } = render(
          <RadioGroup name='test-radio'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const hiddenInput = container.querySelector('input[type="hidden"]');
        expect(hiddenInput).not.toBeInTheDocument();
      });

      it('generates unique name when not provided', () => {
        const { container } = render(
          <RadioGroup value='option1'>
            <RadioItem value='option1'>Option 1</RadioItem>
          </RadioGroup>,
        );

        const hiddenInput = container.querySelector('input[type="hidden"]');
        expect(hiddenInput).toHaveAttribute('name');
        expect(hiddenInput!.getAttribute('name')).toMatch(/-radio-group$/);
      });

      it('uses id as base for generated name when name is not provided', () => {
        const { container } = render(
          <RadioGroup id='shipping' value='express'>
            <RadioItem value='express'>Express</RadioItem>
          </RadioGroup>,
        );

        const hiddenInput = container.querySelector('input[type="hidden"]');
        expect(hiddenInput).toHaveAttribute('name', 'shipping-radio-group');
      });

      it('does not fallback to generated id when id is an empty string', () => {
        const { container } = render(
          <RadioGroup id='' value='express'>
            <RadioItem value='express'>Express</RadioItem>
          </RadioGroup>,
        );

        const hiddenInput = container.querySelector('input[type="hidden"]');
        expect(hiddenInput).toHaveAttribute('name', '-radio-group');
      });

      it('prioritizes explicit name over id-derived name', () => {
        const { container } = render(
          <RadioGroup id='shipping' name='delivery-method' value='express'>
            <RadioItem value='express'>Express</RadioItem>
          </RadioGroup>,
        );

        const hiddenInput = container.querySelector('input[type="hidden"]');
        expect(hiddenInput).toHaveAttribute('name', 'delivery-method');
      });
    });

    describe('Keyboard Navigation', () => {
      it('keeps only first enabled item tabbable when no radio is checked', () => {
        const { container } = render(
          <RadioGroup>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </RadioGroup>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        const option2 = labels[1] as HTMLElement;
        const option3 = labels[2] as HTMLElement;

        expect(option1).toHaveAttribute('tabindex', '0');
        expect(option2).toHaveAttribute('tabindex', '-1');
        expect(option3).toHaveAttribute('tabindex', '-1');
      });

      it('moves focus and selection with arrow keys by default', async () => {
        const user = userEvent.setup();

        render(
          <RadioGroup defaultValue='option1'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </RadioGroup>,
        );

        const option1 = getRadioByText('Option 1');
        const option2 = getRadioByText('Option 2');

        option1.focus();
        await user.keyboard('{ArrowDown}');

        expect(option2).toHaveFocus();
        expect(option2).toHaveAttribute('aria-checked', 'true');
        expect(option1).toHaveAttribute('aria-checked', 'false');
      });

      it('moves focus without changing selection when selectOnFocus is false', async () => {
        const user = userEvent.setup();

        render(
          <RadioGroup defaultValue='option1' selectOnFocus={false}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </RadioGroup>,
        );

        const option1 = getRadioByText('Option 1');
        const option2 = getRadioByText('Option 2');

        option1.focus();
        await user.keyboard('{ArrowDown}');

        expect(option2).toHaveFocus();
        expect(option1).toHaveAttribute('aria-checked', 'true');
        expect(option2).toHaveAttribute('aria-checked', 'false');

        await user.keyboard(' ');
        expect(option2).toHaveAttribute('aria-checked', 'true');
      });

      it('supports Home and End keys', async () => {
        const user = userEvent.setup();

        render(
          <RadioGroup defaultValue='option2'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </RadioGroup>,
        );

        const option2 = getRadioByText('Option 2');
        const option3 = getRadioByText('Option 3');

        option2.focus();
        await user.keyboard('{End}');
        expect(option3).toHaveFocus();
        expect(option3).toHaveAttribute('aria-checked', 'true');

        await user.keyboard('{Home}');
        expect(option1).toHaveFocus();
        expect(option1).toHaveAttribute('aria-checked', 'true');
      });

      it('uses left/right keys for horizontal orientation', async () => {
        const user = userEvent.setup();

        render(
          <RadioGroup defaultValue='option2' orientation='horizontal'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </RadioGroup>,
        );

        const option2 = getRadioByText('Option 2');
        const option3 = getRadioByText('Option 3');

        option2.focus();

        await user.keyboard('{ArrowRight}');
        expect(option3).toHaveFocus();
        expect(option3).toHaveAttribute('aria-checked', 'true');

        await user.keyboard('{ArrowLeft}');
        expect(option2).toHaveFocus();
        expect(option2).toHaveAttribute('aria-checked', 'true');

        await user.keyboard('{ArrowDown}');
        expect(option3).toHaveFocus();
        expect(option3).toHaveAttribute('aria-checked', 'true');
      });
    });
  });

  describe('RadioItem', () => {
    describe('Rendering', () => {
      it('renders with correct attributes', () => {
        const { container } = render(
          <RadioGroup>
            <RadioItem value='option1'>Option 1</RadioItem>
          </RadioGroup>,
        );

        const radioItem = container.querySelector('label[role="radio"]') as HTMLElement;
        expect(radioItem).toHaveAttribute('aria-checked', 'false');
        expect(radioItem).toHaveAttribute('data-state', 'unchecked');
      });

      it('renders as checked when selected', () => {
        const { container } = render(
          <RadioGroup value='option1'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        const option2 = labels[1] as HTMLElement;

        expect(option1).toHaveAttribute('aria-checked', 'true');
        expect(option1).toHaveAttribute('data-state', 'checked');
        expect(option2).toHaveAttribute('aria-checked', 'false');
        expect(option2).toHaveAttribute('data-state', 'unchecked');
      });

      it('renders with aria-label', () => {
        const { container } = render(
          <RadioGroup>
            <RadioItem value='option1' aria-label='First option'>
              Option 1
            </RadioItem>
          </RadioGroup>,
        );

        const radioItem = container.querySelector('label[role="radio"]') as HTMLElement;
        expect(radioItem).toHaveAttribute('aria-label', 'First option');
      });

      it('renders with aria-describedby', () => {
        const { container } = render(
          <div>
            <p id='description'>This is the first option</p>
            <RadioGroup>
              <RadioItem value='option1' aria-describedby='description'>
                Option 1
              </RadioItem>
            </RadioGroup>
          </div>,
        );

        const radioItem = container.querySelector('label[role="radio"]') as HTMLElement;
        expect(radioItem).toHaveAttribute('aria-describedby', 'description');
      });

      it('renders as custom element when as prop is provided', () => {
        const { container } = render(
          <RadioGroup>
            <RadioItem value='option1' as='div'>
              Option 1
            </RadioItem>
          </RadioGroup>,
        );

        const radioItem = container.querySelector('[role="radio"]') as HTMLElement;
        expect(radioItem.tagName).toBe('DIV');
      });
    });

    describe('Disabled State', () => {
      it('can be individually disabled', () => {
        const { container } = render(
          <RadioGroup>
            <RadioItem value='option1' disabled>
              Option 1
            </RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        const option2 = labels[1] as HTMLElement;

        expect(option1).toHaveAttribute('data-disabled');
        expect(option1).toHaveAttribute('tabindex', '-1');
        expect(option2).not.toHaveAttribute('data-disabled');
      });

      it('prevents interaction when individually disabled', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        const { container } = render(
          <RadioGroup onValueChange={handleValueChange}>
            <RadioItem value='option1' disabled>
              Option 1
            </RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        await user.click(option1);

        expect(handleValueChange).not.toHaveBeenCalled();
        expect(option1).toHaveAttribute('aria-checked', 'false');
      });
    });

    describe('Focus Management', () => {
      it('implements roving tabindex', () => {
        const { container } = render(
          <RadioGroup value='option2'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </RadioGroup>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        const option2 = labels[1] as HTMLElement;
        const option3 = labels[2] as HTMLElement;

        // Only checked item should be focusable
        expect(option1).toHaveAttribute('tabindex', '-1');
        expect(option2).toHaveAttribute('tabindex', '0');
        expect(option3).toHaveAttribute('tabindex', '-1');
      });

      it('sets focused item when group receives focus with no selected value', async () => {
        const user = userEvent.setup();

        render(
          <RadioGroup>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </RadioGroup>,
        );

        const option1 = getRadioByText('Option 1');
        const option2 = getRadioByText('Option 2');

        await user.tab();

        expect(option1).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(option2).toHaveFocus();
      });
    });

    describe('Selection', () => {
      it('selects item on click', async () => {
        const user = userEvent.setup();

        const { container } = render(
          <RadioGroup>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </RadioGroup>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        await user.click(option1);

        expect(option1).toHaveAttribute('aria-checked', 'true');
      });
    });
  });

  describe('Error Handling', () => {
    it('throws error when RadioItem is used outside RadioGroup', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<RadioItem value='option1'>Option 1</RadioItem>);
      }).toThrow('RadioItem must be used within a RadioGroup');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<RadioGroup />);

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toBeInTheDocument();
    });
  });
});
