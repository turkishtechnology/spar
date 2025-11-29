import { BreadcrumbRoot } from './BreadcrumbRoot';
import { BreadcrumbList } from './BreadcrumbList';
import { BreadcrumbItem } from './BreadcrumbItem';
import { BreadcrumbLink } from './BreadcrumbLink';
import { BreadcrumbPage } from './BreadcrumbPage';
import { BreadcrumbSeparator } from './BreadcrumbSeparator';

// Create compound component with dot notation support
const Breadcrumb = BreadcrumbRoot as typeof BreadcrumbRoot & {
  Root: typeof BreadcrumbRoot;
  List: typeof BreadcrumbList;
  Item: typeof BreadcrumbItem;
  Link: typeof BreadcrumbLink;
  Page: typeof BreadcrumbPage;
  Separator: typeof BreadcrumbSeparator;
};

Breadcrumb.Root = BreadcrumbRoot;
Breadcrumb.List = BreadcrumbList;
Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Link = BreadcrumbLink;
Breadcrumb.Page = BreadcrumbPage;
Breadcrumb.Separator = BreadcrumbSeparator;

// Export both patterns
export {
  // Compound component (with dot notation)
  Breadcrumb,

  // Named exports (tree-shakeable)
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
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
