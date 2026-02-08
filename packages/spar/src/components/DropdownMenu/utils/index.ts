import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { CheckedState } from '../../../types';

export const isCharacterKey = (event: ReactKeyboardEvent<HTMLElement>) => {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;
};

export const getCloseKey = (dir: 'ltr' | 'rtl') => (dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
export const getOpenKey = (dir: 'ltr' | 'rtl') => (dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');

export const mapCheckedStateToDataAttribute = (
  checked: CheckedState,
): { 'data-checked'?: ''; 'data-indeterminate'?: '' } => {
  if (checked === 'indeterminate') {
    return { 'data-indeterminate': '' };
  }
  return checked ? { 'data-checked': '' } : {};
};

export const mapCheckedStateToAria = (checked: CheckedState) => {
  if (checked === 'indeterminate') {
    return 'mixed';
  }
  return checked;
};

export const TYPEAHEAD_TIMEOUT = 700;
