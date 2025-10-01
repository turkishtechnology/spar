import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider } from '../ToastProvider';
import { ToastRoot } from '../ToastRoot';
import { useSwipeGesture } from '../useSwipeGesture';

// Mock the useSwipeGesture hook
jest.mock('../useSwipeGesture');
const mockUseSwipeGesture = useSwipeGesture as jest.MockedFunction<typeof useSwipeGesture>;

describe('ToastRoot Swipe Integration', () => {
  let mockOnSwipeStart: jest.Mock;
  let mockOnSwipeEnd: jest.Mock;

  beforeEach(() => {
    mockOnSwipeStart = jest.fn();
    mockOnSwipeEnd = jest.fn();

    // Reset mock to default implementation
    mockUseSwipeGesture.mockReturnValue({
      isSwping: false,
      currentSwipe: null,
      handlers: {
        onMouseDown: jest.fn(),
        onTouchStart: jest.fn(),
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderToastRoot = (props = {}) => {
    return render(
      <ToastProvider>
        <ToastRoot
          open={true}
          onSwipeStart={mockOnSwipeStart}
          onSwipeEnd={mockOnSwipeEnd}
          {...props}
        >
          Test Toast Content
        </ToastRoot>
      </ToastProvider>,
    );
  };

  it('should render toast with swipe attributes', () => {
    renderToastRoot();

    const toastElement = screen.getByText('Test Toast Content');
    expect(toastElement).toHaveAttribute('data-swping', 'false');
    expect(toastElement).toHaveAttribute('data-swipe-direction', 'null');
  });

  it('should accept swipe threshold prop', () => {
    renderToastRoot({ swipeThreshold: 100 });

    expect(mockUseSwipeGesture).toHaveBeenCalledWith(
      expect.objectContaining({
        threshold: 100,
      }),
    );
  });

  it('should use default swipe threshold when not provided', () => {
    renderToastRoot();

    expect(mockUseSwipeGesture).toHaveBeenCalledWith(
      expect.objectContaining({
        threshold: 50,
      }),
    );
  });

  it('should pass swipe gesture configuration to hook', () => {
    renderToastRoot({ swipeThreshold: 75 });

    expect(mockUseSwipeGesture).toHaveBeenCalledWith({
      threshold: 75,
      velocityThreshold: 0.3,
      preventScroll: true,
      enableMouse: true,
      enableTouch: true,
      onSwipeStart: expect.any(Function),
      onSwipeMove: expect.any(Function),
      onSwipeEnd: expect.any(Function),
      onSwipeCancel: expect.any(Function),
    });
  });

  it('should apply swipe state attributes during gesture', () => {
    // Mock swipe in progress
    mockUseSwipeGesture.mockReturnValue({
      isSwping: true,
      currentSwipe: {
        startCoordinates: { x: 100, y: 100 },
        currentCoordinates: { x: 150, y: 100 },
        direction: 'left',
        distance: 50,
        velocity: 0.5,
        timestamp: Date.now(),
      },
      handlers: {
        onMouseDown: jest.fn(),
        onTouchStart: jest.fn(),
      },
    });

    renderToastRoot();

    const toastElement = screen.getByText('Test Toast Content');
    expect(toastElement).toHaveAttribute('data-swping', 'true');
    expect(toastElement).toHaveAttribute('data-swipe-direction', 'left');
  });

  it('should handle mouse and touch event handlers', () => {
    const mockHandlers = {
      onMouseDown: jest.fn(),
      onTouchStart: jest.fn(),
    };

    mockUseSwipeGesture.mockReturnValue({
      isSwping: false,
      currentSwipe: null,
      handlers: mockHandlers,
    });

    renderToastRoot();

    const toastElement = screen.getByText('Test Toast Content');

    // Simulate mouse down
    fireEvent.mouseDown(toastElement);
    expect(mockHandlers.onMouseDown).toHaveBeenCalled();

    // Simulate touch start
    fireEvent.touchStart(toastElement);
    expect(mockHandlers.onTouchStart).toHaveBeenCalled();
  });
});
