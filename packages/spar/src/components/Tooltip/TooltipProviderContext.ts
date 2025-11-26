import { createContext } from 'react';
import type { TooltipProviderContextValue } from './types';

export const TooltipProviderContext = createContext<TooltipProviderContextValue | null>(null);
