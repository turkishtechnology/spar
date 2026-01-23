import type { PrimitiveButtonProps } from '../Primitives/PrimitiveButton/types';

/**
 * Props for Button component
 * @remarks Fully accessible, headless component
 */
export interface ButtonProps extends PrimitiveButtonProps {
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
