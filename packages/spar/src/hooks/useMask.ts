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

const getSelection = (element: HTMLElement): { start: number; end: number } => {
  const field = element as HTMLInputElement;
  const length = field.value?.length ?? 0;
  return {
    start: field.selectionStart ?? length,
    end: field.selectionEnd ?? field.selectionStart ?? length,
  };
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
  const [composingNow, setComposingNow] = useState(false);

  // Masked before render, so a consumer echoing back an unmasked value cannot
  // desync the display.
  const rendered = useMemo(
    () =>
      mask
        ? runMask(mask, currentValue, { caret: currentValue.length, previousValue: currentValue })
        : null,
    [mask, currentValue],
  );

  const displayValue = rendered && !composingNow ? rendered.value : currentValue;

  const history = useRef<{ entries: HistoryEntry[]; index: number }>({
    entries: [{ value: '', caret: 0 }],
    index: 0,
  });
  const pendingCaret = useRef<number | null>(null);
  const latest = useRef({ mask, displayValue, onValueChange });

  latest.current = { mask, displayValue, onValueChange };

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

      pendingCaret.current = nextCaret;
      setStoredValue(result.value);

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
      const { start, end } = getSelection(element);

      if (inputType === 'insertCompositionText') {
        composing.current = true;
        setComposingNow(true);
        return;
      }
      if (inputType === 'insertFromComposition') {
        composing.current = false;
        setComposingNow(false);
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
      const collapsed = start === end;
      const predicate = DEFAULT_INSIGNIFICANT;

      if (inputType === 'deleteContentBackward' && collapsed && start > 0) {
        let cut = start - 1;

        if (isInsignificantChar(elementValue[cut], predicate)) {
          if (!allowsBackspaceThrough(currentMask)) {
            // `backspace: false` — step over the delimiter without deleting.
            event.preventDefault();
            field.setSelectionRange(cut, cut);
            return;
          }
          while (cut > 0 && isInsignificantChar(elementValue[cut], predicate)) cut -= 1;
        }

        event.preventDefault();
        const nextRaw = elementValue.slice(0, cut) + elementValue.slice(start);
        const result = runMask(currentMask, nextRaw, {
          caret: cut,
          previousValue: elementValue,
          inputType,
        });
        const caret = resolveCaret(nextRaw, cut, result);
        pushHistory({ value: result.value, caret });
        commit(result, caret);
        return;
      }

      if (inputType === 'deleteContentForward' && collapsed && start < elementValue.length) {
        let cut = start;
        while (cut < elementValue.length && isInsignificantChar(elementValue[cut], predicate)) {
          cut += 1;
        }

        event.preventDefault();
        const nextRaw = elementValue.slice(0, cut) + elementValue.slice(cut + 1);
        const result = runMask(currentMask, nextRaw, {
          caret: cut,
          previousValue: elementValue,
          inputType,
        });
        const caret = resolveCaret(nextRaw, cut, result);
        pushHistory({ value: result.value, caret });
        commit(result, caret);
        return;
      }

      // Everything else is left to the browser and re-masked on change.
    };

    element.addEventListener('beforeinput', handleBeforeInput);
    return () => element.removeEventListener('beforeinput', handleBeforeInput);
  }, [active, elementRef, commit, pushHistory]);

  /** Clears the composition flag even when `insertFromComposition` never arrives. */
  useEffect(() => {
    const element = elementRef.current;
    if (!active || !element) return;

    const handleCompositionEnd = () => {
      composing.current = false;
      setComposingNow(false);
    };

    element.addEventListener('compositionend', handleCompositionEnd);
    return () => element.removeEventListener('compositionend', handleCompositionEnd);
  }, [active, elementRef]);

  /**
   * Change handler — the path for every edit the browser applied itself, and the
   * fallback when `beforeinput` does not fire at all.
   */
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const currentMask = latest.current.mask;
      if (!currentMask) return;

      const element = event.target;
      const nextRaw = element.value;

      // An IME composition is mid-flight; masking now would fight the composer.
      if (composing.current) {
        setStoredValue(nextRaw);
        return;
      }

      const caretInRaw = element.selectionStart ?? nextRaw.length;
      const result = runMask(currentMask, nextRaw, {
        caret: caretInRaw,
        previousValue: latest.current.displayValue,
        ...(event.nativeEvent instanceof InputEvent && event.nativeEvent.inputType
          ? { inputType: event.nativeEvent.inputType }
          : {}),
      });
      const caret = resolveCaret(nextRaw, caretInRaw, result);

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
    const caret = pendingCaret.current;
    if (caret === null) return;
    pendingCaret.current = null;

    const element = elementRef.current as HTMLInputElement | null;
    if (!element || element.selectionStart === null) return;
    if (element.selectionStart === caret && element.selectionEnd === caret) return;

    element.setSelectionRange(caret, caret);
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
    value: displayValue,
    completed: rendered?.completed ?? false,
    onChange: handleChange,
  };
};
