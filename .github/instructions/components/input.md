# Input — Spar Headless Instructions

## 1. Component Overview

The Input component provides accessible form input primitives with zero styling opinions. Supports native HTML input types with proper ARIA implementation and validation state management.

**Core Purpose:**

- Headless input behavior with full accessibility
- Native HTML semantics with enhanced ARIA support
- Validation state coordination between label, field, and error elements

**Compound Structure:**

- `InputRoot` - State provider with validation context
- `InputField` - Core input element (polymorphic: input/textarea)
- `InputLabel` - Associated label element
- `InputDescription` - Helper text element
- `InputErrorMessage` - Error announcement element

**Unique Value:**

- Pure behavior without styling constraints
- Context-driven state sharing for compound usage
- Native accessibility with enhanced screen reader support

## 2. API

### InputRoot Props

| Name       | Type        | Required | Default | Description             |
| ---------- | ----------- | -------- | ------- | ----------------------- |
| `id`       | `string`    | No       | `undefined` | Custom base ID for compound ARIA relationships |
| `invalid`  | `boolean`   | No       | `false` | Input validation state  |
| `disabled` | `boolean`   | No       | `false` | Input disabled state    |
| `required` | `boolean`   | No       | `false` | Input required state    |
| `readOnly` | `boolean`   | No       | `false` | Input read-only state   |
| `children` | `ReactNode` | No       | -       | Compound input elements |

### InputField Props

| Name   | Type          | Required | Default   | Description                   |
| ------ | ------------- | -------- | --------- | ----------------------------- |
| `as`   | `ElementType` | No       | `"input"` | Element type (input/textarea) |
| `type` | `string`      | No       | `"text"`  | HTML input type               |
| `autoFocus` | `boolean` | No       | `false` | Whether to focus field on mount |
| `mask` | `MaskPattern \| MaskPreset \| MaskResolver` | No | `undefined` | Input mask — shape, regex, the `date`/`time`/`number` sugar, or your own resolver. Omitted = today's behavior, unchanged. See §10 |
| `value` | *native* | No       | `undefined` | Controlled display value. Masked before render when `mask` is set |
| `defaultValue` | *native* | No      | `undefined` | Uncontrolled initial value. Masked on mount when `mask` is set |
| `onValueChange` | `(value: string, meta: MaskChangeMeta) => void` | No | `undefined` | Fires with the **masked** value plus `raw`/`completed`/`iso` metadata |

`mask` is the only new prop on the element's own surface. `value` and
`defaultValue` are **not redeclared** — they keep the element's native types
(`string | number | readonly string[]`), because `PolymorphicProps` omits any key
the own-props declare, so narrowing them to `string` would reject a `value={42}`
that compiles today. The mask coerces them with `String()` on the way in; an
array is joined. Without `mask` they fall through to the native element exactly
as before and `onValueChange` is never called.

**`onChange` under an active mask.** It still fires, after masking, so
`event.target.value` reads the masked value rather than the raw keystrokes. But
it follows the DOM event, and two operations produce no DOM event because the
field performs them itself — a delimiter-aware delete and an undo/redo (§10.7).
`onValueChange` fires for all of them and is the channel to use on a masked
field:

| Operation | `onChange` | `onValueChange` |
| --------- | ---------- | --------------- |
| typing, paste, drop, cut, word delete | yes | yes |
| Backspace/Delete across a delimiter | no | yes |
| undo / redo | no | yes |

### InputLabel Props

| Name       | Type        | Required | Default | Description   |
| ---------- | ----------- | -------- | ------- | ------------- |
| `children` | `ReactNode` | Yes      | -       | Label content |

**Auto-forwarded from context**: When used inside `InputRoot`, the following props are automatically forwarded from the Input context to the underlying `Label` component — no manual prop passing needed:

- `disabled` — mirrors `InputRoot`'s `disabled` prop
- `required` — mirrors `InputRoot`'s `required` prop
- `readOnly` — mirrors `InputRoot`'s `readOnly` prop
- `invalid` — mirrors `InputRoot`'s `invalid` prop

These produce corresponding `data-disabled`, `data-required`, `data-readonly`, and `data-invalid` attributes on the rendered label element for styling hooks.

### InputDescription Props

| Name       | Type        | Required | Default | Description         |
| ---------- | ----------- | -------- | ------- | ------------------- |
| `children` | `ReactNode` | Yes      | -       | Description content |

### InputErrorMessage Props

| Name       | Type        | Required | Default | Description   |
| ---------- | ----------- | -------- | ------- | ------------- |
| `children` | `ReactNode` | Yes      | -       | Error content |

## 3. Behavior Matrix

