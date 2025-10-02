import { createContext, useContext } from 'react';
import type {
  DropdownMenuContextValue,
  DropdownMenuRadioGroupContextValue,
  DropdownMenuSubContextValue,
} from './types';

export interface MenuCollectionItem {
  id: string;
  ref: React.RefObject<HTMLElement | null>;
  disabled: boolean;
  textValue: string;
  type: 'item' | 'checkbox' | 'radio' | 'subtrigger';
}

export interface DropdownMenuCollectionContextValue {
  registerItem: (item: MenuCollectionItem) => void;
  unregisterItem: (id: string) => void;
  highlightItem: (id: string | null) => void;
  highlightFirst: () => void;
  highlightLast: () => void;
  highlightNext: () => void;
  highlightPrevious: () => void;
  isItemHighlighted: (id: string) => boolean;
  highlightedId: string | null;
  closeOnSelect: boolean | 'auto';
  closeMenu: (options?: { focusTrigger?: boolean }) => void;
  loop: boolean;
  dir: 'ltr' | 'rtl';
}

export const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);
export const DropdownMenuSubContext = createContext<DropdownMenuSubContextValue | null>(null);
export const DropdownMenuRadioGroupContext =
  createContext<DropdownMenuRadioGroupContextValue | null>(null);
export const DropdownMenuCollectionContext =
  createContext<DropdownMenuCollectionContextValue | null>(null);

export const useDropdownMenuRootContext = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenu.Root');
  }
  return context;
};

export const useMenuScope = () => {
  const subContext = useContext(DropdownMenuSubContext);
  if (subContext) {
    return subContext;
  }
  return useDropdownMenuRootContext();
};

export const useDropdownMenuCollectionContext = () => {
  const context = useContext(DropdownMenuCollectionContext);
  if (!context) {
    throw new Error('DropdownMenu items must be rendered within DropdownMenu.Content');
  }
  return context;
};

export const useDropdownMenuRadioGroupContext = () => {
  return useContext(DropdownMenuRadioGroupContext);
};

export const useDropdownMenuSubContext = () => {
  const context = useContext(DropdownMenuSubContext);
  if (!context) {
    throw new Error('DropdownMenu.Sub components must be used within DropdownMenu.Sub');
  }
  return context;
};
