import { createContext, useContext } from 'react';
import type { InputContextValue } from '../types';

export const InputContext = createContext<InputContextValue | null>(null);

export const useInputContext = () => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error('Input compound components must be used within Input');
  }
  return context;
};

/**
 * Optionally read the nearest Input context. Returns `null` when no Input
 * ancestor is present, allowing controls to work both standalone and inside
 * an Input.
 */
export const useOptionalInputContext = () => useContext(InputContext);