| State        | ARIA/DOM Result                                             |
| ------------ | ----------------------------------------------------------- |
| **Initial**  | Proper label association; `aria-invalid` reflects `invalid` |
| **Focus**    | Focus visible, label association announced                  |
| **Invalid**  | `aria-invalid="true"`, `aria-describedby` includes error ID |
| **Disabled** | `disabled` attribute, non-interactive                       |
| **Required** | `aria-required="true"` and `required` attribute             |
| **ReadOnly** | `readOnly` attribute, non-editable but focusable            |
| **Masked**   | Display value is always the masked projection of the raw input; `data-mask` present. See §10.4 |
| **Masked + incomplete** | `data-mask-completed` absent; `aria-invalid` is **not** forced — completeness is not validity |

## 4. Accessibility

### ARIA Implementation

```tsx
// InputField
aria-labelledby={labelId}
aria-describedby={invalid ? errorId : descriptionId}
aria-required={required}
aria-invalid={invalid}
disabled={disabled}

// InputErrorMessage
role="alert"
aria-live="assertive"
id={errorId}
```

### Keyboard Support

- Tab/Shift+Tab: Focus navigation
- All input keys: Text entry
- Enter: Form submission (input only)

## 5. Implementation Architecture

### Context Hook

```tsx
const useInputContext = () => {
  const id = useId();
  const invalid = false;
  const disabled = false;
  const required = false;
  const readOnly = false;

  return {
    fieldId: `${id}-field`,
    labelId: `${id}-label`,
    descriptionId: `${id}-description`,
    errorId: `${id}-error`,
    invalid,
    disabled,
    required,
    readOnly,
  };
};
```

### Component Structure

- **InputRoot**: Context provider with state management
- **InputField**: Ref forwarding to native input element
- **InputLabel/Description/ErrorMessage**: ID-based ARIA associations

### Events

- All native input events forwarded through InputField
- Focus/blur updates local `data-focused` state
- `InputField` supports standalone usage without `InputRoot` context

## 6. Styling & Data Attributes

### Data Hooks for Styling

**InputRoot**:

- `data-invalid` - When validation fails
- `data-disabled` - When input disabled
- `data-required` - When input required
- `data-readonly` - When input read-only

**InputField**:

- `data-focused` - When input focused
- `data-autofocus` - When autoFocus is enabled
- `data-disabled` - Disabled state (context or standalone)
- `data-required` - Required state (context or standalone)
- `data-readonly` - Read-only state (context or standalone)
- `data-mask` - When a `mask` is active (presence only, never the pattern)
- `data-mask-completed` - When the masked value fills every block

**InputLabel** (auto-forwarded from context):

- `data-disabled` - When input disabled
- `data-required` - When input required
- `data-readonly` - When input read-only
- `data-invalid` - When validation fails

## 7. Test Coverage Plan

### Unit Tests

- Context state management and ID generation
- ARIA attribute presence and values
- Event forwarding through InputField
- Mask engine (`utils/mask.ts`) as pure functions — L1 shape, L2 date/time clamp,
  `dateMin`/`dateMax` range, L2 `number` grouping
- Incremental regex matcher (`utils/regex-mask.ts`) — ported corpus, see §10.5
- Caret behavior (`hooks/useMask.ts`) — see §10.8 for the required case list

### Accessibility Tests

- `jest-axe` compliance for all states
- Label association verification
- Keyboard navigation testing

### Integration Tests

- Form submission workflows
- Validation state coordination
- Compound component composition

## 8. Constraints

- **Zero styling**: Pure behavior primitives only
- **Data attribute styling**: All visual state via `data-*` hooks
- **TypeScript strict**: Explicit types, no `any`
- **WCAG 2.2 AA**: Full accessibility compliance required
- **Tree-shakeable**: Named exports only

## 9. Implementation Checklist

**Phase 1: Core**

- [ ] Compound component structure
- [ ] Context provider with useId()
- [ ] TypeScript interfaces

**Phase 2: Accessibility**

- [ ] ARIA attributes implementation
- [ ] Label associations
- [ ] Error announcements

**Phase 3: Testing**

- [ ] Unit tests with jest-axe
- [ ] Keyboard navigation tests
- [ ] Integration scenarios

**Phase 4: Polish**

- [ ] Data attributes for styling
- [ ] JSDoc documentation
- [ ] Package exports

**Phase 5: Mask** (see §10)

- [ ] `src/utils/mask.ts` — L1 shape engine + L2 date/time/number sugar expansion (pure, zero deps)
- [ ] `src/utils/caret.ts` — anchor counting, unit-tested on its own; shared by
      L1/L2 and by resolvers (§10.7)
