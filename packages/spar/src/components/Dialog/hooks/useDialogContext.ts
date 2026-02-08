import { createContext, useContext } from 'react';
import type { DialogContextValue } from '../types';

export const DialogContext = createContext<DialogContextValue | null>(null);

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a DialogRoot');
  }
  return context;
};
