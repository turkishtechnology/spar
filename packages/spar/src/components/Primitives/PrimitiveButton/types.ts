import { PolymorphicAs } from '@/types';
import type { ElementType, ComponentPropsWithRef } from 'react';

/**
 * Base props for the primitive Button component
 */
interface BasePrimitiveButtonProps {
  /**
   * The element type to render as
   * @defaultValue "button"
   * @example
   * ```tsx
   * // Render as button (default)
   * <PrimitiveButton>Click me</PrimitiveButton>
   *
   * // Render as div with button role
   * <PrimitiveButton as="div">Click me</PrimitiveButton>
   *
   * // Render as custom component
   * <PrimitiveButton as={CustomLink}>Click me</PrimitiveButton>
   * ```
   */
  as?: PolymorphicAs;

  /**
   * Whether the button should receive focus when first rendered
   * @defaultValue false
   * @example
   * ```tsx
   * <PrimitiveButton shouldAutoFocus>
   *   Auto-focused button
   * </PrimitiveButton>
   * ```
   */
  shouldAutoFocus?: boolean;
}

/**
 * Props for the primitive Button component with polymorphic typing
 * @remarks
 * Internal headless button primitive that provides:
 * - Polymorphic rendering (via `as` prop)
 * - Ref forwarding and merging
 * - Disabled state management
 * - Auto-focus behavior
 * - Proper accessibility attributes
 *
 * @example
 * ```tsx
 * // Basic usage
 * <PrimitiveButton onClick={handleClick}>
 *   Click me
 * </PrimitiveButton>
 *
 * // With disabled state
 * <PrimitiveButton disabled>
 *   Disabled button
 * </PrimitiveButton>
 *
 * // Render as different element
 * <PrimitiveButton as="div" role="button">
 *   Div styled as button
 * </PrimitiveButton>
 * ```
 *
 * @internal
 */
export type PrimitiveButtonProps<T extends ElementType = 'button'> = BasePrimitiveButtonProps &
  Omit<ComponentPropsWithRef<T>, keyof BasePrimitiveButtonProps>;