- [ ] `src/utils/regex-mask.ts` — L3 incremental matcher, ported with its test corpus (§10.5)
- [ ] `src/hooks/useMask.ts` — `beforeinput`-driven caret binding + state reconciliation (§10.7)
- [ ] `InputField` — `mask` / `value` / `defaultValue` / `onValueChange` wiring
- [ ] `MaskResolver` escape hatch for out-of-scope masks (§10.6)
- [ ] Caret test matrix (§10.8)

## 10. Mask

`Input.Field` takes a `mask` prop. While it is set the displayed value is the
masked projection of what was typed, and `onValueChange(value, meta)` is the
channel that reports every edit — deletes and undo/redo are applied imperatively
to the control, so they never surface as a React change event.

Masking intercepts every keystroke, rewrites the value and repositions the
caret. Under the component authoring contract those are Spar's
responsibilities — controlled/uncontrolled reconciliation and keyboard
behaviour — so the capability belongs here rather than in a wrapper. It adds
**zero dependencies**: Spar still has exactly one (`@floating-ui/react-dom`), and
`number` reaches `Intl` as a platform global.

No mask library is used. Only `maska` fits a one-dependency library's shape, and
it sells L1 alone — no clamping, no incremental regex, and a DOM-instance binding
that fights React controlled inputs. `imask` pulls `@babel/runtime-corejs3`,
`@react-input/mask` owns the input element, `inputmask` unpacks to 4.98 MB, and
`cleave.js` — what Takeoff Core v1 runs on — has not published since 2022-06-13.
Where behaviour parity with v1 matters the layers are ported from cleave; where
it does not, they are written from scratch.

### 10.1 Four layers

Masking splits by *what a layer needs in order to work*, and that split has four
parts rather than three. `regex` is the layer that breaks the pattern: pure
computation, yet not expressible as a shape.

| Layer | Fields | Needs | In Spar? |
| ----- | ------ | ----- | -------- |
| **L1 — shape** | `blocks`, `delimiter`, `delimiters`, `numericOnly`, `letterOnly`, `uppercase`, `lowercase`, `backspace` | Nothing. Positional string surgery. | **Yes** |
| **L2 — value semantics** | `date`, `datePattern`, `dateMin`, `dateMax`, `time`, `timePattern`, `timeFormat`, `number`, `numberLocale`, `numberDecimalMark`, `numberDecimalScale`, `numberIntegerScale`, `numberPositiveOnly` | Knowledge of what the digits *mean* — month ≤ 12, hour ≤ 23, February length, min/max range; or grouping that is variable-width and applied right-to-left. **Not expressible with `blocks`.** | **Yes** |
| **L3 — incremental regex** | `regex` | An incremental matcher: accept prefixes that could still become valid, reject those that cannot. Pure, but not positional. | **Yes** — see §10.5 |
| **L4 — resolver** | `creditCard*`, `phone*` | Card-type (BIN) tables and phone region metadata — data that churns on someone else's release schedule. All external-dependency pressure sits here. | **Formatting no** — resolver (§10.6). **Caret yes** — §10.7 |

L1–L3 land natively at zero dependencies. L4 is the only layer that would drag
data or packages in, and the only one pushed to userland.

**Only L1 and L3 are engine code.** They are generic mechanics — `blocks` lays
characters out, `regex` accepts or rejects a prefix — and neither knows about any
domain. L2 is not a third branch beside them: `date`, `time` and `number` are
*sugar for three resolvers Spar ships* (`createDateMask`, `createTimeMask`,
`createNumberMask`), written against the same L4 contract userland uses and given
nothing extra.

That is deliberate. A layer that special-cases one domain inside the engine
invites the question of where it stops — currency? IBAN? credit card? — and makes
every domain the engine *didn't* pick a second-class citizen. Building the
hardest built-in on the public extension point answers it instead: whatever
`date` can do, your resolver can do, `MaskResolverResult.iso` and
`MaskResolver.backspace` included. The factories are exported, so a built-in is
also composable — a resolver that defers to `createDateMask` and then rejects
weekends is an ordinary function.

**The line is drawn at data, not domain.** A preset ships only when L1+L3
genuinely cannot express it, the need is universal to the field, and it needs no
table that churns. `number` clears all three because `Intl.NumberFormat` is a
platform global. `creditCard*` and `phone*` fail the first and third and stay at
L4 (§10.9).

Coverage of v1's thirteen documented mask demos: **13/13** natively. None is left
to a userland resolver.

### 10.2 Types

`src/types/mask.ts` is the specification, with the per-field JSDoc. It is not
restated here — a second copy drifts, and the copy that used to live here did.

