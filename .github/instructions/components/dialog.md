# Dialog — Glide Headless Instructions

## 1. Component Overview

The Dialog component provides a modal dialog overlay that interrupts user workflow to capture attention or gather input. This headless implementation focuses on behavior, focus management, accessibility, and provides flexible composition for various dialog types.

**Purpose and use cases:**

- Confirmation dialogs for destructive actions
- Form dialogs for capturing user input
- Alert dialogs for important messages
- Context menus and popovers requiring modal behavior
- Multi-step workflows requiring focused interaction

**Compound component structure:**

```tsx
<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title />
      <Dialog.Description />
      <Dialog.Close />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

**Key differentiators:**

- Portal-based rendering for proper stacking context
- Automatic focus management with restore on close
- Flexible trigger system (not just buttons)
- Built-in keyboard navigation and screen reader support
- Controlled and uncontrolled modes
- Light dismiss behavior with escape handling

## 2. API

### Dialog.Root Props

| Name           | Type                      | Required | Default     | Description                                 |
| -------------- | ------------------------- | -------- | ----------- | ------------------------------------------- |
| `open`         | `boolean`                 | No       | `undefined` | Controls dialog open state (controlled)     |
| `defaultOpen`  | `boolean`                 | No       | `false`     | Initial open state (uncontrolled)           |
| `onOpenChange` | `(open: boolean) => void` | No       | `undefined` | Callback when open state changes            |
| `modal`        | `boolean`                 | No       | `true`      | Whether dialog should be modal (trap focus) |

### Dialog.Trigger Props

| Name       | Type          | Required | Default    | Description                 |
| ---------- | ------------- | -------- | ---------- | --------------------------- |
| `as`       | `ElementType` | No       | `'button'` | Element type to render      |
| `disabled` | `boolean`     | No       | `false`    | Whether trigger is disabled |

### Dialog.Portal Props

| Name         | Type                         | Required | Default         | Description                  |
| ------------ | ---------------------------- | -------- | --------------- | ---------------------------- |
| `container`  | `Element \| (() => Element)` | No       | `document.body` | Portal container element     |
| `forceMount` | `boolean`                    | No       | `false`         | Force portal to stay mounted |

### Dialog.Overlay Props

| Name         | Type          | Required | Default | Description                   |
| ------------ | ------------- | -------- | ------- | ----------------------------- |
| `as`         | `ElementType` | No       | `'div'` | Element type to render        |
| `forceMount` | `boolean`     | No       | `false` | Force overlay to stay mounted |

### Dialog.Content Props

| Name                   | Type                             | Required | Default     | Description                                   |
| ---------------------- | -------------------------------- | -------- | ----------- | --------------------------------------------- |
| `as`                   | `ElementType`                    | No       | `'div'`     | Element type to render                        |
| `onOpenAutoFocus`      | `(event: Event) => void`         | No       | `undefined` | Called when dialog opens and focus moves in   |
| `onCloseAutoFocus`     | `(event: Event) => void`         | No       | `undefined` | Called when dialog closes and focus moves out |
| `onEscapeKeyDown`      | `(event: KeyboardEvent) => void` | No       | `undefined` | Called when escape key is pressed             |
| `onPointerDownOutside` | `(event: PointerEvent) => void`  | No       | `undefined` | Called when pointer down occurs outside       |
| `onInteractOutside`    | `(event: Event) => void`         | No       | `undefined` | Called when interaction occurs outside        |
| `forceMount`           | `boolean`                        | No       | `false`     | Force content to stay mounted                 |
| `trapFocus`            | `boolean`                        | No       | `true`      | Whether to trap focus within dialog           |

### Dialog.Title Props

| Name | Type          | Required | Default | Description            |
| ---- | ------------- | -------- | ------- | ---------------------- |
| `as` | `ElementType` | No       | `'h2'`  | Element type to render |

### Dialog.Description Props

| Name | Type          | Required | Default | Description            |
| ---- | ------------- | -------- | ------- | ---------------------- |
| `as` | `ElementType` | No       | `'p'`   | Element type to render |

### Dialog.Close Props

| Name | Type          | Required | Default    | Description            |
| ---- | ------------- | -------- | ---------- | ---------------------- |
| `as` | `ElementType` | No       | `'button'` | Element type to render |

**Notes:**

- All components support polymorphic `as` prop and forward refs
- All event handlers can call `event.preventDefault()` to prevent default behavior
- Components support controlled and uncontrolled patterns

## 3. Behavior Matrix

| State           | Trigger                       | Result                          | ARIA/DOM Update                                    |
| --------------- | ----------------------------- | ------------------------------- | -------------------------------------------------- |
| Closed          | Trigger click/Enter/Space     | Opens dialog                    | `aria-expanded="true"`, focus moves to content     |
| Closed          | `open` prop change to `true`  | Opens dialog                    | Focus moves to content                             |
| Open            | Escape key                    | Closes dialog                   | `aria-expanded="false"`, focus restores to trigger |
| Open            | Close button click            | Closes dialog                   | Focus restores to trigger                          |
| Open            | Outside click (light dismiss) | Closes dialog                   | Focus restores to trigger                          |
| Open            | `open` prop change to `false` | Closes dialog                   | Focus restores to trigger                          |
| Open            | Tab navigation                | Cycles within dialog            | Focus remains trapped in dialog                    |
| Open            | Shift+Tab navigation          | Reverse cycles within dialog    | Focus remains trapped in dialog                    |
| Content focused | Home key                      | Focuses first focusable element | Updates `aria-activedescendant` if applicable      |
| Content focused | End key                       | Focuses last focusable element  | Updates `aria-activedescendant` if applicable      |

## 4. Accessibility

### Roles

- Dialog content: `role="dialog"` (modal) or `role="alertdialog"` (alert)
- Overlay: `role="presentation"` (decorative backdrop)
- Trigger: Inherits from underlying element (`role="button"` default)

### Keyboard Navigation

- **Tab/Shift+Tab**: Navigate through focusable elements (trapped within dialog)
- **Enter/Space**: Activate focused element
- **Escape**: Close dialog and return focus to trigger
- **Home/End**: Move to first/last focusable element

### Focus Management

- Dialog opens: Focus moves to first focusable element or element with `autofocus`
- Dialog closes: Focus restores to trigger element
- Focus trap: Tab navigation cycles within dialog content only
- Initial focus can be customized via `onOpenAutoFocus` event handler

### Screen Reader Announcements

- Dialog opening: Announces dialog role, title, and description
- Title: Linked via `aria-labelledby` to content element
- Description: Linked via `aria-describedby` to content element
- Modal state: `aria-modal="true"` for modal dialogs
- Close actions: Announce when dialog closes

### Required ARIA Attributes

- `aria-labelledby`: References Dialog.Title id
- `aria-describedby`: References Dialog.Description id (if present)
- `aria-modal`: Set to "true" for modal behavior
- `aria-hidden`: Applied to background content when modal
- `aria-expanded`: On trigger element

### Name/Role/Value Exposure

- Dialog name from title or `aria-label`
- Role communicated as "dialog" or "alertdialog"
- Value includes current state (open/closed)

## 5. Implementation Architecture

### State Hooks Design

```tsx
const useDialogState = (props: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [open, setOpen] = useControlled({
    controlled: props.open,
    default: props.defaultOpen ?? false,
    name: 'Dialog',
  });

  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  return { open, setOpen, triggerRef, contentRef, onOpenChange: props.onOpenChange };
};
```

### Context Requirements

```tsx
interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement>;
  contentRef: RefObject<HTMLElement>;
  titleId: string;
  descriptionId: string;
  modal: boolean;
}
```

### Ref Forwarding Strategy

- Forward refs to actual DOM elements, not wrapper components
- Combine internal refs with forwarded refs using `useMergeRefs`
- Maintain refs for focus management and portal positioning

### Event System

```tsx
// Custom events for external integration
const DialogEvents = {
  OPEN: 'dialog:open',
  CLOSE: 'dialog:close',
  FOCUS_CHANGE: 'dialog:focus-change',
} as const;
```

### SSR/CSR Safety and Deterministic IDs

- Use `useId()` for generating unique IDs that work across SSR/CSR
- Portal content only renders on client-side
- Graceful fallback when portal container is not available

## 6. Styling & Data Attributes

### Required Data Attributes and Values

#### Dialog.Root

- `data-state`: `"open"` | `"closed"`

#### Dialog.Trigger

- `data-state`: `"open"` | `"closed"`
- `data-disabled`: Present when `disabled={true}`

#### Dialog.Overlay

- `data-state`: `"open"` | `"closed"`

#### Dialog.Content

- `data-state`: `"open"` | `"closed"`
- `data-side`: `"top"` | `"right"` | `"bottom"` | `"left"` | `"center"` (positioning hint)

#### Dialog.Title

- `data-state`: `"open"` | `"closed"`

#### Dialog.Description

- `data-state`: `"open"` | `"closed"`

#### Dialog.Close

- `data-state`: `"open"` | `"closed"`

**Animation Support:**

- Use `data-state` for CSS transitions between open/closed states
- Support for enter/exit animations via CSS keyframes
- Overlay fade-in/out effects via data attributes

## 7. Test Coverage Plan

### Unit Tests

- Open/close state management (controlled & uncontrolled)
- Keyboard navigation (Tab, Shift+Tab, Escape, Enter, Space)
- Focus management and restoration
- Event handler execution
- Portal rendering and cleanup
- ARIA attribute application
- Polymorphic rendering with `as` prop

### Accessibility Tests

- Screen reader announcements (jest-axe)
- Focus trap functionality
- ARIA labeling relationships
- Keyboard-only navigation
- Color contrast compliance (if styled examples provided)
- Focus indicator visibility

### Integration Tests

- Dialog interaction flows (open → interact → close)
- Form submission within dialog
- Nested dialog behavior
- Multiple dialog instances
- Background scroll prevention
- Animation and transition states

## 8. Constraints

- **Zero styling**: No CSS imports or inline styles
- **Behavior only**: Focus on interaction patterns and accessibility
- **Styling via data attributes**: All visual states exposed as `data-*` attributes
- **Tree-shakeable exports**: Named exports for each component part
- **TypeScript strict mode**: All props explicitly typed with no `any`
- **WCAG 2.2 AA compliant**: Full keyboard support and screen reader compatibility
- **Controlled/uncontrolled support**: Both patterns with escape hatches
- **Portal-based**: Proper stacking context management
- **SSR safe**: No client-only code in initial render

## 9. Migration & Implementation Checklist

### Migration from Common Dialog Libraries

- **From React Modal**: Replace `isOpen` with `open`, `onRequestClose` with `onOpenChange`
- **From Reach UI Dialog**: Similar API, mainly need to restructure to compound components
- **From Headless UI Dialog**: Close API match, focus on compound pattern migration

### Implementation Checklist

#### Core Functionality

- [ ] Dialog.Root with controlled/uncontrolled state
- [ ] Dialog.Trigger with keyboard activation
- [ ] Dialog.Portal for proper DOM placement
- [ ] Dialog.Overlay for backdrop behavior
- [ ] Dialog.Content with focus management
- [ ] Dialog.Title with ARIA labeling
- [ ] Dialog.Description with ARIA description
- [ ] Dialog.Close for explicit close actions

#### Accessibility Features

- [ ] Focus trap implementation
- [ ] Focus restoration on close
- [ ] ARIA attributes (labelledby, describedby, modal)
- [ ] Keyboard navigation (Tab, Escape, Enter, Space)
- [ ] Screen reader announcements
- [ ] Background content inert (aria-hidden)

#### Advanced Features

- [ ] Light dismiss (click outside to close)
- [ ] Animation support via data attributes
- [ ] Multiple dialog instance support
- [ ] Nested dialog handling
- [ ] Custom focus management hooks
- [ ] Event system for external integration

#### Testing & Quality

- [ ] Unit tests for all component behaviors
- [ ] Accessibility tests (jest-axe, keyboard-only)
- [ ] Integration tests for user flows
- [ ] TypeScript strict compliance
- [ ] Documentation and examples
- [ ] Performance benchmarks
