import { Input as InputRoot } from './Input';
import { InputField } from './InputField';
import { InputLabel } from './InputLabel';
import { InputDescription } from './InputDescription';
import { InputErrorMessage } from './InputErrorMessage';
export { useInputContext } from './hooks';

const Input = InputRoot as typeof InputRoot & {
  Root: typeof InputRoot;
  Field: typeof InputField;
  Label: typeof InputLabel;
  Description: typeof InputDescription;
  ErrorMessage: typeof InputErrorMessage;
};

Input.Root = InputRoot;
Input.Field = InputField;
Input.Label = InputLabel;
Input.Description = InputDescription;
Input.ErrorMessage = InputErrorMessage;

export { Input, InputRoot, InputField, InputLabel, InputDescription, InputErrorMessage };

export type {
  InputContextValue,
  InputOwnProps,
  InputProps,
  InputFieldOwnProps,
  InputFieldProps,
  InputLabelOwnProps,
  InputLabelProps,
  InputDescriptionOwnProps,
  InputDescriptionProps,
  InputErrorMessageOwnProps,
  InputErrorMessageProps,
} from './types';
