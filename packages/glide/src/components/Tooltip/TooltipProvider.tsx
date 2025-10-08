import { useMemo, useState } from 'react';
import type { TooltipProviderProps, TooltipProviderContextValue } from './types';
import { TooltipProviderContext } from './TooltipProviderContext';

/**
 * Provides shared configuration for multiple tooltip instances
 */
export const TooltipProvider = ({
  children,
  delayDuration = 700,
  skipDelayDuration = 300,
  disableHoverableContent = false,
}: TooltipProviderProps) => {
  const [isOpenDelayed, setIsOpenDelayed] = useState(false);

  const contextValue: TooltipProviderContextValue = useMemo(
    () => ({
      delayDuration,
      skipDelayDuration,
      disableHoverableContent,
      isOpenDelayed,
      setIsOpenDelayed,
    }),
    [delayDuration, skipDelayDuration, disableHoverableContent, isOpenDelayed],
  );

  return (
    <TooltipProviderContext.Provider value={contextValue}>
      <div data-tooltip-provider='' data-skip-delay={isOpenDelayed ? 'true' : 'false'}>
        {children}
      </div>
    </TooltipProviderContext.Provider>
  );
};

TooltipProvider.displayName = 'TooltipProvider';
