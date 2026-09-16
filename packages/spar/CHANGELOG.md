# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Accordion

#### Fixed

- **Arrow, Home and End keys skip disabled items.** Navigation previously
  tried to focus the disabled trigger and stalled there; it now moves to the
  next enabled trigger, wraps around, and Home/End land on the first/last
  enabled item.
- **Keyboard navigation follows DOM order** and keeps working after an item is
  inserted between existing ones or replaced by another (shared item registry
  fix, also used by Radio, Select and Tabs).

### Breadcrumb

#### Fixed

- **Consumer `onClick` / `onKeyDown` on `Breadcrumb.Link` are composed, not
  replaced.** They run first, and `preventDefault()` skips `onPress` /
  `onNavigate`; Enter calls `onPress` exactly once.
- **Disabled links only block the activation keys.** Enter/Space are
  prevented; every other key still reaches the consumer `onKeyDown`.

### Button

#### Fixed

- **Inert anchors no longer navigate.** While `disabled` or `isLoading`, a
  non-native element cancels the click's default action, and `as='a'`
  additionally drops `href`.

### Checkbox

#### Added

- **`indeterminate` prop.** Layers the mixed state over `checked` /
  `defaultChecked` without owning the value, giving uncontrolled checkboxes a
  first-class way to enter and leave the indeterminate state; a toggle still
  fires `onChange(true)` and advances the internal state underneath.

### Dialog

#### Fixed

- **Render-prop `open()` and `toggle()` no longer bypass `disabled`.** Calling
  them from a disabled `Dialog.Trigger` is a no-op and does not fire
  `onOpenChange`; `close()` remains available.

### DropdownMenu

#### Fixed

- **`onEscapeKeyDown`, `onPointerDownOutside` and `onFocusOutside` now honour
  `event.preventDefault()`.** The Escape handler runs before the menu acts on
  the key and the veto is read from the native event; outside pointer-down and
  outside focus no longer close unconditionally. For modal menus, preventing
  default in `onFocusOutside` skips the focus recapture; for non-modal menus it
  keeps the menu open.

### Popover

#### Fixed

- **`onOpenAutoFocus` can now veto the open-time auto-focus.** The handler
  receives a cancelable event before focus moves into the content;
  `event.preventDefault()` skips the focus move (previously it fired after
  focusing with a non-cancelable event).
- **`onFocusOutside` / `onInteractOutside` can now keep the popover open on the
  focus path.** Native `focusin` is not cancelable, so handlers receive a
  cancelable `focusoutside` `FocusEvent` dispatched on the newly focused
  element; `event.preventDefault()` prevents the close, matching the pointer
  path.
- **`Popover.Trigger` now receives the documented `${id}-trigger` id.** A
  consumer-supplied `id` prop still overrides it.

### Radio

#### Fixed

- **`Radio.Item` renders a `<span role="radio">` by default instead of
  `<label>`.** ARIA in HTML allows no role on `<label>`, so every item failed
  axe's `aria-allowed-role`; the item's text still names the radio and the
  native input stays `aria-hidden`. Selectors such as `label[role="radio"]`
  need updating.
- **The selected value reaches native form data exactly once.** The root's
  extra `<input type="hidden">` was removed; each item's visually hidden
  `<input type="radio">` is the only native representation and still carries
  `required` for native validity.
- **`onChange` fires only when the value actually changes.** Clicking or
  `select()`-ing the already-checked item no longer re-emits the same value.
- **A `readOnly` group no longer changes its value from the keyboard.** Arrow
  keys and Home/End still move focus.
- **`aria-readonly` moved from the items to the radiogroup**, the only role
  that permits it.
- **The group stays reachable when the checked item is disabled.** The first
  enabled item becomes the tab stop.
- **Toggling `disabled` on a middle item keeps the arrow-key order.**
  Re-enabled items resume their DOM position instead of moving to the end.

#### Changed

