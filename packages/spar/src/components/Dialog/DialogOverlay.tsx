import { useCallback, useEffect, useState, ElementType } from 'react';
import { createPortal } from 'react-dom';
import { useDialogContext } from './hooks';
import type { DialogOverlayProps } from './types';

/**
 * Overlay backdrop that covers the screen behind the dialog.
 * Handles outside clicks for modal dialogs and provides styling hooks.
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
  const { isOpen, setIsOpen, modal, forceMount } = useDialogContext();

  // SSR safety - only render portal after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Only handle clicks if this is a modal dialog
      // and the click is directly on the overlay (not bubbled from content)
      if (modal && event.target === event.currentTarget) {
        setIsOpen(false);
      }
      onClick?.(event);
    },
    [modal, setIsOpen, onClick],
  );

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
    <Component ref={ref} data-state={dataState} onClick={handleClick} {...props}>
      {children}
    </Component>
  );

  return createPortal(overlayElement, portalContainer);
};

DialogOverlay.displayName = 'DialogOverlay';
