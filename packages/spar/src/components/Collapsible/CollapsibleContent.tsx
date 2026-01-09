import React, { useEffect, useRef } from 'react';
import { useCollapsibleContext } from './Collapsible';
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
export const CollapsibleContent = ({
  as: Component = 'div',
  forceMount = false,
  children,
  style,
  onBeforeMatch,
  ...props
}: CollapsibleContentProps) => {
  const { isOpen, disabled, contentId, toggle } = useCollapsibleContext();
  const contentRef = useRef<HTMLElement>(null);

  // Update CSS custom properties for animations
  useEffect(() => {
    const element = contentRef.current;
    if (!element) return undefined;

    const updateCustomProperties = () => {
      const { width, height } = element.getBoundingClientRect();
      element.style.setProperty('--spar-collapsible-content-width', `${width}px`);
      element.style.setProperty('--spar-collapsible-content-height', `${height}px`);
    };

    // Update properties when content becomes visible
    if (isOpen) {
      updateCustomProperties();
    }

    // Set up ResizeObserver to update properties when content size changes
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(updateCustomProperties);
      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }

    return undefined;
  }, [isOpen]);

  const handleBeforeMatch = (event: Event) => {
    // When content is found via browser search, open the collapsible
    if (forceMount && !isOpen) {
      toggle();
    }
    onBeforeMatch?.(event);
  };

  // Don't render content if closed and not force mounted
  if (!isOpen && !forceMount) {
    return null;
  }

  // Get data attributes for styling
  const dataState = isOpen ? 'open' : 'closed';
  const hiddenAttribute = getHiddenAttribute(isOpen, forceMount);

  // Combine styles with CSS custom properties
  const combinedStyle: React.CSSProperties = {
    ...style,
  };

  return (
    <Component
      ref={contentRef}
      id={contentId}
      hidden={hiddenAttribute}
      data-state={dataState}
      data-disabled={disabled ? '' : undefined}
      style={combinedStyle}
      onBeforeMatch={forceMount && !isOpen ? handleBeforeMatch : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

CollapsibleContent.displayName = 'CollapsibleContent';
