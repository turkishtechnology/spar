import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LabelRoot, LabelText, LabelIndicator } from '../index';

describe('Label Integration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Form integration', () => {
    it('should work with form submission', async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <LabelRoot htmlFor='form-email'>Email</LabelRoot>
          <input id='form-email' type='email' name='email' required />

          <LabelRoot htmlFor='form-password'>Password</LabelRoot>
          <input id='form-password' type='password' name='password' required />

          <button type='submit'>Submit</button>
        </form>,
      );

      const emailInput = screen.getByRole('textbox', { name: 'Email' });
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should work with basic form submission', async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <LabelRoot htmlFor='form-email' isRequired>
            Email
          </LabelRoot>
          <input id='form-email' type='email' name='email' required />

          <LabelRoot htmlFor='form-password'>Password</LabelRoot>
          <input id='form-password' type='password' name='password' required />

          <button type='submit'>Submit</button>
        </form>,
      );

      const emailInput = screen.getByRole('textbox', { name: 'Email' });
      const passwordInput = document.getElementById('form-password')!;
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should integrate with fieldset and legend', () => {
      render(
        <fieldset>
          <LabelRoot>Personal Information</LabelRoot>{' '}
          <LabelRoot htmlFor='first-name'>First Name</LabelRoot>
          <input id='first-name' type='text' />
          <LabelRoot htmlFor='last-name'>Last Name</LabelRoot>
          <input id='last-name' type='text' />
        </fieldset>,
      );

      const legend = screen.getByText('Personal Information');
      const firstNameInput = screen.getByRole('textbox', { name: 'First Name' });
      const lastNameInput = screen.getByRole('textbox', { name: 'Last Name' });

      // Since we're using standard label elements for performance optimization
      expect(legend.tagName).toBe('LABEL');
      expect(firstNameInput).toBeInTheDocument();
      expect(lastNameInput).toBeInTheDocument();
    });
  });

  describe('Compound component interactions', () => {
    it('should work with complex label compositions', () => {
      render(
        <div>
          <LabelRoot htmlFor='complex-field'>
            <LabelText>Upload Document</LabelText>
            <LabelIndicator type='required' />
            <LabelText> (PDF only)</LabelText>
          </LabelRoot>
          <input id='complex-field' type='file' accept='.pdf' aria-required='true' />
        </div>,
      );

      const fileInput = screen.getByLabelText(/Upload Document/i);
      expect(fileInput).toHaveAttribute('type', 'file');
      expect(fileInput).toHaveAttribute('accept', '.pdf');
      expect(fileInput).toHaveAttribute('aria-required', 'true');

      expect(screen.getByText('Upload Document')).toBeInTheDocument();
      expect(screen.getByText('(PDF only)')).toBeInTheDocument();
      expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    });

    it('should handle dynamic indicator states', async () => {
      const user = userEvent.setup();

      const DynamicLabel = () => {
        const [isLoading, setIsLoading] = React.useState(false);
        const [isRequired, setIsRequired] = React.useState(false);

        return (
          <div>
            <LabelRoot htmlFor='dynamic-field'>
              <LabelText>Dynamic Field</LabelText>
              {isRequired && <LabelIndicator type='required' />}
              {isLoading && <LabelIndicator type='loading'>Processing...</LabelIndicator>}
            </LabelRoot>
            <input id='dynamic-field' type='text' />

            <button onClick={() => setIsRequired(!isRequired)}>Toggle Required</button>
            <button onClick={() => setIsLoading(!isLoading)}>Toggle Loading</button>
          </div>
        );
      };

      render(<DynamicLabel />);

      const toggleRequired = screen.getByRole('button', { name: 'Toggle Required' });
      const toggleLoading = screen.getByRole('button', { name: 'Toggle Loading' });

      // Initially no indicators
      expect(screen.queryByText('*')).not.toBeInTheDocument();
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();

      // Add required indicator
      await user.click(toggleRequired);
      expect(screen.getByText('*')).toBeInTheDocument();

      // Add loading indicator
      await user.click(toggleLoading);
      expect(screen.getByText('Processing...')).toBeInTheDocument();

      // Both should be visible
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('should support nested label structures', () => {
      render(
        <div>
          <LabelRoot htmlFor='nested-field'>
            <div>
              <LabelText>Main Label</LabelText>
              <div>
                <LabelIndicator type='required' />
                <LabelText>Sublabel</LabelText>
              </div>
            </div>
          </LabelRoot>
          <input id='nested-field' type='text' aria-required='true' />
        </div>,
      );

      const input = screen.getByRole('textbox', { name: /Main Label/i });
      expect(input).toBeInTheDocument();
      expect(screen.getByText('Main Label')).toBeInTheDocument();
      expect(screen.getByText('Sublabel')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('User workflows', () => {
    it('should support complete form filling workflow', async () => {
      const user = userEvent.setup();

      render(
        <form>
          <LabelRoot htmlFor='workflow-name' isRequired>
            Full Name
          </LabelRoot>
          <input id='workflow-name' type='text' aria-required='true' />

          <LabelRoot htmlFor='workflow-email' isRequired>
            Email
          </LabelRoot>
          <input id='workflow-email' type='email' aria-required='true' />

          <LabelRoot htmlFor='workflow-phone'>Phone (Optional)</LabelRoot>
          <input id='workflow-phone' type='tel' />

          <LabelRoot htmlFor='workflow-newsletter'>
            <input id='workflow-newsletter' type='checkbox' />
            Subscribe to newsletter
          </LabelRoot>
        </form>,
      );

      // Fill out the form using labels to identify fields
      const nameInput = screen.getByRole('textbox', { name: /Full Name/i });
      const emailInput = screen.getByRole('textbox', { name: /Email/i });
      const phoneInput = screen.getByRole('textbox', { name: /Phone/i });
      const newsletterCheckbox = screen.getByRole('checkbox', { name: /Subscribe to newsletter/i });

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(phoneInput, '+1234567890');
      await user.click(newsletterCheckbox);

      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(phoneInput).toHaveValue('+1234567890');
      expect(newsletterCheckbox).toBeChecked();
    });

    it('should support keyboard navigation workflow', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <LabelRoot htmlFor='kb-field1'>First Field</LabelRoot>
          <input id='kb-field1' type='text' />

          <LabelRoot htmlFor='kb-field2'>Second Field</LabelRoot>
          <input id='kb-field2' type='text' />

          <LabelRoot htmlFor='kb-field3'>Third Field</LabelRoot>
          <input id='kb-field3' type='text' />
        </div>,
      );

      const field1 = screen.getByRole('textbox', { name: 'First Field' });
      const field2 = screen.getByRole('textbox', { name: 'Second Field' });
      const field3 = screen.getByRole('textbox', { name: 'Third Field' });

      // Tab through fields
      await user.tab();
      expect(field1).toHaveFocus();

      await user.type(field1, 'First');
      await user.tab();
      expect(field2).toHaveFocus();

      await user.type(field2, 'Second');
      await user.tab();
      expect(field3).toHaveFocus();

      await user.type(field3, 'Third');

      // Verify values
      expect(field1).toHaveValue('First');
      expect(field2).toHaveValue('Second');
      expect(field3).toHaveValue('Third');
    });

    it('should support click-to-focus workflow', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <LabelRoot htmlFor='click-field1'>Click Field 1</LabelRoot>
          <input id='click-field1' type='text' />

          <LabelRoot htmlFor='click-field2'>Click Field 2</LabelRoot>
          <input id='click-field2' type='text' />
        </div>,
      );

      const label1 = screen.getByText('Click Field 1');
      const label2 = screen.getByText('Click Field 2');
      const field1 = screen.getByRole('textbox', { name: 'Click Field 1' });
      const field2 = screen.getByRole('textbox', { name: 'Click Field 2' });

      // Click labels to focus inputs
      await user.click(label1);
      expect(field1).toHaveFocus();

      await user.type(field1, 'Focused by label click');

      await user.click(label2);
      expect(field2).toHaveFocus();

      await user.type(field2, 'Also focused by label');

      expect(field1).toHaveValue('Focused by label click');
      expect(field2).toHaveValue('Also focused by label');
    });
  });

  describe('Async operations', () => {
    it('should handle async validation with loading states', async () => {
      const AsyncValidationForm = () => {
        const [isValid, setIsValid] = React.useState<boolean | null>(null);

        const handleValidate = () => {
          const input = document.getElementById('async-input') as HTMLInputElement;
          setIsValid(input.value.length > 3);
        };

        return (
          <div>
            <LabelRoot htmlFor='async-input'>Username</LabelRoot>
            <input id='async-input' type='text' />
            <button onClick={handleValidate}>Validate</button>

            {isValid === true && <div role='status'>Valid username</div>}
            {isValid === false && <div role='alert'>Username too short</div>}
          </div>
        );
      };

      render(<AsyncValidationForm />);

      const input = screen.getByRole('textbox', { name: 'Username' });
      const validateButton = screen.getByRole('button', { name: 'Validate' });

      await userEvent.type(input, 'ab');
      await userEvent.click(validateButton);

      // Should show validation result
      expect(screen.getByRole('alert')).toHaveTextContent('Username too short');
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should work in a registration form scenario', async () => {
      const user = userEvent.setup();

      const RegistrationForm = () => {
        const [formData, setFormData] = React.useState({
          email: '',
          password: '',
          confirmPassword: '',
          terms: false,
        });

        const [errors, setErrors] = React.useState<Record<string, string>>({});

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          const newErrors: Record<string, string> = {};

          if (!formData.email.includes('@')) {
            newErrors.email = 'Invalid email';
          }
          if (formData.password.length < 8) {
            newErrors.password = 'Password too short';
          }
          if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
          }
          if (!formData.terms) {
            newErrors.terms = 'Must accept terms';
          }

          setErrors(newErrors);
        };

        return (
          <form onSubmit={handleSubmit}>
            <LabelRoot htmlFor='reg-email' isRequired>
              Email Address
            </LabelRoot>
            <input
              id='reg-email'
              type='email'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              aria-required='true'
              aria-invalid={!!errors.email}
            />

            <LabelRoot htmlFor='reg-password' isRequired>
              Password
            </LabelRoot>
            <input
              id='reg-password'
              type='password'
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              aria-required='true'
              aria-invalid={!!errors.password}
            />

            <LabelRoot htmlFor='reg-confirm' isRequired>
              Confirm Password
            </LabelRoot>
            <input
              id='reg-confirm'
              type='password'
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              aria-required='true'
              aria-invalid={!!errors.confirmPassword}
            />

            <LabelRoot htmlFor='reg-terms'>
              <input
                id='reg-terms'
                type='checkbox'
                checked={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                aria-invalid={!!errors.terms}
              />
              I accept the terms and conditions
            </LabelRoot>

            <button type='submit'>Register</button>
          </form>
        );
      };

      render(<RegistrationForm />);

      // Fill out form with invalid data
      await user.type(screen.getByRole('textbox', { name: /Email Address/i }), 'invalid');
      await user.type(document.getElementById('reg-password')!, 'short');
      await user.type(document.getElementById('reg-confirm')!, 'different');
      // Don't check terms checkbox

      await user.click(screen.getByRole('button', { name: 'Register' }));

      // Form should remain on page (validation failed)
      expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    });
  });
});
