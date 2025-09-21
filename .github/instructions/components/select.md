# Select — Glide Headless Instructions

## 1. Component Overview

- Purpose: Provide an accessible single-select (future-extensible to multi-select) form control for choosing one option from a finite list with rich customization and full keyboard support. Behavior only; consumer supplies styling and layout.
- Use cases: Form field selection, filtering, settings pickers, dropdown choices where native `<select>` is insufficient (virtualization, custom rendering, async loading, grouped options).
- Compound structure (exports):
  - `SelectRoot` – state + context provider
  - `SelectTrigger` – interactive element that toggles popup
  - `SelectValue` – displays currently selected option text or placeholder
  - `SelectIcon` – optional affordance (purely presentational, aria-hidden)
  - `SelectPortal` – optional portal mount (implementation detail wrapper)
  - `SelectContent` – positioned popup container (role=listbox)
  - `SelectViewport` – scrollable region (optional wrapper for list items)
  - `SelectGroup` – grouping wrapper
  - `SelectLabel` – accessible group label
  - `SelectSeparator` – non-interactive logical separator
  - `SelectItem` – selectable option (role=option)
  - `SelectItemText` – textual node used for typeahead string
  - `SelectItemIndicator` – selected visual marker hook (aria-hidden)
  - `SelectScrollUpButton` / `SelectScrollDownButton` – optional manual scrolling affordances
- Key differentiators: Deterministic SSR-safe ID generation, robust cyclic typeahead, granular `data-*` attributes, controlled/uncontrolled parity, form participation via hidden input (only when `name` provided), focus restoration, scroll-into-view with configurable alignment, collision-aware positioning left to consumer (we expose refs & advisory positioning hints only), focus model currently limited to `aria-activedescendant` (future expansion reserved), virtualization-friendly item registry.
- Non-goals (MVP): Multi-select semantics, internal positioning / collision measurement, virtualization engine, roving tabIndex alternative focus model (reserved for future without breaking changes).

## 2. API

All components are headless and polymorphic via an `as` prop (default intrinsic element indicated). They forward refs to the underlying DOM element. Strict TypeScript (no `any`). No implicit global state.

### Root (SelectRoot)
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | No | undefined | Controlled selected option value (string-only by design for form compatibility). |
| defaultValue | string | No | undefined | Uncontrolled initial value. Ignored if `value` provided. |
| onValueChange | (value: string) => void | No | — | Fired AFTER internal state commits (if uncontrolled) and only when value actually changes (no duplicate events). Synchronous within React event. |
| open | boolean | No | undefined | Controlled open state. |
| defaultOpen | boolean | No | false | Uncontrolled initial open state. |
| onOpenChange | (open: boolean) => void | No | — | Fired after open state is derived (post intent) and only on actual state change. |
| disabled | boolean | No | false | Disables trigger interaction. Prevents opening. |
| required | boolean | No | false | Marks hidden input as required (if `name`). |
| name | string | No | undefined | Hidden input name for form submission. If absent, no hidden input rendered. |
| id | string | No | auto | Base ID used to derive stable sub-IDs. Duplicate user-provided IDs produce a dev warning (no throw). |
| loop | boolean | No | true | Whether keyboard navigation wraps at bounds. |
| typeaheadDebounce | number (ms) | No | 350 | Time window to aggregate multi-char typeahead. |
| autoFocus | boolean | No | false | If true, focuses trigger on mount (effect). |
| dir | 'ltr'|'rtl' | No | inherit | Text direction for navigation & typeahead heuristics. |
| selectionFollowsFocus | boolean | No | false | If true, moving highlight updates selection immediately (no explicit commit). |
| positioning | { side?: 'top'|'bottom'|'left'|'right'; align?: 'start'|'center'|'end'; overlap?: boolean; collisionPadding?: number; } | No | { side:'bottom', align:'start' } | Advisory metadata only; no DOM measurement or auto-flip performed internally. Provided on `data-side` / `data-align`. |
| focusStrategy | 'active-descendant' | No | 'active-descendant' | Reserved for expansion; currently only supported value. Passing anything else dev-warns. |
| scrollAlignment | 'nearest'|'center'|'start'|'end' | No | 'nearest' | How highlighted item is scrolled into view when navigation occurs. |
| onHighlightChange | (value: string | null) => void | No | — | Fired whenever highlight changes (including null). Deduplicated. |
| filter | (optionText: string, typed: string) => boolean | No | prefix matcher | Custom typeahead match; should be pure. |
| disabledValues | string[] | No | [] | Additional option values forced disabled. Merged as: (item.disabled || disabledValues.includes(value)). |
| multi (roadmap) | boolean | No | false | Ignored in MVP (single-select). Dev warning if true (not implemented). |

