import { ElementType } from 'react';
import { useDialogContext } from './hooks';
import type { DialogTitleProps } from './types';

/**
 * Dialog title component that provides the accessible name for the dialog.
 * Automatically associates with the dialog via aria-labelledby.
 */
export const DialogTitle = <T extends ElementType = 'h2'>({
  as,
  level = 2,
  ref,
  children,
  ...props
}: DialogTitleProps<T>) => {
  const Component = as || (`h${level}` as ElementType);
  const context = useDialogContext();
  const { titleId } = context;

  return (
    <Component ref={ref} id={titleId} data-level={level} {...props}>
      {children}
    </Component>
  );
};

DialogTitle.displayName = 'DialogTitle';
