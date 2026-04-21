# Accordion API Reference

## Parts

| Part                | Element    | Description                        |
| ------------------- | ---------- | ---------------------------------- |
| `Accordion.Root`    | `<div>`    | Container for all accordion items  |
| `Accordion.Item`    | `<div>`    | Wraps a single collapsible section |
| `Accordion.Header`  | `<h3>`     | Heading wrapper for the trigger    |
| `Accordion.Trigger` | `<button>` | Button that toggles the content    |
| `Accordion.Content` | `<div>`    | Collapsible content panel          |

## Root Props

| Prop             | Type                                  | Default      | Description                                   |
| ---------------- | ------------------------------------- | ------------ | --------------------------------------------- |
| `selectionMode?` | `'single' \| 'multiple'`              | `'single'`   | Whether one or multiple items can be open     |
| `isCollapsible?` | `boolean`                             | `false`      | Whether all items can be closed (single mode) |
| `value?`         | `string \| string[]`                  | —            | Controlled open item(s)                       |
| `defaultValue?`  | `string \| string[]`                  | —            | Default open item(s)                          |
| `onValueChange?` | `(value: string \| string[]) => void` | —            | Called when open items change                 |
| `disabled?`      | `boolean`                             | `false`      | Disables all items                            |
| `orientation?`   | `'vertical' \| 'horizontal'`          | `'vertical'` | Affects keyboard navigation direction         |
| `as?`            | `ElementType`                         | `'div'`      | Polymorphic element                           |

## Item Props

| Prop            | Type                      | Default      | Description                            |
| --------------- | ------------------------- | ------------ | -------------------------------------- |
| `value`         | `string`                  | **required** | Unique identifier for this item        |
| `open?`         | `boolean`                 | —            | Controlled open state (overrides root) |
| `defaultOpen?`  | `boolean`                 | `false`      | Default open state                     |
| `onOpenChange?` | `(open: boolean) => void` | —            | Called when item open state changes    |
| `disabled?`     | `boolean`                 | `false`      | Disables this item                     |

## Header Props

| Prop     | Type     | Default | Description         |
| -------- | -------- | ------- | ------------------- |
| `level?` | `number` | `3`     | Heading level (1-6) |

## Trigger Props

Extends Button props.

**Render props** — children can be a function:

```tsx
<Accordion.Trigger>
  {({ isOpen, disabled }) => <span>{isOpen ? '▼' : '▶'} Section</span>}
</Accordion.Trigger>
```

| Render Prop | Type         | Description                     |
| ----------- | ------------ | ------------------------------- |
| `isOpen`    | `boolean`    | Whether the content is expanded |
| `disabled`  | `boolean`    | Whether the trigger is disabled |
| `open`      | `() => void` | Open the content                |
| `close`     | `() => void` | Close the content               |
| `toggle`    | `() => void` | Toggle the content              |

## Content Props

| Prop          | Type      | Default | Description             |
| ------------- | --------- | ------- | ----------------------- |
| `forceMount?` | `boolean` | `false` | Keep in DOM when closed |

## Keyboard

| Key               | Action                              |
| ----------------- | ----------------------------------- |
| `Enter` / `Space` | Toggle focused panel                |
| `Arrow Down`      | Focus next trigger (vertical)       |
| `Arrow Up`        | Focus previous trigger (vertical)   |
| `Arrow Right`     | Focus next trigger (horizontal)     |
| `Arrow Left`      | Focus previous trigger (horizontal) |
| `Home`            | Focus first trigger                 |
| `End`             | Focus last trigger                  |
