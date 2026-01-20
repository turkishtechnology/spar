import type { ElementType, JSXElementConstructor } from 'react';

/**
 * Type for the `as` prop allowing polymorphic component rendering
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PolymorphicAs = ElementType | JSXElementConstructor<any>;

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

/**
 * Text direction for internationalization and layout
 */
export type Direction = 'ltr' | 'rtl';
