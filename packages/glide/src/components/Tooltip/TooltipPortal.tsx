import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { TooltipPortalProps } from './types';
import { useTooltip } from './useTooltip';

/**
 * Portal component for rendering tooltip outside normal DOM tree
 */
export const TooltipPortal = ({ children, container, forceMount = false }: TooltipPortalProps) => {
  const context = useTooltip();
  const [mounted, setMounted] = useState(false);

  // Mount after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render if not mounted, disabled, or not open (unless forced)
  if (!mounted || context.isDisabled || (!context.isOpen && !forceMount)) {
    return null;
  }

  const portalContainer = container || (typeof document !== 'undefined' ? document.body : null);

  if (!portalContainer) {
    return null;
  }

  return createPortal(children, portalContainer);
};

TooltipPortal.displayName = 'TooltipPortal';
