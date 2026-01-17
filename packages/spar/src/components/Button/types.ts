import type { ComponentProps, ElementType } from 'react';

/**
 * Props for Button component
 * @remarks Fully accessible, headless component
 */
export interface ButtonProps extends ComponentProps<'button'> {
  /**
   * The element type to render as
   * @defaultValue "button"
   */
  as?: ElementType;

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
}
