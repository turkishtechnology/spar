import { Input } from './Input';

// Aliased exports for grouped usage
const Root = Input.Root;
const Field = Input.Field;
const Label = Input.Label;
const Description = Input.Description;
const ErrorMessage = Input.ErrorMessage;

// Export both compound component AND aliases
export {
  // Compound component export (for direct imports)
  Input,

  // Aliased exports (for grouped pattern)
  Root,
  Field,
  Label,
  Description,
  ErrorMessage,
};

// Export types
export type {
  InputContextValue,
  InputRootProps,
  InputFieldProps,
  PolymorphicInputFieldProps,
  InputLabelProps,
  InputDescriptionProps,
  InputErrorMessageProps,
} from './types';

// Usage examples:
// Direct import: import { Input } from '@glide/components';
// Grouped import: import { Root, Field, Label } from '@glide/components/Input';
