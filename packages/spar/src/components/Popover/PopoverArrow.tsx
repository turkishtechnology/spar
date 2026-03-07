import { createArrowComponent } from '@/utils';
import { usePopoverContext } from './hooks/usePopoverContext';
import { usePopoverContentContext } from './hooks/usePopoverContentContext';

/**
 * Optional decorative arrow element for popover.
 * Automatically positioned by Floating UI middleware — sits at the edge of the
 * content element pointing toward the trigger. Headless: no visual opinions,
 * user is responsible for shape/rotation styling.
 */
export const PopoverArrow = createArrowComponent({
  displayName: 'PopoverArrow',
  useRootContext: usePopoverContext,
  useContentContext: usePopoverContentContext,
});
