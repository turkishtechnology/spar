import type {
  CSSProperties,
  ElementType,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
} from 'react';
import type { PolymorphicProps } from '../../types';

/**
 * Render props provided to children function for Switch
 */
export interface SwitchRenderProps {
  /** Current checked state */
  checked: boolean;
  /** Function to programmatically set the checked state */
  setChecked: (checked: boolean) => void;
  /** Whether the switch is disabled */
  disabled: boolean;
  /** Whether the switch is read-only */
  readOnly: boolean;
  /** Whether the switch is required */
  required: boolean;
  /** Whether the switch is in an invalid/error state */
  isInvalid: boolean;
  /** Whether the switch is currently focused */
  isFocused: boolean;
  /** Whether the switch is currently hovered */
  isHovered: boolean;
  /** Whether the switch is currently being pressed */
  isPressed: boolean;
}

/**
 * Own props for Switch component
 */
export interface SwitchOwnProps {
  /** Controlled checked state. */
  checked?: boolean;
  /**
   * Default checked state for uncontrolled usage.
   * @defaultValue false
   */
  defaultChecked?: boolean;
  /** Callback fired when the checked state changes. */
  onChange?: (checked: boolean) => void;
  /**
   * Disabled state. When inside a `<Field>`, inherited automatically.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Required state for form validation. When inside a `<Field>`, inherited automatically.
   * @defaultValue false
   */
  required?: boolean;
  /**
   * Read-only state. When inside a `<Field>`, inherited automatically.
   * @defaultValue false
   */
  readOnly?: boolean;
  /**
   * Invalid/error state. When inside a `<Field>`, inherited automatically.
   * @defaultValue false
   */
  isInvalid?: boolean;
  /** Name attribute for form submission. */
  name?: string;
  /**
   * Value sent in form data when checked.
   * @defaultValue 'on'
   */
  value?: string;
  /** ID of the form this switch belongs to. */
  form?: string;
  /**
   * Auto-focus on mount.
   * @defaultValue false
   */
  autoFocus?: boolean;
  /** Children content or render function. */
  children?: ReactNode | ((state: SwitchRenderProps) => ReactNode);
}

/**
 * Props for Switch component
 */
export type SwitchProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  SwitchOwnProps
>;

/**
 * Props for useSwitch hook
 */
export interface UseSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

/**
 * Return type for useSwitch hook
 */
export interface UseSwitchReturn {
  checked: boolean;
  disabled: boolean;
  readOnly: boolean;
  isFocused: boolean;
  isHovered: boolean;
  isActive: boolean;
  setChecked: (checked: boolean) => void;
  switchProps: {
    role: 'switch';
    'aria-checked': boolean;
    'aria-disabled'?: boolean;
    'aria-readonly'?: boolean;
    'data-switch': '';
    'data-state': 'checked' | 'unchecked';
    'data-checked'?: '';
    'data-disabled'?: '';
    'data-readonly'?: '';
    'data-focus'?: '';
    'data-hover'?: '';
    'data-active'?: '';
    tabIndex: number;
    onKeyDown: (event: KeyboardEvent) => void;
    onClick: (event: MouseEvent) => void;
    onFocus: (event: FocusEvent) => void;
    onBlur: (event: FocusEvent) => void;
    onPointerEnter: (event: PointerEvent) => void;
    onPointerLeave: (event: PointerEvent) => void;
    onPointerDown: (event: PointerEvent) => void;
    onPointerUp: (event: PointerEvent) => void;
    onPointerCancel: (event: PointerEvent) => void;
  };
  hiddenInputProps: {
    type: 'checkbox';
    checked: boolean;
    onChange: () => void;
    tabIndex: -1;
    'aria-hidden': true;
    style: CSSProperties;
  };
}
