import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../index';

expect.extend(toHaveNoViolations);

describe('Collapsible Accessibility', () => {
  describe('WCAG Compliance', () => {
    it('has no accessibility violations in closed state', async () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle content</CollapsibleTrigger>
          <CollapsibleContent>This is the collapsible content</CollapsibleContent>
        </Collapsible>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations in open state', async () => {
      const { container } = render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger>Toggle content</CollapsibleTrigger>
          <CollapsibleContent>This is the collapsible content</CollapsibleContent>
        </Collapsible>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with disabled state', async () => {
      const { container } = render(
        <Collapsible disabled>
          <CollapsibleTrigger>Toggle content</CollapsibleTrigger>
          <CollapsibleContent>This is the collapsible content</CollapsibleContent>
        </Collapsible>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with custom elements', async () => {
      const { container } = render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger as='div'>Custom trigger</CollapsibleTrigger>
          <CollapsibleContent as='section'>Custom content</CollapsibleContent>
        </Collapsible>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with force mounted content', async () => {
      const { container } = render(
        <Collapsible>
          <CollapsibleTrigger>Toggle content</CollapsibleTrigger>
          <CollapsibleContent forceMount>Force mounted content</CollapsibleContent>
        </Collapsible>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes and Roles', () => {
    it('sets correct ARIA attributes on trigger (button)', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-controls');
      expect(trigger).toHaveAttribute('type', 'button');
    });

    it('sets correct ARIA attributes on trigger (custom element)', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger as='div' data-testid='trigger'>
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('role', 'button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-controls');
      expect(trigger).toHaveAttribute('tabIndex', '0');
    });

    it('updates aria-expanded when state changes', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('sets correct ARIA relationship between trigger and content', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid='content'>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      const content = screen.getByTestId('content');
      const contentId = content.getAttribute('id');

      expect(trigger).toHaveAttribute('aria-controls', contentId);
    });

    it('handles aria-disabled for button elements when disabled', () => {
      render(
        <Collapsible disabled>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('disabled');
      expect(trigger).toHaveAttribute('type', 'button');
    });

    it('handles aria-disabled for custom elements when disabled', () => {
      render(
        <Collapsible disabled>
          <CollapsibleTrigger as='div' data-testid='trigger'>
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
      expect(trigger).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Keyboard Navigation', () => {
    it('responds to Enter key on button trigger', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid='content'>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      trigger.focus();

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      await user.keyboard('{Enter}');

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('responds to Space key on button trigger', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid='content'>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      trigger.focus();

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      await user.keyboard(' ');

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('responds to Enter key on custom element trigger', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger as='div' data-testid='trigger'>
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent data-testid='content'>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      trigger.focus();

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      await user.keyboard('{Enter}');

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('responds to Space key on custom element trigger', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger as='div' data-testid='trigger'>
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent data-testid='content'>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      trigger.focus();

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      await user.keyboard(' ');

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('does not respond to keyboard when disabled (button)', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible disabled>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid='content'>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');

      // Disabled button should not be focusable
      expect(trigger).toHaveAttribute('disabled');

      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('does not respond to keyboard when disabled (custom element)', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible disabled>
          <CollapsibleTrigger as='div' data-testid='trigger'>
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent data-testid='content'>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('tabIndex', '-1');

      // Try to focus (should not be possible with tabIndex -1)
      trigger.focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('preserves custom onKeyDown handler', async () => {
      const user = userEvent.setup();
      const handleKeyDown = jest.fn();

      render(
        <Collapsible>
          <CollapsibleTrigger data-testid='trigger' onKeyDown={handleKeyDown}>
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent data-testid='content'>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      trigger.focus();

      await user.keyboard('{Enter}');

      expect(handleKeyDown).toHaveBeenCalled();
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('handles other keys without interference', async () => {
      const user = userEvent.setup();
      const handleKeyDown = jest.fn();

      render(
        <Collapsible>
          <CollapsibleTrigger data-testid='trigger' onKeyDown={handleKeyDown}>
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      trigger.focus();

      await user.keyboard('{Escape}');
      await user.keyboard('{Tab}');

      expect(handleKeyDown).toHaveBeenCalledTimes(2);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Focus Management', () => {
    it('maintains focus on trigger after activation', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      trigger.focus();

      await user.keyboard('{Enter}');

      expect(trigger).toHaveFocus();
    });

    it('allows tabbing to trigger when enabled', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).not.toHaveAttribute('tabIndex', '-1');
    });

    it('prevents tabbing to trigger when disabled (custom element)', () => {
      render(
        <Collapsible disabled>
          <CollapsibleTrigger as='div' data-testid='trigger'>
            Toggle
          </CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('tabIndex', '-1');
    });

    it('prevents interaction when disabled (button)', () => {
      render(
        <Collapsible disabled>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toBeDisabled();
    });
  });

  describe('Screen Reader Support', () => {
    it('provides meaningful labels through content', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Show more details</CollapsibleTrigger>
          <CollapsibleContent>Detailed information here</CollapsibleContent>
        </Collapsible>,
      );

      expect(screen.getByRole('button', { name: 'Show more details' })).toBeInTheDocument();
    });

    it('announces state changes through aria-expanded', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger data-testid='trigger'>Toggle details</CollapsibleTrigger>
          <CollapsibleContent>Details content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAccessibleName('Toggle details');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('works with explicit aria labels', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger aria-label='Toggle additional options'>
            <span aria-hidden='true'>⚙️</span>
          </CollapsibleTrigger>
          <CollapsibleContent>Options content</CollapsibleContent>
        </Collapsible>,
      );

      expect(screen.getByRole('button', { name: 'Toggle additional options' })).toBeInTheDocument();
    });
  });

  describe('Content Visibility and Hidden State', () => {
    it('properly handles content visibility for screen readers', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid='content'>Hidden content</CollapsibleContent>
        </Collapsible>,
      );

      // Content should not be in DOM when closed and not force mounted
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('properly handles force mounted content with hidden attribute', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent forceMount data-testid='content'>
            Force mounted content
          </CollapsibleContent>
        </Collapsible>,
      );

      const content = screen.getByTestId('content');
      // Should have hidden attribute when closed but force mounted
      expect(content).toHaveAttribute('hidden');
    });

    it('removes hidden attribute when opened', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent forceMount data-testid='content'>
            Content
          </CollapsibleContent>
        </Collapsible>,
      );

      const content = screen.getByTestId('content');
      expect(content).toHaveAttribute('hidden');

      await user.click(screen.getByTestId('trigger'));

      expect(content).not.toHaveAttribute('hidden');
    });
  });

  describe('Data Attributes for Styling', () => {
    it('provides data-state attribute for styling hooks', () => {
      render(
        <Collapsible data-testid='collapsible'>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid='content' forceMount>
            Content
          </CollapsibleContent>
        </Collapsible>,
      );

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'closed');
      expect(screen.getByTestId('trigger')).toHaveAttribute('data-state', 'closed');
      expect(screen.getByTestId('content')).toHaveAttribute('data-state', 'closed');
    });

    it('updates data-state when opened', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible data-testid='collapsible'>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid='content' forceMount>
            Content
          </CollapsibleContent>
        </Collapsible>,
      );

      await user.click(screen.getByTestId('trigger'));

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'open');
      expect(screen.getByTestId('trigger')).toHaveAttribute('data-state', 'open');
      expect(screen.getByTestId('content')).toHaveAttribute('data-state', 'open');
    });

    it('provides data-disabled attribute when disabled', () => {
      render(
        <Collapsible disabled data-testid='collapsible'>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid='content' forceMount>
            Content
          </CollapsibleContent>
        </Collapsible>,
      );

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-disabled', '');
      expect(screen.getByTestId('trigger')).toHaveAttribute('data-disabled', '');
      expect(screen.getByTestId('content')).toHaveAttribute('data-disabled', '');
    });
  });
});
