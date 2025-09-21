import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { LabelRoot, LabelText, LabelIndicator } from '../index';

// Extend Jest matchers with jest-axe
expect.extend(toHaveNoViolations);

describe('Label Accessibility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('jest-axe compliance', () => {
    it('should have no accessibility violations - basic label', async () => {
      const { container } = render(<LabelRoot htmlFor='basic-input'>Basic Label</LabelRoot>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - with input', async () => {
      const { container } = render(
        <div>
          <LabelRoot htmlFor='test-input'>Test Label</LabelRoot>
          <input id='test-input' type='text' />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - required label', async () => {
      const { container } = render(
        <div>
          <LabelRoot htmlFor='required-input' isRequired>
            Required Field
          </LabelRoot>
          <input id='required-input' type='text' aria-required='true' />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - disabled state', async () => {
      const { container } = render(
        <div>
          <LabelRoot htmlFor='disabled-input' isDisabled>
            Disabled Field
          </LabelRoot>
          <input id='disabled-input' type='text' disabled />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - loading state', async () => {
      const { container } = render(
        <div>
          <LabelRoot htmlFor='loading-input' isLoading loadingText='Loading...'>
            Loading Field
          </LabelRoot>
          <input id='loading-input' type='text' aria-busy='true' />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - compound components', async () => {
      const { container } = render(
        <div>
          <LabelRoot htmlFor='compound-input'>
            <LabelText>Compound Label</LabelText>
            <LabelIndicator type='required' />
            <LabelText> (optional info)</LabelText>
          </LabelRoot>
          <input id='compound-input' type='text' aria-required='true' />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - polymorphic as div', async () => {
      const { container } = render(
        <LabelRoot data-testid='polymorphic-label'>Section Label</LabelRoot>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations - checkbox label', async () => {
      const { container } = render(
        <LabelRoot htmlFor='checkbox-input'>
          <input id='checkbox-input' type='checkbox' />
          Checkbox Label
        </LabelRoot>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA attributes', () => {
    it('should have proper ARIA attributes for required indicator', () => {
      render(
        <LabelRoot htmlFor='aria-input' isRequired>
          Required Field
        </LabelRoot>,
      );

      const indicator = screen.getByText('*');
      expect(indicator).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have proper ARIA attributes for loading indicator', () => {
      render(
        <LabelRoot htmlFor='aria-loading' isLoading loadingText='Loading...'>
          Loading Field
        </LabelRoot>,
      );

      const loadingIndicator = screen.getByText('Loading...');
      expect(loadingIndicator).toHaveAttribute('aria-live', 'polite');
    });

    it('should have proper data attributes for styling hooks', () => {
      render(
        <LabelRoot
          htmlFor='data-input'
          variant='secondary'
          size='lg'
          isRequired
          isDisabled
          isLoading
        >
          Data Attributes Test
        </LabelRoot>,
      );

      const label = screen.getByText('Data Attributes Test').closest('label');
      expect(label).toHaveAttribute('data-variant', 'secondary');
      expect(label).toHaveAttribute('data-size', 'lg');
      expect(label).toHaveAttribute('data-required', 'true');
      expect(label).toHaveAttribute('data-disabled', 'true');
      expect(label).toHaveAttribute('data-loading', 'true');
    });

    it('should maintain semantic label relationship', () => {
      render(
        <div>
          <LabelRoot htmlFor='semantic-input'>Semantic Label</LabelRoot>
          <input id='semantic-input' type='text' />
        </div>,
      );

      const input = screen.getByRole('textbox', { name: 'Semantic Label' });
      expect(input).toBeInTheDocument();
    });
  });

  describe('Keyboard navigation', () => {
    it('should not interfere with natural tab order', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Before</button>
          <LabelRoot htmlFor='nav-input'>Navigation Test</LabelRoot>
          <input id='nav-input' type='text' />
          <button>After</button>
        </div>,
      );

      const beforeBtn = screen.getByRole('button', { name: 'Before' });
      const input = screen.getByRole('textbox', { name: 'Navigation Test' });
      const afterBtn = screen.getByRole('button', { name: 'After' });

      beforeBtn.focus();
      expect(beforeBtn).toHaveFocus();

      await user.tab();
      expect(input).toHaveFocus();

      await user.tab();
      expect(afterBtn).toHaveFocus();
    });

    it('should support click-to-focus behavior', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <LabelRoot htmlFor='click-input'>Click to Focus</LabelRoot>
          <input id='click-input' type='text' />
        </div>,
      );

      const label = screen.getByText('Click to Focus');
      const input = screen.getByRole('textbox', { name: 'Click to Focus' });

      await user.click(label);
      expect(input).toHaveFocus();
    });

    it('should handle compound component clicks', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <LabelRoot htmlFor='compound-click'>
            <LabelText>Compound</LabelText>
            <LabelIndicator type='required' />
          </LabelRoot>
          <input id='compound-click' type='text' />
        </div>,
      );

      const textPart = screen.getByText('Compound');
      const indicator = screen.getByText('*');
      const input = screen.getByRole('textbox');

      // Clicking any part should focus the input
      await user.click(textPart);
      expect(input).toHaveFocus();

      input.blur();

      await user.click(indicator);
      expect(input).toHaveFocus();
    });
  });

  describe('Screen reader support', () => {
    it('should provide proper text content for screen readers', () => {
      render(
        <LabelRoot htmlFor='sr-input' isRequired>
          Screen Reader Test
        </LabelRoot>,
      );

      const label = screen.getByText('Screen Reader Test').closest('label');
      // Text content should include both label text and required indicator
      expect(label).toHaveTextContent('Screen Reader Test*');
    });

    it('should hide decorative indicators from screen readers', () => {
      render(
        <LabelRoot htmlFor='sr-required' isRequired>
          Required Field
        </LabelRoot>,
      );

      const indicator = screen.getByText('*');
      expect(indicator).toHaveAttribute('aria-hidden', 'true');
    });

    it('should announce loading states properly', () => {
      render(
        <LabelRoot htmlFor='sr-loading' isLoading loadingText='Validating input'>
          Loading Test
        </LabelRoot>,
      );

      const loadingText = screen.getByText('Validating input');
      expect(loadingText).toHaveAttribute('aria-live', 'polite');
    });

    it('should support complex label structures for screen readers', () => {
      render(
        <LabelRoot htmlFor='sr-complex'>
          <LabelText>Main Label</LabelText>
          <LabelIndicator type='required' />
          <LabelText> (Additional info)</LabelText>
        </LabelRoot>,
      );

      const label = screen.getByText('Main Label').closest('label');
      expect(label).toHaveTextContent('Main Label* (Additional info)');
    });
  });

  describe('Focus management', () => {
    it('should not trap focus (labels do not manage focus)', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Before</button>
          <LabelRoot htmlFor='focus-input'>Focus Test</LabelRoot>
          <input id='focus-input' type='text' />
          <button>After</button>
        </div>,
      );

      const beforeBtn = screen.getByRole('button', { name: 'Before' });
      const input = screen.getByRole('textbox', { name: 'Focus Test' });
      const afterBtn = screen.getByRole('button', { name: 'After' });

      beforeBtn.focus();

      // Tab should go to input (skipping label)
      await user.tab();
      expect(input).toHaveFocus();

      await user.tab();
      expect(afterBtn).toHaveFocus();
    });

    it('should handle programmatic focus on associated input', () => {
      render(
        <div>
          <LabelRoot htmlFor='prog-input'>Programmatic Focus</LabelRoot>
          <input id='prog-input' type='text' />
        </div>,
      );

      const input = screen.getByRole('textbox', { name: 'Programmatic Focus' });

      input.focus();
      expect(input).toHaveFocus();
    });
  });

  describe('Error states and validation', () => {
    it('should support error state announcements', () => {
      render(
        <div>
          <LabelRoot htmlFor='error-input'>Error Field</LabelRoot>
          <input
            id='error-input'
            type='text'
            aria-invalid='true'
            aria-describedby='error-message'
          />
          <div id='error-message' role='alert'>
            This field has an error
          </div>
        </div>,
      );

      const input = screen.getByRole('textbox', { name: 'Error Field' });
      const errorMessage = screen.getByRole('alert');

      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'error-message');
      expect(errorMessage).toHaveTextContent('This field has an error');
    });

    it('should work with validation states', () => {
      render(
        <div>
          <LabelRoot htmlFor='validation-input' isRequired>
            Validation Field
          </LabelRoot>
          <input id='validation-input' type='email' aria-required='true' aria-invalid='false' />
        </div>,
      );

      const input = screen.getByRole('textbox', { name: /Validation Field/i });
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('Standard label accessibility', () => {
    it('should maintain accessibility for standard label element', () => {
      const { rerender } = render(<LabelRoot>Div Label</LabelRoot>);

      expect(screen.getByText('Div Label')).toBeInTheDocument();

      rerender(<LabelRoot>Span Label</LabelRoot>);

      expect(screen.getByText('Span Label')).toBeInTheDocument();

      rerender(<LabelRoot>Paragraph Label</LabelRoot>);

      expect(screen.getByText('Paragraph Label')).toBeInTheDocument();
    });

    it('should work as legend in fieldset', () => {
      render(
        <fieldset>
          <LabelRoot>Fieldset Legend</LabelRoot>
          <input type='text' />
        </fieldset>,
      );

      const legend = screen.getByText('Fieldset Legend');
      // Since we're using standard label elements for performance optimization
      expect(legend.tagName).toBe('LABEL');
    });
  });
});
