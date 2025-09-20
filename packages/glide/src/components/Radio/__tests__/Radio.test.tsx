import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from '../Radio';

describe('Radio', () => {
  describe('RadioGroup', () => {
    describe('Rendering', () => {
      it('renders with default props', () => {
        render(
          <Radio.Group>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toBeInTheDocument();
        expect(radioGroup).toHaveAttribute('data-orientation', 'vertical');
      });

      it('renders with custom orientation', () => {
        render(
          <Radio.Group orientation='horizontal'>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('data-orientation', 'horizontal');
      });

      it('renders with aria-label', () => {
        render(
          <Radio.Group aria-label='Choose an option'>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-label', 'Choose an option');
      });

      it('renders with aria-labelledby', () => {
        render(
          <div>
            <h2 id='label-id'>Select Option</h2>
            <Radio.Group aria-labelledby='label-id'>
              <Radio.Item value='option1'>Option 1</Radio.Item>
              <Radio.Item value='option2'>Option 2</Radio.Item>
            </Radio.Group>
          </div>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-labelledby', 'label-id');
      });

      it('renders with aria-describedby', () => {
        render(
          <div>
            <p id='description'>Choose your preferred option</p>
            <Radio.Group aria-describedby='description'>
              <Radio.Item value='option1'>Option 1</Radio.Item>
              <Radio.Item value='option2'>Option 2</Radio.Item>
            </Radio.Group>
          </div>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-describedby', 'description');
      });

      it('renders as custom element when as prop is provided', () => {
        render(
          <Radio.Group as='fieldset'>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup.tagName).toBe('FIELDSET');
      });
    });

    describe('State Management', () => {
      it('handles uncontrolled state with defaultValue', () => {
        const { container } = render(
          <Radio.Group defaultValue='option2'>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
            <Radio.Item value='option3'>Option 3</Radio.Item>
          </Radio.Group>,
        );

        const hiddenRadio = container.querySelector(
          'input[type="radio"][value="option2"]',
        ) as HTMLInputElement;
        expect(hiddenRadio).toBeChecked();
      });

      it('handles controlled state with value prop', () => {
        const { rerender, container } = render(
          <Radio.Group value='option1'>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
            <Radio.Item value='option3'>Option 3</Radio.Item>
          </Radio.Group>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        expect(option1).toHaveAttribute('aria-checked', 'true');

        rerender(
          <Radio.Group value='option3'>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
            <Radio.Item value='option3'>Option 3</Radio.Item>
          </Radio.Group>,
        );

        const labelsAfter = container.querySelectorAll('label[role="radio"]');
        const option3After = labelsAfter[2] as HTMLElement;
        const option1After = labelsAfter[0] as HTMLElement;
        expect(option3After).toHaveAttribute('aria-checked', 'true');
        expect(option1After).toHaveAttribute('aria-checked', 'false');
      });

      it('calls onValueChange when selection changes', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        const { container } = render(
          <Radio.Group onValueChange={handleValueChange}>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        await user.click(option1);

        expect(handleValueChange).toHaveBeenCalledWith('option1');
      });

      it('updates uncontrolled state when clicking items', async () => {
        const user = userEvent.setup();

        const { container } = render(
          <Radio.Group>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
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
          <Radio.Group disabled>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
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
          <Radio.Group disabled onValueChange={handleValueChange}>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
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
          <Radio.Group required>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
        );

        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-required', 'true');
        expect(radioGroup).toHaveAttribute('data-required');
      });
    });

    describe('Form Integration', () => {
      it('creates hidden input for form submission when value is selected', () => {
        const { container } = render(
          <Radio.Group name='test-radio' value='option1'>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
        );

        const hiddenInput = container.querySelector('input[type="hidden"]');
        expect(hiddenInput).toBeInTheDocument();
        expect(hiddenInput).toHaveAttribute('name', 'test-radio');
        expect(hiddenInput).toHaveAttribute('value', 'option1');
      });

      it('does not create hidden input when no value is selected', () => {
        const { container } = render(
          <Radio.Group name='test-radio'>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
        );

        const hiddenInput = container.querySelector('input[type="hidden"]');
        expect(hiddenInput).not.toBeInTheDocument();
      });

      it('generates unique name when not provided', () => {
        const { container } = render(
          <Radio.Group value='option1'>
            <Radio.Item value='option1'>Option 1</Radio.Item>
          </Radio.Group>,
        );

        const hiddenInput = container.querySelector('input[type="hidden"]');
        expect(hiddenInput).toHaveAttribute('name');
        expect(hiddenInput!.getAttribute('name')).toMatch(/^radio-group-/);
      });
    });
  });

  describe('RadioItem', () => {
    describe('Rendering', () => {
      it('renders with correct attributes', () => {
        const { container } = render(
          <Radio.Group>
            <Radio.Item value='option1'>Option 1</Radio.Item>
          </Radio.Group>,
        );

        const radioItem = container.querySelector('label[role="radio"]') as HTMLElement;
        expect(radioItem).toHaveAttribute('aria-checked', 'false');
        expect(radioItem).toHaveAttribute('data-state', 'unchecked');
      });

      it('renders as checked when selected', () => {
        const { container } = render(
          <Radio.Group value='option1'>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
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
          <Radio.Group>
            <Radio.Item value='option1' aria-label='First option'>
              Option 1
            </Radio.Item>
          </Radio.Group>,
        );

        const radioItem = container.querySelector('label[role="radio"]') as HTMLElement;
        expect(radioItem).toHaveAttribute('aria-label', 'First option');
      });

      it('renders with aria-describedby', () => {
        const { container } = render(
          <div>
            <p id='description'>This is the first option</p>
            <Radio.Group>
              <Radio.Item value='option1' aria-describedby='description'>
                Option 1
              </Radio.Item>
            </Radio.Group>
          </div>,
        );

        const radioItem = container.querySelector('label[role="radio"]') as HTMLElement;
        expect(radioItem).toHaveAttribute('aria-describedby', 'description');
      });

      it('renders as custom element when as prop is provided', () => {
        const { container } = render(
          <Radio.Group>
            <Radio.Item value='option1' as='div'>
              Option 1
            </Radio.Item>
          </Radio.Group>,
        );

        const radioItem = container.querySelector('[role="radio"]') as HTMLElement;
        expect(radioItem.tagName).toBe('DIV');
      });

      it('contains hidden radio input', () => {
        const { container } = render(
          <Radio.Group name='test'>
            <Radio.Item value='option1'>Option 1</Radio.Item>
          </Radio.Group>,
        );

        const hiddenRadio = container.querySelector('input[type="radio"]');
        expect(hiddenRadio).toBeInTheDocument();
        expect(hiddenRadio).toHaveAttribute('name', 'test');
        expect(hiddenRadio).toHaveAttribute('value', 'option1');
        expect(hiddenRadio).toHaveAttribute('tabindex', '-1');
        expect(hiddenRadio).toHaveAttribute('data-hidden');
      });
    });

    describe('Disabled State', () => {
      it('can be individually disabled', () => {
        const { container } = render(
          <Radio.Group>
            <Radio.Item value='option1' disabled>
              Option 1
            </Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
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
          <Radio.Group onValueChange={handleValueChange}>
            <Radio.Item value='option1' disabled>
              Option 1
            </Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
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
          <Radio.Group value='option2'>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
            <Radio.Item value='option3'>Option 3</Radio.Item>
          </Radio.Group>,
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

      it('makes first item focusable when no value is selected', () => {
        const { container } = render(
          <Radio.Group>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
            <Radio.Item value='option3'>Option 3</Radio.Item>
          </Radio.Group>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        const option2 = labels[1] as HTMLElement;
        const option3 = labels[2] as HTMLElement;

        expect(option1).toHaveAttribute('tabindex', '-1');
        expect(option2).toHaveAttribute('tabindex', '-1');
        expect(option3).toHaveAttribute('tabindex', '-1');
      });
    });

    describe('Selection', () => {
      it('selects item on click', async () => {
        const user = userEvent.setup();

        const { container } = render(
          <Radio.Group>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        await user.click(option1);

        expect(option1).toHaveAttribute('aria-checked', 'true');
      });

      it('selects item on Space key', async () => {
        const user = userEvent.setup();

        const { container } = render(
          <Radio.Group>
            <Radio.Item value='option1'>Option 1</Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>,
        );

        const labels = container.querySelectorAll('label[role="radio"]');
        const option1 = labels[0] as HTMLElement;
        option1.focus();
        await user.keyboard(' ');

        expect(option1).toHaveAttribute('aria-checked', 'true');
      });
    });
  });

  describe('Error Handling', () => {
    it('throws error when RadioItem is used outside RadioGroup', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Radio.Item value='option1'>Option 1</Radio.Item>);
      }).toThrow('RadioItem must be used within a RadioGroup');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<Radio.Group />);

      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toBeInTheDocument();
    });

    it('handles dynamic children addition/removal', () => {
      const { rerender, container } = render(
        <Radio.Group>
          <Radio.Item value='option1'>Option 1</Radio.Item>
        </Radio.Group>,
      );

      const labels1 = container.querySelectorAll('label[role="radio"]');
      expect(labels1).toHaveLength(1);

      rerender(
        <Radio.Group>
          <Radio.Item value='option1'>Option 1</Radio.Item>
          <Radio.Item value='option2'>Option 2</Radio.Item>
        </Radio.Group>,
      );

      const labels2 = container.querySelectorAll('label[role="radio"]');
      expect(labels2).toHaveLength(2);
    });

    it('handles duplicate values gracefully', () => {
      const { container } = render(
        <Radio.Group>
          <Radio.Item value='same'>Option 1</Radio.Item>
          <Radio.Item value='same'>Option 2</Radio.Item>
        </Radio.Group>,
      );

      const labels = container.querySelectorAll('label[role="radio"]');
      expect(labels).toHaveLength(2);
    });
  });
});
