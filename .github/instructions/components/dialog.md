# Dialog — Spar Headless Instructions

## 1. Component Overview

The Dialog component provides fully accessible modal and non-modal dialog functionality. A dialog is an overlay window that interrupts the user's workflow to present critical information, request input, or require confirmation. The component supports both standard dialogs and alert dialogs for urgent messaging.

### Purpose and Use Cases
- **Modal dialogs**: Forms, confirmations, detailed content requiring user interaction
- **Alert dialogs**: Error messages, critical confirmations, destructive action warnings  
- **Non-modal dialogs**: Contextual information, help tooltips, additional details
- **Nested dialogs**: Multiple dialog layers with proper focus management
- **Responsive layouts**: Adaptable positioning and sizing across devices

### Compound Component Structure
```tsx
<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title />
      <Dialog.Description />
      <Dialog.Close />
      {/* Custom content */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Key Differentiators
- **Zero styling**: Pure behavior, no visual opinions
- **Accessibility-first**: WCAG 2.2 AA compliant with full screen reader support
- **Focus management**: Automatic focus trapping and restoration
- **Flexible composition**: Granular parts for maximum customization
- **Portal support**: Render outside DOM hierarchy to avoid z-index issues
- **Nested dialogs**: Multiple dialog layers with proper stacking
- **Alert dialog variant**: Special handling for urgent/critical messages

## 2. API

### DialogRoot Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | No | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | No | - | Callback when open state changes |
| `defaultOpen` | `boolean` | No | `false` | Initial open state (uncontrolled) |
| `modal` | `boolean` | No | `true` | Whether dialog is modal (blocks interaction outside) |
| `disabled` | `boolean` | No | `false` | Disables all dialog triggers (prevents opening) |
| `children` | `ReactNode` | Yes | - | Dialog trigger and portal components |

### DialogTrigger Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'button'` | Polymorphic element type |
| `disabled` | `boolean` | No | `false` | Disables trigger interaction |
| `children` | `ReactNode \| ((state: DialogTriggerRenderProps) => ReactNode)` | Yes | - | Trigger content or render function for render props pattern |
| `...props` | `HTMLAttributes` | No | - | Additional HTML props |

### DialogTriggerRenderProps
| Name | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Whether the dialog is currently visible |
| `disabled` | `boolean` | Whether the trigger is disabled |
| `open` | `() => void` | Function to programmatically open the dialog |
| `close` | `() => void` | Function to programmatically close the dialog |
| `toggle` | `() => void` | Function to programmatically toggle the dialog |

### DialogPortal Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `container` | `HTMLElement` | No | `document.body` | Portal container element |
| `children` | `ReactNode` | Yes | - | Dialog overlay and content |

### DialogOverlay Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'div'` | Polymorphic element type |
| `forceMount` | `boolean` | No | `false` | Always render (for animation libraries) |
| `children` | `ReactNode` | No | - | Optional overlay content |
| `...props` | `HTMLAttributes` | No | - | Additional HTML props |

### DialogContent Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'div'` | Polymorphic element type |
| `role` | `'dialog' \| 'alertdialog'` | No | `'dialog'` | ARIA role for dialog type |
| `forceMount` | `boolean` | No | `false` | Always render (for animation libraries) |
| `trapFocus` | `boolean` | No | `true` | Enable focus trapping |
| `restoreFocus` | `boolean` | No | `true` | Restore focus on close |
| `initialFocus` | `HTMLElement \| (() => HTMLElement)` | No | - | Element to focus on open |
| `finalFocus` | `HTMLElement \| (() => HTMLElement)` | No | - | Element to focus on close |
| `onOpenAutoFocus` | `(event: Event) => void` | No | - | Callback before auto-focus |
| `onCloseAutoFocus` | `(event: Event) => void` | No | - | Callback before focus restore |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | No | - | Escape key handler |
| `onPointerDownOutside` | `(event: PointerEvent) => void` | No | - | Outside click handler |
| `onInteractOutside` | `(event: PointerEvent) => void` | No | - | Outside interaction handler with preventDefault capability |
| `children` | `ReactNode` | Yes | - | Dialog content |
| `...props` | `HTMLAttributes` | No | - | Additional HTML props |

### DialogTitle Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'h2'` | Polymorphic element type |
| `level` | `number` | No | `2` | Heading level (1-6) |
| `children` | `ReactNode` | Yes | - | Title content |
| `...props` | `HTMLAttributes` | No | - | Additional HTML props |

### DialogDescription Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'p'` | Polymorphic element type |
| `children` | `ReactNode` | Yes | - | Description content |
| `...props` | `HTMLAttributes` | No | - | Additional HTML props |

