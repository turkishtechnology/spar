import { useMemo } from 'react';
import type { DropdownMenuRadioGroupProps, DropdownMenuRadioGroupContextValue } from './types';
import { DropdownMenuRadioGroupContext } from './hooks';

export const DropdownMenuRadioGroup = ({
  value,
  onValueChange,
  ...props
}: DropdownMenuRadioGroupProps) => {
  const contextValue = useMemo<DropdownMenuRadioGroupContextValue>(
    () => ({ value, onValueChange }),
    [value, onValueChange],
  );

  return (
    <DropdownMenuRadioGroupContext.Provider value={contextValue}>
      <div {...props} role='group' />
    </DropdownMenuRadioGroupContext.Provider>
  );
};

DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup';
