import { useEffect, useId, useLayoutEffect, useRef, type ElementType } from 'react';
import { useBreadcrumbContext, useBreadcrumbListContext } from './hooks';
import { useMergedRef } from '@/hooks';
import type { BreadcrumbItemProps, BreadcrumbItemRenderProps } from './types';

// Use layout effect on the client so item registration happens before the first
// paint — otherwise every item flashes `data-position="middle"` (and the last
// item un-current) for one frame until registration lands. On the server
// `useLayoutEffect` warns; fall back to a no-op (SSR has nothing to register).
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * List item wrapper for breadcrumb content. Registers with the nearest
 * BreadcrumbList and reads its computed position in the trail from that list.
 */
export const BreadcrumbItem = <T extends ElementType = 'li'>({
  as,
  children,
  ref,
  ...domProps
}: BreadcrumbItemProps<T>) => {
  const Component = (as || 'li') as ElementType;
  const { disabled: rootIsDisabled } = useBreadcrumbContext();
  const { registerItem, unregisterItem, getItemPosition } = useBreadcrumbListContext();

  const itemId = useId();
  const itemRef = useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRef(itemRef, ref);

  useIsomorphicLayoutEffect(() => {
    registerItem(itemId, itemRef);
    return () => unregisterItem(itemId);
  }, [itemId, registerItem, unregisterItem]);

  const { position, isCurrent } = getItemPosition(itemId);

  const renderProps: BreadcrumbItemRenderProps = {
    position,
    isCurrent,
    isDisabled: rootIsDisabled ?? false,
  };

  return (
    <Component
      {...domProps}
      ref={mergedRef}
      data-position={position}
      data-current={isCurrent ? '' : undefined}
    >
      {typeof children === 'function' ? children(renderProps) : children}
    </Component>
  );
};

BreadcrumbItem.displayName = 'BreadcrumbItem';
