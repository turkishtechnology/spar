import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from '../index';

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).ResizeObserver = MockResizeObserver;

// Complex form component for integration testing
const FormWithCollapsible = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    advancedOptions: {
      newsletter: false,
      notifications: true,
    },
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would happen here in real app
  };

  return (
    <form onSubmit={handleSubmit} data-testid='form'>
      <div>
        <label htmlFor='name'>Name:</label>
        <input
          id='name'
          data-testid='name-input'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor='email'>Email:</label>
        <input
          id='email'
          data-testid='email-input'
          type='email'
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <CollapsibleRoot open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger data-testid='advanced-trigger'>
          {isAdvancedOpen ? 'Hide' : 'Show'} Advanced Options
        </CollapsibleTrigger>
        <CollapsibleContent data-testid='advanced-content'>
          <div>
            <label>
              <input
                type='checkbox'
                data-testid='newsletter-checkbox'
                checked={formData.advancedOptions.newsletter}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    advancedOptions: {
                      ...formData.advancedOptions,
                      newsletter: e.target.checked,
                    },
                  })
                }
              />
              Subscribe to newsletter
            </label>
          </div>

          <div>
            <label>
              <input
                type='checkbox'
                data-testid='notifications-checkbox'
                checked={formData.advancedOptions.notifications}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    advancedOptions: {
                      ...formData.advancedOptions,
                      notifications: e.target.checked,
                    },
                  })
                }
              />
              Enable notifications
            </label>
          </div>
        </CollapsibleContent>
      </CollapsibleRoot>

      <button type='submit' data-testid='submit-button'>
        Submit
      </button>
    </form>
  );
};

// Multi-level collapsible component
const NestedCollapsible = () => {
  return (
    <div>
      <CollapsibleRoot>
        <CollapsibleTrigger data-testid='level1-trigger'>Level 1</CollapsibleTrigger>
        <CollapsibleContent data-testid='level1-content'>
          <p>Level 1 content</p>
          <CollapsibleRoot>
            <CollapsibleTrigger data-testid='level2-trigger'>Level 2</CollapsibleTrigger>
            <CollapsibleContent data-testid='level2-content'>
              <p>Level 2 content</p>
              <CollapsibleRoot>
                <CollapsibleTrigger data-testid='level3-trigger'>Level 3</CollapsibleTrigger>
                <CollapsibleContent data-testid='level3-content'>
                  <p>Level 3 content</p>
                </CollapsibleContent>
              </CollapsibleRoot>
            </CollapsibleContent>
          </CollapsibleRoot>
        </CollapsibleContent>
      </CollapsibleRoot>
    </div>
  );
};

// Dynamic content component
const DynamicContentCollapsible = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2']);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = () => {
    setItems([...items, `Item ${items.length + 1}`]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <CollapsibleRoot open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger data-testid='dynamic-trigger'>
          Toggle Dynamic Content ({items.length} items)
        </CollapsibleTrigger>
        <CollapsibleContent data-testid='dynamic-content'>
          <button data-testid='add-item' onClick={addItem}>
            Add Item
          </button>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item}
                <button
                  data-testid={`remove-${index}`}
                  onClick={() => removeItem(index)}
                  style={{ marginLeft: '10px' }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </CollapsibleRoot>
    </div>
  );
};

