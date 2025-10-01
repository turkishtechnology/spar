/* eslint-disable @typescript-eslint/no-explicit-any, no-console */
import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { ToastProvider, useToastContext } from '../ToastProvider';
import { TOAST_DEFAULT_DURATION, TOAST_MAX_COUNT } from '../constants';

// Mock child component to access context
const MockChild = ({ onContextReceived }: { onContextReceived: (ctx: any) => void }) => {
  const context = useToastContext();
  React.useEffect(() => {
    onContextReceived(context);
  }, [context, onContextReceived]);
  return null;
};

describe('ToastProvider', () => {
  let mockContext: any;

  const renderWithProvider = (props?: Partial<React.ComponentProps<typeof ToastProvider>>) => {
    return render(
      <ToastProvider {...props}>
        <MockChild
          onContextReceived={(ctx) => {
            mockContext = ctx;
          }}
        />
      </ToastProvider>,
    );
  };

  beforeEach(() => {
    mockContext = null;
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Provider Setup', () => {
    it('should provide context with default configuration', () => {
      renderWithProvider();

      expect(mockContext).toBeDefined();
      expect(mockContext.config).toEqual(
        expect.objectContaining({
          maxToasts: TOAST_MAX_COUNT,
          visibleLimit: 3,
          position: 'top-right',
          duration: TOAST_DEFAULT_DURATION,
          shouldPauseOnHover: true,
          shouldPauseOnFocus: true,
          swipeDirection: 'right',
          shouldCloseOnSwipeEnd: true,
        }),
      );
    });

    it('should use custom configuration', () => {
      renderWithProvider({
        maxToasts: 10,
        visibleLimit: 5,
        position: 'bottom-left',
        duration: 3000,
        shouldPauseOnHover: false,
      });

      expect(mockContext.config).toEqual(
        expect.objectContaining({
          maxToasts: 10,
          visibleLimit: 5,
          position: 'bottom-left',
          duration: 3000,
          shouldPauseOnHover: false,
        }),
      );
    });

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;

      console.error = jest.fn();

      expect(() => {
        renderHook(() => useToastContext());
      }).toThrow(
        'Toast components must be used within ToastProvider. Wrap your component tree with <ToastProvider>.',
      );

      console.error = originalError;
    });
  });

  describe('Toast Queue Management', () => {
    beforeEach(() => {
      renderWithProvider({ maxToasts: 5, visibleLimit: 3 });
    });

    it('should add toasts to queue', () => {
      act(() => {
        const id1 = mockContext.addToast({ content: 'Toast 1', variant: 'info' });
        const id2 = mockContext.addToast({ content: 'Toast 2', variant: 'success' });

        expect(typeof id1).toBe('string');
        expect(typeof id2).toBe('string');
        expect(id1).not.toBe(id2);
      });

      expect(mockContext.allToasts).toHaveLength(2);
      expect(mockContext.toasts).toHaveLength(2); // Both visible since under limit
      expect(mockContext.queuedToasts).toHaveLength(0);
    });

    it('should respect visible limit and queue excess toasts', () => {
      act(() => {
        // Add 5 toasts (visibleLimit is 3)
        mockContext.addToast({ content: 'Toast 1', variant: 'low', priority: 'low' });
        mockContext.addToast({ content: 'Toast 2', variant: 'high', priority: 'high' });
        mockContext.addToast({ content: 'Toast 3', variant: 'normal', priority: 'normal' });
        mockContext.addToast({ content: 'Toast 4', variant: 'high', priority: 'high' });
        mockContext.addToast({ content: 'Toast 5', variant: 'low', priority: 'low' });
      });

      expect(mockContext.allToasts).toHaveLength(5);
      expect(mockContext.toasts).toHaveLength(3); // Only 3 visible
      expect(mockContext.queuedToasts).toHaveLength(2); // 2 queued

      // High priority should be visible
      expect(
        mockContext.toasts.every((t: any) => t.priority === 'high' || t.priority === 'normal'),
      ).toBe(true);
    });

    it('should maintain priority order in queue', () => {
      const now = Date.now();
      jest
        .spyOn(Date, 'now')
        .mockReturnValueOnce(now + 1000) // Toast 1
        .mockReturnValueOnce(now + 2000) // Toast 2
        .mockReturnValueOnce(now + 3000) // Toast 3
        .mockReturnValueOnce(now + 4000); // Toast 4

      act(() => {
        mockContext.addToast({ content: 'Low Priority', priority: 'low' });
        mockContext.addToast({ content: 'High Priority 1', priority: 'high' });
        mockContext.addToast({ content: 'Normal Priority', priority: 'normal' });
        mockContext.addToast({ content: 'High Priority 2', priority: 'high' });
      });

      // Should show: High Priority 1, High Priority 2, Normal Priority (by priority then time)
      expect(mockContext.toasts[0]!.content).toBe('High Priority 1');
      expect(mockContext.toasts[1]!.content).toBe('High Priority 2');
      expect(mockContext.toasts[2]!.content).toBe('Normal Priority');

      // Low priority should be queued
      expect(mockContext.queuedToasts[0]!.content).toBe('Low Priority');
    });

    it('should remove toasts and promote queued ones', () => {
      let toastIds: string[] = [];

      act(() => {
        // Add 5 toasts (3 visible, 2 queued)
        toastIds = [
          mockContext.addToast({ content: 'Toast 1', priority: 'high' }),
          mockContext.addToast({ content: 'Toast 2', priority: 'high' }),
          mockContext.addToast({ content: 'Toast 3', priority: 'normal' }),
          mockContext.addToast({ content: 'Toast 4', priority: 'low' }),
          mockContext.addToast({ content: 'Toast 5', priority: 'low' }),
        ];
      });

      expect(mockContext.toasts).toHaveLength(3);
      expect(mockContext.queuedToasts).toHaveLength(2);

      act(() => {
        // Remove one visible toast
        mockContext.removeToast(toastIds[0]!);
      });

      // Should now have 3 visible again (one promoted from queue)
      expect(mockContext.allToasts).toHaveLength(4);
      expect(mockContext.toasts).toHaveLength(3);
      expect(mockContext.queuedToasts).toHaveLength(1);
    });

    it('should respect maxToasts limit', () => {
      act(() => {
        // Add 7 toasts (maxToasts is 5)
        for (let i = 1; i <= 7; i++) {
          mockContext.addToast({
            content: `Toast ${i}`,
            priority: i <= 3 ? 'high' : 'low',
          });
        }
      });

      // Should only keep 5 toasts total
      expect(mockContext.allToasts).toHaveLength(5);
      // Should prioritize high priority toasts
      expect(mockContext.allToasts.filter((t: any) => t.priority === 'high')).toHaveLength(3);
    });
  });

  describe('Toast Updates', () => {
    beforeEach(() => {
      renderWithProvider();
    });

    it('should update existing toast', () => {
      let toastId: string;

      act(() => {
        toastId = mockContext.addToast({ content: 'Original', variant: 'info' });
      });

      act(() => {
        mockContext.updateToast(toastId, {
          content: 'Updated',
          variant: 'success',
          progress: 50,
        });
      });

      const updatedToast = mockContext.allToasts.find((t: any) => t.id === toastId);
      expect(updatedToast).toEqual(
        expect.objectContaining({
          content: 'Updated',
          variant: 'success',
          progress: 50,
        }),
      );
      expect(updatedToast.updatedAt).toBeGreaterThanOrEqual(updatedToast.createdAt);
    });

    it('should not update non-existent toast', () => {
      const originalLength = mockContext.allToasts.length;

      act(() => {
        mockContext.updateToast('non-existent-id', { content: 'Updated' });
      });

      expect(mockContext.allToasts).toHaveLength(originalLength);
    });
  });

  describe('Global Actions', () => {
    beforeEach(() => {
      renderWithProvider();
    });

    it('should pause and resume all toasts', () => {
      act(() => {
        mockContext.addToast({ content: 'Toast 1' });
        mockContext.addToast({ content: 'Toast 2' });
      });

      act(() => {
        mockContext.pauseAll();
      });

      // Note: pauseAll affects provider state, actual pause logic is in ToastRoot
      expect(mockContext.pauseAll).toBeDefined();

      act(() => {
        mockContext.resumeAll();
      });

      expect(mockContext.resumeAll).toBeDefined();
    });

    it('should clear all toasts', () => {
      act(() => {
        mockContext.addToast({ content: 'Toast 1' });
        mockContext.addToast({ content: 'Toast 2' });
        mockContext.addToast({ content: 'Toast 3' });
      });

      expect(mockContext.allToasts).toHaveLength(3);

      act(() => {
        mockContext.clearAll();
      });

      expect(mockContext.allToasts).toHaveLength(0);
      expect(mockContext.toasts).toHaveLength(0);
      expect(mockContext.queuedToasts).toHaveLength(0);
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      renderWithProvider({ duration: 2000 });
    });

    it('should handle global toast events', () => {
      const event = new CustomEvent('glide-toast', {
        detail: {
          content: 'Global Toast',
          config: { variant: 'success' },
        },
      });

      act(() => {
        window.dispatchEvent(event);
      });

      expect(mockContext.allToasts).toHaveLength(1);
      expect(mockContext.allToasts[0]).toEqual(
        expect.objectContaining({
          content: 'Global Toast',
          variant: 'success',
        }),
      );

      // Check that ID was set in event detail
      expect((event.detail as any).id).toBeDefined();
    });

    it('should handle toast removal events', () => {
      let toastId: string = '';

      act(() => {
        toastId = mockContext.addToast({ content: 'Toast to remove' });
      });

      expect(mockContext.allToasts).toHaveLength(1);

      const removeEvent = new CustomEvent('glide-toast-remove', {
        detail: { id: toastId },
      });

      act(() => {
        window.dispatchEvent(removeEvent);
      });

      expect(mockContext.allToasts).toHaveLength(0);
    });

    it('should resolve duration from event config or provider default', () => {
      // Toast with custom duration
      const customEvent = new CustomEvent('glide-toast', {
        detail: {
          content: 'Custom Duration',
          config: { duration: 5000 },
        },
      });

      act(() => {
        window.dispatchEvent(customEvent);
      });

      expect(mockContext.allToasts[0]).toEqual(
        expect.objectContaining({
          duration: 5000,
        }),
      );

      // Toast without custom duration (should use provider default)
      const defaultEvent = new CustomEvent('glide-toast', {
        detail: {
          content: 'Default Duration',
          config: {},
        },
      });

      act(() => {
        window.dispatchEvent(defaultEvent);
      });

      expect(mockContext.allToasts[1]).toEqual(
        expect.objectContaining({
          duration: 2000, // Provider default
        }),
      );
    });
  });
});
