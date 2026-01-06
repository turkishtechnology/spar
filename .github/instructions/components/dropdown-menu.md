# Dropdown Menu — Spar Headless Instructions

## 1. Component Overview

### Purpose and Use Cases
The Dropdown Menu component provides a headless implementation of a menu button pattern that reveals a menu of selectable options. It's designed for application-level actions and choices (not site navigation) where users need to:
- Select from a predefined set of options (settings, preferences, actions)
- Choose values that persist until changed (difficulty levels, themes, sorting methods)
- Access contextual actions for specific content or interface elements
- Navigate through categorized options with nested groupings

### Compound Component Structure
```tsx
<DropdownMenu.Root>
  <DropdownMenu.Trigger />
  <DropdownMenu.Content>
    <DropdownMenu.Item />
    <DropdownMenu.CheckboxItem />
    <DropdownMenu.RadioGroup>
      <DropdownMenu.RadioItem />
    </DropdownMenu.RadioGroup>
    <DropdownMenu.Separator />
    <DropdownMenu.Group>
      <DropdownMenu.Label />
      <DropdownMenu.Item />
    </DropdownMenu.Group>
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger />
      <DropdownMenu.SubContent>
        <DropdownMenu.Item />
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

### Key Differentiators
- **Application-focused**: Built for app functionality, not navigation (use lists of links for navigation)
- **Stateful**: Supports persistent selections with radio/checkbox patterns
- **Keyboard-first**: Complete arrow key navigation with focus management
- **Compositional**: Granular parts for flexible menu structures
- **Accessible by design**: Full WCAG 2.2 AA compliance with screen reader optimization

## 2. API

### DropdownMenu.Root Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | No | `undefined` | Controlled open state |
| `defaultOpen` | `boolean` | No | `false` | Uncontrolled default open state |
| `onOpenChange` | `(open: boolean) => void` | No | `undefined` | Callback when open state changes |
| `modal` | `boolean` | No | `true` | Whether menu is modal (focus trapped) |
| `dir` | `'ltr' | 'rtl'` | No | `'ltr'` | Reading direction for positioning |
| `closeOnSelect` | `boolean | 'auto'` | No | `'auto'` | Selection close policy: true=always close, false=never close, 'auto'=close normal items; keep open for checkbox/radio |

### DropdownMenu.Trigger Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'button'` | Polymorphic component type |
| `disabled` | `boolean` | No | `false` | Whether trigger is disabled |
| `asChild` | `boolean` | No | `false` | Render as child element |
| Common button props | Various | No | - | Native button attributes |

### DropdownMenu.Content Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'div'` | Polymorphic component type |
| `side` | `'top' | 'right' | 'bottom' | 'left'` | No | `'bottom'` | Preferred placement side |
| `align` | `'start' | 'center' | 'end'` | No | `'start'` | Alignment on placement side |
| `sideOffset` | `number` | No | `8` | Offset from trigger |
| `alignOffset` | `number` | No | `0` | Alignment offset |
| `avoidCollisions` | `boolean` | No | `true` | Automatically adjust position |
| `collisionBoundary` | `Element | null` | No | `null` | Boundary for collision detection |
| `loop` | `boolean` | No | `false` | Allow focus to loop through items |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | No | `undefined` | Escape key handler |
| `onPointerDownOutside` | `(event: PointerEvent) => void` | No | `undefined` | Outside click handler |
| `onFocusOutside` | `(event: FocusEvent) => void` | No | `undefined` | Outside focus handler |

### DropdownMenu.Item Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'div'` | Polymorphic component type |
| `disabled` | `boolean` | No | `false` | Whether item is disabled (disabled items are skipped in focus order) |
| `onSelect` | `(event: Event) => void` | No | `undefined` | Selection handler |
| `textValue` | `string` | No | `undefined` | Value for typeahead search |

### DropdownMenu.CheckboxItem Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `checked` | `boolean | 'indeterminate'` | No | `false` | Controlled checked state |
| `onCheckedChange` | `(checked: boolean) => void` | No | `undefined` | Checked state change handler |
| All Item props | - | - | - | Inherits from Item |

### DropdownMenu.RadioGroup Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | No | `undefined` | Controlled selected value |
| `onValueChange` | `(value: string) => void` | No | `undefined` | Value change handler |

