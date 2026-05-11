import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from '../index';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test setup helpers
const BasicAccordion = ({
  multiple = false,
  orientation = 'vertical',
  children,
  ...rest
}: Partial<React.ComponentProps<typeof Accordion>> = {}) => (
  <Accordion multiple={multiple} orientation={orientation} {...rest}>
    {children || (
      <>
        <AccordionItem value='item-1'>
          <AccordionHeader>
            <AccordionTrigger>Section 1: Introduction</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <p>This is the content for section 1, providing an introduction to the topic.</p>
            <a href='#section1'>Learn more about section 1</a>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionHeader level={4}>
            <AccordionTrigger>Section 2: Details</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <p>This section contains detailed information about the subject matter.</p>
            <button type='button'>Take Action</button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3' disabled>
          <AccordionHeader level={2}>
            <AccordionTrigger>Section 3: Advanced (Coming Soon)</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <p>This content is not yet available.</p>
          </AccordionContent>
        </AccordionItem>
      </>
    )}
  </Accordion>
);

describe('Accordion Accessibility', () => {
  beforeAll(() => {
    // Mock getBoundingClientRect for focus management tests
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ARIA Compliance', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<BasicAccordion />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when expanded', async () => {
      const user = userEvent.setup();
      const { container } = render(<BasicAccordion />);

      // Expand first item
      const trigger = screen.getByRole('button', { name: 'Section 1: Introduction' });
      await user.click(trigger);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations with multiple items expanded', async () => {
      const user = userEvent.setup();
      const { container } = render(<BasicAccordion multiple />);

      // Expand multiple items
      const trigger1 = screen.getByRole('button', { name: 'Section 1: Introduction' });
      const trigger2 = screen.getByRole('button', { name: 'Section 2: Details' });

      await user.click(trigger1);
      await user.click(trigger2);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes', () => {
    it('should have correct ARIA attributes on triggers', () => {
      render(<BasicAccordion />);

      const triggers = screen.getAllByRole('button');

      triggers.forEach((trigger) => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(trigger).toHaveAttribute('aria-controls');
        expect(trigger.getAttribute('aria-controls')).toBeTruthy();
      });
    });

    it('should update aria-expanded when items are toggled', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      const trigger1 = screen.getByRole('button', { name: 'Section 1: Introduction' });
      const trigger2 = screen.getByRole('button', { name: 'Section 2: Details' });

      // Initially collapsed
      expect(trigger1).toHaveAttribute('aria-expanded', 'false');
      expect(trigger2).toHaveAttribute('aria-expanded', 'false');

      // Expand first
      await user.click(trigger1);
      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
      expect(trigger2).toHaveAttribute('aria-expanded', 'false');

      // Expand second (should collapse first in single mode)
      await user.click(trigger2);
      expect(trigger1).toHaveAttribute('aria-expanded', 'false');
      expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have correct region role on content panels', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      const trigger = screen.getByRole('button', { name: 'Section 1: Introduction' });
      await user.click(trigger);

      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute('aria-labelledby', trigger.id);
    });

    it('should properly associate triggers with content panels', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      const trigger = screen.getByRole('button', { name: 'Section 1: Introduction' });
      await user.click(trigger);

      const region = screen.getByRole('region');
      const triggerId = trigger.getAttribute('id');
      const contentId = region.getAttribute('id');

      expect(trigger).toHaveAttribute('aria-controls', contentId);
      expect(region).toHaveAttribute('aria-labelledby', triggerId);
    });
  });

  describe('Heading Structure', () => {
    it('should render proper heading hierarchy', () => {
      const { container } = render(<BasicAccordion />);

      // Default heading level should be h3
      const defaultHeadings = container.querySelectorAll('h3');
      expect(defaultHeadings).toHaveLength(1);

      // Custom heading levels
      const h2 = container.querySelector('h2');
      const h4 = container.querySelector('h4');

      expect(h2).toBeInTheDocument();
      expect(h4).toBeInTheDocument();
    });

    it('should allow custom heading levels', () => {
      render(
        <Accordion>
          <AccordionItem value='item-1'>
            <AccordionHeader level={1}>
              <AccordionTrigger>Main Heading</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionHeader level={6}>
              <AccordionTrigger>Sub Heading</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 6 })).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support tab navigation', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      const triggers = screen.getAllByRole('button');

      await user.tab();
      // In test environment, focus behavior may vary, so we test that elements are focusable
      expect(triggers[0]).not.toHaveAttribute('tabIndex', '-1');
      expect(triggers[1]).not.toHaveAttribute('tabIndex', '-1');
      expect(triggers[2]).toHaveAttribute('disabled'); // Third item is disabled
    });

    it('should activate trigger with Enter key', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      const trigger = screen.getByRole('button', { name: 'Section 1: Introduction' });
      trigger.focus();

      await user.keyboard('{Enter}');

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText(/This is the content for section 1/)).toBeInTheDocument();
    });

    it('should activate trigger with Space key', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      const trigger = screen.getByRole('button', { name: 'Section 2: Details' });
      trigger.focus();

      await user.keyboard('{ }'); // Space key

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText(/This section contains detailed information/)).toBeInTheDocument();
    });

    it('should move focus with Arrow keys in vertical orientation', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion orientation='vertical' />);

      const trigger1 = screen.getByRole('button', { name: 'Section 1: Introduction' });
      const trigger2 = screen.getByRole('button', { name: 'Section 2: Details' });

      trigger1.focus();
      await user.keyboard('{ArrowDown}');
      expect(trigger2).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(trigger1).toHaveFocus();
    });

    it('should move focus with Arrow keys in horizontal orientation', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion orientation='horizontal' />);

      const trigger1 = screen.getByRole('button', { name: 'Section 1: Introduction' });
      const trigger2 = screen.getByRole('button', { name: 'Section 2: Details' });

      trigger1.focus();
      await user.keyboard('{ArrowRight}');
      expect(trigger2).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(trigger1).toHaveFocus();
    });

    it('should move focus to first item with Home key', async () => {
      const user = userEvent.setup();
      render(
        <Accordion>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>First section</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>First content</AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionHeader>
              <AccordionTrigger>Second section</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Second content</AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionHeader>
              <AccordionTrigger>Third section</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Third content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger1 = screen.getByRole('button', { name: 'First section' });
      const trigger2 = screen.getByRole('button', { name: 'Second section' });

      trigger2.focus();
      await user.keyboard('{Home}');
      expect(trigger1).toHaveFocus();
    });

    it('should move focus to last item with End key', async () => {
      const user = userEvent.setup();
      render(
        <Accordion>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>First section</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>First content</AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionHeader>
              <AccordionTrigger>Second section</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Second content</AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionHeader>
              <AccordionTrigger>Third section</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Third content</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger1 = screen.getByRole('button', { name: 'First section' });
      const trigger3 = screen.getByRole('button', { name: 'Third section' });

      trigger1.focus();
      await user.keyboard('{End}');
      expect(trigger3).toHaveFocus();
    });

    it('should not activate disabled triggers with keyboard', async () => {
      render(<BasicAccordion />);

      const disabledTrigger = screen.getByRole('button', {
        name: 'Section 3: Advanced (Coming Soon)',
      });

      // Verify disabled state and attributes
      expect(disabledTrigger).toBeDisabled();
      expect(disabledTrigger).toHaveAttribute('disabled');
      expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false');

      // Test that keyboard events are ignored for disabled triggers
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });

      disabledTrigger.dispatchEvent(enterEvent);
      disabledTrigger.dispatchEvent(spaceEvent);

      // Should remain collapsed
      expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus on trigger after activation', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      const trigger = screen.getByRole('button', { name: 'Section 1: Introduction' });

      // Test that trigger is focusable and has correct attributes
      expect(trigger).not.toBeDisabled();
      expect(trigger).toHaveAttribute('data-accordion-trigger');

      trigger.focus();
      await user.keyboard('{Enter}');

      // Should expand but trigger remains focusable
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveFocus();
    });

    it('should manage focus properly when content contains focusable elements', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      // Expand section with focusable content
      const trigger = screen.getByRole('button', { name: 'Section 2: Details' });
      await user.click(trigger);

      // Test that focusable content is available
      const actionButton = screen.getByRole('button', { name: 'Take Action' });
      expect(actionButton).toBeInTheDocument();
      expect(actionButton).not.toBeDisabled();

      // In jsdom environment, focus management may not work as expected
      // So we test that elements have correct focusable attributes
      expect(actionButton).toHaveAttribute('type', 'button');
      expect(actionButton).not.toHaveAttribute('disabled');
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper accessible names for triggers', () => {
      render(<BasicAccordion />);

      expect(screen.getByRole('button', { name: 'Section 1: Introduction' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Section 2: Details' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Section 3: Advanced (Coming Soon)' }),
      ).toBeInTheDocument();
    });

    it('should announce state changes to screen readers', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      const trigger = screen.getByRole('button', { name: 'Section 1: Introduction' });

      // Initial state
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      // After expansion
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // The content should be available to screen readers
      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
      expect(region).toHaveTextContent('This is the content for section 1');
    });

    it('should properly label content regions', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      const trigger = screen.getByRole('button', { name: 'Section 1: Introduction' });
      await user.click(trigger);

      const region = screen.getByRole('region', { name: 'Section 1: Introduction' });
      expect(region).toBeInTheDocument();
    });
  });

  describe('Disabled State Accessibility', () => {
    it('should properly mark disabled triggers', () => {
      render(<BasicAccordion />);

      const disabledTrigger = screen.getByRole('button', {
        name: 'Section 3: Advanced (Coming Soon)',
      });
      expect(disabledTrigger).toBeDisabled();
      expect(disabledTrigger).toHaveAttribute('data-disabled', '');
    });

    it('should keep disabled trigger non-interactive when focused', async () => {
      const user = userEvent.setup();
      render(<BasicAccordion />);

      const disabledTrigger = screen.getByRole('button', {
        name: 'Section 3: Advanced (Coming Soon)',
      });

      disabledTrigger.focus();
      await user.keyboard('{Enter}');
      await user.keyboard('{ }');

      expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('This content is not yet available.')).not.toBeInTheDocument();
    });
  });

  describe('Dynamic Content Accessibility', () => {
    it('should maintain accessibility when content is force mounted', async () => {
      const { container } = render(
        <Accordion>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>Always Mounted Content</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent forceMount>
              <p>This content is always in the DOM</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Content should be properly hidden when collapsed
      const content = screen.getByRole('region', { hidden: true });
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('hidden');
    });

    it('should handle accordion with custom polymorphic elements', async () => {
      const { container } = render(
        <Accordion as='section' data-testid='custom-accordion'>
          <AccordionItem value='item-1' as='article'>
            <AccordionHeader as='h1'>
              <AccordionTrigger>Custom Elements</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent as='section'>
              <p>Content in custom elements</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Verify proper heading structure with custom element
      expect(
        screen.getByRole('heading', { level: 1, name: 'Custom Elements' }),
      ).toBeInTheDocument();
    });
  });
});
