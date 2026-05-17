import { createContext, useContext } from 'react';
import type { RadioContextValue } from '../types';

export const RadioContext = createContext<RadioContextValue | null>(null);

export const useRadioContext = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('RadioItem must be used within a Radio');
  }
  return context;
};
