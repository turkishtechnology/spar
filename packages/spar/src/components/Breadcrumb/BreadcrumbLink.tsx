import type { MouseEvent, KeyboardEvent, ElementType } from 'react';
import { useBreadcrumbContext } from './hooks';
import type { BreadcrumbLinkProps } from './types';

/**
 * Interactive link for breadcrumb navigation. Handles routing integration and accessibility states.
 */
export const BreadcrumbLink = <T extends ElementType = 'a'>({
  as,
  children,
  href,
  disabled = false,
  isExternal = false,
  target,
  rel,
  onPress,
  onClick,
  onKeyDown,
  ...props
}: BreadcrumbLinkProps<T>) => {
  const Component = as || 'a';
  const { disabled: rootDisabled, onNavigate } = useBreadcrumbContext();
  const linkIsDisabled = disabled || rootDisabled;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (linkIsDisabled) {
      event.preventDefault();
      return;
    }

    if (onPress) {
      onPress(event);
      return;
    }

    if (onNavigate && href) {
      event.preventDefault();
      onNavigate(href, event);
      return;
    }

    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (linkIsDisabled) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      if (onPress) {
        event.preventDefault();
        onPress(event);
        return;
      }

      if (onNavigate && href) {
        event.preventDefault();
        onNavigate(href, event);
        return;
      }
    }

    onKeyDown?.(event);
  };

  const linkProps = {
    ...props,
    href: linkIsDisabled ? undefined : href,
    target: isExternal ? target || '_blank' : target,
    rel: isExternal ? rel || 'noopener noreferrer' : rel,
    'aria-disabled': linkIsDisabled || undefined,
    tabIndex: linkIsDisabled ? -1 : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    'data-disabled': linkIsDisabled ? '' : undefined,
    'data-external': isExternal ? '' : undefined,
  };

  return <Component {...linkProps}>{children}</Component>;
};

BreadcrumbLink.displayName = 'BreadcrumbLink';
