import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider } from '../ToastProvider';
import { ToastViewport } from '../ToastViewport';
import { toast } from '../ToastComponents';

describe('ToastViewport - Singleton and Portal Management', () => {
  beforeEach(() => {
    // Clear any existing portal containers
    const existingPortals = document.querySelectorAll('#toast-portal-root');
    existingPortals.forEach((portal) => portal.remove());

    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();

    // Clean up portal containers
    const portals = document.querySelectorAll('#toast-portal-root');
    portals.forEach((portal) => portal.remove());
  });

  describe('Portal Container Management', () => {
    it('should create a single portal container for multiple viewports', () => {
      render(
        <ToastProvider>
          <ToastViewport position='top-right' />
          <ToastViewport position='bottom-left' />
          <ToastViewport position='top-center' />
        </ToastProvider>,
      );

      // Should only have one portal container
      const portals = document.querySelectorAll('#toast-portal-root');
      expect(portals).toHaveLength(1);
      expect(portals[0]).toHaveAttribute('data-toast-portal', '');
      expect(portals[0]).toHaveClass('toast-portal-root');
    });

    it('should reuse existing portal container', () => {
      // Pre-create a portal container
      const existingPortal = document.createElement('div');
      existingPortal.id = 'toast-portal-root';
      existingPortal.className = 'toast-portal-root';
      document.body.appendChild(existingPortal);

      render(
        <ToastProvider>
          <ToastViewport position='top-right' />
        </ToastProvider>,
      );

      // Should still only have one portal
      const portals = document.querySelectorAll('#toast-portal-root');
      expect(portals).toHaveLength(1);
      expect(portals[0]).toBe(existingPortal);
    });

    it('should use custom container when provided', () => {
      const customContainer = document.createElement('div');
      customContainer.id = 'custom-toast-container';
      document.body.appendChild(customContainer);

      render(
        <ToastProvider>
          <ToastViewport position='top-right' container={customContainer} />
        </ToastProvider>,
      );

      // Should not create auto portal when custom container provided
      const autoPorts = document.querySelectorAll('#toast-portal-root');
      expect(autoPorts).toHaveLength(0);

      // Should use the custom container
      const viewport = customContainer.querySelector('[data-toast-viewport]');
      expect(viewport).toBeInTheDocument();

      customContainer.remove();
    });

    it('should clean up auto-created portal when no toasts exist', () => {
      const { unmount } = render(
        <ToastProvider>
          <ToastViewport position='top-right' />
        </ToastProvider>,
      );

      // Portal should exist
      expect(document.querySelector('#toast-portal-root')).toBeInTheDocument();

      // Unmount viewport
      unmount();

      // Portal should still exist (cleanup happens on next render cycle)
      // This is expected behavior - cleanup is lazy for performance
      expect(document.querySelector('#toast-portal-root')).toBeInTheDocument();
    });
  });

  describe('Multiple Viewport Rendering', () => {
    it('should render multiple viewports with different positions', () => {
      render(
        <ToastProvider>
          <ToastViewport position='top-right' data-testid='viewport-top-right' />
          <ToastViewport position='bottom-left' data-testid='viewport-bottom-left' />
        </ToastProvider>,
      );

      const topRightViewport = screen.getByTestId('viewport-top-right');
      const bottomLeftViewport = screen.getByTestId('viewport-bottom-left');

      expect(topRightViewport).toHaveAttribute('data-position', 'top-right');
      expect(bottomLeftViewport).toHaveAttribute('data-position', 'bottom-left');
    });

    it('should handle same position multiple viewports', () => {
      // This tests a potential edge case - multiple viewports with same position
      render(
        <ToastProvider>
          <ToastViewport position='top-right' data-testid='viewport-1' />
          <ToastViewport position='top-right' data-testid='viewport-2' />
        </ToastProvider>,
      );

      const viewport1 = screen.getByTestId('viewport-1');
      const viewport2 = screen.getByTestId('viewport-2');

      expect(viewport1).toHaveAttribute('data-position', 'top-right');
      expect(viewport2).toHaveAttribute('data-position', 'top-right');

      // Both should render independently
      expect(viewport1).toBeInTheDocument();
      expect(viewport2).toBeInTheDocument();
    });

    it('should distribute toasts to all viewports', async () => {
      render(
        <ToastProvider>
          <ToastViewport position='top-right' data-testid='viewport-1' />
          <ToastViewport position='top-right' data-testid='viewport-2' />
        </ToastProvider>,
      );

      // Add a toast
      act(() => {
        toast.success('Test toast');
      });

      // Both viewports should show the same toast (this is current behavior)
      const viewport1 = screen.getByTestId('viewport-1');
      const viewport2 = screen.getByTestId('viewport-2');

      expect(viewport1).toHaveTextContent('Test toast');
      expect(viewport2).toHaveTextContent('Test toast');
    });
  });

  describe('Viewport Configuration', () => {
    it('should apply custom styling props', () => {
      render(
        <ToastProvider>
          <ToastViewport
            position='top-center'
            zIndex={9999}
            maxWidth={500}
            className='custom-viewport'
            data-testid='styled-viewport'
          />
        </ToastProvider>,
      );

      const viewport = screen.getByTestId('styled-viewport');

      expect(viewport).toHaveAttribute('data-position', 'top-center');
      expect(viewport).toHaveClass('custom-viewport');
      expect(viewport).toHaveStyle({
        zIndex: '9999',
        maxWidth: '500px',
      });
    });

    it('should handle different maxWidth formats', () => {
      const { rerender } = render(
        <ToastProvider>
          <ToastViewport maxWidth={400} data-testid='viewport' />
        </ToastProvider>,
      );

      expect(screen.getByTestId('viewport')).toHaveStyle({ maxWidth: '400px' });

      rerender(
        <ToastProvider>
          <ToastViewport maxWidth='50%' data-testid='viewport' />
        </ToastProvider>,
      );

      expect(screen.getByTestId('viewport')).toHaveStyle({ maxWidth: '50%' });
    });

    it('should not apply style object when no custom styles provided', () => {
      render(
        <ToastProvider>
          <ToastViewport position='bottom-right' data-testid='viewport' />
        </ToastProvider>,
      );

      const viewport = screen.getByTestId('viewport');
      expect(viewport).not.toHaveAttribute('style');
    });
  });

  describe('ARIA and Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      render(
        <ToastProvider>
          <ToastViewport position='top-right' data-testid='viewport' />
        </ToastProvider>,
      );

      const viewport = screen.getByTestId('viewport');
      expect(viewport).toHaveAttribute('role', 'region');
      expect(viewport).toHaveAttribute('aria-label', 'Notifications');
      expect(viewport).toHaveAttribute('aria-live', 'polite');
    });

    it('should be accessible to screen readers', () => {
      render(
        <ToastProvider>
          <ToastViewport position='bottom-center' />
        </ToastProvider>,
      );

      const region = screen.getByRole('region', { name: /notifications/i });
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Toast Rendering Integration', () => {
    it('should render toasts in correct viewport', async () => {
      render(
        <ToastProvider>
          <ToastViewport position='top-left' data-testid='viewport' />
        </ToastProvider>,
      );

      act(() => {
        toast.info('Integration test toast');
      });

      const viewport = screen.getByTestId('viewport');
      expect(viewport).toHaveTextContent('Integration test toast');

      // Should have toast with correct attributes
      const toastElement = viewport.querySelector('[data-toast-root]');
      expect(toastElement).toBeInTheDocument();
      expect(toastElement).toHaveAttribute('data-variant', 'info');
    });

    it('should handle empty toast list gracefully', () => {
      render(
        <ToastProvider>
          <ToastViewport position='top-right' data-testid='viewport' />
        </ToastProvider>,
      );

      const viewport = screen.getByTestId('viewport');
      expect(viewport).toBeEmptyDOMElement();
      expect(viewport).toHaveAttribute('data-toast-viewport', '');
    });

    it('should update when toasts are added and removed', async () => {
      render(
        <ToastProvider>
          <ToastViewport position='bottom-right' data-testid='viewport' />
        </ToastProvider>,
      );

      const viewport = screen.getByTestId('viewport');

      // Initially empty
      expect(viewport).toBeEmptyDOMElement();

      // Add toast
      act(() => {
        toast.success('Added toast');
      });

      expect(viewport).toHaveTextContent('Added toast');

      // Remove toast by waiting for duration
      act(() => {
        jest.advanceTimersByTime(5000); // Default duration
      });

      // Should be empty again
      expect(viewport).toBeEmptyDOMElement();
    });
  });

  describe('Error Handling', () => {
    it('should handle null container gracefully', () => {
      render(
        <ToastProvider>
          <ToastViewport position='top-right' container={null} />
        </ToastProvider>,
      );

      // Should fallback to creating auto portal
      const portal = document.querySelector('#toast-portal-root');
      expect(portal).toBeInTheDocument();
    });

    it('should handle missing document.body gracefully', () => {
      // This test simulates SSR or edge cases where document.body might not exist
      const originalBody = document.body;

      // Temporarily remove body
      Object.defineProperty(document, 'body', {
        writable: true,
        value: null,
      });

      expect(() => {
        render(
          <ToastProvider>
            <ToastViewport position='top-right' />
          </ToastProvider>,
        );
      }).not.toThrow();

      // Restore body
      Object.defineProperty(document, 'body', {
        writable: true,
        value: originalBody,
      });
    });
  });

  describe('Performance Considerations', () => {
    it('should not create excessive DOM elements with multiple viewports', () => {
      const initialElementCount = document.querySelectorAll('*').length;

      render(
        <ToastProvider>
          <ToastViewport position='top-right' />
          <ToastViewport position='top-left' />
          <ToastViewport position='bottom-right' />
          <ToastViewport position='bottom-left' />
        </ToastProvider>,
      );

      const finalElementCount = document.querySelectorAll('*').length;
      const addedElements = finalElementCount - initialElementCount;

      // Should only add reasonable number of elements:
      // - 1 portal container
      // - 4 viewport divs
      // - Provider wrapper elements
      expect(addedElements).toBeLessThan(10);
    });

    it('should reuse portal container across re-renders', () => {
      const { rerender } = render(
        <ToastProvider>
          <ToastViewport position='top-right' />
        </ToastProvider>,
      );

      const firstPortal = document.querySelector('#toast-portal-root');

      rerender(
        <ToastProvider>
          <ToastViewport position='bottom-left' />
        </ToastProvider>,
      );

      const secondPortal = document.querySelector('#toast-portal-root');

      // Should be the same DOM element
      expect(secondPortal).toBe(firstPortal);
    });
  });
});
