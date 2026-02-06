import React, { useCallback, useRef, type ElementType, createElement } from 'react';
import { useMergedRef } from '@/hooks';
import type { TooltipArrowProps } from './types';
import { useTooltip } from './useTooltip';

/**
 * Optional arrow pointing to the trigger element
 */
export const TooltipArrow = <T extends ElementType = 'svg'>({
  width = 10,
  height = 5,
  as,
  style,
  ref,
  ...props
}: TooltipArrowProps<T>) => {
  const Component = as || 'svg';
  const context = useTooltip();
  const internalRef = useRef<HTMLElement | SVGSVGElement>(null);
  const mergedRef = useMergedRef(
    internalRef as React.RefObject<HTMLElement | null>,
    ref as React.Ref<HTMLElement | null>,
  );

  // Ref callback to attach arrow ref and merge with external ref
  const refCallback = useCallback(
    (node: HTMLElement | SVGSVGElement | null) => {
      mergedRef(node as HTMLElement | null);
      context.arrowRef.current = node;
    },
    [mergedRef, context.arrowRef],
  );

  const arrowStyle = {
    ...style,
    position: 'absolute' as const,
  } as React.CSSProperties;

  if (Component === 'svg') {
    return (
      <svg
        {...props}
        ref={refCallback as React.Ref<SVGSVGElement>}
        width={width}
        height={height}
        style={arrowStyle}
        data-placement={context.placement}
        viewBox={`0 0 ${width} ${height}`}
      >
        <polygon points={`0,${height} ${width / 2},0 ${width},${height}`} />
      </svg>
    );
  }

  const arrowProps = {
    ...props,
    ref: refCallback,
    width,
    height,
    style: arrowStyle,
    'data-placement': context.placement,
  };

  return createElement(Component, arrowProps);
};

TooltipArrow.displayName = 'TooltipArrow';
