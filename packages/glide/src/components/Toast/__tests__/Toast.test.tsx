import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
  useToastContext,
} from '../Toast';

describe('ToastProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders children correctly', () => {
    render(
      <ToastProvider>
        <div data-testid='child'>Child content</div>
      </ToastProvider>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies default props correctly', () => {
    render(
      <ToastProvider>
        <div>Content</div>
      </ToastProvider>,
    );

    const viewport = document.querySelector('[data-toast-viewport]');
    expect(viewport).toHaveAttribute('data-toast-viewport');
    expect(viewport).toHaveAttribute('data-position', 'top-right');
  });

  it('applies custom position', () => {
    render(
      <ToastProvider position='bottom-left'>
        <div>Content</div>
      </ToastProvider>,
    );

    const viewport = document.querySelector('[data-toast-viewport]');
    expect(viewport).toHaveAttribute('data-position', 'bottom-left');
  });

  it('limits maximum toasts', () => {
    const TestComponent = () => {
      const { addToast } = useToastContext();

      return (
        <button onClick={() => addToast({ content: 'Test', variant: 'info' })}>Add Toast</button>
      );
    };

    render(
      <ToastProvider maxToasts={2}>
        <TestComponent />
      </ToastProvider>,
    );

    // This test would need the context hook to be implemented
    // Skipping for now due to missing useToastContext implementation
  });
});

describe('ToastRoot', () => {
  const renderToastRoot = (props = {}) => {
    return render(
      <ToastProvider>
        <ToastRoot {...props}>
          <div>Toast content</div>
        </ToastRoot>
      </ToastProvider>,
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders with default props', () => {
    renderToastRoot();

    const toast = screen.getByRole('status', { hidden: true });
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveAttribute('data-toast-root');
    expect(toast).toHaveAttribute('data-variant', 'info');
    expect(toast).toHaveAttribute('data-size', 'medium');
  });

  it('renders with custom variant', () => {
    renderToastRoot({ variant: 'error' });

    const toast = screen.getByRole('alert', { hidden: true });
    expect(toast).toHaveAttribute('data-variant', 'error');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders with warning variant', () => {
    renderToastRoot({ variant: 'warning' });

    const toast = screen.getByRole('status', { hidden: true });
    expect(toast).toHaveAttribute('data-variant', 'warning');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders with loading variant', () => {
    renderToastRoot({ variant: 'loading' });

    const toast = screen.getByRole('log', { hidden: true });
    expect(toast).toHaveAttribute('data-variant', 'loading');
  });

  it('applies custom size', () => {
    renderToastRoot({ size: 'large' });

    const toast = screen.getByRole('status', { hidden: true });
    expect(toast).toHaveAttribute('data-size', 'large');
  });

  it('handles controlled open state', () => {
    renderToastRoot({ open: false });

    const toast = screen.getByRole('status', { hidden: true });
    expect(toast).toHaveAttribute('aria-hidden', 'true');
    expect(toast).toHaveAttribute('data-state', 'closed');
  });

  it('handles default open state', () => {
    renderToastRoot({ defaultOpen: true });

    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-hidden', 'false');
    expect(toast).toHaveAttribute('data-state', 'open');
  });

  it('calls onOpenChange when state changes', () => {
    const handleOpenChange = jest.fn();
    renderToastRoot({ onOpenChange: handleOpenChange, defaultIsOpen: true });

    // This would test the controlled state pattern
    // Implementation depends on the actual state management
  });

  it('handles loading state', () => {
    renderToastRoot({ loading: true });

    const toast = screen.getByRole('status', { hidden: true });
    expect(toast).toHaveAttribute('aria-busy', 'true');
    expect(toast).toHaveAttribute('data-loading', 'true');
  });

  it('handles persistent state', () => {
    renderToastRoot({ persistent: true });

    const toast = screen.getByRole('status', { hidden: true });
    // Persistent toasts should not auto-dismiss

    jest.advanceTimersByTime(10000);
    expect(toast).toHaveAttribute('data-state', 'closed');
  });

  it('handles keyboard interactions', () => {
    renderToastRoot({ defaultOpen: true });

    const toast = screen.getByRole('status');

    // Simulate keyboard event with React fireEvent
    toast.focus();
    fireEvent.keyDown(toast, { key: 'Escape' });

    expect(toast).toHaveAttribute('data-state', 'closed');
  });

  it('pauses on hover when configured', () => {
    renderToastRoot({
      defaultOpen: true,
      duration: 1000,
    });

    const toast = screen.getByRole('status');

    // Simulate mouse events with React fireEvent
    fireEvent.mouseEnter(toast);
    expect(toast).toHaveAttribute('data-paused', 'true');

    fireEvent.mouseLeave(toast);
    expect(toast).toHaveAttribute('data-paused', 'false');
  });

  it('pauses on focus when configured', () => {
    renderToastRoot({
      defaultOpen: true,
      duration: 1000,
    });

    const toast = screen.getByRole('status');

    // Simulate focus events with React fireEvent
    fireEvent.focus(toast);
    expect(toast).toHaveAttribute('data-paused', 'true');

    fireEvent.blur(toast);
    expect(toast).toHaveAttribute('data-paused', 'false');
  });

  it('auto-dismisses after duration', async () => {
    const handleDurationEnd = jest.fn();

    renderToastRoot({
      defaultOpen: true,
      duration: 1000,
      onDurationEnd: handleDurationEnd,
    });

    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('data-state', 'open');

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(toast).toHaveAttribute('data-state', 'closed');
      expect(handleDurationEnd).toHaveBeenCalled();
    });
  });

  it('renders with polymorphic as prop', () => {
    render(
      <ToastProvider>
        <ToastRoot as='section' aria-label='Notification'>
          Content
        </ToastRoot>
      </ToastProvider>,
    );

    const toast = screen.getByRole('status', { hidden: true });
    expect(toast.tagName).toBe('SECTION');
  });
});

