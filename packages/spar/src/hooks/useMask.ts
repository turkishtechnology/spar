import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from 'react';
import type { Mask, MaskChangeMeta, MaskPattern, MaskResolverResult } from '@/types';
import { DEFAULT_INSIGNIFICANT, mapCaret } from '@/utils/caret';
import { applyMaskPattern, isMaskResolver, presetResolver, type MaskResult } from '@/utils/mask';
import { useControlledState } from './useControlledState';

/**
 * Binds a mask to an input element: applies the mask, keeps the caret where the
 * user put it, and reconciles controlled and uncontrolled value props.
 *
 * @remarks
 * **Internal.** The package's public API exports only `./types` and
 * `./components`; a public hooks surface is a separate decision.
 *
 * The caret is the part no library solves, and the reason this binding exists in
 * exactly one place. Rewriting the value of a controlled input moves the caret to
 * the end, so it has to be put back — at an offset that accounts for delimiters
 * the mask just inserted or removed.
 *
 * cleave, and every implementation modelled on it, derives that offset by diffing
 * the old and new value and *inferring* what the user did. A diff cannot tell a
 * paste from typing, or a forward delete from a backward one; it guesses, and the
 * guesses are where caret bugs live.
 *
 * Here the `beforeinput` event states the operation outright — `event.inputType`
 * is a fact, not an inference:
 *
 * - `deleteContentBackward` / `deleteContentForward` are applied by this hook,
 *   because the native operation is wrong: deleting a delimiter that the mask
 *   immediately re-inserts leaves the value unchanged and the field stuck.
 * - `historyUndo` / `historyRedo` are served from an internal bounded stack,
 *   since writing the value programmatically destroys the browser's own.
 * - `insertCompositionText` suspends masking while an IME composition is in
 *   flight; `insertFromComposition` resumes it.
 * - everything else — typing, paste, drop, cut, word deletes — is left to the
 *   browser and re-masked afterwards, with the caret mapped by anchor counting.
 *
 * If `beforeinput` never fires at all, masking still happens on the change event
 * using the resulting value and selection. Precision is lost, not correctness.
 */

/** Bounded undo history. Deep enough for real editing, small enough to ignore. */
const MAX_HISTORY_ENTRIES = 50;

/** Patterns already reported as unsupported, so the warning fires once per pattern. */
const warnedPatterns = new Set<string>();

interface HistoryEntry {
  value: string;
  caret: number;
}

export interface UseMaskOptions {
  /** The mask to apply. When undefined the hook is inert. */
  mask?: Mask | undefined;

  /** Controlled display value. */
  value?: string | undefined;

  /** Uncontrolled initial value. */
  defaultValue?: string | undefined;

  /** Fires with the masked value plus `raw` / `completed` / `iso` metadata. */
  onValueChange?: ((value: string, meta: MaskChangeMeta) => void) | undefined;

  /** Ref to the element being masked. */
  elementRef: RefObject<HTMLElement | null>;
}

export interface UseMaskReturn {
  /** Whether a mask is active. When false, nothing below should be applied. */
  active: boolean;

  /**
   * Whether the element's `value` must come from this hook.
   *
   * Stays true after a mask is removed. React treats a field that stops being
   * given a `value` as newly uncontrolled — it warns, and leaves the last masked
   * text frozen on screen — so once the hook has taken the element over it keeps
   * it, and goes on tracking edits with the mask switched off.
   */
  controlled: boolean;

  /** The masked value to render. */
  value: string;

  /** Whether the masked value fills every block. */
  completed: boolean;

