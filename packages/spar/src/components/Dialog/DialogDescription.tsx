import { ElementType } from 'react';
import { useDialogContext } from './hooks';
import type { DialogDescriptionProps } from './types';

/**
 * Dialog description component that provides additional context for the dialog.
 * Automatically associates with the dialog via aria-describedby.
 */
export const DialogDescription = <T extends ElementType = 'p'>({
  as,
  ref,
  children,
  ...props
}: DialogDescriptionProps<T>) => {
  const Component = as || 'p';
  const context = useDialogContext();
  const { descriptionId } = context;

  return (
    <Component ref={ref} id={descriptionId} {...props}>
      {children}
    </Component>
  );
};

DialogDescription.displayName = 'DialogDescription';
