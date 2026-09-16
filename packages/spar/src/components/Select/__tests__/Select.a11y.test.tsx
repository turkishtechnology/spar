import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '../index';

expect.extend(toHaveNoViolations);

const BasicSelect = ({ id }: { id?: string }) => (
  <Select id={id}>
    <SelectTrigger aria-label='Choose option' placeholder='Select...' />
    <SelectContent>
      <SelectItem value='option1' label='Option 1'>
        Option 1
      </SelectItem>
      <SelectItem value='option2' disabled label='Option 2'>
        Option 2
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

  it('keeps trigger/listbox ARIA relationships in sync', async () => {
    const user = userEvent.setup();

    render(<BasicSelect id='a11y-select' />);

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-controls', 'a11y-select-content');

    await user.click(trigger);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('id', 'a11y-select-content');
    expect(listbox).toHaveAttribute('aria-labelledby', 'a11y-select-trigger');
  });

  it('provides correct option semantics for selected and disabled items', async () => {
    const user = userEvent.setup();

    render(
      <Select value='option1'>
        <SelectTrigger aria-label='Choose option' placeholder='Select...' />
        <SelectContent>
          <SelectItem value='option1' label='Option 1'>
            Option 1
          </SelectItem>
          <SelectItem value='option2' disabled label='Option 2'>
            Option 2
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

  it('applies group label semantics and keeps the separator presentational', async () => {
    const user = userEvent.setup();

    render(
      <Select>
        <SelectTrigger aria-label='Choose grouped option' placeholder='Select...' />
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value='apple' label='Apple'>
              Apple
            </SelectItem>
          </SelectGroup>
          <SelectSeparator data-testid='separator' />
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox'));

    const group = screen.getByRole('group');
    const label = screen.getByText('Fruits');
    expect(group).toHaveAttribute('aria-labelledby', label.id);

    // A listbox may only own option/group children, so the divider stays out of
    // the accessibility tree by default instead of exposing role="separator".
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'presentation');
    expect(separator).toHaveAttribute('aria-hidden', 'true');
    expect(separator).not.toHaveAttribute('aria-orientation');
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('passes axe checks with a group, label and separator inside the open listbox', async () => {
    const user = userEvent.setup();

    render(
      <Select>
        <SelectTrigger aria-label='Choose grouped option' placeholder='Select...' />
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value='apple' label='Apple'>
              Apple
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem value='carrot' label='Carrot'>
              Carrot
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');

    // The listbox is portaled to document.body, so audit the whole document and
    // keep `aria-required-children` enabled: the separator used to violate it.
    // `region` is a page-level landmark rule that a bare test document cannot meet.
    const results = await axe(document.body, {
      rules: {
        region: { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
    expect(listbox).toBeInTheDocument();
  });

  it('lets consumers restore separator semantics through role', async () => {
    const user = userEvent.setup();

    render(
      <Select>
        <SelectTrigger aria-label='Choose option' placeholder='Select...' />
        <SelectContent>
          <SelectItem value='a' label='A'>
            A
          </SelectItem>
          <SelectSeparator role='separator' aria-orientation='horizontal' />
          <SelectItem value='b' label='B'>
            B
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox'));

    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
    expect(separator).not.toHaveAttribute('aria-hidden');

    // Sanity check that the rule the default protects against is live: the
    // opt-in separator role is exactly what `aria-required-children` rejects.
    const results = await axe(document.body, { rules: { region: { enabled: false } } });
    expect(results.violations.map((violation) => violation.id)).toContain('aria-required-children');
  });
});
