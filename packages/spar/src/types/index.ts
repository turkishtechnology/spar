import type { ComponentPropsWithRef, ElementType } from 'react';

/**
 * Utility for polymorphic component props that merges the `as` element props.
 * Accepts properties from both the default element and the polymorphic element.
 */
export type PolymorphicProps<
  TDefaultElement extends ElementType,
  TElement extends ElementType,
  Props = {},
> = Props & {
  /**
   * Polymorphic element type to render as.
   */
  as?: TElement;
} & Omit<ComponentPropsWithRef<TDefaultElement>, keyof Props | 'as'> &
  Omit<ComponentPropsWithRef<TElement>, keyof Props | 'as'>;

/**
 * Possible checked states for checkbox-like components
 */
export type CheckedState = boolean | 'indeterminate';

/**
 * Orientation for component layout and keyboard navigation
 */
export type Orientation = 'vertical' | 'horizontal';

/**
 * Placement side for positioned elements (popovers, menus, etc.)
 */
export type Side = 'top' | 'right' | 'bottom' | 'left';

/**
 * Alignment relative to reference element
 */
export type Align = 'start' | 'center' | 'end';
