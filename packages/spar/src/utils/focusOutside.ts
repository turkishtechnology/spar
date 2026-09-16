/**
 * Creates the cancelable event handed to `onFocusOutside` / `onInteractOutside`.
 *
 * Native `focusin` events are not cancelable, so `event.preventDefault()` inside a consumer
 * handler could never veto the dismiss. A cancelable `focusoutside` FocusEvent is dispatched on
 * the element that received focus instead — dispatching (rather than merely constructing) it
 * keeps `event.target` populated, and `relatedTarget` mirrors the source event. Nothing listens
 * for the custom type, so the dispatch has no side effects; the returned event is what the
 * consumer receives and what `defaultPrevented` is read from afterwards.
 */
export const createCancelableFocusOutsideEvent = (source: FocusEvent): FocusEvent => {
  const event = new FocusEvent('focusoutside', {
    bubbles: false,
    cancelable: true,
    relatedTarget: source.relatedTarget,
  });
  source.target?.dispatchEvent(event);
  return event;
};