### DropdownMenu.RadioItem Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | Yes | - | Unique value for this radio item |
| All Item props | - | - | - | Inherits from Item |

### DropdownMenu.Separator Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'div'` | Polymorphic component type |

### DropdownMenu.Label Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'div'` | Polymorphic component type |

### DropdownMenu.Group Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'div'` | Polymorphic component type |

### DropdownMenu.Sub Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | No | `undefined` | Controlled submenu open state |
| `defaultOpen` | `boolean` | No | `false` | Default submenu open state |
| `onOpenChange` | `(open: boolean) => void` | No | `undefined` | Submenu open change handler |

### DropdownMenu.SubTrigger Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `disabled` | `boolean` | No | `false` | Whether subtrigger is disabled |
| All Item props | - | - | - | Inherits from Item |

### DropdownMenu.SubContent Props
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| All Content props | - | - | - | Inherits from Content |

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|---------|-----------------|
| Closed | Click trigger | Opens menu, focuses first item | `aria-expanded="true"`, removes `hidden` |
| Closed | Enter/Space on trigger | Opens menu, focuses first item | `aria-expanded="true"`, removes `hidden` |
| Closed | Down Arrow on trigger | Opens menu, focuses first item | `aria-expanded="true"`, removes `hidden` |
| Closed | Up Arrow on trigger | Opens menu, focuses last item | `aria-expanded="true"`, removes `hidden` |
| Open | Click item | Closes menu, returns focus to trigger, executes action | `aria-expanded="false"`, adds `hidden` |
| Open | Enter/Space on item | Closes menu, returns focus to trigger, executes action | `aria-expanded="false"`, adds `hidden` |
| Open | Down Arrow | Moves focus to next item (loops if loop=true) | Roving tabindex updates |
| Open | Up Arrow | Moves focus to previous item (loops if loop=true) | Roving tabindex updates |
| Open | Home | Moves focus to first item | Roving tabindex updates |
| Open | End | Moves focus to last item | Roving tabindex updates |
| Open | Escape | Closes menu, returns focus to trigger | `aria-expanded="false"`, adds `hidden` |
| Open | Tab | Closes menu, moves focus to next focusable element | `aria-expanded="false"`, adds `hidden` |
| Open | Shift+Tab | Closes menu, moves focus to previous focusable element | `aria-expanded="false"`, adds `hidden` |
| Open | Character key(s) | Typeahead buffer (~700ms) to next matching item (wrap) | Roving tabindex updates |
| Open | Right Arrow on SubTrigger | Opens submenu, focuses first subitem | Sub: `aria-expanded="true"` |
| Open | Left Arrow in submenu | Closes submenu, returns to parent item | Sub: `aria-expanded="false"` |
| RadioItem | Select | Updates radio group value (close depends on closeOnSelect) | `aria-checked="true"` on selected, `false` on others |
| CheckboxItem | Select | Toggles checkbox state (close depends on closeOnSelect) | `aria-checked="true|false|mixed"` |
| Outside click | Click | Closes menu if open | `aria-expanded="false"`, adds `hidden` |

## 4. Accessibility

### Roles
- **Trigger**: `role="button"` (implicit for button element)
- **Content**: `role="menu"`
- **Item**: `role="menuitem"`
- **CheckboxItem**: `role="menuitemcheckbox"`
- **RadioItem**: `role="menuitemradio"`
- **Separator**: `role="separator"`
- **Label**: No role (decorative)
- **Group**: `role="group"`
- **SubContent**: `role="menu"`

### Keyboard Navigation
- **Tab/Shift+Tab**: Enter/exit menu system
- **Enter/Space**: Activate trigger or item
- **Down Arrow**: Next item (trigger: opens menu)
- **Up Arrow**: Previous item (trigger: opens menu to last item)
- **Home**: First item in current menu
- **End**: Last item in current menu
- **Right Arrow**: Open submenu (if applicable) or no action
- **Left Arrow**: Close submenu and return to parent
- **Escape**: Close menu and return focus to trigger
- **Character keys**: Jump to next item starting with that character
  - Multiple quick keystrokes within ~700ms compose a search buffer
  - In RTL, horizontal submenu open/close arrow expectations reverse

