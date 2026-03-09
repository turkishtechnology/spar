import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import type { TooltipProviderProps, TooltipProviderContextValue } from './types';
import { TooltipProviderContext } from './hooks';

/**
 * Provides shared configuration for multiple tooltip instances
 */
export const TooltipProvider = ({
  children,
  delayDuration = 700,
  skipDelayDuration = 300,
  disableHoverableContent = false,
}: TooltipProviderProps) => {
  const [skipDelay, setSkipDelay] = useState(false);
  const skipDelayTimerRef = useRef<number | null>(null);

  const clearSkipDelayTimer = useCallback(() => {
    if (skipDelayTimerRef.current !== null) {
      clearTimeout(skipDelayTimerRef.current);
      skipDelayTimerRef.current = null;
    }
  }, []);

  const handleSetSkipDelay = useCallback(
    (value: boolean) => {
      if (value) {
        clearSkipDelayTimer();
        setSkipDelay(true);
      } else {
        clearSkipDelayTimer();

        skipDelayTimerRef.current = window.setTimeout(() => {
          setSkipDelay(false);
          skipDelayTimerRef.current = null;
        }, skipDelayDuration);
      }
    },
    [skipDelayDuration, clearSkipDelayTimer],
  );

  const contextValue: TooltipProviderContextValue = useMemo(
    () => ({
      delayDuration,
      skipDelayDuration,
      disableHoverableContent,
      skipDelay,
      setSkipDelay: handleSetSkipDelay,
    }),
    [delayDuration, skipDelayDuration, disableHoverableContent, skipDelay, handleSetSkipDelay],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      clearSkipDelayTimer();
    };
  }, [clearSkipDelayTimer]);

  return (
    <TooltipProviderContext.Provider value={contextValue}>
      {children}
    </TooltipProviderContext.Provider>
  );
};

TooltipProvider.displayName = 'TooltipProvider';
