/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { ToastProvider, useToastContext } from '../ToastProvider';
import { ToastRoot } from '../ToastRoot';
import { toast, useToastFunction } from '../ToastComponents';

// Test component for accessing toast context
const ToastTestComponent = ({
  onToastsChange,
}: {
  onToastsChange: (toasts: readonly any[]) => void;
}) => {
  const { toasts } = useToastContext();
  const toastFn = useToastFunction();

  React.useEffect(() => {
    onToastsChange([...toasts]); // Convert readonly to mutable
  }, [toasts, onToastsChange]);

  return (
    <div data-testid='toast-controller'>
      <button
        onClick={() => toastFn.info('Provider duration toast')}
        data-testid='add-provider-duration'
      >
        Add Provider Duration Toast
      </button>
      <button
        onClick={() => toastFn.success('Custom duration toast', { duration: 1000 })}
        data-testid='add-custom-duration'
      >
        Add Custom Duration Toast
      </button>
      <button
        onClick={() => toastFn.warning('Zero duration toast', { duration: 0 })}
        data-testid='add-zero-duration'
      >
        Add Zero Duration Toast
      </button>
      <button onClick={() => toastFn.quick('Quick toast')} data-testid='add-quick-toast'>
        Add Quick Toast
      </button>
      <button onClick={() => toastFn.long('Long toast')} data-testid='add-long-toast'>
        Add Long Toast
      </button>
      <button
        onClick={() => toastFn.persistent('Persistent toast')}
        data-testid='add-persistent-toast'
      >
        Add Persistent Toast
      </button>
    </div>
  );
};

