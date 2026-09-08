# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
