import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input, InputField, InputLabel, InputDescription, InputErrorMessage } from '../index';

describe('Input', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Simple Usage (Default Behavior)', () => {
    it('renders as simple input with default behavior', () => {
      render(<InputField placeholder='Enter text' />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    it('renders as simple textarea when as="textarea"', () => {
      render(<InputField as='textarea' placeholder='Enter message' />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveAttribute('placeholder', 'Enter message');
    });

    it('handles simple input interactions', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<InputField placeholder='Enter text' onChange={onChange} />);

      const input = screen.getByRole('textbox');

      await user.type(input, 'Hello');

      expect(onChange).toHaveBeenCalled();
      expect(input).toHaveValue('Hello');
    });

    it('renders simple input without wrapper div', () => {
      render(<InputField data-testid='simple-input' />);

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

  describe('Input (Root)', () => {
    it('renders with default props', () => {
      render(
        <Input>
          <InputField />
        </Input>,
      );

      const root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).toBeInTheDocument();
      expect(root).not.toHaveAttribute('data-invalid');
      expect(root).not.toHaveAttribute('data-disabled');
      expect(root).not.toHaveAttribute('data-required');
    });

    it('renders with invalid state', () => {
      render(
        <Input isInvalid>
          <InputField />
        </Input>,
      );

      const root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).toHaveAttribute('data-invalid', '');
    });

    it('renders with disabled state', () => {
      render(
        <Input disabled>
          <InputField />
        </Input>,
      );

      const root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).toHaveAttribute('data-disabled', '');
    });

    it('renders with required state', () => {
      render(
        <Input required>
          <InputField />
        </Input>,
      );

      const root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).toHaveAttribute('data-required', '');
    });

    it('updates state when props change', () => {
      const { rerender } = render(
        <Input isInvalid={false}>
          <InputField />
        </Input>,
      );

      let root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).not.toHaveAttribute('data-invalid');

      rerender(
        <Input isInvalid={true}>
          <InputField />
        </Input>,
      );

      root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).toHaveAttribute('data-invalid', '');
    });

    it('passes through additional props', () => {
      render(
        <Input className='custom-class' data-testid='input-root'>
          <InputField />
        </Input>,
      );

      const root = screen.getByTestId('input-root');
      expect(root).toHaveClass('custom-class');
      expect(root).toHaveAttribute('data-spar-input');
    });

    it('Input alias works the same as Input', () => {
      render(
        <Input>
          <InputField />
        </Input>,
      );

      const root = screen.getByRole('textbox').closest('[data-spar-input]');
      expect(root).toBeInTheDocument();
    });
  });

  describe('InputField', () => {
    it('renders as input by default', () => {
      render(
        <Input>
          <InputField />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field.tagName).toBe('INPUT');
      expect(field).toHaveAttribute('type', 'text');
    });

    it('renders with custom type', () => {
      render(
        <Input>
          <InputField type='email' />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('type', 'email');
    });

    it('renders as textarea when specified', () => {
      render(
        <Input>
          <InputField as='textarea' />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field.tagName).toBe('TEXTAREA');
      expect(field).not.toHaveAttribute('type');
    });

    it('applies disabled state from context', () => {
      render(
        <Input disabled>
          <InputField />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toBeDisabled();
    });

    it('applies required state from context', () => {
      render(
        <Input required>
          <InputField />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toBeRequired();
    });

    it('applies invalid state from context', () => {
      render(
        <Input isInvalid>
          <InputField />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    it('handles focus and blur events', async () => {
      const user = userEvent.setup();
      const onFocus = jest.fn();
      const onBlur = jest.fn();

      render(
        <Input>
          <InputField onFocus={onFocus} onBlur={onBlur} />
        </Input>,
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
        <Input>
          <InputField onChange={onChange} />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      await user.type(field, 'hello');

      expect(onChange).toHaveBeenCalledTimes(5); // One call per character
      expect(field).toHaveValue('hello');
    });

    it('passes through additional props', () => {
      render(
        <Input>
          <InputField placeholder='Enter text' className='custom-input' />
        </Input>,
      );

      const field = screen.getByRole('textbox');
      expect(field).toHaveAttribute('placeholder', 'Enter text');
      expect(field).toHaveClass('custom-input');
      expect(field).toHaveAttribute('data-spar-input-field');
    });

    it('renders as standalone input when used outside Input', () => {
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
        <Input>
          <InputLabel>Username</InputLabel>
          <InputField />
        </Input>,
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
        <Input>
          <InputLabel className='custom-label'>Username</InputLabel>
          <InputField />
        </Input>,
      );

      const label = screen.getByText('Username');
      expect(label).toHaveClass('custom-label');
    });

    it('throws error when used outside Input', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<InputLabel>Username</InputLabel>);
      }).toThrow('Input compound components must be used within Input');

      jest.restoreAllMocks();
    });
  });

  describe('InputDescription', () => {
    it('renders and associates with field when valid', () => {
      render(
        <Input>
          <InputField />
          <InputDescription>Enter your username</InputDescription>
        </Input>,
      );

      const description = screen.getByText('Enter your username');
      const field = screen.getByRole('textbox');

      expect(description).toHaveAttribute('data-spar-input-description');
      expect(field).toHaveAttribute('aria-describedby', description.id);
    });

    it('passes through additional props', () => {
      render(
        <Input>
          <InputField />
          <InputDescription className='custom-description'>Enter your username</InputDescription>
        </Input>,
      );

      const description = screen.getByText('Enter your username');
      expect(description).toHaveClass('custom-description');
    });

    it('throws error when used outside Input', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<InputDescription>Help text</InputDescription>);
      }).toThrow('Input compound components must be used within Input');

      jest.restoreAllMocks();
    });
  });

  describe('InputErrorMessage', () => {
    it('renders when input is invalid', () => {
      render(
        <Input isInvalid>
          <InputField />
          <InputErrorMessage>Username is required</InputErrorMessage>
        </Input>,
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
        <Input isInvalid={false}>
          <InputField />
          <InputErrorMessage>Username is required</InputErrorMessage>
        </Input>,
      );

      const error = screen.queryByText('Username is required');
      expect(error).not.toBeInTheDocument();
    });

    it('updates visibility when invalid state changes', () => {
      const { rerender } = render(
        <Input isInvalid={false}>
          <InputField />
          <InputErrorMessage>Username is required</InputErrorMessage>
        </Input>,
      );

      expect(screen.queryByText('Username is required')).not.toBeInTheDocument();

      rerender(
        <Input isInvalid={true}>
          <InputField />
          <InputErrorMessage>Username is required</InputErrorMessage>
        </Input>,
      );

      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });

    it('passes through additional props when visible', () => {
      render(
        <Input isInvalid>
          <InputField />
          <InputErrorMessage className='custom-error'>Username is required</InputErrorMessage>
        </Input>,
      );

      const error = screen.getByText('Username is required');
      expect(error).toHaveClass('custom-error');
    });

    it('throws error when used outside Input', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<InputErrorMessage>Error</InputErrorMessage>);
      }).toThrow('Input compound components must be used within Input');

      jest.restoreAllMocks();
    });
  });

  describe('Component Display Names', () => {
    it('has correct display names', () => {
      expect(Input.displayName).toBe('Input');
      expect(InputField.displayName).toBe('InputField');
      expect(InputLabel.displayName).toBe('InputLabel');
      expect(InputDescription.displayName).toBe('InputDescription');
      expect(InputErrorMessage.displayName).toBe('InputErrorMessage');
    });
  });
});
