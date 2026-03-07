import { createArrowComponent } from '@/utils';
import { useSelectContext, useSelectContentContext } from './hooks';

/**
 * Optional decorative arrow element for select.
 * Automatically positioned by Floating UI middleware — sits at the edge of the
 * content element pointing toward the trigger. Headless: no visual opinions,
 * user is responsible for shape/rotation styling.
 */
export const SelectArrow = createArrowComponent({
  displayName: 'SelectArrow',
  useRootContext: useSelectContext,
  useContentContext: useSelectContentContext,
});
