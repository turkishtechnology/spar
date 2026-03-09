import type { ElementType } from 'react';
import { useBreadcrumbContext } from './hooks';
import type { BreadcrumbItemProps, BreadcrumbItemRenderProps } from './types';

/**
 * List item wrapper for breadcrumb content. Receives position from parent BreadcrumbList.
 */
export const BreadcrumbItem = <T extends ElementType = 'li'>({
  as,
  children,
  position = 'middle',
  isCurrent = false,
  ...domProps
}: BreadcrumbItemProps<T>) => {
  const Component = (as || 'li') as ElementType;
  const { disabled: rootIsDisabled } = useBreadcrumbContext();

  const renderProps: BreadcrumbItemRenderProps = {
    position,
    isCurrent,
    isDisabled: rootIsDisabled ?? false,
  };

  return (
    <Component {...domProps} data-position={position} data-current={isCurrent ? '' : undefined}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Component>
  );
};

BreadcrumbItem.displayName = 'BreadcrumbItem';
