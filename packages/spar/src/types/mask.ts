/**
 * Input mask types.
 *
 * Four layers, applied by `useMask` (see `.github/instructions/components/input.md` §10):
 *
 * - **L1 shape** — `blocks` + delimiters, pure positional string surgery.
 * - **L2 value semantics** — `date` / `time` / `number`, which additionally
 *   interpret the typed value: clamping it into a legal range, or regrouping it.
 * - **L3 incremental regex** — `regex`, matched one character at a time.
 * - **L4 resolver** — anything needing data Spar does not ship stays in
 *   userland behind {@link MaskResolver}.
 *
 * L1 and L3 are the *engine*: generic mechanics with no knowledge of any domain.
 * L2 is not a third engine branch — `date`, `time` and `number` are sugar for the
 * three resolvers Spar happens to ship (`createDateMask`, `createTimeMask`,
 * `createNumberMask`), built on this same {@link MaskResolver} contract and
 * nothing more. That is deliberate:
 * the hardest built-in mask uses only the extension point available to you, so
 * "write your own" is never the second-class option. Anything L2 can do — clamp
 * a value, regroup it right-to-left as it grows, emit a canonical
 * {@link MaskResolverResult.iso}, opt out of {@link MaskResolver.backspace} —
 * your resolver can do too.
 */

/** Date pattern token. `y` is a two-digit year, `Y` a four-digit one. */
export type MaskDateToken = 'd' | 'm' | 'y' | 'Y';

/** Time pattern token. */
export type MaskTimeToken = 'h' | 'm' | 's';

/** Fields shared by every mask kind. */
export interface MaskCommonOptions {
  /**
   * Single delimiter inserted between blocks.
   * @defaultValue ''
   */
  delimiter?: string;

  /**
   * Per-gap delimiters. Takes precedence over `delimiter` when non-empty.
   * Index `n` is the delimiter between block `n` and block `n + 1`.
   */
  delimiters?: string[];

  /** Uppercase the result. Locale-independent, like the Core/cleave behaviour. */
  uppercase?: boolean;

  /**
   * Lowercase the result. Spelled to match `uppercase`; the takeoff-spar wrapper
   * renames Core's `lowerCase` on the way in.
   */
  lowercase?: boolean;

  /**
   * When true, Backspace on a delimiter also removes the character before it.
   * @defaultValue true
   */
  backspace?: boolean;
}

/** L1 — pure shape mask. */
export interface MaskShapeOptions extends MaskCommonOptions {
  /** Character counts per block, e.g. `[2, 2, 4]` for `dd/mm/yyyy`. */
  blocks: number[];

  /** Strip every non-digit. */
  numericOnly?: boolean;

  /** Strip every non-letter. */
  letterOnly?: boolean;
}

/** Options for {@link createDateMask}. `blocks` are derived from `datePattern`. */
export interface MaskDateOptions extends MaskCommonOptions {
  date: true;

  /** @defaultValue ['d', 'm', 'Y'] */
  datePattern?: MaskDateToken[];

  /** Inclusive lower bound, ISO `YYYY-MM-DD`. */
  dateMin?: string;

  /** Inclusive upper bound, ISO `YYYY-MM-DD`. */
  dateMax?: string;
}

/** Options for {@link createTimeMask}. `blocks` are derived from `timePattern`. */
export interface MaskTimeOptions extends MaskCommonOptions {
  time: true;

  /** @defaultValue ['h', 'm'] */
  timePattern?: MaskTimeToken[];

  /** @defaultValue '24' */
  timeFormat?: '12' | '24';
}

/**
 * Options for {@link createNumberMask}.
 *
 * The one mask here with no fixed length, so it has no `blocks`: thousands
 * grouping is variable-width and applied right-to-left, which positional layout
 * cannot express. `uppercase` / `lowercase` and per-gap `delimiters` do not
 * apply to digits and are left out.
 */
export interface MaskNumberOptions extends Pick<MaskCommonOptions, 'backspace'> {
  number: true;

  /**
   * Grouping separator.
   *
   * Unlike L1, leaving it unset means "whatever this locale groups with", not
   * "nothing" — a number mask with no grouping is `delimiter: ''`.
   *
   * @defaultValue the locale's group separator
   */
  delimiter?: string;

  /**
   * Locale whose separators and group sizes the mask follows, read from
   * `Intl.NumberFormat`. This is also how lakh grouping is reached — `'en-IN'`
   * rather than a `numeralThousandsGroupStyle` enum.
   *
   * @defaultValue the runtime's default locale
   */
  numberLocale?: string;

  /**
   * Character that opens the fraction. Also accepted on input, so it is the key
   * the user presses.
   *
   * @defaultValue the locale's decimal separator
   */
  numberDecimalMark?: string;

  /**
   * Maximum fraction digits. `0` makes the field integer-only and the decimal
   * mark inert.
   *
   * @defaultValue 2
   */
  numberDecimalScale?: number;

