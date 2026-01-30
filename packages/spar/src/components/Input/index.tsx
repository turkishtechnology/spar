import { InputRoot } from './InputRoot';
import { InputField } from './InputField';
import { InputLabel } from './InputLabel';
import { InputDescription } from './InputDescription';
import { InputErrorMessage } from './InputErrorMessage';
import type { ElementType } from 'react';
import type { PolymorphicInputFieldProps } from './types';

// Simple usage component (no wrapper div).
const Input = <T extends ElementType = 'input'>(props: PolymorphicInputFieldProps<T>) => (
  <InputField {...props} />
);

export { Input, InputRoot, InputField, InputLabel, InputDescription, InputErrorMessage };

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
//    <Input placeholder='Enter text' />
//
// 2. Compound usage (advanced):
//    import { InputRoot, InputLabel, InputField, InputDescription } from '@spar/components';
//    <InputRoot>
//      <InputLabel>Username</InputLabel>
//      <InputField />
//      <InputDescription>Enter your username</InputDescription>
//    </InputRoot>
//
// 3. Named imports (tree-shakeable):
//    import { InputRoot, InputField } from '@spar/components';
//    <InputRoot><InputField /></InputRoot>
