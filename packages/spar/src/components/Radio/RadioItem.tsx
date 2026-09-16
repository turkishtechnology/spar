import React, { useCallback, useEffect, useRef, ElementType } from 'react';
import type { RadioItemProps, RadioItemRenderProps } from './types';
import { useRadioContext } from './hooks';
import { useMergedRef } from '@/hooks';
import { visuallyHidden } from '@/utils';

/**
 * RadioItem component representing individual radio options within a Radio
 * (radiogroup). Renders a `<span role="radio">` by default (an element that
 * may carry the role; a `<label>` may not) whose text content names the
 * radio, plus a visually hidden native `<input type="radio">` sibling for form
 * submission. Implements roving tabindex and full accessibility features.
 *
 * Consumer `onClick` / `onKeyDown` / `onFocus` handlers are composed with the
 * internal ones: the consumer handler runs first, and calling
 * `event.preventDefault()` inside `onClick` or `onKeyDown` vetoes the
 * built-in selection for that event.
 */
export const RadioItem = <T extends ElementType = 'span'>({
  ref,
  value: itemValue,
  disabled: itemDisabled = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  onClick,
  onKeyDown,
  onFocus,
  as,
  children,
  ...rest
}: RadioItemProps<T>) => {
  const Component = as || 'span';
  const context = useRadioContext();
  const {
    value: groupValue,
    onChange,
    disabled: groupDisabled,
    readOnly: groupReadOnly,
    required: groupRequired,
    name,
    tabStopValue,
    focusedValue,
    setFocusedValue,
    orientation,
    registerItem,
    unregisterItem,
  } = context;

  const itemRef = useRef<HTMLElement>(null);
  const isChecked = groupValue === itemValue;
  const isDisabled = groupDisabled || itemDisabled;
  const isFocused = focusedValue === itemValue;

  // Roving tabindex: the root elects exactly one enabled item as the tab stop
  const isFocusable = !isDisabled && tabStopValue === itemValue;

  // Register/unregister with group, providing the DOM element for imperative focus management
  useEffect(() => {
    if (itemRef.current) {
      registerItem(itemValue, itemRef.current, isDisabled);
    }
    return () => unregisterItem(itemValue);
  }, [itemValue, registerItem, unregisterItem, isDisabled]);

  // Handle selection. The root ignores a request for the already-selected
  // value, so `onChange` only fires when the selection actually changes.
  const select = useCallback(() => {
    if (!isDisabled && !groupReadOnly) {
      onChange(itemValue);
    }
  }, [isDisabled, groupReadOnly, onChange, itemValue]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      select();
    },
    [onClick, select],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      // Space and Enter select the focused item (matters when
      // `selectOnFocus` is false, where arrow keys only move focus).
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        select();
      }
    },
    [onKeyDown, select],
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      onFocus?.(event);
      if (!isDisabled) {
        setFocusedValue(itemValue);
      }
    },
    [onFocus, isDisabled, setFocusedValue, itemValue],
  );

  // Merge refs
  const mergedRef = useMergedRef(itemRef, ref);

  // Render props for children function
  const renderProps: RadioItemRenderProps = {
    isChecked,
    select,
    disabled: isDisabled,
    isFocused,
  };

  // Data attributes for styling
  const dataAttributes = {
    'data-state': isChecked ? 'checked' : 'unchecked',
    'data-disabled': isDisabled ? '' : undefined,
    'data-readonly': groupReadOnly ? '' : undefined,
    'data-focus': isFocused ? '' : undefined,
    'data-orientation': orientation,
  };

  // `aria-readonly` is not allowed on `role="radio"`; the root exposes it on
  // the radiogroup instead.
  const ariaAttributes = {
    role: 'radio',
    'aria-checked': isChecked,
    'aria-disabled': isDisabled || undefined,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
  };

  const itemProps = {
    ref: mergedRef,
    ...ariaAttributes,
    tabIndex: isFocusable ? 0 : -1,
    ...dataAttributes,
    ...rest,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
  };

  return (
    <>
      <Component {...itemProps}>
        {typeof children === 'function' ? children(renderProps) : children}
      </Component>
      {/* Hidden radio input for form submission and native HTML5 validation.
          This is the group's only native representation of the selected
          value, so form data carries it exactly once. Rendered as a sibling
          (not a child) and hidden via inline `visuallyHidden` style so the
          headless package owns the hiding — consumers do not need recipe CSS
          to suppress this element. `required` is applied per-item; browsers
          treat `required` on radios as group-level by `name`, so any item
          being required marks the group. `onChange` is a no-op because the
          visible role="radio" element owns interaction; this just silences
          React's controlled-input warning. */}
      <input
        type='radio'
        name={name}
        value={itemValue}
        checked={isChecked}
        disabled={isDisabled}
        required={groupRequired}
        onChange={() => {}}
        style={visuallyHidden}
        tabIndex={-1}
        aria-hidden='true'
      />
    </>
  );
};

RadioItem.displayName = 'RadioItem';
