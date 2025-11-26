import type { DropdownMenuSubContentProps } from './types';
import { useDropdownMenuSubContext } from './contexts';
import { DropdownMenuContent } from './DropdownMenuContent';

export const DropdownMenuSubContent = (props: DropdownMenuSubContentProps) => {
  useDropdownMenuSubContext();
  return <DropdownMenuContent {...props} />;
};

DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';
