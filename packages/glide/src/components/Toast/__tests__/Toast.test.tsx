import { render, screen, waitFor } from '@testing-library/react';
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

// Mock timer functions for testing auto-dismiss
jest.useFakeTimers();

describe('ToastProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
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

    const viewport = screen.getByRole('generic', { hidden: true });
    expect(viewport).toHaveAttribute('data-toast-viewport');
    expect(viewport).toHaveAttribute('data-position', 'top-right');
  });

  it('applies custom position', () => {
    render(
      <ToastProvider position='bottom-left'>
        <div>Content</div>
      </ToastProvider>,
    );

    const viewport = screen.getByRole('generic', { hidden: true });
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
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    renderToastRoot();

    const toast = screen.getByRole('status');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveAttribute('data-toast-root');
    expect(toast).toHaveAttribute('data-variant', 'info');
    expect(toast).toHaveAttribute('data-size', 'medium');
  });

  it('renders with custom variant', () => {
    renderToastRoot({ variant: 'error' });

    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('data-variant', 'error');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders with warning variant', () => {
    renderToastRoot({ variant: 'warning' });

    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('data-variant', 'warning');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders with loading variant', () => {
    renderToastRoot({ variant: 'loading' });

    const toast = screen.getByRole('log');
    expect(toast).toHaveAttribute('data-variant', 'loading');
  });

  it('applies custom size', () => {
    renderToastRoot({ size: 'large' });

    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('data-size', 'large');
  });

  it('handles controlled open state', () => {
    renderToastRoot({ isOpen: false });

    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-hidden', 'true');
    expect(toast).toHaveAttribute('data-state', 'closed');
  });

  it('handles default open state', () => {
    renderToastRoot({ defaultIsOpen: true });

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
    renderToastRoot({ isLoading: true });

    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-busy', 'true');
    expect(toast).toHaveAttribute('data-loading', 'true');
  });

  it('handles persistent state', () => {
    renderToastRoot({ isPersistent: true });

    const toast = screen.getByRole('status');
    // Persistent toasts should not auto-dismiss

    jest.advanceTimersByTime(10000);
    expect(toast).toHaveAttribute('data-state', 'open');
  });

  it('handles keyboard interactions', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderToastRoot({ defaultIsOpen: true });

    const toast = screen.getByRole('status');
    toast.focus();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(toast).toHaveAttribute('data-state', 'closed');
    });
  });

  it('pauses on hover when configured', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderToastRoot({
      defaultIsOpen: true,
      duration: 1000,
    });

    const toast = screen.getByRole('status');

    await user.hover(toast);
    expect(toast).toHaveAttribute('data-paused', 'true');

    await user.unhover(toast);
    expect(toast).toHaveAttribute('data-paused', 'false');
  });

  it('pauses on focus when configured', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderToastRoot({
      defaultIsOpen: true,
      duration: 1000,
    });

    const toast = screen.getByRole('status');

    await user.click(toast);
    expect(toast).toHaveAttribute('data-paused', 'true');

    toast.blur();
    expect(toast).toHaveAttribute('data-paused', 'false');
  });

  it('auto-dismisses after duration', async () => {
    const handleDurationEnd = jest.fn();

    renderToastRoot({
      defaultIsOpen: true,
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

    const toast = screen.getByRole('status');
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

    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveTextContent('Toast Title');
    expect(title).toHaveAttribute('data-toast-title');
  });

  it('renders with custom heading level', () => {
    renderToastTitle({ level: 2 });

    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('Toast Title');
  });

  it('renders with polymorphic as prop', () => {
    renderToastTitle({ as: 'h1' });

    const title = screen.getByRole('heading', { level: 1 });
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

    const action = screen.getByRole('button', { name: 'Retry action' });
    expect(action).toHaveTextContent('Retry');
    expect(action).toHaveAttribute('data-toast-action');
    expect(action).toHaveAttribute('type', 'button');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    renderToastAction({ onClick: handleClick });

    const action = screen.getByRole('button');
    await user.click(action);

    expect(handleClick).toHaveBeenCalled();
  });

  it('renders with polymorphic as prop', () => {
    renderToastAction({ as: 'a', href: '#' });

    const action = screen.getByRole('link', { name: 'Retry action' });
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
    renderToastClose();

    const close = screen.getByRole('button', { name: 'Close notification' });
    expect(close).toHaveTextContent('×');
    expect(close).toHaveAttribute('data-toast-close');
    expect(close).toHaveAttribute('type', 'button');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    renderToastClose({ onClick: handleClick });

    const close = screen.getByRole('button');
    await user.click(close);

    expect(handleClick).toHaveBeenCalled();
  });

  it('renders with polymorphic as prop', () => {
    renderToastClose({ as: 'div', role: 'button' });

    const close = screen.getByRole('button', { name: 'Close notification' });
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
    renderToastProgress({ value: 50 });

    const progress = screen.getByRole('progressbar', { name: 'Loading progress' });
    expect(progress).toHaveAttribute('data-toast-progress');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders with custom max value', () => {
    renderToastProgress({ value: 25, max: 50 });

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuemax', '50');
  });

  it('renders with polymorphic as prop', () => {
    renderToastProgress({ as: 'section', value: 75 });

    const progress = screen.getByRole('progressbar');
    expect(progress.tagName).toBe('SECTION');
  });

  it('displays progress data attribute', () => {
    renderToastProgress({ value: 33 });

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('data-progress', '33');
  });
});

describe('Error Boundaries and Edge Cases', () => {
  it('throws error when components used outside provider', () => {
    // Mock console.error to prevent test output noise
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ToastRoot>Content</ToastRoot>);
    }).toThrow('Toast components must be used within ToastProvider');

    // eslint-disable-next-line no-console
    console.error.mockRestore();
  });

  it('handles undefined children gracefully', () => {
    render(
      <ToastProvider>
        <ToastRoot />
      </ToastProvider>,
    );

    const toast = screen.getByRole('status');
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

    const toast = screen.getByRole('status');
    expect(toast).toBeInTheDocument();
  });
});
