import { Breadcrumb as BreadcrumbRoot } from './Breadcrumb';
import { BreadcrumbList } from './BreadcrumbList';
import { BreadcrumbItem } from './BreadcrumbItem';
import { BreadcrumbLink } from './BreadcrumbLink';
import { BreadcrumbPage } from './BreadcrumbPage';
import { BreadcrumbSeparator } from './BreadcrumbSeparator';
export { useBreadcrumbContext } from './hooks';

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

export {
  Breadcrumb,
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
};

export type {
  BreadcrumbProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbItemRenderProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
  BreadcrumbContextValue,
  BreadcrumbPosition,
  NavigationHandler,
  PressEvent,
} from './types';
