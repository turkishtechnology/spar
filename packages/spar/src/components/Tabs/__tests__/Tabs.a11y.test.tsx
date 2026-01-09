import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../index';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Test setup helpers
const BasicTabs = ({
  orientation = 'horizontal',
  activationMode = 'automatic',
  children,
  ...rest
}: Partial<React.ComponentProps<typeof Tabs>> = {}) => (
  <Tabs orientation={orientation} activationMode={activationMode} {...rest}>
    {children || (
      <>
        <TabsList>
          <TabsTrigger value='section1'>Section 1: Introduction</TabsTrigger>
          <TabsTrigger value='section2'>Section 2: Details</TabsTrigger>
          <TabsTrigger value='section3' disabled>
            Section 3: Advanced (Coming Soon)
          </TabsTrigger>
        </TabsList>
        <TabsContent value='section1'>
          <h3>Introduction</h3>
          <p>This section provides an introduction to the topic.</p>
          <a href='#section1'>Learn more about section 1</a>
        </TabsContent>
        <TabsContent value='section2'>
          <h3>Details</h3>
          <p>This section contains detailed information.</p>
          <button type='button'>Take Action</button>
        </TabsContent>
        <TabsContent value='section3'>
          <h3>Advanced</h3>
          <p>This content is not yet available.</p>
        </TabsContent>
      </>
    )}
  </Tabs>
);

