import type { ComponentProps, ElementType } from 'react';
import type { Orientation } from '../../types';

/**
 * Props for RadioGroup component
 * @remarks Fully accessible, headless radio group component
 */
export interface RadioGroupProps extends Omit<ComponentProps<'div'>, 'onChange'> {
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
   * Polymorphic root element
   * @defaultValue 'div'
   */
  as?: ElementType;
}

/**
 * Props for RadioItem component
 * @remarks Individual radio option within a RadioGroup
 */
export interface RadioItemProps extends Omit<ComponentProps<'label'>, 'onChange'> {
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
   * Polymorphic root element
   * @defaultValue 'label'
   */
  as?: ElementType;
}

/**
 * Internal context interface for RadioGroup
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
