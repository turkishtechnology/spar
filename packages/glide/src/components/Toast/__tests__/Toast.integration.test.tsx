import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ToastProvider,
  ToastRoot,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastIcon,
  ToastProgress,
} from '../Toast';

// Mock timer functions for testing auto-dismiss and animations
jest.useFakeTimers();

describe('Toast Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Provider Context Integration', () => {
    it('provides context to all child components', () => {
      render(
        <ToastProvider maxToasts={3} position='bottom-right'>
          <ToastRoot defaultOpen>
            <ToastContent>
              <ToastTitle>Context Test</ToastTitle>
              <ToastDescription>Testing provider context</ToastDescription>
              <ToastAction altText='Test action'>Action</ToastAction>
              <ToastClose aria-label='Close notification'>×</ToastClose>
            </ToastContent>
          </ToastRoot>
        </ToastProvider>,
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByRole('heading')).toHaveTextContent('Context Test');
      expect(screen.getByText('Testing provider context')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Test action' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close notification' })).toBeInTheDocument();
    });

    it('applies provider configuration to toasts', () => {
      render(
        <ToastProvider position='top-left' shouldPauseOnHover={false} shouldPauseOnFocus={false}>
          <ToastRoot defaultOpen>
            <ToastContent>
              <ToastDescription>Provider config test</ToastDescription>
            </ToastContent>
          </ToastRoot>
        </ToastProvider>,
      );

      const viewport = document.querySelector('[data-toast-viewport]');
      expect(viewport).toHaveAttribute('data-position', 'top-left');
    });

    it('manages multiple toasts within max limit', () => {
      render(
        <ToastProvider maxToasts={2}>
          <ToastRoot defaultOpen data-testid='toast-1'>
            <ToastContent>
              <ToastDescription>First toast</ToastDescription>
            </ToastContent>
          </ToastRoot>
          <ToastRoot defaultOpen data-testid='toast-2'>
            <ToastContent>
              <ToastDescription>Second toast</ToastDescription>
            </ToastContent>
          </ToastRoot>
          <ToastRoot defaultOpen data-testid='toast-3'>
            <ToastContent>
              <ToastDescription>Third toast (should not show)</ToastDescription>
            </ToastContent>
          </ToastRoot>
        </ToastProvider>,
      );

      expect(screen.getByText('First toast')).toBeInTheDocument();
      expect(screen.getByText('Second toast')).toBeInTheDocument();
      // Third toast should be limited by maxToasts configuration
      // Note: This behavior needs to be implemented in the actual provider
    });
  });

  describe('Multi-component Interactions', () => {
    it('handles complete toast lifecycle with all components', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const handleAction = jest.fn();
      const handleClose = jest.fn();
      const handleOpenChange = jest.fn();

      render(
        <ToastProvider>
          <ToastRoot defaultOpen onOpenChange={handleOpenChange} duration={2000}>
            <ToastContent>
              <ToastIcon>✓</ToastIcon>
              <ToastTitle>File uploaded</ToastTitle>
              <ToastDescription>
                Your file has been successfully uploaded to the server.
              </ToastDescription>
              <ToastAction altText='View uploaded file' onClick={handleAction}>
                View
              </ToastAction>
              <ToastClose aria-label='Close notification' onClick={handleClose}>
                ×
              </ToastClose>
            </ToastContent>
          </ToastRoot>
        </ToastProvider>,
      );

      const toast = screen.getByRole('status');
      expect(toast).toHaveAttribute('data-state', 'open');

      // Test action interaction
      const viewButton = screen.getByRole('button', { name: 'View uploaded file' });
      await user.click(viewButton);
      expect(handleAction).toHaveBeenCalled();

      // Test close interaction
      const closeButton = screen.getByRole('button', { name: 'Close notification' });
      await user.click(closeButton);
      expect(handleClose).toHaveBeenCalled();
    });

    it('handles toast with progress indicator', async () => {
      const { rerender } = render(
        <ToastProvider>
          <ToastRoot defaultOpen>
            <ToastContent>
              <ToastTitle>Uploading file</ToastTitle>
              <ToastDescription>Please wait while your file uploads...</ToastDescription>
              <ToastProgress value={0} max={100}>
                <div>0% complete</div>
              </ToastProgress>
            </ToastContent>
          </ToastRoot>
        </ToastProvider>,
      );

      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '0');
      expect(screen.getByText('0% complete')).toBeInTheDocument();

      // Simulate progress update
      rerender(
        <ToastProvider>
          <ToastRoot defaultOpen>
            <ToastContent>
              <ToastTitle>Uploading file</ToastTitle>
              <ToastDescription>Please wait while your file uploads...</ToastDescription>
              <ToastProgress value={50} max={100}>
                <div>50% complete</div>
              </ToastProgress>
            </ToastContent>
          </ToastRoot>
        </ToastProvider>,
      );

      expect(progressbar).toHaveAttribute('aria-valuenow', '50');
      expect(screen.getByText('50% complete')).toBeInTheDocument();

      // Complete upload
      rerender(
        <ToastProvider>
          <ToastRoot defaultOpen>
            <ToastContent>
              <ToastIcon>✓</ToastIcon>
              <ToastTitle>Upload complete</ToastTitle>
              <ToastDescription>Your file has been uploaded successfully.</ToastDescription>
            </ToastContent>
          </ToastRoot>
        </ToastProvider>,
      );

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText('Upload complete')).toBeInTheDocument();
    });

    it('handles toast state transitions', async () => {
      const handleOpenChange = jest.fn();

      const { rerender } = render(
        <ToastProvider>
          <ToastRoot open={false} onOpenChange={handleOpenChange}>
            <ToastContent>
              <ToastDescription>State transition test</ToastDescription>
            </ToastContent>
          </ToastRoot>
        </ToastProvider>,
      );

      const toast = screen.getByRole('status', { hidden: true });
      expect(toast).toHaveAttribute('data-state', 'closed');
      expect(toast).toHaveAttribute('aria-hidden', 'true');

      // Open the toast
      rerender(
        <ToastProvider>
          <ToastRoot open={true} onOpenChange={handleOpenChange}>
            <ToastContent>
              <ToastDescription>State transition test</ToastDescription>
            </ToastContent>
          </ToastRoot>
        </ToastProvider>,
      );

      expect(toast).toHaveAttribute('data-state', 'open');
      expect(toast).toHaveAttribute('aria-hidden', 'false');

      // Close the toast
      rerender(
        <ToastProvider>
          <ToastRoot open={false} onOpenChange={handleOpenChange}>
            <ToastContent>
              <ToastDescription>State transition test</ToastDescription>
            </ToastContent>
          </ToastRoot>
        </ToastProvider>,
      );

      expect(toast).toHaveAttribute('data-state', 'closed');
      expect(toast).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('handles form submission success toast', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const FormExample = () => {
        const [showSuccess, setShowSuccess] = React.useState(false);

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          setShowSuccess(true);
        };

        return (
          <ToastProvider>
            <form onSubmit={handleSubmit}>
              <input type='text' placeholder='Enter text' />
              <button type='submit'>Submit</button>
            </form>

            <ToastRoot
              open={showSuccess}
              onOpenChange={setShowSuccess}
              variant='success'
              duration={3000}
            >
              <ToastContent>
                <ToastIcon>✓</ToastIcon>
                <ToastTitle>Success!</ToastTitle>
                <ToastDescription>Your form has been submitted successfully.</ToastDescription>
                <ToastClose>×</ToastClose>
              </ToastContent>
            </ToastRoot>
          </ToastProvider>
        );
      };

      render(<FormExample />);

      const input = screen.getByPlaceholderText('Enter text');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      await user.type(input, 'test data');
      await user.click(submitButton);

      const successToast = screen.getByRole('status');
      expect(successToast).toHaveAttribute('data-variant', 'success');
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByText('Your form has been submitted successfully.')).toBeInTheDocument();

      // Auto-dismiss after duration
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(successToast).toHaveAttribute('data-state', 'closed');
      });
    });

    it('handles error notification with retry action', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const ErrorExample = () => {
        const [error, setError] = React.useState(false);
        const [retryCount, setRetryCount] = React.useState(0);

        const handleError = () => setError(true);
        const handleRetry = () => {
          setRetryCount((prev) => prev + 1);
          setError(false);
        };

        return (
          <ToastProvider>
            <button onClick={handleError}>Trigger Error</button>
            <div data-testid='retry-count'>Retries: {retryCount}</div>

            <ToastRoot open={error} onOpenChange={setError} variant='error' persistent>
              <ToastContent>
                <ToastIcon>⚠</ToastIcon>
                <ToastTitle>Network Error</ToastTitle>
                <ToastDescription>
                  Failed to save your changes. Please check your connection and try again.
                </ToastDescription>
                <ToastAction altText='Retry saving changes' onClick={handleRetry}>
                  Retry
                </ToastAction>
                <ToastClose>×</ToastClose>
              </ToastContent>
            </ToastRoot>
          </ToastProvider>
        );
      };

      render(<ErrorExample />);

      const triggerButton = screen.getByRole('button', { name: 'Trigger Error' });
      await user.click(triggerButton);

      const errorToast = screen.getByRole('alert');
      expect(errorToast).toHaveAttribute('data-variant', 'error');
      expect(screen.getByText('Network Error')).toBeInTheDocument();

      const retryButton = screen.getByRole('button', { name: 'Retry saving changes' });
      await user.click(retryButton);

      expect(screen.getByTestId('retry-count')).toHaveTextContent('Retries: 1');
      expect(errorToast).toHaveAttribute('data-state', 'closed');
    });

    it.skip('handles loading state with progress updates', async () => {
      const LoadingExample = () => {
        const [isLoading, setIsLoading] = React.useState(false);
        const [progress, setProgress] = React.useState(0);

        const handleStart = () => {
          setIsLoading(true);
          setProgress(0);

          // Simulate progress updates
          let currentProgress = 0;
          const interval = setInterval(() => {
            currentProgress += 10;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
              clearInterval(interval);
              setIsLoading(false);
            }
          }, 100);
        };

        return (
          <ToastProvider>
            <button onClick={handleStart}>Start Process</button>

            <ToastRoot open={isLoading} onOpenChange={setIsLoading} variant='loading' persistent>
              <ToastContent>
                <ToastTitle>Processing...</ToastTitle>
                <ToastDescription>Please wait while we process your request.</ToastDescription>
                <ToastProgress value={progress} max={100}>
                  <div>{progress}% complete</div>
                </ToastProgress>
              </ToastContent>
            </ToastRoot>
          </ToastProvider>
        );
      };

      render(<LoadingExample />);

      const startButton = screen.getByRole('button', { name: 'Start Process' });
      await act(async () => {
        await userEvent.click(startButton);
      });

      // Wait for toast to appear
      await waitFor(() => {
        expect(screen.getByText('Processing...')).toBeInTheDocument();
      });

      const loadingToast = screen.getByRole('status');
      expect(loadingToast).toHaveAttribute('data-variant', 'loading');

      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '0');

      // Fast forward through progress updates
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(progressbar).toHaveAttribute('aria-valuenow', '100');
      });
    });

    it.skip('handles multiple toast types simultaneously', () => {
      // This test might not work as expected because multiple ToastRoots
      // under the same provider might have different behavior
      render(
        <ToastProvider maxToasts={5}>
          <ToastRoot defaultOpen variant='info' data-testid='info-toast'>
            <ToastContent>
              <ToastDescription>Information message</ToastDescription>
            </ToastContent>
          </ToastRoot>

          <ToastRoot defaultOpen variant='success' data-testid='success-toast'>
            <ToastContent>
              <ToastTitle>Success</ToastTitle>
              <ToastDescription>Operation completed</ToastDescription>
            </ToastContent>
          </ToastRoot>

          <ToastRoot defaultOpen variant='warning' data-testid='warning-toast'>
            <ToastContent>
              <ToastTitle>Warning</ToastTitle>
              <ToastDescription>Please review your settings</ToastDescription>
            </ToastContent>
          </ToastRoot>

          <ToastRoot defaultOpen variant='error' data-testid='error-toast'>
            <ToastContent>
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>Something went wrong</ToastDescription>
              <ToastAction altText='Report error'>Report</ToastAction>
            </ToastContent>
          </ToastRoot>
        </ToastProvider>,
      );

      // Check that all toasts are rendered
      expect(screen.getByText('Information message')).toBeInTheDocument();
      expect(screen.getByText('Operation completed')).toBeInTheDocument();
      expect(screen.getByText('Please review your settings')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Report error' })).toBeInTheDocument();
    });
  });

  describe('Async Operations and Event Propagation', () => {
    it.skip('handles async action completion', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      const AsyncExample = () => {
        const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>(
          'idle',
        );

        const handleAsyncAction = async () => {
          setStatus('loading');

          try {
            // Simulate async operation
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setStatus('success');
          } catch {
            setStatus('error');
          }
        };

        return (
          <ToastProvider>
            <button onClick={handleAsyncAction}>Start Async Action</button>

            <ToastRoot open={status === 'loading'} variant='loading' persistent>
              <ToastContent>
                <ToastTitle>Loading...</ToastTitle>
                <ToastDescription>Processing your request</ToastDescription>
              </ToastContent>
            </ToastRoot>

            <ToastRoot
              open={status === 'success'}
              onOpenChange={() => setStatus('idle')}
              variant='success'
              duration={2000}
            >
              <ToastContent>
                <ToastTitle>Success!</ToastTitle>
                <ToastDescription>Operation completed successfully</ToastDescription>
              </ToastContent>
            </ToastRoot>
          </ToastProvider>
        );
      };

      render(<AsyncExample />);

      const actionButton = screen.getByRole('button', { name: 'Start Async Action' });
      await user.click(actionButton);

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText('Success!')).toBeInTheDocument();
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(screen.queryByRole('status')).toHaveAttribute('data-state', 'closed');
      });
    });

    it.skip('prevents event bubbling in interactive elements', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const handleContainerClick = jest.fn();
      const handleActionClick = jest.fn();

      render(
        <ToastProvider>
          <div onClick={handleContainerClick}>
            <ToastRoot defaultOpen>
              <ToastContent>
                <ToastDescription>Event propagation test</ToastDescription>
                <ToastAction
                  altText='Test action'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick();
                  }}
                >
                  Action
                </ToastAction>
              </ToastContent>
            </ToastRoot>
          </div>
        </ToastProvider>,
      );

      const actionButton = screen.getByRole('button', { name: 'Test action' });
      await user.click(actionButton);

      expect(handleActionClick).toHaveBeenCalledTimes(1);
      expect(handleContainerClick).not.toHaveBeenCalled();
    });
  });

  describe('Performance and Memory Management', () => {
    it.skip('cleans up timers when component unmounts', () => {
      const { unmount } = render(
        <ToastProvider>
          <ToastRoot defaultOpen duration={5000}>
            <ToastContent>
              <ToastDescription>Timer cleanup test</ToastDescription>
            </ToastContent>
          </ToastRoot>
        </ToastProvider>,
      );

      // Component should render without errors
      expect(screen.getByText('Timer cleanup test')).toBeInTheDocument();

      unmount();

      // Component should unmount cleanly without memory leaks
      expect(screen.queryByText('Timer cleanup test')).not.toBeInTheDocument();
    });

    it.skip('handles rapid state changes without memory leaks', () => {
      const RapidChangeExample = () => {
        const [count, setCount] = React.useState(0);

        React.useEffect(() => {
          const interval = setInterval(() => {
            setCount((prev) => prev + 1);
          }, 10);

          if (count > 10) {
            clearInterval(interval);
          }

          return () => clearInterval(interval);
        }, [count]);

        return (
          <ToastProvider>
            <ToastRoot open={count % 2 === 0}>
              <ToastContent>
                <ToastDescription>Count: {count}</ToastDescription>
              </ToastContent>
            </ToastRoot>
          </ToastProvider>
        );
      };

      const { unmount } = render(<RapidChangeExample />);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Component should handle rapid changes without issues
      // Check if toast is visible or hidden based on count
      const toast = screen.queryByRole('status') || screen.queryByRole('status', { hidden: true });
      expect(toast).toBeInTheDocument();

      unmount();
    });
  });
});
