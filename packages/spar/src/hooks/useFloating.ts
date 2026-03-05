import { useMemo, type CSSProperties } from 'react';
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

const OPPOSITE_SIDE: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
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
   * Ready-to-use CSS styles for the floating element.
   * Includes position, transform and top/left coordinates.
   * Before the first measurement completes the element is kept off-screen
   * via `translate(0, -200%)` to prevent a flash of incorrect position.
   */
  floatingStyles: CSSProperties;

  /**
   * Ready-to-use CSS styles for the arrow element.
   * Includes absolute positioning, left/top offset, edge anchoring and
   * the translate that moves the arrow outside the content boundary.
   * Only meaningful when an arrowRef is provided.
   */
  arrowStyles: CSSProperties;

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
    strategy: 'fixed',
    placement,
    middleware,
    whileElementsMounted: autoUpdate,
  });

  // Keep the element off-screen until the first measurement is done to
  // prevent a flash of incorrect position (same approach as Radix UI).
  const floatingStyles: CSSProperties = {
    ...floating.floatingStyles,
    transform: floating.isPositioned ? floating.floatingStyles.transform : 'translate(0, -200%)',
  };

  // Compute arrow styles from middleware data + placement.
  const arrowStyles = useMemo<CSSProperties>(() => {
    const placedSide = floating.placement.split('-')[0] as Side;
    const baseSide = OPPOSITE_SIDE[placedSide];
    const arrowData = floating.middlewareData.arrow;
    const shouldHide = (arrowData?.centerOffset ?? 0) !== 0;
    return {
      position: 'absolute',
      ...(arrowData?.x !== undefined && { left: `${arrowData.x}px` }),
      ...(arrowData?.y !== undefined && { top: `${arrowData.y}px` }),
      [baseSide]: '0px',
      transformOrigin: {
        top: '',
        right: '0 0',
        bottom: 'center 0',
        left: '100% 0',
      }[placedSide],
      transform: {
        top: 'translateY(100%)',
        right: 'translateY(50%) rotate(90deg) translateX(-50%)',
        bottom: `rotate(180deg)`,
        left: 'translateY(50%) rotate(-90deg) translateX(50%)',
      }[placedSide],
      ...(shouldHide && { visibility: 'hidden' as const }),
    };
  }, [floating.placement, floating.middlewareData.arrow]);

  return {
    x: floating.x,
    y: floating.y,
    floatingStyles,
    arrowStyles,
    placement: floating.placement,
    strategy: floating.strategy,
    refs: floating.refs,
    middlewareData: floating.middlewareData,
  };
};
