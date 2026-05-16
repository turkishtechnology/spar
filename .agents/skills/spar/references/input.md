# Input API Reference

`Input` is the text-input primitive. As of the latest version it is **just `Root` + `Field`** — the previous `Input.Label`, `Input.Description`, and `Input.ErrorMessage` have moved to the new generic [Field](./field.md) component. Wrap the input in `<Field>` to get label/description/error wiring.

## Parts

| Part          | Element   | Description                                                   |
| ------------- | --------- | ------------------------------------------------------------- |
| `Input.Root`  | `<div>`   | Container that manages input state and emits an Input context |
| `Input.Field` | `<input>` | The actual `<input>` element                                  |

`Input` and `Input.Root` are the same component (default export is also `Root`).

## Root Props

Inherited from `<Field>` context when nested: `invalid`, `disabled`, `required`, `readOnly`. Props set directly on `<Input>` override the inherited values.

| Prop        | Type          | Default | Description                                                               |
| ----------- | ------------- | ------- | ------------------------------------------------------------------------- |
| `id?`       | `string`      | auto    | Base ID for ARIA relationships                                            |
| `invalid?`  | `boolean`     | `false` | Error state (`aria-invalid`). Inherited from Field if not provided        |
| `disabled?` | `boolean`     | `false` | Disables the input. Inherited from Field if not provided                  |
| `required?` | `boolean`     | `false` | Marks as required (`aria-required`). Inherited from Field if not provided |
| `readOnly?` | `boolean`     | `false` | Read-only mode. Inherited from Field if not provided                      |
| `as?`       | `ElementType` | `'div'` | Polymorphic element                                                       |

## Field Props

| Prop         | Type      | Default | Description         |
| ------------ | --------- | ------- | ------------------- |
| `autoFocus?` | `boolean` | `false` | Auto-focus on mount |

Plus all native `<input>` HTML attributes (`type`, `placeholder`, `value`, `onChange`, `name`, etc.).

## ARIA wiring (automatic)

When inside a `<Field>`:

- `Input.Field` → `id="{fieldId}"`, `aria-labelledby="{labelId}"`
- `Input.Field` → `aria-describedby` points to Field's description (valid) or error (invalid)
- `Input.Field` → `aria-invalid="true"` when `invalid`
- `Input.Field` → `aria-required="true"` when `required`

When standalone, set `aria-label` (or wire your own `<label htmlFor>`) yourself.

## Hook

```tsx
import { useInputContext } from '@turkish-technology/spar/input';
```

Returns the Input's internal context (fieldId, labelId, descriptionId, errorId, invalid, disabled, required, readOnly). Useful when building custom input children.

## Examples

### Recommended — wrapped in Field

```tsx
<Field invalid={!!error} required>
  <Field.Label>Email</Field.Label>
  <Input>
    <Input.Field type='email' />
  </Input>
  <Field.Description>We'll never share it.</Field.Description>
  <Field.ErrorMessage>{error}</Field.ErrorMessage>
</Field>
```

### Standalone

```tsx
<Input>
  <Input.Field aria-label='Search' type='search' placeholder='Search...' />
</Input>
```

## Keyboard

Standard native `<input>` keyboard behavior. No custom keyboard shortcuts.

## Migration from earlier versions

The old `Input.Label`, `Input.Description`, `Input.ErrorMessage` no longer exist. Replace:

```tsx
// Before
<Input.Root invalid={!!error} required>
  <Input.Label>Email</Input.Label>
  <Input.Field type='email' />
  <Input.Description>...</Input.Description>
  <Input.ErrorMessage>{error}</Input.ErrorMessage>
</Input.Root>

// After
<Field invalid={!!error} required>
  <Field.Label>Email</Field.Label>
  <Input>
    <Input.Field type='email' />
  </Input>
  <Field.Description>...</Field.Description>
  <Field.ErrorMessage>{error}</Field.ErrorMessage>
</Field>
```

The `invalid` prop now uses the same name on both `Input` and `Field` — previously `Input.Root` exposed `invalid` while `Field` used `invalid`; both are now `invalid`.