  /** Change handler for the element. */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const isInsignificantChar = (char: string | undefined, predicate: RegExp): boolean => {
  if (char === undefined) return false;
  predicate.lastIndex = 0;
  return predicate.test(char);
};

/**
 * The element's selection, or `null` for a control that exposes none.
 *
 * `type="email"` and `type="number"` report `selectionStart` as null. Falling
 * back to the end of the value there would make Backspace delete the last
 * character wherever the caret actually is, so the imperative edits stand down
 * and let the browser apply its own.
 */
const getSelection = (element: HTMLElement): { start: number; end: number } | null => {
  const field = element as HTMLInputElement;
  const start = field.selectionStart;
  if (start === null || start === undefined) return null;
  return { start, end: field.selectionEnd ?? start };
};

/** What one mask run produces, whichever layer produced it. */
type MaskRun = MaskResult & {
  caretOverride?: number;
  insignificant: RegExp;
  iso?: string;
};

/** Default `raw`: the value with every separator removed. */
const stripInsignificant = (value: string, predicate: RegExp): string =>
  [...value].filter((char) => !isInsignificantChar(char, predicate)).join('');

/**
 * Runs a mask over a candidate string.
 *
 * Two paths, not four. `date` and `time` are expanded into the resolvers they
 * stand for, so the only distinction left is engine pattern versus resolver —
 * and a resolver written here gets exactly what one written in userland gets.
 *
 * A resolver returns the formatted value only; its caret is derived by anchor
 * counting like every other layer, unless it explicitly overrides it.
 */
const runMask = (
  mask: Mask,
  input: string,
  context: { caret: number; previousValue: string; inputType?: string | undefined },
): MaskRun => {
  const resolver = isMaskResolver(mask) ? mask : presetResolver(mask);

  if (resolver) {
    const result: MaskResolverResult = resolver(input, {
      caret: context.caret,
      previousValue: context.previousValue,
      ...(context.inputType === undefined ? {} : { inputType: context.inputType }),
    });
    const insignificant = result.insignificant ?? DEFAULT_INSIGNIFICANT;

    return {
      value: result.value,
      raw: result.raw ?? stripInsignificant(result.value, insignificant),
      completed: result.completed ?? true,
      insignificant,
      ...(result.caret === undefined ? {} : { caretOverride: result.caret }),
      ...(result.iso === undefined ? {} : { iso: result.iso }),
    };
  }

  return { ...applyMaskPattern(input, mask as MaskPattern), insignificant: DEFAULT_INSIGNIFICANT };
};

/**
 * Places the caret in the masked value.
 *
 * Anchor counting handles every position inside the value, but it cannot see
 * characters the mask *synthesised*: a zero-pad turning `4` into `04` adds a
 * significant character that was never typed, so counting to "one digit in"
 * lands between the two. At the end of the value there is nothing to count
 * toward anyway — so an edit at the end keeps the caret at the end, and only
 * mid-string edits are anchor-counted.
 */
const resolveCaret = (
  from: string,
  caret: number,
  result: { value: string; insignificant: RegExp },
): number =>
  caret >= from.length
    ? result.value.length
    : mapCaret(from, caret, result.value, result.insignificant);

/**
 * Whether Backspace on a delimiter should also remove the character before it.
 *
 * Read the same way from every layer: an option on an engine pattern, a property
 * on a resolver. Both spell it `backspace`, both default to true.
 */
const allowsBackspaceThrough = (mask: Mask): boolean =>
  (mask as { backspace?: boolean }).backspace !== false;

export const useMask = ({
  mask,
  value,
  defaultValue,
  onValueChange,
  elementRef,
}: UseMaskOptions): UseMaskReturn => {
  const active = mask !== undefined;

  const everActive = useRef(active);
  if (active) everActive.current = true;
  const controlled = everActive.current;

  const [storedValue, setStoredValue] = useControlledState<string>(
    value,
    defaultValue ?? '',
    undefined,
  );

  const currentValue = storedValue ?? '';

  // The ref is what the event handlers read synchronously; the state is what
  // render reads. Both are needed: suspending the handlers but still masking
  // before render would put the mask straight back over the composition.
  const composing = useRef(false);

  // The text an IME is still composing, held apart from the value. Rendering the
  // value instead would hand a controlled input back its parent's version of it
  // and wipe the composition out from under the composer on the first change.
  const [composition, setComposition] = useState<string | null>(null);

  // Masked before render, so a consumer echoing back an unmasked value cannot
  // desync the display.
  const rendered = useMemo(
    () =>
      mask
        ? runMask(mask, currentValue, { caret: currentValue.length, previousValue: currentValue })
        : null,
    [mask, currentValue],
  );

  const displayValue = composition ?? (rendered ? rendered.value : currentValue);

  // Seeded with the value the field starts on, not with the empty string: an
  // undo that runs off the end of the history has to arrive back at the
  // `defaultValue` the user was given, never at a field it clears.
  const history = useRef<{ entries: HistoryEntry[]; index: number }>({ entries: [], index: 0 });
  if (history.current.entries.length === 0) {
    history.current.entries = [{ value: displayValue, caret: displayValue.length }];
  }

  // What the consumer was last told the value is. `displayValue` cannot serve as
  // that reference: while an IME composition is in flight it holds the raw
  // composed text, so a mask that leaves the composition alone would read as
  // "nothing changed", never be reported, and — controlled — be replaced by the
  // parent's stale value on the next render.
  const reported = useRef(displayValue);
  if (composition === null) reported.current = displayValue;

  const pendingCaret = useRef<{ caret: number; value: string } | null>(null);

  // Where an edit started, for the edits handed to the browser. If the mask
  // rejects one outright there is no anchor to count toward — the characters
  // that would be counted are exactly the ones that got dropped — so the caret
  // goes back where the edit began. Like `inputType`, it is observed, not
  // inferred.
  const editOrigin = useRef<{ value: string; caret: number } | null>(null);
  const latest = useRef({
    mask,
    displayValue,
    storedValue: currentValue,
    onValueChange,
    insignificant: DEFAULT_INSIGNIFICANT,
  });

  latest.current = {
    mask,
    displayValue,
    storedValue: currentValue,
    onValueChange,
    insignificant: rendered?.insignificant ?? DEFAULT_INSIGNIFICANT,
  };

  /** Applies a value to the element and to state, then places the caret. */
  const commit = useCallback(
    (result: MaskRun, caret: number) => {
      const element = elementRef.current as HTMLInputElement | null;
      const nextCaret = result.caretOverride ?? caret;

      if (element) {
        element.value = result.value;
        // Only text-like controls expose a selection; guard so `type="email"`
        // and friends degrade instead of throwing.
        if (element.selectionStart !== null) {
          element.setSelectionRange(nextCaret, nextCaret);
        }
      }

      // Only a re-render can move the caret out from under us, and only a change
      // to what the field currently shows causes one. Arming it unconditionally
      // leaves an offset behind that gets applied to the next unrelated render.
      pendingCaret.current =
        result.value === latest.current.displayValue
          ? null
          : { caret: nextCaret, value: result.value };

      setStoredValue(result.value);

      // The element and the caret are still put right above — a rejected
      // keystroke has to be taken back out of the DOM — but nothing changed, so
      // there is nothing to report. `meta` is derived from the value, so an
      // unchanged value cannot carry changed metadata either.
      if (result.value === reported.current) return;
      reported.current = result.value;

      const meta: MaskChangeMeta = {
        raw: result.raw,
        completed: result.completed,
        ...(result.iso === undefined ? {} : { iso: result.iso }),
      };
      latest.current.onValueChange?.(result.value, meta);
    },
    [elementRef, setStoredValue],
  );

  const pushHistory = useCallback((entry: HistoryEntry) => {
    const state = history.current;
    // A rejected edit leaves the value where it was; it is not a step to undo.
    if (state.entries[state.index]?.value === entry.value) return;

    state.entries = [...state.entries.slice(0, state.index + 1), entry].slice(-MAX_HISTORY_ENTRIES);
    state.index = state.entries.length - 1;
  }, []);

  /**
   * Native `beforeinput` listener.
   *
   * Attached directly rather than through React's synthetic event so that
   * `inputType` is read from the real `InputEvent`.
   */
  useEffect(() => {
    const element = elementRef.current;
    if (!active || !element) return;

    const handleBeforeInput = (event: Event) => {
      const inputEvent = event as InputEvent;
      const currentMask = latest.current.mask;
      if (!currentMask) return;

      const inputType = inputEvent.inputType;
      const field = element as HTMLInputElement;
      const elementValue = field.value ?? '';
      editOrigin.current = null;

      if (inputType === 'insertCompositionText') {
        composing.current = true;
        setComposition(elementValue);
        return;
      }
      if (inputType === 'insertFromComposition') {
        composing.current = false;
        setComposition(null);
        return;
      }

      if (inputType === 'historyUndo' || inputType === 'historyRedo') {
        event.preventDefault();

        const state = history.current;
        const nextIndex = inputType === 'historyUndo' ? state.index - 1 : state.index + 1;
        const entry = state.entries[nextIndex];
        if (!entry) return;

        state.index = nextIndex;
        const result = runMask(currentMask, entry.value, {
          caret: entry.caret,
          previousValue: elementValue,
          inputType,
        });
        commit(result, entry.caret);
        return;
      }

      // Delimiter-aware deletes. The native operation removes a delimiter the
      // mask then re-inserts, so the value never changes and the field appears
      // stuck; the edit is performed here instead.
      const selection = getSelection(element);
      if (!selection) return;

      const { start, end } = selection;
      const collapsed = start === end;
      // The separators are whichever ones this mask calls separators. A resolver
      // that narrows `insignificant` would otherwise have its own significant
      // characters skipped over here, which is the stuck field again.
      const predicate = latest.current.insignificant;

      /** Cuts `[from, to)` out of the element value and re-masks what is left. */
      const deleteRange = (from: number, to: number) => {
        const nextRaw = elementValue.slice(0, from) + elementValue.slice(to);
        return {
          nextRaw,
          result: runMask(currentMask, nextRaw, {
            caret: from,
            previousValue: elementValue,
            inputType,
          }),
        };
      };

      /**
       * Whether the re-mask kept everything the cut did not ask for.
       *
       * A separator can be structural rather than decorative — the `-` in an L3
       * `/^[A-Z]{2}-\d{4}$/` is required, not re-inserted — and removing it makes
       * every character after it invalid, so the incremental filter drops the
       * lot: `'AB-1234'` comes back as `'AB'`. One keystroke must never cost the
       * rest of the value, so a cut that shrinks the content beyond the span it
       * removed is refused. Masks that *add* significant characters (a zero-pad)
       * are unaffected — only losing more than asked is disqualifying.
       */
      const keepsTheRest = (
        attempt: ReturnType<typeof deleteRange>,
        from: number,
        to: number,
      ): boolean => {
        const removed = stripInsignificant(elementValue.slice(from, to), predicate).length;
        const before = stripInsignificant(elementValue, predicate).length;
        return stripInsignificant(attempt.result.value, predicate).length >= before - removed;
      };

      /** Leaves the value alone and puts the caret at `caret`. */
      const stepOver = (caret: number) => {
        if (field.selectionStart !== null) field.setSelectionRange(caret, caret);
      };

      const applyDelete = (attempt: ReturnType<typeof deleteRange>, caretIn: number) => {
        // Nothing the mask will part with; leave value, caret and history alone
        // rather than committing an edit that changed nothing.
        if (attempt.result.value === elementValue) return;

        const caret = resolveCaret(attempt.nextRaw, caretIn, attempt.result);
        pushHistory({ value: attempt.result.value, caret });
        commit(attempt.result, caret);
      };

      if (inputType === 'deleteContentBackward' && collapsed && start > 0) {
        event.preventDefault();

        let from = start - 1;
        let attempt = deleteRange(from, start);
        const onSeparator = isInsignificantChar(elementValue[from], predicate);

        // The character holds the rest of the value up — an L3 pattern's
        // required literal, but just as easily one of its significant
        // characters. Stepping over is the only move left that does not throw
        // the tail away, whatever the mask calls the character.
        if (!keepsTheRest(attempt, from, start)) return stepOver(from);

        if (onSeparator) {
          // `backspace: false` — step over the delimiter without deleting.
          if (!allowsBackspaceThrough(currentMask)) return stepOver(from);

          // Reaching through is for the separator the mask puts straight back —
          // the case where a plain delete leaves the value unchanged. A separator
          // the user typed themselves, such as the decimal mark in `12.`, does
          // come out on its own, so the character before it is left alone.
          if (attempt.result.value === elementValue) {
            while (from > 0 && isInsignificantChar(elementValue[from - 1], predicate)) from -= 1;

            // The run starts the value — a currency sign, a dial code — so there
            // is nothing behind it to reach for. Step over it instead of
            // committing a delete that can never change anything: the browser's
            // own has already been suppressed, so returning here would leave the
            // key doing nothing at all, caret included.
            if (from === 0) return stepOver(0);

            from -= 1;
            const reached = deleteRange(from, start);
            if (!keepsTheRest(reached, from, start)) return stepOver(start - 1);
            attempt = reached;
          }
        }

        applyDelete(attempt, from);
        return;
      }

      if (inputType === 'deleteContentForward' && collapsed && start < elementValue.length) {
        event.preventDefault();

        let attempt = deleteRange(start, start + 1);

        // Same rule forward: a character that carries the tail is stepped over,
        // never removed.
        if (!keepsTheRest(attempt, start, start + 1)) return stepOver(start + 1);

        if (isInsignificantChar(elementValue[start], predicate)) {
          if (attempt.result.value === elementValue) {
            // Skip only the separators the mask restores, then delete the first
            // character it will actually let go of.
            let cut = start;
            while (cut < elementValue.length && isInsignificantChar(elementValue[cut], predicate)) {
              cut += 1;
            }
            if (cut < elementValue.length) {
              const reached = deleteRange(cut, cut + 1);
              if (!keepsTheRest(reached, cut, cut + 1)) return stepOver(cut);
              attempt = reached;
            }
          }
        }

        // A forward delete never moves the caret, wherever the cut landed.
        applyDelete(attempt, start);
        return;
      }

      // Everything else is left to the browser and re-masked on change; the
      // caret it started from is the change handler's fallback.
      editOrigin.current = { value: elementValue, caret: start };
    };

    element.addEventListener('beforeinput', handleBeforeInput);
    return () => element.removeEventListener('beforeinput', handleBeforeInput);
  }, [active, elementRef, commit, pushHistory]);

  /**
   * Resolves the composition.
   *
   * Masking is suspended while an IME composition is in flight, so the composed
   * text sits in the element unmasked and unreported. `insertFromComposition` is
   * the input type that would pick it back up, and Chrome and Firefox never send
   * one — they use `insertCompositionText` to the end and fire `compositionend`
   * *after* the last `input` event, so no change event follows either. This is
   * the only place left that can mask the composed text and report it.
   */
  useEffect(() => {
    const element = elementRef.current;
    if (!active || !element) return;

    const handleCompositionEnd = () => {
      // `insertFromComposition` already resumed masking, and the change event it
      // let through committed the text.
      if (!composing.current) return;

      composing.current = false;
      setComposition(null);

      const currentMask = latest.current.mask;
      if (!currentMask) return;

      const field = element as HTMLInputElement;
      const nextRaw = field.value ?? '';
      const caretInRaw = field.selectionStart ?? nextRaw.length;
      const result = runMask(currentMask, nextRaw, {
        caret: caretInRaw,
        previousValue: latest.current.displayValue,
        inputType: 'insertFromComposition',
      });
      const caret = resolveCaret(nextRaw, caretInRaw, result);

      pushHistory({ value: result.value, caret });
      commit(result, caret);
    };

    element.addEventListener('compositionend', handleCompositionEnd);
    return () => element.removeEventListener('compositionend', handleCompositionEnd);
  }, [active, elementRef, commit, pushHistory]);

  /**
   * Change handler — the path for every edit the browser applied itself, and the
   * fallback when `beforeinput` does not fire at all.
   */
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const element = event.target;
      const nextRaw = element.value;

      const currentMask = latest.current.mask;
      if (!currentMask) {
        // The mask is gone but the element is still ours to supply a value for,
        // so its edits have to keep landing in state or the field freezes.
        setStoredValue(nextRaw);
        return;
      }

      // An IME composition is mid-flight; masking now would fight the composer.
      if (composing.current) {
        setComposition(nextRaw);
        return;
      }

      const origin = editOrigin.current;
      editOrigin.current = null;

      const caretInRaw = element.selectionStart ?? nextRaw.length;
      const result = runMask(currentMask, nextRaw, {
        caret: caretInRaw,
        previousValue: latest.current.displayValue,
        ...(event.nativeEvent instanceof InputEvent && event.nativeEvent.inputType
          ? { inputType: event.nativeEvent.inputType }
          : {}),
      });

      // Nothing survived the mask: anchor counting would count the rejected
      // characters and walk the caret past them, leaving the next real one a
      // position too far right.
      const caret =
        origin && origin.value === result.value
          ? origin.caret
          : resolveCaret(nextRaw, caretInRaw, result);

      pushHistory({ value: result.value, caret });
      commit(result, caret);
    },
    [commit, pushHistory, setStoredValue],
  );

  /**
   * Reapplies the caret after render.
   *
   * The handlers place it as soon as they write the value, which is enough while
   * React leaves the DOM node alone. It does not always: re-rendering a
   * controlled input can rewrite `node.value`, and assigning a value collapses
   * the selection to the end. This puts it back, and is a no-op when it never
   * moved.
   */
  useLayoutEffect(() => {
    const pending = pendingCaret.current;
    if (pending === null) return;
    pendingCaret.current = null;

    const element = elementRef.current as HTMLInputElement | null;
    if (!element || element.selectionStart === null) return;
    // The offset was counted in a value the field has since moved on from; it
    // would land somewhere arbitrary in this one.
    if (element.value !== pending.value) return;
    if (element.selectionStart === pending.caret && element.selectionEnd === pending.caret) return;

    element.setSelectionRange(pending.caret, pending.caret);
  });

  /**
   * Surfaces an L3 pattern the matcher could not analyse. The mask degrades to
   * pass-through either way, but it must not do so silently: a consumer whose
   * regex uses a lookbehind would otherwise see no mask and no reason.
   */
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;

    const reason = rendered?.unsupportedReason;
    if (!reason || !mask || isMaskResolver(mask) || !('regex' in mask)) return;

    const source = typeof mask.regex === 'string' ? mask.regex : mask.regex.source;
    if (warnedPatterns.has(source)) return;
    warnedPatterns.add(source);

    // Required by the spec: an inert mask must say why. Stripped in production
    // by the `NODE_ENV` guard above.
    // eslint-disable-next-line no-console
    console.warn(
      `[spar] Input mask regex /${source}/ cannot be matched incrementally: ${reason}. ` +
        'The mask is inactive for this field; input passes through unmasked.',
    );
  }, [mask, rendered?.unsupportedReason]);

  return {
    active,
    controlled,
    value: displayValue,
    completed: rendered?.completed ?? false,
    onChange: handleChange,
  };
};