The union is discriminated by its `date` / `time` / `number` / `regex` members,
so `blocks` is required on L1 and unavailable elsewhere: a date pattern derives
its own blocks, a regex pattern has none, and `number` has no fixed length at
all. A consumer cannot desync them.

### 10.3 Ownership — the field reconciles

```txt
src/utils/mask.ts         L1 engine + L2 sugar          pure, dependency-free
src/utils/mask-shared.ts  string surgery, shared        pure, dependency-free
src/utils/mask-date.ts    createDateMask                pure, dependency-free
src/utils/mask-time.ts    createTimeMask                pure, dependency-free
src/utils/mask-number.ts  createNumberMask              pure, Intl only
src/utils/regex-mask.ts   L3 incremental matcher        pure, dependency-free
src/utils/caret.ts        anchor counting               pure, dependency-free
src/hooks/useMask.ts      caret + state reconciliation  behavior
InputField                mask / value / defaultValue / onValueChange
```

- `useControlledState` (already in `src/hooks/`) reconciles the value pair. No
  new hook infrastructure is introduced.
- `useMask` is **internal**. The package's public API (`src/index.ts`) exports
  only `./types` and `./components`; adding a public hooks surface is a separate
  decision and out of scope here.
- Controlled values are masked before render as well, so a consumer echoing back
  an unmasked value cannot desync the display.
- `mask` absent ⇒ `useMask` is inert and `InputField` behaves exactly as it does
  today, including caret handling. This must hold as a test (§10.8 case 10).

### 10.4 Value semantics (L2)

`date` and `time` are ported from `cleave.js@1.6.0` (`shortcuts/DateFormatter.js`,
`shortcuts/TimeFormatter.js`) so v1 and v2 fields agree, **except** at the six
points below. `number` is not a port.

`{ date: true }` is sugar: `presetResolver` in `src/utils/mask.ts` expands it,
so `mask={{ date: true }}` and `mask={createDateMask({ date: true })}` are the
same mask by construction rather than by convention. `time` and `number` follow
the identical shape.

**Date, per block, as the user types:**

| Block | Rule |
| ----- | ---- |
| `d` | `'00'` → `'01'`; first digit > 3 → zero-pad (`4` → `'04'`); value > 31 → `'31'` |
| `m` | `'00'` → `'01'`; first digit > 1 → zero-pad (`5` → `'05'`); value > 12 → `'12'` |
| `y` | 2-digit year |
| `Y` | 4-digit year, zero-padded once complete |

Once the pattern is complete: day clamped to the month's real length (February
respects leap years), then the whole date clamped into `[dateMin, dateMax]`.
Range clamping is skipped while the year block is still empty.

**Time, per block:**

| Block | Rule |
| ----- | ---- |
| `h` | `timeFormat: '24'` → first digit > 2 zero-pads, value clamped to 23. `'12'` → first digit > 1 zero-pads, value clamped to 12 |
| `m` | first digit > 5 zero-pads; value clamped to 59 |
| `s` | same as `m` |

**Deliberate deviations from the port.** Each is a defect in the source, at
`TimeFormatter.getFixedTime` / `DateFormatter`; the numbers match the
`DEVIATION n` comments in `src/utils/mask-date.ts` / `src/utils/mask-time.ts`.
Core still runs the unfixed version, so v1 and v2 differ here *by intent*.

1. Minutes are clamped with `Math.min(minute, 60)`; 60 is not a valid minute. We
   clamp to 59.
2. Seconds get the same `60` treatment. We clamp to 59.
3. Hours are clamped with `Math.min(hour, 60)`, ignoring `timeFormat`. We clamp
   to 23 (or 12).
4. The final pass re-clamps all three fields with `Math.min(field, 60)`, undoing
   the per-block work, so `60` minutes survives a complete value. We clamp with
   the real bounds.
5. A two-digit `y` year is compared against a four-digit ISO bound, so every `y`
   pattern with a `dateMin` clamps straight to it. A two-digit year is not
   comparable to an ISO bound, so we skip range clamping for `y` entirely —
   per-block clamps still apply. Use `Y` if you need a range.
6. `DateFormatter` calls `.split()` on `dateMin`/`dateMax` unconditionally. Ours
   accepts `undefined`.

**Four further choices the port does not settle:**

- `iso` is emitted only for patterns with a four-digit `Y` year — a two-digit
  year cannot produce an unambiguous ISO date. It replaces cleave's
  `getISOFormatDate()` / `getISOFormatTime()`, typed rather than stringly
  accessed.
- `uppercase` wins when both case flags are set.
- `letterOnly` filters on `\p{L}`, so it accepts non-ASCII letters. This is
  Core's field, not cleave's.
- An L3 pattern the matcher cannot analyse reports `completed: true`; reporting a
  degraded mask as permanently incomplete would let it block submit logic forever.