  /**
   * Maximum integer digits. Unset leaves the field unbounded — the only Spar
   * mask without an implied capacity, since `blocks` is what bounds the others.
   */
  numberIntegerScale?: number;

  /** Reject the minus sign, so the value can only be zero or positive. */
  numberPositiveOnly?: boolean;
}

/**
 * L3 — incremental regex. Write the pattern for the FINAL value; partial states
 * are derived. The pattern is the whole specification, so `blocks` and
 * delimiters do not apply.
 */
export interface MaskRegexOptions extends Pick<MaskCommonOptions, 'uppercase' | 'lowercase'> {
  regex: RegExp | string;
}

/**
 * A generic engine pattern, discriminated by `regex`. Pure mechanics: `blocks`
 * lays characters out, `regex` accepts or rejects them. Neither knows about any
 * problem domain.
 */
export type MaskPattern = MaskShapeOptions | MaskRegexOptions;

/**
 * Sugar for the resolvers Spar ships, discriminated by `date` / `time` /
 * `number`.
 *
 * `{ date: true }` is shorthand for `createDateMask({ date: true })`; `useMask`
 * expands it on the way in. Passing the factory result yourself is identical.
 */
export type MaskPreset = MaskDateOptions | MaskTimeOptions | MaskNumberOptions;

/** Context handed to a {@link MaskResolver}. */
export interface MaskResolverContext {
  /** Caret offset in the incoming raw string. */
  caret: number;

  /** Last value this field rendered. */
  previousValue: string;

  /** The `beforeinput` inputType that produced this edit, when known. */
  inputType?: string;
}

/** What a {@link MaskResolver} returns. */
export interface MaskResolverResult {
  /** The formatted value. */
  value: string;

  /**
   * Caret offset in the returned value. **Omit it.** `useMask` derives the caret
   * by anchor counting. Set it only to override that — stripping a leading zero,
   * or inserting a decimal mark, where the count of significant characters
   * itself changes.
   */
  caret?: number;

  /**
   * Characters this resolver treats as separators; skipped on both sides of the
   * anchor count.
   * @defaultValue /[^\p{L}\p{N}]/u
   */
  insignificant?: RegExp;

  /**
   * Reported through {@link MaskChangeMeta.completed}.
   * @defaultValue true
   */
  completed?: boolean;

  /**
   * Value with separators stripped, reported through {@link MaskChangeMeta.raw}.
   * Return it when `insignificant` does not describe the split — a resolver that
   * groups thousands strips its own dots, but one that *adds* a currency symbol
   * has to say so.
   * @defaultValue `value` with every {@link MaskResolverResult.insignificant}
   * character removed
   */
  raw?: string;

  /**
   * Canonical machine value, reported through {@link MaskChangeMeta.iso}. Emit it
   * only once the value means something: `createDateMask` emits `YYYY-MM-DD`, an
   * IBAN resolver would emit the electronic format, a phone resolver E.164.
   */
  iso?: string;
}

/**
 * The full mask contract — not a fallback. Spar's own `date` and `time` masks are
 * resolvers written against this interface, so whatever they do is available to
 * you: card-type tables, phone region metadata, locale grouping rules.
 *
 * Return the formatted value only; caret placement stays inside `useMask`.
 *
 * @example
 * ```tsx
 * <Input.Field mask={(raw) => ({ value: formatIncompletePhoneNumber(raw, 'TR') })} />
 * ```
 */
export interface MaskResolver {
  (raw: string, ctx: MaskResolverContext): MaskResolverResult;

  /**
   * When true, Backspace on a separator also removes the character before it.
   * A property rather than a {@link MaskResolverResult} field because it is a
   * standing trait of the mask, not a per-keystroke outcome — `useMask` reads it
   * before deciding what the key does.
   *
   * @defaultValue true
   * @example
   * ```ts
   * const mask: MaskResolver = (raw) => ({ value: group(raw) });
   * mask.backspace = false;
   * ```
   */
  backspace?: boolean;
}

/** Anything accepted by the `mask` prop. */
export type Mask = MaskPattern | MaskPreset | MaskResolver;

/** Second argument of `onValueChange`. */
export interface MaskChangeMeta {
  /**
   * Value with delimiters stripped. `number` keeps its sign and decimal mark
   * here — those are part of the number rather than punctuation between blocks.
   */
  raw: string;

  /**
   * Every block filled — or, for L3, the pattern fully matched. `number` has no
   * blocks to fill, so it reports true once an integer digit exists.
   */
  completed: boolean;

  /**
   * Canonical machine value, when the mask defines one: `YYYY-MM-DD` for `date`,
   * `HH:mm[:ss]` for `time`, a `Number()`-parseable string for `number`, and
   * whatever a resolver returns as {@link MaskResolverResult.iso}. The built-ins
   * emit it only once `completed` is true.
   */
  iso?: string;
}
