import {
  ElementType,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';
import { useMergedRef } from '@/hooks';
import type { ToasterProps } from './types';

const DEFAULT_HOTKEY = ['F8'];
const MODIFIER_KEYS = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'] as const;

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
