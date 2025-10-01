import React from 'react';
import { ToastProvider, ToastViewport, DeclarativeToast, toast, useToast } from './index';

/**
 * Ana Toast Setup - Uygulamanın kök seviyesinde kullanılmalı
 */
export function App() {
  return (
    <ToastProvider
      position='top-right'
      maxToasts={10} // Max 10 toast in memory
      visibleLimit={3} // Only 3 visible at once
      duration={4000} // Default 4 seconds
    >
      <div className='app'>
        {/* App content */}
        <ExampleComponent />

        {/* Toast Viewport - Tüm toast'ları render eder */}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}

/**
 * Örnek Kullanım Komponenti
 */
function ExampleComponent() {
  const toastApi = useToast();

  // 4. Priority Queue Demo
  const handlePriorityDemo = () => {
    // Add multiple toasts with different priorities
    toast('Low priority message 1', { priority: 'low' });
    toast('Normal priority message 1', { priority: 'normal' });
    toast('High priority urgent!', { priority: 'high', variant: 'error' });
    toast('Low priority message 2', { priority: 'low' });
    toast('High priority important!', { priority: 'high', variant: 'warning' });
    toast('Normal priority message 2', { priority: 'normal' });

    // High priority toasts will be visible first
    // Queue: high(oldest), high(newest), normal(oldest) visible
    // Queued: normal(newest), low(oldest), low(newest)
  };

  // 5. Queue Status Check
  const handleQueueStatus = () => {
    // eslint-disable-next-line no-console
    console.log('Visible toasts:', toastApi.toasts.length);
    // eslint-disable-next-line no-console
    console.log('Queued toasts:', toastApi.queuedToasts.length);
    // eslint-disable-next-line no-console
    console.log('Total toasts:', toastApi.allToasts.length);

    toastApi.info(
      `Queue: ${toastApi.toasts.length} visible, ${toastApi.queuedToasts.length} queued`,
    );
  };

  // 1. Programmatik kullanım (Global - hook dışında)
  const handleGlobalToast = () => {
    // Default duration (provider config'ten gelir)
    toast('Global toast message!', { variant: 'success' });

    // Custom duration override
    toast.error('Error message', { duration: 8000 }); // 8 saniye

    // Duration shortcuts
    toast.quick('Quick message'); // 2 saniye
    toast.long('Long message'); // 10 saniye
    toast.persistent('Never auto-dismiss'); // Manuel kapatma

    // Promise with custom duration
    toast.promise(
      fetch('/api/data').then((res) => res.json()),
      {
        loading: 'Loading data...',
        success: 'Data loaded!',
        error: 'Failed to load data',
        config: { duration: 3000 }, // Success/error için 3 saniye
      },
    );
  };

  // 2. Hook-based kullanım (Context içinde)
  const handleHookToast = () => {
    // Default duration
    toastApi.success('Hook-based toast!');

    // Custom duration
    toastApi.error('Error from hook', { duration: 5000 });

    // Duration shortcuts
    toastApi.quick('Quick hook toast');
    toastApi.long('Long hook toast');
    toastApi.persistent('Persistent hook toast');

    // Update existing toast with duration change
    const id = toastApi.loading('Processing...', { duration: 0 }); // No timeout while loading
    setTimeout(() => {
      toastApi.update(id, {
        variant: 'success',
        content: 'Completed!',
        isLoading: false,
        duration: 4000, // Auto-dismiss after completion
      });
    }, 2000);
  };

  return (
    <div>
      <button onClick={handleGlobalToast}>Show Global Toast</button>

      <button onClick={handleHookToast}>Show Hook Toast</button>

      {/* 3. Deklaratif kullanım - JSX içinde */}
      <DeclarativeToast
        variant='info'
        title='Welcome!'
        description='This is a declarative toast'
        duration={6000} // Custom duration override
        open={true}
      />

      <DeclarativeToast
        variant='warning'
        title='Session expires soon'
        description='Please save your work'
        persistent={true} // No auto-dismiss
        open={true}
      />

      <button onClick={handlePriorityDemo}>Demo Priority Queue</button>

      <button onClick={handleQueueStatus}>Check Queue Status</button>

      <button onClick={() => toastApi.clear()}>Clear All Toasts</button>
    </div>
  );
}
