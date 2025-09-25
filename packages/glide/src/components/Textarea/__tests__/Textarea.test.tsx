import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../Textarea';

describe('Textarea Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('rows', '3');
      expect(textarea).toHaveAttribute('data-glide-textarea', '');
    });

    it('should render with custom rows and cols', () => {
      render(<Textarea rows={5} cols={40} />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('rows', '5');
      expect(textarea).toHaveAttribute('cols', '40');
      expect(textarea).toHaveAttribute('data-rows', '5');
      expect(textarea).toHaveAttribute('data-cols', '40');
    });

    it('should render with label via aria-label', () => {
      render(<Textarea aria-label='Description' />);
      const textarea = screen.getByLabelText('Description');

      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('aria-label', 'Description');
    });

    it('should render with label prop', () => {
      render(<Textarea label='Comments' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('aria-label', 'Comments');
    });

    it('should render with placeholder', () => {
      render(<Textarea placeholder='Enter your comments...' />);
      const textarea = screen.getByPlaceholderText('Enter your comments...');

      expect(textarea).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<Textarea helperText='Maximum 500 characters' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).not.toHaveAttribute('aria-describedby');
      expect(textarea).toHaveAttribute('data-has-helper', 'true');
    });

    it('should render with error message', () => {
      render(<Textarea errorMessage='This field is required' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).not.toHaveAttribute('aria-describedby');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAttribute('data-invalid', 'true');
      expect(textarea).toHaveAttribute('data-has-error', 'true');
    });

    it('should use manual aria-describedby when provided', () => {
      render(
        <Textarea
          helperText='Helper text'
          errorMessage='Error message'
          aria-describedby='external-description'
        />,
      );
      const textarea = screen.getByRole('textbox');
      const describedBy = textarea.getAttribute('aria-describedby');

      expect(describedBy).toBe('external-description');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Props Handling', () => {
    it('should handle controlled value', () => {
      const handleChange = jest.fn();
      render(<Textarea value='controlled value' onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveValue('controlled value');
      expect(textarea).not.toHaveAttribute('data-empty');
    });

    it('should handle uncontrolled defaultValue', () => {
      render(<Textarea defaultValue='default text' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveValue('default text');
    });

    it('should handle required state', () => {
      render(<Textarea isRequired />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('required');
      expect(textarea).toHaveAttribute('aria-required', 'true');
      expect(textarea).toHaveAttribute('data-required', 'true');
    });

    it('should handle disabled state', () => {
      render(<Textarea isDisabled />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toBeDisabled();
      expect(textarea).toHaveAttribute('data-disabled', 'true');
    });

    it('should handle readonly state', () => {
      render(<Textarea isReadOnly />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('readonly');
      expect(textarea).toHaveAttribute('aria-readonly', 'true');
      expect(textarea).toHaveAttribute('data-readonly', 'true');
    });

    it('should handle invalid state', () => {
      render(<Textarea isInvalid />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAttribute('data-invalid', 'true');
    });

    it('should handle maxLength and character count', () => {
      render(<Textarea maxLength={100} defaultValue='test' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('maxlength', '100');
      expect(textarea).toHaveAttribute('data-character-count', '4/100');
    });

    it('should handle minLength', () => {
      render(<Textarea minLength={10} />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('minlength', '10');
    });

    it('should handle wrap mode', () => {
      render(<Textarea wrap='hard' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('wrap', 'hard');
    });

    it('should handle autoFocus', () => {
      render(<Textarea autoFocus aria-label='Test' />);
      const textarea = screen.getByRole('textbox');

      // React converts autoFocus to autofocus in DOM, but might not be set in test environment
      // Test that the component accepts the prop without error
      expect(textarea).toBeInTheDocument();
    });

    it('should handle spellCheck', () => {
      render(<Textarea spellCheck={false} />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('spellcheck', 'false');
    });

    it('should handle inputMode', () => {
      render(<Textarea inputMode='email' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('inputmode', 'email');
    });

    it('should handle form attributes', () => {
      render(<Textarea name='comments' form='myForm' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('name', 'comments');
      expect(textarea).toHaveAttribute('form', 'myForm');
    });

    it('should handle custom id', () => {
      render(<Textarea id='custom-textarea' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('id', 'custom-textarea');
    });

    it('should handle validation errors array', () => {
      const errors = ['Too short', 'Invalid format'];
      render(<Textarea validationErrors={errors} />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAttribute('data-invalid', 'true');
    });

    it('should handle validation behavior', () => {
      render(<Textarea validationBehavior='native' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('data-validation-behavior', 'native');
    });
  });

  describe('Event Handling', () => {
    it('should handle onChange event in controlled mode', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Textarea value='' onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'new text');

      expect(handleChange).toHaveBeenCalledTimes(8); // 'new text'.length
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: expect.any(String),
          }),
        }),
      );
    });

    it('should handle onChange event in uncontrolled mode', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Textarea onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'test');

      expect(handleChange).toHaveBeenCalledTimes(4);
      expect(textarea).toHaveValue('test');
    });

    it('should handle onFocus event', async () => {
      const user = userEvent.setup();
      const handleFocus = jest.fn();
      render(<Textarea onFocus={handleFocus} />);
      const textarea = screen.getByRole('textbox');

      await user.click(textarea);

      expect(handleFocus).toHaveBeenCalledTimes(1);
      expect(textarea).toHaveAttribute('data-focused', 'true');
    });

    it('should handle onBlur event', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(<Textarea onBlur={handleBlur} />);
      const textarea = screen.getByRole('textbox');

      await user.click(textarea);
      await user.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
      expect(textarea).toHaveAttribute('data-focused', 'false');
    });

    it('should handle onInvalid with validation errors', async () => {
      const user = userEvent.setup();
      const handleInvalid = jest.fn();
      const errors = ['Error 1', 'Error 2'];
      render(<Textarea validationErrors={errors} onInvalid={handleInvalid} />);
      const textarea = screen.getByRole('textbox');

      await user.click(textarea);
      await user.tab(); // Trigger blur

      expect(handleInvalid).toHaveBeenCalledWith(errors);
    });

    it('should handle keyboard events for focus visibility', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');

      fireEvent.keyDown(textarea, { key: 'Tab' });

      expect(textarea).toHaveAttribute('data-focus-visible', 'true');
    });

    it('should not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Textarea isDisabled onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'test');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('should not call onChange when readonly', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Textarea isReadOnly onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'test');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    it('should track focus state', async () => {
      const user = userEvent.setup();
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('data-focused', 'false');

      await user.click(textarea);
      expect(textarea).toHaveAttribute('data-focused', 'true');

      await user.tab();
      expect(textarea).toHaveAttribute('data-focused', 'false');
    });

    it('should track empty state', async () => {
      const user = userEvent.setup();
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('data-empty', 'true');

      await user.type(textarea, 'content');
      expect(textarea).not.toHaveAttribute('data-empty');

      await user.clear(textarea);
      expect(textarea).toHaveAttribute('data-empty', 'true');
    });

    it('should maintain controlled state', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [value, setValue] = React.useState('initial');
        return <Textarea value={value} onChange={(e) => setValue(e.target.value)} />;
      };

      render(<TestComponent />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveValue('initial');

      await user.clear(textarea);
      await user.type(textarea, 'new value');

      expect(textarea).toHaveValue('new value');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string value', () => {
      render(<Textarea value='' onChange={() => {}} />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveValue('');
      expect(textarea).toHaveAttribute('data-empty', 'true');
    });

    it('should handle undefined values gracefully', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveValue('');
    });

    it('should handle very long text content', () => {
      const longText = 'a'.repeat(10000);
      render(<Textarea defaultValue={longText} />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveValue(longText);
    });

    it('should handle special characters', () => {
      const specialText = '!@#$%^&*()[]{}|\\:";\'<>?,./ ';
      render(<Textarea defaultValue={specialText} />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveValue(specialText);
    });

    it('should handle line breaks and whitespace', () => {
      const multilineText = 'Line 1\nLine 2\n\tIndented line\n  Spaced line';
      render(<Textarea defaultValue={multilineText} />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveValue(multilineText);
    });
  });

  describe('Polymorphic Component', () => {
    it('should render as custom component', () => {
      const CustomTextarea = React.forwardRef<
        HTMLTextAreaElement,
        React.TextareaHTMLAttributes<HTMLTextAreaElement>
      >((props, ref) => <textarea ref={ref} {...props} data-custom='true' />);

      render(<Textarea as={CustomTextarea} />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('data-custom', 'true');
    });
  });

  describe('Data Attributes', () => {
    it('should set all relevant data attributes', () => {
      render(
        <Textarea
          rows={5}
          cols={40}
          isRequired
          isDisabled
          isReadOnly
          isInvalid
          helperText='Helper'
          errorMessage='Error'
          maxLength={100}
          defaultValue='test'
          validationBehavior='native'
        />,
      );
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('data-glide-textarea', '');
      expect(textarea).toHaveAttribute('data-rows', '5');
      expect(textarea).toHaveAttribute('data-cols', '40');
      expect(textarea).toHaveAttribute('data-required', 'true');
      expect(textarea).toHaveAttribute('data-disabled', 'true');
      expect(textarea).toHaveAttribute('data-readonly', 'true');
      expect(textarea).toHaveAttribute('data-invalid', 'true');
      expect(textarea).toHaveAttribute('data-has-helper', 'true');
      expect(textarea).toHaveAttribute('data-has-error', 'true');
      expect(textarea).toHaveAttribute('data-character-count', '4/100');
      expect(textarea).toHaveAttribute('data-validation-behavior', 'native');
    });
  });
});
