import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input, InputField, InputLabel, InputDescription, InputErrorMessage } from '../index';

expect.extend(toHaveNoViolations);

describe('Input Accessibility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ARIA Compliance', () => {
    it('passes accessibility checks with basic setup', async () => {
      const { container } = render(
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks with description', async () => {
      const { container } = render(
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField />
          <InputDescription>Enter your username</InputDescription>
        </Input>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks with error state', async () => {
      const { container } = render(
        <Input isInvalid>
          <InputLabel>Username</InputLabel>
          <InputField />
          <InputErrorMessage>Username is required</InputErrorMessage>
        </Input>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks with all elements', async () => {
      const { container } = render(
        <Input isInvalid required>
          <InputLabel>Username</InputLabel>
          <InputField />
          <InputDescription>Enter your username</InputDescription>
          <InputErrorMessage>Username is required</InputErrorMessage>
        </Input>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks with textarea', async () => {
      const { container } = render(
        <Input>
          <InputLabel>Message</InputLabel>
          <InputField as='textarea' />
          <InputDescription>Enter your message</InputDescription>
        </Input>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks in disabled state', async () => {
      const { container } = render(
        <Input disabled>
          <InputLabel>Username</InputLabel>
          <InputField />
          <InputDescription>Enter your username</InputDescription>
        </Input>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes', () => {
    it('properly links label to field', () => {
      render(
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>,
      );

      const label = screen.getByText('Username');
      const field = screen.getByRole('textbox');

      expect(field).toHaveAttribute('aria-labelledby', label.id);
      expect(label).toHaveAttribute('for', field.id);
    });

    it('properly links description to field when valid', () => {
      render(
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField />
          <InputDescription>Enter your username</InputDescription>
        </Input>,
      );

      const description = screen.getByText('Enter your username');
      const field = screen.getByRole('textbox');

      expect(field).toHaveAttribute('aria-describedby', description.id);
    });

    it('properly links error message to field when invalid', () => {
      render(
        <Input isInvalid>
          <InputLabel>Username</InputLabel>
          <InputField />
          <InputErrorMessage>Username is required</InputErrorMessage>
        </Input>,
      );

      const error = screen.getByText('Username is required');
      const field = screen.getByRole('textbox');

      expect(field).toHaveAttribute('aria-describedby', error.id);
      expect(error).toHaveAttribute('role', 'alert');
    });

    it('prioritizes error message over description in aria-describedby', () => {
      render(
        <Input isInvalid>
          <InputLabel>Username</InputLabel>
          <InputField />
          <InputDescription>Enter your username</InputDescription>
          <InputErrorMessage>Username is required</InputErrorMessage>
        </Input>,
      );

      const error = screen.getByText('Username is required');
      const field = screen.getByRole('textbox');

      expect(field).toHaveAttribute('aria-describedby', error.id);
    });

    it('sets aria-required correctly', () => {
      render(
        <Input required>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('aria-required', 'true');
    });

    it('sets aria-invalid correctly', () => {
      const { rerender } = render(
        <Input isInvalid={false}>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('aria-invalid', 'false');

      rerender(
        <Input isInvalid={true}>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>,
      );

      expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    it('maintains unique IDs across multiple instances', () => {
      render(
        <div>
          <Input>
            <InputLabel>First Name</InputLabel>
            <InputField />
          </Input>
          <Input>
            <InputLabel>Last Name</InputLabel>
            <InputField />
          </Input>
        </div>,
      );

      const firstField = screen.getByLabelText('First Name');
      const lastField = screen.getByLabelText('Last Name');

      expect(firstField.id).not.toBe(lastField.id);
      expect(firstField.getAttribute('aria-labelledby')).not.toBe(
        lastField.getAttribute('aria-labelledby'),
      );
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports focus management', async () => {
      const user = userEvent.setup();

      render(
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>,
      );

      const field = screen.getByRole('textbox');

      // Focus the field
      await user.tab();
      expect(field).toHaveFocus();
      expect(field).toHaveAttribute('data-focused', '');

      // Blur the field
      await user.tab();
      expect(field).not.toHaveFocus();
      expect(field).not.toHaveAttribute('data-focused');
    });

    it('supports keyboard input', async () => {
      const user = userEvent.setup();

      render(
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      await user.click(field);
      await user.keyboard('hello world');

      expect(field).toHaveValue('hello world');
    });

    it('supports selection and editing', async () => {
      const user = userEvent.setup();

      render(
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      await user.click(field);
      await user.keyboard('hello world');

      // Select all and replace
      await user.keyboard('{Control>}a{/Control}');
      await user.keyboard('new text');

      expect(field).toHaveValue('new text');
    });

    it('supports backspace and delete', async () => {
      const user = userEvent.setup();

      render(
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      await user.click(field);
      await user.keyboard('hello');
      await user.keyboard('{Backspace}');

      expect(field).toHaveValue('hell');
    });

    it('respects disabled state for keyboard interaction', async () => {
      const user = userEvent.setup();

      render(
        <Input disabled>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toBeDisabled();

      // Try to focus and type
      await user.click(field);
      await user.keyboard('hello');

      expect(field).not.toHaveFocus();
      expect(field).toHaveValue('');
    });

    it('should auto-focus when autoFocus is true', async () => {
      render(
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField autoFocus />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      await waitFor(() => {
        expect(field).toHaveFocus();
      });
      expect(field).toHaveAttribute('data-autofocus', '');
    });

    it('should not auto-focus by default', () => {
      render(
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field).not.toHaveAttribute('data-autofocus');
    });

    it('should auto-focus standalone input', async () => {
      render(<InputField autoFocus aria-label='Standalone input' />);

      const field = screen.getByRole('textbox');
      await waitFor(() => {
        expect(field).toHaveFocus();
      });
      expect(field).toHaveAttribute('data-autofocus', '');
    });
  });

  describe('Screen Reader Support', () => {
    it('announces error messages immediately via role="alert"', () => {
      render(
        <Input isInvalid>
          <InputLabel>Username</InputLabel>
          <InputField />
          <InputErrorMessage>Username is required</InputErrorMessage>
        </Input>,
      );

      const error = screen.getByText('Username is required');
      expect(error).toHaveAttribute('role', 'alert');
    });

    it('provides context through aria-describedby', () => {
      render(
        <Input>
          <InputLabel>Password</InputLabel>
          <InputField type='password' />
          <InputDescription>Must be at least 8 characters</InputDescription>
        </Input>,
      );

      const field = screen.getByLabelText('Password');
      const description = screen.getByText('Must be at least 8 characters');

      expect(field).toHaveAttribute('aria-describedby', description.id);
    });

    it('announces required state', () => {
      render(
        <Input required>
          <InputLabel>Email</InputLabel>
          <InputField type='email' />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('aria-required', 'true');
      expect(field).toBeRequired();
    });

    it('announces invalid state', () => {
      render(
        <Input isInvalid>
          <InputLabel>Email</InputLabel>
          <InputField type='email' />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Form Association', () => {
    it('properly associates with form elements', () => {
      render(
        <form>
          <Input>
            <InputLabel>Username</InputLabel>
            <InputField name='username' />
          </Input>
        </form>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('name', 'username');
    });

    it('supports form validation attributes', () => {
      render(
        <Input required>
          <InputLabel>Email</InputLabel>
          <InputField type='email' pattern='[^@]+@[^@]+\.[a-zA-Z]{2,}' />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('type', 'email');
      expect(field).toHaveAttribute('pattern', '[^@]+@[^@]+\\.[a-zA-Z]{2,}');
      expect(field).toBeRequired();
    });
  });
});
