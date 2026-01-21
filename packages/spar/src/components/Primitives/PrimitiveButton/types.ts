import type { ComponentProps, ElementType } from 'react';

/**
 * Props for the primitive Button component
 * @remarks Fully accessible, headless button primitive
 */
export interface PrimitiveButtonProps extends ComponentProps<'button'> {
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
}
