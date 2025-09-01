---
applyTo: '**/Modal/**/*.{ts,tsx}, **/Modal.{ts,tsx}, **/useModal.{ts,tsx}, **/Dialog/**/*.{ts,tsx}, **/Dialog.{ts,tsx}, **/useDialog.{ts,tsx}'
---

# Modal Component Instructions - TK Headless

<identity>
You are implementing an accessible, headless Modal component for TK Headless.
This component MUST follow the slot-based pattern for maximum customization.
MUST adhere to WAI-ARIA Dialog design pattern.
NEVER compromise on accessibility requirements.
NEVER add visual styles - component must remain headless.
</identity>

## Component Overview

The Modal component is an overlay window that displays content on top of the main interface. It MUST:

- Be completely unstyled (headless)
- Support modal and non-modal modes
- Handle full keyboard navigation with focus trap
- Support all ARIA requirements (dialog/alertdialog roles)
- Work with assistive technologies
- Follow the slot-based pattern for maximum customization
- Support controlled and uncontrolled usage
- Handle portal rendering for proper z-index management
- Provide proper scroll lock and backdrop handling

## Component Architecture

### Core Pattern: Full Slot Pattern

```tsx
<Modal open={isOpen} onOpenChange={setIsOpen}>
  <Modal.Trigger>Open Modal</Modal.Trigger>
  <Modal.Portal>
    <Modal.Overlay />
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>Modal Title</Modal.Title>
        <Modal.Description>Optional description</Modal.Description>
        <Modal.Close />
      </Modal.Header>
      <Modal.Body>{/* Modal content */}</Modal.Body>
      <Modal.Footer>
        <Modal.Close>Cancel</Modal.Close>
        <button>Confirm</button>
      </Modal.Footer>
    </Modal.Content>
  </Modal.Portal>
</Modal>
```

### Alternative Simple Pattern

```tsx
<Modal open={isOpen} onOpenChange={setIsOpen}>
  <Modal.Content>
    <Modal.Title>Modal Title</Modal.Title>
    <Modal.Description>Description</Modal.Description>
    {/* Content */}
    <Modal.Close>Close</Modal.Close>
  </Modal.Content>
</Modal>
```

### Component Structure

```typescript
// Core Components
Modal                        // Root container with state management
├── Modal.Trigger           // Button that opens the modal
├── Modal.Portal            // Portal wrapper for overlay and content
│   ├── Modal.Overlay       // Background overlay/backdrop
│   └── Modal.Content       // Main modal container
│       ├── Modal.Header    // Header section wrapper
│       │   ├── Modal.Title // Accessible title (aria-labelledby)
│       │   ├── Modal.Description // Accessible description (aria-describedby)
│       │   └── Modal.Close // Close button in header
│       ├── Modal.Body      // Content section wrapper
│       └── Modal.Footer    // Footer section wrapper
│           └── Modal.Close // Close button (can be used anywhere)
```

## API Requirements

### Modal (Root)

**Required Props:**

- `children: React.ReactNode` - Child components

**Optional Props:**

- `open?: boolean` - Controlled open state
- `defaultOpen?: boolean` - Default open state (uncontrolled)
- `onOpenChange?: (open: boolean) => void` - Change handler
- `modal?: boolean` - Modal vs non-modal mode (default: true)
- `role?: 'dialog' | 'alertdialog'` - ARIA role (default: 'dialog')

### Modal.Trigger

**Required Props:**

- `children: React.ReactNode` - Button content

**Optional Props:**

- All button HTML attributes

### Modal.Portal

**Required Props:**

- `children: React.ReactNode` - Overlay and Content

**Optional Props:**

- `container?: HTMLElement` - Portal container (default: document.body)
- `forceMount?: boolean` - Force mount regardless of state

### Modal.Overlay

**Required Props:**

- None (all optional)

**Optional Props:**

- `forceMount?: boolean` - Force mount regardless of state
- All div HTML attributes

### Modal.Content

**Required Props:**

- `children: React.ReactNode` - Modal content

**Optional Props:**

- `forceMount?: boolean` - Force mount regardless of state
- `onOpenAutoFocus?: (event: Event) => void` - Auto focus handler
- `onCloseAutoFocus?: (event: Event) => void` - Close focus handler
- `onEscapeKeyDown?: (event: KeyboardEvent) => void` - Escape key handler
- `onPointerDownOutside?: (event: PointerEvent) => void` - Outside click handler
- `onInteractOutside?: (event: Event) => void` - Outside interaction handler
- All div HTML attributes

### Modal.Header

**Required Props:**

- `children: React.ReactNode` - Header content

