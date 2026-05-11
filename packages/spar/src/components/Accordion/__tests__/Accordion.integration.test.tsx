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

// Complex FAQ component simulation
const FAQAccordion = () => (
  <div>
    <h1>Frequently Asked Questions</h1>
    <Accordion>
      <AccordionItem value='faq-1'>
        <AccordionHeader>
          <AccordionTrigger>How do I get started?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <p>Getting started is easy! Follow these steps:</p>
          <ol>
            <li>Sign up for an account</li>
            <li>Complete the onboarding process</li>
            <li>Explore the dashboard</li>
          </ol>
          <p>
            Need help? <a href='/support'>Contact our support team</a>.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='faq-2'>
        <AccordionHeader>
          <AccordionTrigger>What are the pricing options?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <div>
            <p>We offer several pricing tiers:</p>
            <div role='list'>
              <div role='listitem'>
                <strong>Basic</strong> - $9/month
                <button type='button'>Choose Plan</button>
              </div>
              <div role='listitem'>
                <strong>Pro</strong> - $29/month
                <button type='button'>Choose Plan</button>
              </div>
              <div role='listitem'>
                <strong>Enterprise</strong> - Custom pricing
                <button type='button'>Contact Sales</button>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='faq-3'>
        <AccordionHeader>
          <AccordionTrigger>Can I cancel anytime?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <p>
            Yes, you can cancel your subscription at any time. Your access will continue until the
            end of your current billing period.
          </p>
          <form>
            <fieldset>
              <legend>Reason for cancellation (optional)</legend>
              <label>
                <input type='radio' name='reason' value='too-expensive' />
                Too expensive
              </label>
              <label>
                <input type='radio' name='reason' value='not-using' />
                Not using enough
              </label>
              <label>
                <input type='radio' name='reason' value='other' />
                Other
              </label>
            </fieldset>
            <button type='submit'>Submit Feedback</button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

// Settings accordion with nested accordions
const SettingsAccordion = () => (
  <div>
    <h1>Settings</h1>
    <Accordion multiple>
      <AccordionItem value='account'>
        <AccordionHeader>
          <AccordionTrigger>Account Settings</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <Accordion>
            <AccordionItem value='profile'>
              <AccordionHeader level={4}>
                <AccordionTrigger>Profile Information</AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <form>
                  <input type='text' placeholder='Name' />
                  <input type='email' placeholder='Email' />
                  <button type='submit'>Save Profile</button>
                </form>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='security'>
              <AccordionHeader level={4}>
                <AccordionTrigger>Security</AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <button type='button'>Change Password</button>
                <button type='button'>Enable 2FA</button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='notifications'>
        <AccordionHeader>
          <AccordionTrigger>Notification Preferences</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <div>
            <label>
              <input type='checkbox' />
              Email notifications
            </label>
            <label>
              <input type='checkbox' />
              Push notifications
            </label>
            <label>
              <input type='checkbox' />
              SMS notifications
            </label>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

describe('Accordion Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('FAQ User Workflow', () => {
    it('should allow users to navigate through FAQ items efficiently', async () => {
      const user = userEvent.setup();
      render(<FAQAccordion />);

      // User reads the main heading
      expect(
        screen.getByRole('heading', { level: 1, name: 'Frequently Asked Questions' }),
      ).toBeInTheDocument();

      // User sees all FAQ questions
      expect(screen.getByRole('button', { name: 'How do I get started?' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'What are the pricing options?' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Can I cancel anytime?' })).toBeInTheDocument();

      // User clicks on first FAQ
      const firstFAQ = screen.getByRole('button', { name: 'How do I get started?' });
      await user.click(firstFAQ);

      // User can see the detailed answer with interactive elements
      expect(screen.getByText('Getting started is easy! Follow these steps:')).toBeInTheDocument();
      expect(screen.getByText('Sign up for an account')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Contact our support team' })).toBeInTheDocument();

      // User can interact with links in the content
      const supportLink = screen.getByRole('link', { name: 'Contact our support team' });
      expect(supportLink).toHaveAttribute('href', '/support');

      // User clicks on pricing FAQ
      const pricingFAQ = screen.getByRole('button', { name: 'What are the pricing options?' });
      await user.click(pricingFAQ);

      // First FAQ should be collapsed (single mode)
      expect(screen.queryByText('Getting started is easy!')).not.toBeInTheDocument();

      // Pricing content should be visible with actionable buttons
      expect(screen.getByText('We offer several pricing tiers:')).toBeInTheDocument();
      expect(screen.getAllByRole('button', { name: 'Choose Plan' })).toHaveLength(2);
      expect(screen.getByRole('button', { name: 'Contact Sales' })).toBeInTheDocument();

      // User can interact with pricing buttons
      const basicPlanButton = screen.getAllByRole('button', { name: 'Choose Plan' })[0];
      await user.click(basicPlanButton!);
      // In a real app, this would trigger some action
    });

    it('should handle complex form interactions within accordion content', async () => {
      const user = userEvent.setup();
      render(<FAQAccordion />);

      // User opens the cancellation FAQ
      const cancelFAQ = screen.getByRole('button', { name: 'Can I cancel anytime?' });
      await user.click(cancelFAQ);

      // User sees the cancellation information and form
      expect(screen.getByText(/Yes, you can cancel your subscription/)).toBeInTheDocument();
      expect(
        screen.getByRole('group', { name: 'Reason for cancellation (optional)' }),
      ).toBeInTheDocument();

      // User selects a reason for cancellation
      const tooExpensiveRadio = screen.getByRole('radio', { name: 'Too expensive' });
      await user.click(tooExpensiveRadio);
      expect(tooExpensiveRadio).toBeChecked();

      // User can submit the form
      const submitButton = screen.getByRole('button', { name: 'Submit Feedback' });
      expect(submitButton).toBeEnabled();
      await user.click(submitButton);
      // In a real app, this would submit the form
    });
  });

  describe('Settings Dashboard Workflow', () => {
    it('should support nested accordion navigation and complex interactions', async () => {
      const user = userEvent.setup();
      render(<SettingsAccordion />);

      // User sees the settings page
      expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();

      // User expands account settings
      const accountTrigger = screen.getByRole('button', { name: 'Account Settings' });
      await user.click(accountTrigger);

      // User sees nested accordion within account settings
      expect(screen.getByRole('button', { name: 'Profile Information' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Security' })).toBeInTheDocument();

      // User can also expand notification settings simultaneously (multiple mode)
      const notificationTrigger = screen.getByRole('button', { name: 'Notification Preferences' });
      await user.click(notificationTrigger);

      // Both sections should be expanded
      expect(accountTrigger).toHaveAttribute('aria-expanded', 'true');
      expect(notificationTrigger).toHaveAttribute('aria-expanded', 'true');

      // User interacts with notification checkboxes
      const emailNotifications = screen.getByRole('checkbox', { name: 'Email notifications' });
      await user.click(emailNotifications);
      expect(emailNotifications).toBeChecked();

      // User navigates to nested profile settings
      const profileTrigger = screen.getByRole('button', { name: 'Profile Information' });
      await user.click(profileTrigger);

      // User sees profile form
      const nameInput = screen.getByPlaceholderText('Name');
      const emailInput = screen.getByPlaceholderText('Email');
      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();

      // User fills out profile form
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john.doe@example.com');

      expect(nameInput).toHaveValue('John Doe');
      expect(emailInput).toHaveValue('john.doe@example.com');

      // User can save profile
      const saveButton = screen.getByRole('button', { name: 'Save Profile' });
      await user.click(saveButton);
    });

    it('should manage focus correctly in nested accordions', async () => {
      const user = userEvent.setup();
      render(<SettingsAccordion />);

      // Expand account settings
      const accountTrigger = screen.getByRole('button', { name: 'Account Settings' });
      await user.click(accountTrigger);

      // Focus should remain on the trigger after expansion
      expect(accountTrigger).toHaveFocus();

      // Tab to first nested accordion trigger
      await user.tab();
      expect(screen.getByRole('button', { name: 'Profile Information' })).toHaveFocus();

      // Activate nested accordion with keyboard
      await user.keyboard('{Enter}');
      expect(screen.getByRole('button', { name: 'Profile Information' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );

      // Tab should navigate through form elements
      await user.tab();
      expect(screen.getByPlaceholderText('Name')).toHaveFocus();

      await user.tab();
      expect(screen.getByPlaceholderText('Email')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Save Profile' })).toHaveFocus();

      // Tab should move to next nested accordion trigger
      await user.tab();
      expect(screen.getByRole('button', { name: 'Security' })).toHaveFocus();
    });
  });

  describe('Progressive Enhancement Workflow', () => {
    it('should work correctly when accordion items are dynamically added', async () => {
      const user = userEvent.setup();
      const DynamicAccordion = () => {
        const [items, setItems] = React.useState(['item-1', 'item-2']);

        return (
          <div>
            <button type='button' onClick={() => setItems([...items, `item-${items.length + 1}`])}>
              Add Item
            </button>
            <Accordion multiple>
              {items.map((itemId, index) => (
                <AccordionItem key={itemId} value={itemId}>
                  <AccordionHeader>
                    <AccordionTrigger>Item {index + 1}</AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent>Content for item {index + 1}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        );
      };

      render(<DynamicAccordion />);

      // Initially 2 items
      expect(
        screen.getAllByRole('button').filter((btn) => btn.textContent?.startsWith('Item')),
      ).toHaveLength(2);

      // Add a new item
      const addButton = screen.getByRole('button', { name: 'Add Item' });
      await user.click(addButton);

      // Should now have 3 items
      expect(
        screen.getAllByRole('button').filter((btn) => btn.textContent?.startsWith('Item')),
      ).toHaveLength(3);

      // New item should be fully functional
      const newItem = screen.getByRole('button', { name: 'Item 3' });
      await user.click(newItem);
      expect(newItem).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content for item 3')).toBeInTheDocument();
    });

    it('should handle accordion state persistence across re-renders', async () => {
      const user = userEvent.setup();
      const StatefulAccordion = () => {
        const [count, setCount] = React.useState(0);

        return (
          <div>
            <button type='button' onClick={() => setCount(count + 1)}>
              Re-render ({count})
            </button>
            <Accordion multiple defaultValue={['item-1']}>
              <AccordionItem value='item-1'>
                <AccordionHeader>
                  <AccordionTrigger>Persistent Item 1</AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>Persistent content 1</AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-2'>
                <AccordionHeader>
                  <AccordionTrigger>Persistent Item 2</AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>Persistent content 2</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        );
      };

      render(<StatefulAccordion />);

      // Initially item 1 is expanded due to defaultValue
      const item1Trigger = screen.getByRole('button', { name: 'Persistent Item 1' });
      const item2Trigger = screen.getByRole('button', { name: 'Persistent Item 2' });

      expect(item1Trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Persistent content 1')).toBeInTheDocument();

      // Expand second item
      await user.click(item2Trigger);
      expect(item2Trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Persistent content 2')).toBeInTheDocument();

      // Force re-render
      const reRenderButton = screen.getByRole('button', { name: 'Re-render (0)' });
      await user.click(reRenderButton);

      // State should persist after re-render
      expect(screen.getByRole('button', { name: 'Persistent Item 1' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByRole('button', { name: 'Persistent Item 2' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByText('Persistent content 1')).toBeInTheDocument();
      expect(screen.getByText('Persistent content 2')).toBeInTheDocument();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing accordion context gracefully in development', () => {
      // Suppress console errors for this test
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const BrokenComponent = () => {
        return (
          <div>
            <AccordionItem value='broken'>
              <AccordionTrigger>This will throw</AccordionTrigger>
            </AccordionItem>
          </div>
        );
      };

      expect(() => render(<BrokenComponent />)).toThrow(
        'Accordion components must be used within an Accordion',
      );
      jest.restoreAllMocks();
    });

    it('should handle accordion with conditional rendering', async () => {
      const user = userEvent.setup();
      const ConditionalAccordion = () => {
        const [showSecondItem, setShowSecondItem] = React.useState(true);

        return (
          <div>
            <button type='button' onClick={() => setShowSecondItem(!showSecondItem)}>
              Toggle Second Item
            </button>
            <Accordion>
              <AccordionItem value='item-1'>
                <AccordionHeader>
                  <AccordionTrigger>Always Visible</AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>Always visible content</AccordionContent>
              </AccordionItem>
              {showSecondItem && (
                <AccordionItem value='item-2'>
                  <AccordionHeader>
                    <AccordionTrigger>Conditionally Visible</AccordionTrigger>
                  </AccordionHeader>
                  <AccordionContent>Conditionally visible content</AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        );
      };

      render(<ConditionalAccordion />);

      // Initially both items are visible
      expect(screen.getByRole('button', { name: 'Always Visible' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Conditionally Visible' })).toBeInTheDocument();

      // Expand the conditional item
      const conditionalTrigger = screen.getByRole('button', { name: 'Conditionally Visible' });
      await user.click(conditionalTrigger);
      expect(screen.getByText('Conditionally visible content')).toBeInTheDocument();

      // Hide the conditional item
      const toggleButton = screen.getByRole('button', { name: 'Toggle Second Item' });
      await user.click(toggleButton);

      // Conditional item should be gone
      expect(
        screen.queryByRole('button', { name: 'Conditionally Visible' }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Conditionally visible content')).not.toBeInTheDocument();

      // Show it again
      await user.click(toggleButton);
      expect(screen.getByRole('button', { name: 'Conditionally Visible' })).toBeInTheDocument();
    });
  });

  describe('Performance and Accessibility Integration', () => {
    it('should render and interact with a large number of accordion items', async () => {
      const user = userEvent.setup();

      const LargeAccordion = () => (
        <Accordion>
          {Array.from({ length: 50 }, (_, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionHeader>
                <AccordionTrigger>Item {i + 1}</AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>Content for item {i + 1}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );

      render(<LargeAccordion />);

      // All items should be rendered
      expect(screen.getAllByRole('button')).toHaveLength(50);

      const lastTrigger = screen.getByRole('button', { name: 'Item 50' });
      await user.click(lastTrigger);
      expect(lastTrigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Content for item 50')).toBeInTheDocument();
    });

    it('should support complex real-world usage patterns', async () => {
      const user = userEvent.setup();

      // Simulate a complex component that might be used in production
      const ComplexAccordion = () => (
        <div>
          <nav aria-label='Table of contents'>
            <Accordion multiple>
              <AccordionItem value='chapter-1'>
                <AccordionHeader level={2}>
                  <AccordionTrigger>Chapter 1: Introduction</AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <Accordion>
                    <AccordionItem value='section-1-1'>
                      <AccordionHeader level={3}>
                        <AccordionTrigger>1.1 Overview</AccordionTrigger>
                      </AccordionHeader>
                      <AccordionContent>
                        <p>
                          Overview content with <a href='#ref1'>reference</a>.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='section-1-2'>
                      <AccordionHeader level={3}>
                        <AccordionTrigger>1.2 Getting Started</AccordionTrigger>
                      </AccordionHeader>
                      <AccordionContent>
                        <ol>
                          <li>Step one</li>
                          <li>Step two</li>
                          <li>Step three</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='chapter-2'>
                <AccordionHeader level={2}>
                  <AccordionTrigger>Chapter 2: Advanced Topics</AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <p>Advanced content...</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        </div>
      );

      render(<ComplexAccordion />);

      // Navigate through the complex nested structure
      const chapter1 = screen.getByRole('button', { name: 'Chapter 1: Introduction' });
      await user.click(chapter1);

      const section11 = screen.getByRole('button', { name: '1.1 Overview' });
      await user.click(section11);

      // User can interact with content within deeply nested accordions
      const reference = screen.getByRole('link', { name: 'reference' });
      expect(reference).toBeInTheDocument();
      expect(reference).toHaveAttribute('href', '#ref1');

      // Keyboard navigation should work through the complex structure
      const section12 = screen.getByRole('button', { name: '1.2 Getting Started' });
      section12.focus();
      await user.keyboard('{Enter}');
      expect(screen.getByText('Step one')).toBeInTheDocument();
    });
  });
});