- **Consumer `onKeyDown` / `onFocus` / `onBlur` on `Radio` and `onClick` /
  `onKeyDown` / `onFocus` on `Radio.Item` are composed with the built-in
  handlers.** The consumer handler runs first; `event.preventDefault()` vetoes
  the built-in navigation or selection.
- **Enter selects the focused item when `selectOnFocus` is `false`**, matching
  the documented Space/Enter behavior.

### Select

#### Fixed

- **`onEscapeKeyDown` can now veto the close.** The handler receives the native
  event, and the close checks that same event's `defaultPrevented` instead of
  the synthetic snapshot.
- **`onCloseAutoFocus` is now called.** Fires when the listbox closes from
  inside (Escape, Enter/Space, Tab, item click) right before focus returns to
  the trigger; `preventDefault()` keeps focus where it is. Not called for
  outside-pointer dismissal, which moves no focus.
- **Initially-open selects receive focus.** With `defaultOpen` or a controlled
  `open` on mount, the listbox is focused after mount so Escape, arrows and
  Enter work without reopening.

#### Changed

- **`Select.Separator` is presentational by default.** Renders
  `role="presentation"` + `aria-hidden="true"` so a `listbox` no longer fails
  `aria-required-children`; pass `role='separator'` to restore separator
  semantics.

### Tabs

#### Fixed

- **`onValueChange` no longer fires on mount.** The automatic first-tab
  selection (uncontrolled, no `value` / `defaultValue`) is derived from the
  first tab in DOM order instead of being written through the change handler,
  so consumers only hear about user-driven changes. It also follows the next
  first tab if the selected one unmounts instead of leaving nothing selected.
- **`onValueChange` only fires when the value actually changes.** Clicking,
  pressing Enter/Space on, or navigating back onto the already selected tab no
  longer re-reports the same value.
- **Enter and Space respect `disabled` on non-button triggers.** In manual
  activation mode a focused disabled `Tabs.Trigger` rendered with `as` (e.g.
  `as='div'`) could still be selected from the keyboard.

### Tooltip

#### Fixed

- **`onEscapeKeyDown` now fires for Escape on the trigger and honours
  `preventDefault`.** The callback never ran while focus was on the trigger and
  the documented veto was ignored; it now runs before the internal close for
  Escape on the trigger, inside the content, or anywhere in the document, and
  `preventDefault()` on the received event keeps the tooltip open.
- **Consumer `onKeyDown` on `Tooltip.Content` is composed with the internal
  Escape handler** instead of replacing it.

#### Changed

- **Removed the unused `onPointerDownOutside`, `onOpenAutoFocus` and
  `onCloseAutoFocus` props from `Tooltip.Content`.** They were never called and
  were forwarded to the DOM, producing unknown-prop warnings (type-level
  breaking change only).

## [0.2.3] - 2026-09-12

### Dialog

#### Fixed

- **`preventDefault()` in `onEscapeKeyDown` now keeps the dialog open.** The
  handler receives the native `KeyboardEvent`, but the close check read the
  React event, which never sees a `preventDefault` made on the native one, so
  the veto was ignored.
- **Closing moves focus back to the element that opened the dialog.**
  `DialogContent` cleared the stored element on close before `Dialog` could
  read it, so `restoreFocus` (on by default) never restored focus.

## [0.2.2] - 2026-09-08

### Input — Masking

#### Added

- **`Input.Field` now accepts a `mask` prop.** A mask can be a shape pattern
  (`blocks`, `delimiter`/`delimiters`, `numericOnly`, `letterOnly`,
  `uppercase`/`lowercase`), a regex pattern (`regex`), one of the built-in
  presets (`{ date: true }`, `{ time: true }`, `{ number: true }`), or a custom
  `MaskResolver` function. Omitting `mask` leaves the field's behaviour
  unchanged.
