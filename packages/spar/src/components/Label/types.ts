import type { ElementType } from 'react';
import type { PolymorphicProps } from '../../types';

/**
 * Own props for Label component
 */
export interface LabelOwnProps {
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
   * Marks label for a read-only field (exposed via data attribute for styling)
   * @remarks Does NOT make the control read-only - set `readOnly` on the control itself
   * @defaultValue false
   */
  readOnly?: boolean;

  /**
   * Marks label for an invalid field (exposed via data attribute for styling)
   * @remarks Does NOT invalidate the control - set `aria-invalid` on the control itself
   * @defaultValue false
   */
  isInvalid?: boolean;
}

/**
 * Props for Label component
 * @remarks Fully accessible, headless label component for form controls
 */
export type LabelProps<T extends ElementType = 'label'> = PolymorphicProps<
  'label',
  T,
  LabelOwnProps
>;