### Focus Management
- **Initial focus**: First enabled (non-disabled) item when menu opens
- **Focus indicators**: Must be clearly visible on all interactive elements
- **Focus trap**: When modal=true, focus is trapped within menu; modal=false allows Tab to exit (closing menu)
- **Focus restoration**: Returns to trigger when menu closes (if trigger disabled then next tabbable)
- **Roving tabindex**: Only focused item has `tabindex="0"`, others `-1` (no `aria-activedescendant` usage)
- **Disabled items**: Not focusable and skipped; announced with `aria-disabled="true"`

### Screen Reader Announcements
- **Menu state**: "Menu expanded/collapsed" via `aria-expanded`
- **Item selection**: "Selected" for radio items via `aria-checked`
- **Checkbox state**: "Checked/unchecked/mixed" via `aria-checked`
- **Item context**: Item position in menu via `aria-setsize`/`aria-posinset`
- **Disabled state**: "Disabled" or "unavailable" for disabled items
- **Submenu indication**: "Has submenu" for items with submenus

### Name/Role/Value Exposure
- **Trigger**: Accessible name via `aria-label` or `aria-labelledby`
- **Menu**: Labeled by trigger via `aria-labelledby`
- **Items**: Text content provides accessible name
- **State communication**: `aria-checked`, `aria-expanded`, `aria-disabled`
- **Relationships**: `aria-controls` links trigger to menu

### Implementation Rules from accessibility-guidelines.instructions.md
- **Keyboard Support**: Full Tab/Shift+Tab, Enter/Space, Arrows, Escape, Home/End navigation
- **ARIA Usage**: Semantic HTML first, ARIA roles and properties as specified above
- **Focus Management**: Visible indicators, proper trapping, restoration on close
- **Screen Reader Support**: `aria-live` for dynamic content, proper announcements
- **Color & Contrast**: WCAG 2.2 AA contrast ratios (4.5:1 text, 3:1 UI components)
- **Testing**: jest-axe tests must pass with zero violations

> Note: Roving tabindex model is authoritative; `aria-activedescendant` is intentionally not used. A multi-character typeahead buffer (~700ms timeout) is standard.

## 5. Implementation Architecture

### State Hooks Design
```tsx
interface DropdownMenuState {
  open: boolean;
  activeIndex: number;
  selectedItems: Set<string>;
  radioValues: Record<string, string>;
  submenuStates: Map<string, boolean>;
}

const useDropdownMenuState = (props: DropdownMenuProps) => {
  const [state, setState] = useState<DropdownMenuState>();
  // Controlled/uncontrolled pattern handling
  // Focus management
  // Keyboard event handlers
  // Selection state management
};
```

### Context Requirements
```tsx
interface DropdownMenuContextValue {
  // Root context
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  
  // Selection context
  onItemSelect: (value: string) => void;
  selectedValues: Set<string>;
  radioGroupValue: string;
  onRadioValueChange: (value: string) => void;
  
  // Navigation context
  focusedIndex: number;
  onFocusIndexChange: (index: number) => void;
  items: MenuItemRef[];
  registerItem: (item: MenuItemRef) => void;
  unregisterItem: (id: string) => void;
}
```

### Ref Forwarding Strategy
- **ForwardRef**: All components support ref forwarding to DOM elements
- **Polymorphic**: Support `as` prop while maintaining ref type safety
- **Internal refs**: Separate internal refs for focus management from forwarded refs
- **Ref merging**: Combine internal and forwarded refs when both are needed

### Event System
- **Custom events**: Emit selection events with rich context
- **Event delegation**: Handle keyboard navigation at menu level
- **Event prevention**: Prevent default behaviors appropriately
- **Bubbling control**: Stop propagation when needed for nested menus

### SSR/CSR Safety and Deterministic IDs
- **useId hook**: Generate deterministic IDs that work across SSR/CSR
- **Portal strategy**: Render menu content in portal to avoid hydration issues
- **Progressive enhancement**: Base markup works without JavaScript
- **Hydration safety**: No differences between server and client renders

## 6. Styling & Data Attributes

### Required Data Attributes
- **Root**:
  - `data-state="open|closed"` - Menu open state
  
- **Trigger**:
  - `data-state="open|closed"` - Menu open state
  - `data-disabled` - When disabled
  
