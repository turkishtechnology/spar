import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../index';

const renderSelect = (props?: React.ComponentProps<typeof Select>) => {
  return render(
    <Select {...props}>
      <SelectTrigger aria-label='Choose option' placeholder='Select...' />
      <SelectContent>
        <SelectItem value='option1' label='Option 1'>
          Option 1
        </SelectItem>
        <SelectItem value='option2' label='Option 2'>
          Option 2
        </SelectItem>
        <SelectItem value='option3' label='Option 3' disabled>
          Option 3
        </SelectItem>
      </SelectContent>
    </Select>,
  );
};

describe('Select', () => {
  it('shows the selected item label on first render when defaultValue is set', () => {
    render(
      <Select defaultValue='option2'>
        <SelectTrigger aria-label='Choose option' placeholder='Select...' />
        <SelectContent>
          <SelectItem value='option1' label='Option 1'>
            Option 1
          </SelectItem>
          <SelectItem value='option2' label='Option 2'>
            Option 2
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
  });

  it('shows the selected item label on first render when value is controlled', () => {
    render(
      <Select value='option1' onChange={() => {}}>
        <SelectTrigger aria-label='Choose option' placeholder='Select...' />
        <SelectContent>
          <SelectItem value='option1' label='Option 1'>
            Option 1
          </SelectItem>
          <SelectItem value='option2' label='Option 2'>
            Option 2
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Option 1');
  });

  it('keeps aria contract and id suffixes when custom id is provided', async () => {
    const user = userEvent.setup();

    renderSelect({ id: 'plan-select', required: true });

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('id', 'plan-select-trigger');
    expect(trigger).toHaveAttribute('aria-controls', 'plan-select-content');
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
      <Select value={value} onChange={handleValueChange}>
        <SelectTrigger aria-label='Choose option' placeholder='Select...' />
        <SelectContent>
          <SelectItem value='option1' label='Option 1'>
            Option 1
          </SelectItem>
          <SelectItem value='option2' label='Option 2'>
            Option 2
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

    renderSelect({ disabled: true, onChange: handleValueChange });

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

  it('closes listbox and focuses trigger when Tab is pressed', async () => {
    const user = userEvent.setup();

    renderSelect();

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Tab}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('derives the trigger label from plain-text children when no label prop is set', () => {
    render(
      <Select defaultValue='apple'>
        <SelectTrigger aria-label='Fruit' placeholder='Select...' />
        <SelectContent>
          <SelectItem value='apple'>Apple</SelectItem>
          <SelectItem value='banana'>Banana</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
  });

  it('derives the label from rendered text when children are elements', () => {
    render(
      <Select defaultValue='apple'>
        <SelectTrigger aria-label='Fruit' placeholder='Select...' />
        <SelectContent>
          <SelectItem value='apple'>
            <span aria-hidden>*</span> Apple
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
  });

  it('keeps the listbox open when onEscapeKeyDown prevents default', async () => {
    const user = userEvent.setup();

    render(
      <Select>
        <SelectTrigger aria-label='Choose option' placeholder='Select...' />
        <SelectContent onEscapeKeyDown={(event) => event.preventDefault()}>
          <SelectItem value='option1' label='Option 1'>
            Option 1
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('does not restore focus to the trigger when onCloseAutoFocus is prevented', async () => {
    const user = userEvent.setup();

    render(
      <Select>
        <SelectTrigger aria-label='Choose option' placeholder='Select...' />
        <SelectContent onCloseAutoFocus={(event) => event.preventDefault()}>
          <SelectItem value='option1' label='Option 1'>
            Option 1
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Option 1' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).not.toHaveFocus();
  });

  it('continues typeahead through a space to match multi-word labels', async () => {
    const user = userEvent.setup();

    render(
      <Select>
        <SelectTrigger aria-label='City' placeholder='Select...' />
        <SelectContent>
          <SelectItem value='boston' label='Boston'>
            Boston
          </SelectItem>
          <SelectItem value='newyork' label='New York'>
            New York
          </SelectItem>
          <SelectItem value='newark' label='Newark'>
            Newark
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox'));
    await user.keyboard('new y');

    // The space extended the search rather than selecting, so the listbox
    // stays open and the multi-word label is the one highlighted.
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'New York' })).toHaveAttribute('data-highlighted');
  });

  it('selects the highlighted option when Space is pressed with no active search', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <Select onChange={onChange}>
        <SelectTrigger aria-label='Choose option' placeholder='Select...' />
        <SelectContent>
          <SelectItem value='option1' label='Option 1'>
            Option 1
          </SelectItem>
          <SelectItem value='option2' label='Option 2'>
            Option 2
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox'));
    // First option is highlighted on open; Space with an empty buffer selects it.
    await user.keyboard(' ');

    expect(onChange).toHaveBeenCalledWith('option1');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not fire onChange when re-selecting the already-selected value (single)', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <Select defaultValue='option1' onChange={onChange}>
        <SelectTrigger aria-label='Choose option' placeholder='Select...' />
        <SelectContent>
          <SelectItem value='option1' label='Option 1'>
            Option 1
          </SelectItem>
          <SelectItem value='option2' label='Option 2'>
            Option 2
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Option 1' }));

    // Unchanged selection: no onChange, but the listbox still closes.
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('keeps data-placeholder in sync when a selected value has no resolvable label', () => {
    render(
      <Select defaultValue='x'>
        <SelectTrigger aria-label='Choose option' placeholder='Pick…' />
        <SelectContent>
          <SelectItem value='x' />
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox');
    // A value is set but its item has no label, so the placeholder is what
    // renders — data-placeholder must reflect that rather than the raw selection.
    expect(trigger).toHaveAttribute('data-placeholder');
    expect(trigger).toHaveTextContent('Pick…');
  });

  it('throws when trigger is rendered outside Select root', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<SelectTrigger placeholder='Select...' />);
    }).toThrow('Select components must be used within a Select');

    consoleErrorSpy.mockRestore();
  });
});
