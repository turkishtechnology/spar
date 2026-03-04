import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Label } from '../Label';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Label Accessibility', () => {
  describe('Axe Compliance', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <div>
          <Label htmlFor='test-input'>Username</Label>
          <input id='test-input' type='text' />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with required state', async () => {
      const { container } = render(
        <div>
          <Label htmlFor='required-input' required>
            Required Field
          </Label>
          <input id='required-input' type='text' required />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with optional state', async () => {
      const { container } = render(
        <div>
          <Label htmlFor='optional-input' isOptional>
            Optional Field
          </Label>
          <input id='optional-input' type='text' />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with disabled state', async () => {
      const { container } = render(
        <div>
          <Label htmlFor='disabled-input' disabled>
            Disabled Field
          </Label>
          <input id='disabled-input' type='text' disabled />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with readOnly state', async () => {
      const { container } = render(
        <div>
          <Label htmlFor='readonly-input' readOnly>
            Read-Only Field
          </Label>
          <input id='readonly-input' type='text' readOnly />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with invalid state', async () => {
      const { container } = render(
        <div>
          <Label htmlFor='invalid-input' isInvalid>
            Invalid Field
          </Label>
          <input id='invalid-input' type='text' aria-invalid='true' />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with custom element', async () => {
      const { container } = render(
        <div>
          <Label as='span' id='custom-label'>
            Custom Label
          </Label>
          <input type='text' aria-labelledby='custom-label' />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with implicit association', async () => {
      const { container } = render(
        <Label>
          Email Address
          <input type='email' />
        </Label>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not have violations with complex content', async () => {
      const { container } = render(
        <div>
          <Label htmlFor='complex-input' required>
            <span>Field Name</span>
            <span aria-label='required'>*</span>
          </Label>
          <input id='complex-input' type='text' required />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Programmatic Associations', () => {
    it('creates proper association with htmlFor', () => {
      render(
        <div>
          <Label htmlFor='username-field'>Username</Label>
          <input id='username-field' type='text' />
        </div>,
      );

      const label = screen.getByText('Username');
      const input = screen.getByLabelText('Username');

      expect(label).toHaveAttribute('for', 'username-field');
      expect(input).toHaveAttribute('id', 'username-field');
    });

    it('supports implicit association with nested input', () => {
      render(
        <Label>
          Email
          <input type='email' name='email' />
        </Label>,
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('works with aria-labelledby for custom elements', () => {
      render(
        <div>
          <Label as='div' id='custom-label-id'>
            Custom Label
          </Label>
          <input type='text' aria-labelledby='custom-label-id' />
        </div>,
      );

      const input = screen.getByLabelText('Custom Label');
      expect(input).toHaveAttribute('aria-labelledby', 'custom-label-id');
    });

    it('associates with multiple controls using same htmlFor', () => {
      render(
        <div>
          <Label htmlFor='shared-input'>Shared Label</Label>
          <input id='shared-input' type='text' />
        </div>,
      );

      const input = screen.getByLabelText('Shared Label');
      expect(input).toHaveAttribute('id', 'shared-input');
    });
  });

  describe('Required Field Indication', () => {
    it('provides data-required for styling required fields', () => {
      render(
        <div>
          <Label htmlFor='required-field' required>
            Required Field
          </Label>
          <input id='required-field' type='text' required />
        </div>,
      );

      const label = screen.getByText('Required Field');
      expect(label).toHaveAttribute('data-required');
    });

    it('allows custom required indicators for screen readers', () => {
      render(
        <div>
          <Label htmlFor='custom-required' required>
            Field Name
            <span aria-label='required' className='required-indicator'>
              *
            </span>
          </Label>
          <input id='custom-required' type='text' required aria-required='true' />
        </div>,
      );

      const requiredIndicator = screen.getByLabelText('required');
      expect(requiredIndicator).toHaveTextContent('*');

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('supports visually hidden required text', () => {
      render(
        <div>
          <Label htmlFor='visually-hidden-required' required>
            Username
            <span className='sr-only'>(required)</span>
          </Label>
          <input id='visually-hidden-required' type='text' required />
        </div>,
      );

      const label = screen.getByText(/Username/);
      expect(label).toHaveAttribute('data-required');
      expect(screen.getByText('(required)')).toHaveClass('sr-only');
    });
  });

  describe('Optional Field Indication', () => {
    it('provides data-optional for styling optional fields', () => {
      render(
        <div>
          <Label htmlFor='optional-field' isOptional>
            Optional Field
          </Label>
          <input id='optional-field' type='text' />
        </div>,
      );

      const label = screen.getByText('Optional Field');
      expect(label).toHaveAttribute('data-optional');
    });

    it('allows custom optional indicators', () => {
      render(
        <div>
          <Label htmlFor='custom-optional' isOptional>
            Field Name
            <span className='optional-text'>(optional)</span>
          </Label>
          <input id='custom-optional' type='text' />
        </div>,
      );

      const label = screen.getByText('Field Name');
      expect(label).toHaveAttribute('data-optional');
      expect(screen.getByText('(optional)')).toHaveClass('optional-text');
    });
  });

  describe('Disabled State Communication', () => {
    it('provides data-disabled for styling disabled fields', () => {
      render(
        <div>
          <Label htmlFor='disabled-field' disabled>
            Disabled Field
          </Label>
          <input id='disabled-field' type='text' disabled />
        </div>,
      );

      const label = screen.getByText('Disabled Field');
      expect(label).toHaveAttribute('data-disabled');
    });

    it('works with aria-disabled on controls', () => {
      render(
        <div>
          <Label htmlFor='aria-disabled-field' disabled>
            Disabled Field
          </Label>
          <input id='aria-disabled-field' type='text' aria-disabled='true' />
        </div>,
      );

      const label = screen.getByText('Disabled Field');
      const input = screen.getByLabelText('Disabled Field');

      expect(label).toHaveAttribute('data-disabled');
      expect(input).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('ReadOnly State Communication', () => {
    it('provides data-readonly for styling read-only fields', () => {
      render(
        <div>
          <Label htmlFor='readonly-field' readOnly>
            Read-Only Field
          </Label>
          <input id='readonly-field' type='text' readOnly />
        </div>,
      );

      const label = screen.getByText('Read-Only Field');
      expect(label).toHaveAttribute('data-readonly');
    });

    it('works with aria-readonly on controls', () => {
      render(
        <div>
          <Label htmlFor='aria-readonly-field' readOnly>
            Read-Only Field
          </Label>
          <input id='aria-readonly-field' type='text' readOnly aria-readonly='true' />
        </div>,
      );

      const label = screen.getByText('Read-Only Field');
      const input = screen.getByLabelText('Read-Only Field');

      expect(label).toHaveAttribute('data-readonly');
      expect(input).toHaveAttribute('aria-readonly', 'true');
    });
  });

  describe('Invalid State Communication', () => {
    it('provides data-invalid for styling invalid fields', () => {
      render(
        <div>
          <Label htmlFor='invalid-field' isInvalid>
            Invalid Field
          </Label>
          <input id='invalid-field' type='text' aria-invalid='true' />
        </div>,
      );

      const label = screen.getByText('Invalid Field');
      expect(label).toHaveAttribute('data-invalid');
    });

    it('works with aria-invalid on controls', () => {
      render(
        <div>
          <Label htmlFor='aria-invalid-field' isInvalid>
            Invalid Field
          </Label>
          <input id='aria-invalid-field' type='text' aria-invalid='true' />
        </div>,
      );

      const label = screen.getByText('Invalid Field');
      const input = screen.getByLabelText('Invalid Field');

      expect(label).toHaveAttribute('data-invalid');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Clickable Labels', () => {
    it('focuses associated input when label is clicked', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Label htmlFor='clickable-input'>Clickable Label</Label>
          <input id='clickable-input' type='text' />
        </div>,
      );

      const label = screen.getByText('Clickable Label');
      const input = screen.getByLabelText('Clickable Label');

      expect(input).not.toHaveFocus();

      await user.click(label);

      expect(input).toHaveFocus();
    });

    it('activates radio button when label is clicked', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Label htmlFor='radio-input'>Select Option</Label>
          <input id='radio-input' type='radio' />
        </div>,
      );

      const label = screen.getByText('Select Option');
      const radio = screen.getByLabelText('Select Option');

      expect(radio).not.toBeChecked();

      await user.click(label);

      expect(radio).toBeChecked();
    });

    it('toggles checkbox when label is clicked', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Label htmlFor='checkbox-input'>Accept Terms</Label>
          <input id='checkbox-input' type='checkbox' />
        </div>,
      );

      const label = screen.getByText('Accept Terms');
      const checkbox = screen.getByLabelText('Accept Terms');

      expect(checkbox).not.toBeChecked();

      await user.click(label);

      expect(checkbox).toBeChecked();

      await user.click(label);

      expect(checkbox).not.toBeChecked();
    });

    it('does not interfere with disabled controls', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <div>
          <Label htmlFor='disabled-checkbox' disabled>
            Disabled Option
          </Label>
          <input id='disabled-checkbox' type='checkbox' disabled onClick={handleClick} />
        </div>,
      );

      const label = screen.getByText('Disabled Option');
      const checkbox = screen.getByLabelText('Disabled Option');

      await user.click(label);

      // Checkbox should not be checked or clicked
      expect(checkbox).not.toBeChecked();
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Screen Reader Support', () => {
    it('provides clear text content for screen readers', () => {
      render(
        <div>
          <Label htmlFor='sr-input'>Username</Label>
          <input id='sr-input' type='text' />
        </div>,
      );

      const label = screen.getByText('Username');
      expect(label).toHaveTextContent('Username');
    });

    it('supports screen reader only text', () => {
      render(
        <div>
          <Label htmlFor='sr-only-input'>
            <span className='sr-only'>Enter your</span>
            Email
          </Label>
          <input id='sr-only-input' type='email' />
        </div>,
      );

      expect(screen.getByText('Enter your')).toHaveClass('sr-only');
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('announces required state through content', () => {
      render(
        <div>
          <Label htmlFor='required-sr' required>
            Password
            <span className='sr-only'>(required field)</span>
          </Label>
          <input id='required-sr' type='password' required />
        </div>,
      );

      const label = screen.getByText(/Password/);
      expect(label).toHaveAttribute('data-required');
      expect(screen.getByText('(required field)')).toBeInTheDocument();
    });

    it('provides context for complex form fields', () => {
      render(
        <div>
          <Label htmlFor='complex-field'>
            <span>Credit Card Number</span>
            <span className='helper-text'>(16 digits)</span>
          </Label>
          <input id='complex-field' type='text' />
        </div>,
      );

      expect(screen.getByText('Credit Card Number')).toBeInTheDocument();
      expect(screen.getByText('(16 digits)')).toBeInTheDocument();
    });
  });

  describe('Form Control Types', () => {
    it('works with text inputs', async () => {
      const { container } = render(
        <div>
          <Label htmlFor='text-input'>Text Input</Label>
          <input id='text-input' type='text' />
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
      expect(screen.getByLabelText('Text Input')).toHaveAttribute('type', 'text');
    });

    it('works with textarea', async () => {
      const { container } = render(
        <div>
          <Label htmlFor='textarea-field'>Description</Label>
          <textarea id='textarea-field' />
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
      expect(screen.getByLabelText('Description').tagName).toBe('TEXTAREA');
    });

    it('works with select elements', async () => {
      const { container } = render(
        <div>
          <Label htmlFor='select-field'>Choose Option</Label>
          <select id='select-field'>
            <option value='1'>Option 1</option>
            <option value='2'>Option 2</option>
          </select>
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
      expect(screen.getByLabelText('Choose Option').tagName).toBe('SELECT');
    });

    it('works with radio groups', async () => {
      const { container } = render(
        <fieldset>
          <legend>Choose size</legend>
          <div>
            <Label htmlFor='size-small'>Small</Label>
            <input id='size-small' type='radio' name='size' value='small' />
          </div>
          <div>
            <Label htmlFor='size-medium'>Medium</Label>
            <input id='size-medium' type='radio' name='size' value='medium' />
          </div>
        </fieldset>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
      expect(screen.getByLabelText('Small')).toHaveAttribute('type', 'radio');
    });

    it('works with checkboxes', async () => {
      const { container } = render(
        <div>
          <Label htmlFor='terms-checkbox'>I accept the terms and conditions</Label>
          <input id='terms-checkbox' type='checkbox' />
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
      expect(screen.getByLabelText('I accept the terms and conditions')).toHaveAttribute(
        'type',
        'checkbox',
      );
    });
  });

  describe('Polymorphic Elements and ARIA', () => {
    it('maintains accessibility when using custom elements', async () => {
      const { container } = render(
        <div>
          <Label as='span' id='span-label'>
            Custom Label
          </Label>
          <input type='text' aria-labelledby='span-label' />
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('works as legend for fieldsets', async () => {
      const { container } = render(
        <fieldset>
          <Label as='legend'>Group Label</Label>
          <div>
            <Label htmlFor='field-input'>Field Name</Label>
            <input id='field-input' type='text' />
          </div>
        </fieldset>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
      expect(screen.getByText('Group Label').tagName).toBe('LEGEND');
    });
  });

  describe('Color Contrast & Visual Indicators', () => {
    it('provides semantic attributes for visual styling', () => {
      render(
        <div>
          <Label htmlFor='styled-input' required disabled readOnly isInvalid>
            Styled Label
          </Label>
          <input id='styled-input' type='text' />
        </div>,
      );

      const label = screen.getByText('Styled Label');
      expect(label).toHaveAttribute('data-required');
      expect(label).toHaveAttribute('data-disabled');
      expect(label).toHaveAttribute('data-readonly');
      expect(label).toHaveAttribute('data-invalid');
    });

    it('supports custom styling through className', () => {
      render(
        <div>
          <Label htmlFor='custom-styled' className='custom-label-style' required>
            Custom Styled
          </Label>
          <input id='custom-styled' type='text' />
        </div>,
      );

      const label = screen.getByText('Custom Styled');
      expect(label).toHaveClass('custom-label-style');
      expect(label).toHaveAttribute('data-required');
    });
  });
});