- **Content**:
  - `data-state="open|closed"` - Menu open state
  - `data-side="top|right|bottom|left"` - Placement side
  - `data-align="start|center|end"` - Alignment
  
- **Item/CheckboxItem/RadioItem**:
  - `data-highlighted` - When focused/hovered
  - `data-disabled` - When disabled
  - `data-checked="true|false|indeterminate"` - Checked state (checkbox/radio)
  
- **Separator**:
  - `data-orientation="horizontal|vertical"` - Visual orientation
  
- **SubTrigger**:
  - `data-state="open|closed"` - Submenu state
  - `data-highlighted` - When focused
  - `data-disabled` - When disabled
  
- **SubContent**:
  - `data-state="open|closed"` - Submenu state
  - `data-side="top|right|bottom|left"` - Placement side

## 7. Test Coverage Plan

### Unit Tests
- **State management**: Open/close state, controlled/uncontrolled patterns
- **Selection logic**: Radio group values, checkbox states, item selection
- **Keyboard navigation**: Arrow keys, Home/End, character search
- **Focus management**: Initial focus, focus restoration, roving tabindex
- **Event handling**: Click, keyboard events, outside interactions
- **Edge cases**: Disabled items, empty menus, single items

### Accessibility Tests
- **jest-axe integration**: Zero violations for all component combinations
- **ARIA attributes**: Correct roles, properties, and states
- **Keyboard behavior**: Complete keyboard navigation patterns
- **Focus behavior**: Proper focus management and indicators
- **Screen reader**: Announcements and semantic structure
- **Color contrast**: Ensure all visual states meet WCAG requirements

### Integration Tests
- **Nested menus**: Submenu navigation and state management
- **Multiple menus**: Independent menu instances on same page
- **Form integration**: Menu selections affecting form state
- **Portal behavior**: Correct rendering in DOM portals
- **Responsive behavior**: Menu positioning across viewport sizes
- **Browser compatibility**: Core functionality across target browsers

## 8. Constraints

### Zero Styling (Behavior Only)
- **No CSS imports**: Components provide only behavior and structure
- **No visual opinions**: No default colors, fonts, spacing, or layout styles
- **Data attributes only**: Styling hooks provided via data attributes
- **Unstyled by design**: Consumers fully control visual appearance

### Styling via Data Attributes
- **State-based styling**: Use `data-state`, `data-checked`, etc. for CSS selectors
- **Positioning data**: `data-side`, `data-align` for placement-aware styling
- **Interactive states**: `data-highlighted`, `data-disabled` for user feedback
- **Component variants**: Additional data attributes for style variations

### Tree-Shakeable Exports
- **Named exports**: Individual component exports for tree-shaking
- **No barrel exports**: Direct imports to reduce bundle size
- **Side-effect free**: No global state or initialization code
- **Minimal dependencies**: Keep external dependencies to minimum

### TypeScript Strict Mode
- **Strict configuration**: No `any` types, explicit return types
- **Generic constraints**: Proper polymorphic component typing
- **Event typing**: Strict event handler parameter types
- **Ref typing**: Correct ref forwarding with polymorphic components

### WCAG 2.2 AA Compliant
- **Keyboard accessibility**: Complete keyboard navigation support
- **Screen reader support**: Proper semantic structure and announcements
- **Focus management**: Visible indicators and logical focus flow
- **Color independence**: No information conveyed by color alone
- **Contrast requirements**: Ensure styling hooks support required contrast ratios

### Controlled/Uncontrolled Support
- **Dual mode**: Support both controlled and uncontrolled usage patterns
- **State synchronization**: Proper handling of controlled value changes
- **Default props**: Sensible defaults for uncontrolled mode
- **Warning system**: Development warnings for incorrect usage patterns

## 9. Migration & Implementation Checklist

### Migration Guidance
When migrating from other menu libraries:
- **From navigation dropdowns**: Consider if you actually need a menu or just a collapsible navigation list
- **From select elements**: Evaluate if native `<select>` is sufficient for your use case
- **From custom solutions**: Map existing state management to controlled/uncontrolled patterns
- **Styling migration**: Replace CSS classes with data attribute selectors
- **Event handler updates**: Adapt to new callback signatures and event objects
