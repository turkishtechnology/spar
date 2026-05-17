import { useEffect } from 'react';

/**
 * Global lock count per document, enabling nested dialogs.
 * First lock applies scroll prevention, last unlock restores original styles.
 * Uses the body-fixed pattern to preserve scroll position on all platforms (including iOS).
 */
const lockMap = new Map<
  Document,
  {
    count: number;
    scrollY: number;
    overflow: string;
    position: string;
    top: string;
    left: string;
    right: string;
    paddingRight: string;
  }
>();

function lock(doc: Document) {
  let entry = lockMap.get(doc);

  if (!entry) {
    const { body } = doc;
    const ownerWindow = doc.defaultView ?? window;
    const scrollY = ownerWindow.scrollY;

    // Scrollbar width compensation (measure before hiding overflow)
    const scrollbarWidth = Math.max(0, ownerWindow.innerWidth - doc.documentElement.clientWidth);

    // Capture original body styles before mutation
    entry = {
      count: 0,
      scrollY,
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      paddingRight: body.style.paddingRight,
    };
    lockMap.set(doc, entry);

    // Apply fixed positioning to body — preserves visual scroll position.
    // Using left/right: 0 instead of width: 100% to handle body margin edge cases.
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.paddingRight = `${scrollbarWidth}px`;
  }

  entry.count++;
}

function unlock(doc: Document) {
  const entry = lockMap.get(doc);
  if (!entry) return;

  entry.count--;

  if (entry.count <= 0) {
    const { body } = doc;
    const ownerWindow = doc.defaultView ?? window;

    // Restore original body styles
    body.style.overflow = entry.overflow;
    body.style.position = entry.position;
    body.style.top = entry.top;
    body.style.left = entry.left;
    body.style.right = entry.right;
    body.style.paddingRight = entry.paddingRight;

    // Restore scroll position
    ownerWindow.scrollTo(0, entry.scrollY);
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
