import React, { useCallback, useEffect, useRef } from 'react';
import type { SelectContentProps } from './types';
import { useSelectContext } from './SelectRoot';

/**
 * Dropdown container that appears when select is open. Handles keyboard navigation, focus management, and outside click detection.
 */
export const SelectContent = ({
  ref,
  position: _position = 'item-aligned',
  side = 'bottom',
  sideOffset: _sideOffset = 0,
  align = 'start',
  alignOffset: _alignOffset = 0,
  avoidCollisions: _avoidCollisions = true,
  collisionBoundary: _collisionBoundary = [],
  collisionPadding: _collisionPadding = 10,
  onEscapeKeyDown,
  onPointerDownOutside,
  onCloseAutoFocus: _onCloseAutoFocus,
  as: Component = 'div',
  onKeyDown,
  children,
  ...props
}: SelectContentProps) => {
  const context = useSelectContext();
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Merge external ref with internal ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(context.contentRef.current);
      } else if (ref) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref as any).current = context.contentRef.current;
      }
    }
  }, [ref, context.contentRef]);

  // Positioning - calculate position relative to trigger (only if using portal/fixed positioning)
  useEffect(() => {
    if (!context.open || !context.contentRef.current || !context.triggerRef.current) {
      return;
    }

    const content = context.contentRef.current;
    const trigger = context.triggerRef.current;

    // Check if content already has inline positioning (user-provided)
    // If so, skip automatic positioning
    const hasInlinePosition = props.style && 'position' in (props.style as Record<string, unknown>);
    if (hasInlinePosition) {
      return;
    }

    const updatePosition = () => {
      if (!content || !trigger) return;

      const triggerRect = trigger.getBoundingClientRect();

      // Basic positioning logic
      if (side === 'bottom') {
        content.style.position = 'fixed';
        content.style.left = `${triggerRect.left}px`;
        content.style.top = `${triggerRect.bottom + _sideOffset}px`;
        content.style.minWidth = `${triggerRect.width}px`;
      } else if (side === 'top') {
        content.style.position = 'fixed';
        content.style.left = `${triggerRect.left}px`;
        content.style.bottom = `${window.innerHeight - triggerRect.top + _sideOffset}px`;
        content.style.minWidth = `${triggerRect.width}px`;
      }
    };

    // Initial positioning
    updatePosition();

    // Update on scroll or resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [context.open, context.contentRef, context.triggerRef, side, _sideOffset, props.style]);

  // Focus management - focus content when opened
  useEffect(() => {
    if (context.open && context.contentRef.current) {
      context.contentRef.current.focus();
    }
  }, [context.open, context.contentRef]);

  // Handle outside clicks
  useEffect(() => {
    if (!context.open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const isOutside =
        context.contentRef.current &&
        context.triggerRef.current &&
        !context.contentRef.current.contains(target) &&
        !context.triggerRef.current.contains(target);

      if (isOutside) {
        onPointerDownOutside?.(event);
        if (!event.defaultPrevented) {
          context.onOpenChange(false);
        }
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [context, onPointerDownOutside]);

  // Get non-disabled items
  const getNonDisabledItems = useCallback(() => {
    return Array.from(context.items.values()).filter((item) => !item.disabled);
  }, [context.items]);

  // Type-ahead search
  const handleTypeAhead = useCallback(
    (char: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      const newSearch = context.searchString + char.toLowerCase();
      context.setSearchString(newSearch);

      const items = getNonDisabledItems();
      const matchIndex = items.findIndex((item) =>
        item.textValue.toLowerCase().startsWith(newSearch),
      );

      if (matchIndex !== -1) {
        context.setHighlightedIndex(matchIndex);
      }

      searchTimeoutRef.current = setTimeout(() => {
        context.setSearchString('');
      }, 1000);
    },
    [context, getNonDisabledItems],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const { key } = event;
      const items = getNonDisabledItems();

      switch (key) {
        case 'Escape':
          event.preventDefault();
          onEscapeKeyDown?.(event.nativeEvent);
          if (!event.defaultPrevented) {
            context.onOpenChange(false);
            context.triggerRef.current?.focus();
          }
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          if (context.highlightedIndex >= 0 && context.highlightedIndex < items.length) {
            const selectedItem = items[context.highlightedIndex];
            if (selectedItem) {
              context.onValueChange(selectedItem.value);
              context.onOpenChange(false);
              context.triggerRef.current?.focus();
            }
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          if (context.highlightedIndex < items.length - 1) {
            context.setHighlightedIndex(context.highlightedIndex + 1);
          } else {
            // Wrap to first
            context.setHighlightedIndex(0);
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (context.highlightedIndex > 0) {
            context.setHighlightedIndex(context.highlightedIndex - 1);
          } else {
            // Wrap to last
            context.setHighlightedIndex(items.length - 1);
          }
          break;

        case 'Home':
        case 'PageUp':
          event.preventDefault();
          context.setHighlightedIndex(0);
          break;

        case 'End':
        case 'PageDown':
          event.preventDefault();
          context.setHighlightedIndex(items.length - 1);
          break;

        case 'Tab':
          event.preventDefault();
          context.onOpenChange(false);
          break;

        default:
          // Type-ahead for single character keys
          if (key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault();
            handleTypeAhead(key);
          }
          break;
      }
    },
    [context, getNonDisabledItems, handleTypeAhead, onKeyDown, onEscapeKeyDown],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  if (!context.open) {
    return null;
  }

  return (
    <Component
      ref={context.contentRef}
      id={context.contentId}
      role='listbox'
      tabIndex={-1}
      data-state={context.open ? 'open' : 'closed'}
      data-side={side}
      data-align={align}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </Component>
  );
};

SelectContent.displayName = 'SelectContent';
