import { BreadcrumbRoot as BreadcrumbCompoundRoot } from './BreadcrumbRoot';
import { BreadcrumbList } from './BreadcrumbList';
import { BreadcrumbItem } from './BreadcrumbItem';
import { BreadcrumbLink } from './BreadcrumbLink';
import { BreadcrumbPage } from './BreadcrumbPage';
import { BreadcrumbSeparator } from './BreadcrumbSeparator';

// Create compound component with dot notation support
const Breadcrumb = BreadcrumbCompoundRoot as typeof BreadcrumbCompoundRoot & {
  Root: typeof BreadcrumbCompoundRoot;
  List: typeof BreadcrumbList;
  Item: typeof BreadcrumbItem;
  Link: typeof BreadcrumbLink;
  Page: typeof BreadcrumbPage;
  Separator: typeof BreadcrumbSeparator;
};

Breadcrumb.Root = BreadcrumbCompoundRoot;
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
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbCompoundRoot,
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
