import { createArrowComponent } from '@/utils';
import { useTooltipContext, useTooltipContentContext } from './hooks';

/**
 * Optional decorative arrow element for tooltip.
 * Automatically positioned by Floating UI middleware — sits at the edge of the
 * content element pointing toward the trigger. Headless: no visual opinions,
 * user is responsible for shape/rotation styling.
 */
export const TooltipArrow = createArrowComponent({
  displayName: 'TooltipArrow',
  useRootContext: useTooltipContext,
  useContentContext: useTooltipContentContext,
});
