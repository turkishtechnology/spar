import type { ComponentProps, MouseEvent, KeyboardEvent } from 'react';
import type { PolymorphicAs } from '../../types';

/**
 * Event handler types for breadcrumb navigation
 */
export type NavigationHandler = (href: string, event: MouseEvent | KeyboardEvent) => void;
export type PressEvent = MouseEvent | KeyboardEvent;

/**
 * Position of breadcrumb item in the trail
 */
export type BreadcrumbPosition = 'first' | 'middle' | 'last';

/**
 * Context value for breadcrumb component communication
 */
export interface BreadcrumbContextValue {
  disabled?: boolean;
  onNavigate?: NavigationHandler;
}

/**
 * Props for Breadcrumb.Root
 * @remarks Navigation landmark container for breadcrumb trail
 */
export interface BreadcrumbRootProps extends ComponentProps<'nav'> {
  /**
   * Polymorphic element type
   * @defaultValue 'nav'
   */
  as?: PolymorphicAs;
  /**
   * Navigation event handler for routing integration
   */
  onNavigate?: NavigationHandler;
  /**
   * Disable all breadcrumb navigation
   * @defaultValue false
   */
  disabled?: boolean;
}

/**
 * Props for Breadcrumb.List
 * @remarks Ordered list container for breadcrumb items
 */
export interface BreadcrumbListProps extends ComponentProps<'ol'> {
  /**
   * Polymorphic element type
   * @defaultValue 'ol'
   */
  as?: PolymorphicAs;
}

/**
 * Props for Breadcrumb.Item
 * @remarks List item wrapper for breadcrumb content
 */
export interface BreadcrumbItemProps extends ComponentProps<'li'> {
  /**
   * Polymorphic element type
   * @defaultValue 'li'
   */
  as?: PolymorphicAs;
  /**
   * Position of this item in the breadcrumb trail
   * @internal Automatically calculated by BreadcrumbList
   */
  position?: BreadcrumbPosition;
  /**
   * Whether this is the current page (last item)
   * @internal Automatically calculated by BreadcrumbList
   */
  isCurrent?: boolean;
}

/**
 * Props for Breadcrumb.Link
 * @remarks Interactive link for navigation
 */
export interface BreadcrumbLinkProps extends ComponentProps<'a'> {
  /**
   * Polymorphic element type
   * @defaultValue 'a'
   */
  as?: PolymorphicAs;
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
   */
  onPress?: (event: PressEvent) => void;
}

/**
 * Props for Breadcrumb.Page
 * @remarks Current page indicator (non-interactive)
 */
export interface BreadcrumbPageProps extends ComponentProps<'span'> {
  /**
   * Polymorphic element type
   * @defaultValue 'span'
   */
  as?: PolymorphicAs;
}

/**
 * Props for Breadcrumb.Separator
 * @remarks Visual separator between breadcrumb items
 */
export interface BreadcrumbSeparatorProps extends ComponentProps<'li'> {
  /**
   * Polymorphic element type
   * @defaultValue 'li'
   */
  as?: PolymorphicAs;
}
