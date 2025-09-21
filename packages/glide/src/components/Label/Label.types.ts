import type { ReactNode, ComponentPropsWithRef } from 'react';

/**
 * Label size variants
 */
export type LabelSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Label visual variants
 */
export type LabelVariant = 'default' | 'primary' | 'secondary' | 'danger' | 'warning' | 'success';

/**
 * Label indicator types
 */
export type LabelIndicatorType = 'required' | 'loading' | 'custom';

/**
 * Props for Label.Root component - simplified for better TypeScript compatibility
 * @remarks Fully accessible, headless label component with form association support
 */
export interface LabelRootProps extends ComponentPropsWithRef<'label'> {
  /**
   * Associates label with form control by ID
   */
  htmlFor?: string;

  /**
   * Visual variant for styling
   * @defaultValue 'default'
   */
  variant?: LabelVariant;

  /**
   * Size variant for text scaling
   * @defaultValue 'md'
   */
  size?: LabelSize;

  /**
   * Required state - properly announced to screen readers
   * @defaultValue false
   */
  isRequired?: boolean;

  /**
   * Disabled state styling
   * @defaultValue false
   */
  isDisabled?: boolean;

  /**
   * Loading state with screen reader support
   * @defaultValue false
   */
  isLoading?: boolean;

  /**
   * Screen reader text for loading state
   * @defaultValue 'Loading...'
   */
  loadingText?: string;

  /**
   * Custom required field indicator
   * @defaultValue '*'
   */
  requiredIndicator?: ReactNode;

  /**
   * Label content
   */
  children: ReactNode;
}

/**
 * Props for Label.Text component
 * @remarks Text content wrapper for complex compositions
 */
export interface LabelTextProps extends ComponentPropsWithRef<'span'> {
  /**
   * Text content
   */
  children: ReactNode;
}

/**
 * Props for Label.Indicator component
 * @remarks Required field, loading, or status indicators
 */
export interface LabelIndicatorProps extends ComponentPropsWithRef<'span'> {
  /**
   * Indicator type
   * @defaultValue 'required'
   */
  type?: LabelIndicatorType;

  /**
   * Custom indicator content
   */
  children?: ReactNode;
}

/**
 * Internal context value for Label compound components (immutable structure for performance)
 */
export interface LabelContextValue {
  readonly isRequired?: boolean;
  readonly isLoading?: boolean;
  readonly isDisabled?: boolean;
  readonly variant?: LabelVariant;
  readonly size?: LabelSize;
  readonly loadingText?: string;
  readonly requiredIndicator?: ReactNode;
}

/**
 * Data attributes object type for better type safety
 */
export interface LabelDataAttributes {
  readonly 'data-variant': LabelVariant;
  readonly 'data-size': LabelSize;
  readonly 'data-required'?: true;
  readonly 'data-loading'?: true;
  readonly 'data-disabled'?: true;
}
