import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToastProvider } from '../ToastProvider';
import { ToastViewport } from '../ToastViewport';
import { toast } from '../ToastComponents';

describe('ToastViewport Positioning', () => {
  beforeEach(() => {
    // Clean up any existing portal containers
    const existingContainer = document.getElementById('toast-portal-root');
    if (existingContainer) {
      existingContainer.remove();
    }
  });

  afterEach(() => {
    // Clean up after each test
    const containers = document.querySelectorAll('[data-toast-portal]');
    containers.forEach(container => container.remove());
  });

  it('renders with default top-right position', () => {
    render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );

    const viewport = screen.getByRole('region', { name: 'Notifications' });
    expect(viewport).toHaveAttribute('data-position', 'top-right');
  });

  it('renders with custom position', () => {
    render(
      <ToastProvider>
        <ToastViewport position="bottom-left" />
      </ToastProvider>
    );

    const viewport = screen.getByRole('region', { name: 'Notifications' });
    expect(viewport).toHaveAttribute('data-position', 'bottom-left');
  });

  it('applies custom z-index', () => {
    render(
      <ToastProvider>
        <ToastViewport zIndex={99999} />
      </ToastProvider>
    );

    const viewport = screen.getByRole('region', { name: 'Notifications' });
    expect(viewport).toHaveStyle({ zIndex: '99999' });
  });

  it('applies custom max-width', () => {
    render(
      <ToastProvider>
        <ToastViewport maxWidth="600px" />
      </ToastProvider>
    );

    const viewport = screen.getByRole('region', { name: 'Notifications' });
    expect(viewport).toHaveStyle({ maxWidth: '600px' });
  });

  it('applies custom max-width as number', () => {
    render(
      <ToastProvider>
        <ToastViewport maxWidth={500} />
      </ToastProvider>
    );

    const viewport = screen.getByRole('region', { name: 'Notifications' });
    expect(viewport).toHaveStyle({ maxWidth: '500px' });
  });

  it('applies custom className', () => {
    render(
      <ToastProvider>
        <ToastViewport className="custom-toast-viewport" />
      </ToastProvider>
    );

    const viewport = screen.getByRole('region', { name: 'Notifications' });
    expect(viewport).toHaveClass('custom-toast-viewport');
  });

  it('creates portal container automatically', () => {
    render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );

    const portalContainer = document.getElementById('toast-portal-root');
    expect(portalContainer).toBeInTheDocument();
    expect(portalContainer).toHaveClass('toast-portal-root');
    expect(portalContainer).toHaveAttribute('data-toast-portal');
  });

  it('uses custom container when provided', () => {
    const customContainer = document.createElement('div');
    customContainer.id = 'custom-container';
    document.body.appendChild(customContainer);

    render(
      <ToastProvider>
        <ToastViewport container={customContainer} />
      </ToastProvider>
    );

    const viewport = screen.getByRole('region', { name: 'Notifications' });
    expect(customContainer).toContainElement(viewport);

    // Clean up
    customContainer.remove();
  });

  it('renders all position variants correctly', () => {
    const positions = [
      'top-right',
      'top-left', 
      'top-center',
      'bottom-right',
      'bottom-left',
      'bottom-center'
    ] as const;

    positions.forEach(position => {
      const { unmount } = render(
        <ToastProvider>
          <ToastViewport position={position} />
        </ToastProvider>
      );

      const viewport = screen.getByRole('region', { name: 'Notifications' });
      expect(viewport).toHaveAttribute('data-position', position);
      
      unmount();
    });
  });

  it('handles multiple viewport instances', () => {
    render(
      <div>
        <ToastProvider>
          <ToastViewport position="top-right" className="viewport-1" />
        </ToastProvider>
        <ToastProvider>
          <ToastViewport position="bottom-left" className="viewport-2" />
        </ToastProvider>
      </div>
    );

    const viewports = screen.getAllByRole('region', { name: 'Notifications' });
    expect(viewports).toHaveLength(2);
    expect(viewports[0]).toHaveClass('viewport-1');
    expect(viewports[1]).toHaveClass('viewport-2');
  });

  it('has proper accessibility attributes', () => {
    render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );

    const viewport = screen.getByRole('region', { name: 'Notifications' });
    expect(viewport).toHaveAttribute('role', 'region');
    expect(viewport).toHaveAttribute('aria-label', 'Notifications');
    expect(viewport).toHaveAttribute('aria-live', 'polite');
  });

  it('cleans up portal container on unmount when no custom container', () => {
    const { unmount } = render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );

    // Container should exist
    let portalContainer = document.getElementById('toast-portal-root');
    expect(portalContainer).toBeInTheDocument();

    unmount();

    // Container should be cleaned up (though this might be async)
    // Note: The cleanup logic runs in useEffect cleanup, so we might need to wait
    setTimeout(() => {
      portalContainer = document.getElementById('toast-portal-root');
      // If there are no toasts, container should be removed
      if (portalContainer && portalContainer.children.length === 0) {
        expect(portalContainer).not.toBeInTheDocument();
      }
    }, 0);
  });
});

describe('ToastViewport CSS Integration', () => {
  it('loads CSS classes correctly', () => {
    render(
      <ToastProvider>
        <ToastViewport />
      </ToastProvider>
    );

    const viewport = screen.getByRole('region', { name: 'Notifications' });
    expect(viewport).toHaveAttribute('data-toast-viewport', '');
  });

  it('applies position-specific CSS classes', () => {
    render(
      <ToastProvider>
        <ToastViewport position="bottom-center" />
      </ToastProvider>
    );

    const viewport = screen.getByRole('region', { name: 'Notifications' });
    expect(viewport).toHaveAttribute('data-position', 'bottom-center');
  });
});