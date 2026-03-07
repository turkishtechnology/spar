import { type CSSProperties, type ElementType, type Ref } from 'react';
import { useMergedRef } from '@/hooks';
import { getPlacement } from '@/utils/getPlacement';
import type { Align, PolymorphicProps, Side } from '@/types';

/**
 * Context shape required by arrow components.
 * Both root and content contexts must expose these values.
 */
export interface ArrowRootContext {
  arrowRef: React.RefObject<Element | null>;
}

export interface ArrowContentContext {
  arrowStyles: CSSProperties;
  side: Side;
  align: Align;
}

/**
 * Shared polymorphic props type for all floating arrow components.
 */
export type FloatingArrowProps<T extends ElementType = 'svg'> = PolymorphicProps<'svg', T>;

interface CreateArrowComponentOptions {
  displayName: string;
  useRootContext: () => ArrowRootContext;
  useContentContext: () => ArrowContentContext;
}

/**
 * Factory that creates a headless, polymorphic arrow component.
 *
 * Eliminates duplication across Popover, Select, Tooltip, and DropdownMenu
 * arrow implementations. Each component only needs to supply its own context
 * hooks; all rendering logic is shared.
 *
 * When the default `svg` element is used, sensible SVG defaults (viewBox,
 * width, height, polygon) are applied. When rendered as another element via
 * the `as` prop, SVG-specific attributes are omitted.
 */
export const createArrowComponent = ({
  displayName,
  useRootContext,
  useContentContext,
}: CreateArrowComponentOptions) => {
  const ArrowComponent = <T extends ElementType = 'svg'>({
    as,
    ref,
    style,
    children,
    ...props
  }: FloatingArrowProps<T>) => {
    const Component = as || 'svg';
    const { arrowRef } = useRootContext();
    const { arrowStyles, side, align } = useContentContext();
    const mergedRef = useMergedRef(arrowRef, ref as Ref<Element | null>);
    const placement = getPlacement(side, align);
    const isSvg = Component === 'svg';

    return (
      <Component
        ref={mergedRef}
        aria-hidden='true'
        data-placement={placement}
        {...(isSvg ? { width: 10, height: 5, viewBox: '0 0 10 5' } : {})}
        style={{ ...arrowStyles, ...style }}
        {...props}
      >
        {children ?? (isSvg ? <polygon points='0,0 5,5 10,0' fill='currentColor' /> : null)}
      </Component>
    );
  };

  ArrowComponent.displayName = displayName;

  return ArrowComponent;
};