describe('Collapsible Integration Tests', () => {
  describe('Form Integration', () => {
    it('integrates seamlessly with form controls', async () => {
      const user = userEvent.setup();

      render(<FormWithCollapsible />);

      // Fill basic form fields
      await user.type(screen.getByTestId('name-input'), 'John Doe');
      await user.type(screen.getByTestId('email-input'), 'john@example.com');

      // Advanced options should not be visible
      expect(screen.queryByTestId('advanced-content')).not.toBeInTheDocument();

      // Open advanced options
      await user.click(screen.getByTestId('advanced-trigger'));

      // Advanced options should now be visible
      expect(screen.getByTestId('advanced-content')).toBeInTheDocument();

      // Interact with advanced options
      const newsletterCheckbox = screen.getByTestId('newsletter-checkbox');
      const notificationsCheckbox = screen.getByTestId('notifications-checkbox');

      expect(newsletterCheckbox).not.toBeChecked();
      expect(notificationsCheckbox).toBeChecked();

      await user.click(newsletterCheckbox);

      expect(newsletterCheckbox).toBeChecked();
    });

    it('preserves form state when collapsible is toggled', async () => {
      const user = userEvent.setup();

      render(<FormWithCollapsible />);

      // Open advanced options and modify them
      await user.click(screen.getByTestId('advanced-trigger'));
      await user.click(screen.getByTestId('newsletter-checkbox'));

      // Close advanced options
      await user.click(screen.getByTestId('advanced-trigger'));

      // Reopen advanced options
      await user.click(screen.getByTestId('advanced-trigger'));

      // State should be preserved
      expect(screen.getByTestId('newsletter-checkbox')).toBeChecked();
    });

    it('maintains focus flow in forms', async () => {
      const user = userEvent.setup();

      render(<FormWithCollapsible />);

      // Tab through form elements
      await user.tab();
      expect(screen.getByTestId('name-input')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('email-input')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('advanced-trigger')).toHaveFocus();

      // Open advanced options
      await user.keyboard('{Enter}');

      // Tab should now reach advanced form controls
      await user.tab();
      expect(screen.getByTestId('newsletter-checkbox')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('notifications-checkbox')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('submit-button')).toHaveFocus();
    });
  });

  describe('Nested Collapsibles', () => {
    it('handles multiple levels of nesting correctly', async () => {
      const user = userEvent.setup();

      render(<NestedCollapsible />);

      // All levels should be closed initially
      expect(screen.queryByTestId('level1-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('level2-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('level3-content')).not.toBeInTheDocument();

      // Open level 1
      await user.click(screen.getByTestId('level1-trigger'));
      expect(screen.getByTestId('level1-content')).toBeInTheDocument();
      expect(screen.queryByTestId('level2-content')).not.toBeInTheDocument();

      // Open level 2
      await user.click(screen.getByTestId('level2-trigger'));
      expect(screen.getByTestId('level2-content')).toBeInTheDocument();
      expect(screen.queryByTestId('level3-content')).not.toBeInTheDocument();

      // Open level 3
      await user.click(screen.getByTestId('level3-trigger'));
      expect(screen.getByTestId('level3-content')).toBeInTheDocument();
    });

    it('maintains independent state for nested collapsibles', async () => {
      const user = userEvent.setup();

      render(<NestedCollapsible />);

      // Open all levels
      await user.click(screen.getByTestId('level1-trigger'));
      await user.click(screen.getByTestId('level2-trigger'));
      await user.click(screen.getByTestId('level3-trigger'));

      // All should be open
      expect(screen.getByTestId('level1-content')).toBeInTheDocument();
      expect(screen.getByTestId('level2-content')).toBeInTheDocument();
      expect(screen.getByTestId('level3-content')).toBeInTheDocument();

      // Close level 2, level 3 content should be hidden (because its parent is hidden)
      await user.click(screen.getByTestId('level2-trigger'));
      expect(screen.getByTestId('level1-content')).toBeInTheDocument();
      expect(screen.queryByTestId('level2-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('level3-content')).not.toBeInTheDocument();

      // Reopen level 2, level 3 should be back to default closed state (as expected when components remount)
      await user.click(screen.getByTestId('level2-trigger'));
      expect(screen.getByTestId('level2-content')).toBeInTheDocument();

      // Level 3 should be in closed state (default state) since it was unmounted and remounted
      expect(screen.getByTestId('level3-trigger')).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('level3-content')).not.toBeInTheDocument();
    });
  });

  describe('Dynamic Content Scenarios', () => {
    it('handles dynamic content changes', async () => {
      const user = userEvent.setup();

      render(<DynamicContentCollapsible />);

      // Initially closed
      expect(screen.queryByTestId('dynamic-content')).not.toBeInTheDocument();

      // Open collapsible
      await user.click(screen.getByTestId('dynamic-trigger'));
      expect(screen.getByTestId('dynamic-content')).toBeInTheDocument();

      // Should show initial items
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();

      // Add new item
      await user.click(screen.getByTestId('add-item'));
      expect(screen.getByText('Item 3')).toBeInTheDocument();

      // Trigger text should update
      expect(screen.getByTestId('dynamic-trigger')).toHaveTextContent(
        'Toggle Dynamic Content (3 items)',
      );

      // Remove item
      await user.click(screen.getByTestId('remove-1'));
      expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
      expect(screen.getByTestId('dynamic-trigger')).toHaveTextContent(
        'Toggle Dynamic Content (2 items)',
      );
    });

    it('maintains collapsible state during content updates', async () => {
      const user = userEvent.setup();

      render(<DynamicContentCollapsible />);

      // Open and add items
      await user.click(screen.getByTestId('dynamic-trigger'));
      await user.click(screen.getByTestId('add-item'));

      // Close collapsible
      await user.click(screen.getByTestId('dynamic-trigger'));
      expect(screen.queryByTestId('dynamic-content')).not.toBeInTheDocument();

      // Reopen - new item should still be there
      await user.click(screen.getByTestId('dynamic-trigger'));
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('Event Propagation and Bubbling', () => {
    it('handles event propagation correctly', async () => {
      const user = userEvent.setup();
      const parentClickHandler = jest.fn();
      const triggerClickHandler = jest.fn();

      render(
        <div onClick={parentClickHandler} data-testid='parent'>
          <CollapsibleRoot>
            <CollapsibleTrigger onClick={triggerClickHandler} data-testid='trigger'>
              Toggle
            </CollapsibleTrigger>
            <CollapsibleContent>Content</CollapsibleContent>
          </CollapsibleRoot>
        </div>,
      );

      await user.click(screen.getByTestId('trigger'));

      expect(triggerClickHandler).toHaveBeenCalledTimes(1);
      expect(parentClickHandler).toHaveBeenCalledTimes(1);
    });

    it('allows stopping event propagation', async () => {
      const user = userEvent.setup();
      const parentClickHandler = jest.fn();
      const triggerClickHandler = jest.fn((e) => {
        e.stopPropagation();
      });

      render(
        <div onClick={parentClickHandler} data-testid='parent'>
          <CollapsibleRoot>
            <CollapsibleTrigger onClick={triggerClickHandler} data-testid='trigger'>
              Toggle
            </CollapsibleTrigger>
            <CollapsibleContent>Content</CollapsibleContent>
          </CollapsibleRoot>
        </div>,
      );

      await user.click(screen.getByTestId('trigger'));

      expect(triggerClickHandler).toHaveBeenCalledTimes(1);
      expect(parentClickHandler).not.toHaveBeenCalled();
    });
  });

  describe('Async Operations', () => {
    it('handles async content loading', async () => {
      const user = userEvent.setup();
      const AsyncContentCollapsible = () => {
        const [isOpen, setIsOpen] = useState(false);
        const [content, setContent] = useState<string>('');
        const [loading, setLoading] = useState(false);

        const handleToggle = async (open: boolean) => {
          setIsOpen(open);
          if (open && !content) {
            setLoading(true);
            // Simulate async operation
            await new Promise((resolve) => setTimeout(resolve, 100));
            setContent('Async loaded content');
            setLoading(false);
          }
        };

        return (
          <CollapsibleRoot open={isOpen} onOpenChange={handleToggle}>
            <CollapsibleTrigger data-testid='async-trigger'>Load Content</CollapsibleTrigger>
            <CollapsibleContent data-testid='async-content'>
              {loading ? <div data-testid='loading'>Loading...</div> : content}
            </CollapsibleContent>
          </CollapsibleRoot>
        );
      };

      render(<AsyncContentCollapsible />);

      await user.click(screen.getByTestId('async-trigger'));

      // Should show loading state
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Wait for content to load
      await screen.findByText('Async loaded content');
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  describe('Browser Events and API', () => {
    it('handles force mounted content with proper hidden state', () => {
      render(
        <CollapsibleRoot>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent forceMount data-testid='content'>
            Searchable content that should be findable
          </CollapsibleContent>
        </CollapsibleRoot>,
      );

      const content = screen.getByTestId('content');
      expect(content).toHaveAttribute('hidden');
    });

    it('removes hidden attribute when opened with force mounted content', async () => {
      const user = userEvent.setup();

      render(
        <CollapsibleRoot data-testid='collapsible'>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent forceMount data-testid='content'>
            Searchable content
          </CollapsibleContent>
        </CollapsibleRoot>,
      );

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'closed');
      expect(screen.getByTestId('content')).toHaveAttribute('hidden');

      await user.click(screen.getByTestId('trigger'));

      expect(screen.getByTestId('collapsible')).toHaveAttribute('data-state', 'open');
      expect(screen.getByTestId('content')).not.toHaveAttribute('hidden');
    });
  });

  describe('Performance and Memory', () => {
    it('cleans up ResizeObserver on unmount', () => {
      const disconnectSpy = jest.spyOn(MockResizeObserver.prototype, 'disconnect');

      const { unmount } = render(
        <CollapsibleRoot defaultOpen>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content with ResizeObserver</CollapsibleContent>
        </CollapsibleRoot>,
      );

      unmount();

      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('handles rapid state changes without memory leaks', async () => {
      const user = userEvent.setup();

      render(
        <CollapsibleRoot>
          <CollapsibleTrigger data-testid='trigger'>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Content</CollapsibleContent>
        </CollapsibleRoot>,
      );

      const trigger = screen.getByTestId('trigger');

      // Rapid toggling
      for (let i = 0; i < 10; i++) {
        await user.click(trigger);
      }

      // Should remain functional after rapid changes
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('works as FAQ component', async () => {
      const user = userEvent.setup();

      const FAQ = () => (
        <div>
          <CollapsibleRoot>
            <CollapsibleTrigger data-testid='faq1-trigger'>
              What is your return policy?
            </CollapsibleTrigger>
            <CollapsibleContent data-testid='faq1-content'>
              We offer a 30-day return policy for all items.
            </CollapsibleContent>
          </CollapsibleRoot>

          <CollapsibleRoot>
            <CollapsibleTrigger data-testid='faq2-trigger'>
              How do I track my order?
            </CollapsibleTrigger>
            <CollapsibleContent data-testid='faq2-content'>
              You can track your order using the tracking number provided.
            </CollapsibleContent>
          </CollapsibleRoot>
        </div>
      );

      render(<FAQ />);

      // Both should be closed initially
      expect(screen.queryByTestId('faq1-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('faq2-content')).not.toBeInTheDocument();

      // Open first FAQ
      await user.click(screen.getByTestId('faq1-trigger'));
      expect(screen.getByTestId('faq1-content')).toBeInTheDocument();
      expect(screen.queryByTestId('faq2-content')).not.toBeInTheDocument();

      // Open second FAQ (both can be open simultaneously)
      await user.click(screen.getByTestId('faq2-trigger'));
      expect(screen.getByTestId('faq1-content')).toBeInTheDocument();
      expect(screen.getByTestId('faq2-content')).toBeInTheDocument();
    });

    it('works as navigation menu', async () => {
      const user = userEvent.setup();

      const Navigation = () => (
        <nav>
          <CollapsibleRoot>
            <CollapsibleTrigger data-testid='products-trigger'>Products</CollapsibleTrigger>
            <CollapsibleContent data-testid='products-content'>
              <a href='/laptops'>Laptops</a>
              <a href='/phones'>Phones</a>
              <a href='/tablets'>Tablets</a>
            </CollapsibleContent>
          </CollapsibleRoot>

          <CollapsibleRoot>
            <CollapsibleTrigger data-testid='support-trigger'>Support</CollapsibleTrigger>
            <CollapsibleContent data-testid='support-content'>
              <a href='/help'>Help Center</a>
              <a href='/contact'>Contact Us</a>
            </CollapsibleContent>
          </CollapsibleRoot>
        </nav>
      );

      render(<Navigation />);

      await user.click(screen.getByTestId('products-trigger'));
      expect(screen.getByText('Laptops')).toBeInTheDocument();
      expect(screen.getByText('Phones')).toBeInTheDocument();
      expect(screen.getByText('Tablets')).toBeInTheDocument();
    });
  });
});
