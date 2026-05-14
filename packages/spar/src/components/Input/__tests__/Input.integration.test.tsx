import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type FormEvent, useState } from 'react';
import { Input, InputField } from '../index';
import { Field, FieldDescription, FieldErrorMessage, FieldLabel } from '../../Field';

describe('Input - Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('submits expected FormData values for multiple fields', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn((event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      expect(formData.get('username')).toBe('demir');
      expect(formData.get('email')).toBe('demir@example.com');
    });

    render(
      <form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input>
            <InputField name='username' />
          </Input>
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input>
            <InputField name='email' type='email' />
          </Input>
        </Field>
        <button type='submit'>Submit</button>
      </form>,
    );

    await user.type(screen.getByRole('textbox', { name: 'Username' }), 'demir');
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'demir@example.com');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('supports form reset for uncontrolled values', async () => {
    const user = userEvent.setup();

    render(
      <form>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input>
            <InputField name='username' defaultValue='initial-user' />
          </Input>
        </Field>
        <button type='reset'>Reset</button>
      </form>,
    );

    const field = screen.getByRole('textbox', { name: 'Username' });

    await user.clear(field);
    await user.type(field, 'changed-user');
    expect(field).toHaveValue('changed-user');

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(field).toHaveValue('initial-user');
  });

  it('preserves id contract with custom Field id in form context', () => {
    render(
      <form>
        <Field id='billing-email'>
          <FieldLabel>Email</FieldLabel>
          <Input>
            <InputField name='email' type='email' />
          </Input>
          <FieldDescription>Invoice notifications will be sent here</FieldDescription>
        </Field>
      </form>,
    );

    const field = screen.getByRole('textbox', { name: 'Email' });
    const description = screen.getByText('Invoice notifications will be sent here');

    expect(field).toHaveAttribute('id', 'billing-email-field');
    expect(field).toHaveAttribute('aria-labelledby', 'billing-email-label');
    expect(field).toHaveAttribute('aria-describedby', 'billing-email-description');
    expect(description).toHaveAttribute('id', 'billing-email-description');
  });

  it('supports controlled validation workflow with dynamic error messaging', async () => {
    const user = userEvent.setup();

    const ControlledValidationExample = () => {
      const [value, setValue] = useState('');
      const isInvalid = value.length > 0 && value.length < 3;

      return (
        <Field invalid={isInvalid}>
          <FieldLabel>Username</FieldLabel>
          <Input>
            <InputField value={value} onChange={(event) => setValue(event.target.value)} />
          </Input>
          <FieldDescription>At least 3 characters</FieldDescription>
          <FieldErrorMessage>Username must be at least 3 characters</FieldErrorMessage>
        </Field>
      );
    };

    render(<ControlledValidationExample />);

    const field = screen.getByRole('textbox', { name: 'Username' });

    await user.type(field, 'ab');
    const error = screen.getByText('Username must be at least 3 characters');

    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAttribute('aria-describedby', error.id);

    await user.type(field, 'c');

    expect(field).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByText('Username must be at least 3 characters')).not.toBeInTheDocument();
  });

  it('supports keyboard typing interaction end-to-end in controlled mode', async () => {
    const user = userEvent.setup();

    const ControlledInput = () => {
      const [value, setValue] = useState('');
      return (
        <InputField
          aria-label='Controlled keyboard field'
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    };

    render(<ControlledInput />);

    const field = screen.getByRole('textbox', { name: 'Controlled keyboard field' });

    await user.click(field);
    await user.keyboard('hello world');

    expect(field).toHaveValue('hello world');
  });
});
