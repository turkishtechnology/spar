import type { Ref, KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { CheckedState } from './types';

export const composeRefs = <T>(...refs: Array<Ref<T> | undefined>) => {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as { current: T | null }).current = node;
      }
    });
  };
};

export const isCharacterKey = (event: ReactKeyboardEvent<HTMLElement>) => {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;
};

export const getCloseKey = (dir: 'ltr' | 'rtl') => (dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
export const getOpenKey = (dir: 'ltr' | 'rtl') => (dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');

export const mapCheckedStateToDataAttribute = (checked: CheckedState) => {
  if (checked === 'indeterminate') {
    return 'indeterminate';
  }
  return checked ? 'true' : 'false';
};

export const mapCheckedStateToAria = (checked: CheckedState) => {
  if (checked === 'indeterminate') {
    return 'mixed';
  }
  return checked;
};

export const TYPEAHEAD_TIMEOUT = 700;
