import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Input } from '../index';

expect.extend(toHaveNoViolations);

describe('Input Accessibility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ARIA Compliance', () => {
    it('passes accessibility checks with basic setup', async () => {
      const { container } = render(
        <Input.Root>
          <Input.Label>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks with description', async () => {
      const { container } = render(
        <Input.Root>
          <Input.Label>Username</Input.Label>
          <Input.Field />
          <Input.Description>Enter your username</Input.Description>
        </Input.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks with error state', async () => {
      const { container } = render(
        <Input.Root isInvalid>
          <Input.Label>Username</Input.Label>
          <Input.Field />
          <Input.ErrorMessage>Username is required</Input.ErrorMessage>
        </Input.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks with all elements', async () => {
      const { container } = render(
        <Input.Root isInvalid required>
          <Input.Label>Username</Input.Label>
          <Input.Field />
          <Input.Description>Enter your username</Input.Description>
          <Input.ErrorMessage>Username is required</Input.ErrorMessage>
        </Input.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks with textarea', async () => {
      const { container } = render(
        <Input.Root>
          <Input.Label>Message</Input.Label>
          <Input.Field as='textarea' />
          <Input.Description>Enter your message</Input.Description>
        </Input.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes accessibility checks in disabled state', async () => {
      const { container } = render(
        <Input.Root disabled>
          <Input.Label>Username</Input.Label>
          <Input.Field />
          <Input.Description>Enter your username</Input.Description>
        </Input.Root>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes', () => {
    it('properly links label to field', () => {
      render(
        <Input.Root>
          <Input.Label>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
      );

      const label = screen.getByText('Username');
      const field = screen.getByRole('textbox');

      expect(field).toHaveAttribute('aria-labelledby', label.id);
      expect(label).toHaveAttribute('for', field.id);
    });

    it('properly links description to field when valid', () => {
      render(
        <Input.Root>
          <Input.Label>Username</Input.Label>
          <Input.Field />
          <Input.Description>Enter your username</Input.Description>
        </Input.Root>,
      );

      const description = screen.getByText('Enter your username');
      const field = screen.getByRole('textbox');

      expect(field).toHaveAttribute('aria-describedby', description.id);
    });

    it('properly links error message to field when invalid', () => {
      render(
        <Input.Root isInvalid>
          <Input.Label>Username</Input.Label>
          <Input.Field />
          <Input.ErrorMessage>Username is required</Input.ErrorMessage>
        </Input.Root>,
      );

      const error = screen.getByText('Username is required');
      const field = screen.getByRole('textbox');

      expect(field).toHaveAttribute('aria-describedby', error.id);
      expect(error).toHaveAttribute('role', 'alert');
    });

    it('prioritizes error message over description in aria-describedby', () => {
      render(
        <Input.Root isInvalid>
          <Input.Label>Username</Input.Label>
          <Input.Field />
          <Input.Description>Enter your username</Input.Description>
          <Input.ErrorMessage>Username is required</Input.ErrorMessage>
        </Input.Root>,
      );

      const error = screen.getByText('Username is required');
      const field = screen.getByRole('textbox');

      expect(field).toHaveAttribute('aria-describedby', error.id);
    });

    it('sets aria-required correctly', () => {
      render(
        <Input.Root required>
          <Input.Label>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('aria-required', 'true');
    });

    it('sets aria-invalid correctly', () => {
      const { rerender } = render(
        <Input.Root isInvalid={false}>
          <Input.Label>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('aria-invalid', 'false');

      rerender(
        <Input.Root isInvalid={true}>
          <Input.Label>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
      );

      expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    it('maintains unique IDs across multiple instances', () => {
      render(
        <div>
          <Input.Root>
            <Input.Label>First Name</Input.Label>
            <Input.Field />
          </Input.Root>
          <Input.Root>
            <Input.Label>Last Name</Input.Label>
            <Input.Field />
          </Input.Root>
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
        <Input.Root>
          <Input.Label>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
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
        <Input.Root>
          <Input.Label>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      await user.click(field);
      await user.keyboard('hello world');

      expect(field).toHaveValue('hello world');
    });

    it('supports selection and editing', async () => {
      const user = userEvent.setup();

      render(
        <Input.Root>
          <Input.Label>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
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
        <Input.Root>
          <Input.Label>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
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
        <Input.Root disabled>
          <Input.Label>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toBeDisabled();

      // Try to focus and type
      await user.click(field);
      await user.keyboard('hello');

      expect(field).not.toHaveFocus();
      expect(field).toHaveValue('');
    });

    it('should auto-focus when shouldAutoFocus is true', async () => {
      render(
        <Input.Root>
          <Input.Label>Username</Input.Label>
          <Input.Field shouldAutoFocus />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      await waitFor(() => {
        expect(field).toHaveFocus();
      });
      expect(field).toHaveAttribute('data-autofocus', '');
    });

    it('should not auto-focus by default', () => {
      render(
        <Input.Root>
          <Input.Label>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field).not.toHaveAttribute('data-autofocus');
    });

    it('should auto-focus standalone input', async () => {
      render(<Input.Field shouldAutoFocus aria-label='Standalone input' />);

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
        <Input.Root isInvalid>
          <Input.Label>Username</Input.Label>
          <Input.Field />
          <Input.ErrorMessage>Username is required</Input.ErrorMessage>
        </Input.Root>,
      );

      const error = screen.getByText('Username is required');
      expect(error).toHaveAttribute('role', 'alert');
    });

    it('provides context through aria-describedby', () => {
      render(
        <Input.Root>
          <Input.Label>Password</Input.Label>
          <Input.Field type='password' />
          <Input.Description>Must be at least 8 characters</Input.Description>
        </Input.Root>,
      );

      const field = screen.getByLabelText('Password');
      const description = screen.getByText('Must be at least 8 characters');

      expect(field).toHaveAttribute('aria-describedby', description.id);
    });

    it('announces required state', () => {
      render(
        <Input.Root required>
          <Input.Label>Email</Input.Label>
          <Input.Field type='email' />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('aria-required', 'true');
      expect(field).toBeRequired();
    });

    it('announces invalid state', () => {
      render(
        <Input.Root isInvalid>
          <Input.Label>Email</Input.Label>
          <Input.Field type='email' />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Form Association', () => {
    it('properly associates with form elements', () => {
      render(
        <form>
          <Input.Root>
            <Input.Label>Username</Input.Label>
            <Input.Field name='username' />
          </Input.Root>
        </form>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('name', 'username');
    });

    it('supports form validation attributes', () => {
      render(
        <Input.Root required>
          <Input.Label>Email</Input.Label>
          <Input.Field type='email' pattern='[^@]+@[^@]+\.[a-zA-Z]{2,}' />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('type', 'email');
      expect(field).toHaveAttribute('pattern', '[^@]+@[^@]+\\.[a-zA-Z]{2,}');
      expect(field).toBeRequired();
    });
  });
});
