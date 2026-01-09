import type {
  ElementType,
  MouseEvent,
  KeyboardEvent,
  ReactNode,
  HTMLAttributes,
  AnchorHTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
} from 'react';

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
export interface BreadcrumbRootProps extends HTMLAttributes<HTMLElement> {
  /**
   * Polymorphic element type
   * @defaultValue 'nav'
   */
  as?: ElementType;
  /**
   * Breadcrumb content
   */
  children: ReactNode;
  /**
   * Accessible name for navigation landmark
   * @defaultValue 'Breadcrumb'
   */
  'aria-label'?: React.AriaAttributes['aria-label'];
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
export interface BreadcrumbListProps extends OlHTMLAttributes<HTMLOListElement> {
  /**
   * Polymorphic element type
   * @defaultValue 'ol'
   */
  as?: ElementType;
  /**
   * List items content
   */
  children: ReactNode;
}

/**
 * Props for Breadcrumb.Item
 * @remarks List item wrapper for breadcrumb content
 */
export interface BreadcrumbItemProps extends LiHTMLAttributes<HTMLLIElement> {
  /**
   * Polymorphic element type
   * @defaultValue 'li'
   */
  as?: ElementType;
  /**
   * Item content (Link or Page)
   */
  children: ReactNode;
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
export interface BreadcrumbLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Polymorphic element type
   * @defaultValue 'a'
   */
  as?: ElementType;
  /**
   * Link destination
   */
  href?: string;
  /**
   * Link text content
   */
  children: ReactNode;
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
export interface BreadcrumbPageProps extends HTMLAttributes<HTMLElement> {
  /**
   * Polymorphic element type
   * @defaultValue 'span'
   */
  as?: ElementType;
  /**
   * Current page name
   */
  children: ReactNode;
}

/**
 * Props for Breadcrumb.Separator
 * @remarks Visual separator between breadcrumb items
 */
export interface BreadcrumbSeparatorProps extends LiHTMLAttributes<HTMLLIElement> {
  /**
   * Polymorphic element type
   * @defaultValue 'li'
   */
  as?: ElementType;
  /**
   * Custom separator content
   */
  children?: ReactNode;
  /**
   * Hide from screen readers
   * @defaultValue true
   */
  'aria-hidden'?: React.AriaAttributes['aria-hidden'];
}
