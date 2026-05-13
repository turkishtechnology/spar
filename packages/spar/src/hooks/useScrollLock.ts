import { useEffect } from 'react';

/**
 * Global lock count per document, enabling nested dialogs.
 * First lock applies overflow:hidden, last unlock restores original styles.
 */
const lockMap = new Map<Document, { count: number; overflow: string; paddingRight: string }>();

function lock(doc: Document) {
  let entry = lockMap.get(doc);

  if (!entry) {
    const { documentElement } = doc;
    const ownerWindow = doc.defaultView ?? window;

    // Capture original styles before any mutation
    entry = {
      count: 0,
      overflow: documentElement.style.overflow,
      paddingRight: documentElement.style.paddingRight,
    };
    lockMap.set(doc, entry);

    // Scrollbar width compensation (measure before hiding overflow)
    const scrollbarWidth = Math.max(0, ownerWindow.innerWidth - documentElement.clientWidth);
    documentElement.style.paddingRight = `${scrollbarWidth}px`;
    documentElement.style.overflow = 'hidden';
  }

  entry.count++;
}

function unlock(doc: Document) {
  const entry = lockMap.get(doc);
  if (!entry) return;

  entry.count--;

  if (entry.count <= 0) {
    const { documentElement } = doc;
    documentElement.style.overflow = entry.overflow;
    documentElement.style.paddingRight = entry.paddingRight;
    lockMap.delete(doc);
  }
}

/**
 * Locks document scroll when enabled.
 * Uses reference counting so nested dialogs share a single lock —
 * only the first lock applies `overflow: hidden`, and only the last
 * unlock restores the original styles. Compensates for scrollbar width
 * to prevent layout shift.
 */
export function useScrollLock(enabled: boolean, ownerDocument?: Document | null) {
  useEffect(() => {
    if (!enabled) return;

    const doc = ownerDocument ?? document;
    lock(doc);
    return () => unlock(doc);
  }, [enabled, ownerDocument]);
}
