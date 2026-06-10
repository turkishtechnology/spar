import { useCallback, useMemo, useState, type ElementType, type RefObject } from 'react';
import { BreadcrumbListContext } from './hooks';
import type { BreadcrumbListProps, BreadcrumbListContextValue, BreadcrumbPosition } from './types';

interface RegisteredItem {
  id: string;
  ref: RefObject<HTMLElement | null>;
}

/**
 * Ordered list container for breadcrumb items. Provides semantic structure for
 * the navigation trail and derives each item's position from registered DOM order.
 */
export const BreadcrumbList = <T extends ElementType = 'ol'>({
  as,
  children,
  ...props
}: BreadcrumbListProps<T>) => {
  const Component = as || 'ol';
  const [items, setItems] = useState<RegisteredItem[]>([]);

  const registerItem = useCallback((id: string, ref: RefObject<HTMLElement | null>) => {
    setItems((previous) => {
      const next = [...previous.filter((entry) => entry.id !== id), { id, ref }];
      next.sort((a, b) => {
        const aNode = a.ref.current;
        const bNode = b.ref.current;
        if (aNode && bNode) {
          const position = aNode.compareDocumentPosition(bNode);
          if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
          if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        }
        return 0;
      });
      return next;
    });
  }, []);

  const unregisterItem = useCallback((id: string) => {
    setItems((previous) => previous.filter((entry) => entry.id !== id));
  }, []);

  const getItemPosition = useCallback(
    (id: string) => {
      const index = items.findIndex((entry) => entry.id === id);
      const isCurrent = index !== -1 && index === items.length - 1;
      const position: BreadcrumbPosition = index === 0 ? 'first' : isCurrent ? 'last' : 'middle';
      return { position, isCurrent };
    },
    [items],
  );

  const contextValue = useMemo<BreadcrumbListContextValue>(
    () => ({ registerItem, unregisterItem, getItemPosition }),
    [registerItem, unregisterItem, getItemPosition],
  );

  return (
    <BreadcrumbListContext.Provider value={contextValue}>
      <Component {...props}>{children}</Component>
    </BreadcrumbListContext.Provider>
  );
};

BreadcrumbList.displayName = 'BreadcrumbList';
