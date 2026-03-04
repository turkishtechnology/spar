import { useMemo } from 'react';
import {
  useFloating as useFloatingUI,
  autoUpdate,
  arrow,
  offset,
  flip,
  shift,
  hide,
  type Placement,
  type Strategy,
} from '@floating-ui/react-dom';
import type { Side, Align } from '../types';

/**
 * Convert side and align to Floating UI placement.
 */
const getPlacement = (side: Side, align: Align): Placement => {
  if (align === 'center') {
    return side as Placement;
  }
  return `${side}-${align}` as Placement;
};

export interface UseFloatingOptions {
  /**
   * The preferred side of the floating element.
   * @default 'bottom'
   */
  side?: Side;

  /**
   * The preferred alignment of the floating element.
   * @default 'center'
   */
  align?: Align;

  /**
   * Arrow element for positioning.
   */
  arrowRef?: Element | null;
}

export interface UseFloatingReturn {
  /**
   * The x-coordinate for positioning.
   */
  x: number | null;

  /**
   * The y-coordinate for positioning.
   */
  y: number | null;

  /**
   * Computed placement string combining side and align.
   */
  placement: Placement;

  /**
   * The positioning strategy.
   */
  strategy: Strategy;

  /**
   * Refs for reference and floating elements.
   */
  refs: ReturnType<typeof useFloatingUI>['refs'];

  /**
   * Middleware data from positioning calculations.
   */
  middlewareData: ReturnType<typeof useFloatingUI>['middlewareData'];
}

/**
 * Hook for positioning floating elements using Floating UI.
 *
 * @example
 * ```tsx
 * const { x, y, placement, strategy, refs } = useFloating({
 *   side: 'bottom',
 *   align: 'center',
 * });
 * ```
 */
export const useFloating = (options: UseFloatingOptions = {}): UseFloatingReturn => {
  const { side = 'bottom', align = 'center', arrowRef } = options;

  const placement = useMemo(() => getPlacement(side, align), [side, align]);

  const middleware = useMemo(() => {
    const middlewares = [
      // Offset from reference element
      offset(8),
      // Flip to opposite side when no space
      flip(),
      // Shift to stay in view
      shift({ padding: 8 }),
      // Hide when reference is not visible
      hide(),
    ];

    // Arrow positioning
    if (arrowRef) {
      middlewares.push(arrow({ element: arrowRef }));
    }

    return middlewares;
  }, [arrowRef]);

  const floating = useFloatingUI({
    placement,
    middleware,
    whileElementsMounted: autoUpdate,
  });

  return {
    x: floating.x,
    y: floating.y,
    placement: floating.placement,
    strategy: floating.strategy,
    refs: floating.refs,
    middlewareData: floating.middlewareData,
  };
};
