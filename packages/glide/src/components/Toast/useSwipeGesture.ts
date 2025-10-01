import { useCallback, useEffect, useRef, useState } from 'react';
import type { 
  SwipeDirection, 
  SwipeCoordinates, 
  SwipeEvent, 
  SwipeGestureConfig 
} from './Toast.types';

interface UseSwipeGestureProps extends SwipeGestureConfig {
  onSwipeStart?: (event: SwipeEvent) => void;
  onSwipeMove?: (event: SwipeEvent) => void;
  onSwipeEnd?: (event: SwipeEvent) => void;
  onSwipeCancel?: () => void;
}

interface UseSwipeGestureReturn {
  readonly isSwping: boolean;
  readonly currentSwipe: SwipeEvent | null;
  readonly handlers: {
    readonly onMouseDown: (event: React.MouseEvent) => void;
    readonly onTouchStart: (event: React.TouchEvent) => void;
  };
}

const DEFAULT_CONFIG: Required<SwipeGestureConfig> = {
  threshold: 50,
  velocityThreshold: 0.3,
  preventScroll: true,
  enableMouse: true,
  enableTouch: true,
} as const;

function getCoordinates(event: MouseEvent | TouchEvent): SwipeCoordinates {
  if ('touches' in event) {
    const touch = event.touches[0] || event.changedTouches[0];
    if (!touch) {
      return { x: 0, y: 0 };
    }
    return { x: touch.clientX, y: touch.clientY };
  }
  return { x: event.clientX, y: event.clientY };
}

function calculateDirection(
  start: SwipeCoordinates, 
  current: SwipeCoordinates
): SwipeDirection | null {
  const deltaX = current.x - start.x;
  const deltaY = current.y - start.y;
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  // Determine primary direction
  if (absDeltaX > absDeltaY) {
    return deltaX > 0 ? 'right' : 'left';
  } else if (absDeltaY > absDeltaX) {
    return deltaY > 0 ? 'down' : 'up';
  }

  return null;
}

function calculateDistance(start: SwipeCoordinates, current: SwipeCoordinates): number {
  const deltaX = current.x - start.x;
  const deltaY = current.y - start.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function calculateVelocity(distance: number, timeDelta: number): number {
  return timeDelta > 0 ? distance / timeDelta : 0;
}

export function useSwipeGesture({
  threshold = DEFAULT_CONFIG.threshold,
  velocityThreshold = DEFAULT_CONFIG.velocityThreshold,
  preventScroll = DEFAULT_CONFIG.preventScroll,
  enableMouse = DEFAULT_CONFIG.enableMouse,
  enableTouch = DEFAULT_CONFIG.enableTouch,
  onSwipeStart,
  onSwipeMove,
  onSwipeEnd,
  onSwipeCancel,
}: UseSwipeGestureProps = {}): UseSwipeGestureReturn {
  const [isSwping, setIsSwping] = useState(false);
  const [currentSwipe, setCurrentSwipe] = useState<SwipeEvent | null>(null);
  
  const startCoordinates = useRef<SwipeCoordinates | null>(null);
  const startTime = useRef<number>(0);
  const isMouseDown = useRef(false);

  const createSwipeEvent = useCallback((
    start: SwipeCoordinates,
    current: SwipeCoordinates,
    timestamp: number
  ): SwipeEvent => {
    const direction = calculateDirection(start, current);
    const distance = calculateDistance(start, current);
    const timeDelta = timestamp - startTime.current;
    const velocity = calculateVelocity(distance, timeDelta);

    return {
      startCoordinates: start,
      currentCoordinates: current,
      direction,
      distance,
      velocity,
      timestamp,
    };
  }, []);

  const handleStart = useCallback((coordinates: SwipeCoordinates) => {
    startCoordinates.current = coordinates;
    startTime.current = Date.now();
    setIsSwping(true);
    isMouseDown.current = true;

    const swipeEvent = createSwipeEvent(coordinates, coordinates, startTime.current);
    setCurrentSwipe(swipeEvent);
    onSwipeStart?.(swipeEvent);
  }, [createSwipeEvent, onSwipeStart]);

  const handleMove = useCallback((coordinates: SwipeCoordinates) => {
    if (!startCoordinates.current || !isMouseDown.current) return;

    const now = Date.now();
    const swipeEvent = createSwipeEvent(startCoordinates.current, coordinates, now);
    setCurrentSwipe(swipeEvent);
    onSwipeMove?.(swipeEvent);
  }, [createSwipeEvent, onSwipeMove]);

  const handleEnd = useCallback((coordinates: SwipeCoordinates) => {
    if (!startCoordinates.current || !isMouseDown.current) return;

    const now = Date.now();
    const swipeEvent = createSwipeEvent(startCoordinates.current, coordinates, now);
    
    // Check if swipe meets threshold requirements
    const meetsDistanceThreshold = swipeEvent.distance >= threshold;
    const meetsVelocityThreshold = swipeEvent.velocity >= velocityThreshold;
    
    if (meetsDistanceThreshold || meetsVelocityThreshold) {
      onSwipeEnd?.(swipeEvent);
    } else {
      onSwipeCancel?.();
    }

    // Reset state
    setIsSwping(false);
    setCurrentSwipe(null);
    startCoordinates.current = null;
    isMouseDown.current = false;
  }, [createSwipeEvent, onSwipeEnd, onSwipeCancel, threshold, velocityThreshold]);

  const handleCancel = useCallback(() => {
    setIsSwping(false);
    setCurrentSwipe(null);
    startCoordinates.current = null;
    isMouseDown.current = false;
    onSwipeCancel?.();
  }, [onSwipeCancel]);

  // Mouse event handlers
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!enableMouse) return;
    
    if (preventScroll) {
      event.preventDefault();
    }
    
    const coordinates = getCoordinates(event.nativeEvent);
    handleStart(coordinates);
  }, [enableMouse, preventScroll, handleStart]);

  // Touch event handlers
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (!enableTouch) return;
    
    if (preventScroll) {
      event.preventDefault();
    }
    
    const coordinates = getCoordinates(event.nativeEvent);
    handleStart(coordinates);
  }, [enableTouch, preventScroll, handleStart]);

  // Global mouse events
  useEffect(() => {
    if (!enableMouse) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown.current) return;
      
      if (preventScroll) {
        event.preventDefault();
      }
      
      const coordinates = getCoordinates(event);
      handleMove(coordinates);
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!isMouseDown.current) return;
      
      const coordinates = getCoordinates(event);
      handleEnd(coordinates);
    };

    const handleMouseLeave = () => {
      if (isMouseDown.current) {
        handleCancel();
      }
    };

    if (isSwping) {
      document.addEventListener('mousemove', handleMouseMove, { passive: !preventScroll });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isSwping, enableMouse, preventScroll, handleMove, handleEnd, handleCancel]);

  // Global touch events
  useEffect(() => {
    if (!enableTouch) return;

    const handleTouchMove = (event: TouchEvent) => {
      if (!isMouseDown.current) return;
      
      if (preventScroll) {
        event.preventDefault();
      }
      
      const coordinates = getCoordinates(event);
      handleMove(coordinates);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!isMouseDown.current) return;
      
      const coordinates = getCoordinates(event);
      handleEnd(coordinates);
    };

    const handleTouchCancel = () => {
      if (isMouseDown.current) {
        handleCancel();
      }
    };

    if (isSwping) {
      document.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchCancel);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [isSwping, enableTouch, preventScroll, handleMove, handleEnd, handleCancel]);

  return {
    isSwping,
    currentSwipe,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    },
  } as const;
}