**Optional Props:**

- All div HTML attributes

### Modal.Title

**Required Props:**

- `children: React.ReactNode` - Title content

**Optional Props:**

- All heading HTML attributes

### Modal.Description

**Required Props:**

- `children: React.ReactNode` - Description content

**Optional Props:**

- All paragraph HTML attributes

### Modal.Body

**Required Props:**

- `children: React.ReactNode` - Body content

**Optional Props:**

- All div HTML attributes

### Modal.Footer

**Required Props:**

- `children: React.ReactNode` - Footer content

**Optional Props:**

- All div HTML attributes

### Modal.Close

**Required Props:**

- `children: React.ReactNode` - Close button content

**Optional Props:**

- All button HTML attributes

## TypeScript Interface Requirements

```typescript
// Base Props
interface ModalProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  role?: 'dialog' | 'alertdialog';
}

interface ModalTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface ModalPortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
  forceMount?: boolean;
}

interface ModalOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  forceMount?: boolean;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onInteractOutside?: (event: Event) => void;
}

interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

interface ModalDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface ModalCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

// Context Types
interface ModalContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
  contentRef: React.RefObject<HTMLElement>;
  modal: boolean;
  role: 'dialog' | 'alertdialog';
  titleId?: string;
  descriptionId?: string;
}
```

## Accessibility Requirements

### ARIA Implementation

**Modal.Content MUST have:**

```typescript
const ariaProps = {
  role: context.role,
  'aria-modal': context.modal,
  'aria-labelledby': context.titleId,
  'aria-describedby': context.descriptionId,
  tabIndex: -1, // For initial focus
};
```

**Modal.Title MUST:**

- Generate unique ID for aria-labelledby
- Use semantic heading element (h2 by default)
- Be announced when modal opens

**Modal.Description MUST:**

- Generate unique ID for aria-describedby
- Use semantic paragraph element
- Provide additional context

### Focus Management

**Opening Modal:**

1. Save reference to trigger element
2. Move focus to modal content or first focusable element
3. Trap focus within modal
4. Prevent focus on background content

**Closing Modal:**

1. Return focus to original trigger element
2. Remove focus trap
3. Restore background content interaction

**Focus Trap Implementation:**

```typescript
const focusableSelectors = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

const getFocusableElements = (container: HTMLElement) => {
  return Array.from(container.querySelectorAll(focusableSelectors)).filter(
    (el) => el.tabIndex !== -1,
  ) as HTMLElement[];
};
```

### Keyboard Navigation

**Required Key Handlers:**

- `Escape`: Close modal and return focus
- `Tab`: Navigate forward through focusable elements
- `Shift + Tab`: Navigate backward through focusable elements
- `Space/Enter` on trigger: Open modal
- `Space/Enter` on close: Close modal

### Screen Reader Support

**Announcements:**

- Modal opening: Title and description announced
- Modal closing: Focus returned with confirmation
- Loading states: Proper aria-live updates
- Error states: Clear error announcements

## State Management

### Context Implementation

```typescript
// Root context for modal state
const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be used within a Modal provider');
  }
  return context;
};
```

### Controlled vs Uncontrolled

```typescript
// Support both patterns
const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
const isControlled = open !== undefined;
const openState = isControlled ? open : internalOpen;
const setOpenState = isControlled ? onOpenChange : setInternalOpen;
```

## Portal and Overlay Management

### Portal Implementation

- Render to document.body by default
- Support custom container
- Handle cleanup on unmount
- Manage z-index stacking

### Scroll Lock

```typescript
useEffect(() => {
  if (open && modal) {
    // Lock body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }
}, [open, modal]);
```

### Outside Click Handling

```typescript
const handlePointerDownOutside = useCallback(
  (event: PointerEvent) => {
    if (onPointerDownOutside) {
      onPointerDownOutside(event);
    }

    if (!event.defaultPrevented && modal) {
      onOpenChange(false);
    }
  },
  [onPointerDownOutside, modal, onOpenChange],
);
```

## Advanced Features

### Non-Modal Mode

- Background content remains interactive
- No focus trap
- No scroll lock
- Click outside doesn't close

### Animation Support

```typescript
// Support for transition libraries
interface ModalContentProps {
  forceMount?: boolean; // For animation libraries
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}
```

### Composition Patterns

```typescript
// Standard element rendering
return <div {...props}>{children}</div>;
```

## Usage Examples

### Basic Modal

