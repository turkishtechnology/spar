/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act, fireEvent } from '@testing-library/react';
import { useSwipeGesture } from '../useSwipeGesture';

// Mock DOM methods
Object.defineProperty(HTMLElement.prototype, 'clientX', {
  value: 0,
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'clientY', {
  value: 0,
  writable: true,
});

describe('useSwipeGesture', () => {
  let mockOnSwipeStart: jest.Mock;
  let mockOnSwipeMove: jest.Mock;
  let mockOnSwipeEnd: jest.Mock;
  let mockOnSwipeCancel: jest.Mock;

  beforeEach(() => {
    mockOnSwipeStart = jest.fn();
    mockOnSwipeMove = jest.fn();
    mockOnSwipeEnd = jest.fn();
    mockOnSwipeCancel = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSwipeGesture());

    expect(result.current.isSwping).toBe(false);
    expect(result.current.currentSwipe).toBeNull();
    expect(result.current.handlers).toHaveProperty('onMouseDown');
    expect(result.current.handlers).toHaveProperty('onTouchStart');
  });

  it('should handle mouse swipe gestures', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        threshold: 50,
        onSwipeStart: mockOnSwipeStart,
        onSwipeMove: mockOnSwipeMove,
        onSwipeEnd: mockOnSwipeEnd,
        onSwipeCancel: mockOnSwipeCancel,
      }),
    );

    // Create mock mouse event
    const mouseDownEvent = {
      nativeEvent: {
        clientX: 100,
        clientY: 100,
      },
      preventDefault: jest.fn(),
    } as any;

    // Start swipe
    act(() => {
      result.current.handlers.onMouseDown(mouseDownEvent);
    });

    expect(result.current.isSwping).toBe(true);
    expect(mockOnSwipeStart).toHaveBeenCalled();

    // Simulate mouse move
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 200,
      clientY: 100,
    });

    act(() => {
      fireEvent(document, mouseMoveEvent);
    });

    expect(mockOnSwipeMove).toHaveBeenCalled();

    // Simulate mouse up
    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: 200,
      clientY: 100,
    });

    act(() => {
      fireEvent(document, mouseUpEvent);
    });

    expect(mockOnSwipeEnd).toHaveBeenCalled();
    expect(result.current.isSwping).toBe(false);
  });

  it('should handle touch swipe gestures', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        threshold: 50,
        onSwipeStart: mockOnSwipeStart,
        onSwipeEnd: mockOnSwipeEnd,
      }),
    );

    // Create mock touch event
    const touchStartEvent = {
      nativeEvent: {
        touches: [{ clientX: 100, clientY: 100 }],
      },
      preventDefault: jest.fn(),
    } as any;

    // Start swipe
    act(() => {
      result.current.handlers.onTouchStart(touchStartEvent);
    });

    expect(result.current.isSwping).toBe(true);
    expect(mockOnSwipeStart).toHaveBeenCalled();

    // Simulate touch move
    const touchMoveEvent = new TouchEvent('touchmove', {
      touches: [{ clientX: 200, clientY: 100 } as Touch],
    });

    act(() => {
      fireEvent(document, touchMoveEvent);
    });

    // Simulate touch end
    const touchEndEvent = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 200, clientY: 100 } as Touch],
    });

    act(() => {
      fireEvent(document, touchEndEvent);
    });

    expect(mockOnSwipeEnd).toHaveBeenCalled();
    expect(result.current.isSwping).toBe(false);
  });

  it('should calculate swipe direction correctly', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        threshold: 50,
        onSwipeEnd: mockOnSwipeEnd,
      }),
    );

    // Test horizontal right swipe
    const mouseDownEvent = {
      nativeEvent: { clientX: 100, clientY: 100 },
      preventDefault: jest.fn(),
    } as any;

    act(() => {
      result.current.handlers.onMouseDown(mouseDownEvent);
    });

    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: 200, // 100px right
      clientY: 100, // same Y
    });

    act(() => {
      fireEvent(document, mouseUpEvent);
    });

    expect(mockOnSwipeEnd).toHaveBeenCalledWith(
      expect.objectContaining({
        direction: 'right',
        distance: 100,
      }),
    );
  });

  it('should respect threshold settings', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        threshold: 100,
        velocityThreshold: 100, // Very high velocity threshold (100 px/ms)
        onSwipeEnd: mockOnSwipeEnd,
        onSwipeCancel: mockOnSwipeCancel,
      }),
    );

    // Start swipe
    const mouseDownEvent = {
      nativeEvent: { clientX: 100, clientY: 100 },
      preventDefault: jest.fn(),
    } as any;

    act(() => {
      result.current.handlers.onMouseDown(mouseDownEvent);
    });

    // End swipe with distance below threshold (30px < 100px threshold) and normal velocity
    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: 130, // Only 30px movement, below 100px threshold
      clientY: 100,
    });

    act(() => {
      fireEvent(document, mouseUpEvent);
    });

    expect(mockOnSwipeEnd).not.toHaveBeenCalled();
    expect(mockOnSwipeCancel).toHaveBeenCalled();
  });

  it('should handle swipe cancellation', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeCancel: mockOnSwipeCancel,
      }),
    );

    // Start swipe
    const mouseDownEvent = {
      nativeEvent: { clientX: 100, clientY: 100 },
      preventDefault: jest.fn(),
    } as any;

    act(() => {
      result.current.handlers.onMouseDown(mouseDownEvent);
    });

    expect(result.current.isSwping).toBe(true);

    // Simulate mouse leave (cancel)
    const mouseLeaveEvent = new MouseEvent('mouseleave');

    act(() => {
      fireEvent(document, mouseLeaveEvent);
    });

    expect(mockOnSwipeCancel).toHaveBeenCalled();
    expect(result.current.isSwping).toBe(false);
  });

  it('should disable mouse gestures when enableMouse is false', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        enableMouse: false,
        onSwipeStart: mockOnSwipeStart,
      }),
    );

    const mouseDownEvent = {
      nativeEvent: { clientX: 100, clientY: 100 },
      preventDefault: jest.fn(),
    } as any;

    act(() => {
      result.current.handlers.onMouseDown(mouseDownEvent);
    });

    expect(result.current.isSwping).toBe(false);
    expect(mockOnSwipeStart).not.toHaveBeenCalled();
  });

  it('should disable touch gestures when enableTouch is false', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        enableTouch: false,
        onSwipeStart: mockOnSwipeStart,
      }),
    );

    const touchStartEvent = {
      nativeEvent: {
        touches: [{ clientX: 100, clientY: 100 }],
      },
      preventDefault: jest.fn(),
    } as any;

    act(() => {
      result.current.handlers.onTouchStart(touchStartEvent);
    });

    expect(result.current.isSwping).toBe(false);
    expect(mockOnSwipeStart).not.toHaveBeenCalled();
  });

  it('should calculate velocity correctly', () => {
    jest.useFakeTimers();

    const { result } = renderHook(() =>
      useSwipeGesture({
        velocityThreshold: 0.5,
        onSwipeEnd: mockOnSwipeEnd,
      }),
    );

    // Start swipe
    const mouseDownEvent = {
      nativeEvent: { clientX: 100, clientY: 100 },
      preventDefault: jest.fn(),
    } as any;

    act(() => {
      result.current.handlers.onMouseDown(mouseDownEvent);
    });

    // Advance time and end swipe
    jest.advanceTimersByTime(100); // 100ms

    const mouseUpEvent = new MouseEvent('mouseup', {
      clientX: 150, // 50px distance
      clientY: 100,
    });

    act(() => {
      fireEvent(document, mouseUpEvent);
    });

    expect(mockOnSwipeEnd).toHaveBeenCalledWith(
      expect.objectContaining({
        velocity: 0.5, // 50px / 100ms = 0.5 px/ms
        distance: 50,
      }),
    );

    jest.useRealTimers();
  });

  it('should track current swipe state during gesture', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeMove: mockOnSwipeMove,
      }),
    );

    // Start swipe
    const mouseDownEvent = {
      nativeEvent: { clientX: 100, clientY: 100 },
      preventDefault: jest.fn(),
    } as any;

    act(() => {
      result.current.handlers.onMouseDown(mouseDownEvent);
    });

    expect(result.current.currentSwipe).toMatchObject({
      startCoordinates: { x: 100, y: 100 },
      currentCoordinates: { x: 100, y: 100 },
      direction: null,
      distance: 0,
    });

    // Move mouse
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 150,
      clientY: 100,
    });

    act(() => {
      fireEvent(document, mouseMoveEvent);
    });

    expect(result.current.currentSwipe).toMatchObject({
      startCoordinates: { x: 100, y: 100 },
      currentCoordinates: { x: 150, y: 100 },
      direction: 'right',
      distance: 50,
    });
  });
});
