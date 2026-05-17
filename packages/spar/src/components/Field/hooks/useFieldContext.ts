import { createContext, useContext } from 'react';
import type { FieldContextValue } from '../types';

export const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Read the nearest Field context. Throws when used outside a `<Field>`.
 * For compound children that **require** a Field ancestor (Label, Description, ErrorMessage).
 */
export const useFieldContext = () => {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error('Field compound components must be used within Field');
  }
  return context;
};

/**
 * Optionally read the nearest Field context. Returns `null` when no Field
 * ancestor is present, allowing form controls (Switch, Checkbox, etc.) to
 * work both standalone and inside a Field.
 */
export const useOptionalFieldContext = () => useContext(FieldContext);
