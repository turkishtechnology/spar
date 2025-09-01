````instructions
---
applyTo: '**/Dropdown/**/*.{ts,tsx}, **/useDropdown.{ts,tsx}'
---

# Dropdown Component Instructions - TK Headless

<identity>
You are implementing an accessible, headless Dropdown component for TK Headless.
This component MUST follow the slot-based pattern for maximum customization.
MUST adhere to WAI-ARIA Menu Button design pattern.
NEVER compromise on accessibility requirements.
NEVER add visual styles - component must remain headless.
</identity>

## Component Overview

The Dropdown component is a trigger-based menu system that reveals a list of options or actions. It MUST:

- Be completely unstyled (headless)
- Support single and multi-selection modes
- Handle full keyboard navigation including typeahead
- Support all ARIA requirements for Menu Button pattern
- Work with assistive technologies
- Follow the slot-based pattern for maximum customization
- Support controlled and uncontrolled usage
- Support portal rendering for proper layering

## Component Architecture

### Core Pattern: Full Slot Pattern

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>Open Menu</Button>
  </Dropdown.Trigger>

  <Dropdown.Portal>
    <Dropdown.Content>
      <Dropdown.Item onSelect={() => console.log('Edit')}>
        Edit
      </Dropdown.Item>
      <Dropdown.Item onSelect={() => console.log('Duplicate')}>
        Duplicate
      </Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Item disabled>
        Archive
      </Dropdown.Item>
      <Dropdown.Item onSelect={() => console.log('Delete')}>
        Delete
      </Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown>
```

### Advanced Usage with Groups

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>Options</Button>
  </Dropdown.Trigger>

  <Dropdown.Portal>
    <Dropdown.Content>
      <Dropdown.Label>Actions</Dropdown.Label>
      <Dropdown.Item>Edit</Dropdown.Item>
      <Dropdown.Item>Duplicate</Dropdown.Item>

      <Dropdown.Separator />

      <Dropdown.Group>
        <Dropdown.Label>Danger Zone</Dropdown.Label>
        <Dropdown.Item variant="danger">
          Delete
        </Dropdown.Item>
      </Dropdown.Group>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown>
```

### Component Structure

```typescript
// Core Components
Dropdown                     // Root container with state management
├── Dropdown.Trigger        // Button that opens/closes the dropdown
├── Dropdown.Portal         // Portal wrapper for proper layering
├── Dropdown.Content        // Container for dropdown items
│   ├── Dropdown.Item       // Individual selectable items
│   ├── Dropdown.Label      // Non-interactive labels
│   ├── Dropdown.Group      // Grouping wrapper for items
│   └── Dropdown.Separator  // Visual separator between items
```

## API Requirements

### Dropdown (Root)

**Required Props:**

- `children: React.ReactNode` - Child components

**Optional Props:**

- `open?: boolean` - Controlled open state
- `defaultOpen?: boolean` - Default open state
- `onOpenChange?: (open: boolean) => void` - Open state change handler
- `modal?: boolean` - Whether dropdown should be modal (default: true)
- `dir?: 'ltr' | 'rtl'` - Reading direction for positioning

### Dropdown.Trigger

**Required Props:**

- `children: React.ReactNode` - Trigger content (typically a Button)

**Optional Props:**

- `asChild?: boolean` - Pass props to child instead of creating wrapper
- Standard button props when not using asChild

### Dropdown.Portal

**Optional Props:**

- `forceMount?: boolean` - Force mount even when closed
- `container?: HTMLElement` - Portal container (default: document.body)

### Dropdown.Content

**Required Props:**

- `children: React.ReactNode` - Dropdown items

**Optional Props:**

