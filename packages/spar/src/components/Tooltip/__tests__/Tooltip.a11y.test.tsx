import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../index';

expect.extend(toHaveNoViolations);

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

const renderTooltip = (props?: React.ComponentProps<typeof Tooltip>) => {
  return render(
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger>Trigger button</TooltipTrigger>
        <TooltipContent>Helpful tooltip content</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
};

describe('Tooltip Accessibility', () => {
  it('passes axe checks in closed state', async () => {
    jest.useRealTimers();
    const { container } = renderTooltip();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    jest.useFakeTimers();
  }, 15000);

  it('passes axe checks in open state', async () => {
    jest.useRealTimers();
    const { container } = renderTooltip({ defaultOpen: true });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    jest.useFakeTimers();
  }, 15000);

  it('uses tooltip role and aria-describedby while open', () => {
    renderTooltip({ defaultOpen: true });

    const trigger = screen.getByRole('button', { name: 'Trigger button' });
    const tooltip = screen.getByRole('tooltip');

    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('removes aria-describedby when dismissed with Escape', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderTooltip({ defaultOpen: true });

    const trigger = screen.getByRole('button', { name: 'Trigger button' });
    trigger.focus();

    await user.keyboard('{Escape}');
    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-describedby');
    expect(trigger).toHaveFocus();
  });

  it('keeps content visible when pointer moves from trigger to tooltip content', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderTooltip({ hideDelay: 100 });

    const trigger = screen.getByRole('button', { name: 'Trigger button' });
    await user.hover(trigger);
    act(() => {
      jest.advanceTimersByTime(700);
    });

    const tooltip = screen.getByRole('tooltip');
    await user.unhover(trigger);
    await user.hover(tooltip);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(tooltip);
    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
