# Select API Reference

## Parts

| Part               | Element    | Description                               |
| ------------------ | ---------- | ----------------------------------------- |
| `Select.Root`      | `<div>`    | Container managing selection state        |
| `Select.Trigger`   | `<button>` | Opens the listbox (role="combobox")       |
| `Select.Value`     | `<span>`   | Displays current selection or placeholder |
| `Select.Content`   | `<div>`    | Dropdown panel (portaled, role="listbox") |
| `Select.Item`      | `<div>`    | Selectable option (role="option")         |
| `Select.ItemText`  | `<span>`   | Text label for an item (required)         |
| `Select.Group`     | `<div>`    | Groups related items                      |
| `Select.Label`     | `<label>`  | Label for a group                         |
| `Select.Separator` | `<div>`    | Visual separator                          |
| `Select.Arrow`     | `<svg>`    | Pointing arrow                            |

## Root Props

| Prop             | Type                      | Default | Description                    |
| ---------------- | ------------------------- | ------- | ------------------------------ |
| `id?`            | `string`                  | auto    | Base ID for ARIA relationships |
| `value?`         | `string`                  | —       | Controlled selected value      |
| `defaultValue?`  | `string`                  | —       | Default selected value         |
| `onValueChange?` | `(value: string) => void` | —       | Called when selection changes  |
| `open?`          | `boolean`                 | —       | Controlled open state          |
| `defaultOpen?`   | `boolean`                 | `false` | Default open state             |
| `onOpenChange?`  | `(open: boolean) => void` | —       | Called when open state changes |
| `disabled?`      | `boolean`                 | `false` | Disables the select            |
| `required?`      | `boolean`                 | `false` | Required for form validation   |
| `name?`          | `string`                  | —       | Form field name                |
| `autoFocus?`     | `boolean`                 | `false` | Auto-focus trigger on mount    |

## Trigger Props

Extends Button props.

**Render props:**

| Render Prop                 | Type                  | Description              |
| --------------------------- | --------------------- | ------------------------ |
| `isOpen`                    | `boolean`             | Whether dropdown is open |
| `value`                     | `string \| undefined` | Current selected value   |
| `disabled`                  | `boolean`             | Whether disabled         |
| `open` / `close` / `toggle` | `() => void`          | State control            |

## Value Props

| Prop           | Type        | Default | Description                  |
| -------------- | ----------- | ------- | ---------------------------- |
| `placeholder?` | `ReactNode` | —       | Shown when no value selected |

## Content Props

| Prop                    | Type                                     | Default         | Description             |
| ----------------------- | ---------------------------------------- | --------------- | ----------------------- |
| `side?`                 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'`      | Preferred placement     |
| `align?`                | `'start' \| 'center' \| 'end'`           | `'start'`       | Alignment               |
| `container?`            | `HTMLElement \| null`                    | `document.body` | Portal container        |
| `onEscapeKeyDown?`      | `(event: KeyboardEvent) => void`         | —               | Called on Escape        |
| `onPointerDownOutside?` | `(event: PointerEvent) => void`          | —               | Called on click outside |
| `onCloseAutoFocus?`     | `(event: FocusEvent) => void`            | —               | Before focus restore    |

## Item Props

| Prop         | Type      | Default      | Description                                   |
| ------------ | --------- | ------------ | --------------------------------------------- |
| `value`      | `string`  | **required** | Item's value                                  |
| `disabled?`  | `boolean` | `false`      | Disables this item                            |
| `textValue?` | `string`  | —            | Text for typeahead (defaults to text content) |

**Render props:**

| Render Prop     | Type         | Description                                   |
| --------------- | ------------ | --------------------------------------------- |
| `isSelected`    | `boolean`    | Whether this item is currently selected       |
| `isHighlighted` | `boolean`    | Whether this item is highlighted via keyboard |
| `select`        | `() => void` | Select this item                              |
| `disabled`      | `boolean`    | Whether disabled                              |

## Keyboard

| Key               | Action                                 |
| ----------------- | -------------------------------------- |
| `Enter` / `Space` | Open listbox / select highlighted item |
| `Arrow Down`      | Open listbox / highlight next item     |
| `Arrow Up`        | Highlight previous item                |
| `Home`            | Highlight first item                   |
| `End`             | Highlight last item                    |
| `Escape`          | Close listbox                          |
| Type characters   | Typeahead to matching item             |
