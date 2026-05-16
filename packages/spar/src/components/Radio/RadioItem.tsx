import React, { useCallback, useEffect, useRef, ElementType } from 'react';
import type { RadioItemProps, RadioItemRenderProps } from './types';
import { useRadioContext } from './hooks';
import { useMergedRef } from '@/hooks';
import { visuallyHidden } from '@/utils';

/**
 * RadioItem component representing individual radio options within a Radio
 * (radiogroup). Implements roving tabindex and full accessibility features.
 */
export const RadioItem = <T extends ElementType = 'label'>({
  ref,
  value: itemValue,
  disabled: itemDisabled = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  as,
  children,
  ...rest
}: RadioItemProps<T>) => {
  const Component = as || 'label';
  const context = useRadioContext();
  const {
    value: groupValue,
    onValueChange,
    disabled: groupDisabled,
    required: groupRequired,
    name,
    firstFocusableValue,
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

  // Determine if this item should be focusable (tabIndex={0})
  // Uses roving tabindex: exactly one item in the group should have tabIndex={0}
  const isFirstItemFallback =
    groupValue === undefined && focusedValue === null && firstFocusableValue === itemValue;
  const isFocusable = !isDisabled && (isFocused || isChecked || isFirstItemFallback);

  // Register/unregister with group, providing the DOM element for imperative focus management
  useEffect(() => {
    if (itemRef.current) {
      registerItem(itemValue, itemRef.current, isDisabled);
    }
    return () => unregisterItem(itemValue);
  }, [itemValue, registerItem, unregisterItem, isDisabled]);

  // Handle selection
  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onValueChange(itemValue);
    }
  }, [isDisabled, onValueChange, itemValue]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === ' ') {
        event.preventDefault();
        if (!isDisabled && !isChecked) {
          handleClick();
        }
      }
    },
    [handleClick, isDisabled, isChecked],
  );

  const handleFocus = useCallback(() => {
    if (!isDisabled) {
      setFocusedValue(itemValue);
    }
  }, [isDisabled, setFocusedValue, itemValue]);

  // Merge refs
  const mergedRef = useMergedRef(itemRef, ref);

  // Render props for children function
  const renderProps: RadioItemRenderProps = {
    isChecked,
    select: handleClick,
    disabled: isDisabled,
    isFocused,
  };

  // Data attributes for styling
  const dataAttributes = {
    'data-state': isChecked ? 'checked' : 'unchecked',
    'data-disabled': isDisabled ? '' : undefined,
    'data-focused': isFocused ? '' : undefined,
    'data-orientation': orientation,
  };

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
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    ...dataAttributes,
    ...rest,
  };

  return (
    <>
      <Component {...itemProps}>
        {typeof children === 'function' ? children(renderProps) : children}
      </Component>
      {/* Hidden radio input for form submission and native HTML5 validation.
          Rendered as a sibling (not a child) and hidden via inline
          `visuallyHidden` style so the headless package owns the gizleme —
          consumers do not need recipe CSS to suppress this element.
          `required` is applied per-item; browsers treat `required` on radios
          as group-level by `name`, so any item being required marks the group.
          `onChange` is a no-op because the visible role="radio" element owns
          interaction; this just silences React's controlled-input warning. */}
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