- `side?: 'top' | 'right' | 'bottom' | 'left'` - Preferred side (default: 'bottom')
- `sideOffset?: number` - Distance from trigger (default: 0)
- `align?: 'start' | 'center' | 'end'` - Alignment relative to trigger (default: 'center')
- `alignOffset?: number` - Offset from alignment point (default: 0)
- `avoidCollisions?: boolean` - Reposition to avoid collisions (default: true)
- `collisionBoundary?: Element[]` - Boundary elements for collision detection
- `collisionPadding?: number` - Padding for collision detection (default: 0)
- `sticky?: 'partial' | 'always'` - Sticky behavior (default: 'partial')
- `hideWhenDetached?: boolean` - Hide when detached from reference (default: false)
- `forceMount?: boolean` - Force mount even when closed
- `loop?: boolean` - Loop keyboard navigation (default: false)

### Dropdown.Item

**Required Props:**

- `children: React.ReactNode` - Item content

**Optional Props:**

- `disabled?: boolean` - Disable the item
- `textValue?: string` - Text for typeahead search
- `onSelect?: (event: Event) => void` - Selection handler
- `closeOnSelect?: boolean` - Close dropdown on selection (default: true)

### Dropdown.Label

**Required Props:**

- `children: React.ReactNode` - Label content

### Dropdown.Group

**Required Props:**

- `children: React.ReactNode` - Group content

### Dropdown.Separator

**Optional Props:**

- No required props, renders a separator

## Accessibility Requirements (WAI-ARIA Menu Button Pattern)

### MUST-HAVE ARIA Attributes

**Root:**

- Manages focus and open state

**Trigger:**

- `type="button"` (when using button element)
- `aria-haspopup="menu"`
- `aria-expanded="true|false"` - Based on open state
- `aria-controls` - ID of content when open
- `data-state="open|closed"`

**Content:**

- `role="menu"`
- `aria-labelledby` - ID of trigger
- `data-state="open|closed"`
- `data-side="top|right|bottom|left"`
- `data-align="start|center|end"`

**Item:**

- `role="menuitem"`
- `tabindex="-1"` (managed by roving tabindex)
- `aria-disabled="true"` when disabled
- `data-highlighted` when focused
- `data-disabled` when disabled

**Label:**

- No interactive role (just text)
- `data-tk-dropdown-label`

**Separator:**

- `role="separator"`
- `aria-orientation="horizontal"`

### Keyboard Navigation (WAI-ARIA Menu Button Pattern)

| Key                     | Action                                    |
| ----------------------- | ----------------------------------------- |
| `Enter` or `Space`      | Open dropdown when trigger focused       |
| `ArrowDown`             | Open dropdown and focus first item       |
| `ArrowUp`               | Open dropdown and focus last item        |
| `ArrowDown` (in menu)   | Focus next item                          |
| `ArrowUp` (in menu)     | Focus previous item                      |
| `Home`                  | Focus first item                         |
| `End`                   | Focus last item                          |
| `Enter` or `Space`      | Activate focused item                    |
| `Escape`                | Close dropdown and return focus to trigger |
| `A-Z`, `a-z`            | Typeahead search to matching items       |
| `Tab`                   | Close dropdown and move to next element |

### Focus Management

- Opening dropdown moves focus to first non-disabled item
- Arrow keys use roving tabindex between items
- Closing dropdown returns focus to trigger
- Focus should skip disabled items and separators
- Support typeahead search (case-insensitive, resets after delay)

## Data Attributes for Styling

### Root Dropdown

- `data-tk-dropdown`
- `data-state="open|closed"`

### Trigger

- `data-tk-dropdown-trigger`
- `data-state="open|closed"`

### Content

- `data-tk-dropdown-content`
- `data-state="open|closed"`
- `data-side="top|right|bottom|left"`
- `data-align="start|center|end"`

### Items

- `data-tk-dropdown-item`
- `data-highlighted` (when focused)
- `data-disabled` (when disabled)

### Labels

- `data-tk-dropdown-label`

### Groups

- `data-tk-dropdown-group`

### Separators

- `data-tk-dropdown-separator`

## Positioning & Portal System

### Positioning Logic

- Use Floating UI for collision-aware positioning
- Default positioning: bottom-center relative to trigger
- Automatic collision detection and repositioning
- Support for custom boundaries and padding

