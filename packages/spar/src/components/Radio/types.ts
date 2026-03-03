import type { ElementType, ReactNode } from 'react';
import type { Orientation, PolymorphicProps } from '../../types';

/**
 * Own props for RadioGroup component
 */
export interface RadioGroupOwnProps {
  /**
   * Custom base ID used for generating the form `name` attribute.
   * If not provided, one will be generated automatically.
   */
  id?: string;

  /**
   * Controlled value of selected radio item
   */
  value?: string;

  /**
   * Uncontrolled default selected value
   */
  defaultValue?: string;

  /**
   * Callback when selection changes
   * @param value - The new selected value
   */
  onValueChange?: (value: string) => void;

  /**
   * HTML name attribute for form submission
   */
  name?: string;

  /**
   * Disables entire radio group
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Marks group as required for form validation
   * @defaultValue false
   */
  required?: boolean;

  /**
   * Layout direction affecting keyboard navigation
   * @defaultValue 'vertical'
   */
  orientation?: Orientation;

  /**
   * Whether radio group is contained within a toolbar
   * Changes keyboard behavior per WAI-ARIA guidelines:
   * - false: Arrow keys move focus and select (standard behavior)
   * - true: Arrow keys only move focus, Space/Enter selects (toolbar behavior)
   * @defaultValue false
   */
  isInToolbar?: boolean;

  /**
   * Whether to focus the first focusable radio item on mount
   * @defaultValue false
   */
  autoFocus?: boolean;
}

/**
 * Props for RadioGroup component
 * @remarks Fully accessible, headless radio group component
 */
export type RadioGroupProps<T extends ElementType = 'div'> = PolymorphicProps<
  'div',
  T,
  RadioGroupOwnProps
>;

/**
 * Render props provided to children function for RadioItem
 */
export interface RadioItemRenderProps {
  /**
   * Whether this radio item is currently checked
   */
  isChecked: boolean;
  /**
   * Function to select this radio item
   */
  select: () => void;
  /**
   * Whether this radio item is disabled
   */
  disabled: boolean;
  /**
   * Whether this radio item is currently focused
   */
  isFocused: boolean;
}

/**
 * Own props for RadioItem component
 */
export interface RadioItemOwnProps {
  /**
   * Unique value for this radio item
   */
  value: string;

  /**
   * Disables this specific radio item
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Children content or render function
   */
  children?: ReactNode | ((state: RadioItemRenderProps) => ReactNode);
}

/**
 * Props for RadioItem component
 * @remarks Individual radio option within a RadioGroup
 */
export type RadioItemProps<T extends ElementType = 'label'> = PolymorphicProps<
  'label',
  T,
  RadioItemOwnProps
>;

/**
 * Internal context interface for RadioGroup
 * @internal
 */
export interface RadioGroupContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled: boolean;
  name: string;
  focusedValue: string | null;
  setFocusedValue: (value: string | null) => void;
  orientation: Orientation;
  isInToolbar: boolean;
  registerItem: (value: string) => void;
  unregisterItem: (value: string) => void;
}
