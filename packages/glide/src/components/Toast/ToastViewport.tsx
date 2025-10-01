import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from './useToast';
import { ToastRoot } from './ToastRoot';
import type { ToastItem } from './Toast.types';
import './toast.css';

export type ToastPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'top-center'
  | 'bottom-right' 
  | 'bottom-left' 
  | 'bottom-center';

export interface ToastViewportProps {
  /**
   * Position of the toast viewport on screen
   * @default 'top-right'
   */
  position?: ToastPosition;
  
  /**
   * Custom container element to render toasts into.
   * If not provided, creates a dedicated portal container
   */
  container?: Element | null;
  
  /**
   * Custom z-index for the toast viewport
   */
  zIndex?: number;
  
  /**
   * Maximum width for the toast viewport
   */
  maxWidth?: string | number;
  
  /**
   * Additional CSS class name for the viewport
   */
  className?: string;
}

const createPortalContainer = (): HTMLElement => {
  const existingContainer = document.getElementById('toast-portal-root');
  if (existingContainer) {
    return existingContainer;
  }

  const container = document.createElement('div');
  container.id = 'toast-portal-root';
  container.className = 'toast-portal-root';
  container.setAttribute('data-toast-portal', '');
  
  // Ensure container is at the end of body for proper z-index stacking
  document.body.appendChild(container);
  
  return container;
};

export const ToastViewport: React.FC<ToastViewportProps> = ({ 
  position = 'top-right',
  container,
  zIndex,
  maxWidth,
  className
}) => {
  const { toasts } = useToast();
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  useEffect(() => {
    // Use provided container or create/reuse portal container
    const targetContainer = container ?? createPortalContainer();
    setPortalContainer(targetContainer);

    return () => {
      // Clean up auto-created container if no toasts exist and no custom container was provided
      if (!container && toasts.length === 0) {
        const autoContainer = document.getElementById('toast-portal-root');
        if (autoContainer && autoContainer.children.length === 0) {
          autoContainer.remove();
        }
      }
    };
  }, [container, toasts.length]);

  if (!portalContainer) {
    return null;
  }

  const viewportStyle: React.CSSProperties = {
    ...(zIndex && { zIndex }),
    ...(maxWidth && { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth })
  };

  return createPortal(
    <div 
      data-toast-viewport=""
      data-position={position}
      className={className}
      style={Object.keys(viewportStyle).length > 0 ? viewportStyle : undefined}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast: ToastItem) => (
        <ToastRoot 
          key={toast.id} 
          variant={toast.variant}
          size={toast.size}
          open={toast.open}
          {...(toast.duration !== undefined && { duration: toast.duration })}
          priority={toast.priority}
          persistent={toast.isPersistent}
          loading={toast.isLoading}
          {...(toast.progress !== undefined && { progress: toast.progress })}
        >
          {toast.content}
        </ToastRoot>
      ))}
    </div>,
    portalContainer
  );
};

ToastViewport.displayName = 'Toast.Viewport';