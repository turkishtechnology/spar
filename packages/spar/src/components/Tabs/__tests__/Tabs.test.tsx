import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../index';

// Test setup helper
const BasicTabs = ({
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  children,
  ...rest
}: Partial<React.ComponentProps<typeof Tabs>> = {}) => (
  <Tabs
    {...(value !== undefined && { value })}
    {...(defaultValue !== undefined && { defaultValue })}
    {...(onValueChange && { onValueChange })}
    orientation={orientation}
    activationMode={activationMode}
    {...rest}
  >
    {children || (
      <>
        <TabsList>
          <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
          <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          <TabsTrigger value='tab3' disabled>
            Tab 3 (Disabled)
          </TabsTrigger>
        </TabsList>
        <TabsContent value='tab1'>Content for Tab 1</TabsContent>
        <TabsContent value='tab2'>Content for Tab 2</TabsContent>
        <TabsContent value='tab3'>Content for Tab 3</TabsContent>
      </>
    )}
  </Tabs>
);

describe('Tabs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders basic tabs structure', () => {
      render(<BasicTabs />);

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(3);
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('renders with custom component types', () => {
      render(
        <BasicTabs>
          <TabsList as='nav'>
            <TabsTrigger value='tab1' as='a'>
              Tab 1
            </TabsTrigger>
            <TabsTrigger value='tab2' as='a'>
              Tab 2
            </TabsTrigger>
          </TabsList>
          <TabsContent value='tab1' as='section'>
            Content 1
          </TabsContent>
          <TabsContent value='tab2' as='section'>
            Content 2
          </TabsContent>
        </BasicTabs>,
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tablist').tagName).toBe('NAV');
      expect(screen.getAllByRole('tab')).toHaveLength(2);
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
      expect(screen.getByRole('tabpanel').tagName).toBe('SECTION');
    });

    it('renders with render props pattern', () => {
      render(
        <BasicTabs>
          <TabsList>
            <TabsTrigger value='tab1'>
              {({ isSelected }) => <span>{isSelected ? 'Selected Tab' : 'Tab'}</span>}
            </TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Custom Content</TabsContent>
        </BasicTabs>,
      );

      expect(screen.getByRole('tab', { name: 'Selected Tab' })).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('works as uncontrolled component', () => {
      render(<BasicTabs defaultValue='tab2' />);

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'false');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    });

    it('works as controlled component', () => {
      const handleValueChange = jest.fn();
      const { rerender } = render(<BasicTabs value='tab1' onValueChange={handleValueChange} />);

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');

      rerender(<BasicTabs value='tab2' onValueChange={handleValueChange} />);

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    });

    it('does not update selected tab internally in controlled mode until value prop changes', async () => {
      const user = userEvent.setup();
      const handleValueChange = jest.fn();

      render(<BasicTabs value='tab1' onValueChange={handleValueChange} />);

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleValueChange).toHaveBeenCalledWith('tab2');
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'false');
    });

    it('defaults to first tab when no value provided', () => {
      render(<BasicTabs />);

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
    });

    it('calls onValueChange when tab is clicked', async () => {
      const user = userEvent.setup();
      const handleValueChange = jest.fn();

      render(<BasicTabs onValueChange={handleValueChange} />);

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleValueChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('Tab Interactions', () => {
    it('switches tabs on click', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
    });

    it('does not switch to disabled tab', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      await user.click(screen.getByRole('tab', { name: 'Tab 3 (Disabled)' }));

      expect(screen.getByRole('tab', { name: 'Tab 3 (Disabled)' })).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    });

    it('focuses tab on click', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await user.click(tab2);

      expect(tab2).toHaveFocus();
    });
  });

  describe('Orientation', () => {
    it('sets horizontal orientation by default', () => {
      render(<BasicTabs />);

      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
      expect(screen.getByRole('tablist')).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('sets vertical orientation', () => {
      render(<BasicTabs orientation='vertical' />);

      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
      expect(screen.getByRole('tablist')).toHaveAttribute('data-orientation', 'vertical');
    });

    it('passes orientation to content panels', () => {
      render(<BasicTabs orientation='vertical' />);

      expect(screen.getByRole('tabpanel')).toHaveAttribute('data-orientation', 'vertical');
    });

    it('ignores unsupported arrow keys for current orientation', async () => {
      const user = userEvent.setup();

      render(<BasicTabs orientation='horizontal' />);
      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      await user.click(tab1);
      await user.keyboard('{ArrowDown}');

      expect(tab1).toHaveFocus();
      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab2).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Activation Mode', () => {
    it('activates tabs automatically on focus by default', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await user.tab(); // Focus first tab
      await user.keyboard('{ArrowRight}'); // Move to tab 2

      expect(tab2).toHaveFocus();
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });

    it('requires explicit activation in manual mode', async () => {
      const user = userEvent.setup();
      render(<BasicTabs activationMode='manual' />);

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await user.tab(); // Focus first tab
      await user.keyboard('{ArrowRight}'); // Move to tab 2

      expect(tab2).toHaveFocus();
      expect(tab2).toHaveAttribute('aria-selected', 'false'); // Not activated yet

      await user.keyboard('{Enter}'); // Activate

      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('TabsContent', () => {
    it('renders only active content by default', () => {
      render(<BasicTabs />);

      expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 3')).not.toBeInTheDocument();
    });

    it('forces mount inactive content when forceMount is true', () => {
      render(
        <BasicTabs>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content for Tab 1</TabsContent>
          <TabsContent value='tab2' forceMount>
            Content for Tab 2
          </TabsContent>
        </BasicTabs>,
      );

      expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Content for Tab 2')).toHaveAttribute('hidden');
    });

    it('shows/hides content based on selection', async () => {
      const user = userEvent.setup();
      render(<BasicTabs />);

      expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Content for Tab 1')).not.toHaveAttribute('hidden');

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Content for Tab 2')).not.toHaveAttribute('hidden');
      expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
    });
  });

  describe('ID Contract', () => {
    it('uses provided root id to derive trigger/panel ids and ARIA relationships', () => {
      render(
        <BasicTabs id='docs-tabs'>
          <TabsList>
            <TabsTrigger value='intro'>Intro</TabsTrigger>
            <TabsTrigger value='api'>API</TabsTrigger>
          </TabsList>
          <TabsContent value='intro'>Intro content</TabsContent>
          <TabsContent value='api'>API content</TabsContent>
        </BasicTabs>,
      );

      const introTab = screen.getByRole('tab', { name: 'Intro' });
      const introPanel = screen.getByRole('tabpanel');

      expect(introTab).toHaveAttribute('id', 'docs-tabs-trigger-intro');
      expect(introTab).toHaveAttribute('aria-controls', 'docs-tabs-panel-intro');
      expect(introPanel).toHaveAttribute('id', 'docs-tabs-panel-intro');
      expect(introPanel).toHaveAttribute('aria-labelledby', 'docs-tabs-trigger-intro');
    });

    it('keeps generated trigger/panel relationships consistent without custom id', async () => {
      const user = userEvent.setup();

      render(<BasicTabs />);

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      const panel2 = screen.getByRole('tabpanel');

      const controlsId = tab2.getAttribute('aria-controls');
      const labelledById = panel2.getAttribute('aria-labelledby');

      expect(controlsId).toBeTruthy();
      expect(labelledById).toBeTruthy();
      expect(panel2).toHaveAttribute('id', controlsId);
      expect(tab2).toHaveAttribute('id', labelledById);
      expect(controlsId).toContain('-panel-tab2');
      expect(labelledById).toContain('-trigger-tab2');
    });
  });

  describe('Error Handling', () => {
    it('throws error when Tabs components are used outside context', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TabsList>Test</TabsList>);
      }).toThrow('Tabs components must be used within a Tabs');

      jest.restoreAllMocks();
    });

    it('throws error when TabsTrigger is used outside context', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TabsTrigger value='test'>Test</TabsTrigger>);
      }).toThrow('Tabs components must be used within a Tabs');

      jest.restoreAllMocks();
    });

    it('throws error when TabsContent is used outside context', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TabsContent value='test'>Test</TabsContent>);
      }).toThrow('Tabs components must be used within a Tabs');

      jest.restoreAllMocks();
    });
  });

  describe('Custom Props', () => {
    it('forwards props to components', () => {
      render(
        <BasicTabs aria-label='docs tabs root'>
          <TabsList aria-label='docs tabs list'>
            <TabsTrigger value='tab1' aria-label='docs tab trigger'>
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent value='tab1' aria-label='docs tab panel'>
            Content 1
          </TabsContent>
        </BasicTabs>,
      );

      expect(screen.getByLabelText('docs tabs root')).toBeInTheDocument();
      expect(screen.getByRole('tablist', { name: 'docs tabs list' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'docs tab trigger' })).toBeInTheDocument();
      expect(screen.getByLabelText('docs tab panel')).toBeInTheDocument();
    });

    it('handles custom event handlers', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      const handleKeyDown = jest.fn();

      render(
        <BasicTabs>
          <TabsList onKeyDown={handleKeyDown}>
            <TabsTrigger value='tab1' onClick={handleClick}>
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
        </BasicTabs>,
      );

      await user.click(screen.getByRole('tab', { name: 'Tab 1' }));
      expect(handleClick).toHaveBeenCalled();

      await user.keyboard('{ArrowRight}');
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('Loop Navigation', () => {
    it('wraps around when navigating past the last tab', async () => {
      const user = userEvent.setup();
      render(
        <BasicTabs>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </BasicTabs>,
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      await user.click(tab2); // Go to last tab
      await user.keyboard('{ArrowRight}'); // Should loop to first

      expect(tab1).toHaveFocus();
      expect(tab1).toHaveAttribute('aria-selected', 'true');
    });

    it('wraps around when navigating before the first tab', async () => {
      const user = userEvent.setup();
      render(
        <BasicTabs>
          <TabsList>
            <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
            <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value='tab1'>Content 1</TabsContent>
          <TabsContent value='tab2'>Content 2</TabsContent>
        </BasicTabs>,
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      await user.click(tab1); // Start at first tab
      await user.keyboard('{ArrowLeft}'); // Should loop to last

      expect(tab2).toHaveFocus();
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });
  });
});
