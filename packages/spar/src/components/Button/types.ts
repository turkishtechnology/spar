import type { ElementType } from 'react';
import type { PolymorphicProps } from '../../types';

/**
 * Own props for Button component
 */
export interface ButtonOwnProps {
  /**
   * Whether the button should receive focus when first rendered
   * @defaultValue false
   */
  autoFocus?: boolean;

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

/**
 * Props for Button component
 * @remarks Fully accessible, headless component
 */
export type ButtonProps<T extends ElementType = 'button'> = PolymorphicProps<
  'button',
  T,
  ButtonOwnProps
>;
