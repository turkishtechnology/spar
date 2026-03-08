import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Input, InputDescription, InputErrorMessage, InputField, InputLabel } from '../index';

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

  it('derives deterministic ids from provided root id', () => {
    render(
      <Input id='profile-email'>
        <InputLabel>Email</InputLabel>
        <InputField />
        <InputDescription>Use your work email</InputDescription>
      </Input>,
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
        <Input>
          <InputLabel>First Name</InputLabel>
          <InputField />
        </Input>
        <Input>
          <InputLabel>Last Name</InputLabel>
          <InputField />
        </Input>
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
      <Input as='section' data-testid='root'>
        <InputLabel>Username</InputLabel>
        <InputField />
      </Input>,
    );

    const root = screen.getByTestId('root');

    expect(root.tagName).toBe('SECTION');
    expect(root).not.toHaveAttribute('data-invalid');
    expect(root).not.toHaveAttribute('data-disabled');
    expect(root).not.toHaveAttribute('data-required');
    expect(root).not.toHaveAttribute('data-readonly');
  });

  it('applies root and field state attributes from context', () => {
    render(
      <Input isInvalid disabled required readOnly data-testid='root'>
        <InputLabel>Username</InputLabel>
        <InputField />
      </Input>,
    );

    const root = screen.getByTestId('root');
    const field = screen.getByRole('textbox', { name: 'Username' });

    expect(root).toHaveAttribute('data-invalid', '');
    expect(root).toHaveAttribute('data-disabled', '');
    expect(root).toHaveAttribute('data-required', '');
    expect(root).toHaveAttribute('data-readonly', '');

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
      <Input isInvalid={false}>
        <InputLabel>Username</InputLabel>
        <InputField />
        <InputDescription>At least 3 characters</InputDescription>
        <InputErrorMessage>Username is required</InputErrorMessage>
      </Input>,
    );

    const field = screen.getByRole('textbox', { name: 'Username' });
    const description = screen.getByText('At least 3 characters');

    expect(field).toHaveAttribute('aria-describedby', description.id);
    expect(screen.queryByText('Username is required')).not.toBeInTheDocument();

    rerender(
      <Input isInvalid>
        <InputLabel>Username</InputLabel>
        <InputField />
        <InputDescription>At least 3 characters</InputDescription>
        <InputErrorMessage>Username is required</InputErrorMessage>
      </Input>,
    );

    const error = screen.getByText('Username is required');
    expect(field).toHaveAttribute('aria-describedby', error.id);
    expect(error).toHaveAttribute('role', 'alert');
    expect(error).toHaveAttribute('aria-live', 'assertive');
  });

  it('toggles focused data attribute and calls focus handlers', async () => {
    const user = userEvent.setup();
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    render(
      <>
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField onFocus={onFocus} onBlur={onBlur} />
        </Input>
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

  it('throws when compound-only parts are used outside Input', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<InputLabel>Username</InputLabel>)).toThrow(
      'Input compound components must be used within Input',
    );
    expect(() => render(<InputDescription>Help text</InputDescription>)).toThrow(
      'Input compound components must be used within Input',
    );
    expect(() => render(<InputErrorMessage>Error</InputErrorMessage>)).toThrow(
      'Input compound components must be used within Input',
    );

    jest.restoreAllMocks();
  });
});