**Number.** cleave reaches grouping through `numeralThousandsGroupStyle`, an enum
that hardcodes three of the world's conventions (`thousand` / `lakh` / `wan`) and
cannot express a fourth. `src/utils/mask-number.ts` reads the same information off
`Intl.NumberFormat` instead:

```ts
new Intl.NumberFormat('en-IN').formatToParts(-11234567.5)
// …integer '1', group, integer '12', group, integer '34', group, integer '567'…
```

Group sizes are counted from the right — the last chunk is the *primary* group,
the one before it the *secondary*. Two integers express both thousand (3/3) and
lakh (3/2) grouping, and the separators come from the same call. Nothing is
tabulated, so the zero-dependency rule holds. `formatToParts` allocates, so
derived configurations are cached per locale tag exactly like the L3 matcher.

| Aspect | Rule |
| ------ | ---- |
| Grouping | Locale's group sizes and separator; `delimiter` overrides the character, `numberLocale` the sizes. `delimiter: ''` disables grouping |
| Leading zeros | Stripped unconditionally — a number mask that renders `007` is not rendering a number. A code that keeps them is an L1 `blocks` mask. cleave's `stripLeadingZeroes` flag is therefore not needed |
| Decimal mark | Exactly `numberDecimalMark`, plus ASCII `.` when the configuration uses `.` for neither role — so a numeric keypad works in a locale where `.` is unused. In `tr-TR` (`.` groups) it is *not* an alias, which keeps a pasted `1.234` intact |
| Second decimal mark | Ignored; only the first opens the fraction |
| `numberDecimalScale: 0` | Makes the decimal mark inert; the field is integer-only |
| Minus sign | ASCII only, accepted anywhere in the string, and rendered even with no digits yet — a typed `-` that displays nothing reads as a dropped keystroke. The mask *inserts* group separators and decimal marks, so those may be locale glyphs; the minus is *typed*, so it must round-trip through the keyboard |
| `completed` | True once an integer digit exists. `number` has no blocks to fill, so there is no other completion signal |
| `raw` | Group separators removed, sign and decimal mark kept — those are part of the number, not punctuation between blocks |
| `iso` | A `Number()`-parseable string with an ASCII `.`, emitted whenever `completed` |
| Caret | No override. Anchor counting handles every mid-string edit, and the two cases §10.7 flags as un-inferable — a stripped leading zero and a synthesised decimal mark — both land at the end of the value, where `useMask` anchors to the end anyway |

### 10.5 The regex matcher (L3)

A `RegExp` written for a *final* value rejects every intermediate state:
`/^[A-Z]{2}[0-9]{4}$/` does not match `"A"`. Masking asks the opposite
question — *could this prefix still become valid?* — so `src/utils/regex-mask.ts`
is an incremental matcher, ported from Core's `regex-mask-utils.ts` together with
its 201-line test corpus. Per candidate value it returns one of three verdicts:
`DONE`, `MORE`, `FAILED`.

A pattern it cannot analyse — back-reference, lookaround — degrades to
**pass-through**, never lockout. But it must not degrade *silently*: Core threw
the reason away in `catch { return null }`, so a consumer writing a lookbehind
got no mask and no signal, which is the worst failure mode this API has. The
compile result therefore carries the reason, and `useMask` emits one
`console.warn` naming the pattern and the reason — once per pattern, not per
keystroke, and stripped in production.

Because the pattern is the whole specification, L3 ignores `blocks`, `delimiter`
and `delimiters` — reflected in the type by `MaskRegexOptions` picking only
`uppercase` / `lowercase`.

### 10.6 The resolver contract (L4)

L4 masks need data Spar has no business shipping: card-type (BIN) tables, phone
region metadata. A resolver keeps that data in userland without adding a prop —
but only the *formatting* leaves Spar.

**It is the contract, not a fallback.** Spar's own presets are resolvers (§10.1),
so this interface is load-bearing for the built-ins too. Two fields exist because
of that: `iso`, so any mask can report a canonical machine value the way `date`
reports `YYYY-MM-DD`, and `backspace`, a property on the function because
`useMask` reads it before interpreting the key rather than after formatting. If a
built-in could do something a resolver could not, that would be a defect here —
cases 23–25 in §10.8 guard it.

**Caret placement stays inside Spar** (§10.7). It is the one thing that must live
in a single place; a resolver author deriving it from a length difference would be
re-implementing the exact diff heuristic §10.7 rejects, once per application. So a
resolver returns a string and nothing more:

```tsx
// phone — libphonenumber-js stays in the app's dependency graph, not Spar's
<Input.Field mask={(raw) => ({ value: formatIncompletePhoneNumber(raw, 'TR') })} />
```

