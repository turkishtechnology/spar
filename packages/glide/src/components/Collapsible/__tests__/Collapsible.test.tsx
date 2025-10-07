import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../index';
import { useCollapsibleContext } from '../Collapsible';

// Mock component to test context access
const TestComponent = () => {
  const context = useCollapsibleContext();
  return (
    <div>
      <span data-testid='context-open'>{context.isOpen.toString()}</span>
      <span data-testid='context-disabled'>{context.isDisabled.toString()}</span>
      <span data-testid='context-trigger-id'>{context.triggerId}</span>
      <span data-testid='context-content-id'>{context.contentId}</span>
      <button data-testid='context-toggle' onClick={context.toggle}>
        Toggle
      </button>
    </div>
  );
};

describe('Collapsible', () => {
  describe('Basic rendering and structure', () => {
    it('renders children correctly', () => {
      render(
        <Collapsible>
          <div data-testid='child'>Child content</div>
        </Collapsible>,
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders with correct default data attributes', () => {
      render(
        <Collapsible data-testid='collapsible'>
          <div>Content</div>
        </Collapsible>,
      );

      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toHaveAttribute('data-state', 'closed');
      expect(collapsible).not.toHaveAttribute('data-disabled');
    });

    it('renders with data-disabled attribute when disabled', () => {
      render(
        <Collapsible isDisabled data-testid='collapsible'>
          <div>Content</div>
        </Collapsible>,
      );

      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toHaveAttribute('data-disabled', '');
    });

    it('forwards additional props to the root element', () => {
      render(
        <Collapsible className='custom-class' data-custom='value' data-testid='collapsible'>
          <div>Content</div>
        </Collapsible>,
      );

      const collapsible = screen.getByTestId('collapsible');
      expect(collapsible).toHaveClass('custom-class');
      expect(collapsible).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('Context provider functionality', () => {
    it('provides context to child components', () => {
      render(
        <Collapsible>
          <TestComponent />
        </Collapsible>,
      );

      expect(screen.getByTestId('context-open')).toHaveTextContent('false');
      expect(screen.getByTestId('context-disabled')).toHaveTextContent('false');
      expect(screen.getByTestId('context-trigger-id')).toHaveTextContent(/trigger$/);
      expect(screen.getByTestId('context-content-id')).toHaveTextContent(/content$/);
    });

    it('generates consistent IDs across renders', () => {
      const { rerender } = render(
        <Collapsible>
          <TestComponent />
        </Collapsible>,
      );

      const initialTriggerId = screen.getByTestId('context-trigger-id').textContent;
      const initialContentId = screen.getByTestId('context-content-id').textContent;

      rerender(
        <Collapsible>
          <TestComponent />
        </Collapsible>,
      );

      expect(screen.getByTestId('context-trigger-id')).toHaveTextContent(initialTriggerId!);
      expect(screen.getByTestId('context-content-id')).toHaveTextContent(initialContentId!);
    });

    it('throws error when context is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => render(<TestComponent />)).toThrow(
        'Collapsible components must be used within a Collapsible',
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Uncontrolled mode', () => {
    it('defaults to closed state', () => {
      render(
        <Collapsible data-testid='collapsible'>
          <TestComponent />
        </Collapsible>,
      );

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'closed');
      expect(screen.getByTestId('context-open')).toHaveTextContent('false');
    });

    it('respects defaultOpen prop', () => {
      render(
        <Collapsible defaultOpen data-testid='collapsible'>
          <TestComponent />
        </Collapsible>,
      );

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'open');
      expect(screen.getByTestId('context-open')).toHaveTextContent('true');
    });

    it('toggles state when toggle function is called', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible data-testid='collapsible'>
          <TestComponent />
        </Collapsible>,
      );

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'closed');

      await user.click(screen.getByTestId('context-toggle'));

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'open');
      expect(screen.getByTestId('context-open')).toHaveTextContent('true');
    });

    it('calls onOpenChange callback when state changes', async () => {
      const user = userEvent.setup();
      const handleOpenChange = jest.fn();

      render(
        <Collapsible onOpenChange={handleOpenChange}>
          <TestComponent />
        </Collapsible>,
      );

      await user.click(screen.getByTestId('context-toggle'));

      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Controlled mode', () => {
    it('respects controlled open prop', () => {
      render(
        <Collapsible open={true} data-testid='collapsible'>
          <TestComponent />
        </Collapsible>,
      );

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'open');
      expect(screen.getByTestId('context-open')).toHaveTextContent('true');
    });

    it('does not change state internally when controlled', async () => {
      const user = userEvent.setup();
      const handleOpenChange = jest.fn();

      render(
        <Collapsible open={false} onOpenChange={handleOpenChange} data-testid='collapsible'>
          <TestComponent />
        </Collapsible>,
      );

      await user.click(screen.getByTestId('context-toggle'));

      // State should not change as it's controlled
      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'closed');
      // But callback should be called
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('updates when controlled open prop changes', () => {
      const { rerender } = render(
        <Collapsible open={false} data-testid='collapsible'>
          <TestComponent />
        </Collapsible>,
      );

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'closed');

      rerender(
        <Collapsible open={true} data-testid='collapsible'>
          <TestComponent />
        </Collapsible>,
      );

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'open');
    });
  });

  describe('Disabled state', () => {
    it('sets isDisabled in context when disabled', () => {
      render(
        <Collapsible isDisabled>
          <TestComponent />
        </Collapsible>,
      );

      expect(screen.getByTestId('context-disabled')).toHaveTextContent('true');
    });

    it('prevents toggle when disabled', async () => {
      const user = userEvent.setup();
      const handleOpenChange = jest.fn();

      render(
        <Collapsible isDisabled onOpenChange={handleOpenChange} data-testid='collapsible'>
          <TestComponent />
        </Collapsible>,
      );

      await user.click(screen.getByTestId('context-toggle'));

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'closed');
      expect(handleOpenChange).not.toHaveBeenCalled();
    });

    it('prevents toggle when disabled in controlled mode', async () => {
      const user = userEvent.setup();
      const handleOpenChange = jest.fn();

      render(
        <Collapsible
          open={false}
          isDisabled
          onOpenChange={handleOpenChange}
          data-testid='collapsible'
        >
          <TestComponent />
        </Collapsible>,
      );

      await user.click(screen.getByTestId('context-toggle'));

      expect(handleOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('Integration with child components', () => {
    it('works with CollapsibleTrigger and CollapsibleContent', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid='content'>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();

      await user.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('maintains ARIA relationships between trigger and content', () => {
      render(
        <Collapsible defaultOpen>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent data-testid='content'>Content</CollapsibleContent>
        </Collapsible>,
      );

      const trigger = screen.getByTestId('trigger');
      const content = screen.getByTestId('content');
      const triggerId = trigger.getAttribute('id');
      const contentId = content.getAttribute('id');

      expect(trigger).toHaveAttribute('aria-controls', contentId);
      expect(content).toHaveAttribute('id', contentId);
      expect(trigger).toHaveAttribute('id', triggerId);
    });
  });

  describe('Edge cases and error handling', () => {
    it('handles undefined onOpenChange gracefully', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible data-testid='collapsible'>
          <TestComponent />
        </Collapsible>,
      );

      // Should not throw when onOpenChange is undefined
      await user.click(screen.getByTestId('context-toggle'));

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'open');
    });

    it('handles rapid state changes', async () => {
      const user = userEvent.setup();

      render(
        <Collapsible data-testid='collapsible'>
          <TestComponent />
        </Collapsible>,
      );

      const toggleButton = screen.getByTestId('context-toggle');

      // Rapid clicks
      await user.click(toggleButton);
      await user.click(toggleButton);
      await user.click(toggleButton);

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'open');
    });

    it('maintains consistent behavior across prop updates', () => {
      const { rerender } = render(
        <Collapsible defaultOpen={false}>
          <TestComponent />
        </Collapsible>,
      );

      expect(screen.getByTestId('context-open')).toHaveTextContent('false');

      // Changing defaultOpen should not affect current state
      rerender(
        <Collapsible defaultOpen={true}>
          <TestComponent />
        </Collapsible>,
      );

      expect(screen.getByTestId('context-open')).toHaveTextContent('false');
    });
  });

  describe('Component display names', () => {
    it('has correct display name', () => {
      expect(Collapsible.displayName).toBe('Collapsible');
    });
  });
});
