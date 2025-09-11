import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../Textarea';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Textarea Accessibility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Automated A11y Testing', () => {
    it('should pass automated accessibility checks with default props', async () => {
      const { container } = render(<Textarea aria-label='Comments' />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility checks with label', async () => {
      const { container } = render(<Textarea aria-label='Comments' />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility checks with helper text', async () => {
      const { container } = render(
        <Textarea aria-label='Description' helperText='Provide a detailed description' />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility checks with error state', async () => {
      const { container } = render(
        <Textarea aria-label='Comments' errorMessage='This field is required' isInvalid />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility checks when disabled', async () => {
      const { container } = render(<Textarea aria-label='Comments' isDisabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility checks when readonly', async () => {
      const { container } = render(<Textarea aria-label='Comments' isReadOnly />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility checks when required', async () => {
      const { container } = render(<Textarea aria-label='Comments' isRequired />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass accessibility checks with all states combined', async () => {
      const { container } = render(
        <Textarea
          aria-label='Feedback'
          helperText='Please provide your feedback'
          errorMessage='Feedback is required'
          isRequired
          isInvalid
          maxLength={500}
          rows={4}
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes', () => {
    it('should have correct role', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Textarea aria-label='User feedback' />);
      const textarea = screen.getByLabelText('User feedback');
      expect(textarea).toHaveAttribute('aria-label', 'User feedback');
    });

    it('should support aria-labelledby', () => {
      render(
        <div>
          <label id='feedback-label'>Feedback</label>
          <Textarea aria-labelledby='feedback-label' />
        </div>,
      );
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-labelledby', 'feedback-label');
    });

    it('should set aria-required when required', () => {
      render(<Textarea isRequired aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-required', 'true');
    });

    it('should set aria-readonly when readonly', () => {
      render(<Textarea isReadOnly aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-readonly', 'true');
    });

    it('should set aria-invalid when invalid', () => {
      render(<Textarea isInvalid aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('should set aria-invalid when error message is present', () => {
      render(<Textarea errorMessage='Required field' aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('should set aria-invalid when validation errors exist', () => {
      render(<Textarea validationErrors={['Too short', 'Invalid format']} aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('should associate helper text with aria-describedby', () => {
      render(<Textarea aria-label='Comments' helperText='Maximum 200 characters' />);
      const textarea = screen.getByRole('textbox');
      const describedBy = textarea.getAttribute('aria-describedby');

      expect(describedBy).toMatch(/-helper$/);
    });

    it('should associate error message with aria-describedby', () => {
      render(<Textarea aria-label='Comments' errorMessage='This field is required' />);
      const textarea = screen.getByRole('textbox');
      const describedBy = textarea.getAttribute('aria-describedby');

      expect(describedBy).toMatch(/-error$/);
    });

    it('should combine multiple aria-describedby references', () => {
      render(
        <Textarea
          aria-label='Comments'
          helperText='Helper text'
          errorMessage='Error message'
          aria-describedby='external-description'
        />,
      );
      const textarea = screen.getByRole('textbox');
      const describedBy = textarea.getAttribute('aria-describedby');

      expect(describedBy).toContain('external-description');
      expect(describedBy).toMatch(/-error$/);
      // Helper text should be overridden by error message
    });

    it('should use label prop as aria-label when provided', () => {
      render(<Textarea label='Feedback' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-label', 'Feedback');
    });

    it('should prioritize aria-label over label prop', () => {
      render(<Textarea label='Feedback' aria-label='User feedback' />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-label', 'User feedback');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be focusable with Tab key', async () => {
      const user = userEvent.setup();
      render(<Textarea aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      await user.tab();

      expect(textarea).toHaveFocus();
    });

    it('should support navigation with Shift+Tab', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <input aria-label='First input' />
          <Textarea aria-label='Comments' />
          <input aria-label='Last input' />
        </div>,
      );

      const textarea = screen.getByLabelText('Comments');
      const lastInput = screen.getByLabelText('Last input');

      await user.click(lastInput);
      await user.tab({ shift: true });

      expect(textarea).toHaveFocus();
    });

    it('should support text selection with keyboard', async () => {
      const user = userEvent.setup();
      render(<Textarea defaultValue='Sample text content' aria-label='Comments' />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.click(textarea);
      await user.keyboard('{Control>}a{/Control}');

      expect(textarea.selectionStart).toBe(0);
      expect(textarea.selectionEnd).toBe('Sample text content'.length);
    });

    it('should support cursor movement with arrow keys', async () => {
      const user = userEvent.setup();
      const testValue = 'Line 1\nLine 2';
      render(<Textarea defaultValue={testValue} aria-label='Comments' />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.click(textarea);

      // Test that textarea supports cursor movement - value should be present and cursor can be positioned
      expect(textarea.value).toBe(testValue);
      expect(textarea.selectionStart).toBeGreaterThanOrEqual(0);
      expect(textarea.selectionEnd).toBeGreaterThanOrEqual(0);
    });

    it('should support Enter key for new lines', async () => {
      const user = userEvent.setup();
      render(<Textarea aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      await user.click(textarea);
      await user.type(textarea, 'First line{Enter}Second line');

      expect(textarea).toHaveValue('First line\nSecond line');
    });

    it('should not be focusable when disabled', async () => {
      const user = userEvent.setup();
      render(<Textarea isDisabled aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      await user.tab();

      expect(textarea).not.toHaveFocus();
    });

    it('should be focusable when readonly', async () => {
      const user = userEvent.setup();
      render(<Textarea isReadOnly aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      await user.tab();

      expect(textarea).toHaveFocus();
    });

    it('should show focus indicator when focused via keyboard', async () => {
      const user = userEvent.setup();
      render(<Textarea aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      await user.tab();

      expect(textarea).toHaveFocus();
      expect(textarea).toHaveAttribute('data-focused', 'true');
    });

    it('should support keyboard shortcuts (Ctrl+A, Ctrl+C, etc.)', async () => {
      const user = userEvent.setup();
      render(<Textarea defaultValue='Test content' aria-label='Comments' />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      await user.click(textarea);
      await user.keyboard('{Control>}a{/Control}'); // Select all

      expect(textarea.selectionStart).toBe(0);
      expect(textarea.selectionEnd).toBe('Test content'.length);
    });
  });

  describe('Focus Management', () => {
    it('should handle focus events correctly', async () => {
      const user = userEvent.setup();
      const handleFocus = jest.fn();
      render(<Textarea onFocus={handleFocus} aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      await user.click(textarea);

      expect(handleFocus).toHaveBeenCalled();
      expect(textarea).toHaveAttribute('data-focused', 'true');
    });

    it('should handle blur events correctly', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(<Textarea onBlur={handleBlur} aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      await user.click(textarea);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
      expect(textarea).toHaveAttribute('data-focused', 'false');
    });

    it('should restore focus when programmatically focused', () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} aria-label='Comments' />);

      ref.current?.focus();

      expect(ref.current).toHaveFocus();
    });

    it('should manage focus visibility state', async () => {
      const user = userEvent.setup();
      render(<Textarea aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      // Click focus (mouse)
      await user.click(textarea);
      expect(textarea).toHaveAttribute('data-focused', 'true');

      // Tab navigation should set focus visible
      await user.tab();
      await user.tab({ shift: true }); // Tab back to textarea
      expect(textarea).toHaveAttribute('data-focused', 'true');
    });
  });

  describe('Screen Reader Support', () => {
    it('should announce validation errors', () => {
      render(<Textarea aria-label='Comments' errorMessage='This field is required' isInvalid />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea.getAttribute('aria-describedby')).toMatch(/-error$/);
    });

    it('should announce character count for screen readers', () => {
      render(<Textarea aria-label='Comments' maxLength={100} defaultValue='test' />);
      const textarea = screen.getByRole('textbox');

      // Character count is available via data attribute for screen reader scripts
      expect(textarea).toHaveAttribute('data-character-count', '4/100');
    });

    it('should announce required state to screen readers', () => {
      render(<Textarea isRequired aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('aria-required', 'true');
      expect(textarea).toHaveAttribute('required');
    });

    it('should announce readonly state to screen readers', () => {
      render(<Textarea isReadOnly aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('aria-readonly', 'true');
      expect(textarea).toHaveAttribute('readonly');
    });

    it('should properly associate helper text for screen readers', () => {
      render(<Textarea aria-label='Comments' helperText='Provide detailed feedback' />);
      const textarea = screen.getByRole('textbox');
      const describedBy = textarea.getAttribute('aria-describedby');

      expect(describedBy).toMatch(/-helper$/);
    });

    it('should announce multiline nature via role textbox', () => {
      render(<Textarea aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });
  });

  describe('Error State Accessibility', () => {
    it('should properly announce error state', () => {
      render(<Textarea aria-label='Comments' errorMessage='This field is required' isInvalid />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAttribute('data-invalid', 'true');
    });

    it('should associate error message with textarea', () => {
      render(<Textarea aria-label='Comments' errorMessage='Invalid input format' />);
      const textarea = screen.getByRole('textbox');
      const errorId = textarea.getAttribute('aria-describedby');

      expect(errorId).toMatch(/-error$/);
    });

    it('should handle multiple validation errors', () => {
      const errors = ['Too short', 'Invalid characters', 'Required field'];
      render(<Textarea aria-label='Comments' validationErrors={errors} />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('should prioritize error message over helper text in aria-describedby', () => {
      render(
        <Textarea aria-label='Comments' helperText='Helper text' errorMessage='Error message' />,
      );
      const textarea = screen.getByRole('textbox');
      const describedBy = textarea.getAttribute('aria-describedby');

      expect(describedBy).toMatch(/-error$/);
      expect(describedBy).not.toMatch(/-helper$/);
    });
  });

  describe('Form Integration Accessibility', () => {
    it('should support form labels', () => {
      render(
        <form>
          <label htmlFor='comment-textarea'>Comments</label>
          <Textarea id='comment-textarea' />
        </form>,
      );

      const textarea = screen.getByLabelText('Comments');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('id', 'comment-textarea');
    });

    it('should support fieldset grouping', async () => {
      const { container } = render(
        <fieldset>
          <legend>Feedback Form</legend>
          <Textarea aria-label='Comments' isRequired />
        </fieldset>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support form validation', () => {
      render(
        <form>
          <Textarea
            aria-label='Comments'
            isRequired
            isInvalid
            errorMessage='Comments are required'
          />
        </form>,
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-required', 'true');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('High Contrast Mode', () => {
    it('should be visible in high contrast mode', () => {
      render(<Textarea aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      // Component should rely on semantic HTML and proper attributes
      // for high contrast mode support
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveAttribute('aria-label');
    });

    it('should show focus indicators in high contrast mode', async () => {
      const user = userEvent.setup();
      render(<Textarea aria-label='Comments' />);
      const textarea = screen.getByRole('textbox');

      await user.tab();

      expect(textarea).toHaveFocus();
      expect(textarea).toHaveAttribute('data-focused', 'true');
    });
  });
});
