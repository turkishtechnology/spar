# Label API Reference

## Element: `<label>`

Simple component — no compound parts.

## Props

| Prop          | Type          | Default   | Description              |
| ------------- | ------------- | --------- | ------------------------ |
| `required?`   | `boolean`     | `false`   | Indicates required field |
| `isOptional?` | `boolean`     | `false`   | Indicates optional field |
| `disabled?`   | `boolean`     | `false`   | Disabled state           |
| `readOnly?`   | `boolean`     | `false`   | Read-only state          |
| `invalid?`    | `boolean`     | `false`   | Error state              |
| `as?`         | `ElementType` | `'label'` | Polymorphic element      |

Plus all native `<label>` HTML attributes (`htmlFor`, `className`, `style`, `ref`, etc.)

## Data attributes

| Attribute       | Condition         |
| --------------- | ----------------- |
| `data-disabled` | When `disabled`   |
| `data-readonly` | When `readOnly`   |
| `data-invalid`  | When `invalid`    |
| `data-required` | When `required`   |
| `data-optional` | When `isOptional` |
