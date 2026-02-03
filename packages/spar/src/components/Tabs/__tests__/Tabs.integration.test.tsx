import React, { useState, useRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '../index';

// Complex integration scenarios
const FormTabs = () => {
  const [formData, setFormData] = useState({
    personal: { name: '', email: '' },
    address: { street: '', city: '' },
    review: { confirmed: false },
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePersonal = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.personal.name) newErrors.name = 'Name is required';
    if (!formData.personal.email) newErrors.email = 'Email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeTab === 'personal' && validatePersonal()) {
      setActiveTab('address');
    } else if (activeTab === 'address') {
      setActiveTab('review');
    }
  };

  return (
    <div>
      <TabsRoot value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='personal'>Personal Info</TabsTrigger>
          <TabsTrigger value='address' disabled={!formData.personal.name}>
            Address
          </TabsTrigger>
          <TabsTrigger value='review' disabled={!formData.address.street}>
            Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value='personal'>
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor='name'>Name</label>
              <input
                id='name'
                value={formData.personal.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, name: e.target.value },
                  }))
                }
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <div id='name-error' role='alert'>
                  {errors.name}
                </div>
              )}
            </div>
            <div>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                type='email'
                value={formData.personal.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    personal: { ...prev.personal, email: e.target.value },
                  }))
                }
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <div id='email-error' role='alert'>
                  {errors.email}
                </div>
              )}
            </div>
            <button type='button' onClick={handleNext}>
              Next
            </button>
          </form>
        </TabsContent>

        <TabsContent value='address'>
          <form>
            <div>
              <label htmlFor='street'>Street</label>
              <input
                id='street'
                value={formData.address.street}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor='city'>City</label>
              <input
                id='city'
                value={formData.address.city}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value },
                  }))
                }
              />
            </div>
            <button type='button' onClick={() => setActiveTab('personal')}>
              Back
            </button>
            <button type='button' onClick={handleNext}>
              Next
            </button>
          </form>
        </TabsContent>

        <TabsContent value='review'>
          <div>
            <h3>Review Your Information</h3>
            <p>Name: {formData.personal.name}</p>
            <p>Email: {formData.personal.email}</p>
            <p>Street: {formData.address.street}</p>
            <p>City: {formData.address.city}</p>
            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  review: { confirmed: true },
                }))
              }
            >
              Confirm
            </button>
          </div>
        </TabsContent>
      </TabsRoot>

      {formData.review.confirmed && (
        <div role='status' aria-live='polite'>
          Form submitted successfully!
        </div>
      )}
    </div>
  );
};

const AsyncContentTabs = () => {
  const [loadingTab, setLoadingTab] = useState<string | null>(null);
  const [loadedContent, setLoadedContent] = useState<Record<string, string>>({});
  const hasInitializedRef = useRef(false);

  const simulateAsyncLoad = async (tabValue: string) => {
    setLoadingTab(tabValue);
    await new Promise((resolve) => setTimeout(resolve, 100));
    setLoadedContent((prev) => ({
      ...prev,
      [tabValue]: `Loaded content for ${tabValue}`,
    }));
    setLoadingTab(null);
  };

  return (
    <TabsRoot
      onValueChange={(value) => {
        // Skip loading on initial auto-selection
        if (!hasInitializedRef.current) {
          hasInitializedRef.current = true;
          return;
        }
        if (!loadedContent[value]) {
          simulateAsyncLoad(value);
        }
      }}
    >
      <TabsList>
        <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
        <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
        <TabsTrigger value='tab3'>Tab 3</TabsTrigger>
      </TabsList>

      <TabsContent value='tab1'>
        {loadingTab === 'tab1' ? (
          <div role='status' aria-live='polite'>
            Loading...
          </div>
        ) : (
          <div>{loadedContent.tab1 || 'Initial content for tab 1'}</div>
        )}
      </TabsContent>

      <TabsContent value='tab2'>
        {loadingTab === 'tab2' ? (
          <div role='status' aria-live='polite'>
            Loading...
          </div>
        ) : (
          <div>{loadedContent.tab2 || 'Click to load content'}</div>
        )}
      </TabsContent>

      <TabsContent value='tab3'>
        {loadingTab === 'tab3' ? (
          <div role='status' aria-live='polite'>
            Loading...
          </div>
        ) : (
          <div>{loadedContent.tab3 || 'Click to load content'}</div>
        )}
      </TabsContent>
    </TabsRoot>
  );
};