`caret` remains on `MaskResolverResult` as an override for the two cases anchor
counting cannot infer (§10.7), and `inputType` reaches the resolver through
`MaskResolverContext` for anything more exotic. Core has the same shape already —
`dateFormatter`, `timeFormatter`, `phoneFormatter` are `any`-typed escape
hatches; `MaskResolver` is that idea with a real type and the hard half kept
inside the library.

Because the factories are exported, a built-in is a starting point rather than a
wall:

```tsx
const base = createDateMask({ date: true, delimiter: '/' });

// Same date behaviour, but only the 1990s count as complete.
const nineties: MaskResolver = (raw, ctx) => {
  const result = base(raw, ctx);
  return result.completed && !result.iso?.startsWith('199')
    ? { ...result, completed: false }
    : result;
};
```

### 10.7 Caret — `beforeinput`, not value diffing

This is the part no library solves, and the reason the binding must exist in
exactly one place. In a controlled React input, rewriting the value moves the
caret to the end; it has to be put back with `setSelectionRange`, in a layout
effect, at an offset that accounts for delimiters the mask just inserted or
removed.

cleave computes that offset by diffing the old and new value and *infers* what
the user did from the difference. A diff cannot distinguish a paste from typing,
or a forward delete from a backward one — it guesses, and the guesses are where
caret bugs live. The `beforeinput` event states the operation outright instead;
`event.inputType` is a fact:

| `inputType` | Handling |
| ----------- | -------- |
| `insertText` | Insert `event.data` at the selection, then mask |
| `insertFromPaste`, `insertFromDrop` | Insert, truncate at `sum(blocks)`, then mask |
| `deleteContentBackward` | If the caret sits on a delimiter and `backspace` is true, delete the character before it as well |
| `deleteContentForward` | Delete forward, stepping over delimiters |
| `deleteByCut`, `deleteWordBackward`, `deleteWordForward` | Delete the reported range, then mask |
| `insertCompositionText` | **Do not mask.** IME composition in progress |
| `insertFromComposition` | Composition committed — mask now |
| `historyUndo`, `historyRedo` | Serve from our own stack (below) |

Because the operation and the selection are both known before the value changes,
the post-mask caret offset is computed rather than guessed.

**The offset algorithm — anchor counting.** The operation gives the caret
position in the *raw* string; mapping it into the *masked* string is a second
step, and that step is not mask-specific. `useMask` counts the significant
characters before the caret, applies the mask, then walks the result until it has
passed the same count. Characters the mask inserts are skipped by both walks, so
the caret stays anchored to the character the user typed rather than to an offset
separators can shift. One implementation serves L1 delimiters, L2 presets and L4
resolvers, and is unit-tested on its own.

Significance is a predicate defaulting to "letter or digit": in `1.234.567,89`,
`+90 (532) 123 45 67` and `31/12/2025` the anchors are the digits. A resolver may
override it with `insignificant`.

Two cases anchor counting cannot infer, because they change the *number* of
significant characters rather than the separators between them: stripping a
leading zero, and typing a decimal mark. A resolver doing either returns an
explicit `caret`. That override is the exception, not the contract.

**One case the built-in layers hit too, closed by a rule rather than an
override.** L2 *synthesises* significant characters: `4` in a `d` block becomes
`04`, a digit the user never typed, so counting to "one digit in" would land
between the zero and the four. L2 is not a resolver and has no override
available, so `useMask` anchors by position instead: **an edit at the end of the
value leaves the caret at the end**, and only mid-string edits are anchor
counted. At the end there is nothing to count toward, so the rule costs nothing;
mid-string, no layer synthesises characters, so anchor counting is exact.

**A forward delete does not move the caret.** `Delete` behind a delimiter steps
over it and removes the character after, but the caret stays put — matching the
platform, where forward deletion consumes text ahead of the caret without
dragging it along.

**Undo/redo is handled, not a caveat.** Programmatic value writes destroy the
browser's native undo stack — true of every masking implementation — but
`beforeinput` reports `historyUndo` / `historyRedo`, so `useMask` serves them
from a small bounded stack of `{ value, caret }` entries. Ctrl+Z inside a masked
field works.

Two constraints on the implementation: `getTargetRanges()` is not implemented in
jsdom and must not be used — read `selectionStart` / `selectionEnd` off the input
element, which is all a non-`contenteditable` field needs. And if `beforeinput`
never fires (a programmatic write, or a browser that skips it for an operation),
`useMask` still masks correctly on the `input` event using the value diff:
precision is lost, not correctness. The engine is the same in both paths; only
the caret offset source differs.

### 10.8 Required test cases

