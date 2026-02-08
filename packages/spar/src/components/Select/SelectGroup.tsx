import { useId, useMemo, type ElementType } from 'react';
import { SelectGroupContext } from './hooks';
import type { SelectGroupProps, SelectGroupContextValue } from './types';

/**
 * Groups related select items together with an optional label. Provides semantic structure and accessibility.
 */
export const SelectGroup = <T extends ElementType = 'div'>({
  as,
  children,
  ...props
}: SelectGroupProps<T>) => {
  const Component = as || 'div';
  const labelId = useId();

  const contextValue = useMemo<SelectGroupContextValue>(
    () => ({
      labelId,
    }),
    [labelId],
  );

  return (
    <SelectGroupContext.Provider value={contextValue}>
      <Component role='group' aria-labelledby={labelId} {...props}>
        {children}
      </Component>
    </SelectGroupContext.Provider>
  );
};

SelectGroup.displayName = 'SelectGroup';
