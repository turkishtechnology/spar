import { useCallback, useEffect, useMemo, useRef, useState, useId } from 'react';
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
  dir = 'ltr',
  closeOnSelect = true,
  children,
}: DropdownMenuProps) => {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? Boolean(open) : internalOpen;
  const triggerRef = useRef<HTMLElement | null>(null);
  const generatedId = useId();
  const baseId = providedId ?? generatedId;
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;
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

  const contextValue = useMemo<DropdownMenuContextValue>(
    () => ({
      open: isOpen,
      onOpenChange: handleOpenChange,
      triggerId,
      contentId,
      modal,
      disabled,
      dir,
      closeOnSelect,
      focusStrategy,
      setFocusStrategy,
      triggerRef,
      closeMenu,
    }),
    [
      isOpen,
      handleOpenChange,
      triggerId,
      contentId,
      modal,
      disabled,
      dir,
      closeOnSelect,
      focusStrategy,
      setFocusStrategy,
      triggerRef,
      closeMenu,
    ],
  );

  return (
    <DropdownMenuContext.Provider value={contextValue}>{children}</DropdownMenuContext.Provider>
  );
};

DropdownMenu.displayName = 'DropdownMenu';
