import * as React from 'react';

export type Orientation = 'horizontal' | 'vertical';

/**
 * Props for RadioGroup component
 * @remarks Fully accessible, headless radio group component
 */
export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
   * Accessible name for the group
   */
  'aria-label'?: React.AriaAttributes['aria-label'];

  /**
   * References element that labels the group
   */
  'aria-labelledby'?: React.AriaAttributes['aria-labelledby'];

  /**
   * References element that describes the group
   */
  'aria-describedby'?: React.AriaAttributes['aria-describedby'];

  /**
   * Polymorphic root element
   * @defaultValue 'div'
   */
  as?: React.ElementType;

  /**
   * Radio.Item components
   */
  children?: React.ReactNode;
}

/**
 * Props for RadioItem component
 * @remarks Individual radio option within a RadioGroup
 */
export interface RadioItemProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
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
   * Accessible name when children insufficient
   */
  'aria-label'?: React.AriaAttributes['aria-label'];

  /**
   * References element that describes this item
   */
  'aria-describedby'?: React.AriaAttributes['aria-describedby'];

  /**
   * Polymorphic root element
   * @defaultValue 'label'
   */
  as?: React.ElementType;

  /**
   * Label content for the radio item
   */
  children?: React.ReactNode;
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
  getItems: () => string[];
}
