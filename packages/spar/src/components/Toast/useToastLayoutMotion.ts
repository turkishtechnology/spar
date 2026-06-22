import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

const LAYOUT_MOTION_DURATION = 220;
const LAYOUT_MOTION_EASING = 'cubic-bezier(0.2, 0, 0, 1)';
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const useToastLayoutMotion = (rootRef: RefObject<HTMLElement | null>, layoutKey: string) => {
  const previousRectsRef = useRef(new Map<string, DOMRect>());
  const animationsRef = useRef(new Map<string, Animation>());

  useEffect(() => {
    return () => {
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current.clear();
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || typeof window === 'undefined') {
      return;
    }

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-toast-id]'));
    const nextRects = new Map<string, DOMRect>();
    const nextIds = new Set<string>();

    elements.forEach((element) => {
      const id = element.dataset.toastId;

      if (!id) {
        return;
      }

      if (element.dataset.status === 'dismissing') {
        animationsRef.current.get(id)?.cancel();
        animationsRef.current.delete(id);
        return;
      }

      const nextRect = element.getBoundingClientRect();
      const previousRect = previousRectsRef.current.get(id);
      nextRects.set(id, nextRect);
      nextIds.add(id);

      if (reduceMotion || !previousRect || typeof element.animate !== 'function') {
        animationsRef.current.get(id)?.cancel();
        animationsRef.current.delete(id);
        return;
      }

      const deltaX = previousRect.left - nextRect.left;
      const deltaY = previousRect.top - nextRect.top;

      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
        return;
      }

      animationsRef.current.get(id)?.cancel();
      const animation = element.animate(
        [{ transform: `translate(${deltaX}px, ${deltaY}px)` }, { transform: 'translate(0, 0)' }],
        {
          duration: LAYOUT_MOTION_DURATION,
          easing: LAYOUT_MOTION_EASING,
        },
      );

      animationsRef.current.set(id, animation);
      void animation.finished
        .catch(() => undefined)
        .then(() => {
          if (animationsRef.current.get(id) === animation) {
            animationsRef.current.delete(id);
          }
        });
    });

    animationsRef.current.forEach((animation, id) => {
      if (!nextIds.has(id)) {
        animation.cancel();
        animationsRef.current.delete(id);
      }
    });

    previousRectsRef.current = nextRects;
  }, [layoutKey, rootRef]);
};
