import React, { useCallback, useEffect, useRef, ElementType } from 'react';
import type { RadioItemProps, RadioItemRenderProps } from './types';
import { useRadioGroupContext } from './hooks';
import { useMergedRef } from '@/hooks';

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
    registerItem,
    unregisterItem,
  } = context;

  const itemRef = useRef<HTMLElement>(null);
  const isChecked = groupValue === itemValue;
  const isDisabled = groupDisabled || itemDisabled;
  const isFocused = focusedValue === itemValue;

  // Determine if this item should be focusable (tabIndex={0})
  // Uses roving tabindex: exactly one item in the group should have tabIndex={0}
  const isFirstItemFallback = groupValue === undefined;
  const isFocusable =
    !isDisabled && focusedValue === null && (isFocused || isChecked || isFirstItemFallback);

  // Register/unregister with group, providing the DOM element for imperative focus management
  useEffect(() => {
    if (itemRef.current) {
      registerItem(itemValue, itemRef.current);
    }
    return () => unregisterItem(itemValue);
  }, [itemValue, registerItem, unregisterItem]);

  // Handle selection
  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onValueChange(itemValue);
    }
  }, [isDisabled, onValueChange, itemValue]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.key === ' ' || event.key === 'Enter') && !isDisabled) {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick, isDisabled],
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
      aria-disabled={isDisabled || undefined}
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
        readOnly
      />
    </Component>
  );
};

RadioItem.displayName = 'RadioItem';
