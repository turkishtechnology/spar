import { createContext, useContext } from 'react';
import type { ToastContextValue } from '../types';

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToastContext = (componentName = 'Toast') => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Toast.Root`);
  }

  return context;
};
