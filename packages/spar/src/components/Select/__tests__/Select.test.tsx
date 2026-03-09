import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectItemText,
} from '../index';

const renderSelect = (props?: React.ComponentProps<typeof Select>) => {
  return render(
    <Select {...props}>
      <SelectTrigger aria-label='Choose option'>
        <SelectValue placeholder='Select...' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='option1'>
          <SelectItemText>Option 1</SelectItemText>
        </SelectItem>
        <SelectItem value='option2'>
          <SelectItemText>Option 2</SelectItemText>
        </SelectItem>
        <SelectItem value='option3' disabled>
          <SelectItemText>Option 3</SelectItemText>
        </SelectItem>
      </SelectContent>
    </Select>,
  );
};

describe('Select', () => {
  it('keeps aria contract and id suffixes when custom id is provided', async () => {
    const user = userEvent.setup();

    renderSelect({ id: 'plan-select', required: true });

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('id', 'plan-select-trigger');
    expect(trigger).toHaveAttribute('aria-controls', 'plan-select-content');
    expect(trigger).toHaveAttribute('aria-labelledby', 'plan-select-value');
    expect(trigger).toHaveAttribute('aria-required', 'true');

    await user.click(trigger);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('id', 'plan-select-content');
    expect(listbox).toHaveAttribute('aria-labelledby', 'plan-select-trigger');
  });

  it('updates uncontrolled value and hidden input after selection', async () => {
    const user = userEvent.setup();
    const { container } = renderSelect({ name: 'plan' });

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Option 2' }));

    expect(trigger).toHaveTextContent('Option 2');
    const hiddenInput = container.querySelector('input[type="hidden"]');
    expect(hiddenInput).toHaveAttribute('name', 'plan');
    expect(hiddenInput).toHaveAttribute('value', 'option2');
  });

  it('supports controlled value and only updates UI after parent rerender', async () => {
    const user = userEvent.setup();
    const handleValueChange = jest.fn();

    const Controlled = ({ value }: { value: string }) => (
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger aria-label='Choose option'>
          <SelectValue placeholder='Select...' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
          <SelectItem value='option2'>
            <SelectItemText>Option 2</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>
    );

    const { rerender } = render(<Controlled value='option1' />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Option 2' }));

    expect(handleValueChange).toHaveBeenCalledWith('option2');
    expect(trigger).toHaveTextContent('Option 1');

    rerender(<Controlled value='option2' />);
    expect(trigger).toHaveTextContent('Option 2');
  });

  it('does not open or emit value change when root is disabled', async () => {
    const user = userEvent.setup();
    const handleValueChange = jest.fn();

    renderSelect({ disabled: true, onValueChange: handleValueChange });

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it('opens with ArrowDown and selects the last enabled option with End + Enter', async () => {
    const user = userEvent.setup();

    renderSelect();

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    await user.keyboard('{ArrowDown}');
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveFocus();

    listbox.focus();
    await user.keyboard('{End}');
    await user.keyboard('{Enter}');

    expect(trigger).toHaveTextContent('Option 2');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('supports Home/End keyboard navigation and skips disabled options', async () => {
    const user = userEvent.setup();

    renderSelect();

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    await user.keyboard('{ArrowDown}');

    await user.keyboard('{End}');
    expect(screen.getByRole('option', { name: 'Option 2' })).toHaveAttribute('data-highlighted');

    await user.keyboard('{Home}');
    expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute('data-highlighted');
  });

  it('closes with Tab and leaves no open listbox in the DOM', async () => {
    const user = userEvent.setup();

    renderSelect();

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Tab}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('throws when trigger is rendered outside Select root', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        <SelectTrigger>
          <SelectValue placeholder='Select...' />
        </SelectTrigger>,
      );
    }).toThrow('Select components must be used within a Select');

    consoleErrorSpy.mockRestore();
  });
});
