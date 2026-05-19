# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
