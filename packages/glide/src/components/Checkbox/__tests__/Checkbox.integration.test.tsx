import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Checkbox } from '../Checkbox';
import type { CheckedState } from '../../../types';

// Integration tests covering user workflows and complex scenarios
describe('Checkbox Integration Tests', () => {
  describe('Form Integration', () => {
    it('should integrate with form submission', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();

      const FormComponent = () => {
        const [isAgreed, setIsAgreed] = useState(false);

        const onSubmit = (event: React.FormEvent) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget as HTMLFormElement);
          handleSubmit({
            agreed: formData.get('terms') === 'on',
            isAgreedState: isAgreed,
          });
        };

        const handleAgreementChange = (checked: CheckedState) => {
          if (typeof checked === 'boolean') {
            setIsAgreed(checked);
          }
        };

        return (
          <form onSubmit={onSubmit}>
            <Checkbox name='terms' checked={isAgreed} onChange={handleAgreementChange}>
              I agree to the terms
            </Checkbox>
            <button type='submit'>Submit</button>
          </form>
        );
      };

      render(<FormComponent />);

      const checkbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      // Submit without checking
      await user.click(submitButton);
      expect(handleSubmit).toHaveBeenCalledWith({
        agreed: false,
        isAgreedState: false,
      });

      // Check and submit
      await user.click(checkbox);
      await user.click(submitButton);
      expect(handleSubmit).toHaveBeenCalledWith({
        agreed: true,
        isAgreedState: true,
      });
    });

    it('should work with form validation', async () => {
      const user = userEvent.setup();
      const handleValidation = jest.fn();

      const ValidationFormComponent = () => {
        const [isChecked, setIsChecked] = useState(false);
        const [error, setError] = useState('');

        const validateAndSubmit = (event: React.FormEvent) => {
          event.preventDefault();

          if (!isChecked) {
            setError('You must agree to the terms');
            handleValidation({ isValid: false, error: 'You must agree to the terms' });
          } else {
            setError('');
            handleValidation({ isValid: true, error: '' });
          }
        };

        const handleCheckedChange = (checked: CheckedState) => {
          if (typeof checked === 'boolean') {
            setIsChecked(checked);
          }
        };

        return (
          <form onSubmit={validateAndSubmit}>
            <Checkbox checked={isChecked} onChange={handleCheckedChange} data-invalid={!!error}>
              I agree to the terms
            </Checkbox>
            {error && <div role='alert'>{error}</div>}
            <button type='submit'>Submit</button>
          </form>
        );
      };

      render(<ValidationFormComponent />);

      const checkbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      // Submit without checking - should show error
      await user.click(submitButton);
      expect(handleValidation).toHaveBeenCalledWith({
        isValid: false,
        error: 'You must agree to the terms',
      });
      expect(screen.getByRole('alert')).toHaveTextContent('You must agree to the terms');
      expect(checkbox).toHaveAttribute('data-invalid', 'true');

      // Check and submit - should be valid
      await user.click(checkbox);
      await user.click(submitButton);
      expect(handleValidation).toHaveBeenCalledWith({
        isValid: true,
        error: '',
      });
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(checkbox).toHaveAttribute('data-invalid', 'false');
    });
  });

  describe('Multi-Checkbox Workflows', () => {
    it('should handle select all functionality', async () => {
      const user = userEvent.setup();
      const handleSelectionChange = jest.fn();

      const MultiSelectComponent = () => {
        const [items, setItems] = useState([
          { id: 1, name: 'Item 1', checked: false },
          { id: 2, name: 'Item 2', checked: false },
          { id: 3, name: 'Item 3', checked: false },
        ]);

        const handleSelectAll = (checked: CheckedState) => {
          if (typeof checked === 'boolean') {
            const updatedItems = items.map((item) => ({ ...item, checked }));
            setItems(updatedItems);
            handleSelectionChange({ selectAll: checked, items: updatedItems });
          }
        };

        const handleItemChange = (id: number, checked: CheckedState) => {
          if (typeof checked === 'boolean') {
            const updatedItems = items.map((item) =>
              item.id === id ? { ...item, checked } : item,
            );
            setItems(updatedItems);

            const allChecked = updatedItems.every((item) => item.checked);
            const someChecked = updatedItems.some((item) => item.checked);

            handleSelectionChange({
              selectAll: allChecked,
              indeterminate: someChecked && !allChecked,
              items: updatedItems,
            });
          }
        };

        const allChecked = items.every((item) => item.checked);

        return (
          <div>
            <Checkbox checked={allChecked} onChange={handleSelectAll} data-testid='select-all'>
              Select All
            </Checkbox>
            {items.map((item) => (
              <Checkbox
                key={item.id}
                checked={item.checked}
                onChange={(checked) => handleItemChange(item.id, checked)}
                data-testid={`item-${item.id}`}
              >
                {item.name}
              </Checkbox>
            ))}
          </div>
        );
      };

      render(<MultiSelectComponent />);

      const selectAll = screen.getByTestId('select-all');
      const item1 = screen.getByTestId('item-1');
      const item2 = screen.getByTestId('item-2');
      const item3 = screen.getByTestId('item-3');

      // Initially nothing selected
      expect(selectAll).not.toBeChecked();
      expect(selectAll).toHaveAttribute('aria-checked', 'false');

      // Select one item - select all should remain unchecked (no indeterminate support)
      await user.click(item1);
      expect(selectAll).not.toBeChecked();
      expect(selectAll).toHaveAttribute('aria-checked', 'false');
      expect(handleSelectionChange).toHaveBeenLastCalledWith({
        selectAll: false,
        indeterminate: true,
        items: expect.arrayContaining([
          expect.objectContaining({ id: 1, checked: true }),
          expect.objectContaining({ id: 2, checked: false }),
          expect.objectContaining({ id: 3, checked: false }),
        ]),
      });

      // Select all items individually - should check select all
      await user.click(item2);
      await user.click(item3);
      expect(selectAll).toBeChecked();
      expect(selectAll).toHaveAttribute('aria-checked', 'true');

      // Click select all to uncheck everything
      await user.click(selectAll);
      expect(selectAll).not.toBeChecked();
      expect(item1).not.toBeChecked();
      expect(item2).not.toBeChecked();
      expect(item3).not.toBeChecked();
      expect(handleSelectionChange).toHaveBeenLastCalledWith({
        selectAll: false,
        items: expect.arrayContaining([
          expect.objectContaining({ id: 1, checked: false }),
          expect.objectContaining({ id: 2, checked: false }),
          expect.objectContaining({ id: 3, checked: false }),
        ]),
      });
    });
  });

  describe('Accessibility Workflows', () => {
    it('should support keyboard navigation workflow', async () => {
      const user = userEvent.setup();
      const handleNavigation = jest.fn();

      const KeyboardNavigationComponent = () => {
        const [selections, setSelections] = useState({
          option1: false,
          option2: false,
          option3: false,
        });

        const handleChange = (option: keyof typeof selections, checked: CheckedState) => {
          if (typeof checked === 'boolean') {
            const newSelections = { ...selections, [option]: checked };
            setSelections(newSelections);
            handleNavigation({
              option,
              checked,
              totalSelected: Object.values(newSelections).filter(Boolean).length,
            });
          }
        };

        return (
          <fieldset>
            <legend>Choose your preferences</legend>
            <Checkbox
              checked={selections.option1}
              onChange={(checked) => handleChange('option1', checked)}
              data-testid='option1'
            >
              Option 1
            </Checkbox>
            <Checkbox
              checked={selections.option2}
              onChange={(checked) => handleChange('option2', checked)}
              data-testid='option2'
            >
              Option 2
            </Checkbox>
            <Checkbox
              checked={selections.option3}
              onChange={(checked) => handleChange('option3', checked)}
              data-testid='option3'
            >
              Option 3
            </Checkbox>
          </fieldset>
        );
      };

      render(<KeyboardNavigationComponent />);

      const option1 = screen.getByTestId('option1');
      const option2 = screen.getByTestId('option2');
      const option3 = screen.getByTestId('option3');

      // Navigate and select using keyboard only
      await user.tab(); // Focus first checkbox
      expect(option1).toHaveFocus();

      await user.keyboard(' '); // Select first option
      expect(option1).toBeChecked();
      expect(handleNavigation).toHaveBeenLastCalledWith({
        option: 'option1',
        checked: true,
        totalSelected: 1,
      });

      await user.tab(); // Move to second checkbox
      expect(option2).toHaveFocus();

      await user.keyboard(' '); // Select second option
      expect(option2).toBeChecked();
      expect(handleNavigation).toHaveBeenLastCalledWith({
        option: 'option2',
        checked: true,
        totalSelected: 2,
      });

      await user.tab(); // Move to third checkbox
      expect(option3).toHaveFocus();

      await user.keyboard('{Shift>}{Tab}{/Shift}'); // Go back to second checkbox
      expect(option2).toHaveFocus();

      await user.keyboard(' '); // Unselect second option
      expect(option2).not.toBeChecked();
      expect(handleNavigation).toHaveBeenLastCalledWith({
        option: 'option2',
        checked: false,
        totalSelected: 1,
      });
    });
  });
});
