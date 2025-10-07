import type { InputDescriptionProps } from './types';
import { useInputContext } from './InputRoot';

/**
 * Input description component that provides helper text for the input field.
 * Automatically linked to the input field via aria-describedby.
 */
export const InputDescription = ({ children, ref, ...props }: InputDescriptionProps) => {
  const context = useInputContext();

  return (
    <div {...props} ref={ref} id={context.descriptionId} data-glide-input-description>
      {children}
    </div>
  );
};

InputDescription.displayName = 'Input.Description';
