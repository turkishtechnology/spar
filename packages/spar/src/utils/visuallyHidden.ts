import type { CSSProperties } from 'react';

/**
 * CSS styles for visually hiding content while keeping it accessible to screen readers.
 *
 * This technique uses the "clip pattern" which is recommended by both WebAIM and The A11Y Project.
 * It hides content visually while ensuring it remains:
 * - Accessible to assistive technologies (screen readers)
 * - Available in the accessibility tree
 * - Not removed from the page flow completely
 *
 * @see https://webaim.org/techniques/css/invisiblecontent/
 * @see https://www.a11yproject.com/posts/how-to-hide-content/
 * @see https://www.scottohara.me/blog/2017/04/14/inclusively-hidden.html
 *
 * @example
 * ```tsx
 * // Using inline styles
 * <span style={visuallyHidden}>Screen reader only text</span>
 *
 * // In a component
 * <input
 *   type="checkbox"
 *   name="agree"
 *   style={visuallyHidden}
 *   tabIndex={-1}
 *   aria-hidden="true"
 * />
 * ```
 *
 * @remarks
 * - Use `clip` for backwards compatibility with older browsers
 * - Use `clip-path` for modern browsers
 * - `white-space: nowrap` prevents text wrapping/breaking
 * - `position: absolute` removes from normal flow
 * - Small dimensions (1px) as fallback if positioning fails
 *
 * @warning
 * For focusable elements (links, buttons), ensure they become visible on focus.
 * Consider using a `:focus` variant that removes these styles.
 */
export const visuallyHidden: CSSProperties = {
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
} as const;

/**
 * Creates visually hidden styles with optional focus visibility.
 *
 * When `showOnFocus` is true, returns undefined (no styles) which allows
 * focusable elements to become visible when they receive keyboard focus.
 *
 * @param showOnFocus - Whether the element should become visible when focused
 * @returns The visually hidden styles or undefined
 *
 * @example
 * ```tsx
 * // Skip link that shows on focus
 * <a href="#main" style={getVisuallyHiddenStyles(isFocused)}>
 *   Skip to main content
 * </a>
 * ```
 */
export const getVisuallyHiddenStyles = (showOnFocus = false): CSSProperties | undefined => {
  return showOnFocus ? undefined : visuallyHidden;
};
