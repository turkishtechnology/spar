import {
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb';

// Create aliases for grouped pattern
const Root = BreadcrumbRoot;
const List = BreadcrumbList;
const Item = BreadcrumbItem;
const Link = BreadcrumbLink;
const Page = BreadcrumbPage;
const Separator = BreadcrumbSeparator;

// Export both patterns
export {
  // Named exports (tree-shakeable)
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,

  // Aliased exports (for grouped usage)
  Root,
  List,
  Item,
  Link,
  Page,
  Separator,
};

// Export types
export type {
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbContextValue,
  BreadcrumbPosition,
  NavigationHandler,
  PressEvent,
} from './types';
