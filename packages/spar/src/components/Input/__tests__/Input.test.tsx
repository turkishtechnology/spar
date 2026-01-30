import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Input,
  InputRoot,
  InputField,
  InputLabel,
  InputDescription,
  InputErrorMessage,
} from '../index';

describe('Input', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Simple Usage (Default Behavior)', () => {
    it('renders as simple input with default behavior', () => {
      render(<Input placeholder='Enter text' />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    it('renders as simple textarea when as="textarea"', () => {
      render(<Input as='textarea' placeholder='Enter message' />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveAttribute('placeholder', 'Enter message');
    });

    it('handles simple input interactions', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<Input placeholder='Enter text' onChange={onChange} />);

      const input = screen.getByRole('textbox');

      await user.type(input, 'Hello');

      expect(onChange).toHaveBeenCalled();
      expect(input).toHaveValue('Hello');
    });

    it('renders simple input without wrapper div', () => {
      render(<Input data-testid='simple-input' />);

      const input = screen.getByTestId('simple-input');

      // Should have spar data attribute directly on input (no wrapper)
      expect(input).toHaveAttribute('data-spar-input');

      // Should NOT have any wrapper with data-spar-input
      const wrapperDiv = input.closest('[data-spar-input]');
      expect(wrapperDiv).toBe(input); // The input itself should be the spar element

      // Should NOT have context-specific ID (standalone mode)
      expect(input).not.toHaveAttribute('id');
    });
  });

  describe('InputRoot', () => {
    it('renders with default props', () => {
      render(
        <InputRoot>
          <InputField />
        </InputRoot>,
      );

      const root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).toBeInTheDocument();
      expect(root).not.toHaveAttribute('data-invalid');
      expect(root).not.toHaveAttribute('data-disabled');
      expect(root).not.toHaveAttribute('data-required');
    });

    it('renders with invalid state', () => {
      render(
        <InputRoot isInvalid>
          <InputField />
        </InputRoot>,
      );

      const root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).toHaveAttribute('data-invalid', '');
    });

    it('renders with disabled state', () => {
      render(
        <InputRoot disabled>
          <InputField />
        </InputRoot>,
      );

      const root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).toHaveAttribute('data-disabled', '');
    });

    it('renders with required state', () => {
      render(
        <InputRoot required>
          <InputField />
        </InputRoot>,
      );

      const root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).toHaveAttribute('data-required', '');
    });

    it('updates state when props change', () => {
      const { rerender } = render(
        <InputRoot isInvalid={false}>
          <InputField />
        </InputRoot>,
      );

      let root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).not.toHaveAttribute('data-invalid');

      rerender(
        <InputRoot isInvalid={true}>
          <InputField />
        </InputRoot>,
      );

      root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).toHaveAttribute('data-invalid', '');
    });

    it('passes through additional props', () => {
      render(
        <InputRoot className='custom-class' data-testid='input-root'>
          <InputField />
        </InputRoot>,
      );

      const root = screen.getByTestId('input-root');
      expect(root).toHaveClass('custom-class');
      expect(root).toHaveAttribute('data-spar-input');
    });
  });

  describe('InputField', () => {
    it('renders as input by default', () => {
      render(
        <InputRoot>
          <InputField />
        </InputRoot>,
      );

      const field = screen.getByRole('textbox');
      expect(field.tagName).toBe('INPUT');
      expect(field).toHaveAttribute('type', 'text');
    });

    it('renders with custom type', () => {
      render(
        <InputRoot>
          <InputField type='email' />
        </InputRoot>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('type', 'email');
    });

    it('renders as textarea when specified', () => {
      render(
        <InputRoot>
          <InputField as='textarea' />
        </InputRoot>,
      );

      const field = screen.getByRole('textbox');
      expect(field.tagName).toBe('TEXTAREA');
      expect(field).not.toHaveAttribute('type');
    });

    it('applies disabled state from context', () => {
      render(
        <InputRoot disabled>
          <InputField />
        </InputRoot>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toBeDisabled();
    });

    it('applies required state from context', () => {
      render(
        <InputRoot required>
          <InputField />
        </InputRoot>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toBeRequired();
    });

    it('applies invalid state from context', () => {
      render(
        <InputRoot isInvalid>
          <InputField />
        </InputRoot>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    it('handles focus and blur events', async () => {
      const user = userEvent.setup();
      const onFocus = jest.fn();
      const onBlur = jest.fn();

      render(
        <InputRoot>
          <InputField onFocus={onFocus} onBlur={onBlur} />
        </InputRoot>,
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
        <InputRoot>
          <InputField onChange={onChange} />
        </InputRoot>,
      );

      const field = screen.getByRole('textbox');
      await user.type(field, 'hello');

      expect(onChange).toHaveBeenCalledTimes(5); // One call per character
      expect(field).toHaveValue('hello');
    });

    it('passes through additional props', () => {
      render(
        <InputRoot>
          <InputField placeholder='Enter text' className='custom-input' />
        </InputRoot>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('placeholder', 'Enter text');
      expect(field).toHaveClass('custom-input');
      expect(field).toHaveAttribute('data-spar-input-field');
    });

    it('renders as standalone input when used outside InputRoot', () => {
      render(<InputField data-testid='standalone-field' />);

      const field = screen.getByTestId('standalone-field');

      // Should render without errors (no context required)
      expect(field).toBeInTheDocument();
      expect(field).toHaveAttribute('data-spar-input');

      // Should not have context-specific attributes
      expect(field).not.toHaveAttribute('aria-labelledby');
      expect(field).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('InputLabel', () => {
    it('renders and associates with field', () => {
      render(
        <InputRoot>
          <InputLabel>Username</InputLabel>
          <InputField />
        </InputRoot>,
      );

      const label = screen.getByText('Username');
      const field = screen.getByRole('textbox');

      expect(label.tagName).toBe('LABEL');
      expect(label).toHaveAttribute('data-spar-input-label');
      expect(label).toHaveAttribute('for', field.id);
      expect(field).toHaveAttribute('aria-labelledby', label.id);
    });

    it('passes through additional props', () => {
      render(
        <InputRoot>
          <InputLabel className='custom-label'>Username</InputLabel>
          <InputField />
        </InputRoot>,
      );

      const label = screen.getByText('Username');
      expect(label).toHaveClass('custom-label');
    });

    it('throws error when used outside InputRoot', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<InputLabel>Username</InputLabel>);
      }).toThrow('Input compound components must be used within InputRoot');

      jest.restoreAllMocks();
    });
  });

  describe('InputDescription', () => {
    it('renders and associates with field when valid', () => {
      render(
        <InputRoot>
          <InputField />
          <InputDescription>Enter your username</InputDescription>
        </InputRoot>,
      );

      const description = screen.getByText('Enter your username');
      const field = screen.getByRole('textbox');

      expect(description).toHaveAttribute('data-spar-input-description');
      expect(field).toHaveAttribute('aria-describedby', description.id);
    });

    it('passes through additional props', () => {
      render(
        <InputRoot>
          <InputField />
          <InputDescription className='custom-description'>Enter your username</InputDescription>
        </InputRoot>,
      );

      const description = screen.getByText('Enter your username');
      expect(description).toHaveClass('custom-description');
    });

    it('throws error when used outside InputRoot', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<InputDescription>Help text</InputDescription>);
      }).toThrow('Input compound components must be used within InputRoot');

      jest.restoreAllMocks();
    });
  });

  describe('InputErrorMessage', () => {
    it('renders when input is invalid', () => {
      render(
        <InputRoot isInvalid>
          <InputField />
          <InputErrorMessage>Username is required</InputErrorMessage>
        </InputRoot>,
      );

      const error = screen.getByText('Username is required');
      const field = screen.getByRole('textbox');

      expect(error).toBeInTheDocument();
      expect(error).toHaveAttribute('role', 'alert');
      expect(error).toHaveAttribute('data-spar-input-error');
      expect(field).toHaveAttribute('aria-describedby', error.id);
    });

    it('does not render when input is valid', () => {
      render(
        <InputRoot isInvalid={false}>
          <InputField />
          <InputErrorMessage>Username is required</InputErrorMessage>
        </InputRoot>,
      );

      const error = screen.queryByText('Username is required');
      expect(error).not.toBeInTheDocument();
    });

    it('updates visibility when invalid state changes', () => {
      const { rerender } = render(
        <InputRoot isInvalid={false}>
          <InputField />
          <InputErrorMessage>Username is required</InputErrorMessage>
        </InputRoot>,
      );

      expect(screen.queryByText('Username is required')).not.toBeInTheDocument();

      rerender(
        <InputRoot isInvalid={true}>
          <InputField />
          <InputErrorMessage>Username is required</InputErrorMessage>
        </InputRoot>,
      );

      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });

    it('passes through additional props when visible', () => {
      render(
        <InputRoot isInvalid>
          <InputField />
          <InputErrorMessage className='custom-error'>Username is required</InputErrorMessage>
        </InputRoot>,
      );

      const error = screen.getByText('Username is required');
      expect(error).toHaveClass('custom-error');
    });

    it('throws error when used outside InputRoot', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<InputErrorMessage>Error</InputErrorMessage>);
      }).toThrow('Input compound components must be used within InputRoot');

      jest.restoreAllMocks();
    });
  });

  describe('Component Display Names', () => {
    it('has correct display names', () => {
      expect(InputRoot.displayName).toBe('InputRoot');
      expect(InputField.displayName).toBe('InputField');
      expect(InputLabel.displayName).toBe('InputLabel');
      expect(InputDescription.displayName).toBe('InputDescription');
      expect(InputErrorMessage.displayName).toBe('InputErrorMessage');
    });
  });
});
