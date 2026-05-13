import { useEffect, useState, ElementType } from 'react';
import { createPortal } from 'react-dom';
import { useDialogContext } from './hooks';
import type { DialogOverlayProps } from './types';

/**
 * Overlay backdrop that covers the screen behind the dialog.
 * Renders as a visual layer only — dismiss behavior is handled by
 * DialogContent's `useInteractOutside` hook, which respects
 * `onPointerDownOutside` / `onInteractOutside` event prevention.
 * Automatically renders via portal to document.body.
 */
export const DialogOverlay = <T extends ElementType = 'div'>({
  as,
  ref,
  container,
  onClick,
  children,
  ...props
}: DialogOverlayProps<T>) => {
  const Component = as || 'div';
  const { isOpen, forceMount } = useDialogContext();

  // SSR safety - only render portal after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render if dialog is closed and not force mounted
  if (!isOpen && !forceMount) {
    return null;
  }

  // Don't render on server
  if (!mounted) {
    return null;
  }

  const dataState = isOpen ? 'open' : 'closed';
  const portalContainer = container || document.body;

  const overlayElement = (
    <Component ref={ref} data-state={dataState} onClick={onClick} {...props}>
      {children}
    </Component>
  );

  return createPortal(overlayElement, portalContainer);
};

DialogOverlay.displayName = 'DialogOverlay';