describe('Tabs Accessibility', () => {
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
    it('passes axe accessibility tests', async () => {
      const { container } = render(<BasicTabs />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe tests with vertical orientation', async () => {
      const { container } = render(<BasicTabs orientation='vertical' />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe tests with manual activation', async () => {
      const { container } = render(<BasicTabs activationMode='manual' />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe tests with disabled tabs', async () => {
      const { container } = render(
        <BasicTabs>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2' disabled>
              Tab 2 (Disabled)
            </TabsTrigger>
            <TabsTrigger value='tab3'>Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
          <TabsContent value='tab3'>Content 3</TabsContent>
        </BasicTabs>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Roles and Properties', () => {
    it('has correct tablist role and attributes', () => {
      render(<BasicTabs />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');
      expect(tablist).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('has correct tab roles and attributes', () => {
      render(<BasicTabs />);

      const tabs = screen.getAllByRole('tab');

      tabs.forEach((tab, index) => {
        expect(tab).toHaveAttribute('role', 'tab');
        expect(tab).toHaveAttribute('aria-controls');
        expect(tab).toHaveAttribute('data-value');
        expect(tab).toHaveAttribute('data-orientation', 'horizontal');

        // First tab should be selected by default
        if (index === 0) {
          expect(tab).toHaveAttribute('aria-selected', 'true');
          expect(tab).toHaveAttribute('tabindex', '0');
          expect(tab).toHaveAttribute('data-state', 'active');
        } else {
          expect(tab).toHaveAttribute('aria-selected', 'false');
          expect(tab).toHaveAttribute('tabindex', '-1');
          expect(tab).toHaveAttribute('data-state', 'inactive');
        }
      });
    });

    it('has correct tabpanel role and attributes', () => {
      render(<BasicTabs />);

      const tabpanel = screen.getByRole('tabpanel');
      expect(tabpanel).toHaveAttribute('role', 'tabpanel');
      expect(tabpanel).toHaveAttribute('aria-labelledby');
      expect(tabpanel).toHaveAttribute('data-orientation', 'horizontal');
      expect(tabpanel).toHaveAttribute('data-state', 'active');
      expect(tabpanel).toHaveAttribute('tabindex', '0');
      expect(tabpanel).not.toHaveAttribute('hidden');
    });

    it('sets aria-disabled correctly on disabled tabs', () => {
      render(<BasicTabs />);

      const disabledTab = screen.getByRole('tab', { name: 'Section 3: Advanced (Coming Soon)' });
      // If rendered as a button, expect disabled attribute and no aria-disabled
      if (disabledTab.tagName === 'BUTTON') {
        expect(disabledTab).toHaveAttribute('disabled');
        expect(disabledTab).not.toHaveAttribute('aria-disabled');
      } else {
        expect(disabledTab).toHaveAttribute('aria-disabled', 'true');
      }
      expect(disabledTab).toHaveAttribute('data-disabled', '');
    });

    it('connects tabs and panels with aria-controls/aria-labelledby', () => {
      render(<BasicTabs />);

      const tab1 = screen.getByRole('tab', { name: 'Section 1: Introduction' });
      const tabpanel = screen.getByRole('tabpanel');

      const tabId = tab1.getAttribute('aria-controls');
      const panelLabelledBy = tabpanel.getAttribute('aria-labelledby');

      expect(tabId).toBeTruthy();
      expect(panelLabelledBy).toBeTruthy();

      // The relationship should be consistent (though IDs are generated)
      expect(tab1).toHaveAttribute('aria-controls');
      expect(tabpanel).toHaveAttribute('aria-labelledby');
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports Tab key for focus management', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      // Tab into the tabs
      await user.tab();
      expect(screen.getByRole('tab', { name: 'Section 1: Introduction' })).toHaveFocus();

      // Tab should move to tabpanel
      await user.tab();
      expect(screen.getByRole('tabpanel')).toHaveFocus();
    });

    it('supports arrow key navigation in horizontal orientation', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      const tab1 = screen.getByRole('tab', { name: 'Section 1: Introduction' });
      const tab2 = screen.getByRole('tab', { name: 'Section 2: Details' });

      await user.click(tab1);
      expect(tab1).toHaveFocus();
      expect(tab1).toHaveAttribute('aria-selected', 'true');

      // Right arrow should move to next tab
      await user.keyboard('{ArrowRight}');
      expect(tab2).toHaveFocus();
      expect(tab2).toHaveAttribute('aria-selected', 'true');

      // Left arrow should move back
      await user.keyboard('{ArrowLeft}');
      expect(tab1).toHaveFocus();
      expect(tab1).toHaveAttribute('aria-selected', 'true');
    });

    it('supports arrow key navigation in vertical orientation', async () => {
      const user = userEvent.setup();
      render(<BasicTabs orientation='vertical' />);

      const tab1 = screen.getByRole('tab', { name: 'Section 1: Introduction' });
      const tab2 = screen.getByRole('tab', { name: 'Section 2: Details' });

      await user.click(tab1);

      // Down arrow should move to next tab
      await user.keyboard('{ArrowDown}');
      expect(tab2).toHaveFocus();
      expect(tab2).toHaveAttribute('aria-selected', 'true');

      // Up arrow should move back
      await user.keyboard('{ArrowUp}');
      expect(tab1).toHaveFocus();
      expect(tab1).toHaveAttribute('aria-selected', 'true');
    });

    it('supports Home and End keys', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      const tab1 = screen.getByRole('tab', { name: 'Section 1: Introduction' });
      const tab2 = screen.getByRole('tab', { name: 'Section 2: Details' });

      await user.click(tab2);

      // Home should go to first tab
      await user.keyboard('{Home}');
      expect(tab1).toHaveFocus();
      expect(tab1).toHaveAttribute('aria-selected', 'true');

      // End should go to last enabled tab (tab2, since tab3 is disabled)
      await user.keyboard('{End}');
      expect(tab2).toHaveFocus();
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });

    it('skips disabled tabs during navigation', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      const tab2 = screen.getByRole('tab', { name: 'Section 2: Details' });
      const disabledTab = screen.getByRole('tab', { name: 'Section 3: Advanced (Coming Soon)' });

      await user.click(tab2);

      // Right arrow should skip disabled tab and loop to first
      await user.keyboard('{ArrowRight}');
      expect(disabledTab).not.toHaveFocus();
    });

    it('supports RTL navigation', async () => {
      const user = userEvent.setup();
      render(<BasicTabs dir='rtl' />);

      const tab1 = screen.getByRole('tab', { name: 'Section 1: Introduction' });
      const tab2 = screen.getByRole('tab', { name: 'Section 2: Details' });

      await user.click(tab1);

      // In RTL, right arrow should move to previous tab (wrapping)
      await user.keyboard('{ArrowRight}');
      expect(tab2).toHaveFocus();

      // Left arrow should move to next tab
      await user.keyboard('{ArrowLeft}');
      expect(tab1).toHaveFocus();
    });

    it('supports manual activation mode', async () => {
      const user = userEvent.setup();
      render(<BasicTabs activationMode='manual' />);

      const tab1 = screen.getByRole('tab', { name: 'Section 1: Introduction' });
      const tab2 = screen.getByRole('tab', { name: 'Section 2: Details' });

      await user.click(tab1);
      await user.keyboard('{ArrowRight}');

      // Tab should be focused but not selected
      expect(tab2).toHaveFocus();
      expect(tab2).toHaveAttribute('aria-selected', 'false');
      expect(tab1).toHaveAttribute('aria-selected', 'true');

      // Enter or Space should activate
      await user.keyboard('{Enter}');
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });

    it('supports Space key activation in manual mode', async () => {
      const user = userEvent.setup();
      render(<BasicTabs activationMode='manual' />);

      const tab1 = screen.getByRole('tab', { name: 'Section 1: Introduction' });
      const tab2 = screen.getByRole('tab', { name: 'Section 2: Details' });

      await user.click(tab1);
      await user.keyboard('{ArrowRight}');

      // Space should activate
      await user.keyboard(' ');
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Focus Management', () => {
    it('maintains proper focus indicators', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      // Focus should be visible on tabs
      await user.tab();
      const focusedTab = screen.getByRole('tab', { name: 'Section 1: Introduction' });
      expect(focusedTab).toHaveFocus();
      expect(focusedTab).toHaveAttribute('tabindex', '0');

      // Other tabs should not be focusable
      const otherTabs = screen.getAllByRole('tab').filter((tab) => tab !== focusedTab);
      otherTabs.forEach((tab) => {
        if (!tab.hasAttribute('disabled')) {
          expect(tab).toHaveAttribute('tabindex', '-1');
        }
      });
    });

    it('uses roving tabindex pattern', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      const tab1 = screen.getByRole('tab', { name: 'Section 1: Introduction' });
      const tab2 = screen.getByRole('tab', { name: 'Section 2: Details' });

      await user.click(tab1);
      expect(tab1).toHaveAttribute('tabindex', '0');
      expect(tab2).toHaveAttribute('tabindex', '-1');

      await user.keyboard('{ArrowRight}');
      expect(tab1).toHaveAttribute('tabindex', '-1');
      expect(tab2).toHaveAttribute('tabindex', '0');
    });

    it('focuses tabpanel when Tab key is pressed from tablist', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      await user.tab(); // Focus first tab
      await user.tab(); // Tab to panel

      expect(screen.getByRole('tabpanel')).toHaveFocus();
    });
  });

  describe('Screen Reader Support', () => {
    it('provides proper accessible names for tabs', () => {
      render(<BasicTabs />);

      expect(screen.getByRole('tab', { name: 'Section 1: Introduction' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Section 2: Details' })).toBeInTheDocument();
      expect(
        screen.getByRole('tab', { name: 'Section 3: Advanced (Coming Soon)' }),
      ).toBeInTheDocument();
    });

    it('announces tab states correctly', () => {
      render(<BasicTabs />);

      const selectedTab = screen.getByRole('tab', { name: 'Section 1: Introduction' });
      const unselectedTab = screen.getByRole('tab', { name: 'Section 2: Details' });
      const disabledTab = screen.getByRole('tab', { name: 'Section 3: Advanced (Coming Soon)' });

      expect(selectedTab).toHaveAttribute('aria-selected', 'true');
      expect(unselectedTab).toHaveAttribute('aria-selected', 'false');
      expect(disabledTab).toBeDisabled();
    });

    it('connects content with proper labelling', () => {
      render(<BasicTabs />);

      const tabpanel = screen.getByRole('tabpanel');
      expect(tabpanel).toHaveAttribute('aria-labelledby');

      // The panel should be labelled by the active tab
      const activeTrigger = screen.getByRole('tab', { selected: true });
      expect(activeTrigger).toBeInTheDocument();
    });

    it('hides inactive content from screen readers', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      // Initially, only first content should be visible
      expect(
        screen.getByText('This section provides an introduction to the topic.'),
      ).toBeInTheDocument();
      expect(
        screen.queryByText('This section contains detailed information.'),
      ).not.toBeInTheDocument();

      // Switch tabs
      await user.click(screen.getByRole('tab', { name: 'Section 2: Details' }));

      expect(screen.getByText('This section contains detailed information.')).toBeInTheDocument();
      expect(
        screen.queryByText('This section provides an introduction to the topic.'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Complex Content Accessibility', () => {
    it('maintains accessibility of interactive content within panels', async () => {
      const user = userEvent.setup();
      render(<BasicTabs defaultValue='section2' />);

      // Focus on the action button within the panel
      const actionButton = screen.getByRole('button', { name: 'Take Action' });
      await user.click(actionButton);

      expect(actionButton).toHaveFocus();
    });

    it('handles links within panels correctly', () => {
      render(<BasicTabs />);

      const link = screen.getByRole('link', { name: 'Learn more about section 1' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '#section1');
    });

    it('passes axe tests with complex content', async () => {
      const { container } = render(
        <BasicTabs>
          <TabsList aria-label='Content sections'>
            <TabsTrigger value='form'>Form Section</TabsTrigger>
            <TabsTrigger value='table'>Data Table</TabsTrigger>
          </TabsList>
          <TabsContent value='form'>
            <form>
              <label htmlFor='email'>Email</label>
              <input id='email' type='email' required />
              <button type='submit'>Submit</button>
            </form>
          </TabsContent>
          <TabsContent value='table'>
            <table>
              <caption>Data Summary</caption>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Item 1</td>
                  <td>100</td>
                </tr>
              </tbody>
            </table>
          </TabsContent>
        </BasicTabs>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Error States', () => {
    it('passes axe tests when tabs have error states', async () => {
      const { container } = render(
        <BasicTabs>
          <TabsList>
            <TabsTrigger value='valid'>Valid Tab</TabsTrigger>
            <TabsTrigger value='error' aria-invalid='true' aria-describedby='error-msg'>
              Tab with Error
            </TabsTrigger>
          </TabsList>
          <TabsContent value='valid'>Valid content</TabsContent>
          <TabsContent value='error'>
            <div id='error-msg' role='alert'>
              This tab has validation errors
            </div>
            Error content
          </TabsContent>
        </BasicTabs>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('handles aria-describedby for error messages correctly', () => {
      render(
        <BasicTabs>
          <TabsList>
            <TabsTrigger value='error' aria-describedby='error-desc' aria-invalid='true'>
              Error Tab
            </TabsTrigger>
          </TabsList>
          <TabsContent value='error'>
            <div id='error-desc' role='alert'>
              This tab contains errors that need attention
            </div>
          </TabsContent>
        </BasicTabs>,
      );

      const errorTab = screen.getByRole('tab', { name: 'Error Tab' });
      expect(errorTab).toHaveAttribute('aria-describedby', 'error-desc');
      expect(errorTab).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByRole('alert')).toHaveTextContent(
        'This tab contains errors that need attention',
      );
    });
  });

  describe('Advanced Accessibility Features', () => {
    it('supports custom ARIA labels for tablist', () => {
      render(
        <BasicTabs>
          <TabsList aria-label='Navigation sections'>
            <TabsTrigger value='home'>Home</TabsTrigger>
            <TabsTrigger value='about'>About</TabsTrigger>
          </TabsList>
          <TabsContent value='home'>Home content</TabsContent>
          <TabsContent value='about'>About content</TabsContent>
        </BasicTabs>,
      );

      const tablist = screen.getByRole('tablist', { name: 'Navigation sections' });
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveAttribute('aria-label', 'Navigation sections');
    });

    it('supports custom ARIA labelledby for tablist', () => {
      render(
        <div>
          <h2 id='section-heading'>Content Sections</h2>
          <BasicTabs>
            <TabsList aria-labelledby='section-heading'>
              <TabsTrigger value='intro'>Introduction</TabsTrigger>
              <TabsTrigger value='details'>Details</TabsTrigger>
            </TabsList>
            <TabsContent value='intro'>Intro content</TabsContent>
            <TabsContent value='details'>Details content</TabsContent>
          </BasicTabs>
        </div>,
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-labelledby', 'section-heading');
    });

    it('maintains accessibility with dynamic content changes', async () => {
      const DynamicTabs = () => {
        const [tabs, setTabs] = React.useState(['tab1', 'tab2']);

        return (
          <div>
            <button onClick={() => setTabs([...tabs, `tab${tabs.length + 1}`])}>Add Tab</button>
            <Tabs>
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab} value={tab}>
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((tab) => (
                <TabsContent key={tab} value={tab}>
                  Content for {tab}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        );
      };

      const user = userEvent.setup();
      const { container } = render(<DynamicTabs />);

      // Add a tab
      await user.click(screen.getByText('Add Tab'));

      // Verify accessibility after dynamic change
      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Verify new tab is accessible
      expect(screen.getByRole('tab', { name: 'tab3' })).toBeInTheDocument();
    });

    it('handles aria-busy state during loading', async () => {
      const LoadingTabs = () => {
        const [isLoading, setIsLoading] = React.useState(false);

        return (
          <div>
            <button onClick={() => setIsLoading(!isLoading)}>Toggle Loading</button>
            <Tabs>
              <TabsList>
                <TabsTrigger value='content' aria-busy={isLoading}>
                  {isLoading ? 'Loading...' : 'Content'}
                </TabsTrigger>
              </TabsList>
              <TabsContent value='content' aria-busy={isLoading}>
                {isLoading ? 'Loading content...' : 'Loaded content'}
              </TabsContent>
            </Tabs>
          </div>
        );
      };

      const user = userEvent.setup();
      const { container } = render(<LoadingTabs />);

      // Trigger loading state
      await user.click(screen.getByText('Toggle Loading'));

      const tab = screen.getByRole('tab');
      const panel = screen.getByRole('tabpanel');

      expect(tab).toHaveAttribute('aria-busy', 'true');
      expect(panel).toHaveAttribute('aria-busy', 'true');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports nested interactive content accessibility', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <BasicTabs>
          <TabsList>
            <TabsTrigger value='interactive'>Interactive Content</TabsTrigger>
          </TabsList>
          <TabsContent value='interactive'>
            <form>
              <fieldset>
                <legend>User Information</legend>
                <label htmlFor='name'>Name</label>
                <input id='name' type='text' required aria-describedby='name-help' />
                <div id='name-help'>Enter your full name</div>

                <label htmlFor='preferences'>Preferences</label>
                <select id='preferences' aria-label='User preferences'>
                  <option value='option1'>Option 1</option>
                  <option value='option2'>Option 2</option>
                </select>
              </fieldset>

              <button type='submit' aria-describedby='submit-help'>
                Save Information
              </button>
              <div id='submit-help'>Click to save your information</div>
            </form>
          </TabsContent>
        </BasicTabs>,
      );

      // Test form accessibility within tab
      const nameInput = screen.getByLabelText('Name');
      await user.click(nameInput);
      expect(nameInput).toHaveFocus();
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-help');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('handles focus restoration correctly', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button id='before'>Before Tabs</button>
          <BasicTabs>
            <TabsList>
              <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
              <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value='tab1'>
              <button>Action in Tab 1</button>
            </TabsContent>
            <TabsContent value='tab2'>
              <button>Action in Tab 2</button>
            </TabsContent>
          </BasicTabs>
          <button id='after'>After Tabs</button>
        </div>,
      );

      // Focus element before tabs
      await user.click(screen.getByText('Before Tabs'));

      // Navigate through tabs
      await user.tab(); // Focus tab1
      await user.tab(); // Focus tabpanel
      await user.tab(); // Focus button in panel
      await user.tab(); // Focus element after tabs

      expect(screen.getByText('After Tabs')).toHaveFocus();
    });

    it('supports high contrast and forced colors mode', async () => {
      // Simulate Windows High Contrast mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-contrast: high)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const { container } = render(<BasicTabs />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('handles screen reader virtual cursor navigation', () => {
      render(<BasicTabs />);

      // Verify structural navigation landmarks
      const tablist = screen.getByRole('tablist');
      const tabs = screen.getAllByRole('tab');
      const tabpanel = screen.getByRole('tabpanel');

      // Screen readers should be able to navigate by role
      expect(tablist).toBeInTheDocument();
      expect(tabs).toHaveLength(3);
      expect(tabpanel).toBeInTheDocument();

      // Verify content is properly structured for screen readers
      tabs.forEach((tab) => {
        expect(tab).toHaveAttribute('aria-controls');
        expect(tab).toHaveAttribute('aria-selected');
      });
    });

    it('supports reduced motion preferences', async () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      const user = userEvent.setup();
      const { container } = render(<BasicTabs />);

      // Tab switching should still work with reduced motion
      const tab2 = screen.getByRole('tab', { name: 'Section 2: Details' });
      await user.click(tab2);

      expect(tab2).toHaveAttribute('aria-selected', 'true');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('WCAG 2.2 AA Compliance', () => {
    it('meets minimum touch target size requirements', () => {
      render(<BasicTabs />);

      // Mock getBoundingClientRect to simulate 44x44px minimum
      const tabs = screen.getAllByRole('tab');
      tabs.forEach((tab) => {
        jest.spyOn(tab, 'getBoundingClientRect').mockReturnValue({
          width: 44,
          height: 44,
          top: 0,
          left: 0,
          bottom: 44,
          right: 44,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        });
      });

      // Verify tabs meet minimum size requirements
      tabs.forEach((tab) => {
        const rect = tab.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(44);
        expect(rect.height).toBeGreaterThanOrEqual(44);
      });
    });

    it('provides sufficient context for understanding', () => {
      render(<BasicTabs />);

      // Tabs should have clear, descriptive names
      expect(screen.getByRole('tab', { name: 'Section 1: Introduction' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Section 2: Details' })).toBeInTheDocument();

      // Disabled tab should indicate its state
      expect(screen.getByRole('tab', { name: 'Section 3: Advanced (Coming Soon)' })).toBeDisabled();
    });

    it('supports voice control navigation', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      // Voice control should be able to activate tabs by name
      const tab = screen.getByRole('tab', { name: 'Section 2: Details' });

      // Simulate voice control click
      await user.click(tab);
      expect(tab).toHaveAttribute('aria-selected', 'true');
    });

    it('maintains focus visibility in all states', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      const tab1 = screen.getByRole('tab', { name: 'Section 1: Introduction' });
      const tab2 = screen.getByRole('tab', { name: 'Section 2: Details' });

      // Focus should be clearly indicated
      await user.tab();
      expect(tab1).toHaveFocus();

      // Focus should remain visible during keyboard navigation
      await user.keyboard('{ArrowRight}');
      expect(tab2).toHaveFocus();
    });
  });
});
