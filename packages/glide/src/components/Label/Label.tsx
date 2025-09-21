import { createContext, useContext, useMemo, memo, forwardRef } from 'react';
import type {
  LabelRootProps,
  LabelTextProps,
  LabelIndicatorProps,
  LabelContextValue,
  LabelSize,
  LabelVariant,
} from './Label.types';

// Constants for better performance and type safety
const DEFAULT_VARIANT: LabelVariant = 'default';
const DEFAULT_SIZE: LabelSize = 'md';
const DEFAULT_LOADING_TEXT = 'Loading...';
const DEFAULT_REQUIRED_INDICATOR = '*';

// Empty context value for performance optimization
const EMPTY_CONTEXT_VALUE: LabelContextValue = Object.freeze({});

/**
 * Context for sharing label state between compound components
 */
const LabelContext = createContext<LabelContextValue>(EMPTY_CONTEXT_VALUE);

/**
 * Optimized hook to access label context
 */
const useLabelContext = (): LabelContextValue => {
  return useContext(LabelContext);
};

/**
 * Optimized hook for managing label state and data attributes
 */
const useLabel = (props: {
  isRequired?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: LabelVariant;
  size?: LabelSize;
  loadingText?: string;
  requiredIndicator?: React.ReactNode;
}) => {
  const {
    isRequired = false,
    isLoading = false,
    isDisabled = false,
    variant = DEFAULT_VARIANT,
    size = DEFAULT_SIZE,
    loadingText = DEFAULT_LOADING_TEXT,
    requiredIndicator = DEFAULT_REQUIRED_INDICATOR,
  } = props;

  // Memoized data attributes with proper type safety
  const dataAttributes = useMemo(() => {
    const attrs: Record<string, string | boolean | undefined> = {
      'data-variant': variant,
      'data-size': size,
    };

    // Only add boolean attributes when true for cleaner DOM
    if (isRequired) attrs['data-required'] = true;
    if (isLoading) attrs['data-loading'] = true;
    if (isDisabled) attrs['data-disabled'] = true;

    return attrs;
  }, [variant, size, isRequired, isLoading, isDisabled]);

  // Memoized context value as frozen object for performance
  const contextValue = useMemo(
    (): LabelContextValue =>
      Object.freeze({
        isRequired,
        isLoading,
        isDisabled,
        variant,
        size,
        loadingText,
        requiredIndicator,
      }),
    [isRequired, isLoading, isDisabled, variant, size, loadingText, requiredIndicator],
  );

  return {
    dataAttributes,
    contextValue,
    isRequired,
    isLoading,
    isDisabled,
  };
};

/**
 * Core label component with enhanced polymorphic rendering and form association support.
 * Optimized with React.memo and proper ref forwarding.
 */
const LabelRootComponent = forwardRef<HTMLLabelElement, LabelRootProps>(
  (
    {
      htmlFor,
      variant = DEFAULT_VARIANT,
      size = DEFAULT_SIZE,
      isRequired = false,
      isDisabled = false,
      isLoading = false,
      loadingText = DEFAULT_LOADING_TEXT,
      requiredIndicator = DEFAULT_REQUIRED_INDICATOR,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const { dataAttributes, contextValue } = useLabel({
      isRequired,
      isLoading,
      isDisabled,
      variant,
      size,
      loadingText,
      requiredIndicator,
    });

    // Memoized required indicator to prevent unnecessary re-renders
    const requiredIndicatorElement = useMemo(
      () => (isRequired ? <span aria-hidden='true'>{requiredIndicator}</span> : null),
      [isRequired, requiredIndicator],
    );

    // Memoized loading indicator to prevent unnecessary re-renders
    const loadingIndicatorElement = useMemo(
      () =>
        isLoading ? (
          <span aria-live='polite' aria-atomic='true'>
            {loadingText}
          </span>
        ) : null,
      [isLoading, loadingText],
    );

    return (
      <LabelContext.Provider value={contextValue}>
        <label ref={ref} htmlFor={htmlFor} className={className} {...dataAttributes} {...rest}>
          {children}
          {requiredIndicatorElement}
          {loadingIndicatorElement}
        </label>
      </LabelContext.Provider>
    );
  },
);

/**
 * Memoized LabelRoot component for optimal performance
 */
export const LabelRoot = memo(LabelRootComponent);

LabelRoot.displayName = 'Label.Root';

/**
 * Text wrapper component for complex label compositions.
 * Optimized with React.memo for performance.
 */
const LabelTextComponent = forwardRef<HTMLSpanElement, LabelTextProps>(
  ({ children, className, ...rest }, ref) => {
    const labelContext = useLabelContext();

    // Compute data attributes based on context
    const dataAttributes = useMemo(
      () => ({
        'data-variant': labelContext?.variant,
        'data-size': labelContext?.size,
        ...(labelContext?.isRequired && { 'data-required': true as const }),
        ...(labelContext?.isLoading && { 'data-loading': true as const }),
        ...(labelContext?.isDisabled && { 'data-disabled': true as const }),
      }),
      [labelContext],
    );

    return (
      <span ref={ref} className={className} {...dataAttributes} {...rest}>
        {children}
      </span>
    );
  },
);

/**
 * Memoized LabelText component for optimal performance
 */
export const LabelText = memo(LabelTextComponent);

LabelText.displayName = 'Label.Text';

/**
 * Required field, loading, or custom indicators.
 * Optimized with React.memo for performance.
 */
const LabelIndicatorComponent = forwardRef<HTMLSpanElement, LabelIndicatorProps>(
  ({ type = 'required', children, className, ...rest }, ref) => {
    const context = useLabelContext();

    // Memoized content based on indicator type and context
    const indicatorContent = useMemo(() => {
      if (children) return children;

      switch (type) {
        case 'required':
          return context?.requiredIndicator ?? '*';
        case 'loading':
          return context?.loadingText ?? 'Loading...';
        default:
          return null;
      }
    }, [type, children, context?.requiredIndicator, context?.loadingText]);

    // Early return if no content
    if (!indicatorContent) return null;

    // Memoized ARIA attributes for screen reader support
    const ariaAttributes = useMemo(() => {
      if (type === 'loading') {
        return { 'aria-live': 'polite' as const, 'aria-atomic': true };
      }
      // Required and custom indicators are hidden from screen readers
      return { 'aria-hidden': true };
    }, [type]);

    // Memoized data attributes
    const dataAttributes = useMemo(
      () => ({
        'data-indicator-type': type,
        'data-variant': context?.variant,
        'data-size': context?.size,
      }),
      [type, context?.variant, context?.size],
    );

    return (
      <span ref={ref} className={className} {...ariaAttributes} {...dataAttributes} {...rest}>
        {indicatorContent}
      </span>
    );
  },
);

/**
 * Memoized LabelIndicator component for optimal performance
 */
export const LabelIndicator = memo(LabelIndicatorComponent);

LabelIndicator.displayName = 'Label.Indicator';

/**
 * Main Label component - alias for LabelRoot
 */
export const Label = LabelRoot;
