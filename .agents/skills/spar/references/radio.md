# Radio API Reference

## Parts

| Part         | Element   | Description                               |
| ------------ | --------- | ----------------------------------------- |
| `Radio.Root` | `<div>`   | Radio group container (role="radiogroup") |
| `Radio.Item` | `<label>` | Individual radio option                   |

When nested inside a `<Field>`, the Radio inherits `invalid`, `disabled`, `required`, and `readOnly` from Field context. Direct props on `<Radio>` override the inherited values.

## Root Props

| Prop             | Type                         | Default      | Description                                        |
| ---------------- | ---------------------------- | ------------ | -------------------------------------------------- |
| `id?`            | `string`                     | auto         | Base ID for ARIA relationships                     |
| `value?`         | `string`                     | —            | Controlled selected value                          |
| `defaultValue?`  | `string`                     | —            | Default selected value                             |
| `onValueChange?` | `(value: string) => void`    | —            | Called when selection changes                      |
| `name?`          | `string`                     | —            | Form field name (shared by all items)              |
| `disabled?`      | `boolean`                    | `false`      | Disables all items. Inherited from Field           |
| `required?`      | `boolean`                    | `false`      | Makes selection required. Inherited from Field     |
| `isInvalid?`     | `boolean`                    | `false`      | Error state (`aria-invalid`). Inherited from Field |
| `orientation?`   | `'vertical' \| 'horizontal'` | `'vertical'` | Affects arrow key navigation                       |
| `selectOnFocus?` | `boolean`                    | `true`       | Select item when focused via keyboard              |
| `autoFocus?`     | `boolean`                    | `false`      | Auto-focus first item on mount                     |

## Item Props

| Prop        | Type      | Default      | Description        |
| ----------- | --------- | ------------ | ------------------ |
| `value`     | `string`  | **required** | Item's value       |
| `disabled?` | `boolean` | `false`      | Disables this item |

**Render props:**

```tsx
<Radio.Item value='option1'>
  {({ isChecked, disabled, isFocused, select }) => (
    <span className={isChecked ? 'selected' : ''}>{isChecked ? '◉' : '○'} Option 1</span>
  )}
</Radio.Item>
```

| Render Prop | Type         | Description                   |
| ----------- | ------------ | ----------------------------- |
| `isChecked` | `boolean`    | Whether this item is selected |
| `select`    | `() => void` | Select this item              |
| `disabled`  | `boolean`    | Whether disabled              |
| `isFocused` | `boolean`    | Whether focused               |

## Keyboard

| Key                          | Action                           |
| ---------------------------- | -------------------------------- |
| `Arrow Down` / `Arrow Right` | Focus (and select) next item     |
| `Arrow Up` / `Arrow Left`    | Focus (and select) previous item |
| `Tab`                        | Move focus out of group          |

Uses roving tabindex — only one item is in the tab order at a time.

## Field integration

```tsx
<Field invalid={!!errors.plan} required>
  <Field.Label>Plan</Field.Label>
  <Radio name='plan' value={form.plan} onValueChange={(v) => setForm({ plan: v })}>
    <Radio.Item value='free'>Free</Radio.Item>
    <Radio.Item value='pro'>Pro</Radio.Item>
    <Radio.Item value='enterprise'>Enterprise</Radio.Item>
  </Radio>
  <Field.ErrorMessage>{errors.plan?.message}</Field.ErrorMessage>
</Field>
```

`isInvalid` / `disabled` / `required` are inherited from Field when not set directly on `<Radio>`.
