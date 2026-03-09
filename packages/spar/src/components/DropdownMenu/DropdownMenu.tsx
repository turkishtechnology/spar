import { useCallback, useEffect, useMemo, useRef, useState, useId } from 'react';
import { useControlledState } from '@/hooks';
import type {
  DropdownMenuProps,
  DropdownMenuContextValue,
  DropdownMenuFocusStrategy,
} from './types';
import { DropdownMenuContext } from './hooks';

/**
 * Root component that manages dropdown menu state and provides context to child components.
 * Supports controlled/uncontrolled open state, modal/non-modal modes, and full keyboard navigation.
 */
export const DropdownMenu = ({
  id: providedId,
  open,
  defaultOpen = false,
  onOpenChange,
  modal = true,
  disabled = false,
  closeOnSelect = true,
  children,
}: DropdownMenuProps) => {
  const [isOpen = false, setIsOpen] = useControlledState(open, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement | null>(null);
  const arrowRef = useRef<Element | null>(null);
  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;
  const [focusStrategy, setFocusStrategy] = useState<DropdownMenuFocusStrategy>('none');
  const restoreFocusRef = useRef(true);
  const previousOpenRef = useRef(isOpen);

  const closeMenu = useCallback(
    (options?: { focusTrigger?: boolean }) => {
      restoreFocusRef.current = options?.focusTrigger !== false;
      setIsOpen(false);
    },
    [setIsOpen],
  );

  useEffect(() => {
    if (!previousOpenRef.current && isOpen) {
      restoreFocusRef.current = true;
    }

    if (previousOpenRef.current && !isOpen && restoreFocusRef.current) {
      triggerRef.current?.focus({ preventScroll: true });
    }

    previousOpenRef.current = isOpen;
  }, [isOpen]);

  const contextValue = useMemo<DropdownMenuContextValue>(
    () => ({
      open: isOpen,
      onOpenChange: setIsOpen,
      triggerId,
      contentId,
      modal,
      disabled,
      closeOnSelect,
      focusStrategy,
      setFocusStrategy,
      triggerRef,
      arrowRef,
      closeMenu,
    }),
    [
      isOpen,
      setIsOpen,
      triggerId,
      contentId,
      modal,
      disabled,
      closeOnSelect,
      focusStrategy,
      setFocusStrategy,
      triggerRef,
      arrowRef,
      closeMenu,
    ],
  );

  return (
    <DropdownMenuContext.Provider value={contextValue}>{children}</DropdownMenuContext.Provider>
  );
};

DropdownMenu.displayName = 'DropdownMenu';
