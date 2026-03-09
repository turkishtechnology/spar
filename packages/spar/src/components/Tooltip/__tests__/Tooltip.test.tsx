import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../index';

// Mock timer functions
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

interface BasicTooltipProps {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  [key: string]: unknown;
}

const BasicTooltip = ({
  children = 'Tooltip content',
  defaultOpen = false,
  ...props
}: BasicTooltipProps) => (
  <TooltipProvider>
    <Tooltip defaultOpen={defaultOpen} {...props}>
      <TooltipTrigger>Trigger</TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

describe('TooltipProvider', () => {
  it('renders children with provider context', () => {
    render(
      <TooltipProvider>
        <div>Provider content</div>
      </TooltipProvider>,
    );

    expect(screen.getByText('Provider content')).toBeInTheDocument();
  });

  it('sets default props correctly', () => {
    render(
      <TooltipProvider>
        <div>Content</div>
      </TooltipProvider>,
    );

    // Provider renders children without wrapper elements
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('accepts custom delay duration props', () => {
    render(
      <TooltipProvider delayDuration={500} skipDelayDuration={200} disableHoverableContent>
        <div>Content</div>
      </TooltipProvider>,
    );

    // Provider should render successfully with custom props
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('Tooltip', () => {
  it('keeps id suffix contract and ARIA relationship with custom id', () => {
    render(<BasicTooltip defaultOpen id='help' />);

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    const tooltip = screen.getByRole('tooltip');

    expect(trigger).toHaveAttribute('id', 'help-trigger');
    expect(tooltip).toHaveAttribute('id', 'help-content');
    expect(trigger).toHaveAttribute('aria-describedby', 'help-content');
  });

  it('opens on hover after delay', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<BasicTooltip />);

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    await user.hover(trigger);

    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-describedby');
  });

  it('uses provider delay when local delay is not provided', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    await user.hover(trigger);

    act(() => {
      jest.advanceTimersByTime(199);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('overrides provider delay with local delay prop', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <TooltipProvider delayDuration={500}>
        <Tooltip delay={50}>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    await user.hover(trigger);

    act(() => {
      jest.advanceTimersByTime(49);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('opens immediately on focus and closes on blur', async () => {
    render(<BasicTooltip />);

    const trigger = screen.getByRole('button', { name: 'Trigger' });

    act(() => {
      trigger.focus();
    });
    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(trigger).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    act(() => {
      trigger.blur();
      jest.advanceTimersByTime(0);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('closes with Escape and keeps focus on trigger', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<BasicTooltip defaultOpen />);

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    act(() => {
      trigger.focus();
    });
    expect(trigger).toHaveAttribute('aria-describedby');

    await user.keyboard('{Escape}');
    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('cancels pending hide timer when trigger is hovered again', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <TooltipProvider>
        <Tooltip hideDelay={100}>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });

    await user.hover(trigger);
    act(() => {
      jest.advanceTimersByTime(700);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(trigger);
    act(() => {
      jest.advanceTimersByTime(50);
    });

    await user.hover(trigger);
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('supports controlled mode and waits for parent rerender to open visually', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onOpenChange = jest.fn();

    const Controlled = ({ open }: { open: boolean }) => (
      <BasicTooltip open={open} onOpenChange={onOpenChange} />
    );

    const { rerender } = render(<Controlled open={false} />);

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    await user.hover(trigger);
    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    rerender(<Controlled open={true} />);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('does not open and does not emit changes when disabled', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onOpenChange = jest.fn();

    render(<BasicTooltip disabled onOpenChange={onOpenChange} />);

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger).toBeDisabled();

    await user.hover(trigger);
    act(() => {
      jest.advanceTimersByTime(700);
    });

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not change state when render-props show is invoked while disabled', () => {
    const onOpenChange = jest.fn();
    let showTooltip: (() => void) | null = null;

    render(
      <TooltipProvider>
        <Tooltip disabled onOpenChange={onOpenChange}>
          <TooltipTrigger>
            {({ show }) => {
              showTooltip = show;
              return <span>Trigger</span>;
            }}
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    act(() => {
      showTooltip?.();
      jest.advanceTimersByTime(0);
    });

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('supports render props and exposes open state', () => {
    render(
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>
            {({ isOpen }) => <span>{isOpen ? 'Open' : 'Closed'}</span>}
          </TooltipTrigger>
          <TooltipContent>Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});
