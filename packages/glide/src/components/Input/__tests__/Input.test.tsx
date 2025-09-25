import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Input.Root', () => {
    it('renders with default props', () => {
      render(
        <Input.Root>
          <Input.Field />
        </Input.Root>,
      );

      const root = screen.getByRole('textbox').closest('[data-glide-input]');
      expect(root).toBeInTheDocument();
      expect(root).not.toHaveAttribute('data-invalid');
      expect(root).not.toHaveAttribute('data-disabled');
      expect(root).not.toHaveAttribute('data-required');
    });

    it('renders with invalid state', () => {
      render(
        <Input.Root isInvalid>
          <Input.Field />
        </Input.Root>,
      );

      const root = screen.getByRole('textbox').closest('[data-glide-input]');
      expect(root).toHaveAttribute('data-invalid', '');
    });

    it('renders with disabled state', () => {
      render(
        <Input.Root isDisabled>
          <Input.Field />
        </Input.Root>,
      );

      const root = screen.getByRole('textbox').closest('[data-glide-input]');
      expect(root).toHaveAttribute('data-disabled', '');
    });

    it('renders with required state', () => {
      render(
        <Input.Root isRequired>
          <Input.Field />
        </Input.Root>,
      );

      const root = screen.getByRole('textbox').closest('[data-glide-input]');
      expect(root).toHaveAttribute('data-required', '');
    });

    it('updates state when props change', () => {
      const { rerender } = render(
        <Input.Root isInvalid={false}>
          <Input.Field />
        </Input.Root>,
      );

      let root = screen.getByRole('textbox').closest('[data-glide-input]');
      expect(root).not.toHaveAttribute('data-invalid');

      rerender(
        <Input.Root isInvalid={true}>
          <Input.Field />
        </Input.Root>,
      );

      root = screen.getByRole('textbox').closest('[data-glide-input]');
      expect(root).toHaveAttribute('data-invalid', '');
    });

    it('passes through additional props', () => {
      render(
        <Input.Root className='custom-class' data-testid='input-root'>
          <Input.Field />
        </Input.Root>,
      );

      const root = screen.getByTestId('input-root');
      expect(root).toHaveClass('custom-class');
      expect(root).toHaveAttribute('data-glide-input');
    });
  });

  describe('Input.Field', () => {
    it('renders as input by default', () => {
      render(
        <Input.Root>
          <Input.Field />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field.tagName).toBe('INPUT');
      expect(field).toHaveAttribute('type', 'text');
    });

    it('renders with custom type', () => {
      render(
        <Input.Root>
          <Input.Field type='email' />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('type', 'email');
    });

    it('renders as textarea when specified', () => {
      render(
        <Input.Root>
          <Input.Field as='textarea' />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field.tagName).toBe('TEXTAREA');
      expect(field).not.toHaveAttribute('type');
    });

    it('applies disabled state from context', () => {
      render(
        <Input.Root isDisabled>
          <Input.Field />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toBeDisabled();
    });

    it('applies required state from context', () => {
      render(
        <Input.Root isRequired>
          <Input.Field />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toBeRequired();
    });

    it('applies invalid state from context', () => {
      render(
        <Input.Root isInvalid>
          <Input.Field />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    it('handles focus and blur events', async () => {
      const user = userEvent.setup();
      const onFocus = jest.fn();
      const onBlur = jest.fn();

      render(
        <Input.Root>
          <Input.Field onFocus={onFocus} onBlur={onBlur} />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');

      await user.click(field);
      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(field).toHaveAttribute('data-focused', '');

      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(field).not.toHaveAttribute('data-focused');
    });

    it('handles user input', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(
        <Input.Root>
          <Input.Field onChange={onChange} />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      await user.type(field, 'hello');

      expect(onChange).toHaveBeenCalledTimes(5); // One call per character
      expect(field).toHaveValue('hello');
    });

    it('passes through additional props', () => {
      render(
        <Input.Root>
          <Input.Field placeholder='Enter text' className='custom-input' />
        </Input.Root>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('placeholder', 'Enter text');
      expect(field).toHaveClass('custom-input');
      expect(field).toHaveAttribute('data-glide-input-field');
    });

    it('throws error when used outside Input.Root', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Input.Field />);
      }).toThrow('Input compound components must be used within Input.Root');

      jest.restoreAllMocks();
    });
  });

  describe('Input.Label', () => {
    it('renders and associates with field', () => {
      render(
        <Input.Root>
          <Input.Label>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
      );

      const label = screen.getByText('Username');
      const field = screen.getByRole('textbox');

      expect(label.tagName).toBe('LABEL');
      expect(label).toHaveAttribute('data-glide-input-label');
      expect(label).toHaveAttribute('for', field.id);
      expect(field).toHaveAttribute('aria-labelledby', label.id);
    });

    it('passes through additional props', () => {
      render(
        <Input.Root>
          <Input.Label className='custom-label'>Username</Input.Label>
          <Input.Field />
        </Input.Root>,
      );

      const label = screen.getByText('Username');
      expect(label).toHaveClass('custom-label');
    });

    it('throws error when used outside Input.Root', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Input.Label>Username</Input.Label>);
      }).toThrow('Input compound components must be used within Input.Root');

      jest.restoreAllMocks();
    });
  });

  describe('Input.Description', () => {
    it('renders and associates with field when valid', () => {
      render(
        <Input.Root>
          <Input.Field />
          <Input.Description>Enter your username</Input.Description>
        </Input.Root>,
      );

      const description = screen.getByText('Enter your username');
      const field = screen.getByRole('textbox');

      expect(description).toHaveAttribute('data-glide-input-description');
      expect(field).toHaveAttribute('aria-describedby', description.id);
    });

    it('passes through additional props', () => {
      render(
        <Input.Root>
          <Input.Field />
          <Input.Description className='custom-description'>Enter your username</Input.Description>
        </Input.Root>,
      );

      const description = screen.getByText('Enter your username');
      expect(description).toHaveClass('custom-description');
    });

    it('throws error when used outside Input.Root', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Input.Description>Help text</Input.Description>);
      }).toThrow('Input compound components must be used within Input.Root');

      jest.restoreAllMocks();
    });
  });

  describe('Input.ErrorMessage', () => {
    it('renders when input is invalid', () => {
      render(
        <Input.Root isInvalid>
          <Input.Field />
          <Input.ErrorMessage>Username is required</Input.ErrorMessage>
        </Input.Root>,
      );

      const error = screen.getByText('Username is required');
      const field = screen.getByRole('textbox');

      expect(error).toBeInTheDocument();
      expect(error).toHaveAttribute('role', 'alert');
      expect(error).toHaveAttribute('data-glide-input-error');
      expect(field).toHaveAttribute('aria-describedby', error.id);
    });

    it('does not render when input is valid', () => {
      render(
        <Input.Root isInvalid={false}>
          <Input.Field />
          <Input.ErrorMessage>Username is required</Input.ErrorMessage>
        </Input.Root>,
      );

      const error = screen.queryByText('Username is required');
      expect(error).not.toBeInTheDocument();
    });

    it('updates visibility when invalid state changes', () => {
      const { rerender } = render(
        <Input.Root isInvalid={false}>
          <Input.Field />
          <Input.ErrorMessage>Username is required</Input.ErrorMessage>
        </Input.Root>,
      );

      expect(screen.queryByText('Username is required')).not.toBeInTheDocument();

      rerender(
        <Input.Root isInvalid={true}>
          <Input.Field />
          <Input.ErrorMessage>Username is required</Input.ErrorMessage>
        </Input.Root>,
      );

      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });

    it('passes through additional props when visible', () => {
      render(
        <Input.Root isInvalid>
          <Input.Field />
          <Input.ErrorMessage className='custom-error'>Username is required</Input.ErrorMessage>
        </Input.Root>,
      );

      const error = screen.getByText('Username is required');
      expect(error).toHaveClass('custom-error');
    });

    it('throws error when used outside Input.Root', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<Input.ErrorMessage>Error</Input.ErrorMessage>);
      }).toThrow('Input compound components must be used within Input.Root');

      jest.restoreAllMocks();
    });
  });

  describe('Component Display Names', () => {
    it('has correct display names', () => {
      expect(Input.Root.displayName).toBe('Input.Root');
      expect(Input.Field.displayName).toBe('Input.Field');
      expect(Input.Label.displayName).toBe('Input.Label');
      expect(Input.Description.displayName).toBe('Input.Description');
      expect(Input.ErrorMessage.displayName).toBe('Input.ErrorMessage');
    });
  });
});
