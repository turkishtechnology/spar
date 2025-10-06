import type { ElementType } from 'react';

/**
 * Props for Label component
 * @remarks Fully accessible, headless label component for form controls
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * ID of the associated form control (explicit association)
   * @remarks Creates programmatic relationship via native `for` attribute
   */
  htmlFor?: string;

  /**
   * Marks label for a required field (exposed via data attribute for styling)
   * @remarks Does NOT add required functionality - set `required` on the control itself
   * @defaultValue false
   */
  isRequired?: boolean;

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
  isDisabled?: boolean;

  /**
   * Polymorphic element type to render as
   * @remarks Using non-label elements breaks native association - use aria-labelledby on control
   * @defaultValue 'label'
   */
  as?: ElementType;

  /**
   * Label content (text, icons, or form controls for implicit association)
   */
  children?: React.ReactNode;

  /**
   * CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: React.CSSProperties;

  /**
   * Ref forwarded to root element
   */
  ref?: React.Ref<HTMLLabelElement>;
}
