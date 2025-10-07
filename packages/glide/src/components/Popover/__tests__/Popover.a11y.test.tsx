import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PopoverRoot } from '../Popover';
import { PopoverTrigger } from '../PopoverTrigger';
import { PopoverContent } from '../PopoverContent';
import { PopoverArrow } from '../PopoverArrow';
import { PopoverAnchor } from '../PopoverAnchor';
import { PopoverClose } from '../PopoverClose';

expect.extend(toHaveNoViolations);

describe('Popover Accessibility', () => {
  describe('ARIA Compliance', () => {
    it('should pass axe accessibility tests - closed state', async () => {
      const { container } = render(
        <PopoverRoot>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>
            <h2>Popover Title</h2>
            <p>This is popover content with proper structure.</p>
            <PopoverClose>Close</PopoverClose>
          </PopoverContent>
        </PopoverRoot>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe accessibility tests - open state', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <PopoverRoot>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>
            <h2>Popover Title</h2>
            <p>This is popover content with proper structure.</p>
            <button>Action Button</button>
            <PopoverClose>Close</PopoverClose>
          </PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Popover' }));

      await waitFor(async () => {
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    it('should pass axe accessibility tests - modal popover', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <PopoverRoot modal={true}>
          <PopoverTrigger>Open Modal Popover</PopoverTrigger>
          <PopoverContent>
            <h2>Modal Popover</h2>
            <p>This is modal popover content.</p>
            <PopoverClose>Close</PopoverClose>
          </PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Modal Popover' }));

      await waitFor(async () => {
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    it('should pass axe accessibility tests - with form controls', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <PopoverRoot>
          <PopoverTrigger>Open Form Popover</PopoverTrigger>
          <PopoverContent>
            <form>
              <label htmlFor='name'>Name:</label>
              <input id='name' type='text' />

              <label htmlFor='email'>Email:</label>
              <input id='email' type='email' />

              <button type='submit'>Submit</button>
              <PopoverClose>Cancel</PopoverClose>
            </form>
          </PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button', { name: 'Open Form Popover' }));

      await waitFor(async () => {
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    it('should pass axe accessibility tests - with disabled trigger', async () => {
      const { container } = render(
        <PopoverRoot>
          <PopoverTrigger isDisabled>Disabled Trigger</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe accessibility tests - with custom anchor', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <PopoverRoot>
          <PopoverAnchor>
            <div>Anchor Element</div>
          </PopoverAnchor>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content positioned relative to anchor</PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button'));

      await waitFor(async () => {
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });

  describe('ARIA Attributes', () => {
    it('sets correct aria-expanded on trigger', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger>Toggle</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button');

      // Initially collapsed
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      // After opening
      await user.click(trigger);
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });

      // After closing
      await user.click(trigger);
      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('sets aria-haspopup correctly', () => {
      render(
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'dialog');
    });

    it('sets aria-controls when popover is open', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button');

      // No aria-controls when closed
      expect(trigger).not.toHaveAttribute('aria-controls');

      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute('aria-controls');
        const controlsId = trigger.getAttribute('aria-controls');
        expect(document.getElementById(controlsId!)).toBeInTheDocument();
      });
    });

    it('sets proper role on modal popover content', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot modal={true}>
          <PopoverTrigger>Open Modal</PopoverTrigger>
          <PopoverContent>Modal Content</PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const content = screen.getByText('Modal Content');
        expect(content).toHaveAttribute('role', 'dialog');
        expect(content).toHaveAttribute('aria-modal', 'true');
      });
    });

    it('does not set role on non-modal popover content', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot modal={false}>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        const content = screen.getByText('Content');
        expect(content).not.toHaveAttribute('role');
        expect(content).not.toHaveAttribute('aria-modal');
      });
    });

    it('sets presentation role on arrow', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            Content
            <PopoverArrow data-testid='arrow' />
          </PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByTestId('arrow')).toHaveAttribute('role', 'presentation');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports Enter key to open/close', async () => {
      render(
        <PopoverRoot>
          <PopoverTrigger>Toggle</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button');

      // Open with Enter
      fireEvent.keyDown(trigger, { key: 'Enter' });
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      // Close with Enter
      fireEvent.keyDown(trigger, { key: 'Enter' });
      await waitFor(() => {
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
      });
    });

    it('supports Space key to open/close', async () => {
      render(
        <PopoverRoot>
          <PopoverTrigger>Toggle</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button');

      // Open with Space
      fireEvent.keyDown(trigger, { key: ' ' });
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      // Close with Space
      fireEvent.keyDown(trigger, { key: ' ' });
      await waitFor(() => {
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
      });
    });

    it('supports Arrow Down to open (but not close)', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button');
      trigger.focus();

      // Open with Arrow Down
      await user.keyboard('{ArrowDown}');
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      // Arrow Down again should not close
      await user.keyboard('{ArrowDown}');
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('supports Escape key to close', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot defaultOpen={true}>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            <button>Focus target</button>
          </PopoverContent>
        </PopoverRoot>,
      );

      await waitFor(() => {
        expect(screen.getByText('Focus target')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Focus target')).not.toBeInTheDocument();
      });
    });

    it('supports Tab navigation within content', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            <button>First</button>
            <button>Second</button>
            <PopoverClose>Close</PopoverClose>
          </PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
      });

      // Tab through focusable elements
      await user.tab();
      expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    });

    it('supports Home/End keys within content', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            <button>First</button>
            <button>Middle</button>
            <button>Last</button>
          </PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        const middleButton = screen.getByRole('button', { name: 'Middle' });
        middleButton.focus();
      });

      // Home key should focus first element
      await user.keyboard('{Home}');
      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();

      // End key should focus last element
      await user.keyboard('{End}');
      expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
    });

    it('ignores keyboard events when trigger is disabled', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger isDisabled>Disabled</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button');

      await user.type(trigger, '{Enter}');
      expect(screen.queryByText('Content')).not.toBeInTheDocument();

      await user.type(trigger, ' ');
      expect(screen.queryByText('Content')).not.toBeInTheDocument();

      await user.type(trigger, '{ArrowDown}');
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('focuses first focusable element when popover opens', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            <button>First focusable</button>
            <button>Second focusable</button>
          </PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'First focusable' })).toHaveFocus();
      });
    });

    it('focuses content container when no focusable elements exist', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent data-testid='content'>
            <div>Just text content</div>
          </PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        expect(screen.getByTestId('content')).toHaveFocus();
      });
    });

    it('returns focus to trigger when popover closes', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            <button>Content button</button>
            <PopoverClose>Close</PopoverClose>
          </PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button', { name: 'Open' });

      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Content button' })).toHaveFocus();
      });

      await user.click(screen.getByRole('button', { name: 'Close' }));
      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });

    it('returns focus to trigger when closed via Escape', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            <button>Content button</button>
          </PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button', { name: 'Open' });

      await user.click(trigger);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Content button' })).toHaveFocus();
      });

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });

    it('maintains focus within popover when trapFocus is enabled', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <PopoverRoot>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent trapFocus={true}>
              <button>First</button>
              <button>Last</button>
            </PopoverContent>
          </PopoverRoot>
          <button>Outside button</button>
        </div>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
      });

      // Tab from last to first
      await user.tab();
      expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();

      // Shift+Tab from first to last
      await user.tab({ shift: true });
      expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
    });

    it('allows focus to leave when trapFocus is disabled', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <PopoverRoot>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent trapFocus={false}>
              <button>Content button</button>
            </PopoverContent>
          </PopoverRoot>
          <button>Outside button</button>
        </div>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Content button' })).toHaveFocus();
      });

      // When trapFocus is false, we can move focus outside the popover
      const outsideButton = screen.getByRole('button', { name: 'Outside button' });
      outsideButton.focus();
      // Verify focus moved to outside button (popover doesn't trap focus)
      expect(outsideButton).toHaveFocus();
    });
  });

  describe('Screen Reader Support', () => {
    it('provides accessible names for triggers', () => {
      render(
        <PopoverRoot>
          <PopoverTrigger aria-label='Open settings menu'>⚙️</PopoverTrigger>
          <PopoverContent>Settings</PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button', { name: 'Open settings menu' });
      expect(trigger).toBeInTheDocument();
    });

    it('supports labelledby relationship', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger id='settings-trigger'>Settings</PopoverTrigger>
          <PopoverContent aria-labelledby='settings-trigger'>
            <div>Settings panel content</div>
          </PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button', { name: 'Settings' }));

      await waitFor(() => {
        const content = screen.getByText('Settings panel content');
        expect(content.closest('[aria-labelledby="settings-trigger"]')).toBeInTheDocument();
      });
    });

    it('supports describedby relationship', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger aria-describedby='help-text'>Help</PopoverTrigger>
          <PopoverContent id='help-text'>
            This is helpful information about the feature.
          </PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button', { name: 'Help' });
      expect(trigger).toHaveAttribute('aria-describedby', 'help-text');

      await user.click(trigger);

      await waitFor(() => {
        expect(
          screen.getByText('This is helpful information about the feature.'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Color Contrast and Visual Indicators', () => {
    it('maintains focus indicators on interactive elements', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            <button style={{ outline: '2px solid blue' }}>Focused button</button>
          </PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        const focusedButton = screen.getByRole('button', { name: 'Focused button' });
        expect(focusedButton).toHaveFocus();
        expect(focusedButton).toHaveStyle('outline: 2px solid blue');
      });
    });

    it('provides visual state indicators via data attributes', async () => {
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger>Toggle</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button');

      // Closed state
      expect(trigger).toHaveAttribute('data-state', 'closed');

      // Open state
      await user.click(trigger);
      await waitFor(() => {
        expect(trigger).toHaveAttribute('data-state', 'open');
      });
    });

    it('indicates disabled state clearly', () => {
      render(
        <PopoverRoot>
          <PopoverTrigger isDisabled>Disabled trigger</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute('data-disabled', '');
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
