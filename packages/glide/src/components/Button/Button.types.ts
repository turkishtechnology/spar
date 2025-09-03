import * as React from 'react';

/**
 * ButtonProps for TK Headless Button component
 * @remarks
 * - Fully accessible, headless, supports ARIA and keyboard navigation
 * - See component instructions for details
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button - affects ARIA and behavior */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';

  /** Size variant for accessibility hints */
  size?: 'sm' | 'md' | 'lg';

  /** Loading state - MUST announce to screen readers */
  isLoading?: boolean;

  /** Disabled state - MUST be properly announced */
  isDisabled?: boolean;

  /** Icon-only button - REQUIRES aria-label */
  isIconOnly?: boolean;

  /** Full width button */
  isFullWidth?: boolean;

  /** Loading text for screen readers */
  loadingText?: string;

  /** Keyboard shortcut hint */
  shortcut?: string;

  /** As polymorphic prop */
  as?: React.ElementType;

  /** Required for icon-only buttons */
  'aria-label'?: string;

  /** Children can be React nodes */
  children?: React.ReactNode;
}
