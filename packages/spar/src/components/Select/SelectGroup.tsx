import React, { createContext, useContext, useId, useMemo, type ElementType } from 'react';
import type { SelectGroupProps, SelectGroupContextValue } from './types';

const SelectGroupContext = createContext<SelectGroupContextValue | null>(null);

export const useSelectGroupContext = () => {
  const context = useContext(SelectGroupContext);
  if (!context) {
    throw new Error('SelectGroup components must be used within a SelectGroup');
  }
  return context;
};

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