This list is the acceptance criteria for `useMask`. Cases 23–25 are the
architectural ones: they fail if a built-in mask ever regains a privilege a
userland resolver does not have (§10.1).

| # | Case | Expectation |
| - | ---- | ----------- |
| 1 | Type sequentially | Delimiters appear automatically; caret stays after the last typed character |
| 2 | Insert mid-string | Caret lands after the inserted character, not at the end |
| 2b | Insert at the end | Caret stays at the end, including when L2 synthesises a digit (`4` → `04`) |
| 3 | Backspace over a delimiter | `backspace: true` removes the preceding character too; `false` steps over it |
| 4 | Forward delete (Delete key) | Deletes forward, stepping over delimiters; the caret does not move |
| 5 | Type over a selected range | Selection replaced, caret after the replacement |
| 6 | Paste longer than the mask | Truncated at `sum(blocks)`; caret at the end of the accepted text |
| 7 | Paste an already-masked value | Idempotent — no doubled delimiters |
| 8 | IME composition | No masking during `insertCompositionText`; applied on `insertFromComposition` |
| 9 | Controlled echo | A consumer writing back an unmasked value does not shift the caret |
| 10 | `mask` omitted | Caret untouched; component identical to current behavior |
| 11 | Undo / redo | Ctrl+Z and Ctrl+Shift+Z restore previous `{ value, caret }` pairs |
| 12 | `input` without `beforeinput` | Diff fallback masks correctly (§10.7) |
| 13 | L2 clamp while typing | `4` → `04` in a `d` block, so `45` becomes `04/05` and never reaches the clamp; `35` → `31`; hour `9` → `09` |
| 14 | L2 range clamp | A date past `dateMax` snaps to `dateMax`; range ignored while the year is empty |
| 15 | L3 prefix acceptance | `/^[A-Z]{2}[0-9]{4}$/` accepts `A`, `AB`, `AB1`; rejects `A1` |
| 16 | L3 unanalysable pattern | `createIncrementalMatcher` returning `null` degrades to pass-through, never lockout |
| 16b | L3 unanalysable pattern warns | One dev-mode `console.warn` carrying the pattern and the matcher's reason; not repeated per keystroke; absent in production |
| 17 | Resolver context | `MaskResolver` receives `caret`, `previousValue`, `inputType` |
| 18 | Resolver caret, unaided | A resolver returning `{ value }` only: caret stays on the typed character when a separator is inserted before it |
| 19 | Resolver caret override | A returned `caret` wins over anchor counting |
| 20 | Anchor counting is shared | The same offset algorithm is exercised through an L1 delimiter mask and through a resolver, with identical results |
| 21 | Numeral resolver | Typing mid-string in `1.234.567` keeps the caret on the typed digit after the separators shift; deleting one digit does not drop the caret across a removed separator. Kept as a *userland* resolver even though `number` now ships: the built-in must not be the only way to reach this |
| 22 | `insignificant` override | A resolver whose separators are alphanumeric anchors correctly once it supplies the predicate |
| 23 | The built-ins are resolvers | `mask={{ date: true }}` and `mask={createDateMask({ date: true })}` behave identically, `iso` included; a resolver wrapping `createDateMask` composes with no extra API |
| 24 | A resolver reports `iso` and `raw` | A userland resolver's `iso` reaches `MaskChangeMeta.iso` exactly as `date`'s does; `raw` defaults to the value minus `insignificant` characters and an explicit `raw` wins |
| 25 | A resolver opts out of backspace-through | `resolver.backspace = false` steps over the separator, matching an L1 pattern with the same flag |
| 26 | `number` | Regroups while typing with the caret held against separators inserted to its left; the locale decimal mark opens the fraction and supplies a leading `0`; `raw` keeps the mark, `iso` parses with `Number()`; `numberIntegerScale` bounds the integer part; the sugar and `createNumberMask` are identical and the built-in wraps like any function |

### 10.9 Out of scope

Named explicitly so the boundary is reviewable. Of Core's 46 `IInputMaskOptions`
fields, these 22 do **not** come to Spar:

`creditCard`, `creditCardStrictMode`, `creditCardType`, `phone`,
`phoneRegionCode`, `phoneFormatter`, `prefix`, `prefixLength`,
`noImmediatePrefix`, `tailPrefix`, `signBeforePrefix`, `rawValueTrimPrefix`,
`swapHiddenInput`, `initValue`, `result`, `maxLength`, `blocksLength`,
`delimiterLength`, `delimiterLazyShow`, `copyDelimiter`, `dateFormatter`,
`timeFormatter`.

