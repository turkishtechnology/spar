import { useCallback, useMemo, useState } from 'react';

const isNode = (value: unknown): value is Node =>
  typeof Node !== 'undefined' && value instanceof Node;

/**
 * Sort keys by the document position of the registered nodes so keyboard
 * navigation follows the rendered order, not the order in which items happened
 * to mount (an item inserted between existing ones registers last).
 */
const sortByDocumentOrder = (entries: [string, Node][]): [string, Node][] =>
  [...entries].sort(([, a], [, b]) => {
    if (a === b) return 0;
    const position = a.compareDocumentPosition(b);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });

/**
 * Generic item registry hook using Map for unified item management across components
 *
 * When every registered item carries a DOM node as its data, the indexed
 * lookups (`getItemIds`, `getItemAtIndex`, `getItemIndex`) follow document
 * order; otherwise they follow registration order.
 *
 * @template T - Type of data stored with each item (use void for simple ID-only tracking)
 */
export function useItemRegistry<T = void>() {
  const [items, setItems] = useState<Map<string, T>>(() => new Map());

  const registerItem = useCallback((id: string, data?: T) => {
    setItems((prev) => {
      const next = new Map(prev);
      next.set(id, data as T);
      return next;
    });
  }, []);

  const unregisterItem = useCallback((id: string) => {
    setItems((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Recomputed whenever the map changes — not only when its size changes — so
  // replacing one item with another keeps the indexed lookups accurate.
  const orderedIds = useMemo(() => {
    const entries = Array.from(items.entries());
    if (entries.length > 1 && entries.every(([, data]) => isNode(data))) {
      return sortByDocumentOrder(entries as [string, Node][]).map(([id]) => id);
    }
    return entries.map(([id]) => id);
  }, [items]);

  const getItemIds = useCallback(() => orderedIds, [orderedIds]);

  // Get item at specific index (for indexed navigation)
  const getItemAtIndex = useCallback((index: number) => orderedIds[index], [orderedIds]);

  // Get index of item (for indexed navigation)
  const getItemIndex = useCallback((id: string) => orderedIds.indexOf(id), [orderedIds]);

  return {
    items,
    registerItem,
    unregisterItem,
    getItemIds,
    getItemAtIndex,
    getItemIndex,
    count: items.size,
  };
}

/**
 * Return type for useItemRegistry hook
 */
export type ItemRegistry<T = void> = ReturnType<typeof useItemRegistry<T>>;