### DialogClose Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'button'` | Polymorphic element type |
| `children` | `ReactNode \| ((state: DialogCloseRenderProps) => ReactNode)` | Yes | - | Close button content or render function for render props pattern |
| `...props` | `HTMLAttributes` | No | - | Additional HTML props |

### DialogCloseRenderProps
| Name | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Whether the dialog is currently visible |
| `close` | `() => void` | Function to programmatically close the dialog |

### Controlled/Uncontrolled Support
- **Controlled**: Use `open` + `onOpenChange`
- **Uncontrolled**: Use `defaultOpen` only
- **Ref forwarding**: All components forward refs to DOM elements

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| Closed | Trigger click/Enter/Space | Opens dialog | `aria-expanded="true"`, focus moves to dialog |
| Closed | Trigger focus | No change | Focus ring visible |
| Open | Escape key | Closes dialog | `aria-expanded="false"`, focus returns to trigger |
| Open | Outside click (modal) | Closes dialog | `aria-expanded="false"`, focus returns to trigger |
| Open | Outside interaction (non-modal) | No change | Dialog remains open, outside content interactive |
| Open | Tab at last element (modal) | Focus to first | Focus cycles within dialog |
| Open | Tab at last element (non-modal) | Focus moves outside | Focus moves to next element outside dialog |
| Open | Shift+Tab at first element (modal) | Focus to last | Focus cycles within dialog |
| Open | Shift+Tab at first element (non-modal) | Focus moves outside | Focus moves to previous element outside dialog |
| Open | Close button click/Enter | Closes dialog | `aria-expanded="false"`, focus returns to trigger |
| Open | Overlay click (modal) | Closes dialog | `aria-expanded="false"`, focus returns to trigger |
| Disabled | Any interaction | No change | No state changes |
| Nested | Open second dialog | Stacks dialogs | Previous dialog becomes inert |
| Nested | Close top dialog | Returns to previous | Focus returns to previous dialog |
| Alert Dialog Open | Default focus scenario | Focus on least destructive action | `role="alertdialog"`, system alert sound |
| Large Content Dialog | Initial focus | Focus on dialog title or first paragraph | Improves content navigation for AT users |

## 4. Accessibility

### Roles
- **DialogRoot**: No role (logical container)
- **DialogTrigger**: `button` (implicit/explicit)
- **DialogContent**: `dialog` or `alertdialog`
- **DialogTitle**: `heading` (implicit via semantic element)
- **DialogDescription**: No role (descriptive text)
- **DialogClose**: `button` (implicit/explicit)
- **DialogOverlay**: No role (presentation layer)

### Keyboard Navigation
- **Tab**: Move to next focusable element within dialog
- **Shift + Tab**: Move to previous focusable element within dialog
- **Escape**: Close dialog and return focus
- **Enter/Space** (on trigger): Open dialog
- **Enter/Space** (on close): Close dialog

### Focus Management
- **On open (modal)**: Focus moves to first focusable element or specified initial focus, traps within dialog
- **On open (non-modal)**: Focus moves to dialog but doesn't trap, allows outside interaction
- **Initial focus strategies**:
  - **Default**: First focusable element
  - **Large content**: Dialog title or first paragraph (`tabindex="-1"`)
  - **Destructive actions**: Least destructive action (e.g., "Cancel" not "Delete")
  - **Simple confirmation**: Most likely used button (e.g., "OK", "Continue")
- **Focus trap (modal only)**: Tab/Shift+Tab cycles only within dialog
- **On close**: Focus returns to trigger or specified final focus
- **Nested dialogs**: Each dialog layer maintains separate focus trap
- **Focus restoration**: Automatic unless trigger no longer exists

### Screen Reader Announcements
- **Dialog opening**: Announced via role change and initial focus
- **Title and description**: Read when dialog opens (if `aria-describedby` used)
- **Alert dialogs**: System alert sound + immediate attention via `alertdialog` role
- **Large content dialogs**: Skip `aria-describedby` to allow structural navigation
- **Close actions**: Announced when dialog closes
- **State changes**: Communicated via `aria-expanded` on trigger
- **Dynamic updates**: Use `aria-live` regions within dialog content

### Name/Role/Value Exposure
- **Dialog labeling**: `aria-labelledby` references title, fallback to `aria-label`
- **Dialog description**: `aria-describedby` references description (omit for complex content)
- **Modal state**: `aria-modal="true"` for modal dialogs, `aria-modal="false"` or omit for non-modal
- **Alert dialogs**: `role="alertdialog"` for urgent/critical messages requiring immediate attention
- **Trigger relationship**: `aria-haspopup="dialog"`, `aria-expanded` state
- **Visible labels**: All interactive elements have accessible names
- **Content outside dialog**: Made inert via `aria-modal` or `aria-hidden` (legacy approach)

