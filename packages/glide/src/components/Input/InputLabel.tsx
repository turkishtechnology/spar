import type { InputLabelProps } from './types';
import { useInputContext } from './InputRoot';

/**
 * Input label component that provides accessible labeling for the input field.
 * Automatically associates with the input field via ARIA.
 */
export const InputLabel = ({ children, ref, ...props }: InputLabelProps) => {
  const context = useInputContext();

  return (
    <label
      {...props}
      ref={ref}
      id={context.labelId}
      htmlFor={context.fieldId}
      data-glide-input-label
    >
      {children}
    </label>
  );
};

InputLabel.displayName = 'Input.Label';