### Portal Requirements

- MUST render content in portal by default for proper layering
- MUST support custom portal containers
- MUST handle focus management across portal boundaries
- MUST support server-side rendering

### CSS Custom Properties

Content should expose these CSS variables for advanced styling:

- `--tk-dropdown-content-transform-origin` - Transform origin for animations
- `--tk-dropdown-content-available-width` - Available width
- `--tk-dropdown-content-available-height` - Available height
- `--tk-dropdown-trigger-width` - Trigger width
- `--tk-dropdown-trigger-height` - Trigger height

## State Management

### Open/Close Logic

- Click trigger: Toggle open state
- Click outside: Close dropdown
- Escape key: Close dropdown
- Item selection: Close dropdown (unless `closeOnSelect=false`)
- Tab key: Close dropdown and continue tab sequence

### Controlled vs Uncontrolled

- **Uncontrolled**: Use `defaultOpen` for initial state
- **Controlled**: Use `open` and `onOpenChange` props

### Event Handling

```typescript
// Selection events
onSelect?: (event: Event) => void

// Open state events
onOpenChange?: (open: boolean) => void

// Positioning events
onEscapeKeyDown?: (event: KeyboardEvent) => void
onPointerDownOutside?: (event: PointerEvent) => void
onFocusOutside?: (event: FocusEvent) => void
```

## Animation Support

### CSS-based Animations

Components should set data attributes for animation states:

- `data-state="open|closed"` for enter/exit animations
- `data-side` and `data-align` for direction-aware animations
- Transform origin set via CSS custom property

### Transition Example

```css
[data-tk-dropdown-content] {
  transform-origin: var(--tk-dropdown-content-transform-origin);
  transition: all 150ms ease;
}

[data-tk-dropdown-content][data-state="closed"] {
  opacity: 0;
  transform: scale(0.95);
}

[data-tk-dropdown-content][data-state="open"] {
  opacity: 1;
  transform: scale(1);
}
```

## TypeScript Integration

### Generic Support

```typescript
// Support for custom item data
interface DropdownItemProps<T = any> {
  value?: T;
  onSelect?: (value: T, event: Event) => void;
  children: React.ReactNode;
}

// Usage
<Dropdown.Item<User>
  value={user}
  onSelect={(user, event) => handleUserSelect(user)}
>
  {user.name}
</Dropdown.Item>
```

### Event Types

```typescript
type DropdownItemSelectEvent = Event & {
  currentTarget: HTMLElement;
};

type DropdownOpenChangeEvent = {
  open: boolean;
  trigger: 'click' | 'keyboard' | 'focus' | 'outside-click';
};
```

## Implementation Notes

### Roving Tabindex

- Only one item in the dropdown should be tabbable at a time
- Use `tabindex="-1"` for non-current items
- Use `tabindex="0"` for current item
- Update tabindex as focus moves

### Typeahead Search

- Match based on item text content or `textValue` prop
- Case-insensitive matching
- Reset search after 1 second of inactivity
- Support space character in search terms

### Collision Detection

- Use Floating UI's collision detection
- Automatically flip sides when out of viewport
- Shift content to stay within boundaries
- Respect `collisionBoundary` and `collisionPadding`

### RTL Support

- Positioning automatically adapts to RTL
- Arrow key navigation respects reading direction
- Use CSS logical properties for layout

## Usage Examples

### Basic Dropdown

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>Options</Button>
  </Dropdown.Trigger>

  <Dropdown.Portal>
    <Dropdown.Content>
      <Dropdown.Item onSelect={() => console.log('Edit')}>
        Edit
      </Dropdown.Item>
      <Dropdown.Item onSelect={() => console.log('Duplicate')}>
        Duplicate
      </Dropdown.Item>
      <Dropdown.Item onSelect={() => console.log('Delete')}>
        Delete
      </Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown>
```

### Controlled Dropdown

```tsx
const [open, setOpen] = useState(false);