### Implementation Rules (per accessibility-guidelines.instructions.md)
- Complete keyboard navigation support
- Proper focus management and visible indicators  
- Error handling with announcements
- All interactive elements have accessible names
- jest-axe tests must pass with 0 violations

## 5. Implementation Architecture

### State Hooks Design
```tsx
// Core dialog state management
const useDialogState = (props: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useControlledState({
    prop: props.open,
    defaultProp: props.defaultOpen ?? false,
    onChange: props.onOpenChange,
  });
  
  return { isOpen, setIsOpen };
};

// Focus management hook
const useDialogFocus = (props: {
  isOpen: boolean;
  modal: boolean;
  trapFocus: boolean;
  restoreFocus: boolean;
  initialFocus?: HTMLElement | (() => HTMLElement);
  finalFocus?: HTMLElement | (() => HTMLElement);
  role?: 'dialog' | 'alertdialog';
}) => {
  // Focus trap implementation (modal only)
  // Initial focus management with role-specific strategies
  // Focus restoration logic
  // Non-modal focus handling (no trap)
};

// Dialog stack management for nesting
const useDialogStack = () => {
  // Track multiple dialog layers
  // Manage inert states
  // Handle proper stacking order
};
```

### Context Requirements
```tsx
interface DialogContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  modal: boolean;
  role: 'dialog' | 'alertdialog';
  triggerRef: RefObject<HTMLElement>;
  contentRef: RefObject<HTMLElement>;
  titleId: string;
  descriptionId: string;
}

const DialogContext = createContext<DialogContextValue | null>(null);
```

### Ref Forwarding Strategy
- **DialogTrigger**: Forward to button/interactive element
- **DialogContent**: Forward to dialog container
- **DialogTitle**: Forward to heading element
- **DialogDescription**: Forward to description element
- **DialogClose**: Forward to button element
- **DialogOverlay**: Forward to overlay element

### Event System
```tsx
// Event coordination between components
const useDialogEvents = () => {
  const handleOpen = () => { /* open logic */ };
  const handleClose = () => { /* close logic */ };
  const handleEscape = (event: KeyboardEvent) => { /* escape logic */ };
  const handleOutsideClick = (event: PointerEvent) => { /* outside click logic */ };
  
  return { handleOpen, handleClose, handleEscape, handleOutsideClick };
};
```

### SSR/CSR Safety and Deterministic IDs
- Use `useId()` for generating accessible IDs
- Portal rendering handled safely across environments
- No hydration mismatches
- Deterministic ID generation for title/description relationships

## 6. Styling & Data Attributes

### Required Data Attributes
All components expose `data-*` attributes for styling without className coupling:

#### DialogRoot
- `data-state`: `"open" | "closed"`

#### DialogTrigger  
- `data-state`: `"open" | "closed"`
- `data-disabled`: Present when disabled

#### DialogOverlay
- `data-state`: `"open" | "closed"`

#### DialogContent
- `data-state`: `"open" | "closed"`
- `data-modal`: `"true" | "false"` (indicates modal vs non-modal)
- `data-role`: `"dialog" | "alertdialog"`

#### DialogTitle
- `data-level`: Heading level (`"1"` to `"6"`)

#### DialogClose
- No specific data attributes (standard button styling)

### Animation Support
- `forceMount` prop on Overlay and Content for animation libraries
- Consistent `data-state` attributes for CSS transitions
- Portal rendering prevents CSS containment issues

## 7. Test Coverage Plan

### Unit Tests
```tsx
describe('Dialog Component', () => {
  // State management
  test('controlled mode with open prop');
  test('uncontrolled mode with defaultOpen');
  test('onOpenChange callback execution');
  
  // Interaction behavior
  test('trigger opens dialog');
  test('escape closes dialog');
  test('outside click closes modal dialog');
  test('close button closes dialog');
  
  // Focus management
  test('focus moves to dialog on open (modal and non-modal)');
  test('focus traps within modal dialog');
  test('focus does not trap in non-modal dialog');
  test('focus returns to trigger on close');
  test('initial focus strategies (default, large content, destructive actions)');
  
  // Modal vs Non-modal behavior
  test('modal dialog blocks outside interaction');
  test('non-modal dialog allows outside interaction');
  
  // Alert dialog specifics
  test('alert dialog focuses least destructive action');
  test('alert dialog announces with system sound');
  
  // Nested dialogs
  test('multiple dialogs stack properly');
  test('closing top dialog returns to previous');
});
```

