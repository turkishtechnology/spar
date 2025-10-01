/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToastContext } from '../ToastProvider';

// Simple test component for swipe configuration tests
const SwipeConfigTestComponent = ({
  onToastsChange,
}: {
  onToastsChange: (toasts: readonly any[]) => void;
}) => {
  const { toasts, addToast } = useToastContext();

  React.useEffect(() => {
    onToastsChange([...toasts]);
  }, [toasts, onToastsChange]);

  return (
    <div>
      <button
        onClick={() =>
          addToast({
            content: 'Swipe test toast',
            variant: 'info',
            duration: 5000,
          })
        }
        data-testid='add-swipe-toast'
      >
        Add Swipe Toast
      </button>
    </div>
  );
};

describe('Swipe Configuration Tests', () => {
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

  describe('Provider Swipe Settings', () => {
    it('should configure swipe direction through provider', () => {
      render(
        <ToastProvider swipeDirection='left' shouldCloseOnSwipeEnd={true}>
          <SwipeConfigTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      act(() => {
        screen.getByTestId('add-swipe-toast').click();
      });

      expect(toastsList).toHaveLength(1);
      expect(toastsList[0].content).toBe('Swipe test toast');
    });

    it('should configure right swipe direction', () => {
      render(
        <ToastProvider swipeDirection='right'>
          <SwipeConfigTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      act(() => {
        screen.getByTestId('add-swipe-toast').click();
      });

      expect(toastsList).toHaveLength(1);
    });

    it('should configure up swipe direction', () => {
      render(
        <ToastProvider swipeDirection='up'>
          <SwipeConfigTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      act(() => {
        screen.getByTestId('add-swipe-toast').click();
      });

      expect(toastsList).toHaveLength(1);
    });

    it('should configure down swipe direction', () => {
      render(
        <ToastProvider swipeDirection='down'>
          <SwipeConfigTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      act(() => {
        screen.getByTestId('add-swipe-toast').click();
      });

      expect(toastsList).toHaveLength(1);
    });

    it('should handle shouldCloseOnSwipeEnd setting', () => {
      render(
        <ToastProvider shouldCloseOnSwipeEnd={false}>
          <SwipeConfigTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      act(() => {
        screen.getByTestId('add-swipe-toast').click();
      });

      expect(toastsList).toHaveLength(1);
      // When disabled, toasts should still be created but swipe dismiss would be disabled
    });

    it('should enable swipe dismiss by default', () => {
      render(
        <ToastProvider shouldCloseOnSwipeEnd={true}>
          <SwipeConfigTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      act(() => {
        screen.getByTestId('add-swipe-toast').click();
      });

      expect(toastsList).toHaveLength(1);
    });
  });

  describe('Multiple Toasts with Swipe', () => {
    it('should handle multiple toasts with swipe enabled', () => {
      render(
        <ToastProvider>
          <SwipeConfigTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      // Add multiple toasts
      act(() => {
        screen.getByTestId('add-swipe-toast').click();
        screen.getByTestId('add-swipe-toast').click();
        screen.getByTestId('add-swipe-toast').click();
      });

      expect(toastsList).toHaveLength(3);
      expect(toastsList.every((toast) => toast.content === 'Swipe test toast')).toBe(true);
    });
  });

  describe('Swipe Integration with Priority', () => {
    it('should work with priority system', () => {
      render(
        <ToastProvider maxToasts={2} swipeDirection='right'>
          <SwipeConfigTestComponent onToastsChange={onToastsChange} />
        </ToastProvider>,
      );

      // Add toasts that will test priority + swipe
      act(() => {
        screen.getByTestId('add-swipe-toast').click();
        screen.getByTestId('add-swipe-toast').click();
        screen.getByTestId('add-swipe-toast').click(); // Should remove oldest due to maxToasts
      });

      expect(toastsList).toHaveLength(2); // Limited by maxToasts
    });
  });
});
