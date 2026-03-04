import React, { useState } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipArrow } from '../index';

// Mock timer functions for consistent testing
jest.useFakeTimers();

// Cleanup after each test to prevent act() warnings from pending timers
afterEach(() => {
  act(() => {
    jest.runOnlyPendingTimers();
  });
});

// Mock window.matchMedia for JSDOM environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const FormWithTooltips = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  return (
    <TooltipProvider>
      <form>
        <div>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Tooltip>
            <TooltipTrigger aria-label='Name help'>?</TooltipTrigger>
            <TooltipContent>
              Enter your full legal name as it appears on official documents
            </TooltipContent>
          </Tooltip>
        </div>

        <div>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Tooltip>
            <TooltipTrigger aria-label='Email help'>?</TooltipTrigger>
            <TooltipContent>
              We'll use this email for important account notifications
            </TooltipContent>
          </Tooltip>
        </div>

        <button type='submit'>Submit</button>
      </form>
    </TooltipProvider>
  );
};

const ControlledTooltipDemo = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <TooltipProvider>
      <div>
        <Tooltip open={open} onOpenChange={setOpen}>
          <TooltipTrigger>Controlled tooltip trigger</TooltipTrigger>
          <TooltipContent>This tooltip is controlled externally</TooltipContent>
        </Tooltip>

        <button onClick={() => setOpen(!open)}>Toggle tooltip programmatically</button>

        <input
          type='text'
          placeholder='Type to update message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div>Status: {open ? 'Open' : 'Closed'}</div>
      </div>
    </TooltipProvider>
  );
};

