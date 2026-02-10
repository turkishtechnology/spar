import { useCallback, useEffect, useMemo, useRef, useState, useId } from 'react';
import type {
  DropdownMenuSubProps,
  DropdownMenuSubContextValue,
  DropdownMenuFocusStrategy,
} from './types';
import { useDropdownMenuContext, DropdownMenuSubContext } from './hooks';

/**
 * Sub-menu root component that manages nested dropdown state.
 * Automatically closes when the parent menu closes.
 */
export const DropdownMenuSub = ({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: DropdownMenuSubProps) => {
  const rootContext = useDropdownMenuContext();
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? Boolean(open) : internalOpen;
  const triggerId = useId();
  const contentId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const [focusStrategy, setFocusStrategy] = useState<DropdownMenuFocusStrategy>('none');
  const restoreFocusRef = useRef(true);
  const previousOpenRef = useRef(isOpen);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const closeMenu = useCallback(
    (options?: { focusTrigger?: boolean }) => {
      restoreFocusRef.current = options?.focusTrigger !== false;
      handleOpenChange(false);
    },
    [handleOpenChange],
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

  useEffect(() => {
    if (!rootContext.open && isOpen) {
      handleOpenChange(false);
    }
  }, [rootContext.open, isOpen, handleOpenChange]);

  const contextValue = useMemo<DropdownMenuSubContextValue>(
    () => ({
      open: isOpen,
      onOpenChange: handleOpenChange,
      triggerId,
      contentId,
      modal: rootContext.modal,
      dir: rootContext.dir,
      closeOnSelect: rootContext.closeOnSelect,
      focusStrategy,
      setFocusStrategy,
      triggerRef,
      closeMenu,
      closeRootMenu: rootContext.closeMenu,
    }),
    [
      isOpen,
      handleOpenChange,
      triggerId,
      contentId,
      rootContext.modal,
      rootContext.dir,
      rootContext.closeOnSelect,
      rootContext.closeMenu,
      focusStrategy,
      setFocusStrategy,
      triggerRef,
      closeMenu,
    ],
  );

  return (
    <DropdownMenuSubContext.Provider value={contextValue}>
      {children}
    </DropdownMenuSubContext.Provider>
  );
};

DropdownMenuSub.displayName = 'DropdownMenuSub';
