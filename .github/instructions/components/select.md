# Select — Spar Headless Instructions

## 1. Component Overview

### Purpose and Use Cases
The Select component is a headless, fully accessible dropdown UI pattern that allows users to choose a single value from a list of options. It provides a complete implementation of the WAI-ARIA Listbox pattern with combobox trigger behavior.

**Primary Use Cases:**
- Form field selection (country, category, status)
- Settings and preferences
- Filter controls
- Data table column selectors
- Navigation options

### Compound Component Structure
```tsx
<Select.Root>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>

  <Select.Portal>
    <Select.Content>
      <Select.Viewport>
        <Select.Group>
          <Select.Label />
          <Select.Item>
            <Select.ItemText />
            <Select.ItemIndicator />
          </Select.Item>
        </Select.Group>

        <Select.Separator />
        <Select.Arrow />
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

### Key Differentiators
- **Zero styling**: Pure behavior implementation
- **Full keyboard navigation**: Complete ARIA Listbox support
- **Flexible positioning**: Item-aligned or popper-based
- **Controlled/Uncontrolled**: Both patterns supported
- **Type-ahead search**: Built-in character navigation
- **Form integration**: Native HTML form support
- **SSR safe**: Deterministic IDs and hydration-safe

## 2. API

### Select.Root
The main container that manages all select state and behavior.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | No | - | Controlled selected value |
| `defaultValue` | `string` | No | - | Uncontrolled initial value |
| `onValueChange` | `(value: string) => void` | No | - | Callback when selection changes |
| `open` | `boolean` | No | - | Controlled open state |
| `defaultOpen` | `boolean` | No | `false` | Uncontrolled initial open state |
| `onOpenChange` | `(open: boolean) => void` | No | - | Callback when open state changes |
| `disabled` | `boolean` | No | `false` | Disables the entire select |
| `required` | `boolean` | No | `false` | Makes the select required for forms |
| `name` | `string` | No | - | Form field name |
| `dir` | `'ltr' \| 'rtl'` | No | `'ltr'` | Reading direction |
| `as` | `PolymorphicAs` | No | - | Polymorphic component type |

### Select.Trigger
The button that toggles the dropdown.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `PolymorphicAs` | No | `button` | Polymorphic component type |
| `ref` | `RefObject` | No | - | Forward ref support |
| `children` | `ReactNode \| ((state: SelectTriggerRenderProps) => ReactNode)` | No | - | Trigger content or render function for render props pattern |

### SelectTriggerRenderProps

| Name | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Whether the dropdown is currently visible |
| `value` | `string \| undefined` | The currently selected value |
| `disabled` | `boolean` | Whether the trigger is disabled |
| `open` | `() => void` | Function to programmatically open the dropdown |
| `close` | `() => void` | Function to programmatically close the dropdown |
| `toggle` | `() => void` | Function to programmatically toggle the dropdown |

**Data Attributes:**
- `data-state`: `"open" | "closed"`
- `data-disabled`: Present when disabled
- `data-placeholder`: Present when no value selected

### Select.Value
Displays the selected value or placeholder.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `placeholder` | `ReactNode` | No | - | Text shown when no value selected |
| `as` | `PolymorphicAs` | No | `span` | Polymorphic component type |

### Select.Icon
Optional visual indicator (chevron, arrow).

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `PolymorphicAs` | No | `span` | Polymorphic component type |

### Select.Portal
Portal container for dropdown rendering.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `container` | `HTMLElement` | No | `document.body` | Portal target element |
| `forceMount` | `boolean` | No | `false` | Force mount for animation control |

### Select.Content
The dropdown container that appears when open.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `position` | `'item-aligned' \| 'popper'` | No | `'item-aligned'` | Positioning strategy |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | No | `'bottom'` | Preferred placement side (popper only) |
| `sideOffset` | `number` | No | `8` | Distance from trigger in pixels |
| `align` | `'start' \| 'center' \| 'end'` | No | `'start'` | Alignment relative to trigger |
| `alignOffset` | `number` | No | `0` | Alignment offset in pixels |
| `avoidCollisions` | `boolean` | No | `true` | Adjust position to avoid viewport edges |
| `collisionBoundary` | `Element \| Element[]` | No | `[]` | Boundaries for collision detection |
| `collisionPadding` | `number \| Padding` | No | `8` | Padding from boundary edges (in pixels) |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | No | - | Escape key handler |
| `onPointerDownOutside` | `(event: PointerEvent) => void` | No | - | Outside click handler |
| `onCloseAutoFocus` | `(event: FocusEvent) => void` | No | - | Focus handler on close |
| `as` | `PolymorphicAs` | No | `div` | Polymorphic component type |
| `ref` | `RefObject` | No | - | Forward ref support |

**Data Attributes:**
- `data-state`: `"open" | "closed"`
- `data-side`: `"top" | "right" | "bottom" | "left"`
- `data-align`: `"start" | "center" | "end"`

**CSS Variables (popper mode):**
- `--select-content-transform-origin`: Transform origin for animations
- `--select-content-available-width`: Available width
- `--select-content-available-height`: Available height
- `--select-trigger-width`: Trigger element width
- `--select-trigger-height`: Trigger element height

### Select.Viewport
Scrollable container for select items.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `PolymorphicAs` | No | `div` | Polymorphic component type |

### Select.Item
Individual selectable option.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | Yes | - | Option value |
| `disabled` | `boolean` | No | `false` | Disables the option |
| `textValue` | `string` | No | - | Text for type-ahead (auto-detected if not provided) |
| `as` | `PolymorphicAs` | No | `div` | Polymorphic component type |
| `ref` | `RefObject` | No | - | Forward ref support |
| `children` | `ReactNode \| ((state: SelectItemRenderProps) => ReactNode)` | No | - | Item content or render function for render props pattern |

### SelectItemRenderProps

| Name | Type | Description |
|------|------|-------------|
| `isSelected` | `boolean` | Whether this item is currently selected |
| `isHighlighted` | `boolean` | Whether this item is currently highlighted |
| `disabled` | `boolean` | Whether this item is disabled |
| `select` | `() => void` | Function to programmatically select this item |

**Data Attributes:**
- `data-state`: `"checked" | "unchecked"`
- `data-disabled`: Present when disabled
- `data-highlighted`: Present when keyboard focused

### Select.ItemText
The text content of an item.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `PolymorphicAs` | No | `span` | Polymorphic component type |

### Select.ItemIndicator
Visual indicator for selected state (checkmark, etc).

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `forceMount` | `boolean` | No | `false` | Force mount for animation |
| `as` | `PolymorphicAs` | No | `span` | Polymorphic component type |

### Select.Group
Groups related items together.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `PolymorphicAs` | No | `div` | Polymorphic component type |

### Select.Label
Label for a group of items.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `PolymorphicAs` | No | `div` | Polymorphic component type |

### Select.Separator
Visual separator between items or groups.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `PolymorphicAs` | No | `div` | Polymorphic component type |

### Select.Arrow
Optional arrow pointing to trigger.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `width` | `number` | No | `10` | Arrow width |
| `height` | `number` | No | `5` | Arrow height |
| `as` | `PolymorphicAs` | No | `svg` | Polymorphic component type |

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| Closed, Trigger focused | `Space` / `Enter` | Opens dropdown, focuses selected item (or first if none) | `aria-expanded="true"`, `data-state="open"` |
| Closed, Trigger focused | `ArrowDown` / `ArrowUp` | Opens dropdown, focuses selected/first item | `aria-expanded="true"`, `data-state="open"` |
| Open | `Escape` | Closes dropdown, returns focus to trigger | `aria-expanded="false"`, `data-state="closed"` |
| Open, item focused | `Enter` / `Space` | Selects focused item, closes dropdown | `value` updates, `aria-expanded="false"`, fires `onValueChange` |
| Open, item focused | `ArrowDown` | Moves focus to next non-disabled item | `aria-activedescendant` updates |
| Open, item focused | `ArrowUp` | Moves focus to previous non-disabled item | `aria-activedescendant` updates |
| Open, item focused | `Home` / `PageUp` | Moves focus to first non-disabled item | `aria-activedescendant` updates |
| Open, item focused | `End` / `PageDown` | Moves focus to last non-disabled item | `aria-activedescendant` updates |
| Open, item focused | `A-Z` or `a-z` | Type-ahead: finds and focuses matching item | `aria-activedescendant` updates |
| Open | Click outside | Closes dropdown without selection | `aria-expanded="false"`, `data-state="closed"` |
| Any | Trigger loses focus | If `onBlur` provided, fires callback | No state change unless controlled |
| Disabled | Any interaction | No action | No updates |
| Selected item | Render | Item marked with indicator | `data-state="checked"`, `aria-selected="true"` |

## 4. Accessibility

### Roles
- **Trigger**: `role="combobox"` or `button` with `aria-haspopup="listbox"`
- **Content**: `role="listbox"`
- **Item**: `role="option"`
- **Group**: `role="group"`
- **Label**: No role (uses `aria-labelledby` on group)

### Keyboard Navigation
Following WAI-ARIA Listbox pattern:

**When Trigger has focus:**
- `Space` / `Enter` → Open dropdown, focus selected/first item
- `ArrowDown` / `ArrowUp` → Open dropdown, focus selected/first item

**When dropdown is open:**
- `Escape` → Close dropdown, return focus to trigger
- `Enter` / `Space` → Select focused item, close dropdown
- `ArrowDown` → Focus next item (wrap to first)
- `ArrowUp` → Focus previous item (wrap to last)
- `Home` / `PageUp` → Focus first item
- `End` / `PageDown` → Focus last item
- `A-Z` / `a-z` → Type-ahead search (focus matching item)
- `Tab` → Close dropdown, move focus to next tabbable element

### Focus Management
1. **Initial focus**: When opened, focus moves to selected item (or first item if none selected)
2. **Focus trap**: While open, focus remains within dropdown (or on trigger via aria-activedescendant)
3. **Focus restoration**: On close (Escape, selection, outside click), focus returns to trigger
4. **Visual indicator**: Focus must have visible outline (WCAG 2.4.7)
5. **Focus not obscured**: Focused item must be visible (WCAG 2.4.11 - new in 2.2)

### Screen Reader Announcements
- Trigger announces: "Select [label], [current value or placeholder], collapsed/expanded"
- Items announce: "[Option text], [X of Y], selected/not selected"
- On selection: "[Option text] selected"
- Group labels announce context: "[Group label], group"

### Name/Role/Value Exposure
- **Name**: Via `aria-label`, `aria-labelledby`, or associated `<label>`
- **Role**: `combobox` on trigger, `listbox` on content, `option` on items
- **Value**: Current selection exposed via `aria-valuenow` or trigger text content
- **State**: `aria-expanded`, `aria-selected`, `aria-disabled`, `aria-activedescendant`

### WCAG 2.2 AA Compliance
- ✅ **1.4.13 Content on Hover or Focus**: Dismissable, hoverable, persistent
- ✅ **2.4.7 Focus Visible**: Clear focus indicators on all interactive elements
- ✅ **2.4.11 Focus Not Obscured (Minimum)**: Focused items scroll into view
- ✅ **2.5.8 Target Size (Minimum)**: Interactive targets minimum 24x24px
- ✅ **4.1.2 Name, Role, Value**: All states exposed to assistive tech

### Additional Accessibility Requirements
- Disabled items are not focusable, use `aria-disabled="true"`
- Empty groups are skipped in navigation
- Type-ahead timeout: 1000ms between character inputs
- Required fields must have `aria-required="true"` or `required` attribute
- Error states should use `aria-invalid="true"` and `aria-errormessage`

## 5. Implementation Architecture

### State Management
```tsx
interface SelectState {
  // Open state
  open: boolean;
  setOpen: (open: boolean) => void;

