import type { ElementType, ReactNode } from 'react';
import type { Orientation, PolymorphicProps } from '../../types';

/**
 * Own props for Radio component
 */
export interface RadioOwnProps {
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
   * Marks the group as invalid for ARIA wiring (`aria-invalid`). When nested
   * inside a `<Field>` with `invalid`, this is inherited automatically; a
   * direct prop on `<Radio>` always wins.
   * @defaultValue false
   */
  isInvalid?: boolean;

  /**
   * Layout direction affecting keyboard navigation
   * @defaultValue 'vertical'
   */
  orientation?: Orientation;

  /**
   * Whether arrow key navigation automatically selects the focused radio item
   * Changes keyboard behavior per WAI-ARIA guidelines:
   * - true: Arrow keys move focus and select (standard radio group behavior)
   * - false: Arrow keys only move focus, Space/Enter selects (toolbar behavior)
   * @defaultValue true
   */
  selectOnFocus?: boolean;

  /**
   * Whether to focus the first focusable radio item on mount
   * @defaultValue false
   */
  autoFocus?: boolean;
}

/**
 * Props for Radio component
 * @remarks Fully accessible, headless radio group component (renders `role="radiogroup"`).
 */
export type RadioProps<T extends ElementType = 'div'> = PolymorphicProps<'div', T, RadioOwnProps>;

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
 * @remarks Individual radio option within a Radio (radiogroup).
 */
export type RadioItemProps<T extends ElementType = 'label'> = PolymorphicProps<
  'label',
  T,
  RadioItemOwnProps
>;

/**
 * Internal context interface for Radio.
 * @internal
 */
export interface RadioContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled: boolean;
  required: boolean;
  name: string;
  firstFocusableValue: string | null;
  focusedValue: string | null;
  setFocusedValue: (value: string | null) => void;
  orientation: Orientation;
  selectOnFocus: boolean;
  registerItem: (value: string, element: HTMLElement, disabled: boolean) => void;
  unregisterItem: (value: string) => void;
}