<Dropdown open={open} onOpenChange={setOpen}>
  <Dropdown.Trigger>
    <Button>Controlled</Button>
  </Dropdown.Trigger>

  <Dropdown.Portal>
    <Dropdown.Content>
      <Dropdown.Item>Item 1</Dropdown.Item>
      <Dropdown.Item>Item 2</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown>
```

### With Groups and Separators

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>File</Button>
  </Dropdown.Trigger>

  <Dropdown.Portal>
    <Dropdown.Content>
      <Dropdown.Group>
        <Dropdown.Label>File Actions</Dropdown.Label>
        <Dropdown.Item>New File</Dropdown.Item>
        <Dropdown.Item>Open File</Dropdown.Item>
        <Dropdown.Item>Save File</Dropdown.Item>
      </Dropdown.Group>

      <Dropdown.Separator />

      <Dropdown.Group>
        <Dropdown.Label>Recent Files</Dropdown.Label>
        <Dropdown.Item>document.txt</Dropdown.Item>
        <Dropdown.Item>image.png</Dropdown.Item>
      </Dropdown.Group>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown>
```

### With Custom Positioning

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>Open</Button>
  </Dropdown.Trigger>

  <Dropdown.Portal>
    <Dropdown.Content
      side="top"
      align="start"
      sideOffset={5}
      alignOffset={10}
    >
      <Dropdown.Item>Item 1</Dropdown.Item>
      <Dropdown.Item>Item 2</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown>
```

### With Disabled Items

```tsx
<Dropdown>
  <Dropdown.Trigger>
    <Button>Actions</Button>
  </Dropdown.Trigger>

  <Dropdown.Portal>
    <Dropdown.Content>
      <Dropdown.Item>Edit</Dropdown.Item>
      <Dropdown.Item disabled>
        Archive (Pro only)
      </Dropdown.Item>
      <Dropdown.Item>Delete</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown>
```

## Testing Requirements

### Accessibility Tests

- MUST test all ARIA attributes are correctly applied
- MUST test keyboard navigation (all keys in spec)
- MUST test focus management (open/close/navigation)
- MUST test screen reader announcements
- MUST test typeahead search functionality

### Interaction Tests

- MUST test controlled vs uncontrolled modes
- MUST test trigger click opens/closes
- MUST test outside click closes
- MUST test escape key closes
- MUST test item selection behavior
- MUST test disabled item handling

### Positioning Tests

- MUST test collision detection
- MUST test all side/align combinations
- MUST test portal rendering
- MUST test viewport boundaries

### State Tests

- MUST test open/close state management
- MUST test event callbacks
- MUST test default values

## Common Mistakes to AVOID

1. ❌ **Missing ARIA relationships**
   - Always connect trigger and content with proper IDs

2. ❌ **Incorrect focus management**
   - Focus must move to first item when opening
   - Focus must return to trigger when closing

3. ❌ **Not implementing roving tabindex**
   - Only one item should be tabbable at a time

4. ❌ **Missing typeahead search**
   - Users expect to type letters to jump to items

5. ❌ **Incorrect keyboard navigation**
   - Arrow keys must work, not just Tab

6. ❌ **Not handling outside clicks**
   - Dropdown should close when clicking outside

7. ❌ **Missing collision detection**
   - Content should reposition when hitting viewport edges

8. ❌ **Not using portal for layering**
   - Content can be clipped by parent containers

<reminders>
REMEMBER: Accessibility is NOT optional for TK Headless components.
REMEMBER: ALWAYS follow WAI-ARIA Menu Button pattern.
REMEMBER: ALWAYS test with keyboard navigation.
REMEMBER: ALWAYS test with screen readers.
REMEMBER: Focus management is critical for usability.
REMEMBER: Typeahead search is expected by users.
REMEMBER: Use data attributes for styling, not CSS classes.
REMEMBER: Support both controlled and uncontrolled usage.
REMEMBER: Portal rendering is essential for proper layering.
REMEMBER: Collision detection improves user experience.
</reminders>

````
