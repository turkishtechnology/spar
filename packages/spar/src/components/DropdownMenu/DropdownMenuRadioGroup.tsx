import { useMemo } from 'react';
import type { DropdownMenuRadioGroupProps, DropdownMenuRadioGroupContextValue } from './types';
import { DropdownMenuRadioGroupContext } from './hooks';

/**
 * Groups radio items and manages the selected value within the dropdown menu.
 * Provides context to DropdownMenuRadioItem children for mutual exclusion.
 */
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
