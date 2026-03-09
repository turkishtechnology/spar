import { createArrowComponent } from '@/utils';
import { useDropdownMenuContext, useDropdownMenuContentContext } from './hooks';

/**
 * Optional decorative arrow element for dropdown menu.
 * Automatically positioned by Floating UI middleware — sits at the edge of the
 * content element pointing toward the trigger. Headless: no visual opinions,
 * user is responsible for shape/rotation styling.
 */
export const DropdownMenuArrow = createArrowComponent({
  displayName: 'DropdownMenuArrow',
  useRootContext: useDropdownMenuContext,
  useContentContext: useDropdownMenuContentContext,
});
