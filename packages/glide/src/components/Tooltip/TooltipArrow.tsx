import React from 'react';
import type { TooltipArrowProps } from './types';
import { useTooltip } from './useTooltip';

/**
 * Optional arrow pointing to the trigger element
 */
export const TooltipArrow = ({
  width = 10,
  height = 5,
  as: Component = 'svg',
  style,
  ...props
}: TooltipArrowProps) => {
  const context = useTooltip();

  // Ref callback to attach arrow ref
  const refCallback = (node: HTMLElement | SVGSVGElement | null) => {
    context.arrowRef.current = node;
  };

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