const NestedTabsExample = () => {
  return (
    <TabsRoot defaultValue='main1'>
      <TabsList>
        <TabsTrigger value='main1'>Main 1</TabsTrigger>
        <TabsTrigger value='main2'>Main 2</TabsTrigger>
      </TabsList>

      <TabsContent value='main1'>
        <div>
          <h3>Main Content 1</h3>
          <TabsRoot defaultValue='sub1a'>
            <TabsList>
              <TabsTrigger value='sub1a'>Sub 1A</TabsTrigger>
              <TabsTrigger value='sub1b'>Sub 1B</TabsTrigger>
            </TabsList>
            <TabsContent value='sub1a'>Nested content 1A</TabsContent>
            <TabsContent value='sub1b'>Nested content 1B</TabsContent>
          </TabsRoot>
        </div>
      </TabsContent>

      <TabsContent value='main2'>
        <div>
          <h3>Main Content 2</h3>
          <TabsRoot defaultValue='sub2a'>
            <TabsList>
              <TabsTrigger value='sub2a'>Sub 2A</TabsTrigger>
              <TabsTrigger value='sub2b'>Sub 2B</TabsTrigger>
            </TabsList>
            <TabsContent value='sub2a'>Nested content 2A</TabsContent>
            <TabsContent value='sub2b'>Nested content 2B</TabsContent>
          </TabsRoot>
        </div>
      </TabsContent>
    </TabsRoot>
  );
};

