import {
  createContext,
  useContext,
  useState,
  useCallback,
  useId,
  useEffect,
  type ElementType,
} from 'react';
import type {
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbContextValue,
  ItemPosition,
} from './types';

// Create breadcrumb context
const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

// Hook to use breadcrumb context
const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  return context || {};
};

/**
 * Root breadcrumb container providing navigation landmark and context
 */
export const BreadcrumbRoot = <T extends ElementType = 'nav'>({
  as,
  children,
  onNavigate,
  isDisabled = false,
  'aria-label': ariaLabel = 'Breadcrumb',
  ref,
  ...props
}: BreadcrumbRootProps<T>) => {
  const Component = as || 'nav';
  const [items, setItems] = useState<Set<string>>(new Set());

  const registerItem = useCallback((id: string) => {
    setItems((prev) => new Set(prev).add(id));
  }, []);

  const unregisterItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const contextValue: BreadcrumbContextValue = {
    isDisabled,
    ...(onNavigate && { onNavigate }),
    itemCount: items.size,
    registerItem,
    unregisterItem,
  };

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      <Component
        ref={ref}
        role='navigation'
        aria-label={ariaLabel}
        aria-disabled={isDisabled ? 'true' : undefined}
        data-glide-breadcrumb-root=''
        data-disabled={isDisabled ? 'true' : undefined}
        {...props}
      >
        {children}
      </Component>
    </BreadcrumbContext.Provider>
  );
};

BreadcrumbRoot.displayName = 'BreadcrumbRoot';

/**
 * Ordered list container for breadcrumb items
 */
export const BreadcrumbList = <T extends ElementType = 'ol'>({
  as,
  children,
  ref,
  ...props
}: BreadcrumbListProps<T>) => {
  const Component = as || 'ol';

  return (
    <Component ref={ref} data-glide-breadcrumb-list='' {...props}>
      {children}
    </Component>
  );
};

BreadcrumbList.displayName = 'BreadcrumbList';

/**
 * Individual breadcrumb item container with position tracking
 */
export const BreadcrumbItem = <T extends ElementType = 'li'>({
  as,
  children,
  ref,
  ...props
}: BreadcrumbItemProps<T>) => {
  const Component = as || 'li';
  const { registerItem, unregisterItem, itemCount = 0 } = useBreadcrumb();
  const id = useId();

  // Calculate position (simplified - in a real implementation, this would be more sophisticated)
  const position: ItemPosition = itemCount === 1 ? 'first' : itemCount === 0 ? 'last' : 'middle';

  // Register/unregister item for position tracking
  useEffect(() => {
    registerItem?.(id);
    return () => unregisterItem?.(id);
  }, [registerItem, unregisterItem, id]);

  return (
    <Component ref={ref} data-glide-breadcrumb-item='' data-position={position} {...props}>
      {children}
    </Component>
  );
};

BreadcrumbItem.displayName = 'BreadcrumbItem';

/**
 * Interactive breadcrumb link with navigation, disabled, and external link support
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
  ref,
  onClick,
  onKeyDown,
  ...props
}: BreadcrumbLinkProps<T>) => {
  const Component = as || 'a';
  const { isDisabled: contextDisabled, onNavigate } = useBreadcrumb();
  const isDisabled = disabled || contextDisabled;

  // Handle click events
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }

    // Call original onClick first if provided
    onClick?.(event);

    // If there's a custom onClick, don't proceed with navigation
    if (onClick) {
      return;
    }

    // Call custom onPress handler if provided
    if (onPress) {
      onPress(event);
      return;
    }

    // Call navigation handler only for internal links
    if (onNavigate && href && !isExternal) {
      event.preventDefault();
      onNavigate(href, event);
      return;
    }
  };

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (isDisabled) {
      return;
    }

    // Handle Enter and Space for accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (onPress) {
        onPress(event);
        return;
      }

      if (onNavigate && href) {
        onNavigate(href, event);
        return;
      }
    }

    onKeyDown?.(event);
  };

  // Determine attributes based on props
  const linkProps = {
    href: isDisabled ? undefined : href,
    target: isExternal ? target || '_blank' : target,
    rel: isExternal ? rel || 'noopener noreferrer' : rel,
    tabIndex: disabled ? -1 : undefined,
    'aria-disabled': isDisabled ? true : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  };

  return (
    <Component
      ref={ref}
      data-glide-breadcrumb-link=''
      data-disabled={disabled ? 'true' : undefined}
      data-external={isExternal ? 'true' : undefined}
      {...linkProps}
      {...props}
    >
      {children}
    </Component>
  );
};

BreadcrumbLink.displayName = 'BreadcrumbLink';

/**
 * Current page indicator (non-interactive)
 */
export const BreadcrumbPage = <T extends ElementType = 'span'>({
  as,
  children,
  ref,
  ...props
}: BreadcrumbPageProps<T>) => {
  const Component = as || 'span';

  return (
    <Component
      ref={ref}
      aria-current='page'
      data-glide-breadcrumb-page=''
      data-current='true'
      {...props}
    >
      {children}
    </Component>
  );
};

BreadcrumbPage.displayName = 'BreadcrumbPage';

/**
 * Visual separator between breadcrumb items
 */
export const BreadcrumbSeparator = <T extends ElementType = 'span'>({
  as,
  children,
  'aria-hidden': ariaHidden = true,
  ref,
  ...props
}: BreadcrumbSeparatorProps<T>) => {
  const Component = as || 'span';

  return (
    <Component
      ref={ref}
      aria-hidden={ariaHidden ? 'true' : undefined}
      data-glide-breadcrumb-separator=''
      {...props}
    >
      {children}
    </Component>
  );
};

BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