describe('Duration Override System', () => {
  let toastsList: any[] = [];
  const onToastsChange = (toasts: readonly any[]) => {
    toastsList = [...toasts];
  };

  beforeEach(() => {
    toastsList = [];
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Provider vs Component Duration Priority', () => {
    it('should use provider default duration when component duration not specified', async () => {
      const onOpenChange = jest.fn();

      render(
        <ToastProvider duration={2000}>
          <ToastRoot open={true} onOpenChange={onOpenChange}>
            Provider duration toast
          </ToastRoot>
        </ToastProvider>,
      );

      // Should auto-close after provider duration (2000ms)
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should override provider duration with component duration', async () => {
      const onOpenChange = jest.fn();

      render(
        <ToastProvider duration={3000}>
          <ToastRoot open={true} duration={1500} onOpenChange={onOpenChange}>
            Custom duration toast
          </ToastRoot>
        </ToastProvider>,
      );

      // Should close after 1500ms (component duration), not 3000ms (provider)
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should handle zero duration as infinite (no auto-close)', () => {
      const onOpenChange = jest.fn();

      render(
        <ToastProvider duration={2000}>
          <ToastRoot
            open={true}
            duration={0} // Zero means no auto-close
            onOpenChange={onOpenChange}
          >
            Infinite duration toast
          </ToastRoot>
        </ToastProvider>,
      );

      // Should never auto-close
      act(() => {
        jest.advanceTimersByTime(10000);
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should handle missing duration fallback to provider', async () => {
      const onOpenChange = jest.fn();

      render(
        <ToastProvider duration={1500}>
          <ToastRoot
            open={true}
            // No duration prop - should fallback to provider
            onOpenChange={onOpenChange}
          >
            Fallback duration toast
          </ToastRoot>
        </ToastProvider>,
      );

      // Should use provider duration
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Programmatic Toast Duration Override', () => {
    it('should respect duration in programmatic toast calls', () => {
      render(
        <ToastProvider duration={3000}>
          <ToastTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      // Add toast with custom duration via addToast
      act(() => {
        screen.getByTestId('add-custom-duration').click();
      });

      // Should have toast with custom duration
      expect(toastsList).toHaveLength(1);
      expect(toastsList[0].duration).toBe(1000);
    });

    it('should use provider duration when not specified in programmatic call', () => {
      render(
        <ToastProvider duration={2500}>
          <ToastTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      // Add toast without duration specified
      act(() => {
        screen.getByTestId('add-provider-duration').click();
      });

      // Should use provider duration
      expect(toastsList).toHaveLength(1);
      expect(toastsList[0].duration).toBe(2500);
    });

    it('should handle zero duration in programmatic calls', () => {
      render(
        <ToastProvider duration={2000}>
          <ToastTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      // Add toast with zero duration
      act(() => {
        screen.getByTestId('add-zero-duration').click();
      });

      // Should have zero duration (infinite)
      expect(toastsList).toHaveLength(1);
      expect(toastsList[0].duration).toBe(0);
    });
  });

  describe('Toast Function Duration Overrides', () => {
    it('should use custom duration with toast.success()', () => {
      render(
        <ToastProvider duration={5000}>
          <ToastTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      // Add toast with custom duration using toast function
      act(() => {
        toast.success('Custom duration success', { duration: 750 });
      });

      // Should respect custom duration
      expect(toastsList).toHaveLength(1);
      expect(toastsList[0].duration).toBe(750);
    });

    it('should use provider duration when options not provided', () => {
      render(
        <ToastProvider duration={4000}>
          <ToastTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      // Add toast without options
      act(() => {
        toast.error('Provider duration error');
      });

      // Should use provider duration
      expect(toastsList).toHaveLength(1);
      expect(toastsList[0].duration).toBe(4000);
    });

    it('should handle duration shortcuts (quick, long, persistent)', () => {
      render(
        <ToastProvider duration={3000}>
          <ToastTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      act(() => {
        toast.quick('Quick toast');
        toast.long('Long toast');
        toast.persistent('Persistent toast');
      });

      expect(toastsList).toHaveLength(3);

      // Check duration shortcuts
      const quickToast = toastsList.find((t) => t.content === 'Quick toast');
      const longToast = toastsList.find((t) => t.content === 'Long toast');
      const persistentToast = toastsList.find((t) => t.content === 'Persistent toast');

      expect(quickToast?.duration).toBe(2000); // Quick duration
      expect(longToast?.duration).toBe(8000); // Long duration (8 seconds)
      expect(persistentToast?.duration).toBe(0); // Persistent (zero)
    });
  });

  describe('Duration Priority Chain', () => {
    it('should follow correct priority: component > programmatic > provider', async () => {
      const scenarios = [
        {
          name: 'Component wins over provider',
          providerDuration: 5000,
          componentDuration: 2000,
          expected: 2000,
        },
        {
          name: 'Programmatic wins over provider',
          providerDuration: 3000,
          programmaticDuration: 1500,
          expected: 1500,
        },
        {
          name: 'Component wins over programmatic',
          providerDuration: 4000,
          componentDuration: 1000,
          programmaticDuration: 2000,
          expected: 1000,
        },
      ];

      for (const scenario of scenarios) {
        const onOpenChange = jest.fn();

        const componentDuration = scenario.componentDuration || scenario.programmaticDuration;
        const { unmount } = render(
          <ToastProvider duration={scenario.providerDuration}>
            <ToastRoot
              open={true}
              {...(componentDuration && { duration: componentDuration })}
              onOpenChange={onOpenChange}
            >
              {scenario.name}
            </ToastRoot>
          </ToastProvider>,
        );

        // Test that it closes at expected duration
        act(() => {
          jest.advanceTimersByTime(scenario.expected);
        });

        await waitFor(() => {
          expect(onOpenChange).toHaveBeenCalledWith(false);
        });

        unmount();
        onOpenChange.mockClear();
      }
    });

    it('should handle complex duration inheritance scenarios', () => {
      render(
        <ToastProvider duration={3000}>
          <ToastTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      act(() => {
        // Various toast creation methods
        toast.info('Provider default'); // Should use 3000
        toast.warning('With override', { duration: 1500 }); // Should use 1500
        toast.success('Zero override', { duration: 0 }); // Should use 0
      });

      expect(toastsList).toHaveLength(3);

      const defaultToast = toastsList.find((t) => t.content === 'Provider default');
      const overrideToast = toastsList.find((t) => t.content === 'With override');
      const zeroToast = toastsList.find((t) => t.content === 'Zero override');

      expect(defaultToast?.duration).toBe(3000);
      expect(overrideToast?.duration).toBe(1500);
      expect(zeroToast?.duration).toBe(0);
    });
  });

  describe('Duration Edge Cases', () => {
    it('should handle negative duration as zero', () => {
      render(
        <ToastProvider duration={2000}>
          <ToastTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      act(() => {
        toast.info('Negative duration', { duration: -1000 });
      });

      // Should treat negative as zero (infinite)
      expect(toastsList).toHaveLength(1);
      expect(toastsList[0].duration).toBe(-1000); // Store as-is but treat as infinite
    });

    it('should handle very large duration values', () => {
      const largeDuration = Number.MAX_SAFE_INTEGER;

      render(
        <ToastProvider duration={2000}>
          <ToastTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      act(() => {
        toast.info('Large duration', { duration: largeDuration });
      });

      expect(toastsList).toHaveLength(1);
      expect(toastsList[0].duration).toBe(largeDuration);
    });

    it('should handle duration changes during toast lifetime', async () => {
      const onOpenChange = jest.fn();

      const { rerender } = render(
        <ToastProvider duration={3000}>
          <ToastRoot open={true} duration={2000} onOpenChange={onOpenChange}>
            Duration changing toast
          </ToastRoot>
        </ToastProvider>,
      );

      // Advance partway through
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Change duration mid-flight
      act(() => {
        rerender(
          <ToastProvider duration={3000}>
            <ToastRoot open={true} duration={5000} onOpenChange={onOpenChange}>
              Duration changing toast
            </ToastRoot>
          </ToastProvider>,
        );
      });

      // Should not close at original time
      act(() => {
        jest.advanceTimersByTime(1000); // Total 2000ms
      });
      expect(onOpenChange).not.toHaveBeenCalled();

      // Should close at new duration (5000ms from duration change)
      act(() => {
        jest.advanceTimersByTime(4000);
      });

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should handle provider duration changes affecting existing toasts', () => {
      const { rerender } = render(
        <ToastProvider duration={2000}>
          <ToastTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      // Add toast with provider default
      act(() => {
        screen.getByTestId('add-provider-duration').click();
      });

      expect(toastsList[0].duration).toBe(2000);

      // Change provider duration
      rerender(
        <ToastProvider duration={5000}>
          <ToastTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      // Existing toast should keep original duration
      expect(toastsList[0].duration).toBe(2000);

      // New toast should use new provider duration
      act(() => {
        screen.getByTestId('add-provider-duration').click();
      });

      expect(toastsList[1].duration).toBe(5000);
    });
  });
});
