import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Input, InputField } from '../index';
import { Field, FieldDescription, FieldErrorMessage, FieldLabel } from '../../Field';

describe('Input - Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders InputField standalone with default input behavior', () => {
    render(<InputField placeholder='Enter text' />);

    const field = screen.getByRole('textbox');
    expect(field).toHaveAttribute('type', 'text');
    expect(field).toHaveAttribute('placeholder', 'Enter text');
    expect(field).not.toHaveAttribute('id');
    expect(field).not.toHaveAttribute('aria-labelledby');
    expect(field).not.toHaveAttribute('aria-describedby');
  });

  it('supports standalone textarea via as prop', () => {
    render(<InputField as='textarea' aria-label='Message' />);

    const field = screen.getByRole('textbox', { name: 'Message' });
    expect(field.tagName).toBe('TEXTAREA');
    expect(field).not.toHaveAttribute('type');
  });

  it('derives deterministic ids from provided Field id', () => {
    render(
      <Field id='profile-email'>
        <FieldLabel>Email</FieldLabel>
        <Input>
          <InputField />
        </Input>
        <FieldDescription>Use your work email</FieldDescription>
      </Field>,
    );

    const field = screen.getByRole('textbox', { name: 'Email' });
    const description = screen.getByText('Use your work email');

    expect(field).toHaveAttribute('id', 'profile-email-field');
    expect(field).toHaveAttribute('aria-labelledby', 'profile-email-label');
    expect(field).toHaveAttribute('aria-describedby', 'profile-email-description');
    expect(description).toHaveAttribute('id', 'profile-email-description');
  });

  it('keeps generated ids unique across instances', () => {
    render(
      <>
        <Field>
          <FieldLabel>First Name</FieldLabel>
          <Input>
            <InputField />
          </Input>
        </Field>
        <Field>
          <FieldLabel>Last Name</FieldLabel>
          <Input>
            <InputField />
          </Input>
        </Field>
      </>,
    );

    const first = screen.getByRole('textbox', { name: 'First Name' });
    const last = screen.getByRole('textbox', { name: 'Last Name' });

    expect(first.id).toBeTruthy();
    expect(last.id).toBeTruthy();
    expect(first.id).not.toBe(last.id);
  });

  it('renders root as custom element and keeps state data attributes absent by default', () => {
    render(
      <Field>
        <FieldLabel>Username</FieldLabel>
        <Input as='section' data-testid='root'>
          <InputField />
        </Input>
      </Field>,
    );

    const root = screen.getByTestId('root');

    expect(root.tagName).toBe('SECTION');
    expect(root).not.toHaveAttribute('data-invalid');
    expect(root).not.toHaveAttribute('data-disabled');
    expect(root).not.toHaveAttribute('data-required');
    expect(root).not.toHaveAttribute('data-readonly');
  });

  it('applies root and field state attributes from Field context', () => {
    render(
      <Field invalid disabled required readOnly data-testid='field-root'>
        <FieldLabel>Username</FieldLabel>
        <Input data-testid='input-root'>
          <InputField />
        </Input>
      </Field>,
    );

    const fieldRoot = screen.getByTestId('field-root');
    const inputRoot = screen.getByTestId('input-root');
    const field = screen.getByRole('textbox', { name: 'Username' });

    expect(fieldRoot).toHaveAttribute('data-invalid', '');
    expect(fieldRoot).toHaveAttribute('data-disabled', '');
    expect(fieldRoot).toHaveAttribute('data-required', '');
    expect(fieldRoot).toHaveAttribute('data-readonly', '');

    // Input root inherits from Field context
    expect(inputRoot).toHaveAttribute('data-invalid', '');
    expect(inputRoot).toHaveAttribute('data-disabled', '');
    expect(inputRoot).toHaveAttribute('data-required', '');
    expect(inputRoot).toHaveAttribute('data-readonly', '');

    expect(field).toBeDisabled();
    expect(field).toBeRequired();
    expect(field).toHaveAttribute('readOnly');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAttribute('aria-required', 'true');
    expect(field).toHaveAttribute('data-disabled', '');
    expect(field).toHaveAttribute('data-required', '');
    expect(field).toHaveAttribute('data-readonly', '');
  });

  it('uses description when valid and switches to error id when invalid', () => {
    const { rerender } = render(
      <Field invalid={false}>
        <FieldLabel>Username</FieldLabel>
        <Input>
          <InputField />
        </Input>
        <FieldDescription>At least 3 characters</FieldDescription>
        <FieldErrorMessage>Username is required</FieldErrorMessage>
      </Field>,
    );

    const field = screen.getByRole('textbox', { name: 'Username' });
    const description = screen.getByText('At least 3 characters');

    expect(field).toHaveAttribute('aria-describedby', description.id);
    expect(screen.queryByText('Username is required')).not.toBeInTheDocument();

    rerender(
      <Field invalid>
        <FieldLabel>Username</FieldLabel>
        <Input>
          <InputField />
        </Input>
        <FieldDescription>At least 3 characters</FieldDescription>
        <FieldErrorMessage>Username is required</FieldErrorMessage>
      </Field>,
    );

    const error = screen.getByText('Username is required');
    expect(field).toHaveAttribute('aria-describedby', error.id);
    expect(error).toHaveAttribute('role', 'alert');
  });

  it('toggles focused data attribute and calls focus handlers', async () => {
    const user = userEvent.setup();
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    render(
      <>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input>
            <InputField onFocus={onFocus} onBlur={onBlur} />
          </Input>
        </Field>
        <button type='button'>Next</button>
      </>,
    );

    const field = screen.getByRole('textbox', { name: 'Username' });

    await user.click(field);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(field).toHaveAttribute('data-focused', '');

    await user.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(field).not.toHaveAttribute('data-focused');
  });

  it('supports uncontrolled and controlled value flows', async () => {
    const user = userEvent.setup();

    render(<InputField aria-label='Uncontrolled' defaultValue='start' />);
    const uncontrolled = screen.getByRole('textbox', { name: 'Uncontrolled' });

    await user.type(uncontrolled, ' value');
    expect(uncontrolled).toHaveValue('start value');

    const ControlledExample = () => {
      const [value, setValue] = useState('');
      return (
        <InputField
          aria-label='Controlled'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    };

    render(<ControlledExample />);
    const controlled = screen.getByRole('textbox', { name: 'Controlled' });

    await user.type(controlled, 'hello');
    expect(controlled).toHaveValue('hello');
  });

  it('keeps disabled / required / readOnly passed on the field itself', () => {
    // The Input context resolves all three to a plain boolean, so an unset group
    // reports `false`. Spreading that over the instance props used to unset
    // them: a field asked to be disabled rendered enabled.
    render(
      <Input>
        <InputField aria-label='plain' disabled required readOnly />
      </Input>,
    );

    const field = screen.getByLabelText('plain');
    expect(field).toBeDisabled();
    expect(field).toBeRequired();
    expect(field).toHaveAttribute('readonly');
  });

  it('lets a surrounding Field still set the field state', () => {
    render(
      <Field disabled>
        <Input>
          <InputField aria-label='in-field' />
        </Input>
      </Field>,
    );

    expect(screen.getByLabelText('in-field')).toBeDisabled();
  });

  it('throws when Field compound-only parts are used outside Field', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<FieldLabel>Username</FieldLabel>)).toThrow(
      'Field compound components must be used within Field',
    );
    expect(() => render(<FieldDescription>Help text</FieldDescription>)).toThrow(
      'Field compound components must be used within Field',
    );
    expect(() => render(<FieldErrorMessage>Error</FieldErrorMessage>)).toThrow(
      'Field compound components must be used within Field',
    );

    jest.restoreAllMocks();
  });
});
