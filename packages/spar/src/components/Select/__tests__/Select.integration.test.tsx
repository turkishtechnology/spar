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

describe('Select Integration', () => {
  it('submits selected value through hidden form input', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      return Object.fromEntries(formData.entries());
    });

    render(
      <form onSubmit={handleSubmit}>
        <Select name='plan'>
          <SelectTrigger aria-label='Choose plan'>
            <SelectValue placeholder='Select...' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='basic'>
              <SelectItemText>Basic</SelectItemText>
            </SelectItem>
            <SelectItem value='premium'>
              <SelectItemText>Premium</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>
        <button type='submit'>Submit</button>
      </form>,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Premium' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    const submission = handleSubmit.mock.results[0]?.value as Record<string, FormDataEntryValue>;
    expect(submission.plan).toBe('premium');
  });

  it('keeps controlled state synced with external store', async () => {
    const user = userEvent.setup();

    const ControlledForm = () => {
      const [value, setValue] = React.useState('basic');

      return (
        <div>
          <Select value={value} onValueChange={setValue} name='plan'>
            <SelectTrigger aria-label='Choose plan'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='basic'>
                <SelectItemText>Basic</SelectItemText>
              </SelectItem>
              <SelectItem value='premium'>
                <SelectItemText>Premium</SelectItemText>
              </SelectItem>
            </SelectContent>
          </Select>
          <output aria-label='Current plan'>{value}</output>
        </div>
      );
    };

    render(<ControlledForm />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Premium' }));

    expect(screen.getByLabelText('Current plan')).toHaveTextContent('premium');
    expect(screen.getByRole('combobox')).toHaveTextContent('Premium');
  });

  it('supports independent behavior for multiple select instances', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Select name='size'>
          <SelectTrigger aria-label='Choose size'>
            <SelectValue placeholder='Select size' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='small'>
              <SelectItemText>Small</SelectItemText>
            </SelectItem>
            <SelectItem value='large'>
              <SelectItemText>Large</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select name='color'>
          <SelectTrigger aria-label='Choose color'>
            <SelectValue placeholder='Select color' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='red'>
              <SelectItemText>Red</SelectItemText>
            </SelectItem>
            <SelectItem value='blue'>
              <SelectItemText>Blue</SelectItemText>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>,
    );

    const [sizeTrigger, colorTrigger] = screen.getAllByRole('combobox');
    if (!sizeTrigger || !colorTrigger) {
      throw new Error('Select triggers not found');
    }

    await user.click(sizeTrigger);
    await user.click(screen.getByRole('option', { name: 'Large' }));

    await user.click(colorTrigger);
    await user.click(screen.getByRole('option', { name: 'Red' }));

    expect(sizeTrigger).toHaveTextContent('Large');
    expect(colorTrigger).toHaveTextContent('Red');
  });

  it('renders content into custom portal container', async () => {
    const user = userEvent.setup();

    const portalTarget = document.createElement('div');
    portalTarget.id = 'portal-target';
    document.body.appendChild(portalTarget);

    render(
      <Select>
        <SelectTrigger aria-label='Choose option'>
          <SelectValue placeholder='Select...' />
        </SelectTrigger>
        <SelectContent container={portalTarget}>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole('combobox'));

    const listbox = screen.getByRole('listbox');
    expect(portalTarget).toContainElement(listbox);

    portalTarget.remove();
  });
});
