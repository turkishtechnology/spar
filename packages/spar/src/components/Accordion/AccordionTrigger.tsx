import React, { useCallback } from 'react';
import type { AccordionTriggerProps } from './types';
import { useAccordionContext } from './Accordion';
import { useAccordionItemContext } from './AccordionItem';

/**
 * Accordion trigger button that toggles panel visibility. Provides keyboard navigation and screen reader support.
 */
export const AccordionTrigger = ({
  as: Component = 'button',
  children,
  onClick,
  onKeyDown,
  ...props
}: AccordionTriggerProps) => {
  const accordionContext = useAccordionContext();
  const itemContext = useAccordionItemContext();
  const { isExpanded, disabled, triggerId, contentId, onToggle } = itemContext;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!disabled) {
        onToggle();
      }
      onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    },
    [disabled, onToggle, onClick],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const { key } = event;
      const currentIndex = accordionContext.getItemIndex(itemContext.value);
      const totalItems = accordionContext.itemCount;

      switch (key) {
        case 'Enter':
        case ' ': // Space
          event.preventDefault();
          if (!disabled) {
            onToggle();
          }
          break;

        case 'ArrowDown':
        case 'ArrowUp': {
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
    [accordionContext, itemContext, disabled, onToggle, onKeyDown],
  );

  // Common props for all component types
  const isButton = Component === 'button';
  const triggerProps = {
    ...props,
    id: triggerId,
    'aria-expanded': isExpanded,
    'aria-controls': contentId,
    'data-state': isExpanded ? 'open' : 'closed',
    'data-accordion-trigger': '',
    'data-value': itemContext.value,
    ...(disabled && { 'data-disabled': '' }),
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    // Button-specific props
    ...(isButton && { type: 'button' as const, disabled }),
    // Non-button props for accessibility
    ...(!isButton && {
      role: 'button',
      'aria-disabled': disabled,
      tabIndex: disabled ? -1 : 0,
    }),
  };

  return <Component {...triggerProps}>{children}</Component>;
};

AccordionTrigger.displayName = 'AccordionTrigger';