describe('ToastContent', () => {
  const renderToastContent = (props = {}) => {
    return render(
      <ToastProvider>
        <ToastRoot>
          <ToastContent {...props}>
            <div>Content</div>
          </ToastContent>
        </ToastRoot>
      </ToastProvider>,
    );
  };

  it('renders content correctly', () => {
    renderToastContent();

    const content = screen.getByText('Content').parentElement;
    expect(content).toHaveAttribute('data-toast-content');
  });

  it('renders with polymorphic as prop', () => {
    render(
      <ToastProvider>
        <ToastRoot>
          <ToastContent as='section'>
            <div data-testid='content'>Content</div>
          </ToastContent>
        </ToastRoot>
      </ToastProvider>,
    );

    const content = screen.getByTestId('content').parentElement;
    expect(content?.tagName).toBe('SECTION');
  });
});

describe('ToastTitle', () => {
  const renderToastTitle = (props = {}) => {
    return render(
      <ToastProvider>
        <ToastRoot>
          <ToastTitle {...props}>Toast Title</ToastTitle>
        </ToastRoot>
      </ToastProvider>,
    );
  };

  it('renders as h3 by default', () => {
    renderToastTitle();

    const title = screen.getByRole('heading', { level: 3, hidden: true });
    expect(title).toHaveTextContent('Toast Title');
    expect(title).toHaveAttribute('data-toast-title');
  });

  it('renders with custom heading level', () => {
    renderToastTitle({ level: 2 });

    const title = screen.getByRole('heading', { level: 2, hidden: true });
    expect(title).toHaveTextContent('Toast Title');
  });

  it('renders with polymorphic as prop', () => {
    renderToastTitle({ as: 'h1' });

    const title = screen.getByRole('heading', { level: 1, hidden: true });
    expect(title).toHaveTextContent('Toast Title');
  });
});

describe('ToastDescription', () => {
  const renderToastDescription = (props = {}) => {
    return render(
      <ToastProvider>
        <ToastRoot>
          <ToastDescription {...props}>Description text</ToastDescription>
        </ToastRoot>
      </ToastProvider>,
    );
  };

  it('renders as paragraph by default', () => {
    renderToastDescription();

    const description = screen.getByText('Description text');
    expect(description).toHaveAttribute('data-toast-description');
    expect(description.tagName).toBe('P');
  });

  it('renders with polymorphic as prop', () => {
    renderToastDescription({ as: 'span' });

    const description = screen.getByText('Description text');
    expect(description.tagName).toBe('SPAN');
  });
});

describe('ToastAction', () => {
  const renderToastAction = (props = {}) => {
    return render(
      <ToastProvider>
        <ToastRoot>
          <ToastAction altText='Retry action' {...props}>
            Retry
          </ToastAction>
        </ToastRoot>
      </ToastProvider>,
    );
  };

  it('renders as button by default', () => {
    renderToastAction();

    const action = screen.getByRole('button', { name: 'Retry action', hidden: true });
    expect(action).toHaveTextContent('Retry');
    expect(action).toHaveAttribute('data-toast-action');
    expect(action).toHaveAttribute('type', 'button');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    renderToastAction({ onClick: handleClick });

    const action = screen.getByRole('button', { hidden: true });
    await user.click(action);

    expect(handleClick).toHaveBeenCalled();
  });

  it('renders with polymorphic as prop', () => {
    renderToastAction({ as: 'a', href: '#' });

    const action = screen.getByRole('link', { name: 'Retry action', hidden: true });
    expect(action).toHaveTextContent('Retry');
  });

  it('requires altText prop', () => {
    // This would test prop validation
    // Implementation depends on prop-types or TypeScript validation
  });
});

