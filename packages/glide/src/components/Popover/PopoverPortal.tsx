import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PopoverPortalProps } from './types';

/**
 * Portal component for rendering content in a different DOM location
 */
export const PopoverPortal = ({ children, container }: PopoverPortalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return createPortal(children, container || document.body);
};

PopoverPortal.displayName = 'PopoverPortal';
