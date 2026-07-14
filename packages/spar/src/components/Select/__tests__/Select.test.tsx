import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, SelectTrigger, SelectContent, SelectViewport, SelectItem } from '../index';

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

  it('throws when trigger is rendered outside Select root', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<SelectTrigger placeholder='Select...' />);
    }).toThrow('Select components must be used within a Select');

    consoleErrorSpy.mockRestore();
  });

  describe('Select.Viewport', () => {
    it('wraps options as a presentation container and preserves the listbox structure', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger aria-label='Choose option' placeholder='Select...' />
          <SelectContent>
            <SelectViewport data-testid='viewport'>
              <SelectItem value='option1' label='Option 1'>
                Option 1
              </SelectItem>
              <SelectItem value='option2' label='Option 2'>
                Option 2
              </SelectItem>
            </SelectViewport>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));

      const viewport = screen.getByTestId('viewport');
      expect(viewport).toHaveAttribute('role', 'presentation');
      // Listbox structure stays intact — options nested in the viewport remain options.
      expect(screen.getAllByRole('option')).toHaveLength(2);
      expect(viewport).toContainElement(screen.getByRole('option', { name: 'Option 1' }));
    });

    it('supports polymorphic rendering and role override', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger aria-label='Choose option' placeholder='Select...' />
          <SelectContent>
            <SelectViewport as='ul' role='group' data-testid='viewport'>
              <SelectItem as='li' value='option1' label='Option 1'>
                Option 1
              </SelectItem>
            </SelectViewport>
          </SelectContent>
        </Select>,
      );

      await user.click(screen.getByRole('combobox'));

      const viewport = screen.getByTestId('viewport');
      expect(viewport.tagName).toBe('UL');
      expect(viewport).toHaveAttribute('role', 'group');
    });

    it('throws when rendered outside SelectContent', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<SelectViewport>Viewport</SelectViewport>);
      }).toThrow('Select items must be rendered within SelectContent');

      consoleErrorSpy.mockRestore();
    });

    it('scrolls the highlighted option into view during keyboard navigation', async () => {
      const scrollSpy = jest
        .spyOn(HTMLElement.prototype, 'scrollIntoView')
        .mockImplementation(() => {});
      const user = userEvent.setup();

      render(
        <Select>
          <SelectTrigger aria-label='Choose option' placeholder='Select...' />
          <SelectContent>
            <SelectViewport>
              <SelectItem value='option1' label='Option 1'>
                Option 1
              </SelectItem>
              <SelectItem value='option2' label='Option 2'>
                Option 2
              </SelectItem>
            </SelectViewport>
          </SelectContent>
        </Select>,
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute('data-highlighted');
      expect(scrollSpy).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });

      scrollSpy.mockRestore();
    });

    it('keeps the highlighted option in view even when options are not wrapped in a Viewport', async () => {
      // Regression guard: scroll-into-view lives in SelectItem, not the optional
      // Viewport, so an unwrapped long list stays keyboard-accessible.
      const scrollSpy = jest
        .spyOn(HTMLElement.prototype, 'scrollIntoView')
        .mockImplementation(() => {});
      const user = userEvent.setup();

      renderSelect();

      const trigger = screen.getByRole('combobox');
      trigger.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('option', { name: 'Option 1' })).toHaveAttribute('data-highlighted');
      expect(scrollSpy).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });

      scrollSpy.mockRestore();
    });
  });
});