describe('Tabs Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Integration', () => {
    it('integrates with form workflows and validation', async () => {
      const user = userEvent.setup();
      render(<FormTabs />);

      // Initial state - address and review should be disabled
      expect(screen.getByRole('tab', { name: 'Personal Info' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(screen.getByRole('tab', { name: 'Address' })).toBeDisabled();
      expect(screen.getByRole('tab', { name: 'Review' })).toBeDisabled();

      // Try to proceed without filling required fields
      await user.click(screen.getByRole('button', { name: 'Next' }));

      // Should show validation errors
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();

      // Fill in name and email
      await user.type(screen.getByLabelText('Name'), 'John Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');

      // Now next should work
      await user.click(screen.getByRole('button', { name: 'Next' }));

      expect(screen.getByRole('tab', { name: 'Address' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByLabelText('Street')).toBeInTheDocument();
    });

    it('handles cross-tab state management', async () => {
      const user = userEvent.setup();
      render(<FormTabs />);

      // Fill personal info
      await user.type(screen.getByLabelText('Name'), 'Jane Smith');
      await user.type(screen.getByLabelText('Email'), 'jane@example.com');
      await user.click(screen.getByRole('button', { name: 'Next' }));

      // Fill address
      await user.type(screen.getByLabelText('Street'), '123 Main St');
      await user.type(screen.getByLabelText('City'), 'Anytown');
      await user.click(screen.getByRole('button', { name: 'Next' }));

      // Verify review page shows all data
      expect(screen.getByText('Name: Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Email: jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Street: 123 Main St')).toBeInTheDocument();
      expect(screen.getByText('City: Anytown')).toBeInTheDocument();
    });

    it('handles navigation between form steps', async () => {
      const user = userEvent.setup();
      render(<FormTabs />);

      // Fill personal info and advance
      await user.type(screen.getByLabelText('Name'), 'Test User');
      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.click(screen.getByRole('button', { name: 'Next' }));

      // Go back to personal info
      await user.click(screen.getByRole('button', { name: 'Back' }));

      expect(screen.getByRole('tab', { name: 'Personal Info' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });

    it('shows completion message after form submission', async () => {
      const user = userEvent.setup();
      render(<FormTabs />);

      // Complete the entire flow
      await user.type(screen.getByLabelText('Name'), 'Complete User');
      await user.type(screen.getByLabelText('Email'), 'complete@example.com');
      await user.click(screen.getByRole('button', { name: 'Next' }));

      await user.type(screen.getByLabelText('Street'), '456 Oak Ave');
      await user.type(screen.getByLabelText('City'), 'Springfield');
      await user.click(screen.getByRole('button', { name: 'Next' }));

      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
    });
  });

  describe('Async Content Loading', () => {
    it('handles async content loading on tab change', async () => {
      const user = userEvent.setup();
      render(<AsyncContentTabs />);

      expect(screen.getByText('Initial content for tab 1')).toBeInTheDocument();

      // Switch to tab 2
      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      // Should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Wait for content to load
      await waitFor(
        () => {
          expect(screen.getByText('Loaded content for tab2')).toBeInTheDocument();
        },
        { timeout: 200 },
      );
    });

    it('caches loaded content across tab switches', async () => {
      const user = userEvent.setup();
      render(<AsyncContentTabs />);

      // Load tab 2
      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
      await waitFor(() => {
        expect(screen.getByText('Loaded content for tab2')).toBeInTheDocument();
      });

      // Switch to tab 1 and back to tab 2
      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));
      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      // Should show cached content immediately (no loading state)
      expect(screen.getByText('Loaded content for tab2')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('announces loading states to screen readers', async () => {
      const user = userEvent.setup();
      render(<AsyncContentTabs />);

      await user.click(screen.getByRole('tab', { name: 'Tab 3' }));

      const loadingElement = screen.getByText('Loading...');
      expect(loadingElement).toHaveAttribute('role', 'status');
      expect(loadingElement).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Nested Tabs', () => {
    it('handles nested tab components independently', async () => {
      const user = userEvent.setup();
      render(<NestedTabsExample />);

      // Main tabs should be independent of nested tabs
      expect(screen.getByRole('tab', { name: 'Main 1' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Nested content 1A')).toBeInTheDocument();

      // Switch nested tab
      await user.click(screen.getByRole('tab', { name: 'Sub 1B' }));
      expect(screen.getByText('Nested content 1B')).toBeInTheDocument();

      // Switch main tab
      await user.click(screen.getByRole('tab', { name: 'Main 2' }));
      expect(screen.getByText('Nested content 2A')).toBeInTheDocument();
    });

    it('maintains independent keyboard navigation in nested tabs', async () => {
      const user = userEvent.setup();
      render(<NestedTabsExample />);

      // Focus on main tabs
      await user.tab();
      expect(screen.getByRole('tab', { name: 'Main 1' })).toHaveFocus();

      // Click on nested tab to focus it
      await user.click(screen.getByRole('tab', { name: 'Sub 1A' }));
      expect(screen.getByRole('tab', { name: 'Sub 1A' })).toHaveFocus();

      // Arrow navigation in nested tabs should work independently
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Sub 1B' })).toHaveFocus();
    });
  });

  describe('Event Handling', () => {
    it('handles complex event delegation and propagation', async () => {
      const user = userEvent.setup();
      const onTabsClick = jest.fn();
      const onListClick = jest.fn();
      const onTriggerClick = jest.fn();

      render(
        <div onClick={onTabsClick}>
          <TabsRoot>
            <TabsList onClick={onListClick}>
              <TabsTrigger value='tab1' onClick={onTriggerClick}>
                Tab 1
              </TabsTrigger>
              <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value='tab1'>Content 1</TabsContent>
            <TabsContent value='tab2'>Content 2</TabsContent>
          </TabsRoot>
        </div>,
      );

      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));

      expect(onTriggerClick).toHaveBeenCalled();
      expect(onListClick).toHaveBeenCalled();
      expect(onTabsClick).toHaveBeenCalled();
    });

    it('supports stopping event propagation', async () => {
      const user = userEvent.setup();
      const onParentClick = jest.fn();
      const onTriggerClick = jest.fn((e) => e.stopPropagation());

      render(
        <div onClick={onParentClick}>
          <TabsRoot>
            <TabsList>
              <TabsTrigger value='tab1' onClick={onTriggerClick}>
                Tab 1
              </TabsTrigger>
            </TabsList>
            <TabsContent value='tab1'>Content 1</TabsContent>
          </TabsRoot>
        </div>,
      );

      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));

      expect(onTriggerClick).toHaveBeenCalled();
      expect(onParentClick).not.toHaveBeenCalled();
    });
  });

  describe('Performance and Re-rendering', () => {
    it('minimizes re-renders during tab switching', async () => {
      const user = userEvent.setup();
      let renderCount = 0;

      const TestContent = ({ children }: { children: React.ReactNode }) => {
        renderCount++;
        return <div>{children}</div>;
      };

      render(
        <TabsRoot>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>
            <TestContent>Content 1</TestContent>
          </TabsContent>
          <TabsContent value='tab2'>
            <TestContent>Content 2</TestContent>
          </TabsContent>
        </TabsRoot>,
      );

      const initialRenderCount = renderCount;

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      // Should only render the newly active content
      expect(renderCount).toBeGreaterThan(initialRenderCount);
      expect(renderCount).toBeLessThan(initialRenderCount + 3); // Reasonable limit
    });

    it('handles rapid tab switching without issues', async () => {
      const user = userEvent.setup();
      const onValueChange = jest.fn();

      render(
        <TabsRoot onValueChange={onValueChange}>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
            <TabsTrigger value='tab3'>Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
          <TabsContent value='tab3'>Content 3</TabsContent>
        </TabsRoot>,
      );

      // Clear any initial auto-selection calls
      onValueChange.mockClear();

      // Rapidly switch between tabs
      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
      await user.click(screen.getByRole('tab', { name: 'Tab 3' }));
      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));

      expect(onValueChange).toHaveBeenCalledTimes(3);
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('works with router integration pattern', async () => {
      const user = userEvent.setup();
      const mockPushState = jest.fn();

      // Mock history API
      Object.defineProperty(window, 'history', {
        value: {
          pushState: mockPushState,
          replaceState: jest.fn(),
        },
        writable: true,
      });

      const RouterTabs = () => {
        const [currentTab, setCurrentTab] = useState('home');

        const handleTabChange = (value: string) => {
          setCurrentTab(value);
          mockPushState(null, '', `/tabs/${value}`);
        };

        return (
          <TabsRoot value={currentTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value='home'>Home</TabsTrigger>
              <TabsTrigger value='about'>About</TabsTrigger>
              <TabsTrigger value='contact'>Contact</TabsTrigger>
            </TabsList>
            <TabsContent value='home'>Home page content</TabsContent>
            <TabsContent value='about'>About page content</TabsContent>
            <TabsContent value='contact'>Contact page content</TabsContent>
          </TabsRoot>
        );
      };

      render(<RouterTabs />);

      await user.click(screen.getByRole('tab', { name: 'About' }));

      expect(mockPushState).toHaveBeenCalledWith(null, '', '/tabs/about');
      expect(screen.getByText('About page content')).toBeInTheDocument();
    });

    it('handles dynamic tab content updates', async () => {
      const user = userEvent.setup();

      const DynamicTabs = () => {
        const [items, setItems] = useState(['Item 1', 'Item 2']);
        const [selectedTab, setSelectedTab] = useState('item-0');

        const addItem = () => {
          const newIndex = items.length;
          setItems([...items, `Item ${newIndex + 1}`]);
          setSelectedTab(`item-${newIndex}`);
        };

        return (
          <div>
            <button onClick={addItem}>Add Tab</button>
            <TabsRoot value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                {items.map((item, index) => (
                  <TabsTrigger key={index} value={`item-${index}`}>
                    {item}
                  </TabsTrigger>
                ))}
              </TabsList>
              {items.map((item, index) => (
                <TabsContent key={index} value={`item-${index}`}>
                  Content for {item}
                </TabsContent>
              ))}
            </TabsRoot>
          </div>
        );
      };

      render(<DynamicTabs />);

      expect(screen.getAllByRole('tab')).toHaveLength(2);

      await user.click(screen.getByRole('button', { name: 'Add Tab' }));

      expect(screen.getAllByRole('tab')).toHaveLength(3);
      expect(screen.getByRole('tab', { name: 'Item 3' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Content for Item 3')).toBeInTheDocument();
    });
  });
});
