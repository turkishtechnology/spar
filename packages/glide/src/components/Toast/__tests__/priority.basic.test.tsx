/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, act } from '@testing-library/react';
import { ToastProvider, useToastContext } from '../ToastProvider';
import { useToastFunction } from '../ToastComponents';

// Simplified test component
const SimpleToastTest = ({
  onToastsChange,
}: {
  onToastsChange: (toasts: readonly any[]) => void;
}) => {
  const { toasts } = useToastContext();
  const toastFn = useToastFunction();

  React.useEffect(() => {
    onToastsChange([...toasts]);
  }, [toasts, onToastsChange]);

  // Expose toast function to global for testing
  React.useEffect(() => {
    (window as any).testToastFn = toastFn;
  }, [toastFn]);

  return <div data-testid='simple-toast-controller' />;
};

describe('Priority System Basic Tests', () => {
  let toastsList: any[] = [];

  const onToastsChange = (toasts: readonly any[]) => {
    toastsList = [...toasts];
  };

  beforeEach(() => {
    toastsList = [];
    (window as any).testToastFn = null;
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    delete (window as any).testToastFn;
  });

  it('should maintain basic toast addition', () => {
    render(
      <ToastProvider maxToasts={5} visibleLimit={3}>
        <SimpleToastTest onToastsChange={onToastsChange} />
      </ToastProvider>,
    );

    const toastFn = (window as any).testToastFn;
    expect(toastFn).toBeTruthy();

    act(() => {
      toastFn.info('Test toast', { priority: 'normal' });
    });

    expect(toastsList).toHaveLength(1);
    expect(toastsList[0].content).toBe('Test toast');
    expect(toastsList[0].priority).toBe('normal');
  });

  it('should respect maxToasts limit', () => {
    render(
      <ToastProvider maxToasts={3} visibleLimit={5}>
        <SimpleToastTest onToastsChange={onToastsChange} />
      </ToastProvider>,
    );

    const toastFn = (window as any).testToastFn;

    act(() => {
      toastFn.info('Toast 1', { priority: 'low' });
      toastFn.info('Toast 2', { priority: 'low' });
      toastFn.info('Toast 3', { priority: 'low' });
      toastFn.info('Toast 4', { priority: 'low' }); // Should remove oldest
    });

    expect(toastsList).toHaveLength(3); // Limited by maxToasts
  });

  it('should prioritize high over low priority when at limit', () => {
    render(
      <ToastProvider maxToasts={2} visibleLimit={3}>
        <SimpleToastTest onToastsChange={onToastsChange} />
      </ToastProvider>,
    );

    const toastFn = (window as any).testToastFn;

    act(() => {
      // Fill with low priority
      toastFn.info('Low 1', { priority: 'low' });
      toastFn.info('Low 2', { priority: 'low' });
      // Add high priority - should remove low priority
      toastFn.error('High priority', { priority: 'high' });
    });

    expect(toastsList).toHaveLength(2);

    // Should contain the high priority toast
    const priorities = toastsList.map((t) => t.priority);
    expect(priorities).toContain('high');

    // Check if high priority toast exists
    const highPriorityToast = toastsList.find((t) => t.priority === 'high');
    expect(highPriorityToast).toBeDefined();
    expect(highPriorityToast.content).toBe('High priority');
  });

  it('should handle mixed priorities correctly', () => {
    render(
      <ToastProvider maxToasts={3} visibleLimit={5}>
        <SimpleToastTest onToastsChange={onToastsChange} />
      </ToastProvider>,
    );

    const toastFn = (window as any).testToastFn;

    act(() => {
      toastFn.info('Normal 1', { priority: 'normal' });
      toastFn.success('Low 1', { priority: 'low' });
      toastFn.error('High 1', { priority: 'high' });
      toastFn.warning('Normal 2', { priority: 'normal' });
      toastFn.error('High 2', { priority: 'high' });
    });

    expect(toastsList).toHaveLength(3);

    // Count priorities
    const priorities = toastsList.map((t) => t.priority);
    const highCount = priorities.filter((p) => p === 'high').length;
    const lowCount = priorities.filter((p) => p === 'low').length;

    // High priority should be preserved
    expect(highCount).toBeGreaterThan(0);
    // Low priority should be removed first
    expect(lowCount).toBe(0);

    // eslint-disable-next-line no-console
    console.log(
      'Final toasts:',
      toastsList.map((t) => ({ content: t.content, priority: t.priority })),
    );
  });

  it('should handle zero maxToasts', () => {
    render(
      <ToastProvider maxToasts={0} visibleLimit={3}>
        <SimpleToastTest onToastsChange={onToastsChange} />
      </ToastProvider>,
    );

    const toastFn = (window as any).testToastFn;

    act(() => {
      toastFn.info('Should not appear', { priority: 'high' });
    });

    expect(toastsList).toHaveLength(0);
  });
});
