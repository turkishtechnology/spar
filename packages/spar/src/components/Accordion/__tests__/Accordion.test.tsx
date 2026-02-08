import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from '../index';

// Test setup helper
const BasicAccordion = ({
  type = 'single',
  isCollapsible = false,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  orientation = 'vertical',
  children,
  ...rest
}: Partial<React.ComponentProps<typeof Accordion>> = {}) => (
  <Accordion
    type={type}
    isCollapsible={isCollapsible}
    {...(value !== undefined && { value })}
    {...(defaultValue !== undefined && { defaultValue })}
    {...(onValueChange && { onValueChange })}
    disabled={disabled}
    orientation={orientation}
    {...rest}
  >
    {children || (
      <>
        <AccordionItem value='item-1'>
          <AccordionHeader>
            <AccordionTrigger>Item 1</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionHeader>
            <AccordionTrigger>Item 2</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3' disabled>
          <AccordionHeader>
            <AccordionTrigger>Item 3 (Disabled)</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>Content 3</AccordionContent>
        </AccordionItem>
      </>
    )}
  </Accordion>
);

describe('Accordion', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render with correct structure', () => {
      render(<BasicAccordion />);

      expect(screen.getByRole('button', { name: 'Item 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Item 2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Item 3 (Disabled)' })).toBeInTheDocument();
    });

    it('should apply correct data attributes', () => {
      const { container } = render(<BasicAccordion orientation='horizontal' type='multiple' />);
      const accordion = container.firstChild as HTMLElement;

      expect(accordion).toHaveAttribute('data-orientation', 'horizontal');
      expect(accordion).toHaveAttribute('data-type', 'multiple');
    });

    it('should render with custom as prop', () => {
      const { container } = render(
        <Accordion as='section'>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(container.firstChild).toHaveProperty('tagName', 'SECTION');
    });
  });

  describe('Single Type Behavior', () => {
    it('should expand one item at a time in single mode', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion type='single' />);

      const trigger1 = screen.getByRole('button', { name: 'Item 1' });
      const trigger2 = screen.getByRole('button', { name: 'Item 2' });

      // Click first trigger
      await user.click(trigger1);
      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Click second trigger - should collapse first and expand second
      await user.click(trigger2);
      expect(trigger1).toHaveAttribute('aria-expanded', 'false');
      expect(trigger2).toHaveAttribute('aria-expanded', 'true');
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should not collapse expanded item when isCollapsible is false', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion type='single' isCollapsible={false} />);

      const trigger = screen.getByRole('button', { name: 'Item 1' });

      // Expand item
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Click again - should remain expanded
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('should collapse expanded item when isCollapsible is true', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion type='single' isCollapsible={true} />);

      const trigger = screen.getByRole('button', { name: 'Item 1' });

      // Expand item
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Click again - should collapse
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Type Behavior', () => {
    it('should allow multiple items to be expanded simultaneously', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion type='multiple' />);

      const trigger1 = screen.getByRole('button', { name: 'Item 1' });
      const trigger2 = screen.getByRole('button', { name: 'Item 2' });

      await user.click(trigger1);
      await user.click(trigger2);

      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
      expect(trigger2).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should toggle individual items in multiple mode', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion type='multiple' />);

      const trigger1 = screen.getByRole('button', { name: 'Item 1' });

      // Expand
      await user.click(trigger1);
      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Collapse
      await user.click(trigger1);
      expect(trigger1).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });
  });

  describe('Controlled State', () => {
    it('should work as controlled component in single mode', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();

      const { rerender } = render(
        <BasicAccordion type='single' value='item-1' onValueChange={onValueChange} />,
      );

      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Click should call onValueChange but not change internal state
      const trigger2 = screen.getByRole('button', { name: 'Item 2' });
      await user.click(trigger2);

      expect(onValueChange).toHaveBeenCalledWith('item-2');
      // State shouldn't change until parent updates value prop
      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );

      // Simulate parent updating value
      rerender(<BasicAccordion type='single' value='item-2' onValueChange={onValueChange} />);

      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(screen.getByRole('button', { name: 'Item 2' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('should work as controlled component in multiple mode', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();

      const { rerender } = render(
        <BasicAccordion type='multiple' value={['item-1']} onValueChange={onValueChange} />,
      );

      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );

      const trigger2 = screen.getByRole('button', { name: 'Item 2' });
      await user.click(trigger2);

      expect(onValueChange).toHaveBeenCalledWith(['item-1', 'item-2']);

      // Simulate adding second item
      rerender(
        <BasicAccordion
          type='multiple'
          value={['item-1', 'item-2']}
          onValueChange={onValueChange}
        />,
      );

      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByRole('button', { name: 'Item 2' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });
  });

  describe('Default Value', () => {
    it('should initialize with defaultValue in single mode', () => {
      render(<BasicAccordion type='single' defaultValue='item-2' />);

      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(screen.getByRole('button', { name: 'Item 2' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should initialize with defaultValue in multiple mode', () => {
      render(<BasicAccordion type='multiple' defaultValue={['item-1', 'item-2']} />);

      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByRole('button', { name: 'Item 2' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should disable all items when accordion is disabled', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion disabled={true} />);

      const triggers = screen.getAllByRole('button');
      for (const trigger of triggers) {
        expect(trigger).toBeDisabled();
      }

      // Clicks should not work
      await user.click(triggers[0]!);
      expect(triggers[0]!).toHaveAttribute('aria-expanded', 'false');
    });

    it('should disable individual items when item disabled is true', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      const disabledTrigger = screen.getByRole('button', { name: 'Item 3 (Disabled)' });
      const enabledTrigger = screen.getByRole('button', { name: 'Item 1' });

      expect(disabledTrigger).toBeDisabled();
      expect(enabledTrigger).not.toBeDisabled();

      // Disabled item should not respond to clicks
      await user.click(disabledTrigger);
      expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false');

      // Enabled item should respond to clicks
      await user.click(enabledTrigger);
      expect(enabledTrigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Event Handling', () => {
    it('should call custom onClick handlers', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      const onClick = jest.fn();

      render(
        <Accordion type='single' onValueChange={onValueChange}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger onClick={onClick}>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByRole('button', { name: 'Item 1' });
      await user.click(trigger);

      expect(onClick).toHaveBeenCalled();
      expect(onValueChange).toHaveBeenCalledWith('item-1');
    });

    it('should prevent interaction when disabled', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();

      render(<BasicAccordion disabled={true} onValueChange={onValueChange} />);

      const trigger = screen.getByRole('button', { name: 'Item 1' });
      await user.click(trigger);

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Error Cases', () => {
    it('should throw error when Accordion components are used outside context', () => {
      // Suppress error logs for cleaner test output
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<AccordionItem value='test'>Content</AccordionItem>);
      }).toThrow('Accordion components must be used within an Accordion');

      jest.restoreAllMocks();
    });

    it('should throw error when AccordionItem components are used outside AccordionItem context', () => {
      // Suppress error logs for cleaner test output
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <Accordion>
            <AccordionTrigger>Trigger</AccordionTrigger>
          </Accordion>,
        );
      }).toThrow('AccordionItem components must be used within an AccordionItem');

      jest.restoreAllMocks();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty accordion', () => {
      render(<BasicAccordion children={<></>} />);
      // Should not crash with empty accordion
    });

    it('should handle single item accordion', async () => {
      const user = userEvent.setup();
      render(
        <Accordion type='single'>
          <AccordionItem value='only-item'>
            <AccordionHeader>
              <AccordionTrigger>Only Item</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Only Content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByRole('button', { name: 'Only Item' });
      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Only Content')).toBeInTheDocument();
    });

    it('should handle no controlled value gracefully', () => {
      render(
        <Accordion type='single'>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByRole('button', { name: 'Item 1' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });
  });

  describe('Polymorphic Component', () => {
    it('should support different element types through as prop', () => {
      const { container } = render(
        <Accordion as='section' data-testid='accordion' type='single' defaultValue='item-1'>
          <AccordionItem value='item-1' as='article'>
            <AccordionHeader as='h2'>
              <AccordionTrigger as='div' role='button' tabIndex={0}>
                Item 1
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent as='section'>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByTestId('accordion')).toHaveProperty('tagName', 'SECTION');
      expect(container.querySelector('article')).toBeInTheDocument();
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('section[id]')).toBeInTheDocument(); // Content section
    });
  });

  describe('coverage edge cases', () => {
    it('should handle toggle edge cases in controlled single mode', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();

      // Test collapsible single mode - clicking same item SHOULD deselect (line 87 - isExpanded ? '')
      const { rerender } = render(
        <Accordion type='single' value='item-1' isCollapsible onValueChange={onValueChange}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      let trigger = screen.getByRole('button');
      await user.click(trigger);
      expect(onValueChange).toHaveBeenCalledWith(''); // Tests line 87 - isExpanded case

      // Now test expansion case (line 87 - : itemValue)
      onValueChange.mockClear();
      rerender(
        <Accordion type='single' value='' isCollapsible onValueChange={onValueChange}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      trigger = screen.getByRole('button');
      await user.click(trigger);
      expect(onValueChange).toHaveBeenCalledWith('item-1'); // Tests line 87 - not expanded case
    });

    it('should handle collapsible single mode toggle', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();

      // Test collapsible single mode - line 90 branch (same as above but ensuring we hit line 90)
      render(
        <Accordion type='single' isCollapsible value='item-1' onValueChange={onValueChange}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);
      expect(onValueChange).toHaveBeenCalledWith('');
    });

    it('should handle non-collapsible single mode early return', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();

      // Test non-collapsible single mode - should NOT change when clicking expanded item (lines 84-85)
      render(
        <Accordion type='single' value='item-1' isCollapsible={false} onValueChange={onValueChange}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      // Should not call onValueChange - early return on lines 84-85
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should handle AccordionItem context value branching - line 40 & 49', () => {
      // Test single type with matching value (line 40)
      const { rerender } = render(
        <Accordion type='single' value='item-1'>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Test multiple type with array value (line 49)
      rerender(
        <Accordion type='multiple' value={['item-1']}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Test multiple type with non-array value - should use Array.isArray branch (line 49)
      rerender(
        <Accordion type='multiple' value={'item-1' as string}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    });

    it('should handle disabled item toggle attempt', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();
      render(
        <Accordion type='single' onValueChange={onValueChange}>
          <AccordionItem value='item-1' disabled>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      // Should not call onValueChange for disabled items
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should cover keyboard navigation paths for AccordionTrigger lines 68-76', () => {
      // This test specifically targets the uncovered lines in AccordionTrigger
      const onKeyDown = jest.fn();
      render(
        <Accordion type='single'>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger onKeyDown={onKeyDown}>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionHeader>
              <AccordionTrigger onKeyDown={onKeyDown}>Item 2</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionHeader>
              <AccordionTrigger onKeyDown={onKeyDown}>Item 3</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 3</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const triggers = screen.getAllByRole('button');

      // Test Home key - should execute lines 68-71 and 92
      if (triggers[2]) {
        triggers[2].focus();
        const homeEvent = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
        triggers[2].dispatchEvent(homeEvent);
        expect(onKeyDown).toHaveBeenCalled();
      }

      // Test End key - should execute lines 72-76 and 92
      onKeyDown.mockClear();
      if (triggers[0]) {
        triggers[0].focus();
        const endEvent = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
        triggers[0].dispatchEvent(endEvent);
        expect(onKeyDown).toHaveBeenCalled();
      }

      // Test other keys that trigger onKeyDown but not navigation - line 92
      onKeyDown.mockClear();
      if (triggers[0]) {
        const otherEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
        triggers[0].dispatchEvent(otherEvent);
        expect(onKeyDown).toHaveBeenCalled();
      }
    });

    it('should cover AccordionContent forceMount behavior', () => {
      // Test forceMount when collapsed (covers lines 17-19 and 27-28)
      const { container } = render(
        <Accordion type='single' value=''>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent forceMount>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      // Should render content even when collapsed due to forceMount
      expect(screen.getByText('Content 1')).toBeInTheDocument();

      // Check the hidden attribute is applied (line 28)
      const contentElement = container.querySelector('[role="region"]');
      expect(contentElement).toHaveAttribute('hidden');
    });

    it('should cover multiple type toggle logic (lines 89-94)', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();

      // Test multiple type expansion (line 93-94: [...currentArray, itemValue])
      const { rerender } = render(
        <Accordion type='multiple' value={[]} onValueChange={onValueChange}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);
      expect(onValueChange).toHaveBeenCalledWith(['item-1']);

      // Test multiple type collapse (line 92-93: currentArray.filter)
      onValueChange.mockClear();
      rerender(
        <Accordion type='multiple' value={['item-1']} onValueChange={onValueChange}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger2 = screen.getByRole('button');
      await user.click(trigger2);
      expect(onValueChange).toHaveBeenCalledWith([]);
    });
  });
});
