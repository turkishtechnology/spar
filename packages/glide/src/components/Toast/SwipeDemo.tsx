import React from 'react';
import { 
  ToastProvider, 
  ToastViewport, 
  toast,
  useToast,
  type SwipeDirection 
} from './index';

/**
 * Toast Swipe Demo Component
 * Demonstrates swipe-to-dismiss functionality with different directions
 */
export const ToastSwipeDemo: React.FC = () => {
  const { removeToast } = useToast();

  const handleSwipe = (direction: SwipeDirection, toastId: string) => {
    console.log(`Toast swiped ${direction}, removing toast ${toastId}`);
    // Toast is automatically removed by the swipe gesture
    // This callback can be used for analytics or additional cleanup
  };

  const showSwipeableToast = (variant: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const toastId = toast[variant]('Swipe me to dismiss! 👆', {
      duration: 10000, // Long duration to allow testing swipe
      onSwipeEnd: (direction) => handleSwipe(direction, toastId),
      swipeThreshold: 50, // 50px minimum swipe distance
    });
  };

  const showMultipleSwipeableToasts = () => {
    toast.success('Swipe ← left to dismiss', {
      duration: 15000,
      onSwipeEnd: (direction) => console.log(`Success toast swiped ${direction}`),
    });

    setTimeout(() => {
      toast.error('Swipe → right to dismiss', {
        duration: 15000,
        onSwipeEnd: (direction) => console.log(`Error toast swiped ${direction}`),
      });
    }, 500);

    setTimeout(() => {
      toast.warning('Swipe ↑ up to dismiss', {
        duration: 15000,
        onSwipeEnd: (direction) => console.log(`Warning toast swiped ${direction}`),
      });
    }, 1000);
  };

  const showCustomThresholdToast = () => {
    toast.info('Need to swipe 100px to dismiss (high threshold)', {
      duration: 12000,
      swipeThreshold: 100, // Requires longer swipe
      onSwipeStart: (direction) => console.log(`Started swiping ${direction}`),
      onSwipeEnd: (direction) => console.log(`Completed swipe ${direction} with high threshold`),
    });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h2>Toast Swipe Gesture Demo</h2>
      <p>Test swipe-to-dismiss functionality with mouse drag or touch gestures.</p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button onClick={() => showSwipeableToast('success')}>
          Success Toast (Swipeable)
        </button>
        <button onClick={() => showSwipeableToast('error')}>
          Error Toast (Swipeable)
        </button>
        <button onClick={() => showSwipeableToast('warning')}>
          Warning Toast (Swipeable)
        </button>
        <button onClick={() => showSwipeableToast('info')}>
          Info Toast (Swipeable)
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button onClick={showMultipleSwipeableToasts}>
          Show Multiple Toasts
        </button>
        <button onClick={showCustomThresholdToast}>
          Custom Threshold (100px)
        </button>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>How to Test Swipe Gestures:</h3>
        <ul>
          <li><strong>Mouse:</strong> Click and drag on a toast in any direction</li>
          <li><strong>Touch:</strong> Swipe on a toast with your finger</li>
          <li><strong>Threshold:</strong> Default requires 50px movement, custom can be set higher</li>
          <li><strong>Directions:</strong> All 4 directions (up, down, left, right) are supported</li>
          <li><strong>Feedback:</strong> Check console for swipe event logs</li>
        </ul>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#e8f4f8', borderRadius: '8px' }}>
        <h3>Swipe Features:</h3>
        <ul>
          <li>✅ Mouse and touch support</li>
          <li>✅ Configurable swipe threshold</li>
          <li>✅ Velocity-based detection</li>
          <li>✅ Direction-aware animations</li>
          <li>✅ Timer pause during swipe</li>
          <li>✅ Accessible (keyboard Escape still works)</li>
        </ul>
      </div>
    </div>
  );
};

/**
 * Complete Toast App with Swipe Demo
 * Includes provider setup and viewport positioning
 */
export const ToastSwipeApp: React.FC = () => {
  return (
    <ToastProvider
      duration={5000}
      visibleLimit={3}
      shouldPauseOnHover={true}
      shouldPauseOnFocus={true}
    >
      <ToastSwipeDemo />
      <ToastViewport 
        position="top-right"
        maxWidth={400}
      />
    </ToastProvider>
  );
};

export default ToastSwipeApp;