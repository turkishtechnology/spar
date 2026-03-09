import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input, InputDescription, InputErrorMessage, InputField, InputLabel } from '../index';

expect.extend(toHaveNoViolations);

describe('Input - Accessibility Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('passes axe for labeled input', async () => {
    const { container } = render(
      <Input>
        <InputLabel>Username</InputLabel>
        <InputField />
      </Input>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes axe for invalid input with error message', async () => {
    const { container } = render(
      <Input isInvalid required>
        <InputLabel>Email</InputLabel>
        <InputField type='email' />
        <InputErrorMessage>Email is required</InputErrorMessage>
      </Input>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('associates accessible name and description through ARIA relationships', () => {
    render(
      <Input>
        <InputLabel>Password</InputLabel>
        <InputField type='password' />
        <InputDescription>Use at least 8 characters</InputDescription>
      </Input>,
    );

    const field = screen.getByLabelText('Password');
    const description = screen.getByText('Use at least 8 characters');

    expect(field).toHaveAttribute('aria-describedby', description.id);
    expect(field).toHaveAttribute('aria-invalid', 'false');
  });

  it('switches aria-describedby target to error and exposes alert semantics', () => {
    render(
      <Input isInvalid>
        <InputLabel>Password</InputLabel>
        <InputField type='password' />
        <InputDescription>Use at least 8 characters</InputDescription>
        <InputErrorMessage>Password is too short</InputErrorMessage>
      </Input>,
    );

    const field = screen.getByLabelText('Password');
    const error = screen.getByText('Password is too short');

    expect(field).toHaveAttribute('aria-describedby', error.id);
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(error).toHaveAttribute('role', 'alert');
    expect(error).toHaveAttribute('aria-live', 'assertive');
  });

  it('supports keyboard focus and blur state', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>
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
        <Input disabled>
          <InputLabel>Disabled Username</InputLabel>
          <InputField />
        </Input>
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
      <Input>
        <InputLabel>Username</InputLabel>
        <InputField autoFocus />
      </Input>,
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