- **`onValueChange(value, meta)` on `Input.Field`**, fired only while `mask` is
  set. It reports the masked value plus `raw`, `completed` and `iso` metadata,
  and also fires for changes the mask applies itself (delimiter-aware deletes,
  undo) that never surface as a DOM `change` event. Prefer it over `onChange`
  on a masked field.
- **`useMask` hook** exported for building masked inputs outside `Input.Field`,
  along with `UseMaskOptions` / `UseMaskReturn`.
- **Built-in mask factories exported** — `createDateMask`, `createNumberMask`
  and `createTimeMask` — so a preset can be composed, wrapped or extended with
  the same tools userland has.
- **Mask types exported** from the package root: `Mask`, `MaskPattern`,
  `MaskPreset`, `MaskResolver`, `MaskResolverContext`, `MaskResolverResult`,
  `MaskChangeMeta`, and the per-kind option interfaces.

#### Fixed

- Corrected caret mapping, delimiter-aware deletes, IME composition handling and
  regex bounds in the masking engine.
- **`Input.Field` may now set its own `disabled`, `required` and `readOnly`**
  instead of always deferring to the surrounding `Field` context.

## [0.2.1] - 2026-07-14

### DropdownMenu / Select — Scrollable Viewport

#### Added

- **`DropdownMenu.Viewport`** — an optional scrollable wrapper inside
  `DropdownMenu.Content` for long menus.
- **`Select.Viewport`** — the matching scrollable part for `Select.Content`,
  implemented as a pure styling wrapper so both components behave the same.

#### Fixed

- The highlighted item is now kept in view from `DropdownMenu.Content` using
  native `scrollIntoView`.
- Documented `Content`'s `align` default correctly as `'center'`.

## [0.2.0] - 2026-06-24

First stable release of the 0.2 line, promoting the 0.2.0-beta series to the
`latest` dist-tag (previously `latest` was 0.1.4). It bundles all changes since
0.1.4 — the Field primitive and form-control integration, the Accordion rework,
the Select API simplification, and the Label/Field `optional` rename — together
with the new Toast component below.

### Toast — New Component

#### Added

- **New headless `Toast` primitive** for accessible, imperatively-driven
  notifications. `createToaster()` returns a controller that can `update`,
  `dismiss`, `clear`, and wrap a `promise`; the render-prop `<Toaster>`
  component renders the live queue, and the `Toast` namespace
  (`Toast.Root`, `Toast.Title`, `Toast.Description`, `Toast.Action`,
  `Toast.Close`) composes each item. `useToastContext` exposes per-item state.
- Configurable `placement`, `duration`, `maxVisibleToasts`, `overlap` stacking,
  and default toast `type`.
- Available as a tree-shakeable sub-path export: `@turkish-technology/spar/toast`,
  matching the per-component export convention used by the rest of the library.

## [0.2.0-beta.2] - 2026-06-17

### Label — `isOptional` Renamed to `optional`

#### Changed

- **`Label`'s `isOptional` prop renamed to `optional`** to drop the redundant
  `is` prefix and align with the other boolean state props (`required`,
  `disabled`, `readOnly`, `invalid`). The emitted `data-optional` attribute is
  unchanged, so styling hooks keep working.

#### Migration

- Replace `<Label isOptional>` with `<Label optional>`.

### Field — `optional` Prop Added

#### Added

- **`Field` root now accepts an `optional` prop**, mirroring the other field
  state props. It propagates through Field context to nested controls and the
  `FieldLabel`, and is exposed via `data-optional` for styling.

## [0.2.0-beta.1] - 2026-05-20

### Select — Initial Render Label Bug Fix

#### Fixed

- The trigger now shows the selected item's `label` on the very first paint when
  `defaultValue` (or controlled `value`) is set. Previously the trigger flashed
  the placeholder until the user opened the dropdown once, because items were
  registered in a regular effect (post-paint) and the root context value did not
  depend on the items map, so consumers never re-rendered after registration.
- Item registration moved from `useEffect` to `useLayoutEffect` (with an SSR
  fallback) so registration commits before paint.
