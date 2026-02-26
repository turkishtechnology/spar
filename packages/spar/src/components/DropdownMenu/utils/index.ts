import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

export const isCharacterKey = (event: ReactKeyboardEvent<HTMLElement>) => {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;
};

export const TYPEAHEAD_TIMEOUT = 700;
