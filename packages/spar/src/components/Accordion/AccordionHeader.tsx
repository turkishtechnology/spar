import { ElementType } from 'react';
import type { AccordionHeaderProps } from './types';
import { useAccordionItemContext } from './hooks';

/**
 * Accordion header providing semantic heading structure for triggers. Wraps the trigger in appropriate heading element for document hierarchy.
 */
export const AccordionHeader = <T extends ElementType = 'h3'>({
  level = 3,
  as,
  children,
  ref,
  ...props
}: AccordionHeaderProps<T>) => {
  const { isOpen, disabled } = useAccordionItemContext();

  // Determine the component to render
  const Component = as || (`h${level}` as ElementType);

  return (
    <Component
      {...props}
      ref={ref}
      data-level={level}
      data-open={isOpen ? '' : undefined}
      data-closed={isOpen ? undefined : ''}
      {...(disabled && { 'data-disabled': '' })}
    >
      {children}
    </Component>
  );
};

AccordionHeader.displayName = 'AccordionHeader';
