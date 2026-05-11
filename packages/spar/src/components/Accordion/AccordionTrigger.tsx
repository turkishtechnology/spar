import React, { useCallback, useEffect, useRef, useMemo, ElementType } from 'react';
import { useMergedRef } from '@/hooks';
import type { AccordionTriggerProps, AccordionTriggerRenderProps } from './types';
import { useAccordionContext, useAccordionItemContext } from './hooks';
import { CollapsibleTrigger } from '../Collapsible';

const getRegistryItemId = (value: string | number): string => `${typeof value}:${String(value)}`;

/**
 * Accordion trigger button that toggles panel visibility. Provides keyboard navigation and screen reader support.
 */
export const AccordionTrigger = <T extends ElementType = 'button'>({
  as,
  children,
  onClick,
  onKeyDown,
  ref: forwardedRef,
  ...props
}: AccordionTriggerProps<T>) => {
  const Component = as || 'button';
  const accordionContext = useAccordionContext();
  const itemContext = useAccordionItemContext();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const composedRef = useMergedRef(triggerRef, forwardedRef);

  const itemId = useMemo(() => getRegistryItemId(itemContext.value), [itemContext.value]);
  const dataValue = useMemo(() => String(itemContext.value), [itemContext.value]);

  useEffect(() => {
    if (triggerRef.current) {
      accordionContext.registerItem(itemId, triggerRef.current);
    }
    return () => accordionContext.unregisterItem(itemId);
  }, [itemId, accordionContext.registerItem, accordionContext.unregisterItem]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const { key } = event;
      const currentIndex = accordionContext.getItemIndex(itemId);
      const totalItems = accordionContext.itemCount;
      const isHorizontal = accordionContext.orientation === 'horizontal';

      switch (key) {
        case 'ArrowDown':
        case 'ArrowUp': {
          if (isHorizontal) break;
          event.preventDefault();
          const isDown = key === 'ArrowDown';
          const nextIndex = isDown
            ? (currentIndex + 1) % totalItems
            : (currentIndex - 1 + totalItems) % totalItems;
          accordionContext.focusItemAtIndex(nextIndex);
          break;
        }

        case 'ArrowRight':
        case 'ArrowLeft': {
          if (!isHorizontal) break;
          event.preventDefault();
          const isRight = key === 'ArrowRight';
          const nextIndex = isRight
            ? (currentIndex + 1) % totalItems
            : (currentIndex - 1 + totalItems) % totalItems;
          accordionContext.focusItemAtIndex(nextIndex);
          break;
        }

        case 'Home': {
          event.preventDefault();
          accordionContext.focusItemAtIndex(0);
          break;
        }

        case 'End': {
          event.preventDefault();
          accordionContext.focusItemAtIndex(totalItems - 1);
          break;
        }

        default:
          break;
      }

      onKeyDown?.(event as React.KeyboardEvent<HTMLButtonElement>);
    },
    [accordionContext, itemId, onKeyDown],
  );

  // Render props for children function
  const renderProps: AccordionTriggerRenderProps = {
    isOpen: itemContext.isOpen,
    disabled: itemContext.disabled,
    open: itemContext.open,
    close: itemContext.close,
    toggle: itemContext.toggle,
  };

  return (
    <CollapsibleTrigger
      as={Component}
      ref={composedRef}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      data-accordion-trigger=''
      data-value={dataValue}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </CollapsibleTrigger>
  );
};

AccordionTrigger.displayName = 'AccordionTrigger';
