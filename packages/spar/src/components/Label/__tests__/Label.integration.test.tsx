import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Label } from '../Label';

describe('Label Integration', () => {
  describe('Form Integration', () => {
    it('integrates with complete form structure', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <div>
            <Label htmlFor='username' isRequired>
              Username
            </Label>
            <input id='username' type='text' required />
          </div>
          <div>
            <Label htmlFor='email' isRequired>
              Email
            </Label>
            <input id='email' type='email' required />
          </div>
          <div>
            <Label htmlFor='bio' isOptional>
              Bio
            </Label>
            <textarea id='bio' />
          </div>
          <button type='submit'>Submit</button>
        </form>,
      );

      const usernameInput = screen.getByLabelText('Username');
      const emailInput = screen.getByLabelText('Email');
      const bioInput = screen.getByLabelText('Bio');

      await user.type(usernameInput, 'john_doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(bioInput, 'Developer');

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('works with form validation', async () => {
      const user = userEvent.setup();

      render(
        <form>
          <div>
            <Label htmlFor='password' isRequired>
              Password
              <span aria-label='required'>*</span>
            </Label>
            <input
              id='password'
              type='password'
              required
              minLength={8}
              aria-describedby='password-hint'
            />
            <span id='password-hint'>Must be at least 8 characters</span>
          </div>
          <button type='submit'>Submit</button>
        </form>,
      );

      const passwordInput = screen.getByLabelText(/Password/);
      expect(passwordInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('minLength', '8');

      await user.type(passwordInput, 'short');
      expect(passwordInput).toHaveValue('short');
    });

    it('handles multiple forms on same page', () => {
      render(
        <div>
          <form id='form1'>
            <Label htmlFor='form1-input'>Form 1 Field</Label>
            <input id='form1-input' type='text' />
          </form>
          <form id='form2'>
            <Label htmlFor='form2-input'>Form 2 Field</Label>
            <input id='form2-input' type='text' />
          </form>
        </div>,
      );

      const form1Input = screen.getByLabelText('Form 1 Field');
      const form2Input = screen.getByLabelText('Form 2 Field');

      expect(form1Input).toHaveAttribute('id', 'form1-input');
      expect(form2Input).toHaveAttribute('id', 'form2-input');
    });

    it('supports fieldset and legend structure', () => {
      render(
        <form>
          <fieldset>
            <Label as='legend'>Personal Information</Label>
            <div>
              <Label htmlFor='first-name'>First Name</Label>
              <input id='first-name' type='text' />
            </div>
            <div>
              <Label htmlFor='last-name'>Last Name</Label>
              <input id='last-name' type='text' />
            </div>
          </fieldset>
        </form>,
      );

      expect(screen.getByText('Personal Information').tagName).toBe('LEGEND');
      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    });
  });

  describe('Radio Group Integration', () => {
    it('works with radio button groups', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <fieldset>
          <Label as='legend'>Choose your plan</Label>
          <div>
            <Label htmlFor='plan-free'>
              <input id='plan-free' type='radio' name='plan' value='free' onChange={handleChange} />
              Free
            </Label>
          </div>
          <div>
            <Label htmlFor='plan-pro'>
              <input id='plan-pro' type='radio' name='plan' value='pro' onChange={handleChange} />
              Pro
            </Label>
          </div>
          <div>
            <Label htmlFor='plan-enterprise'>
              <input
                id='plan-enterprise'
                type='radio'
                name='plan'
                value='enterprise'
                onChange={handleChange}
              />
              Enterprise
            </Label>
          </div>
        </fieldset>,
      );

      const freeRadio = screen.getByLabelText('Free');
      const proRadio = screen.getByLabelText('Pro');

      await user.click(freeRadio);
      expect(freeRadio).toBeChecked();
      expect(proRadio).not.toBeChecked();

      await user.click(proRadio);
      expect(freeRadio).not.toBeChecked();
      expect(proRadio).toBeChecked();

      expect(handleChange).toHaveBeenCalledTimes(2);
    });

    it('handles disabled radio options', async () => {
      const user = userEvent.setup();

      render(
        <fieldset>
          <Label as='legend'>Select option</Label>
          <div>
            <Label htmlFor='option1'>Option 1</Label>
            <input id='option1' type='radio' name='option' value='1' />
          </div>
          <div>
            <Label htmlFor='option2' isDisabled>
              Option 2 (Disabled)
            </Label>
            <input id='option2' type='radio' name='option' value='2' disabled />
          </div>
        </fieldset>,
      );

      const option2Label = screen.getByText('Option 2 (Disabled)');
      const option2Radio = screen.getByLabelText('Option 2 (Disabled)');

      expect(option2Label).toHaveAttribute('data-disabled');
      expect(option2Radio).toBeDisabled();

      await user.click(option2Label);
      expect(option2Radio).not.toBeChecked();
    });
  });

  describe('Checkbox Group Integration', () => {
    it('works with checkbox groups', async () => {
      const user = userEvent.setup();

      const CheckboxGroup = () => {
        const [selected, setSelected] = React.useState<string[]>([]);

        const handleToggle = (value: string) => {
          setSelected((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
          );
        };

        return (
          <fieldset>
            <Label as='legend'>Select features</Label>
            {['feature1', 'feature2', 'feature3'].map((feature) => (
              <div key={feature}>
                <Label htmlFor={feature}>
                  <input
                    id={feature}
                    type='checkbox'
                    value={feature}
                    checked={selected.includes(feature)}
                    onChange={() => handleToggle(feature)}
                  />
                  {feature}
                </Label>
              </div>
            ))}
          </fieldset>
        );
      };

      render(<CheckboxGroup />);

      const feature1 = screen.getByLabelText('feature1');
      const feature2 = screen.getByLabelText('feature2');

      expect(feature1).not.toBeChecked();
      expect(feature2).not.toBeChecked();

      await user.click(feature1);
      expect(feature1).toBeChecked();

      await user.click(feature2);
      expect(feature2).toBeChecked();

      await user.click(feature1);
      expect(feature1).not.toBeChecked();
      expect(feature2).toBeChecked();
    });
  });

  describe('Complex Form Patterns', () => {
    it('handles multi-step form with state preservation', async () => {
      const user = userEvent.setup();

      const MultiStepForm = () => {
        const [step, setStep] = React.useState(1);
        const [formData, setFormData] = React.useState({
          name: '',
          email: '',
          phone: '',
        });

        const handleChange = (field: string, value: string) => {
          setFormData((prev) => ({ ...prev, [field]: value }));
        };

        return (
          <form>
            {step === 1 && (
              <div>
                <Label htmlFor='name' isRequired>
                  Name
                </Label>
                <input
                  id='name'
                  type='text'
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                <button type='button' onClick={() => setStep(2)}>
                  Next
                </button>
              </div>
            )}
            {step === 2 && (
              <div>
                <Label htmlFor='email' isRequired>
                  Email
                </Label>
                <input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                <button type='button' onClick={() => setStep(1)}>
                  Back
                </button>
                <button type='button' onClick={() => setStep(3)}>
                  Next
                </button>
              </div>
            )}
            {step === 3 && (
              <div>
                <Label htmlFor='phone' isOptional>
                  Phone
                </Label>
                <input
                  id='phone'
                  type='tel'
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                <p>Name: {formData.name}</p>
                <p>Email: {formData.email}</p>
              </div>
            )}
          </form>
        );
      };

      render(<MultiStepForm />);

      // Step 1
      const nameInput = screen.getByLabelText('Name');
      await user.type(nameInput, 'John Doe');
      expect(nameInput).toHaveValue('John Doe');

      await user.click(screen.getByText('Next'));

      // Step 2
      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'john@example.com');

      await user.click(screen.getByText('Next'));

      // Step 3 - verify data preserved
      expect(screen.getByText('Name: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    });

    it('handles conditional field requirements', async () => {
      const user = userEvent.setup();

      const ConditionalForm = () => {
        const [accountType, setAccountType] = React.useState('personal');

        return (
          <form>
            <div>
              <Label htmlFor='account-type'>Account Type</Label>
              <select
                id='account-type'
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value='personal'>Personal</option>
                <option value='business'>Business</option>
              </select>
            </div>

            {accountType === 'business' && (
              <div>
                <Label htmlFor='company-name' isRequired>
                  Company Name
                </Label>
                <input id='company-name' type='text' required />
              </div>
            )}

            <div>
              <Label htmlFor='full-name' isRequired>
                Full Name
              </Label>
              <input id='full-name' type='text' required />
            </div>
          </form>
        );
      };

      render(<ConditionalForm />);

      expect(screen.queryByLabelText('Company Name')).not.toBeInTheDocument();

      const accountTypeSelect = screen.getByLabelText('Account Type');
      await user.selectOptions(accountTypeSelect, 'business');

      const companyNameInput = screen.getByLabelText('Company Name');
      expect(companyNameInput).toBeInTheDocument();
      expect(companyNameInput).toHaveAttribute('required');

      const companyLabel = screen.getByText('Company Name');
      expect(companyLabel).toHaveAttribute('data-required');
    });
  });

  describe('Dynamic Label Updates', () => {
    it('updates label text dynamically', () => {
      const { rerender } = render(
        <div>
          <Label htmlFor='dynamic-input'>Original Label</Label>
          <input id='dynamic-input' type='text' />
        </div>,
      );

      expect(screen.getByText('Original Label')).toBeInTheDocument();
      expect(screen.getByLabelText('Original Label')).toBeInTheDocument();

      rerender(
        <div>
          <Label htmlFor='dynamic-input'>Updated Label</Label>
          <input id='dynamic-input' type='text' />
        </div>,
      );

      expect(screen.getByText('Updated Label')).toBeInTheDocument();
      expect(screen.getByLabelText('Updated Label')).toBeInTheDocument();
    });

    it('updates state indicators dynamically', () => {
      const { rerender } = render(
        <div>
          <Label htmlFor='state-input' isOptional>
            Field
          </Label>
          <input id='state-input' type='text' />
        </div>,
      );

      let label = screen.getByText('Field');
      expect(label).toHaveAttribute('data-optional');
      expect(label).not.toHaveAttribute('data-required');

      rerender(
        <div>
          <Label htmlFor='state-input' isRequired>
            Field
          </Label>
          <input id='state-input' type='text' required />
        </div>,
      );

      label = screen.getByText('Field');
      expect(label).toHaveAttribute('data-required');
      expect(label).not.toHaveAttribute('data-optional');
    });
  });

  describe('Accessibility with Complex Interactions', () => {
    it('maintains focus when clicking labels', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Label htmlFor='focus-input'>Click to focus</Label>
          <input id='focus-input' type='text' />
        </div>,
      );

      const label = screen.getByText('Click to focus');
      const input = screen.getByLabelText('Click to focus');

      expect(input).not.toHaveFocus();

      await user.click(label);

      expect(input).toHaveFocus();
    });

    it('works with custom focus management', async () => {
      const user = userEvent.setup();

      const FocusManagementForm = () => {
        const inputRef = React.useRef<HTMLInputElement>(null);

        const handleLabelClick = () => {
          inputRef.current?.focus();
        };

        return (
          <div>
            <Label as='div' onClick={handleLabelClick}>
              Custom Focus Label
            </Label>
            <input ref={inputRef} type='text' aria-label='Custom Focus Label' />
          </div>
        );
      };

      render(<FocusManagementForm />);

      const label = screen.getByText('Custom Focus Label');
      const input = screen.getByLabelText('Custom Focus Label');

      await user.click(label);

      expect(input).toHaveFocus();
    });
  });

  describe('Error Handling Integration', () => {
    it('integrates with error states and messages', async () => {
      const user = userEvent.setup();

      const FormWithValidation = () => {
        const [error, setError] = React.useState('');

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
          if (!e.target.value) {
            setError('This field is required');
          } else {
            setError('');
          }
        };

        return (
          <div>
            <Label htmlFor='validated-input' isRequired>
              Username
            </Label>
            <input
              id='validated-input'
              type='text'
              required
              onBlur={handleBlur}
              aria-invalid={!!error}
              aria-describedby={error ? 'error-message' : undefined}
            />
            {error && (
              <span id='error-message' role='alert'>
                {error}
              </span>
            )}
          </div>
        );
      };

      render(<FormWithValidation />);

      const input = screen.getByLabelText('Username');

      await user.click(input);
      await user.tab();

      expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Real-World Usage Scenarios', () => {
    it('works in a login form', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div>
            <Label htmlFor='login-email' isRequired>
              Email
            </Label>
            <input id='login-email' type='email' required />
          </div>
          <div>
            <Label htmlFor='login-password' isRequired>
              Password
            </Label>
            <input id='login-password' type='password' required />
          </div>
          <div>
            <Label htmlFor='remember-me'>
              <input id='remember-me' type='checkbox' />
              Remember me
            </Label>
          </div>
          <button type='submit'>Sign In</button>
        </form>,
      );

      await user.type(screen.getByLabelText('Email'), 'user@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByLabelText('Remember me'));
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('works in a registration form with multiple field types', async () => {
      const user = userEvent.setup();

      render(
        <form>
          <div>
            <Label htmlFor='reg-username' isRequired>
              Username
            </Label>
            <input id='reg-username' type='text' required />
          </div>
          <div>
            <Label htmlFor='reg-email' isRequired>
              Email
            </Label>
            <input id='reg-email' type='email' required />
          </div>
          <div>
            <Label htmlFor='reg-country' isRequired>
              Country
            </Label>
            <select id='reg-country' required>
              <option value=''>Select...</option>
              <option value='us'>United States</option>
              <option value='uk'>United Kingdom</option>
            </select>
          </div>
          <div>
            <Label htmlFor='reg-bio' isOptional>
              Bio
            </Label>
            <textarea id='reg-bio' />
          </div>
          <div>
            <Label htmlFor='reg-terms'>
              <input id='reg-terms' type='checkbox' required />I agree to the terms
            </Label>
          </div>
        </form>,
      );

      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.selectOptions(screen.getByLabelText('Country'), 'us');
      await user.type(screen.getByLabelText('Bio'), 'Software developer');
      await user.click(screen.getByLabelText('I agree to the terms'));

      expect(screen.getByLabelText('Username')).toHaveValue('johndoe');
      expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
      expect(screen.getByLabelText('Country')).toHaveValue('us');
      expect(screen.getByLabelText('Bio')).toHaveValue('Software developer');
      expect(screen.getByLabelText('I agree to the terms')).toBeChecked();
    });
  });
});
