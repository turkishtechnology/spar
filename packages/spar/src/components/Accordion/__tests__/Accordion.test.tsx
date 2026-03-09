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

  describe('Behavioral regressions', () => {
    it('should derive trigger and content ids from provided item id', async () => {
      const user = userEvent.setup();

      render(
        <Accordion>
          <AccordionItem value='item-1' id='faq-item'>
            <AccordionHeader>
              <AccordionTrigger>Item 1</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByRole('button', { name: 'Item 1' });
      expect(trigger).toHaveAttribute('id', 'faq-item-trigger');
      expect(trigger).toHaveAttribute('aria-controls', 'faq-item-content');

      await user.click(trigger);

      const content = screen.getByRole('region');
      expect(content).toHaveAttribute('id', 'faq-item-content');
      expect(content).toHaveAttribute('aria-labelledby', 'faq-item-trigger');
    });

    it('should support render-prop children in AccordionTrigger', async () => {
      const user = userEvent.setup();

      render(
        <Accordion type='single'>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>
                {(state) => (state.isOpen ? 'Close item' : 'Open item')}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByRole('button', { name: 'Open item' });
      await user.click(trigger);
      expect(screen.getByRole('button', { name: 'Close item' })).toBeInTheDocument();
    });

    it('should move focus with Home and End keys', async () => {
      const user = userEvent.setup();

      render(
        <Accordion>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>First</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>First content</AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionHeader>
              <AccordionTrigger>Second</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Second content</AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionHeader>
              <AccordionTrigger>Third</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Third content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const first = screen.getByRole('button', { name: 'First' });
      const second = screen.getByRole('button', { name: 'Second' });
      const third = screen.getByRole('button', { name: 'Third' });

      third.focus();
      await user.keyboard('{Home}');
      expect(first).toHaveFocus();

      second.focus();
      await user.keyboard('{End}');
      expect(third).toHaveFocus();
    });

    it('should move focus with Arrow keys in horizontal orientation', async () => {
      const user = userEvent.setup();

      render(
        <Accordion orientation='horizontal'>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>First</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>First content</AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionHeader>
              <AccordionTrigger>Second</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Second content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const first = screen.getByRole('button', { name: 'First' });
      const second = screen.getByRole('button', { name: 'Second' });

      first.focus();
      await user.keyboard('{ArrowRight}');
      expect(second).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(first).toHaveFocus();
    });
  });
});
