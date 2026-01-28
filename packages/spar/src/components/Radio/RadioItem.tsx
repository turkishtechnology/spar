import React, { useCallback, useEffect, useRef, ElementType } from 'react';
import type { RadioItemProps, RadioItemRenderProps } from './types';
import { useRadioGroupContext } from './RadioGroup';
import { useFocusItem, useMergedRef } from '@/hooks';

/**
 * RadioItem component representing individual radio options within a RadioGroup.
 * Implements roving tabindex and full accessibility features.
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
  const context = useRadioGroupContext();
  const {
    value: groupValue,
    onValueChange,
    disabled: groupDisabled,
    name,
    focusedValue,
    setFocusedValue,
    isInToolbar,
    registerItem,
    unregisterItem,
  } = context;

  const itemRef = useRef<HTMLElement>(null);
  const isChecked = groupValue === itemValue;
  const isDisabled = groupDisabled || itemDisabled;
  const isFocused = focusedValue === itemValue;

  // Determine if this item should be focusable (tabIndex={0})
  const isFocusable =
    !isDisabled &&
    (focusedValue === itemValue || // Currently focused
      (focusedValue === null && (isChecked || groupValue === itemValue)) || // No focus, but this is selected
      (focusedValue === null && !groupValue && itemValue)); // No focus, no selection, accept any item (first will win)

  // Register/unregister with group
  useEffect(() => {
    registerItem(itemValue);
    return () => unregisterItem(itemValue);
  }, [itemValue, registerItem, unregisterItem]);

  // Focus management - direct implementation to avoid SSR issues
  useFocusItem(focusedValue === itemValue, itemRef);

  // Handle selection
  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onValueChange(itemValue);
    }
  }, [isDisabled, onValueChange, itemValue]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Only handle Space/Enter in toolbar mode
      // In normal mode, arrow keys already handle focus + selection
      if (isInToolbar && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick, isInToolbar],
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
  };

  return (
    <Component
      ref={mergedRef}
      role='radio'
      aria-checked={isChecked}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      tabIndex={isFocusable ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      {...dataAttributes}
      {...rest}
    >
      {typeof children === 'function' ? children(renderProps) : children}
      {/* Hidden radio input for form submission and accessibility */}
      <input
        type='radio'
        name={name}
        value={itemValue}
        checked={isChecked}
        disabled={isDisabled}
        tabIndex={-1}
        data-hidden
        data-disabled={isDisabled ? '' : undefined}
        onChange={() => {}} // Controlled by parent
      />
    </Component>
  );
};

RadioItem.displayName = 'RadioItem';
