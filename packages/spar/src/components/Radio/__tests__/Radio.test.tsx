import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio, RadioItem } from '../index';

const getRadioByText = (text: string) => {
  const radios = screen.getAllByRole('radio', { name: text });
  const interactiveRadio = radios.find((radio) => radio.tagName !== 'INPUT');
  if (!interactiveRadio) {
    throw new Error(`Interactive radio with text "${text}" not found`);
  }
  return interactiveRadio as HTMLElement;
};

describe('Radio', () => {
  describe('Root', () => {
    describe('Rendering', () => {
      it('renders with default props', () => {
        render(
          <Radio>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toBeInTheDocument();
        expect(radioGroup).toHaveAttribute('data-orientation', 'vertical');
      });

      it('renders with custom orientation', () => {
        render(
          <Radio orientation='horizontal'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('data-orientation', 'horizontal');
      });

      it('renders with aria-label', () => {
        render(
          <Radio aria-label='Choose an option'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-label', 'Choose an option');
      });

      it('renders with aria-labelledby', () => {
        render(
          <div>
            <h2 id='label-id'>Select Option</h2>
            <Radio aria-labelledby='label-id'>
              <RadioItem value='option1'>Option 1</RadioItem>
              <RadioItem value='option2'>Option 2</RadioItem>
            </Radio>
          </div>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-labelledby', 'label-id');
      });

      it('renders with aria-describedby', () => {
        render(
          <div>
            <p id='description'>Choose your preferred option</p>
            <Radio aria-describedby='description'>
              <RadioItem value='option1'>Option 1</RadioItem>
              <RadioItem value='option2'>Option 2</RadioItem>
            </Radio>
          </div>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-describedby', 'description');
      });

      it('renders as custom element when as prop is provided', () => {
        render(
          <Radio as='fieldset'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup.tagName).toBe('FIELDSET');
      });
    });

    describe('State Management', () => {
      it('handles uncontrolled state with defaultValue', () => {
        const { container } = render(
          <Radio defaultValue='option2'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </Radio>,
        );

        const hiddenRadio = container.querySelector(
          'input[type="radio"][value="option2"]',
        ) as HTMLInputElement;
        expect(hiddenRadio).toBeChecked();
      });

      it('handles controlled state with value prop', () => {
        const { rerender } = render(
          <Radio value='option1'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </Radio>,
        );

        const option1 = getRadioByText('Option 1');
        expect(option1).toHaveAttribute('aria-checked', 'true');

        rerender(
          <Radio value='option3'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </Radio>,
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
          <Radio value='option1' onChange={handleValueChange}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const option1 = getRadioByText('Option 1');
        const option2 = getRadioByText('Option 2');
        await user.click(option2);

        expect(handleValueChange).toHaveBeenCalledWith('option2');
        expect(option1).toHaveAttribute('aria-checked', 'true');
        expect(option2).toHaveAttribute('aria-checked', 'false');
      });

      it('calls onChange when selection changes', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        const { container } = render(
          <Radio onChange={handleValueChange}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const labels = container.querySelectorAll('[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        await user.click(option1);

        expect(handleValueChange).toHaveBeenCalledWith('option1');
      });

      it('updates uncontrolled state when clicking items', async () => {
        const user = userEvent.setup();

        const { container } = render(
          <Radio>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const labels = container.querySelectorAll('[role="radio"]');
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
          <Radio disabled>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
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
          <Radio disabled onChange={handleValueChange}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const labels = container.querySelectorAll('[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        await user.click(option1);

        expect(handleValueChange).not.toHaveBeenCalled();
        expect(option1).toHaveAttribute('aria-checked', 'false');
      });
    });

    describe('Required State', () => {
      it('sets aria-required when required prop is true', () => {
        render(
          <Radio required>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-required', 'true');
        expect(radioGroup).toHaveAttribute('data-required');
      });
    });

    describe('Form Integration', () => {
      const getCheckedNativeInput = (container: HTMLElement) =>
        container.querySelector('input[type="radio"]:checked') as HTMLInputElement | null;

      it('checks the native radio input of the selected item for form submission', () => {
        const { container } = render(
          <Radio name='test-radio' value='option1'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const checkedInput = getCheckedNativeInput(container);
        expect(checkedInput).toBeInTheDocument();
        expect(checkedInput).toHaveAttribute('name', 'test-radio');
        expect(checkedInput).toHaveAttribute('value', 'option1');
      });

      it('checks no native input when no value is selected', () => {
        const { container } = render(
          <Radio name='test-radio'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        expect(getCheckedNativeInput(container)).not.toBeInTheDocument();
      });

      it('submits the selected value exactly once in form data', () => {
        const { container } = render(
          <form>
            <Radio name='plan' value='pro'>
              <RadioItem value='basic'>Basic</RadioItem>
              <RadioItem value='pro'>Pro</RadioItem>
            </Radio>
          </form>,
        );

        const formData = new FormData(container.querySelector('form') as HTMLFormElement);
        expect(formData.getAll('plan')).toEqual(['pro']);
        expect(container.querySelector('input[type="hidden"]')).not.toBeInTheDocument();
      });

      it('enforces required through the native validity of the item inputs', async () => {
        const user = userEvent.setup();

        const { container } = render(
          <form>
            <Radio name='plan' required>
              <RadioItem value='basic'>Basic</RadioItem>
              <RadioItem value='pro'>Pro</RadioItem>
            </Radio>
          </form>,
        );

        const form = container.querySelector('form') as HTMLFormElement;
        expect(form.checkValidity()).toBe(false);

        await user.click(getRadioByText('Pro'));

        expect(form.checkValidity()).toBe(true);
        expect(new FormData(form).getAll('plan')).toEqual(['pro']);
      });

      it('generates unique name when not provided', () => {
        const { container } = render(
          <Radio value='option1'>
            <RadioItem value='option1'>Option 1</RadioItem>
          </Radio>,
        );

        const checkedInput = getCheckedNativeInput(container);
        expect(checkedInput).toHaveAttribute('name');
        expect(checkedInput!.getAttribute('name')).toMatch(/-radio-group$/);
      });

      it('uses id as base for generated name when name is not provided', () => {
        const { container } = render(
          <Radio id='shipping' value='express'>
            <RadioItem value='express'>Express</RadioItem>
          </Radio>,
        );

        expect(getCheckedNativeInput(container)).toHaveAttribute('name', 'shipping-radio-group');
      });

      it('does not fallback to generated id when id is an empty string', () => {
        const { container } = render(
          <Radio id='' value='express'>
            <RadioItem value='express'>Express</RadioItem>
          </Radio>,
        );

        expect(getCheckedNativeInput(container)).toHaveAttribute('name', '-radio-group');
      });

      it('prioritizes explicit name over id-derived name', () => {
        const { container } = render(
          <Radio id='shipping' name='delivery-method' value='express'>
            <RadioItem value='express'>Express</RadioItem>
          </Radio>,
        );

        expect(getCheckedNativeInput(container)).toHaveAttribute('name', 'delivery-method');
      });
    });

    describe('Keyboard Navigation', () => {
      it('keeps only first enabled item tabbable when no radio is checked', () => {
        const { container } = render(
          <Radio>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </Radio>,
        );

        const labels = container.querySelectorAll('[role="radio"]');
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
          <Radio defaultValue='option1'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </Radio>,
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
          <Radio defaultValue='option1' selectOnFocus={false}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </Radio>,
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
          <Radio defaultValue='option2'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </Radio>,
        );

        const option1 = getRadioByText('Option 1');
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

      it('uses arrow keys for navigation', async () => {
        const user = userEvent.setup();

        render(
          <Radio defaultValue='option2'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </Radio>,
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

        await user.keyboard('{ArrowUp}');
        expect(option2).toHaveFocus();
        expect(option2).toHaveAttribute('aria-checked', 'true');
      });
    });
    describe('Read-only State', () => {
      it('exposes aria-readonly on the radiogroup, not on the items', () => {
        render(
          <Radio readOnly>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-readonly', 'true');
        expect(getRadioByText('Option 1')).not.toHaveAttribute('aria-readonly');
        expect(getRadioByText('Option 1')).toHaveAttribute('data-readonly', '');
      });

      it('moves focus with arrow keys and Home/End without changing the value', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        render(
          <Radio readOnly defaultValue='option1' onChange={handleValueChange}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </Radio>,
        );

        const option1 = getRadioByText('Option 1');
        const option2 = getRadioByText('Option 2');
        const option3 = getRadioByText('Option 3');

        option1.focus();
        await user.keyboard('{ArrowDown}');
        expect(option2).toHaveFocus();
        await user.keyboard('{End}');
        expect(option3).toHaveFocus();
        await user.keyboard('{Home}');
        expect(option1).toHaveFocus();

        expect(handleValueChange).not.toHaveBeenCalled();
        expect(option1).toHaveAttribute('aria-checked', 'true');
        expect(option2).toHaveAttribute('aria-checked', 'false');
        expect(option3).toHaveAttribute('aria-checked', 'false');
      });

      it('ignores click, Space and Enter when read-only', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        render(
          <Radio readOnly defaultValue='option1' onChange={handleValueChange}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const option2 = getRadioByText('Option 2');
        await user.click(option2);
        option2.focus();
        await user.keyboard(' ');
        await user.keyboard('{Enter}');

        expect(handleValueChange).not.toHaveBeenCalled();
        expect(option2).toHaveAttribute('aria-checked', 'false');
      });
    });

    describe('Change Notifications', () => {
      it('does not call onChange when the already-checked item is clicked', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        render(
          <Radio defaultValue='option1' onChange={handleValueChange}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        await user.click(getRadioByText('Option 1'));
        expect(handleValueChange).not.toHaveBeenCalled();

        await user.click(getRadioByText('Option 2'));
        expect(handleValueChange).toHaveBeenCalledTimes(1);
        expect(handleValueChange).toHaveBeenCalledWith('option2');

        await user.click(getRadioByText('Option 2'));
        expect(handleValueChange).toHaveBeenCalledTimes(1);
      });

      it('does not call onChange when select() is invoked for the checked item', () => {
        const handleValueChange = jest.fn();
        let selectOption1: (() => void) | undefined;

        render(
          <Radio value='option1' onChange={handleValueChange}>
            <RadioItem value='option1'>
              {({ select }) => {
                selectOption1 = select;
                return 'Option 1';
              }}
            </RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        act(() => selectOption1?.());
        expect(handleValueChange).not.toHaveBeenCalled();
      });

      it('still calls onChange on repeated clicks in controlled mode when the parent keeps the old value', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        render(
          <Radio value='option1' onChange={handleValueChange}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        await user.click(getRadioByText('Option 2'));
        await user.click(getRadioByText('Option 2'));
        expect(handleValueChange).toHaveBeenCalledTimes(2);
      });
    });

    describe('Handler Composition', () => {
      it('calls a consumer onKeyDown on the group and keeps arrow navigation working', async () => {
        const user = userEvent.setup();
        const handleKeyDown = jest.fn();

        render(
          <Radio defaultValue='option1' onKeyDown={handleKeyDown}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        getRadioByText('Option 1').focus();
        await user.keyboard('{ArrowDown}');

        expect(handleKeyDown).toHaveBeenCalledTimes(1);
        expect(handleKeyDown.mock.calls[0][0].key).toBe('ArrowDown');
        expect(getRadioByText('Option 2')).toHaveFocus();
        expect(getRadioByText('Option 2')).toHaveAttribute('aria-checked', 'true');
      });

      it('lets a consumer onKeyDown on the group veto navigation with preventDefault', async () => {
        const user = userEvent.setup();

        render(
          <Radio defaultValue='option1' onKeyDown={(event) => event.preventDefault()}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const option1 = getRadioByText('Option 1');
        option1.focus();
        await user.keyboard('{ArrowDown}');

        expect(option1).toHaveFocus();
        expect(option1).toHaveAttribute('aria-checked', 'true');
      });

      it('composes consumer onFocus and onBlur on the group with the internal focus tracking', async () => {
        const user = userEvent.setup();
        const handleFocus = jest.fn();
        const handleBlur = jest.fn();

        render(
          <>
            <Radio onFocus={handleFocus} onBlur={handleBlur}>
              <RadioItem value='option1'>Option 1</RadioItem>
              <RadioItem value='option2'>Option 2</RadioItem>
            </Radio>
            <button type='button'>Next</button>
          </>,
        );

        await user.tab();
        expect(handleFocus).toHaveBeenCalledTimes(1);
        expect(getRadioByText('Option 1')).toHaveAttribute('data-focus', '');

        await user.keyboard('{ArrowDown}');
        expect(getRadioByText('Option 2')).toHaveFocus();

        await user.tab();
        expect(handleBlur).toHaveBeenCalled();
        expect(getRadioByText('Option 2')).not.toHaveAttribute('data-focus');
      });
    });

    describe('Dynamic Items', () => {
      it('keeps arrow order when a middle item toggles disabled', async () => {
        const user = userEvent.setup();

        const ToggleMiddle = () => {
          const [middleDisabled, setMiddleDisabled] = React.useState(false);
          return (
            <>
              <button type='button' onClick={() => setMiddleDisabled((prev) => !prev)}>
                Toggle
              </button>
              <Radio defaultValue='option1'>
                <RadioItem value='option1'>Option 1</RadioItem>
                <RadioItem value='option2' disabled={middleDisabled}>
                  Option 2
                </RadioItem>
                <RadioItem value='option3'>Option 3</RadioItem>
              </Radio>
            </>
          );
        };

        render(<ToggleMiddle />);
        const toggle = screen.getByRole('button', { name: 'Toggle' });

        // Disabled: navigation skips the middle item
        await user.click(toggle);
        getRadioByText('Option 1').focus();
        await user.keyboard('{ArrowDown}');
        expect(getRadioByText('Option 3')).toHaveFocus();

        // Re-enabled: the middle item is back in its DOM position, not appended last
        await user.click(toggle);
        getRadioByText('Option 1').focus();
        await user.keyboard('{ArrowDown}');
        expect(getRadioByText('Option 2')).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(getRadioByText('Option 3')).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(getRadioByText('Option 1')).toHaveFocus();
      });
    });
  });

  describe('RadioItem', () => {
    describe('Rendering', () => {
      it('renders with correct attributes', () => {
        const { container } = render(
          <Radio>
            <RadioItem value='option1'>Option 1</RadioItem>
          </Radio>,
        );

        const radioItem = container.querySelector('[role="radio"]') as HTMLElement;
        expect(radioItem.tagName).toBe('SPAN');
        expect(radioItem).toHaveAttribute('aria-checked', 'false');
        expect(radioItem).toHaveAttribute('data-state', 'unchecked');
      });

      it('renders as checked when selected', () => {
        const { container } = render(
          <Radio value='option1'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const labels = container.querySelectorAll('[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        const option2 = labels[1] as HTMLElement;

        expect(option1).toHaveAttribute('aria-checked', 'true');
        expect(option1).toHaveAttribute('data-state', 'checked');
        expect(option2).toHaveAttribute('aria-checked', 'false');
        expect(option2).toHaveAttribute('data-state', 'unchecked');
      });

      it('renders with aria-label', () => {
        const { container } = render(
          <Radio>
            <RadioItem value='option1' aria-label='First option'>
              Option 1
            </RadioItem>
          </Radio>,
        );

        const radioItem = container.querySelector('[role="radio"]') as HTMLElement;
        expect(radioItem).toHaveAttribute('aria-label', 'First option');
      });

      it('renders with aria-describedby', () => {
        const { container } = render(
          <div>
            <p id='description'>This is the first option</p>
            <Radio>
              <RadioItem value='option1' aria-describedby='description'>
                Option 1
              </RadioItem>
            </Radio>
          </div>,
        );

        const radioItem = container.querySelector('[role="radio"]') as HTMLElement;
        expect(radioItem).toHaveAttribute('aria-describedby', 'description');
      });

      it('renders as custom element when as prop is provided', () => {
        const { container } = render(
          <Radio>
            <RadioItem value='option1' as='div'>
              Option 1
            </RadioItem>
          </Radio>,
        );

        const radioItem = container.querySelector('[role="radio"]') as HTMLElement;
        expect(radioItem.tagName).toBe('DIV');
      });
    });

    describe('Disabled State', () => {
      it('can be individually disabled', () => {
        const { container } = render(
          <Radio>
            <RadioItem value='option1' disabled>
              Option 1
            </RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const labels = container.querySelectorAll('[role="radio"]');
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
          <Radio onChange={handleValueChange}>
            <RadioItem value='option1' disabled>
              Option 1
            </RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const labels = container.querySelectorAll('[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        await user.click(option1);

        expect(handleValueChange).not.toHaveBeenCalled();
        expect(option1).toHaveAttribute('aria-checked', 'false');
      });
    });

    describe('Focus Management', () => {
      it('implements roving tabindex', () => {
        const { container } = render(
          <Radio value='option2'>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </Radio>,
        );

        const labels = container.querySelectorAll('[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        const option2 = labels[1] as HTMLElement;
        const option3 = labels[2] as HTMLElement;

        // Only checked item should be focusable
        expect(option1).toHaveAttribute('tabindex', '-1');
        expect(option2).toHaveAttribute('tabindex', '0');
        expect(option3).toHaveAttribute('tabindex', '-1');
      });

      it('makes the first enabled item tabbable when the checked item is disabled', async () => {
        const user = userEvent.setup();

        render(
          <>
            <button type='button'>Before</button>
            <Radio value='option2'>
              <RadioItem value='option1' disabled>
                Option 1
              </RadioItem>
              <RadioItem value='option2' disabled>
                Option 2
              </RadioItem>
              <RadioItem value='option3'>Option 3</RadioItem>
            </Radio>
          </>,
        );

        expect(getRadioByText('Option 1')).toHaveAttribute('tabindex', '-1');
        expect(getRadioByText('Option 2')).toHaveAttribute('tabindex', '-1');
        expect(getRadioByText('Option 3')).toHaveAttribute('tabindex', '0');

        await user.tab();
        await user.tab();
        expect(getRadioByText('Option 3')).toHaveFocus();
      });

      it('keeps exactly one tab stop while focus roves inside the group', async () => {
        const user = userEvent.setup();

        render(
          <Radio defaultValue='option1' selectOnFocus={false}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const option1 = getRadioByText('Option 1');
        const option2 = getRadioByText('Option 2');

        option1.focus();
        await user.keyboard('{ArrowDown}');

        expect(option2).toHaveFocus();
        expect(option2).toHaveAttribute('tabindex', '0');
        expect(option1).toHaveAttribute('tabindex', '-1');
      });

      it('sets focused item when group receives focus with no selected value', async () => {
        const user = userEvent.setup();

        render(
          <Radio>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
            <RadioItem value='option3'>Option 3</RadioItem>
          </Radio>,
        );

        const option1 = getRadioByText('Option 1');
        const option2 = getRadioByText('Option 2');

        await user.tab();

        expect(option1).toHaveFocus();
        await user.keyboard('{ArrowDown}');
        expect(option2).toHaveFocus();
      });

      it('removes data-focus when focus leaves the group', async () => {
        const user = userEvent.setup();
        const handleBlur = jest.fn();

        render(
          <>
            <Radio onBlur={handleBlur}>
              <RadioItem value='option1'>Option 1</RadioItem>
              <RadioItem value='option2'>Option 2</RadioItem>
            </Radio>
            <button type='button'>Next</button>
          </>,
        );

        const option1 = getRadioByText('Option 1');
        const nextButton = screen.getByRole('button', { name: 'Next' });

        await user.tab();

        expect(option1).toHaveFocus();
        expect(option1).toHaveAttribute('data-focus', '');

        await user.tab();

        expect(nextButton).toHaveFocus();
        expect(option1).not.toHaveAttribute('data-focus');
        expect(handleBlur).toHaveBeenCalled();
      });
    });

    describe('Selection', () => {
      it('selects item on click', async () => {
        const user = userEvent.setup();

        const { container } = render(
          <Radio>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const labels = container.querySelectorAll('[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        await user.click(option1);

        expect(option1).toHaveAttribute('aria-checked', 'true');
      });

      it('selects the focused item with Enter when selectOnFocus is false', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        render(
          <Radio defaultValue='option1' selectOnFocus={false} onChange={handleValueChange}>
            <RadioItem value='option1'>Option 1</RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const option2 = getRadioByText('Option 2');
        getRadioByText('Option 1').focus();
        await user.keyboard('{ArrowDown}');
        expect(option2).toHaveFocus();
        expect(option2).toHaveAttribute('aria-checked', 'false');

        await user.keyboard('{Enter}');
        expect(option2).toHaveAttribute('aria-checked', 'true');
        expect(handleValueChange).toHaveBeenCalledTimes(1);
        expect(handleValueChange).toHaveBeenCalledWith('option2');
      });

      it('calls a consumer onClick and still selects the item', async () => {
        const user = userEvent.setup();
        const handleClick = jest.fn();

        render(
          <Radio>
            <RadioItem value='option1' onClick={handleClick}>
              Option 1
            </RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const option1 = getRadioByText('Option 1');
        await user.click(option1);

        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(option1).toHaveAttribute('aria-checked', 'true');
      });

      it('lets a consumer onClick veto selection with preventDefault', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        render(
          <Radio onChange={handleValueChange}>
            <RadioItem value='option1' onClick={(event) => event.preventDefault()}>
              Option 1
            </RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const option1 = getRadioByText('Option 1');
        await user.click(option1);

        expect(handleValueChange).not.toHaveBeenCalled();
        expect(option1).toHaveAttribute('aria-checked', 'false');
      });

      it('composes consumer onKeyDown and onFocus on the item with the internal handlers', async () => {
        const user = userEvent.setup();
        const handleKeyDown = jest.fn();
        const handleFocus = jest.fn();

        render(
          <Radio selectOnFocus={false}>
            <RadioItem value='option1' onKeyDown={handleKeyDown} onFocus={handleFocus}>
              Option 1
            </RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        const option1 = getRadioByText('Option 1');
        await user.tab();

        expect(handleFocus).toHaveBeenCalledTimes(1);
        expect(option1).toHaveFocus();
        expect(option1).toHaveAttribute('data-focus', '');

        await user.keyboard(' ');
        expect(handleKeyDown).toHaveBeenCalledTimes(1);
        expect(option1).toHaveAttribute('aria-checked', 'true');
      });

      it('lets a consumer onKeyDown on the item veto Space selection with preventDefault', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        render(
          <Radio selectOnFocus={false} onChange={handleValueChange}>
            <RadioItem value='option1' onKeyDown={(event) => event.preventDefault()}>
              Option 1
            </RadioItem>
            <RadioItem value='option2'>Option 2</RadioItem>
          </Radio>,
        );

        await user.tab();
        await user.keyboard(' ');

        expect(handleValueChange).not.toHaveBeenCalled();
        expect(getRadioByText('Option 1')).toHaveAttribute('aria-checked', 'false');
      });
    });
  });

  describe('Error Handling', () => {
    it('throws error when RadioItem is used outside Radio', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<RadioItem value='option1'>Option 1</RadioItem>);
      }).toThrow('RadioItem must be used within a Radio');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<Radio />);

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toBeInTheDocument();
    });
  });
});
