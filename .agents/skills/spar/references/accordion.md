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

| Prop             | Type                                                  | Default      | Description                                                                               |
| ---------------- | ----------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------- |
| `multiple?`      | `boolean`                                             | `false`      | When `true`, multiple items can be open at once                                           |
| `collapsible?`   | `boolean`                                             | `true`       | In single mode, whether the open item can be re-clicked to close. No effect in multi mode |
| `value?`         | `AccordionValue \| AccordionValue[]`                  | —            | Controlled open item(s). Scalar in single mode, array in multiple mode                    |
| `defaultValue?`  | `AccordionValue \| AccordionValue[]`                  | —            | Uncontrolled initial open item(s)                                                         |
| `onValueChange?` | `(value: AccordionValue \| AccordionValue[]) => void` | —            | Called when open items change                                                             |
| `disabled?`      | `boolean`                                             | `false`      | Disables all items                                                                        |
| `orientation?`   | `'vertical' \| 'horizontal'`                          | `'vertical'` | Affects keyboard navigation direction                                                     |
| `as?`            | `ElementType`                                         | `'div'`      | Polymorphic element                                                                       |

`AccordionValue = string | number`

## Item Props

Item is now purely identity + per-item disabled. Open state is owned by Root via `value`/`defaultValue`.

| Prop        | Type             | Default      | Description                     |
| ----------- | ---------------- | ------------ | ------------------------------- |
| `value`     | `AccordionValue` | **required** | Unique identifier for this item |
| `disabled?` | `boolean`        | `false`      | Disables this item              |

## Header Props

| Prop     | Type     | Default | Description         |
| -------- | -------- | ------- | ------------------- |
| `level?` | `number` | `3`     | Heading level (1-6) |

## Trigger Props

Extends Button props. Render props identical to `Collapsible.Trigger`.

```tsx
<Accordion.Trigger>
  {({ isOpen, disabled, open, close, toggle }) => <span>{isOpen ? '▼' : '▶'} Section</span>}
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

## Hooks

```tsx
import { useAccordionContext, useAccordionItemContext } from '@turkish-technology/spar/accordion';
```

- `useAccordionContext()` — root state and navigation helpers.
- `useAccordionItemContext()` — per-item state (`value`, `isOpen`, `disabled`, `triggerId`, `contentId`, `open()`, `close()`, `toggle()`).

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

## Migration from earlier versions

- `selectionMode="single" | "multiple"` → `multiple: boolean` (default `false`).
- `isCollapsible` → `collapsible` (default flipped: now `true`).
- `Accordion.Item`'s `open` / `defaultOpen` / `onOpenChange` are gone. Drive open state via `value` / `defaultValue` / `onValueChange` on `Accordion.Root`.

```tsx
// Before
<Accordion.Root selectionMode='single' isCollapsible defaultValue='item-1'>
  <Accordion.Item value='item-1'>...</Accordion.Item>
</Accordion.Root>

// After
<Accordion.Root defaultValue='item-1'>
  <Accordion.Item value='item-1'>...</Accordion.Item>
</Accordion.Root>

// Before — multiple
<Accordion.Root selectionMode='multiple'>...</Accordion.Root>

// After — multiple
<Accordion.Root multiple>...</Accordion.Root>
```
