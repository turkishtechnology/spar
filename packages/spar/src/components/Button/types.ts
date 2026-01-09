import type {
  ElementType,
  ReactNode,
  MouseEventHandler,
  KeyboardEventHandler,
  ButtonHTMLAttributes,
  CSSProperties,
  Ref,
} from 'react';

/**
 * Props for Button component
 * @remarks Fully accessible, headless component
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The element type to render as
   * @defaultValue "button"
   */
  as?: ElementType;

  /**
   * Disabled state - properly announced to screen readers
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Whether the button should receive focus when first rendered
   * @defaultValue false
   */
  shouldAutoFocus?: boolean;

  /**
   * Loading state with screen reader support
   * @defaultValue false
   */
  isLoading?: boolean;

  /**
   * Toggle state - when defined, creates a toggle button
   * @defaultValue undefined
   */
  isPressed?: boolean;

  /**
   * Callback fired when toggle state changes
   */
  onPressedChange?: (pressed: boolean) => void;

  /**
   * Component content
   */
  children?: ReactNode;

  /**
   * Click event handler
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;

  /**
   * Keyboard event handler
   */
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;

  /**
   * CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Ref to the underlying element
   */
  ref?: Ref<HTMLElement>;
}
