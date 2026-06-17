import type { ElementType, MouseEvent, KeyboardEvent, RefObject } from 'react';
import type { PolymorphicProps } from '../../types';

export type PressEvent = MouseEvent | KeyboardEvent;

/**
 * Event handler types for breadcrumb navigation
 */
export type NavigationHandler = (href: string, event: PressEvent) => void;

/**
 * Position of breadcrumb item in the trail
 */
export type BreadcrumbPosition = 'first' | 'middle' | 'last';

/**
 * Render props provided to BreadcrumbItem children function
 */
export interface BreadcrumbItemRenderProps {
  /**
   * Position of this item in the breadcrumb trail
   */
  position: BreadcrumbPosition;
  /**
   * Whether this item represents the current page
   */
  isCurrent: boolean;
  /**
   * Whether breadcrumb navigation is disabled (from root context)
   */
  isDisabled: boolean;
}

/**
 * Context value for breadcrumb component communication
 * @internal
 */
export interface BreadcrumbContextValue {
  disabled?: boolean;
  onNavigate?: NavigationHandler;
}

/**
 * Context value for breadcrumb list item registration. Items register their DOM
 * ref with the nearest list, which derives each item's position from DOM order.
 * @internal
 */
export interface BreadcrumbListContextValue {
  registerItem: (id: string, ref: RefObject<HTMLElement | null>) => void;
  unregisterItem: (id: string) => void;
  getItemPosition: (id: string) => { position: BreadcrumbPosition; isCurrent: boolean };
}

/**
 * Own props for Breadcrumb
 */
export interface BreadcrumbOwnProps {
  /**
   * Navigation event handler for routing integration
   * @param href - The link destination
   * @param event - The triggering mouse or keyboard event
   */
  onNavigate?: NavigationHandler;
  /**
   * Disable all breadcrumb navigation
   * @defaultValue false
   */
  disabled?: boolean;
}

/**
 * Props for Breadcrumb
 * @remarks Navigation landmark container for breadcrumb trail
 */
export type BreadcrumbProps<T extends ElementType = 'nav'> = PolymorphicProps<
  'nav',
  T,
  BreadcrumbOwnProps
>;

/**
 * Props for BreadcrumbList
 * @remarks Ordered list container for breadcrumb items
 */
export type BreadcrumbListProps<T extends ElementType = 'ol'> = PolymorphicProps<'ol', T>;

/**
 * Own props for BreadcrumbItem
 */
export interface BreadcrumbItemOwnProps {
  /**
   * Item content (Link or Page), or a render function receiving item state
   */
  children?: React.ReactNode | ((props: BreadcrumbItemRenderProps) => React.ReactNode);
}

/**
 * Props for BreadcrumbItem
 * @remarks List item wrapper for breadcrumb content
 */
export type BreadcrumbItemProps<T extends ElementType = 'li'> = PolymorphicProps<
  'li',
  T,
  BreadcrumbItemOwnProps
>;

/**
 * Own props for BreadcrumbLink
 */
export interface BreadcrumbLinkOwnProps {
  /**
   * Link destination
   */
  href?: string;
  /**
   * Disable this specific link
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Indicates external link (adds security attributes)
   * @defaultValue false
   */
  isExternal?: boolean;
  /**
   * Press event handler (overrides default navigation)
   * @param event - The triggering mouse or keyboard event
   */
  onPress?: (event: PressEvent) => void;
}

/**
 * Props for BreadcrumbLink
 * @remarks Interactive link for navigation
 */
export type BreadcrumbLinkProps<T extends ElementType = 'a'> = PolymorphicProps<
  'a',
  T,
  BreadcrumbLinkOwnProps
>;

/**
 * Props for BreadcrumbPage
 * @remarks Current page indicator (non-interactive)
 */
export type BreadcrumbPageProps<T extends ElementType = 'span'> = PolymorphicProps<'span', T>;

/**
 * Props for BreadcrumbSeparator
 * @remarks Visual separator between breadcrumb items
 */
export type BreadcrumbSeparatorProps<T extends ElementType = 'li'> = PolymorphicProps<'li', T>;
