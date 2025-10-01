// Toast constants for better tree-shaking and maintainability
export const TOAST_DEFAULT_DURATION = 5000 as const;
export const TOAST_MAX_COUNT = 5 as const;

// Priority order mapping for toast queue management
export const PRIORITY_ORDER = {
  low: 0,
  normal: 1,
  high: 2,
} as const;
