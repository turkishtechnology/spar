import { useCallback, useMemo } from 'react';

/**
 * Render props shape shared by all Close button components.
 */
export interface CloseButtonRenderProps {
  /** Whether the parent overlay is currently open */
  isOpen: boolean;
  /** Closes the parent overlay */
  close: () => void;
}

interface UseCloseButtonOptions {
  /** Whether the parent overlay is currently open */
  isOpen: boolean;
  /** Function that closes the parent overlay */
  close: () => void;
  /** Consumer-provided onClick handler to invoke after closing */
  onClick?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | undefined;
}

/**
 * Extracts the shared click-to-close logic used by every `*Close` component
 * (DialogClose, PopoverClose, and future overlays like Sheet, AlertDialog, etc.).
 *
 * Returns a stable `handleClick` callback and a memoized `renderProps` object with a
 * uniform `{ isOpen, close }` shape that can be forwarded to render-prop children.
 *
 * @example
 * ```tsx
 * const { isOpen, setIsOpen } = useDialogContext();
 * const { handleClick, renderProps } = useCloseButton({
 *   isOpen,
 *   close: () => setIsOpen(false),
 *   onClick,
 * });
 * ```
 */
export const useCloseButton = ({ isOpen, close, onClick }: UseCloseButtonOptions) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      close();
      onClick?.(event);
    },
    [close, onClick],
  );

  const renderProps = useMemo<CloseButtonRenderProps>(
    () => ({
      isOpen,
      close,
    }),
    [isOpen, close],
  );

  return { handleClick, renderProps } as const;
};