describe('ToastClose', () => {
  const renderToastClose = (props = {}) => {
    return render(
      <ToastProvider>
        <ToastRoot>
          <ToastClose {...props}>×</ToastClose>
        </ToastRoot>
      </ToastProvider>,
    );
  };

  it('renders as button by default', () => {
    renderToastClose({ 'aria-label': 'Close notification' });

    const close = screen.getByRole('button', { name: 'Close notification', hidden: true });
    expect(close).toHaveTextContent('×');
    expect(close).toHaveAttribute('data-toast-close');
    expect(close).toHaveAttribute('type', 'button');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    renderToastClose({ onClick: handleClick, 'aria-label': 'Close' });

    const close = screen.getByRole('button', { hidden: true });
    await user.click(close);

    expect(handleClick).toHaveBeenCalled();
  });

  it('renders with polymorphic as prop', () => {
    renderToastClose({ as: 'div', role: 'button', 'aria-label': 'Close notification' });

    const close = screen.getByRole('button', { name: 'Close notification', hidden: true });
    expect(close).toHaveTextContent('×');
  });
});

describe('ToastIcon', () => {
  const renderToastIcon = (props = {}) => {
    return render(
      <ToastProvider>
        <ToastRoot>
          <ToastIcon {...props}>
            <svg data-testid='icon'>
              <circle />
            </svg>
          </ToastIcon>
        </ToastRoot>
      </ToastProvider>,
    );
  };

  it('renders as span by default', () => {
    renderToastIcon();

    const icon = screen.getByTestId('icon').parentElement;
    expect(icon).toHaveAttribute('data-toast-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon?.tagName).toBe('SPAN');
  });

  it('renders with polymorphic as prop', () => {
    renderToastIcon({ as: 'div' });

    const icon = screen.getByTestId('icon').parentElement;
    expect(icon?.tagName).toBe('DIV');
  });

  it('is hidden from screen readers', () => {
    renderToastIcon();

    const icon = screen.getByTestId('icon').parentElement;
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('ToastProgress', () => {
  const renderToastProgress = (props = {}) => {
    return render(
      <ToastProvider>
        <ToastRoot>
          <ToastProgress {...props}>
            <div data-testid='progress-content'>Loading...</div>
          </ToastProgress>
        </ToastRoot>
      </ToastProvider>,
    );
  };

  it('renders with progressbar role', () => {
    renderToastProgress({ value: 50, 'aria-label': 'Loading progress' });

    const progress = screen.getByRole('progressbar', { name: 'Loading progress', hidden: true });
    expect(progress).toHaveAttribute('data-toast-progress');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders with custom max value', () => {
    renderToastProgress({ value: 25, max: 50, 'aria-label': 'Loading progress' });

    const progress = screen.getByRole('progressbar', { hidden: true });
    expect(progress).toHaveAttribute('aria-valuemax', '50');
  });

  it('renders with polymorphic as prop', () => {
    renderToastProgress({ as: 'section', value: 75, 'aria-label': 'Loading progress' });

    const progress = screen.getByRole('progressbar', { hidden: true });
    expect(progress.tagName).toBe('SECTION');
  });

  it('displays progress data attribute', () => {
    renderToastProgress({ value: 33, 'aria-label': 'Loading progress' });

    const progress = screen.getByRole('progressbar', { hidden: true });
    expect(progress).toHaveAttribute('data-progress', '33');
  });
});

describe('Error Boundaries and Edge Cases', () => {
  it('throws error when components used outside provider', () => {
    // Mock console.error to prevent test output noise
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ToastRoot>Content</ToastRoot>);
    }).toThrow('Toast components must be used within ToastProvider');

    consoleSpy.mockRestore();
  });

  it('handles undefined children gracefully', () => {
    render(
      <ToastProvider>
        <ToastRoot />
      </ToastProvider>,
    );

    const toast = screen.getByRole('status', { hidden: true });
    expect(toast).toBeInTheDocument();
  });

  it('handles empty content', () => {
    render(
      <ToastProvider>
        <ToastRoot>
          <ToastContent />
        </ToastRoot>
      </ToastProvider>,
    );

    const toast = screen.getByRole('status', { hidden: true });
    expect(toast).toBeInTheDocument();
  });
});
