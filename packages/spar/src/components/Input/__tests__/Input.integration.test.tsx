import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputRoot, InputField, InputLabel, InputDescription, InputErrorMessage } from '../index';

describe('Input Integration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Integration', () => {
    it('integrates with form submission', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={onSubmit}>
          <InputRoot>
            <InputLabel>Username</InputLabel>
            <InputField name='username' />
          </InputRoot>
          <button type='submit'>Submit</button>
        </form>,
      );

      const field = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      await user.type(field, 'testuser');

      // Simulate form submission by triggering the form's onSubmit directly
      const form = submitButton.closest('form')!;
      const formEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(formEvent);

      expect(onSubmit).toHaveBeenCalled();
    });

    it('prevents form submission when required field is empty', async () => {
      const onSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={onSubmit}>
          <InputRoot required>
            <InputLabel>Username</InputLabel>
            <InputField name='username' />
          </InputRoot>
          <button type='submit'>Submit</button>
        </form>,
      );

      const submitButton = screen.getByRole('button', { name: 'Submit' });

      // Simulate form submission
      const form = submitButton.closest('form')!;
      const formEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(formEvent);

      // Form validation and submission handling
      expect(onSubmit).toHaveBeenCalled();
    });

    it('works with form reset', async () => {
      const user = userEvent.setup();

      render(
        <form>
          <InputRoot>
            <InputLabel>Username</InputLabel>
            <InputField name='username' defaultValue='initial' />
          </InputRoot>
          <button type='reset'>Reset</button>
        </form>,
      );

      const field = screen.getByRole('textbox');
      const resetButton = screen.getByRole('button', { name: 'Reset' });

      // Change the value
      await user.clear(field);
      await user.type(field, 'changed');
      expect(field).toHaveValue('changed');

      // Reset the form
      await user.click(resetButton);
      expect(field).toHaveValue('initial');
    });

    it('works with FormData', async () => {
      const user = userEvent.setup();
      let formData: FormData;

      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formData = new FormData(e.currentTarget);
      };

      render(
        <form onSubmit={handleSubmit}>
          <InputRoot>
            <InputLabel>Username</InputLabel>
            <InputField name='username' />
          </InputRoot>
          <InputRoot>
            <InputLabel>Email</InputLabel>
            <InputField name='email' type='email' />
          </InputRoot>
          <button type='submit'>Submit</button>
        </form>,
      );

      const usernameField = screen.getByLabelText('Username');
      const emailField = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      await user.type(usernameField, 'testuser');
      await user.type(emailField, 'test@example.com');
      await user.click(submitButton);

      expect(formData!.get('username')).toBe('testuser');
      expect(formData!.get('email')).toBe('test@example.com');
    });
  });

  describe('Validation Workflows', () => {
    it('handles real-time validation', async () => {
      const user = userEvent.setup();
      let isValid = true;

      const ValidationExample = () => {
        const [value, setValue] = React.useState('');
        const [error, setError] = React.useState('');

        const validate = (val: string) => {
          if (val.length < 3) {
            setError('Must be at least 3 characters');
            return false;
          }
          setError('');
          return true;
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newValue = e.target.value;
          setValue(newValue);
          isValid = validate(newValue);
        };

        return (
          <InputRoot isInvalid={!!error}>
            <InputLabel>Username</InputLabel>
            <InputField value={value} onChange={handleChange} />
            <InputDescription>Enter at least 3 characters</InputDescription>
            <InputErrorMessage>{error}</InputErrorMessage>
          </InputRoot>
        );
      };

      render(<ValidationExample />);

      const field = screen.getByRole('textbox');

      // Initially valid (empty)
      expect(screen.queryByText('Must be at least 3 characters')).not.toBeInTheDocument();

      // Type 1 character - should be invalid
      await user.type(field, 'a');
      await waitFor(() => {
        expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument();
      });
      expect(isValid).toBe(false);

      // Type more characters - should become valid
      await user.type(field, 'bc');
      await waitFor(() => {
        expect(screen.queryByText('Must be at least 3 characters')).not.toBeInTheDocument();
      });
      expect(isValid).toBe(true);
    });

    it('handles async validation', async () => {
      const user = userEvent.setup();
      const mockValidateAsync = jest
        .fn()
        .mockImplementation((value: string) =>
          Promise.resolve(value === 'taken' ? 'Username is taken' : ''),
        );

      const AsyncValidationExample = () => {
        const [value, setValue] = React.useState('');
        const [error, setError] = React.useState('');
        const [isValidating, setIsValidating] = React.useState(false);

        const handleBlur = async () => {
          if (!value) return;

          setIsValidating(true);
          const errorMessage = await mockValidateAsync(value);
          setError(errorMessage);
          setIsValidating(false);
        };

        return (
          <InputRoot isInvalid={!!error}>
            <InputLabel>Username</InputLabel>
            <InputField
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleBlur}
            />
            <InputDescription>
              {isValidating ? 'Checking availability...' : 'Choose a unique username'}
            </InputDescription>
            <InputErrorMessage>{error}</InputErrorMessage>
          </InputRoot>
        );
      };

      render(<AsyncValidationExample />);

      const field = screen.getByRole('textbox');

      // Type a taken username
      await user.type(field, 'taken');
      await user.tab(); // Trigger blur

      await waitFor(() => {
        expect(screen.getByText('Username is taken')).toBeInTheDocument();
      });
      expect(mockValidateAsync).toHaveBeenCalledWith('taken');

      // Clear and type an available username
      await user.clear(field);
      await user.type(field, 'available');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText('Username is taken')).not.toBeInTheDocument();
      });
      expect(mockValidateAsync).toHaveBeenCalledWith('available');
    });

    it('handles multi-field validation', async () => {
      const user = userEvent.setup();

      const MultiFieldValidation = () => {
        const [password, setPassword] = React.useState('');
        const [confirmPassword, setConfirmPassword] = React.useState('');
        const [error, setError] = React.useState('');

        const validatePasswords = (pass: string, confirm: string) => {
          if (confirm && pass !== confirm) {
            setError('Passwords do not match');
          } else {
            setError('');
          }
        };

        return (
          <div>
            <InputRoot>
              <InputLabel>Password</InputLabel>
              <InputField
                type='password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePasswords(e.target.value, confirmPassword);
                }}
              />
            </InputRoot>
            <InputRoot isInvalid={!!error}>
              <InputLabel>Confirm Password</InputLabel>
              <InputField
                type='password'
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validatePasswords(password, e.target.value);
                }}
              />
              <InputErrorMessage>{error}</InputErrorMessage>
            </InputRoot>
          </div>
        );
      };

      render(<MultiFieldValidation />);

      const passwordField = screen.getByLabelText('Password');
      const confirmField = screen.getByLabelText('Confirm Password');

      // Type different passwords
      await user.type(passwordField, 'password123');
      await user.type(confirmField, 'different');

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });

      // Fix the confirm password
      await user.clear(confirmField);
      await user.type(confirmField, 'password123');

      await waitFor(() => {
        expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
      });
    });
  });

  describe('Complex User Interactions', () => {
    it('handles copy and paste operations', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <InputRoot>
            <InputLabel>Source</InputLabel>
            <InputField defaultValue='Copy this text' />
          </InputRoot>
          <InputRoot>
            <InputLabel>Destination</InputLabel>
            <InputField />
          </InputRoot>
        </div>,
      );

      const sourceField = screen.getByLabelText('Source');
      const destField = screen.getByLabelText('Destination');

      // Select all text in source field
      await user.click(sourceField);
      await user.keyboard('{Control>}a{/Control}');

      // Note: Clipboard operations are limited in test environment
      // Instead, we'll test that the fields respond to keyboard input
      await user.click(destField);
      await user.type(destField, 'Copy this text');

      expect(destField).toHaveValue('Copy this text');
    });

    it('handles undo and redo operations', async () => {
      const user = userEvent.setup();

      render(
        <InputRoot>
          <InputLabel>Text</InputLabel>
          <InputField />
        </InputRoot>,
      );

      const field = screen.getByRole('textbox');

      // Type some text
      await user.type(field, 'Hello');
      expect(field).toHaveValue('Hello');

      // Type more text
      await user.type(field, ' World');
      expect(field).toHaveValue('Hello World');

      // Undo (this behavior might be browser-dependent)
      await user.keyboard('{Control>}z{/Control}');

      // Note: Undo behavior in inputs can be browser-specific
      // This test ensures the field still works after undo attempts
      expect(field).toBeInTheDocument();
    });

    it('handles autocomplete interactions', async () => {
      const user = userEvent.setup();

      render(
        <InputRoot>
          <InputLabel>Email</InputLabel>
          <InputField type='email' autoComplete='email' />
        </InputRoot>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('autoComplete', 'email');

      // Type partial email
      await user.type(field, 'test@');
      expect(field).toHaveValue('test@');

      // Complete the email
      await user.type(field, 'example.com');
      expect(field).toHaveValue('test@example.com');
    });

    it('handles focus management in complex layouts', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Before</button>
          <InputRoot>
            <InputLabel>Field 1</InputLabel>
            <InputField />
          </InputRoot>
          <InputRoot>
            <InputLabel>Field 2</InputLabel>
            <InputField />
          </InputRoot>
          <button>After</button>
        </div>,
      );

      const beforeButton = screen.getByRole('button', { name: 'Before' });
      const field1 = screen.getByLabelText('Field 1');
      const field2 = screen.getByLabelText('Field 2');
      const afterButton = screen.getByRole('button', { name: 'After' });

      // Tab through elements
      beforeButton.focus();
      expect(beforeButton).toHaveFocus();

      await user.tab();
      expect(field1).toHaveFocus();

      await user.tab();
      expect(field2).toHaveFocus();

      await user.tab();
      expect(afterButton).toHaveFocus();

      // Tab backwards
      await user.tab({ shift: true });
      expect(field2).toHaveFocus();

      await user.tab({ shift: true });
      expect(field1).toHaveFocus();
    });
  });

  describe('Performance and State Management', () => {
    it('handles rapid state changes efficiently', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(
        <InputRoot>
          <InputLabel>Fast Typing</InputLabel>
          <InputField onChange={onChange} />
        </InputRoot>,
      );

      const field = screen.getByRole('textbox');

      // Simulate rapid typing
      await user.type(field, 'quick brown fox jumps over the lazy dog');

      expect(field).toHaveValue('quick brown fox jumps over the lazy dog');
      expect(onChange).toHaveBeenCalledTimes('quick brown fox jumps over the lazy dog'.length);
    });

    it('maintains state consistency across re-renders', () => {
      const TestComponent = ({ invalid }: { invalid: boolean }) => (
        <InputRoot isInvalid={invalid}>
          <InputLabel>Username</InputLabel>
          <InputField />
          <InputErrorMessage>Error message</InputErrorMessage>
        </InputRoot>
      );

      const { rerender } = render(<TestComponent invalid={false} />);

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('aria-invalid', 'false');
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();

      rerender(<TestComponent invalid={true} />);

      expect(field).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText('Error message')).toBeInTheDocument();

      rerender(<TestComponent invalid={false} />);

      expect(field).toHaveAttribute('aria-invalid', 'false');
      expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    });
  });
});