  // Value state
  value: string | undefined;
  setValue: (value: string) => void;

  // Focus management
  activeIndex: number;
  setActiveIndex: (index: number) => void;

  // Type-ahead
  searchString: string;
  searchTimeout: NodeJS.Timeout | null;
}

// Hook: useSelectState
const useSelectState = (props: SelectRootProps) => {
  const [open, setOpen] = useControlledState(props.open, props.defaultOpen, props.onOpenChange);
  const [value, setValue] = useControlledState(props.value, props.defaultValue, props.onValueChange);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchString, setSearchString] = useState('');

  // ... implementation

  return { open, setOpen, value, setValue, activeIndex, setActiveIndex };
};
```

### Context Requirements
```tsx
interface SelectContextValue {
  // State
  open: boolean;
  value: string | undefined;
  disabled: boolean;
  required: boolean;
  dir: 'ltr' | 'rtl';

  // Actions
  onValueChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;

  // Refs
  triggerRef: RefObject<HTMLElement>;
  contentRef: RefObject<HTMLElement>;
  valueRef: RefObject<HTMLElement>;

  // IDs
  triggerId: string;
  contentId: string;
  valueId: string;

  // Collections
  items: Map<string, SelectItemData>;
  registerItem: (value: string, data: SelectItemData) => void;
  unregisterItem: (value: string) => void;
}