Notes:
- Value typing: string-only to preserve straightforward hidden input participation; future enhancement may allow generic mapping while still serializing string value.
- Hidden input: `value` attribute mirrors current selection; omitted entirely if no `name`.
- Imperative handle: Attach ref to `SelectRoot` to receive methods (see below). Methods are stable (referentially) and no-op post unmount.

### Trigger (SelectTrigger)
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| as | Polymorphic | No | 'button' | Element to render. Must be focusable. |
| disabled | boolean | No | inherited | Local override (OR with root disabled). |
| aria-label | string | No | derived | Needed if no external label association. |
| preventFocusOnOpen | boolean | No | false | If true, focus stays on trigger (active-descendant model). Otherwise listbox container receives focus. |

### Value (SelectValue)
| Prop | Type | Required | Default | Description |
| placeholder | string | No | '' | Placeholder text when no selection. |
| as | Polymorphic | No | 'span' | Wrapper element. |

### Content (SelectContent)
| Prop | Type | Required | Default | Description |
| as | Polymorphic | No | 'div' | Container element (role=listbox applied to itself). |
| collisionPadding | number | No | 8 | Advisory padding forwarded via positioning metadata. |
| aria-label | string | No | — | Label if no external label; else `aria-labelledby` used. |
| inertFocusGuards | boolean | No | true | Inserts focus guards before/after when portal-ed. |

### Viewport (SelectViewport)
| Prop | Type | Required | Default | Description |
| as | Polymorphic | No | 'div' | Scroll container. |
| overscan | number | No | 2 | Advisory overscan count for virtualization. |

### Group (SelectGroup)
| Prop | Type | Required | Default | Description |
| as | Polymorphic | No | 'div' | Group wrapper (role=group). |
| labelId | string | No | auto | ID referenced by `aria-labelledby` on group. |

### Label (SelectLabel)
| Prop | Type | Required | Default | Description |
| as | Polymorphic | No | 'div' | Non-interactive label element. Must mount before associated items for ideal AT reading order. |

### Separator (SelectSeparator)
| Prop | Type | Required | Default | Description |
| as | Polymorphic | No | 'div' | Structural separator (role=presentation). |

### Item (SelectItem)
| Prop | Type | Required | Default | Description |
| value | string | Yes | — | Unique option value (dev warning on duplicate). |
| disabled | boolean | No | false | Non-interactive state. |
| textValue | string | No | derived from ItemText | Explicit string for typeahead if children complex. |
| as | Polymorphic | No | 'div' | Option container (role=option). |

### ItemText (SelectItemText)
| Prop | Type | Required | Default | Description |
| as | Polymorphic | No | 'span' | Text source node. |

### ItemIndicator (SelectItemIndicator)
| Prop | Type | Required | Default | Description |
| as | Polymorphic | No | 'span' | Visual marker region (aria-hidden). |

### Scroll Buttons (SelectScrollUpButton / SelectScrollDownButton)
| Prop | Type | Required | Default | Description |
| as | Polymorphic | No | 'div' | If interactive scrolling is provided, implement with role=button & appropriate `aria-label`. Otherwise mark aria-hidden. |

### Imperative Handle
`ref` to `SelectRoot` exposes: `{ open(), close(), toggle(), focus(), highlight(value: string | null), select(value: string) }`.
- `highlight(null)` clears highlight.
- All methods no-op if already in target state.

## 3. Behavior Matrix

