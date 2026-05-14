import { Field as FieldRoot } from './Field';
import { FieldLabel } from './FieldLabel';
import { FieldDescription } from './FieldDescription';
import { FieldErrorMessage } from './FieldErrorMessage';

export { useFieldContext, useOptionalFieldContext } from './hooks';

const Field = FieldRoot as typeof FieldRoot & {
  Root: typeof FieldRoot;
  Label: typeof FieldLabel;
  Description: typeof FieldDescription;
  ErrorMessage: typeof FieldErrorMessage;
};

Field.Root = FieldRoot;
Field.Label = FieldLabel;
Field.Description = FieldDescription;
Field.ErrorMessage = FieldErrorMessage;

export { Field, FieldRoot, FieldLabel, FieldDescription, FieldErrorMessage };

export type {
  FieldContextValue,
  FieldOwnProps,
  FieldProps,
  FieldLabelProps,
  FieldDescriptionProps,
  FieldErrorMessageProps,
} from './types';
