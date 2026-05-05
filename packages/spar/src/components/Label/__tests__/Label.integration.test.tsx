import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Label } from '../Label';

describe('Label Integration', () => {
  it('works with uncontrolled input fields', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Label htmlFor='uncontrolled-email'>Email</Label>
        <input id='uncontrolled-email' type='email' />
      </div>,
    );

    const input = screen.getByLabelText('Email');
    await user.click(screen.getByText('Email'));
    expect(input).toHaveFocus();

    await user.type(input, 'user@example.com');

    expect(input).toHaveValue('user@example.com');
  });

  it('works with controlled input fields', async () => {
    const user = userEvent.setup();

    const ControlledField = () => {
      const [value, setValue] = React.useState('');

      return (
        <div>
          <Label htmlFor='controlled-name'>Name</Label>
          <input
            id='controlled-name'
            type='text'
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
      );
    };

    render(<ControlledField />);

    const input = screen.getByLabelText('Name');
    await user.click(screen.getByText('Name'));
    expect(input).toHaveFocus();

    await user.type(input, 'Jane');

    expect(input).toHaveValue('Jane');
  });

  it('supports independent associations for multiple fields', () => {
    render(
      <form>
        <Label htmlFor='first-field'>First Field</Label>
        <input id='first-field' type='text' />

        <Label htmlFor='second-field'>Second Field</Label>
        <input id='second-field' type='text' />
      </form>,
    );

    expect(screen.getByLabelText('First Field')).toHaveAttribute('id', 'first-field');
    expect(screen.getByLabelText('Second Field')).toHaveAttribute('id', 'second-field');
  });

  it('toggles associated checkbox when label is clicked', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Label htmlFor='newsletter'>Subscribe</Label>
        <input id='newsletter' type='checkbox' />
      </div>,
    );

    const checkbox = screen.getByLabelText('Subscribe');

    expect(checkbox).not.toBeChecked();
    await user.click(screen.getByText('Subscribe'));
    expect(checkbox).toBeChecked();
  });

  it('supports fieldset legends via polymorphic as prop', () => {
    render(
      <fieldset>
        <Label as='legend'>Contact Information</Label>
        <Label htmlFor='phone'>Phone</Label>
        <input id='phone' type='tel' />
      </fieldset>,
    );

    expect(screen.getByText('Contact Information').tagName).toBe('LEGEND');
    expect(screen.getByLabelText('Phone')).toHaveAttribute('id', 'phone');
  });

  it('delegates click when rendered as non-label element with htmlFor', async () => {
    const user = userEvent.setup();

    const CustomCheckbox = () => {
      const [checked, setChecked] = React.useState(false);

      return (
        <div>
          <Label as='div' htmlFor='custom-checkbox'>
            Custom Subscribe
          </Label>
          <div
            id='custom-checkbox'
            role='checkbox'
            tabIndex={0}
            aria-checked={checked}
            onClick={() => setChecked((prev) => !prev)}
          >
            Toggle
          </div>
        </div>
      );
    };

    render(<CustomCheckbox />);

    const control = screen.getByRole('checkbox');

    expect(control).toHaveAttribute('aria-checked', 'false');
    await user.click(screen.getByText('Custom Subscribe'));
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(control).toHaveFocus();
  });

  it('stops internal delegation when user onClick prevents default', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn((event: React.MouseEvent<Element>) => event.preventDefault());

    render(
      <div>
        <Label htmlFor='prevented-checkbox' onClick={handleClick}>
          Prevented
        </Label>
        <input id='prevented-checkbox' type='checkbox' />
      </div>,
    );

    const checkbox = screen.getByLabelText('Prevented');

    expect(checkbox).not.toBeChecked();
    await user.click(screen.getByText('Prevented'));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(checkbox).not.toBeChecked();
  });

  it('is a no-op when htmlFor target does not exist', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <div>
        <Label htmlFor='missing-target' onClick={handleClick}>
          Missing Target
        </Label>
        <input id='different-target' type='text' />
      </div>,
    );

    const otherInput = screen.getByRole('textbox');

    await user.click(screen.getByText('Missing Target'));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(otherInput).not.toHaveFocus();
  });
});
