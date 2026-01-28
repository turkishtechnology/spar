import React, { useCallback, type ElementType } from 'react';
import { useTabsContext } from './Tabs';
import type { TabsListProps } from './types';

/**
 * TabsList component that contains TabsTrigger elements and handles keyboard navigation
 */
export const TabsList = <T extends ElementType = 'div'>({
  loop = true,
  as,
  children,
  onKeyDown,
  ...props
}: TabsListProps<T>) => {
  const Component = as || 'div';
  const context = useTabsContext();
  const { orientation, dir, activationMode, tabRefs, onValueChange, focusTab } = context;

  const getEnabledTabs = useCallback(() => {
    const isDisabled = (el: HTMLElement) =>
      el.hasAttribute('disabled') ||
      el.getAttribute('aria-disabled') === 'true' ||
      el.hasAttribute('data-disabled');
    return Array.from(tabRefs.current.entries())
      .filter(([, el]) => !isDisabled(el))
      .map(([value]) => value);
  }, []);

  const getNextTab = useCallback(
    (currentValue: string, direction: 1 | -1) => {
      const enabledTabs = getEnabledTabs();
      const currentIndex = enabledTabs.indexOf(currentValue);

      if (currentIndex === -1) return enabledTabs[0];

      let nextIndex = currentIndex + direction;

      if (loop) {
        if (nextIndex >= enabledTabs.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = enabledTabs.length - 1;
      } else {
        nextIndex = Math.max(0, Math.min(nextIndex, enabledTabs.length - 1));
      }

      return enabledTabs[nextIndex];
    },
    [getEnabledTabs, loop],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const currentValue = target.getAttribute('data-value');

      if (!currentValue) return;

      let nextValue: string | undefined;
      const shouldActivate = activationMode === 'automatic';

      switch (event.key) {
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            nextValue = getNextTab(currentValue, dir === 'ltr' ? 1 : -1);
            event.preventDefault();
          }
          break;

        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            nextValue = getNextTab(currentValue, dir === 'ltr' ? -1 : 1);
            event.preventDefault();
          }
          break;

        case 'ArrowDown':
          if (orientation === 'vertical') {
            nextValue = getNextTab(currentValue, 1);
            event.preventDefault();
          }
          break;

        case 'ArrowUp':
          if (orientation === 'vertical') {
            nextValue = getNextTab(currentValue, -1);
            event.preventDefault();
          }
          break;

        case 'Home': {
          const enabledTabs = getEnabledTabs();
          nextValue = enabledTabs[0];
          event.preventDefault();
          break;
        }

        case 'End': {
          const enabled = getEnabledTabs();
          nextValue = enabled[enabled.length - 1];
          event.preventDefault();
          break;
        }

        case 'Enter':
        case ' ':
          if (activationMode === 'manual') {
            onValueChange(currentValue);
            event.preventDefault();
          }
          break;
      }

      if (nextValue) {
        focusTab(nextValue);
        if (shouldActivate) {
          onValueChange(nextValue);
        }
      }

      onKeyDown?.(event);
    },
    [
      orientation,
      dir,
      activationMode,
      getNextTab,
      getEnabledTabs,
      focusTab,
      onValueChange,
      onKeyDown,
    ],
  );

  return (
    <Component
      role='tablist'
      aria-orientation={orientation}
      data-orientation={orientation}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </Component>
  );
};

TabsList.displayName = 'TabsList';
