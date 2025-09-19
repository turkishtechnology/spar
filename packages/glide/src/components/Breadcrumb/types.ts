import { ElementType, ReactNode, MouseEvent, KeyboardEvent, ComponentPropsWithoutRef } from 'react';

// Event handler types
export type NavigationHandler = (href: string, event: MouseEvent | KeyboardEvent) => void;
export type PressEvent = MouseEvent | KeyboardEvent;

// Position type for item positioning
export type ItemPosition = 'first' | 'middle' | 'last';

// Context value type
export interface BreadcrumbContextValue {
  isDisabled?: boolean;
  onNavigate?: NavigationHandler;
  currentPath?: string;
  separator?: ReactNode;
  itemCount?: number;
  registerItem?: (id: string) => void;
  unregisterItem?: (id: string) => void;
}

/**
 * Props for Breadcrumb.Root component
 * @remarks Navigation landmark for breadcrumb trail
 */
export type BreadcrumbRootProps<T extends ElementType = 'nav'> = {
  /**
   * Polymorphic element type
   * @defaultValue 'nav'
   */
  as?: T;

  /**
   * Accessible name for navigation landmark
   * @defaultValue 'Breadcrumb'
   */
  'aria-label'?: string;

  /**
   * Navigation event handler for routing integration
   */
  onNavigate?: NavigationHandler;

  /**
   * Disable link interaction
   * @defaultValue false
   */
  isDisabled?: boolean;

  /**
   * Breadcrumb content
   */
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;

/**
 * Props for Breadcrumb.List component
 * @remarks Ordered list container for breadcrumb items
 */
export type BreadcrumbListProps<T extends ElementType = 'ol'> = {
  /**
   * Polymorphic element type
   * @defaultValue 'ol'
   */
  as?: T;

  /**
   * List items content
   */
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;

/**
 * Props for Breadcrumb.Item component
 * @remarks Individual breadcrumb item container
 */
export type BreadcrumbItemProps<T extends ElementType = 'li'> = {
  /**
   * Polymorphic element type
   * @defaultValue 'li'
   */
  as?: T;

  /**
   * Item content (Link or Page)
   */
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;

/**
 * Props for Breadcrumb.Link component
 * @remarks Interactive breadcrumb link
 */
export type BreadcrumbLinkProps<T extends ElementType = 'a'> = {
  /**
   * Polymorphic element type
   * @defaultValue 'a'
   */
  as?: T;

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
   * Link target attribute
   */
  target?: string;

  /**
   * Link relationship attribute
   */
  rel?: string;

  /**
   * Press event handler (overrides default navigation)
   */
  onPress?: (event: PressEvent) => void;

  /**
   * Link text content
   */
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;

/**
 * Props for Breadcrumb.Page component
 * @remarks Current page indicator (non-interactive)
 */
export type BreadcrumbPageProps<T extends ElementType = 'span'> = {
  /**
   * Polymorphic element type
   * @defaultValue 'span'
   */
  as?: T;

  /**
   * Current page name
   */
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;

/**
 * Props for Breadcrumb.Separator component
 * @remarks Visual separator between breadcrumb items
 */
export type BreadcrumbSeparatorProps<T extends ElementType = 'span'> = {
  /**
   * Polymorphic element type
   * @defaultValue 'li'
   */
  as?: T;

  /**
   * Custom separator content
   */
  children?: ReactNode;

  /**
   * Hide from screen readers
   * @defaultValue true
   */
  'aria-hidden'?: boolean;
} & ComponentPropsWithoutRef<T>;
