import { useDialogContext } from './DialogRoot';
import type { DialogTitleProps } from './types';

/**
 * Dialog title component that provides the accessible name for the dialog.
 * Automatically associates with the dialog via aria-labelledby.
 */
export const DialogTitle = ({
  as: Component = 'h2',
  level = 2,
  ref,
  children,
  ...props
}: DialogTitleProps) => {
  const context = useDialogContext();
  const { titleId } = context;

  return (
    <Component ref={ref} id={titleId} data-level={level?.toString()} {...props}>
      {children}
    </Component>
  );
};

DialogTitle.displayName = 'DialogTitle';