| State | Trigger / Interaction | Result | ARIA / DOM Update |
|-------|-----------------------|--------|-------------------|
| Closed (default) | Click / Space / Enter on trigger | Opens listbox, highlights selected or first enabled | `aria-expanded=true`; content mounted with `role=listbox`; `aria-controls` references content id |
| Closed | ArrowDown on trigger | Open + highlight first enabled (or next after current selection) | Same as above |
| Closed | ArrowUp on trigger | Open + highlight last enabled | Same as above |
| Closed | Type character(s) | Open + highlight first matching item | `aria-expanded=true`; `aria-activedescendant` set |
| Closed | Trigger disabled activation | No action | No change |
| Open | Escape | Close & restore focus (unless user moved focus) | `aria-expanded=false`; content unmounted |
| Open | Tab | Close then allow normal tab forward | Same as close |
| Open | Shift+Tab | Close then move focus backward | Same as close |
| Open | Click outside / focus outside | Close & restore trigger focus (if focus still within select tree) | Same as close |
| Open | Enter / Space on trigger (no typeahead pending) | Close (commit selection unchanged) | `aria-expanded=false` |
| Open | ArrowDown (no highlight) | Highlight first enabled | `aria-activedescendant` updated |
| Open | ArrowUp (no highlight) | Highlight last enabled | `aria-activedescendant` updated |
| Open | ArrowDown | Move highlight to next enabled (wrap if `loop`) | `aria-activedescendant` updated |
| Open | ArrowUp | Move highlight to prev enabled (wrap if `loop`) | `aria-activedescendant` updated |
| Open | Home | Highlight first enabled | `aria-activedescendant` updated |
| Open | End | Highlight last enabled | `aria-activedescendant` updated |
| Open | Type character(s) | Move highlight to next matching item (cyclic) | `aria-activedescendant` updated |
| Open (highlighted) | Enter / Space | Commit selection; close unless `selectionFollowsFocus` true | `aria-selected` on item; hidden input value updated |
| Open (`selectionFollowsFocus=true`) | Arrow nav | Selection updates with highlight (list remains open until Escape/blur) | `aria-selected` transitions each move |
| Open | Pointer hover item | (Optional) Does NOT change highlight automatically (keyboard-driven highlight). Consumer may opt-in separately. | No mandated change |
| Open | Click on item (enabled) | Commit selection & close | Same as selection commit |
| Open | Click on highlighted selected item | Close (selection unchanged) | `aria-expanded=false` |
| Any | Disabled item navigation attempt | Skips item | `aria-disabled=true` present |
| Any | disabledValues contains item value | Item treated disabled | `aria-disabled=true` |
| Form submit | Native submission | Selected value included if `name` set | Hidden input present |
| Scroll Buttons active | Press / hold | Scroll viewport | No ARIA change |
| Open | highlight cleared (programmatic) | No selection change | `aria-activedescendant` removed (if focus model requires) |

Notes:
- Highlight is independent of selection unless `selectionFollowsFocus`.
- Typeahead reset occurs after debounce window or open state close.

## 4. Accessibility

- Roles: Trigger (`button[aria-haspopup="listbox"]`), Content (`div[role=listbox]`), Item (`div[role=option]`), Group (`div[role=group]`), Separator (`div role=presentation`).
- States / Props: `aria-expanded`, `aria-controls` (always on trigger referencing stable content id; safe even when closed), `aria-activedescendant` (on listbox or trigger depending on focus retention), `aria-selected`, `aria-disabled`, `aria-labelledby`, `aria-label`, future `aria-multiselectable` (not emitted until multi supported). No live region by default (developer can add externally if asynchronous loading announcements needed).
- Keyboard:
  - Trigger focused: Enter / Space / ArrowDown / ArrowUp open (see behavior matrix). Typeahead while closed opens & highlights.
  - Listbox focused or active-descendant model: ArrowUp/Down navigate; Home/End jump; Typeahead cycles; Enter/Space commit; Escape close; Tab / Shift+Tab close then move focus.
  - Prevent default on Space when it would scroll page.
- Focus management:
  - If `preventFocusOnOpen=true`, trigger retains focus; `aria-activedescendant` points at highlighted item id.
  - Else listbox container gets focus and items are not directly tab-focusable (managed active descendant or roving future strategy).
  - On close: focus returns to trigger only if focus is still within select subtree or trigger; if user moved focus elsewhere intentionally we do not steal focus.
- Highlight vs Selection: Distinct semantics surfaced through separate data attributes and ARIA (`aria-selected` only on selected). Highlight alone does not assert `aria-selected`.
- Disabled semantics: Use native `disabled` attribute when trigger is a native button; items use `aria-disabled=true`.
- Labeling:
  - External label: `<label for={triggerId}>` or `aria-labelledby` chain (trigger + external id(s)).
  - If none available, developer must provide `aria-label`.
- Groups: Each group sets `role=group` and `aria-labelledby=groupLabelId` referencing an internal or external `SelectLabel` element that appears before its items in DOM.
- Scroll management: Highlight change ensures item is visible via `scrollIntoView` with the configured alignment (layout effect, guards for SSR).
- RTL: ArrowLeft/ArrowRight currently ignored (future horizontal variant); Up/Down remain semantic vertical navigation; `dir` influences typeahead collations only if locale-specific ordering needed (developer-provided filter handles this).