const MultipleTooltipDemo = () => {
  return (
    <TooltipProvider delayDuration={500} skipDelayDuration={200}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Tooltip>
          <TooltipTrigger>First</TooltipTrigger>
          <TooltipContent>First tooltip content</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>Second</TooltipTrigger>
          <TooltipContent>Second tooltip content</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>Third</TooltipTrigger>
          <TooltipContent>Third tooltip content</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

const NestedTooltipDemo = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Outer tooltip</TooltipTrigger>
        <TooltipContent>
          This tooltip contains another trigger
          <Tooltip>
            <TooltipTrigger>Inner</TooltipTrigger>
            <TooltipContent>Nested tooltip content</TooltipContent>
          </Tooltip>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

describe('Tooltip Integration Tests', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Form Integration', () => {
    it('integrates seamlessly with form elements', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<FormWithTooltips />);

      // Test form interaction with tooltips
      const nameInput = screen.getByLabelText('Name');
      const nameHelp = screen.getByRole('button', { name: 'Name help' });

      // Fill form field
      await user.type(nameInput, 'John Doe');
      expect(nameInput).toHaveValue('John Doe');

      // Show help tooltip
      await user.hover(nameHelp);
      await act(async () => {
        jest.advanceTimersByTime(700);
      });

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent(
          'Enter your full legal name as it appears on official documents',
        );
      });

      // Hide tooltip and continue with form
      await user.unhover(nameHelp);
      await user.click(nameInput);

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('handles multiple form tooltips independently', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<FormWithTooltips />);

      const nameHelp = screen.getByRole('button', { name: 'Name help' });
      const emailHelp = screen.getByRole('button', { name: 'Email help' });

      // Show first tooltip
      await user.hover(nameHelp);
      await act(async () => {
        jest.advanceTimersByTime(700);
      });

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('legal name');
      });

      // Switch to second tooltip
      await user.unhover(nameHelp);
      await user.hover(emailHelp);
      await act(async () => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('account notifications');
      });
    });

    it('does not interfere with form submission', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <TooltipProvider>
            <Tooltip defaultOpen>
              <TooltipTrigger>Help</TooltipTrigger>
              <TooltipContent>Form help</TooltipContent>
            </Tooltip>
            <button type='submit'>Submit</button>
          </TooltipProvider>
        </form>,
      );

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe('Controlled State Management', () => {
    it('works with external state control', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<ControlledTooltipDemo />);

      const toggleButton = screen.getByRole('button', { name: 'Toggle tooltip programmatically' });
      const status = screen.getByText('Status: Closed');

      expect(status).toBeInTheDocument();
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // Toggle via external button
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText('Status: Open')).toBeInTheDocument();
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Toggle back
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText('Status: Closed')).toBeInTheDocument();
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('synchronizes with trigger interactions in controlled mode', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<ControlledTooltipDemo />);

      // Focus should trigger state change
      await user.tab(); // Focus the trigger

      await waitFor(() => {
        expect(screen.getByText('Status: Open')).toBeInTheDocument();
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Escape should close
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.getByText('Status: Closed')).toBeInTheDocument();
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  describe('Multiple Tooltips Coordination', () => {
    it('coordinates delay optimization between multiple tooltips', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<MultipleTooltipDemo />);

      const first = screen.getByRole('button', { name: 'First' });
      const second = screen.getByRole('button', { name: 'Second' });
      const third = screen.getByRole('button', { name: 'Third' });

      // First tooltip should have normal delay
      await user.hover(first);
      await act(async () => {
        jest.advanceTimersByTime(500); // Provider delay
      });

      await waitFor(() => {
        expect(screen.getByText('First tooltip content')).toBeInTheDocument();
      });

      // Moving to second tooltip should have reduced delay
      await user.hover(second);
      await act(async () => {
        jest.advanceTimersByTime(200); // Skip delay
      });

      await waitFor(() => {
        expect(screen.getByText('Second tooltip content')).toBeInTheDocument();
        expect(screen.queryByText('First tooltip content')).not.toBeInTheDocument();
      });

      // Moving to third should also be quick
      await user.hover(third);
      await act(async () => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByText('Third tooltip content')).toBeInTheDocument();
        expect(screen.queryByText('Second tooltip content')).not.toBeInTheDocument();
      });
    });

    it('isolates tooltip states properly', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<MultipleTooltipDemo />);

      const first = screen.getByRole('button', { name: 'First' });

      // Focus first tooltip
      act(() => {
        first.focus();
      });

      await waitFor(() => {
        expect(screen.getByText('First tooltip content')).toBeInTheDocument();
      });

      // Focus second tooltip
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Second tooltip content')).toBeInTheDocument();
        expect(screen.queryByText('First tooltip content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Complex Interactions', () => {
    it('handles rapid hover interactions without memory leaks', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<MultipleTooltipDemo />);

      const buttons = [
        screen.getByRole('button', { name: 'First' }),
        screen.getByRole('button', { name: 'Second' }),
        screen.getByRole('button', { name: 'Third' }),
      ];

      // Rapidly hover between buttons
      for (let i = 0; i < 10; i++) {
        const buttonIndex = i % 3;
        const button = buttons[buttonIndex]!;
        await user.hover(button);
        await act(async () => {
          jest.advanceTimersByTime(50); // Quick movements
        });
      }

      // Should not have multiple tooltips open
      const tooltips = screen.queryAllByRole('tooltip');
      expect(tooltips.length).toBeLessThanOrEqual(1);
    });

    it('handles nested tooltip interactions', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<NestedTooltipDemo />);

      const outerTrigger = screen.getByRole('button', { name: 'Outer tooltip' });

      // Focus outer tooltip to open it
      act(() => {
        outerTrigger.focus();
      });

      await waitFor(() => {
        expect(screen.getByText('This tooltip contains another trigger')).toBeInTheDocument();
      });

      // Find and interact with inner trigger
      const innerTrigger = screen.getByRole('button', { name: 'Inner' });
      await user.hover(innerTrigger);
      await act(async () => {
        jest.advanceTimersByTime(700);
      });

      await waitFor(() => {
        expect(screen.getByText('Nested tooltip content')).toBeInTheDocument();
      });

      // Both tooltips should coexist
      expect(screen.getByText('This tooltip contains another trigger')).toBeInTheDocument();
    });

    it('handles portal rendering with dynamic content', async () => {
      const DynamicContent = () => {
        const [count, setCount] = useState(0);

        return (
          <TooltipProvider>
            <Tooltip defaultOpen>
              <TooltipTrigger onClick={() => setCount((c) => c + 1)}>Count: {count}</TooltipTrigger>
              <TooltipContent>Current count is {count}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      };

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<DynamicContent />);

      const button = screen.getByRole('button', { name: 'Count: 0' });
      expect(screen.getByText('Current count is 0')).toBeInTheDocument();

      // Update content
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Count: 1' })).toBeInTheDocument();
        expect(screen.getByText('Current count is 1')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Edge Cases', () => {
    it('handles component unmounting gracefully', async () => {
      const ConditionalTooltip = ({ show }: { show: boolean }) => {
        if (!show) return <div>No tooltip</div>;

        return (
          <TooltipProvider>
            <Tooltip defaultOpen>
              <TooltipTrigger>Conditional trigger</TooltipTrigger>
              <TooltipContent>Conditional content</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      };

      const { rerender } = render(<ConditionalTooltip show={true} />);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      // Unmount component
      rerender(<ConditionalTooltip show={false} />);

      expect(screen.getByText('No tooltip')).toBeInTheDocument();
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('cleans up event listeners on unmount', async () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { unmount } = render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Cleanup test</TooltipTrigger>
            <TooltipContent>Content</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );

      // Trigger tooltip to open (this will add the global escape listener)
      const trigger = screen.getByRole('button', { name: 'Cleanup test' });
      await user.hover(trigger);
      jest.advanceTimersByTime(700);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Component should have added event listeners
      expect(addEventListenerSpy).toHaveBeenCalled();

      unmount();

      // Should clean up on unmount
      expect(removeEventListenerSpy).toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('works in a realistic dashboard interface', async () => {
      const Dashboard = () => (
        <TooltipProvider>
          <nav>
            <Tooltip>
              <TooltipTrigger aria-label='Home'>🏠</TooltipTrigger>
              <TooltipContent>Home</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger aria-label='Settings'>⚙️</TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </nav>

          <main>
            <Tooltip>
              <TooltipTrigger>Action Button</TooltipTrigger>
              <TooltipContent>
                This action will process your data
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </main>
        </TooltipProvider>
      );

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<Dashboard />);

      // Test icon button tooltips
      const homeButton = screen.getByRole('button', { name: 'Home' });
      await user.hover(homeButton);
      jest.advanceTimersByTime(700);

      await waitFor(() => {
        expect(screen.getByRole('tooltip', { name: 'Home' })).toBeInTheDocument();
      });

      // Test action button tooltip
      const actionButton = screen.getByRole('button', { name: 'Action Button' });
      await user.hover(actionButton);

      await waitFor(() => {
        expect(screen.getByText('This action will process your data')).toBeInTheDocument();
      });
    });

    it('handles high-frequency interactions in data tables', async () => {
      const DataTable = () => (
        <TooltipProvider skipDelayDuration={100}>
          <table>
            <tbody>
              {Array.from({ length: 5 }, (_, i) => (
                <tr key={i}>
                  <td>Row {i + 1}</td>
                  <td>
                    <Tooltip>
                      <TooltipTrigger>Edit</TooltipTrigger>
                      <TooltipContent>Edit row {i + 1}</TooltipContent>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TooltipProvider>
      );

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<DataTable />);

      const editButtons = screen.getAllByRole('button', { name: 'Edit' });

      // Quickly hover through multiple buttons
      for (const button of editButtons.slice(0, 3)) {
        await user.hover(button);
        jest.advanceTimersByTime(150);

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });
      }

      // Should only have one tooltip visible at a time
      const tooltips = screen.queryAllByRole('tooltip');
      expect(tooltips).toHaveLength(1);
    });
  });
});
