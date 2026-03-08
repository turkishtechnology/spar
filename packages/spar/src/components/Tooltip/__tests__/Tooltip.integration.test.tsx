import React, { useState } from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../index';

jest.useFakeTimers();

afterEach(() => {
  act(() => {
    jest.runOnlyPendingTimers();
  });
  jest.clearAllTimers();
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Tooltip Integration Tests', () => {
  it('works in controlled mode with external state updates', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const ControlledTooltipDemo = () => {
      const [open, setOpen] = useState(false);

      return (
        <TooltipProvider>
          <Tooltip open={open} onOpenChange={setOpen}>
            <TooltipTrigger>Controlled tooltip trigger</TooltipTrigger>
            <TooltipContent>This tooltip is controlled externally</TooltipContent>
          </Tooltip>
          <button onClick={() => setOpen((prev) => !prev)}>Toggle tooltip programmatically</button>
        </TooltipProvider>
      );
    };

    render(<ControlledTooltipDemo />);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Toggle tooltip programmatically' }));
    expect(screen.getByRole('tooltip')).toHaveTextContent('This tooltip is controlled externally');

    await user.click(screen.getByRole('button', { name: 'Toggle tooltip programmatically' }));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('keeps ARIA links isolated across multiple tooltip instances', () => {
    render(
      <TooltipProvider>
        <Tooltip id='first-tip' defaultOpen>
          <TooltipTrigger>First</TooltipTrigger>
          <TooltipContent>First tooltip content</TooltipContent>
        </Tooltip>
        <Tooltip id='second-tip' defaultOpen>
          <TooltipTrigger>Second</TooltipTrigger>
          <TooltipContent>Second tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const firstTrigger = screen.getByRole('button', { name: 'First' });
    const secondTrigger = screen.getByRole('button', { name: 'Second' });

    expect(firstTrigger).toHaveAttribute('aria-describedby', 'first-tip-content');
    expect(secondTrigger).toHaveAttribute('aria-describedby', 'second-tip-content');
    expect(screen.getByText('First tooltip content')).toBeInTheDocument();
    expect(screen.getByText('Second tooltip content')).toBeInTheDocument();
  });

  it('renders tooltip content inside provided portal container', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const container = document.createElement('div');
    container.setAttribute('data-testid', 'portal-container');
    document.body.appendChild(container);

    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent container={container}>Portaled tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole('button', { name: 'Trigger' }));
    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(container).toContainElement(screen.getByRole('tooltip'));

    container.remove();
  });
});