## 5. Implementation Architecture

- State Hook: `useSelectState` maintains: open, value, highlight, typeahead buffer, items registry (ordered), disabled set (merged from per-item + `disabledValues`). Controlled/uncontrolled pattern: if prop is defined, internal state reads from prop; internal updates call callback but do not set state.
- Registry: Items register with value, disabled flag, textValue getter/ref. Order is mount order (React tree order). Duplicate value triggers dev warning and last registration wins.
- Contexts: Split contexts (StateContext / DispatchContext) to reduce re-renders; selectors may be provided in hooks for performance.
- Reducer Actions: OPEN, CLOSE, TOGGLE, REGISTER_ITEM, UNREGISTER_ITEM, HIGHLIGHT, SELECT, TYPEAHEAD_APPEND, TYPEAHEAD_CLEAR, UPDATE_DISABLED_SET.
- Side Effects: Performed in layout effects: focus shifts, scroll alignment, typeahead buffer clearing timer; all timers cleared on unmount.
- IDs: `baseId` stable (from prop or internal deterministic factory). Item id = `${baseId}-option-${index}` (index derived from current registry ordering). Stable so long as ordering consistent; virtualization changes must maintain ordering expectations.
- Focus Model: Only active-descendant for MVP; future addition (e.g., roving `tabIndex`) can expand `focusStrategy` without breaking existing usage because unsupported strategies currently warn and fallback.
- Typeahead: Buffer appended with printable chars; search begins at item AFTER current highlight; wraps; filter must be pure; resetting done via debounce timer or open->close.
- Positioning: Library does not measure or reposition; `positioning` prop only outputs advisory `data-side` / `data-align` & raw preferences to consumer via context/hook for integration with e.g. floating-ui.
- Virtualization: Not implemented. If consumer renders subset, they can opt to provide `aria-setsize` / `aria-posinset` via extended Item props (future). MVP leaves these off to avoid incorrect semantics.
- Dev Warnings: Duplicate item values, using `multi`=true, unsupported `focusStrategy`, missing `value` prop on item, trigger element not focusable.
- Error Handling: Silent no-ops for invalid highlight/select calls (value not registered).

## 6. Styling & Data Attributes

Expose only stateful hooks (no classes, no styles):
- Root: `data-select-root`, `data-state="open|closed"`, `data-disabled` (present when disabled)
- Trigger: `data-select-trigger`, `data-state`, `data-disabled`
- Content: `data-select-content`, `data-state`, `data-side`, `data-align`
- Viewport: `data-select-viewport`
- Group: `data-select-group`
- Label: `data-select-label`
- Separator: `data-select-separator`
- Item: `data-select-item`, `data-value="<value>"`, `data-disabled`, `data-highlighted`, `data-selected`
- ItemIndicator: `data-select-item-indicator`
- Scroll Buttons: `data-select-scroll-button`, `data-direction="up|down"`

Notes:
- Attributes only exist while nodes are mounted (content & items unmount on close removal).
- Consumers can differentiate highlight vs selection: `[data-select-item][data-highlighted]` vs `[data-select-item][data-selected]`.

## 7. Test Coverage Plan

Unit Tests:
- State transitions: open/close/toggle, selection commit, highlight wrap respecting `loop`.
- Controlled vs uncontrolled (value & open): internal state not mutated when controlled, callbacks fire correctly.
- `selectionFollowsFocus` immediate selection updates.
- Typeahead: single & multi-char, cyclic search, debounce clearing, custom `filter` invocation.
- Disabled navigation: skip disabled & `disabledValues` entries; merging precedence.
- Highlight clearing: `highlight(null)` behavior.
- Imperative handle: open/close/toggle/focus/highlight/select idempotency & no-ops after unmount.
- Scroll alignment: ensure scroll called with expected alignment (mock scrollIntoView).
- Prevent duplicate `onValueChange` for same value.

Accessibility Tests:
- Roles & attributes: trigger `aria-haspopup=listbox`, `aria-expanded` toggling, `aria-controls` stable id.
- `aria-activedescendant` updates with navigation.
- `aria-selected` only on chosen item; not on mere highlight.
- Keyboard flows: opening via Enter/Space/Arrows, navigation, Home/End, Escape, Tab / Shift+Tab closure, typeahead open-from-closed.
- Focus management: focus retention vs listbox focus; restoration on close; no focus theft when user moves focus.
- Disabled semantics: trigger disabled prevents open; item `aria-disabled=true`.
- Group labeling: `role=group` + `aria-labelledby` referencing label element.
- No duplicate IDs across multiple instances.

