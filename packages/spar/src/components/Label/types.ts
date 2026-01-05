import type { ElementType } from 'react';

/**
 * Props for Label component
 * @remarks Fully accessible, headless label component for form controls
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Marks label for a required field (exposed via data attribute for styling)
   * @remarks Does NOT add required functionality - set `required` on the control itself
   * @defaultValue false
   */
  required?: boolean;

  /**
   * Marks label for an optional field (exposed via data attribute for styling)
   * @defaultValue false
   */
  isOptional?: boolean;

  /**
   * Marks label for a disabled field (exposed via data attribute for styling)
   * @remarks Does NOT disable the control - set `disabled` on the control itself
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Polymorphic element type to render as
   * @remarks Using non-label elements breaks native association - use aria-labelledby on control
   * @defaultValue 'label'
   */
  as?: ElementType;
}
