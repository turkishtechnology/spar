import type { ElementType } from 'react';
import type { PolymorphicProps } from '../../types';

/**
 * Own props for Button component
 */
export interface ButtonOwnProps {
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
   * @param pressed - The new pressed state
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
