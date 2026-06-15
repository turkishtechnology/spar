# Field API Reference

Generic form-field container. Provides a shared ARIA context (coordinated IDs and form state) for any nested form control — `Input`, `Switch`, `Checkbox`, `Radio`, `Select`. The wrapped control inherits `invalid`, `disabled`, `required`, `optional`, and `readOnly` from the Field; direct props on the control still win.

`Field` does **not** own validation logic — `invalid` is a controlled prop intended to be driven by external validation (Zod, React Hook Form, etc.).

## Parts

| Part                 | Element   | Description                                                                    |
| -------------------- | --------- | ------------------------------------------------------------------------------ |
| `Field.Root`         | `<div>`   | Container that owns the field state and emits context                          |
| `Field.Label`        | `<label>` | Label wired to the control via `htmlFor`                                       |
| `Field.Description`  | `<div>`   | Helper/hint text, linked via `aria-describedby`                                |
| `Field.ErrorMessage` | `<div>`   | Error message — **only renders when `invalid` is `true`**, uses `role="alert"` |

`Field` itself is also exported as the Root (i.e. `<Field>` and `<Field.Root>` are the same component).

## Root Props

| Prop        | Type                                                    | Default | Description                                                            |
| ----------- | ------------------------------------------------------- | ------- | ---------------------------------------------------------------------- |
| `id?`       | `string`                                                | auto    | Base ID; sub-element IDs derived as `${id}-field`, `${id}-label`, etc. |
| `invalid?`  | `boolean`                                               | `false` | Error state — drives `Field.ErrorMessage` rendering and `aria-invalid` |
| `disabled?` | `boolean`                                               | `false` | Disables nested control(s)                                             |
| `required?` | `boolean`                                               | `false` | Marks the field as required                                            |
| `optional?` | `boolean`                                               | `false` | Marks the field as optional                                            |
| `readOnly?` | `boolean`                                               | `false` | Read-only mode                                                         |
| `as?`       | `ElementType`                                           | `'div'` | Polymorphic element                                                    |
| `children`  | `ReactNode \| ((state: FieldRenderProps) => ReactNode)` | —       | Field content or render function                                       |

### Render props

```tsx
<Field invalid={!!error}>
  {({ invalid, disabled, required, optional, readOnly }) => (
    <div className={invalid ? 'has-error' : ''}>...</div>
  )}
</Field>
```

| Render Prop | Type      | Description                    |
| ----------- | --------- | ------------------------------ |
| `invalid`   | `boolean` | Current invalid state          |
| `disabled`  | `boolean` | Whether the field is disabled  |
| `required`  | `boolean` | Whether the field is required  |
| `optional`  | `boolean` | Whether the field is optional  |
| `readOnly`  | `boolean` | Whether the field is read-only |

## Label Props

Same as the standalone `Label` component. `htmlFor`, `id`, `disabled`, `required`, `optional`, `readOnly`, `invalid` are provided by Field context and cannot be overridden.

## Description Props

Plain polymorphic `<div>`. ID is provided by Field context.

| Prop  | Type          | Default | Description         |
| ----- | ------------- | ------- | ------------------- |
| `as?` | `ElementType` | `'div'` | Polymorphic element |

## ErrorMessage Props

Plain polymorphic `<div>`. Only renders when Field's `invalid` is `true`. Always emits `role="alert"`.

| Prop  | Type          | Default | Description         |
| ----- | ------------- | ------- | ------------------- |
| `as?` | `ElementType` | `'div'` | Polymorphic element |

## Hooks

```tsx
import { useFieldContext, useOptionalFieldContext } from '@turkish-technology/spar/field';
```

- `useFieldContext()` — throws if used outside a Field. Use inside custom field children.
- `useOptionalFieldContext()` — returns `undefined` when no Field ancestor. Used by Spar's form controls (`Input`, `Switch`, `Checkbox`, `Radio`, `Select`) to opt into Field context when present, but still work standalone.

`FieldContextValue` shape: `{ fieldId, labelId, descriptionId, errorId, invalid, disabled, required, optional, readOnly }`.

## ARIA wiring (automatic)

- `Field.Label` → `<label htmlFor="{fieldId}" id="{labelId}">`
- Nested control → `id="{fieldId}"`, `aria-labelledby="{labelId}"`, `aria-describedby` points to description when valid, error when invalid
- Nested control → `aria-invalid="true"` when `invalid`, `aria-required="true"` when `required`
- `Field.ErrorMessage` → `role="alert"` (implicit `aria-live="assertive"`)

## Data attributes

Emitted on `Field.Root` (and mirrored on Label/Description/ErrorMessage where relevant):

| Attribute       | Values                  |
| --------------- | ----------------------- |
| `data-invalid`  | Present when `invalid`  |
| `data-disabled` | Present when `disabled` |
| `data-required` | Present when `required` |
| `data-optional` | Present when `optional` |
| `data-readonly` | Present when `readOnly` |

## Examples

### Input inside Field

```tsx
<Field invalid={!!errors.email} required>
  <Field.Label>Email</Field.Label>
  <Input>
    <Input.Field type='email' {...register('email')} />
  </Input>
  <Field.Description>We'll never share it.</Field.Description>
  <Field.ErrorMessage>{errors.email?.message}</Field.ErrorMessage>
</Field>
```

### Switch inside Field

```tsx
<Field disabled={!user.canEdit}>
  <Field.Label>Email notifications</Field.Label>
  <Switch name='notify' defaultChecked />
  <Field.Description>Get notified when someone mentions you.</Field.Description>
</Field>
```

### Select inside Field

```tsx
<Field invalid={!!errors.country} required>
  <Field.Label>Country</Field.Label>
  <Select name='country'>
    <Select.Trigger>
      <Select.Value placeholder='Pick one' />
    </Select.Trigger>
    <Select.Content>
      <Select.Item value='tr'>
        <Select.ItemText>Türkiye</Select.ItemText>
      </Select.Item>
      <Select.Item value='us'>
        <Select.ItemText>United States</Select.ItemText>
      </Select.Item>
    </Select.Content>
  </Select>
  <Field.ErrorMessage>{errors.country?.message}</Field.ErrorMessage>
</Field>
```

## Gotchas

- **`Field.ErrorMessage` is conditional**: it returns `null` unless `Field`'s `invalid` is `true`. You don't need to wrap it in `{error && ...}`.
- **Form controls inherit, don't override**: a `disabled={true}` Field forces every nested control disabled. A direct `disabled={false}` on the control still wins (props beat context).
- **One control per Field**: a Field shares one `fieldId`. Nesting multiple inputs in the same Field breaks ARIA wiring. For multiple inputs (e.g. first/last name pair), use one Field each.
- **`Field` is not just for `Input`**: it works with `Switch`, `Checkbox`, `Radio`, `Select` too. The old `Input.Label` / `Input.Description` / `Input.ErrorMessage` are gone — use `Field` instead.
