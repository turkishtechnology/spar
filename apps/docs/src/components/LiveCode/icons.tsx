import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Error/warning icon (circle with exclamation mark).
 * Used across error overlays, footers, and banners.
 */
export const ErrorIcon = ({ size = 14, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <circle cx='12' cy='12' r='10' />
    <line x1='12' y1='8' x2='12' y2='12' />
    <line x1='12' y1='16' x2='12.01' y2='16' />
  </svg>
);

/**
 * Code brackets icon (< />).
 * Used in "Show in code" action buttons.
 */
export const CodeIcon = ({ size = 14, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <polyline points='16 18 22 12 16 6' />
    <polyline points='8 6 2 12 8 18' />
  </svg>
);

/**
 * Reset/refresh icon (circular arrow).
 * Used in reset action buttons.
 */
export const ResetIcon = ({ size = 14, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <polyline points='23 4 23 10 17 10' />
    <path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10' />
  </svg>
);

/**
 * Copy icon (overlapping rectangles).
 * Used in copy action buttons.
 */
export const CopyIcon = ({ size = 12, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
    <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
  </svg>
);

/**
 * Check/success icon (checkmark).
 * Used in copy success state.
 */
export const CheckIcon = ({ size = 12, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <polyline points='20 6 9 17 4 12' />
  </svg>
);

/**
 * Close/dismiss icon (X mark).
 * Used in dismiss action buttons.
 */
export const CloseIcon = ({ size = 12, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <line x1='18' y1='6' x2='6' y2='18' />
    <line x1='6' y1='6' x2='18' y2='18' />
  </svg>
);

/**
 * Code toggle icon (angle brackets).
 * Used in the collapsible code block toggle button.
 */
export const CodeToggleIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 20 20'
    fill='none'
    aria-hidden='true'
    {...props}
  >
    <path
      d='M7.83366 13.8333L4.00033 10L7.83366 6.16667L6.66699 5L1.66699 10L6.66699 15L7.83366 13.8333ZM12.167 13.8333L16.0003 10L12.167 6.16667L13.3337 5L18.3337 10L13.3337 15L12.167 13.8333Z'
      fill='currentColor'
    />
  </svg>
);

/**
 * Chevron down icon.
 * Used in the collapsible code block expand indicator.
 */
export const ChevronDownIcon = ({ size = 20, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 20 20'
    fill='none'
    aria-hidden='true'
    {...props}
  >
    <path
      d='M13.2292 7.49961L9.99583 10.7329L6.7625 7.49961C6.4375 7.17461 5.9125 7.17461 5.5875 7.49961C5.2625 7.82461 5.2625 8.34961 5.5875 8.67461L9.4125 12.4996C9.7375 12.8246 10.2625 12.8246 10.5875 12.4996L14.4125 8.67461C14.7375 8.34961 14.7375 7.82461 14.4125 7.49961C14.0875 7.18294 13.5542 7.17461 13.2292 7.49961Z'
      fill='currentColor'
    />
  </svg>
);
