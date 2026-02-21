import { useCallback } from 'react';

/**
 * Merges an external ref with an internal ref object.
 * Handles both callback refs and ref objects.
 *
 * @param internalRef - The internal ref object to update
 * @param externalRef - The external ref from props (can be callback or ref object)
 * @returns A callback ref that updates both refs
 *
 * @example
 * ```tsx
 * const MyComponent = ({ ref, ...props }: MyComponentProps) => {
 *   const internalRef = useRef<HTMLDivElement>(null);
 *   const mergedRef = useMergedRef(internalRef, ref);
 *
 *   return <div ref={mergedRef} {...props} />;
 * };
 * ```
 */
export const useMergedRef = <T extends Element>(
  internalRef: React.RefObject<T | null>,
  externalRef?: React.Ref<T> | null,
) => {
  return useCallback(
    (node: T | null) => {
      // Update internal ref
      internalRef.current = node;

      // Update external ref if provided
      if (externalRef) {
        if (typeof externalRef === 'function') {
          externalRef(node);
        } else {
          (externalRef as React.RefObject<T | null>).current = node;
        }
      }
    },
    [internalRef, externalRef],
  );
};
