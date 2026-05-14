import { Input as InputRoot } from './Input';
import { InputField } from './InputField';
export { useInputContext } from './hooks';

const Input = InputRoot as typeof InputRoot & {
  Root: typeof InputRoot;
  Field: typeof InputField;
};

Input.Root = InputRoot;
Input.Field = InputField;

export { Input, InputRoot, InputField };

export type {
  InputContextValue,
  InputOwnProps,
  InputProps,
  InputFieldOwnProps,
  InputFieldProps,
} from './types';
