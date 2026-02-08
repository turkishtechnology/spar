import { createPortal } from 'react-dom';
import { useDialogContext } from './DialogRoot';
import type { DialogPortalProps } from './types';

/**
 * Portal component that renders dialog content outside the normal DOM hierarchy.
 * Prevents z-index and overflow issues by rendering to document.body by default.
 */
export const DialogPortal = ({
  container = typeof document !== 'undefined' ? document.body : null,
  children,
}: DialogPortalProps) => {
  const { isOpen, forceMount } = useDialogContext();

  // Only render portal if dialog is open (or force mounted) and container is available
  if ((!isOpen && !forceMount) || !container) {
    return null;
  }

  return createPortal(children, container);
};

DialogPortal.displayName = 'DialogPortal';
