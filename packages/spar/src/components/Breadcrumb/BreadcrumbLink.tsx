import { createElement, type MouseEvent, type KeyboardEvent } from 'react';
import { useBreadcrumb } from './BreadcrumbContext';
import type { BreadcrumbLinkProps } from './types';

/**
 * Interactive link for breadcrumb navigation. Handles routing integration and accessibility states.
 * @remarks Fully accessible, headless component
 */
export const BreadcrumbLink = ({
  as = 'a',
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
}: BreadcrumbLinkProps) => {
  const { disabled: rootDisabled, onNavigate } = useBreadcrumb();
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
    'data-spar-breadcrumb-link': '',
    'data-disabled': linkIsDisabled ? '' : undefined,
    'data-external': isExternal ? '' : undefined,
  };

  return createElement(as, linkProps, children);
};

BreadcrumbLink.displayName = 'BreadcrumbLink';
