import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { SelectPortalProps } from './types';
import { useSelectContext } from './SelectRoot';

/**
 * Portal container for rendering the select dropdown outside the DOM hierarchy. Ensures proper z-index stacking and accessibility.
 */
export const SelectPortal = ({ container, forceMount = false, children }: SelectPortalProps) => {
  const context = useSelectContext();
  const [mounted, setMounted] = useState(false);

  // Handle SSR - only render portal after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if content should be rendered
  const shouldRender = forceMount || context.open;

  // Don't render on server or if not mounted
  if (!mounted || !shouldRender) {
    return null;
  }

  const portalContainer = container || (typeof document !== 'undefined' ? document.body : null);

  if (!portalContainer) {
    return null;
  }

  return createPortal(children, portalContainer);
};

SelectPortal.displayName = 'SelectPortal';
