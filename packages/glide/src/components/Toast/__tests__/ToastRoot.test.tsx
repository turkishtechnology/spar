import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ToastRoot } from '../ToastRoot';
import { ToastProvider } from '../ToastProvider';

// Mock ToastProvider context
const MockToastProvider = ({ children, config = {} }: { children: React.ReactNode; config?: any }) => {
  const defaultConfig = {
    maxToasts: 5,
    visibleLimit: 3,
    position: 'top-right',
    duration: 3000,
    shouldPauseOnHover: true,
    shouldPauseOnFocus: true,
    swipeDirection: 'right',
    shouldCloseOnSwipeEnd: true,
    ...config
  };

  return (
    <ToastProvider {...defaultConfig}>
      {children}
    </ToastProvider>
  );
};

describe('ToastRoot', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering and Accessibility', () => {
    it('should render with correct ARIA attributes', () => {
      render(
        <MockToastProvider>
          <ToastRoot variant="error" open={true}>
            Error message
          </ToastRoot>
        </MockToastProvider>
      );

      const toast = screen.getByRole('alert');
      expect(toast).toBeInTheDocument();
      expect(toast).toHaveAttribute('aria-live', 'assertive');
      expect(toast).toHaveAttribute('aria-atomic', 'true');
      expect(toast).toHaveAttribute('data-variant', 'error');
      expect(toast).toHaveAttribute('data-state', 'open');
    });

    it('should render different ARIA roles for different variants', () => {
      const { rerender } = render(
        <MockToastProvider>
          <ToastRoot variant="success" open={true}>Success</ToastRoot>
        </MockToastProvider>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

      rerender(
        <MockToastProvider>
          <ToastRoot variant="loading" open={true}>Loading</ToastRoot>
        </MockToastProvider>
      );

      expect(screen.getByRole('log')).toBeInTheDocument();
    });

    it('should be hidden when closed', () => {
      render(
        <MockToastProvider>
          <ToastRoot variant="info" open={false}>
            Hidden toast
          </ToastRoot>
        </MockToastProvider>
      );

      const toast = screen.getByRole('status', { hidden: true });
      expect(toast).toHaveAttribute('aria-hidden', 'true');
      expect(toast).toHaveAttribute('data-state', 'closed');
    });

    it('should show loading state correctly', () => {
      render(
        <MockToastProvider>
          <ToastRoot variant="info" loading={true} open={true}>
            Loading toast
          </ToastRoot>
        </MockToastProvider>
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveAttribute('aria-busy', 'true');
      expect(toast).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Timer Management', () => {
    it('should auto-close after duration', async () => {
      const onOpenChange = jest.fn();
      const onDurationEnd = jest.fn();

      render(
        <MockToastProvider config={{ duration: 2000 }}>
          <ToastRoot 
            open={true} 
            onOpenChange={onOpenChange}
            onDurationEnd={onDurationEnd}
          >
            Auto-close toast
          </ToastRoot>
        </MockToastProvider>
      );

      // Fast-forward time with act
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onDurationEnd).toHaveBeenCalled();
      });
    });

    it('should use custom duration over provider default', async () => {
      const onOpenChange = jest.fn();

      render(
        <MockToastProvider config={{ duration: 2000 }}>
          <ToastRoot 
            open={true} 
            duration={5000} // Custom duration
            onOpenChange={onOpenChange}
          >
            Custom duration toast
          </ToastRoot>
        </MockToastProvider>
      );

      // Should not close at provider default time
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(onOpenChange).not.toHaveBeenCalled();

      // Should close at custom duration
      act(() => {
        jest.advanceTimersByTime(3000); // Total 5000ms
      });
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should not auto-close when persistent', () => {
      const onOpenChange = jest.fn();

      render(
        <MockToastProvider config={{ duration: 1000 }}>
          <ToastRoot 
            open={true} 
            persistent={true}
            onOpenChange={onOpenChange}
          >
            Persistent toast
          </ToastRoot>
        </MockToastProvider>
      );

      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should not start timer when loading', () => {
      const onOpenChange = jest.fn();

      render(
        <MockToastProvider config={{ duration: 1000 }}>
          <ToastRoot 
            open={true} 
            loading={true}
            onOpenChange={onOpenChange}
          >
            Loading toast
          </ToastRoot>
        </MockToastProvider>
      );

      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should not auto-close with zero duration', () => {
      const onOpenChange = jest.fn();

      render(
        <MockToastProvider>
          <ToastRoot 
            open={true} 
            duration={0}
            onOpenChange={onOpenChange}
          >
            No auto-close toast
          </ToastRoot>
        </MockToastProvider>
      );

      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('Pause/Resume Functionality', () => {
    it('should pause timer on hover when configured', async () => {
      const onOpenChange = jest.fn();

      render(
        <MockToastProvider config={{ duration: 2000, shouldPauseOnHover: true }}>
          <ToastRoot open={true} onOpenChange={onOpenChange}>
            Hoverable toast
          </ToastRoot>
        </MockToastProvider>
      );

      const toast = screen.getByRole('status');

      // Start timer (should be running)
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Hover to pause
      act(() => {
        fireEvent.mouseEnter(toast);
      });
      
      // Advance time while paused - should not close
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(onOpenChange).not.toHaveBeenCalled();

      // Unhover to resume
      act(() => {
        fireEvent.mouseLeave(toast);
      });
      
      // Should close after remaining time (1000ms remaining)
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should not pause on hover when disabled', () => {
      render(
        <MockToastProvider config={{ shouldPauseOnHover: false }}>
          <ToastRoot open={true}>
            Non-hoverable toast
          </ToastRoot>
        </MockToastProvider>
      );

      const toast = screen.getByRole('status');
      fireEvent.mouseEnter(toast);
      
      // Should not have paused attribute
      expect(toast).toHaveAttribute('data-paused', 'false');
    });

    it('should pause timer on focus when configured', async () => {
      const onOpenChange = jest.fn();

      render(
        <MockToastProvider config={{ duration: 2000, shouldPauseOnFocus: true }}>
          <ToastRoot open={true} onOpenChange={onOpenChange}>
            Focusable toast
          </ToastRoot>
        </MockToastProvider>
      );

      const toast = screen.getByRole('status');

      // Focus to pause
      act(() => {
        fireEvent.focus(toast);
      });
      
      // Should not close while focused
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      expect(onOpenChange).not.toHaveBeenCalled();

      // Blur to resume
      act(() => {
        fireEvent.blur(toast);
      });
      
      // Should close after duration
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should reset timer when duration changes', async () => {
      const onOpenChange = jest.fn();

      const { rerender } = render(
        <MockToastProvider>
          <ToastRoot open={true} duration={2000} onOpenChange={onOpenChange}>
            Duration changing toast
          </ToastRoot>
        </MockToastProvider>
      );

      // Advance partway through original duration
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Change duration
      act(() => {
        rerender(
          <MockToastProvider>
            <ToastRoot open={true} duration={5000} onOpenChange={onOpenChange}>
              Duration changing toast
            </ToastRoot>
          </MockToastProvider>
        );
      });

      // Should not close at original time
      act(() => {
        jest.advanceTimersByTime(1000); // Total 2000ms
      });
      expect(onOpenChange).not.toHaveBeenCalled();

      // Should close at new duration
      act(() => {
        jest.advanceTimersByTime(4000); // Total 5000ms from duration change
      });
      
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Keyboard Interaction', () => {
    it('should close on Escape key', async () => {
      const onOpenChange = jest.fn();
      const onDurationEnd = jest.fn();

      render(
        <MockToastProvider>
          <ToastRoot 
            open={true} 
            onOpenChange={onOpenChange}
            onDurationEnd={onDurationEnd}
          >
            Closeable toast
          </ToastRoot>
        </MockToastProvider>
      );

      const toast = screen.getByRole('status');
      
      fireEvent.keyDown(toast, { key: 'Escape' });

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onDurationEnd).toHaveBeenCalled();
      });
    });

    it('should not close on other keys', () => {
      const onOpenChange = jest.fn();

      render(
        <MockToastProvider>
          <ToastRoot open={true} onOpenChange={onOpenChange}>
            Key test toast
          </ToastRoot>
        </MockToastProvider>
      );

      const toast = screen.getByRole('status');
      
      fireEvent.keyDown(toast, { key: 'Enter' });
      fireEvent.keyDown(toast, { key: 'Space' });
      fireEvent.keyDown(toast, { key: 'Tab' });

      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('should work in uncontrolled mode', () => {
      render(
        <MockToastProvider>
          <ToastRoot defaultOpen={true}>
            Uncontrolled toast
          </ToastRoot>
        </MockToastProvider>
      );

      expect(screen.getByRole('status')).toHaveAttribute('data-state', 'open');
    });

    it('should work in controlled mode', () => {
      const { rerender } = render(
        <MockToastProvider>
          <ToastRoot open={true}>
            Controlled toast
          </ToastRoot>
        </MockToastProvider>
      );

      expect(screen.getByRole('status')).toHaveAttribute('data-state', 'open');

      rerender(
        <MockToastProvider>
          <ToastRoot open={false}>
            Controlled toast
          </ToastRoot>
        </MockToastProvider>
      );

      expect(screen.getByRole('status')).toHaveAttribute('data-state', 'closed');
    });
  });

  describe('Component Props', () => {
    it('should render as different component when "as" prop is provided', () => {
      render(
        <MockToastProvider>
          <ToastRoot as="section" open={true} data-testid="custom-toast">
            Custom component toast
          </ToastRoot>
        </MockToastProvider>
      );

      expect(screen.getByTestId('custom-toast').tagName).toBe('SECTION');
    });

    it('should apply custom className and other props', () => {
      render(
        <MockToastProvider>
          <ToastRoot 
            open={true} 
            className="custom-class"
            data-testid="custom-toast"
            style={{ backgroundColor: 'red' }}
          >
            Custom styled toast
          </ToastRoot>
        </MockToastProvider>
      );

      const toast = screen.getByTestId('custom-toast');
      expect(toast).toHaveClass('custom-class');
      expect(toast).toHaveStyle('background-color: red');
    });
  });
});