- `items` added to the root context-value `useMemo` dependency list so that
  changes to the registry trigger a re-render of `Select.Trigger`.
- `Select.Item`'s registration effect dependency list narrowed to the stable
  `registerItem` callback (instead of the whole context object) to avoid the
  re-entrant render loop that the above changes would otherwise introduce.

### Select — API Simplification (SelectValue & SelectItemText Removed)

#### Removed

- **`Select.Value` (SelectValue)** — The standalone value-display component has been removed.
  The trigger now computes and renders the selected item's text internally.
- **`Select.ItemText` (SelectItemText)** — The item text wrapper component has been removed.
  Its only purpose was to register text for typeahead and value display via DOM reading;
  this is now handled entirely by the `label` prop on `Select.Item`.

#### Changed

- **`Select.Trigger`** — Now accepts a `placeholder` prop (shown when no value is selected)
  and renders the selected item's `label` automatically. Supports render-prop children
  with a new `label` field in `SelectTriggerRenderProps` for custom display layouts.
- **`Select.Item`** — The `label` prop is now the sole mechanism for registering display
  text used in typeahead filtering and in the trigger's value display. Previously this was
  exposed as `textValue`; it has been renamed to `label` to match the native HTML
  `<option label>` attribute and to read naturally next to the item's children.
- **`aria-labelledby` on trigger** — No longer references a value node id (which no longer
  exists). When wrapped in a `Field`, it references the Field label id only. Standalone
  triggers rely on `aria-label` directly.

#### Why

The `SelectValue` and `SelectItemText` sub-components added indirection without meaningful
benefit. `SelectValue` was a passive display node whose content was already derivable from
context; `SelectItemText` existed solely to read DOM text for typeahead — a concern better
served by an explicit `label` prop. Removing both flattens the component tree, reduces
the compound-component surface area, and makes the API easier to learn:

```tsx
// Before
<Select.Trigger>
  <Select.Value placeholder='Choose…' />
</Select.Trigger>
<Select.Item value='x'>
  <Select.ItemText>Premium</Select.ItemText>
</Select.Item>

// After
<Select.Trigger placeholder='Choose…' />
<Select.Item value='x' label='Premium'>Premium</Select.Item>
```

#### Migration

1. Move the `placeholder` prop from `<Select.Value>` to `<Select.Trigger>`.
2. Remove `<Select.Value>` from inside the trigger.
3. Replace `<Select.ItemText>Text</Select.ItemText>` inside each item with
   a `label='Text'` prop on `<Select.Item>` and render the text as direct children.
4. Rename any existing `textValue` props on `<Select.Item>` to `label`. The behavior is
   identical; this rename aligns the API with native HTML `<option label>`.
5. If you used render-prop children on Trigger for custom layouts, the render props
   now include `label` (the display text of the selected item) instead of `textValue`.
6. If you styled the placeholder/value text via a `Select.Value` selector, move those
   styles to `Select.Trigger`. The trigger now carries `[data-placeholder]` when no
   value is selected, so empty-state styling lives on the trigger itself.

## [0.2.0-beta.0] - 2026-05-17

First beta of the 0.2 line. Significant work since 0.1.4 including the Field
primitive, Switch / Radio / Checkbox / Select integration with Field,
Accordion API rework, and form prop standardization. Published under the
`beta` dist-tag; `latest` remains 0.1.4. See git history for the full set of
changes.

## [0.0.1] - 2025-10-16

### Added

- Initial release of @turkish-technology/spar
- Headless React components with TypeScript support
- Components:
  - Accordion
  - Breadcrumb
  - Button
  - Checkbox
  - Collapsible
  - DropdownMenu
  - Input
  - Label
  - Popover
  - Radio
  - Select
  - Switch
  - Tabs
  - Tooltip
- Full accessibility (WCAG 2.2 AA) support
- React 19 compatibility
- ESM and CommonJS builds
- TypeScript definitions
- Tree-shakeable exports
