import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '../index';

expect.extend(toHaveNoViolations);

const BasicSelect = ({ id }: { id?: string }) => (
  <Select id={id}>
    <SelectTrigger aria-label='Choose option'>
      <SelectValue placeholder='Select...' />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value='option1'>
        <SelectItemText>Option 1</SelectItemText>
      </SelectItem>
      <SelectItem value='option2' disabled>
        <SelectItemText>Option 2</SelectItemText>
      </SelectItem>
    </SelectContent>
  </Select>
);

describe('Select Accessibility', () => {
  it('passes axe checks when closed', async () => {
    const { container } = render(<BasicSelect />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe checks when open', async () => {
    const user = userEvent.setup();

    const { container } = render(<BasicSelect />);
    await user.click(screen.getByRole('combobox'));

    const results = await axe(container, {
      rules: {
        'aria-required-children': { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('keeps trigger/value/listbox ARIA relationships in sync', async () => {
    const user = userEvent.setup();

    render(<BasicSelect id='a11y-select' />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-controls', 'a11y-select-content');
    expect(trigger).toHaveAttribute('aria-labelledby', 'a11y-select-value');

    await user.click(trigger);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('id', 'a11y-select-content');
    expect(listbox).toHaveAttribute('aria-labelledby', 'a11y-select-trigger');
  });

  it('provides correct option semantics for selected and disabled items', async () => {
    const user = userEvent.setup();

    render(
      <Select value='option1'>
        <SelectTrigger aria-label='Choose option'>
          <SelectValue placeholder='Select...' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
          <SelectItem value='option2' disabled>
            <SelectItemText>Option 2</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox'));

    expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('option', { name: 'Option 2' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('focuses listbox on open and returns focus to trigger after selection', async () => {
    const user = userEvent.setup();

    render(<BasicSelect />);

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveFocus();

    await user.click(screen.getByRole('option', { name: 'Option 1' }));
    expect(trigger).toHaveFocus();
  });

  it('applies group label and separator semantics', async () => {
    const user = userEvent.setup();

    render(
      <Select>
        <SelectTrigger aria-label='Choose grouped option'>
          <SelectValue placeholder='Select...' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value='apple'>
              <SelectItemText>Apple</SelectItemText>
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox'));

    const group = screen.getByRole('group');
    const label = screen.getByText('Fruits');
    expect(group).toHaveAttribute('aria-labelledby', label.id);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });
});