### Accessibility Tests
```tsx
describe('Dialog Accessibility', () => {
  test('has correct ARIA roles and properties');
  test('dialog vs alertdialog role applied correctly');
  test('aria-modal set correctly for modal/non-modal');
  test('title and description properly associated');
  test('aria-describedby omitted for complex content');
  test('keyboard navigation works correctly');
  test('screen reader announcements');
  test('focus management for all scenarios (modal/non-modal)');
  test('alert dialog initial focus on least destructive action');
  test('large content dialog focus on title/paragraph');
  test('nested dialog accessibility');
  test('passes jest-axe with 0 violations');
});
```

### Integration Tests
```tsx
describe('Dialog Integration', () => {
  test('works with form libraries');
  test('portal rendering in different containers');
  test('animation library compatibility');
  test('responsive behavior');
  test('complex nested content scenarios');
});
```

## 8. Constraints

### Zero Styling (Behavior Only)
- No CSS imports or style objects
- No visual opinions on appearance
- Styling achieved through `data-*` attributes only
- Layout and positioning through CSS external to component

### Styling via Data Attributes
- All styling hooks exposed as `data-*` attributes
- State-based styling through `data-state`
- Variant styling through component-specific data attributes
- Animation states accessible for CSS transitions

### Tree-Shakeable Exports
- Named exports for individual components
- Compound component with dot notation
- No side effects in module imports
- Optimized bundle splitting

### TypeScript Strict Mode
- Explicit type definitions for all props
- No `any` types allowed
- Strict null checks enforced
- Generic polymorphic components with proper constraints

### WCAG 2.2 AA Compliant
- All accessibility requirements met
- Keyboard navigation fully implemented
- Screen reader support comprehensive
- Focus management robust and predictable

### Controlled/Uncontrolled Support
- Both patterns supported through `useControlledState`
- Consistent API across controlled and uncontrolled modes
- Proper default value handling
- State change callbacks available

## 9. Migration & Implementation Checklist

### Migration Guidance
For teams migrating from other dialog libraries:

**From React Modal/similar:**
- Keep `open` prop pattern (consistent with Spar standards)
- Update focus management to use built-in trapping
- Migrate overlay click handling to `onPointerDownOutside` or `onInteractOutside`
- Replace custom portal logic with `Dialog.Portal`
- Add `modal` prop to specify modal vs non-modal behavior

**From Headless UI Dialog:**
- Similar compound component structure
- Replace `Dialog.Panel` with `Dialog.Content`
- Update focus management props if customized
- Migrate `static` prop usage to `forceMount`

**From Reach UI Dialog:**
- Replace single component with compound structure
- Update focus management to new prop API
- Migrate `allowPinchZoom` to CSS styling approach
- Replace `initialFocusRef` with `initialFocus`

### Implementation Checklist

#### Core Functionality
- [ ] DialogRoot with controlled/uncontrolled state (`open` prop)
- [ ] DialogTrigger with proper event handling
- [ ] DialogPortal with configurable container
- [ ] DialogOverlay with modal/non-modal background behavior
- [ ] DialogContent with modal/non-modal focus management
- [ ] DialogTitle with heading semantics
- [ ] DialogDescription with proper association (conditional based on content complexity)
- [ ] DialogClose with close functionality

#### Accessibility Requirements  
- [ ] Proper ARIA roles and properties (`dialog` vs `alertdialog`)
- [ ] Complete keyboard navigation support
- [ ] Modal focus trapping and non-modal focus flow
- [ ] Focus restoration with role-specific initial focus strategies
- [ ] Screen reader announcements (including alert dialog system sounds)
- [ ] Accessible name and description association (conditional for complex content)
- [ ] Alert dialog variant with least destructive action focus
- [ ] Non-modal dialog support with outside interaction
- [ ] Nested dialog focus management

#### Advanced Features
- [ ] Portal rendering with SSR safety
- [ ] Nested dialog support and stacking
- [ ] Custom focus management options
- [ ] Outside click and escape handling
- [ ] Animation library compatibility
- [ ] Polymorphic component support

#### Testing & Quality
- [ ] Unit tests for all functionality
- [ ] Accessibility tests with jest-axe
- [ ] Integration tests for complex scenarios
- [ ] TypeScript strict mode compliance
- [ ] Zero visual styling (behavior only)
- [ ] Tree-shakeable exports working

#### Documentation & Examples
- [ ] API documentation complete
- [ ] Usage examples for common patterns
- [ ] Migration guide for popular libraries
- [ ] Accessibility implementation notes
- [ ] Performance optimization tips
