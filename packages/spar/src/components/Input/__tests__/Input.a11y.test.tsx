import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input, InputField } from '../index';
import { Field, FieldDescription, FieldErrorMessage, FieldLabel } from '../../Field';

expect.extend(toHaveNoViolations);

describe('Input - Accessibility Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('passes axe for labeled input', async () => {
    const { container } = render(
      <Field>
        <FieldLabel>Username</FieldLabel>
        <Input>
          <InputField />
        </Input>
      </Field>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes axe for invalid input with error message', async () => {
    const { container } = render(
      <Field invalid required>
        <FieldLabel>Email</FieldLabel>
        <Input>
          <InputField type='email' />
        </Input>
        <FieldErrorMessage>Email is required</FieldErrorMessage>
      </Field>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('associates accessible name and description through ARIA relationships', () => {
    render(
      <Field>
        <FieldLabel>Password</FieldLabel>
        <Input>
          <InputField type='password' />
        </Input>
        <FieldDescription>Use at least 8 characters</FieldDescription>
      </Field>,
    );

    const field = screen.getByLabelText('Password');
    const description = screen.getByText('Use at least 8 characters');

    expect(field).toHaveAttribute('aria-describedby', description.id);
    expect(field).toHaveAttribute('aria-invalid', 'false');
  });

  it('switches aria-describedby target to error and exposes alert semantics', () => {
    render(
      <Field invalid>
        <FieldLabel>Password</FieldLabel>
        <Input>
          <InputField type='password' />
        </Input>
        <FieldDescription>Use at least 8 characters</FieldDescription>
        <FieldErrorMessage>Password is too short</FieldErrorMessage>
      </Field>,
    );

    const field = screen.getByLabelText('Password');
    const error = screen.getByText('Password is too short');

    expect(field).toHaveAttribute('aria-describedby', error.id);
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(error).toHaveAttribute('role', 'alert');
  });

  it('supports keyboard focus and blur state', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input>
            <InputField />
          </Input>
        </Field>
        <button type='button'>Next</button>
      </>,
    );

    const field = screen.getByRole('textbox', { name: 'Username' });

    await user.tab();
    expect(field).toHaveFocus();
    expect(field).toHaveAttribute('data-focused', '');

    await user.tab();
    expect(field).not.toHaveFocus();
    expect(field).not.toHaveAttribute('data-focused');
  });

  it('skips disabled field in tab order', async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type='button'>Before</button>
        <Field disabled>
          <FieldLabel>Disabled Username</FieldLabel>
          <Input>
            <InputField />
          </Input>
        </Field>
        <button type='button'>After</button>
      </>,
    );

    const before = screen.getByRole('button', { name: 'Before' });
    const after = screen.getByRole('button', { name: 'After' });

    before.focus();
    await user.tab();

    expect(after).toHaveFocus();
  });

  it('applies autoFocus behavior for compound and standalone fields', async () => {
    const { rerender } = render(
      <Field>
        <FieldLabel>Username</FieldLabel>
        <Input>
          <InputField autoFocus />
        </Input>
      </Field>,
    );

    const compoundField = screen.getByRole('textbox', { name: 'Username' });
    await waitFor(() => {
      expect(compoundField).toHaveFocus();
    });
    expect(compoundField).toHaveAttribute('data-autofocus', '');

    rerender(<InputField autoFocus aria-label='Standalone' />);

    const standaloneField = screen.getByRole('textbox', { name: 'Standalone' });
    await waitFor(() => {
      expect(standaloneField).toHaveFocus();
    });
    expect(standaloneField).toHaveAttribute('data-autofocus', '');
  });
});