Integration Tests:
- Multiple Select instances isolation (independent highlights & selections).
- Form submission includes hidden input when `name` present; absence when `name` missing.
- Required + no selection triggers native validity message on form submit (where supported).
- Portal usage (if `SelectPortal`) preserves accessibility relationships & focus guards function.
- `preventFocusOnOpen` keeps focus on trigger & uses `aria-activedescendant`.
- Click outside & focus outside closing behavior.
- RTL: navigation still vertical; no horizontal conflict.
- Scroll buttons (if rendered) performing scroll without altering selection.

Negative / Warning Tests:
- Duplicate item value emits dev warning once.
- Using `multi` prop emits dev warning.
- Unsupported `focusStrategy` emits dev warning & falls back.

## 8. Constraints

- Zero styling or class names (only `data-*`).
- Headless: no DOM measurement for positioning (advisory only).
- Tree-shakeable named exports; no side effects at module top-level (except harmless id factory constants).
- TypeScript strict mode; no `any`; explicit public types exported.
- WCAG 2.2 AA alignment (keyboard operability, focus visibility left to consumer styling, semantic roles).
- Controlled & uncontrolled parity; no mixed mode anomalies.
- SSR deterministic IDs; avoid accessing window/document during render.
- Timers limited to typeahead debounce; all cleared on unmount.
- No lingering global listeners; all event listeners cleaned.
- Dev warnings only in non-production builds (guarded by NODE_ENV checks).

## 9. Migration & Implementation Checklist

### Implementation Steps
1. Implement `useControllableState` helper (if not existing) for value & open.
2. Build `useSelectState` reducer + actions (OPEN, CLOSE, TOGGLE, REGISTER_ITEM, UNREGISTER_ITEM, HIGHLIGHT, SELECT, TYPEAHEAD_APPEND, TYPEAHEAD_CLEAR, UPDATE_DISABLED_SET).
3. Create contexts (state / dispatch); expose hooks `useSelectContextState`, `useSelectContextDispatch`.
4. Implement `SelectRoot`: initialize state, ids, hidden input (if `name`), imperative handle, context providers, dev warnings.
5. Implement `SelectTrigger`: semantics, key handlers (Enter/Space/Arrows/typeahead), pointer click toggle, disabled gating, `aria-*` attributes.
6. Implement `SelectContent`: mount/unmount lifecycles, outside/focus-out listeners, escape handling, focus guards (if portal), listbox role assignment.
7. Implement item registration & cleanup; store textValue; compute highlight and selection states.
8. Implement navigation & typeahead logic (cyclic, skip disabled, debounce clearing timer, custom `filter`).
9. Implement selection commit logic respecting `selectionFollowsFocus`; ensure single `onValueChange` dispatch.
10. Implement scroll-into-view alignment strategy; guard for SSR.
11. Add data attributes across parts; ensure minimal re-renders (memo or stable selectors where needed).
12. Add dev warnings and ensure they are stripped / disabled in production builds.

### Quality Checklist
- No `any` types; public types exported from component index.
- `onValueChange` / `onOpenChange` not called redundantly.
- `aria-activedescendant` points to existing element id or is removed when highlight null.
- All timers cleared; no memory leaks after unmount (verified via test or inspection).
- Duplicate item values warn once.
- Hidden input absent when `name` undefined.
- Disabled items never focusable / selectable.
- No layout shift due to internal styles (none provided).

### Consumer Integration Checklist
- Provide external label (native <label> or `aria-label`).
- Style exclusively via `data-*` attributes (avoid relying on DOM shape).
- Integrate custom positioning (e.g. floating-ui) using trigger & content refs and advisory `positioning` prop.
- Ensure visible focus ring styling for trigger & optionally highlighted item.
- For async options: render loading state outside listbox or add custom live region (library does not announce automatically).

### Migration / Future Expansion Notes
- Multi-select: Introduce `multi` enabling set-based selection, add `aria-multiselectable`, change `onValueChange` signature or add `onValuesChange` (breaking → plan major version); maintain backward-compatible single value API under feature flag initially.
- Additional focus strategies: Add `'roving-tabindex'` and `'item'` strategies; ensure current prop gracefully handles new enums.
- Generic value typing: Add prop `getOptionValue?: (raw: T) => string` while maintaining serialized string for forms.
- Virtualization: Provide optional context API for total count & visible indices to allow automatic `aria-setsize` / `aria-posinset`.

