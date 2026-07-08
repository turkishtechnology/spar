import { useRef, useCallback, useEffect, type KeyboardEvent as ReactKeyboardEvent } from 'react';

const TYPEAHEAD_TIMEOUT = 700;

const isCharacterKey = (event: ReactKeyboardEvent<HTMLElement>): boolean =>
  event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;

const normalizeValue = (value: string): string => value.trim().toLocaleLowerCase();

export interface TypeaheadItem {
  id: string;
  textValue: string;
  disabled?: boolean;
}

export interface UseTypeaheadOptions {
  /** Items to search through. Hook filters disabled items internally. */
  items: TypeaheadItem[];
  /** ID of the currently highlighted item, or null if none. */
  highlightedId: string | null;
  /** Called when a typeahead match is found. */
  onHighlight: (id: string) => void;
  /** Debounce timeout in ms before the search buffer resets.
   * @defaultValue 700
   */
  timeout?: number;
}

export interface UseTypeaheadReturn {
  /**
   * Call inside a keydown handler. Returns true if the key was consumed by
   * typeahead so the caller can call event.preventDefault().
   */
  performTypeahead: (event: ReactKeyboardEvent<HTMLElement>) => boolean;
  /** Clears the search buffer and cancels the pending reset timeout. */
  resetTypeahead: () => void;
}

/**
 * Provides keyboard type-ahead search for list/menu components.
 *
 * Features:
 * - Buffer stored in a ref (no re-renders on keypress)
 * - Repeated-key cycling: pressing the same key cycles through all matches
 * - Wrap-around search: starts from the item after the current highlight
 * - Auto-reset after `timeout` ms of inactivity
 */
export const useTypeahead = ({
  items,
  highlightedId,
  onHighlight,
  timeout = TYPEAHEAD_TIMEOUT,
}: UseTypeaheadOptions): UseTypeaheadReturn => {
  const bufferRef = useRef('');
  const timeoutRef = useRef<number | null>(null);

  const resetTypeahead = useCallback(() => {
    bufferRef.current = '';
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const performTypeahead = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>): boolean => {
      if (!isCharacterKey(event)) return false;

      // Space extends an in-progress search so multi-word labels ("New York")
      // can be matched. With an empty buffer it is left for the caller — in
      // menus/selects Space selects the highlighted item.
      const isSpace = event.key === ' ';
      if (isSpace && bufferRef.current.length === 0) return false;

      const key = isSpace ? ' ' : normalizeValue(event.key);
      if (!key) return false;

      const nextSearch = `${bufferRef.current}${key}`;
      // Repeated key (e.g. "aaa") → cycle through items starting with that char
      const isRepeatedKey =
        nextSearch.length > 1 && nextSearch.split('').every((char) => char === nextSearch[0]);
      const search = isRepeatedKey ? key : nextSearch;
      if (!search) return false;

      const enabledItems = items
        .filter((item) => !item.disabled)
        .map((item) => ({ item, value: normalizeValue(item.textValue) }))
        .filter((entry) => entry.value.length > 0);

      if (!enabledItems.length) return false;

      const currentIndex = highlightedId
        ? enabledItems.findIndex((entry) => entry.item.id === highlightedId)
        : -1;

      // Wrap-around search starting from the item after the current highlight
      const findMatch = (startIndex: number) => {
        for (let step = 1; step <= enabledItems.length; step += 1) {
          const index = (startIndex + step) % enabledItems.length;
          const candidate = enabledItems[index];
          if (candidate?.value.startsWith(search)) return candidate.item;
        }
        return null;
      };

      const match = findMatch(currentIndex);
      if (match) onHighlight(match.id);

      bufferRef.current = search;
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(resetTypeahead, timeout);

      return true;
    },
    [items, highlightedId, onHighlight, timeout, resetTypeahead],
  );

  // Cleanup pending timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { performTypeahead, resetTypeahead };
};
