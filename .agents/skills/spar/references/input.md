# Input API Reference

## Parts

| Part                 | Element   | Description                                                              |
| -------------------- | --------- | ------------------------------------------------------------------------ |
| `Input.Root`         | `<div>`   | Container managing field state and ARIA connections                      |
| `Input.Field`        | `<input>` | The actual input element                                                 |
| `Input.Label`        | `<label>` | Label connected to the field                                             |
| `Input.Description`  | `<div>`   | Helper text (connected via `aria-describedby`)                           |
| `Input.ErrorMessage` | `<div>`   | Error message (shown when `isInvalid`, connected via `aria-describedby`) |

## Root Props

| Prop         | Type      | Default | Description                         |
| ------------ | --------- | ------- | ----------------------------------- |
| `id?`        | `string`  | auto    | Base ID for ARIA relationships      |
| `isInvalid?` | `boolean` | `false` | Sets error state (`aria-invalid`)   |
| `disabled?`  | `boolean` | `false` | Disables the entire field           |
| `required?`  | `boolean` | `false` | Marks as required (`aria-required`) |
| `readOnly?`  | `boolean` | `false` | Read-only mode                      |

## Field Props

| Prop         | Type      | Default | Description         |
| ------------ | --------- | ------- | ------------------- |
| `autoFocus?` | `boolean` | `false` | Auto-focus on mount |

Plus all native `<input>` HTML attributes (`type`, `placeholder`, `value`, `onChange`, `name`, etc.)

## Label Props

Same as the standalone `Label` component:

| Prop          | Type      | Default | Description             |
| ------------- | --------- | ------- | ----------------------- |
| `required?`   | `boolean` | `false` | Show required indicator |
| `isOptional?` | `boolean` | `false` | Show optional indicator |
| `disabled?`   | `boolean` | `false` | Disabled style          |
| `readOnly?`   | `boolean` | `false` | Read-only style         |
| `isInvalid?`  | `boolean` | `false` | Error style             |

## ARIA connections (automatic)

Spar automatically connects these ARIA relationships:

- `Input.Label` → `<label htmlFor="{fieldId}">`
- `Input.Field` → `aria-describedby` pointing to description and/or error message
- `Input.Field` → `aria-invalid="true"` when `isInvalid`
- `Input.Field` → `aria-required="true"` when `required`
- `Input.ErrorMessage` → `role="alert"` for screen reader announcement

## Keyboard

Standard `<input>` keyboard behavior. No custom keyboard shortcuts.