| Group | Fields | Reason |
| ----- | ------ | ------ |
| L4 data tables | `creditCard*`, `phone*` | Both need a table that churns on someone else's release schedule, and neither is universal enough to earn a preset. Formatting goes to a resolver (§10.6), the caret stays in `useMask` (§10.7) |
| Derived | `blocksLength`, `delimiterLength`, `prefixLength`, `maxLength` | Computed internally, never accepted as props |
| cleave internals | `swapHiddenInput`, `result`, `initValue`, `copyDelimiter`, `delimiterLazyShow` | Implementation details of a library we do not use |
| Superseded | `dateFormatter`, `timeFormatter` | Replaced by `MaskChangeMeta.iso` plus `MaskResolver` |
| Answered by the compound | `prefix*`, `signBeforePrefix` | A currency symbol or unit belongs in `Input.Prefix` / `Input.Suffix`, which sit *outside* the value: no stripping, no caret override, no "can the user delete the symbol" semantics. Across all of `takeoff-ui/docs`, `prefix` is used as a *mask* option zero times |
| Absorbed | `numeral*`, `stripLeadingZeroes` | Now the `number` preset: `numeralThousandsGroupStyle` became `numberLocale` + `delimiter`, and stripping leading zeros is unconditional rather than a flag |

`regex` is **not** on this list; it is in scope as L3 (§10.5).

**Pattern strings are also out of scope.** The `mask="AAA-999"` /
`"(999) 999-9999"` form that imask, react-input-mask and maska expose is not part
of this API, because every such pattern has an L3 equivalent:

| Pattern-string form | L3 equivalent |
| ------------------- | ------------- |
| `"999-999"` | `{ regex: /^[0-9]{3}-[0-9]{3}$/ }` |
| `"AAA-999"` | `{ regex: /^[A-Z]{3}-[0-9]{3}$/, uppercase: true }` |
| `"(999) 999 99 99"` | `{ regex: /^\([0-9]{3}\) [0-9]{3} [0-9]{2} [0-9]{2}$/ }` |

What is missing is brevity, not expressiveness, and the shorter spelling is not
free: `numericOnly` / `letterOnly` are whole-value flags, not per-block ones, so a
pattern string cannot compile down to L1 — it would need its own per-block
character-class compiler, and would open a second way to say what L3 already
says. Core does not offer this form either, so declining it is not a regression.
Revisit if real usage asks for it.

### 10.10 Decisions

Recorded because the reasoning constrains the implementation. All three are
closed; **M1 is superseded by M3** and kept for the audit trail.

| # | Decision | Resolution |
| - | -------- | ---------- |
| **M1** *(superseded by M3)* | `numeral` — the one demo L1–L3 do not cover | **Resolver-served, caret retained.** Rejected: a native L1.5 engine branch, which buys the thirteenth demo by pulling thousands-separator caret work and `numeralThousandsGroupStyle` locale tables into a zero-dependency package. What changed against the original framing: the resolver no longer computes its own caret, because anchor counting (§10.7) is machinery `useMask` needs for L1 delimiters anyway. This is why `MaskResolverResult.caret` is documented as an override rather than a duty, and why anchor counting is a shared, separately-tested unit rather than a detail of the L1 engine. |
| **M2** | `lowerCase` spelling | **Normalised to `lowercase`.** `uppercase` / `lowercase` is the consistent pair; `lowerCase` is cleave's inconsistency, which Core copied verbatim. The rename lands in the takeoff-spar wrapper, which already translates `maskOptions` into `mask`. |
| **M3** | Does anything else deserve a preset beside `date` / `time`? | **`number` ships as the third resolver factory; nothing else does.** M1 rejected a native engine branch and that rejection stands — but it never considered a *shipped resolver factory*, because the pattern did not exist yet (`date` and `time` only became factories after M1). A factory touches the engine not at all, so M1's stated cost is not this option's cost. `number` is also the one domain every library ships and only it: cleave has `numeral`, imask `MaskedNumber`, `react-number-format` exists for nothing else, and React Aria and Base UI ship a `NumberField` while shipping no mask at all. Three cleave options are dropped rather than translated: prefix/suffix (above), a min/max range (a number has no completion signal, so clamping would fight the user mid-keystroke — that belongs in validation, and it is also why imask's `MaskedRange` is not adopted: it would put clamping back into the engine), and `fixedDecimalScale` (padding to scale is a blur-time affordance, and this layer never sees blur). |

**One critique this does not answer, recorded because it is real.** React Aria and
Base UI decline to mask dates at all, and their reason is that a fixed mask
pattern hardcodes one locale's field order — which Spar's `datePattern` default of
`['d', 'm', 'Y']` does. That is an argument for a *segmented* date/time field as a
separate primitive, not for more presets here, and it belongs with the timepicker
work rather than with the mask.
