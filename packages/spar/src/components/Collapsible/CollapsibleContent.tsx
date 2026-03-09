import { useEffect, useRef, ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import { useCollapsibleContext } from './hooks';
import type { CollapsibleContentProps } from './types';

// Helper function to determine the hidden attribute value
const getHiddenAttribute = (isOpen: boolean, forceMount: boolean) => {
  if (isOpen) return undefined; // Content visible
  if (!forceMount) return undefined; // Content unmounted, no hidden needed

  // Content force mounted but closed - use until-found for findability
  if (typeof document !== 'undefined' && 'onbeforematch' in document) {
    return 'until-found'; // Modern browsers with findability support
  }
  return true; // Fallback to standard hidden
};

/**
 * Collapsible content component containing the collapsible content.
 */
export const CollapsibleContent = <T extends ElementType = 'div'>({
  as,
  ref,
  forceMount = false,
  children,
  onBeforeMatch,
  ...props
}: CollapsibleContentProps<T>) => {
  const Component = as || 'div';
  const { isOpen, disabled, contentId, toggle } = useCollapsibleContext();
  const contentRef = useRef<HTMLElement>(null);
  const mergedRef = useMergedRef(contentRef, ref);

  // Handle beforematch event for hidden="until-found" support
  // This must be attached via addEventListener since React doesn't support onBeforeMatch
  useEffect(() => {
    const element = contentRef.current;
    if (!element || !forceMount || isOpen) return undefined;

    const handleBeforeMatch = (event: Event) => {
      // When content is found via browser search, open the collapsible
      toggle();
      onBeforeMatch?.(event);
    };

    element.addEventListener('beforematch', handleBeforeMatch);

    return () => {
      element.removeEventListener('beforematch', handleBeforeMatch);
    };
  }, [forceMount, isOpen, toggle, onBeforeMatch]);

  // Don't render content if closed and not force mounted
  if (!isOpen && !forceMount) {
    return null;
  }

  // Get data attributes for styling
  const dataState = isOpen ? 'open' : 'closed';
  const hiddenAttribute = getHiddenAttribute(isOpen, forceMount);

  return (
    <Component
      ref={mergedRef}
      id={contentId}
      hidden={hiddenAttribute}
      data-state={dataState}
      data-disabled={disabled ? '' : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

CollapsibleContent.displayName = 'CollapsibleContent';
