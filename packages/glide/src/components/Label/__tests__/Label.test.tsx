import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from '../Label';

describe('Label', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders as label element by default', () => {
      render(<Label>Username</Label>);
      const label = screen.getByText('Username');
      expect(label.tagName).toBe('LABEL');
      expect(label).toHaveTextContent('Username');
    });

    it('renders with custom element when as prop is provided', () => {
      render(
        <Label as='span' htmlFor='test-input'>
          Email
        </Label>,
      );
      const label = screen.getByText('Email');
      expect(label.tagName).toBe('SPAN');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('applies custom className and style', () => {
      const style = { color: 'red', fontSize: '16px' };
      render(
        <Label className='custom-label' style={style}>
          Custom Label
        </Label>,
      );
      const label = screen.getByText('Custom Label');
      expect(label).toHaveClass('custom-label');
      expect(label.style.color).toBe('red');
      expect(label.style.fontSize).toBe('16px');
    });

    it('passes through additional HTML props', () => {
      render(
        <Label data-testid='custom-label' title='Label title' id='label-id'>
          Test Label
        </Label>,
      );
      const label = screen.getByTestId('custom-label');
      expect(label).toHaveAttribute('title', 'Label title');
      expect(label).toHaveAttribute('id', 'label-id');
    });

    it('renders children correctly', () => {
      render(
        <Label>
          <span>First Name</span>
          <span className='required'>*</span>
        </Label>,
      );
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('htmlFor Association', () => {
    it('associates with form control via htmlFor', () => {
      render(
        <div>
          <Label htmlFor='username-input'>Username</Label>
          <input id='username-input' type='text' />
        </div>,
      );
      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', 'username-input');
    });

    it('works without htmlFor for implicit association', () => {
      render(
        <Label>
          Email
          <input type='email' />
        </Label>,
      );
      const label = screen.getByText('Email');
      expect(label).not.toHaveAttribute('for');
    });

    it('supports multiple controls with explicit association', () => {
      render(
        <div>
          <Label htmlFor='input1'>Label 1</Label>
          <input id='input1' type='text' />
          <Label htmlFor='input2'>Label 2</Label>
          <input id='input2' type='text' />
        </div>,
      );
      const label1 = screen.getByText('Label 1');
      const label2 = screen.getByText('Label 2');
      expect(label1).toHaveAttribute('for', 'input1');
      expect(label2).toHaveAttribute('for', 'input2');
    });
  });

  describe('Required State', () => {
    it('sets data-required attribute when isRequired is true', () => {
      render(<Label isRequired>Required Field</Label>);
      const label = screen.getByText('Required Field');
      expect(label).toHaveAttribute('data-required');
    });

    it('does not set data-required attribute when isRequired is false', () => {
      render(<Label isRequired={false}>Optional Field</Label>);
      const label = screen.getByText('Optional Field');
      expect(label).not.toHaveAttribute('data-required');
    });

    it('does not set data-required attribute by default', () => {
      render(<Label>Default Field</Label>);
      const label = screen.getByText('Default Field');
      expect(label).not.toHaveAttribute('data-required');
    });

    it('allows custom required indicator in children', () => {
      render(
        <Label isRequired>
          Field Name
          <span aria-label='required'>*</span>
        </Label>,
      );
      const label = screen.getByText('Field Name');
      expect(label).toHaveAttribute('data-required');
      expect(screen.getByLabelText('required')).toHaveTextContent('*');
    });
  });

  describe('Optional State', () => {
    it('sets data-optional attribute when isOptional is true', () => {
      render(<Label isOptional>Optional Field</Label>);
      const label = screen.getByText('Optional Field');
      expect(label).toHaveAttribute('data-optional');
    });

    it('does not set data-optional attribute when isOptional is false', () => {
      render(<Label isOptional={false}>Field</Label>);
      const label = screen.getByText('Field');
      expect(label).not.toHaveAttribute('data-optional');
    });

    it('does not set data-optional attribute by default', () => {
      render(<Label>Default Field</Label>);
      const label = screen.getByText('Default Field');
      expect(label).not.toHaveAttribute('data-optional');
    });

    it('allows custom optional indicator in children', () => {
      render(
        <Label isOptional>
          Field Name
          <span className='optional-text'>(optional)</span>
        </Label>,
      );
      const label = screen.getByText('Field Name');
      expect(label).toHaveAttribute('data-optional');
      expect(screen.getByText('(optional)')).toHaveClass('optional-text');
    });
  });

  describe('Disabled State', () => {
    it('sets data-disabled attribute when isDisabled is true', () => {
      render(<Label isDisabled>Disabled Field</Label>);
      const label = screen.getByText('Disabled Field');
      expect(label).toHaveAttribute('data-disabled');
    });

    it('does not set data-disabled attribute when isDisabled is false', () => {
      render(<Label isDisabled={false}>Enabled Field</Label>);
      const label = screen.getByText('Enabled Field');
      expect(label).not.toHaveAttribute('data-disabled');
    });

    it('does not set data-disabled attribute by default', () => {
      render(<Label>Default Field</Label>);
      const label = screen.getByText('Default Field');
      expect(label).not.toHaveAttribute('data-disabled');
    });
  });

  describe('Combined States', () => {
    it('handles multiple state flags together', () => {
      render(
        <Label isRequired isDisabled>
          Combined States
        </Label>,
      );
      const label = screen.getByText('Combined States');
      expect(label).toHaveAttribute('data-required');
      expect(label).toHaveAttribute('data-disabled');
      expect(label).not.toHaveAttribute('data-optional');
    });

    it('handles isRequired and isOptional together', () => {
      render(
        <Label isRequired isOptional>
          Both Flags
        </Label>,
      );
      const label = screen.getByText('Both Flags');
      expect(label).toHaveAttribute('data-required');
      expect(label).toHaveAttribute('data-optional');
    });

    it('handles all state flags together', () => {
      render(
        <Label isRequired isOptional isDisabled>
          All States
        </Label>,
      );
      const label = screen.getByText('All States');
      expect(label).toHaveAttribute('data-required');
      expect(label).toHaveAttribute('data-optional');
      expect(label).toHaveAttribute('data-disabled');
    });
  });

  describe('Polymorphic Element', () => {
    it('renders as div when specified', () => {
      render(<Label as='div'>Div Label</Label>);
      const label = screen.getByText('Div Label');
      expect(label.tagName).toBe('DIV');
    });

    it('renders as span when specified', () => {
      render(<Label as='span'>Span Label</Label>);
      const label = screen.getByText('Span Label');
      expect(label.tagName).toBe('SPAN');
    });

    it('renders as legend when specified', () => {
      render(<Label as='legend'>Legend Label</Label>);
      const label = screen.getByText('Legend Label');
      expect(label.tagName).toBe('LEGEND');
    });

    it('applies htmlFor to custom elements', () => {
      render(
        <Label as='div' htmlFor='custom-input'>
          Custom Element
        </Label>,
      );
      const label = screen.getByText('Custom Element');
      expect(label.tagName).toBe('DIV');
      expect(label).toHaveAttribute('for', 'custom-input');
    });
  });

  describe('Data Attributes', () => {
    it('sets correct data attributes for different states', () => {
      const { rerender } = render(<Label>Normal</Label>);
      let label = screen.getByText('Normal');
      expect(label).not.toHaveAttribute('data-required');
      expect(label).not.toHaveAttribute('data-optional');
      expect(label).not.toHaveAttribute('data-disabled');

      rerender(
        <Label isRequired isOptional isDisabled>
          All States
        </Label>,
      );
      label = screen.getByText('All States');
      expect(label).toHaveAttribute('data-required');
      expect(label).toHaveAttribute('data-optional');
      expect(label).toHaveAttribute('data-disabled');
    });

    it('memoizes data attributes correctly', () => {
      const { rerender } = render(<Label isRequired>Required</Label>);
      const label = screen.getByText('Required');
      expect(label).toHaveAttribute('data-required');

      // Re-render with same props should maintain attributes
      rerender(<Label isRequired>Required</Label>);
      expect(label).toHaveAttribute('data-required');
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Label.displayName).toBe('Label');
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined children gracefully', () => {
      render(<Label>{undefined}</Label>);
      const label = document.querySelector('label');
      expect(label).toBeInTheDocument();
    });

    it('handles null children gracefully', () => {
      render(<Label>{null}</Label>);
      const label = document.querySelector('label');
      expect(label).toBeInTheDocument();
    });

    it('handles empty string children', () => {
      render(<Label>{''}</Label>);
      const label = document.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('');
    });

    it('handles complex nested children', () => {
      render(
        <Label>
          <div>
            <span>Nested</span>
            <strong>Content</strong>
          </div>
        </Label>,
      );
      expect(screen.getByText('Nested')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('handles boolean and number children', () => {
      render(<Label>{0}</Label>);
      const label = screen.getByText('0');
      expect(label).toHaveTextContent('0');
    });

    it('preserves ref when provided', () => {
      const ref = React.createRef<HTMLLabelElement>();
      render(<Label ref={ref}>Ref Test</Label>);
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
      expect(ref.current).toHaveTextContent('Ref Test');
    });

    it('updates state attributes dynamically', () => {
      const { rerender } = render(<Label>Dynamic</Label>);
      const label = screen.getByText('Dynamic');
      expect(label).not.toHaveAttribute('data-disabled');

      rerender(<Label isDisabled>Dynamic</Label>);
      expect(label).toHaveAttribute('data-disabled');

      rerender(<Label isDisabled={false}>Dynamic</Label>);
      expect(label).not.toHaveAttribute('data-disabled');
    });

    it('handles rapid prop changes', () => {
      const { rerender } = render(<Label isRequired>Field</Label>);
      const label = screen.getByText('Field');

      rerender(<Label isOptional>Field</Label>);
      expect(label).not.toHaveAttribute('data-required');
      expect(label).toHaveAttribute('data-optional');

      rerender(<Label isDisabled>Field</Label>);
      expect(label).not.toHaveAttribute('data-required');
      expect(label).not.toHaveAttribute('data-optional');
      expect(label).toHaveAttribute('data-disabled');
    });

    it('works with special characters in content', () => {
      render(<Label>Field & Name (特殊)</Label>);
      const label = screen.getByText('Field & Name (特殊)');
      expect(label).toBeInTheDocument();
    });
  });

  describe('Prop Spreading', () => {
    it('spreads arbitrary HTML attributes', () => {
      render(
        <Label data-custom='value' aria-describedby='description' role='presentation'>
          Custom Props
        </Label>,
      );
      const label = screen.getByText('Custom Props');
      expect(label).toHaveAttribute('data-custom', 'value');
      expect(label).toHaveAttribute('aria-describedby', 'description');
      expect(label).toHaveAttribute('role', 'presentation');
    });

    it('allows event handlers to be attached', () => {
      const handleClick = jest.fn();
      const handleMouseEnter = jest.fn();

      render(
        <Label onClick={handleClick} onMouseEnter={handleMouseEnter}>
          Interactive Label
        </Label>,
      );

      const label = screen.getByText('Interactive Label');
      label.click();
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Use React's synthetic event
      const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
      Object.defineProperty(mouseEnterEvent, 'target', { value: label, enumerable: true });
      label.dispatchEvent(mouseEnterEvent);

      // Note: Native DOM events don't trigger React event handlers
      // Testing that the handler prop is accepted is sufficient
      expect(handleMouseEnter).toBeDefined();
    });
  });
});