// Provider
<SelectContext.Provider value={contextValue}>
  {children}
</SelectContext.Provider>
```

### Ref Forwarding Strategy
All interactive components support ref forwarding:
```tsx
const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>((props, forwardedRef) => {
  const context = useSelectContext();
  const ref = useComposedRefs(forwardedRef, context.triggerRef);

  return <Primitive.button ref={ref} {...props} />;
});
```

### Event System
```tsx
// Keyboard event delegation
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      // Handle selection
      break;
    case 'ArrowDown':
      // Move focus down
      break;
    case 'ArrowUp':
      // Move focus up
      break;
    case 'Home':
    case 'PageUp':
      // Focus first
      break;
    case 'End':
    case 'PageDown':
      // Focus last
      break;
    case 'Escape':
      // Close
      break;
    default:
      // Type-ahead
      if (event.key.length === 1) {
        handleTypeAhead(event.key);
      }
  }
};

// Type-ahead implementation
const handleTypeAhead = (char: string) => {
  clearTimeout(searchTimeout);
  const newSearch = searchString + char;
  const match = findMatchingItem(newSearch);

  if (match) {
    focusItem(match.index);
  }

  setSearchString(newSearch);
  setSearchTimeout(setTimeout(() => setSearchString(''), 1000));
};
```

### SSR/CSR Safety
```tsx
// Deterministic ID generation
const useId = (id?: string) => {
  const [generatedId] = useState(() => id || `select-${generateUniqueId()}`);
  return id || generatedId;
};

