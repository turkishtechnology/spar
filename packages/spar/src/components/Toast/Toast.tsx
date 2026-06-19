import { ElementType, FocusEvent, KeyboardEvent, MouseEvent, useMemo } from 'react';
import { ToastContext } from './hooks';
import type { ToastRootProps } from './types';

export const Toast = <T extends ElementType = 'div'>({
  as,
  toast,
  toaster,
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ref,
  ...props
}: ToastRootProps<T>) => {
  const Component = (as ?? 'div') as ElementType;
  const contextValue = useMemo(() => ({ toast, toaster }), [toast, toaster]);
  const role = toast.announcement === 'assertive' ? 'alert' : 'status';

  const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    toaster?.pause(toast.id);
    onMouseEnter?.(event);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    toaster?.resume(toast.id);
    onMouseLeave?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    toaster?.pause(toast.id);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    toaster?.resume(toast.id);
    onBlur?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      toaster?.dismiss(toast.id);
    }

    onKeyDown?.(event);
  };

  return (
    <ToastContext.Provider value={contextValue}>
      <Component
        {...props}
        ref={ref}
        role={role}
        aria-live={toast.announcement}
        tabIndex={props.tabIndex ?? 0}
        data-toast=''
        data-status={toast.status}
        data-type={toast.type}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {children}
      </Component>
    </ToastContext.Provider>
  );
};

Toast.displayName = 'Toast.Root';