```tsx
const [open, setOpen] = useState(false);

<Modal open={open} onOpenChange={setOpen}>
  <Modal.Trigger>Open Modal</Modal.Trigger>
  <Modal.Content>
    <Modal.Title>Confirm Action</Modal.Title>
    <Modal.Description>Are you sure you want to continue?</Modal.Description>
    <div>
      <Modal.Close>Cancel</Modal.Close>
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  </Modal.Content>
</Modal>;
```

### Alert Dialog

```tsx
<Modal role='alertdialog'>
  <Modal.Trigger>Delete Item</Modal.Trigger>
  <Modal.Content>
    <Modal.Title>Delete Confirmation</Modal.Title>
    <Modal.Description>This action cannot be undone. Are you sure?</Modal.Description>
    <div>
      <Modal.Close>Cancel</Modal.Close>
      <button onClick={handleDelete}>Delete</button>
    </div>
  </Modal.Content>
</Modal>
```

### Form Modal

```tsx
<Modal>
  <Modal.Trigger>Edit Profile</Modal.Trigger>
  <Modal.Portal>
    <Modal.Overlay />
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>Edit Profile</Modal.Title>
        <Modal.Close aria-label='Close' />
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <input name='name' placeholder='Name' />
          <input name='email' placeholder='Email' />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close>Cancel</Modal.Close>
        <button type='submit'>Save</button>
      </Modal.Footer>
    </Modal.Content>
  </Modal.Portal>
</Modal>
```

### Custom Trigger

```tsx
<Modal>
  <Modal.Trigger>
    <CustomButton>Open Modal</CustomButton>
  </Modal.Trigger>
  <Modal.Content>{/* Content */}</Modal.Content>
</Modal>
```

## Implementation Guidelines

### File Structure

```
Modal/
├── Modal.tsx              // Root component and exports
├── ModalTrigger.tsx       // Trigger component
├── ModalPortal.tsx        // Portal wrapper
├── ModalOverlay.tsx       // Backdrop/overlay
├── ModalContent.tsx       // Main content container
├── ModalHeader.tsx        // Header wrapper
├── ModalTitle.tsx         // Title component
├── ModalDescription.tsx   // Description component
├── ModalBody.tsx          // Body wrapper
├── ModalFooter.tsx        // Footer wrapper
├── ModalClose.tsx         // Close button
├── types.ts               // TypeScript definitions
├── hooks/
│   ├── useModal.ts        // Main modal hook
│   ├── useFocusTrap.ts    // Focus trap utility
│   └── useScrollLock.ts   // Scroll lock utility
└── __tests__/
    ├── Modal.test.tsx
    ├── Modal.a11y.test.tsx
    └── Modal.integration.test.tsx
```

### Component Export Pattern

```typescript
// Modal.tsx
export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Portal: ModalPortal,
  Overlay: ModalOverlay,
  Content: ModalContent,
  Header: ModalHeader,
  Title: ModalTitle,
  Description: ModalDescription,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose,
});

// index.ts
export { Modal } from './Modal';
export type * from './types';
```

## Testing Requirements

### Unit Tests

- [ ] Component rendering
- [ ] Props handling
- [ ] State management
- [ ] Event handlers
- [ ] Context propagation

### Accessibility Tests

- [ ] ARIA attributes
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Screen reader announcements
- [ ] High contrast mode

### Integration Tests

- [ ] Full user workflows
- [ ] Portal rendering
- [ ] Outside click handling
- [ ] Escape key functionality
- [ ] Animation compatibility

### Performance Tests

- [ ] Bundle size impact
- [ ] Render performance
- [ ] Memory leaks
- [ ] Focus trap efficiency

## Best Practices

### Do's

✅ Always provide Modal.Title for accessibility
✅ Use appropriate ARIA roles (dialog vs alertdialog)
✅ Implement proper focus management
✅ Support both controlled and uncontrolled usage
✅ Handle edge cases (rapid open/close, multiple modals)
✅ Test with screen readers
✅ Use semantic HTML elements
✅ Provide escape hatches for custom behavior

### Don'ts

❌ Don't add visual styles - keep it headless
❌ Don't break keyboard navigation
❌ Don't forget focus management
❌ Don't ignore screen reader users
❌ Don't make assumptions about content structure
❌ Don't block programmatic control
❌ Don't create accessibility barriers

<reminders>
REMEMBER: Modal is critical for user workflows - accessibility is non-negotiable
REMEMBER: Focus management makes or breaks the user experience
REMEMBER: Support both simple and complex use cases
REMEMBER: Test with real assistive technologies
REMEMBER: Portal rendering is essential for proper z-index
REMEMBER: Escape key MUST always work
REMEMBER: Return focus to trigger element on close
</reminders>