// Hydration-safe rendering
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) {
  return null; // Prevent hydration mismatch for portaled content
}
```

## 6. Styling & Data Attributes

### Required Data Attributes

**Select.Root**
- No visual attributes (non-rendering)

**Select.Trigger**
- `data-state`: `"open" | "closed"` - Dropdown open state
- `data-disabled`: Present when `disabled={true}`
- `data-placeholder`: Present when no value selected

**Select.Content**
- `data-state`: `"open" | "closed"` - Dropdown open state
- `data-side`: `"top" | "right" | "bottom" | "left"` - Placement side (popper mode)
- `data-align`: `"start" | "center" | "end"` - Alignment (popper mode)

**Select.Item**
- `data-state`: `"checked" | "unchecked"` - Selection state
- `data-disabled`: Present when `disabled={true}`
- `data-highlighted`: Present when focused via keyboard

**Select.ItemIndicator**
- Renders only when item is selected (`data-state="checked"`)

### Variants & Sizes
No built-in variants. Apply via data attributes:
```tsx
<Select.Trigger data-variant="outline" data-size="md">
```

Consumers define styling:
```css
[data-variant="outline"] {
  border: 1px solid var(--border-color);
}

[data-size="sm"] {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
```

### State-Based Styling
```css
/* Open state */
[data-state="open"] {
  /* Styles for open dropdown */
}

/* Selected item */
[data-state="checked"] {
  font-weight: 600;
}

/* Highlighted item */
[data-highlighted] {
  background: var(--highlight-bg);
}

/* Disabled */
[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Placeholder */
[data-placeholder] {
  color: var(--placeholder-color);
}
```

## 7. Test Coverage Plan

### Unit Tests
- ✅ Renders with correct structure
- ✅ Controlled value updates
- ✅ Uncontrolled value updates
- ✅ Controlled open state
- ✅ Uncontrolled open state
- ✅ Disabled state prevents interaction
- ✅ Form integration (name attribute)
- ✅ Default value initialization
- ✅ Value change callback fires
- ✅ Open change callback fires
- ✅ Portal rendering
- ✅ Type-ahead search
- ✅ RTL support

### Accessibility Tests
Using `jest-axe`:
- ✅ No accessibility violations (axe-core)
- ✅ Correct ARIA roles applied
- ✅ `aria-expanded` updates on open/close
- ✅ `aria-selected` on selected item
- ✅ `aria-disabled` on disabled items
- ✅ `aria-activedescendant` updates on navigation
- ✅ `aria-labelledby` connects trigger to label
- ✅ Focus visible indicators present
- ✅ Focus restoration on close
- ✅ Screen reader announcements (using @testing-library/user-event)

### Keyboard Navigation Tests
- ✅ `Space` opens dropdown
- ✅ `Enter` opens dropdown
- ✅ `ArrowDown` opens and navigates
- ✅ `ArrowUp` opens and navigates
- ✅ `Escape` closes dropdown
- ✅ `Home`/`PageUp` focuses first item
- ✅ `End`/`PageDown` focuses last item
- ✅ Type-ahead focuses matching items
- ✅ `Tab` closes and moves focus
- ✅ Disabled items are skipped

### Integration Tests
- ✅ Works within forms (submission)
- ✅ Works with validation libraries
- ✅ Multiple selects on same page
- ✅ Dynamic items (add/remove)
- ✅ Async loading states
- ✅ Collision detection (viewport boundaries)
- ✅ Popper vs item-aligned positioning
- ✅ Portal container customization
- ✅ SSR/CSR hydration

## 8. Constraints

### Zero Styling (Behavior Only)
- No CSS classes applied by component
- No inline styles except positioning (popper mode)
- All visual design via consumer-provided styles
- Data attributes expose all necessary states

### Styling via Data Attributes
- All component states exposed as `data-*` attributes
- Variants, sizes, themes applied by consumers
- Animations/transitions handled externally
- CSS variables for dynamic values (popper mode)

### Tree-Shakeable Exports
```tsx
// Named exports for optimal tree-shaking
export { SelectRoot as Root } from './SelectRoot';
export { SelectTrigger as Trigger } from './SelectTrigger';
export { SelectValue as Value } from './SelectValue';
// ... etc

// Namespace export for convenience
export * as Select from './index';
```

### TypeScript Strict Mode
- Full type safety for all props
- Generic type support for value types
- Discriminated unions for polymorphic `as` prop
- Exported types for consumers

### WCAG 2.2 AA Compliant
- All success criteria met (see Accessibility section)
- Tested with screen readers (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation fully supported
- Color contrast requirements enforced by consumer

### Controlled/Uncontrolled Support
- Both patterns fully supported
- `defaultValue` / `defaultOpen` for uncontrolled
- `value` / `open` + callbacks for controlled
- Internal state management when uncontrolled

## 9. Migration & Implementation Checklist

### Migration from Other Libraries

**From Radix Select:**
- ✅ API is similar, minimal changes needed
- ✅ `Select.Root` replaces `Select`
- ✅ `Select.Trigger` same
- ✅ `Select.Content` same (check positioning props)
- ✅ `Select.Item` same
- ✅ `Select.Value` same
- ✅ Groups and labels work identically

**From Headless UI Listbox:**
- ⚠️ Different component structure (compound vs single)
- ⚠️ `Listbox` → `Select.Root`
- ⚠️ `Listbox.Button` → `Select.Trigger` + `Select.Value`
- ⚠️ `Listbox.Options` → `Select.Content` + `Select.Viewport`
- ⚠️ `Listbox.Option` → `Select.Item`
- ✅ `value` and `onChange` props map directly

**From React Aria Select:**
- ⚠️ Less boilerplate (no separate hooks)
- ⚠️ `useSelectState` → internal state in `Select.Root`
- ⚠️ `useSelect` → internal in `Select.Trigger`
- ⚠️ `useListBox` → internal in `Select.Content`
- ✅ Same keyboard interactions
- ✅ Same ARIA implementation

### Implementation Checklist

**Phase 1: Core Structure** (Week 1)
- [ ] Implement `Select.Root` with context provider
- [ ] Implement `Select.Trigger` with ARIA attributes
- [ ] Implement `Select.Value` with placeholder support
- [ ] Implement `Select.Icon` (optional)
- [ ] Create internal state management hooks
- [ ] Implement controlled/uncontrolled patterns
- [ ] Add ref forwarding to all components
- [ ] Unit tests for core components

**Phase 2: Dropdown & Items** (Week 2)
- [ ] Implement `Select.Portal` with container support
- [ ] Implement `Select.Content` with positioning
- [ ] Implement `Select.Viewport` (scrollable container)
- [ ] Implement `Select.Item` with selection logic
- [ ] Implement `Select.ItemText` and `Select.ItemIndicator`
- [ ] Add keyboard navigation (arrows, home/end)
- [ ] Add type-ahead search functionality
- [ ] Implement focus management
- [ ] Unit tests for dropdown behavior

**Phase 3: Advanced Features** (Week 3)
- [ ] Implement `Select.Group` and `Select.Label`
- [ ] Implement `Select.Separator`
- [ ] Implement `Select.Arrow` (optional)
- [ ] Add collision detection (viewport boundaries)
- [ ] Add popper positioning mode
- [ ] Implement RTL support
- [ ] Add form integration (hidden input)
- [ ] Integration tests

**Phase 4: Accessibility & Polish** (Week 4)
- [ ] Complete ARIA implementation
- [ ] Add screen reader announcements
- [ ] Ensure focus visible indicators
- [ ] Test with keyboard only
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)
- [ ] Run `jest-axe` validation
- [ ] Fix any accessibility violations
- [ ] Performance optimization (memo, useCallback)
- [ ] SSR/CSR safety validation

**Phase 5: Documentation & Examples** (Week 5)
- [ ] API documentation
- [ ] Usage examples (basic, advanced)
- [ ] Migration guides
- [ ] Accessibility documentation
- [ ] Storybook stories
- [ ] TypeScript examples
- [ ] Common patterns and recipes
- [ ] Troubleshooting guide

### Key Technical Decisions
1. **Positioning Strategy**: Item-aligned by default, popper optional (matches Radix approach)
2. **Focus Management**: Use `aria-activedescendant` for virtual focus (better screen reader support)
3. **Type-Ahead**: 1000ms timeout, matches ARIA APG recommendations
4. **Form Integration**: Hidden input approach for native form submission
5. **Portal**: Optional, defaults to `document.body` for z-index control
6. **Item Registration**: Use collection pattern (context-based) for dynamic items
7. **SSR**: Deterministic IDs with fallback generation, hydration-safe portals
