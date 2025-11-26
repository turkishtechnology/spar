import React from 'react';
import { InputRoot } from './InputRoot';
import { InputField } from './InputField';
import { InputLabel } from './InputLabel';
import { InputDescription } from './InputDescription';
import { InputErrorMessage } from './InputErrorMessage';
import type { PolymorphicInputFieldProps } from './types';

// Create callable compound component with default behavior
const Input = Object.assign(
  // Default function behavior for simple usage (no wrapper div!)
  <T extends React.ElementType = 'input'>(props: PolymorphicInputFieldProps<T>) => (
    <InputField {...props} />
  ),
  // Compound component methods
  {
    Root: InputRoot,
    Field: InputField,
    Label: InputLabel,
    Description: InputDescription,
    ErrorMessage: InputErrorMessage,
  },
);

// Export both patterns
export {
  // Callable compound component (supports both simple and compound usage)
  Input,

  // Named exports (tree-shakeable)
  InputField,
  InputLabel,
  InputDescription,
  InputErrorMessage,

  // Root alias for explicit usage
  InputRoot,
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
// 1. Simple usage (most common):
//    import { Input } from '@spar/components';
//    <Input placeholder="Enter text" />
//
// 2. Compound usage (advanced):
//    import { Input } from '@spar/components';
//    <Input.Root>
//      <Input.Label>Username</Input.Label>
//      <Input.Field />
//      <Input.Description>Enter your username</Input.Description>
//    </Input.Root>
//
// 3. Named imports (tree-shakeable):
//    import { InputRoot, InputField } from '@spar/components';
//    <InputRoot><InputField /></InputRoot>,
