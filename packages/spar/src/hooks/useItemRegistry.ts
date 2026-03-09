import { useCallback, useState } from 'react';

/**
 * Generic item registry hook using Map for unified item management across components
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

  const getItemIds = useCallback(() => Array.from(items.keys()), [items.size]);

  // Get item at specific index (for indexed navigation)
  // Use items.size as dependency to avoid infinite loops while still updating when items change
  const getItemAtIndex = useCallback(
    (index: number) => {
      const keys = Array.from(items.keys());
      return keys[index];
    },
    [items.size],
  );

  // Get index of item (for indexed navigation)
  // Use items.size as dependency to avoid infinite loops while still updating when items change
  const getItemIndex = useCallback(
    (id: string) => {
      const keys = Array.from(items.keys());
      return keys.indexOf(id);
    },
    [items.size],
  );

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
