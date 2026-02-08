import { useCallback, ElementType } from 'react';
import { useDialogContext } from './DialogRoot';
import type { DialogOverlayProps } from './types';

/**
 * Overlay backdrop that covers the screen behind the dialog.
 * Handles outside clicks for modal dialogs and provides styling hooks.
 */
export const DialogOverlay = <T extends ElementType = 'div'>({
  as,
  ref,
  onClick,
  children,
  ...props
}: DialogOverlayProps<T>) => {
  const Component = as || 'div';
  const { isOpen, setIsOpen, modal, forceMount } = useDialogContext();

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

  const dataState = isOpen ? 'open' : 'closed';

  return (
    <Component ref={ref} data-state={dataState} onClick={handleClick} {...props}>
      {children}
    </Component>
  );
};

DialogOverlay.displayName = 'DialogOverlay';
