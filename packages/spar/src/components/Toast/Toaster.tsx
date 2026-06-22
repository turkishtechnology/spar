import {
  ElementType,
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';
import { useMergedRef } from '@/hooks';
import type { ToasterProps } from './types';

const DEFAULT_HOTKEY = ['F8'];
const MODIFIER_KEYS = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'] as const;
const LAYOUT_MOTION_DURATION = 220;
const LAYOUT_MOTION_EASING = 'cubic-bezier(0.2, 0, 0, 1)';
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const isHotkeyMatch = (
  event: KeyboardEvent<HTMLElement> | globalThis.KeyboardEvent,
  hotkey: string[],
) => {
  const modifierKeys = new Set(MODIFIER_KEYS);
  const requiredModifiers = new Set(
    hotkey.filter((key) => modifierKeys.has(key as (typeof MODIFIER_KEYS)[number])),
  );
  const keyParts = hotkey.filter((key) => !modifierKeys.has(key as (typeof MODIFIER_KEYS)[number]));

  if (keyParts.length === 0) {
    return false;
  }

  const hasRequiredModifiers = MODIFIER_KEYS.every(
    (key) => event[key] === requiredModifiers.has(key),
  );
  const hasRequiredKeys = keyParts.every((key) => event.code === key || event.key === key);

  return hasRequiredModifiers && hasRequiredKeys;
};

export const Toaster = <T extends ElementType = 'div'>({
  as,
  toaster,
  children,
  label,
  hotkey = DEFAULT_HOTKEY,
  ref,
  ...props
}: ToasterProps<T>) => {
  const Component = (as ?? 'div') as ElementType;
  const internalRef = useRef<HTMLElement>(null);
  const mergedRef = useMergedRef(internalRef, ref);
  const toasts = useSyncExternalStore(toaster.subscribe, toaster.getSnapshot, toaster.getSnapshot);
  const visibleToasts = useMemo(
    () => toasts.slice(0, toaster.maxVisibleToasts),
    [toaster.maxVisibleToasts, toasts],
  );
  const previousRectsRef = useRef(new Map<string, DOMRect>());
  const layoutAnimationsRef = useRef(new Map<string, Animation>());
  const hotkeyLabel = hotkey.length > 0 ? ` (${hotkey.join('+')})` : '';
  const ariaLabel = label ?? `Notifications${hotkeyLabel}`;

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (isHotkeyMatch(event, hotkey)) {
      event.preventDefault();
      event.currentTarget.focus();
    }

    props.onKeyDown?.(event);
  };

  useEffect(() => {
    const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (isHotkeyMatch(event, hotkey)) {
        event.preventDefault();
        internalRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => document.removeEventListener('keydown', handleDocumentKeyDown);
  }, [hotkey]);

  useIsomorphicLayoutEffect(() => {
    const root = internalRef.current;

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

      const nextRect = element.getBoundingClientRect();
      const previousRect = previousRectsRef.current.get(id);
      nextIds.add(id);
      nextRects.set(id, nextRect);

      if (!previousRect || reduceMotion || typeof element.animate !== 'function') {
        return;
      }

      const deltaX = previousRect.left - nextRect.left;
      const deltaY = previousRect.top - nextRect.top;

      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
        return;
      }

      layoutAnimationsRef.current.get(id)?.cancel();
      layoutAnimationsRef.current.delete(id);
      const animation = element.animate(
        [{ transform: `translate(${deltaX}px, ${deltaY}px)` }, { transform: 'translate(0, 0)' }],
        {
          duration: LAYOUT_MOTION_DURATION,
          easing: LAYOUT_MOTION_EASING,
        },
      );

      layoutAnimationsRef.current.set(id, animation);
      void animation.finished
        .catch(() => undefined)
        .then(() => {
          if (layoutAnimationsRef.current.get(id) === animation) {
            layoutAnimationsRef.current.delete(id);
          }
        });
    });

    layoutAnimationsRef.current.forEach((animation, id) => {
      if (!nextIds.has(id)) {
        animation.cancel();
        layoutAnimationsRef.current.delete(id);
      }
    });

    previousRectsRef.current = nextRects;
  }, [visibleToasts]);

  return (
    <Component
      {...props}
      ref={mergedRef}
      role='region'
      aria-label={ariaLabel}
      tabIndex={-1}
      data-placement={toaster.placement}
      data-toaster=''
      onKeyDown={handleKeyDown}
    >
      {visibleToasts.map((toast) => children(toast))}
    </Component>
  );
};

Toaster.displayName = 'Toaster';
