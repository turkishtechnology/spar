import type { DropdownMenuSubContentProps } from './types';
import { useDropdownMenuSubContext } from './hooks';
import { DropdownMenuContent } from './DropdownMenuContent';

/**
 * Content panel for a sub-menu. Delegates rendering to DropdownMenuContent.
 */
export const DropdownMenuSubContent = (props: DropdownMenuSubContentProps) => {
  useDropdownMenuSubContext();
  return <DropdownMenuContent {...props} />;
};

DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';
