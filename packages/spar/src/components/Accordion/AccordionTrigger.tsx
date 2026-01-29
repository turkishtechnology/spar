import React, { useCallback, ElementType } from 'react';
import type { AccordionTriggerProps, AccordionTriggerRenderProps } from './types';
import { useAccordionContext } from './Accordion';
import { useAccordionItemContext } from './AccordionItem';
import { CollapsibleTrigger } from '../Collapsible';

/**
 * Accordion trigger button that toggles panel visibility. Provides keyboard navigation and screen reader support.
 */
export const AccordionTrigger = <T extends ElementType = 'button'>({
  as,
  children,
  onClick,
  onKeyDown,
  ...props
}: AccordionTriggerProps<T>) => {
  const Component = as || 'button';
  const accordionContext = useAccordionContext();
  const itemContext = useAccordionItemContext();

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const { key } = event;
      const currentIndex = accordionContext.getItemIndex(itemContext.value);
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

          const nextItemValue = accordionContext.getItemAtIndex(nextIndex);
          if (nextItemValue) {
            // Focus the next trigger
            const nextTrigger = document.querySelector(
              `[data-accordion-trigger][data-value="${nextItemValue}"]`,
            ) as HTMLElement;
            nextTrigger?.focus();
          }
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

          const nextItemValue = accordionContext.getItemAtIndex(nextIndex);
          if (nextItemValue) {
            // Focus the next trigger
            const nextTrigger = document.querySelector(
              `[data-accordion-trigger][data-value="${nextItemValue}"]`,
            ) as HTMLElement;
            nextTrigger?.focus();
          }
          break;
        }

        case 'Home': {
          event.preventDefault();
          const firstItemValue = accordionContext.getItemAtIndex(0);
          if (firstItemValue) {
            const firstTrigger = document.querySelector(
              `[data-accordion-trigger][data-value="${firstItemValue}"]`,
            ) as HTMLElement;
            firstTrigger?.focus();
          }
          break;
        }

        case 'End': {
          event.preventDefault();
          const lastItemValue = accordionContext.getItemAtIndex(totalItems - 1);
          if (lastItemValue) {
            const lastTrigger = document.querySelector(
              `[data-accordion-trigger][data-value="${lastItemValue}"]`,
            ) as HTMLElement;
            lastTrigger?.focus();
          }
          break;
        }

        default:
          break;
      }

      onKeyDown?.(event as React.KeyboardEvent<HTMLButtonElement>);
    },
    [accordionContext, itemContext.value, onKeyDown],
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
      onClick={onClick}
      onKeyDown={handleKeyDown}
      data-accordion-trigger=''
      data-value={itemContext.value}
      {...props}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </CollapsibleTrigger>
  );
};

AccordionTrigger.displayName = 'AccordionTrigger';
