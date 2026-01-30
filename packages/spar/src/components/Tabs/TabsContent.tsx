import { type ElementType } from 'react';
import { useTabsContext } from './Tabs';
import type { TabsContentProps } from './types';

/**
 * TabsContent component that displays content for the active tab with lazy rendering support
 */
export const TabsContent = <T extends ElementType = 'div'>({
  value,
  forceMount = false,
  as,
  children,
  ...props
}: TabsContentProps<T>) => {
  const Component = as || 'div';
  const { selectedValue, orientation, tabsListId } = useTabsContext();
  const panelId = `${tabsListId}-panel-${value}`;
  const triggerId = `${tabsListId}-trigger-${value}`;

  const isSelected = selectedValue === value;

  // Lazy rendering: don't render unless active or forceMount is true
  if (!forceMount && !isSelected) {
    return null;
  }

  return (
    <Component
      id={panelId}
      role='tabpanel'
      aria-labelledby={triggerId}
      data-state={isSelected ? 'active' : 'inactive'}
      data-orientation={orientation}
      tabIndex={0}
      hidden={!isSelected}
      {...props}
    >
      {children}
    </Component>
  );
};

TabsContent.displayName = 'TabsContent';
