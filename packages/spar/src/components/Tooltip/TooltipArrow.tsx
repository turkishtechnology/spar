import React, { useCallback, type ElementType } from 'react';
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
  ...props
}: TooltipArrowProps<T>) => {
  const Component = as || 'svg';
  const context = useTooltip();

  // Ref callback to attach arrow ref
  const refCallback = useCallback(
    (node: HTMLElement | SVGSVGElement | null) => {
      context.arrowRef.current = node;
    },
    [context.arrowRef],
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

  return React.createElement(Component, arrowProps);
};

TooltipArrow.displayName = 'TooltipArrow';
