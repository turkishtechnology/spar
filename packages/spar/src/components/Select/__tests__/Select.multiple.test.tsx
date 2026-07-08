import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../index';

const renderMultiple = (props?: React.ComponentProps<typeof Select>) => {
  return render(
    <Select multiple {...props}>
      <SelectTrigger aria-label='Choose options' placeholder='Select...' />
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

describe('Select multiple', () => {
  it('toggles values on click and keeps the listbox open', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderMultiple({ onChange });

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Option 1' }));

    expect(onChange).toHaveBeenLastCalledWith(['option1']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Option 2' }));
    expect(onChange).toHaveBeenLastCalledWith(['option1', 'option2']);

    // Second click on a selected option deselects it
    await user.click(screen.getByRole('option', { name: 'Option 1' }));
    expect(onChange).toHaveBeenLastCalledWith(['option2']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('does not move focus back to the trigger on selection', async () => {
    const user = userEvent.setup();

    renderMultiple();

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Option 1' }));

    expect(trigger).not.toHaveFocus();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('marks the listbox multiselectable and preselected options selected', async () => {
    const user = userEvent.setup();

    renderMultiple({ defaultValue: ['option1', 'option2'] });

    await user.click(screen.getByRole('combobox'));

    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('option', { name: 'Option 2' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('option', { name: 'Option 2' })).toHaveAttribute(
      'data-state',
      'checked',
    );
  });

  it('joins selected labels in the trigger and keeps data-placeholder for []', () => {
    const { rerender } = render(
      <Select multiple defaultValue={['option1', 'option2']}>
        <SelectTrigger aria-label='Choose options' placeholder='Select...' />
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

    expect(screen.getByRole('combobox')).toHaveTextContent('Option 1, Option 2');
    expect(screen.getByRole('combobox')).not.toHaveAttribute('data-placeholder');

    rerender(
      <Select multiple value={[]} onChange={() => {}}>
        <SelectTrigger aria-label='Choose options' placeholder='Select...' />
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

    expect(screen.getByRole('combobox')).toHaveTextContent('Select...');
    expect(screen.getByRole('combobox')).toHaveAttribute('data-placeholder');
  });

  it('toggles the highlighted option with Enter while staying open', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderMultiple({ onChange });

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['option1']);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Highlight survives the toggle; a second Enter deselects the same option
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('reopens highlighting the first selected option', async () => {
    const user = userEvent.setup();

    renderMultiple({ defaultValue: ['option2'] });

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.click(trigger);
    const listbox = screen.getByRole('listbox');
    const option2 = screen.getByRole('option', { name: 'Option 2' });
    expect(listbox).toHaveAttribute('aria-activedescendant', expect.stringContaining('option2'));
    expect(option2).toHaveAttribute('data-highlighted');
  });

  it('emits one hidden input per selected value, and none when empty', () => {
    const { container, rerender } = render(
      <Select multiple name='cities' defaultValue={['option1', 'option2']}>
        <SelectTrigger aria-label='Choose options' />
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

    const inputs = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[type="hidden"][name="cities"]'),
    );
    expect(inputs.map((input) => input.value)).toEqual(['option1', 'option2']);

    rerender(
      <Select multiple name='cities' required value={[]} onChange={() => {}}>
        <SelectTrigger aria-label='Choose options' />
        <SelectContent>
          <SelectItem value='option1' label='Option 1'>
            Option 1
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    const emptyInputs = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[type="hidden"][name="cities"]'),
    );
    expect(emptyInputs).toHaveLength(0);
  });

  it('closes on select when closeOnSelect is explicitly true', async () => {
    const user = userEvent.setup();

    renderMultiple({ closeOnSelect: true });

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Option 1' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('exposes values and labels through trigger render props', () => {
    render(
      <Select multiple defaultValue={['option1', 'option2']}>
        <SelectTrigger aria-label='Choose options'>
          {({ values, labels }) => <span>{`${values.length}:${labels.join('|')}`}</span>}
        </SelectTrigger>
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

    expect(screen.getByRole('combobox')).toHaveTextContent('2:Option 1|Option 2');
  });

  it('coerces a scalar value in multiple mode and an array in single mode', () => {
    render(
      <Select multiple value='option1' onChange={() => {}}>
        <SelectTrigger aria-label='Coerced' />
        <SelectContent>
          <SelectItem value='option1' label='Option 1'>
            Option 1
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Option 1');
  });

  it('keeps focus on the listbox after toggling (closeOnSelect stays false)', async () => {
    const user = userEvent.setup();

    renderMultiple();

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveFocus();

    // Toggling in multiple mode must not close or steal focus back to the trigger.
    await user.keyboard('{Enter}');
    expect(listbox).toHaveFocus();
    expect(trigger).not.toHaveFocus();
  });

  it('does not change value or close when read-only', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderMultiple({ readOnly: true, onChange });

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Option 1' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
});
