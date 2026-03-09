import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type FormEvent, useState } from 'react';
import { Input, InputDescription, InputErrorMessage, InputField, InputLabel } from '../index';

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
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField name='username' />
        </Input>
        <Input>
          <InputLabel>Email</InputLabel>
          <InputField name='email' type='email' />
        </Input>
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
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField name='username' defaultValue='initial-user' />
        </Input>
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

  it('preserves id contract with custom root id in form context', () => {
    render(
      <form>
        <Input id='billing-email'>
          <InputLabel>Email</InputLabel>
          <InputField name='email' type='email' />
          <InputDescription>Invoice notifications will be sent here</InputDescription>
        </Input>
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
        <Input isInvalid={isInvalid}>
          <InputLabel>Username</InputLabel>
          <InputField value={value} onChange={(event) => setValue(event.target.value)} />
          <InputDescription>At least 3 characters</InputDescription>
          <InputErrorMessage>Username must be at least 3 characters</InputErrorMessage>
        </Input>
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
