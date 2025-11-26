import { useDialogContext } from './DialogRoot';
import type { DialogDescriptionProps } from './types';

/**
 * Dialog description component that provides additional context for the dialog.
 * Automatically associates with the dialog via aria-describedby.
 */
export const DialogDescription = ({
  as: Component = 'p',
  ref,
  children,
  ...props
}: DialogDescriptionProps) => {
  const context = useDialogContext();
  const { descriptionId } = context;

  return (
    <Component ref={ref} id={descriptionId} {...props}>
      {children}
    </Component>
  );
};

DialogDescription.displayName = 'DialogDescription';
