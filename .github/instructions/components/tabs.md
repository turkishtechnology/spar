# Tabs — Spar Headless Instructions

## 1. Component Overview

### Purpose and Use Cases
The Tabs component provides a set of layered sections of content, known as tab panels, that display one panel of content at a time. Each tab panel has an associated tab element that when activated, displays the panel. Used for organizing related content into distinct views while preserving screen space.

### Compound Component Structure
```tsx
<Tabs>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for Tab 1</TabsContent>
  <TabsContent value="tab2">Content for Tab 2</TabsContent>
  <TabsContent value="tab3">Content for Tab 3</TabsContent>
</Tabs>
```

### Key Differentiators
- Headless behavior-only implementation with zero styling
- Full keyboard navigation support (Tab, Arrow keys, Home/End, Enter/Space)
- Automatic and manual tab activation modes
- Horizontal and vertical orientations with appropriate arrow key navigation
- Controlled and uncontrolled modes
- WCAG 2.2 AA compliant with proper ARIA tablist semantics
- Polymorphic components with ref forwarding
- Deterministic tab panel content mounting/unmounting

## 2. API

### Tabs (Root)
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | `string` | No | `undefined` | Custom base ID for trigger/panel ARIA relationships |
| `value` | `string` | No | `undefined` | Controlled selected tab value |
| `defaultValue` | `string` | No | `undefined` | Uncontrolled initial tab selection |
| `onValueChange` | `(value: string) => void` | No | `undefined` | Callback when tab selection changes |
| `orientation` | `"horizontal" \| "vertical"` | No | `"horizontal"` | Tabs orientation affecting keyboard navigation |
| `dir` | `"ltr" \| "rtl"` | No | `"ltr"` | Text direction for arrow key navigation |
| `activationMode` | `"automatic" \| "manual"` | No | `"automatic"` | Whether tabs activate on focus or require explicit activation |
| `as` | `ElementType` | No | `"div"` | Polymorphic component type |
| `children` | `React.ReactNode` | No | - | TabsList and TabsContent components |

**Note**: All components also accept standard HTML attributes (className, style, data-*, aria-*, etc.) which are forwarded to the underlying element.

### TabsList
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `"div"` | Polymorphic component type |
| `children` | `React.ReactNode` | No | - | TabsTrigger components |

### TabsTrigger
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | Yes | - | Unique identifier for the tab |
| `disabled` | `boolean` | No | `false` | Disables this specific tab |
| `as` | `ElementType` | No | `"button"` | Polymorphic component type |
| `autoFocus` | `boolean` | No | `false` | Whether this tab trigger receives focus on mount |
| `children` | `ReactNode \| ((state: TabsTriggerRenderProps) => ReactNode)` | No | - | Tab trigger content or render function |

### TabsTriggerRenderProps
| Property | Type | Description |
|----------|------|-------------|
| `isSelected` | `boolean` | Whether this tab is currently selected |
| `select` | `() => void` | Function to select this tab programmatically |
| `disabled` | `boolean` | Whether this tab is disabled |
| `isFocused` | `boolean` | Whether this tab is currently focused |
| `orientation` | `Orientation` | The tab's orientation |

### TabsContent
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | Yes | - | Unique identifier matching a TabsTrigger value |
| `forceMount` | `boolean` | No | `false` | Force content to remain mounted when not active |
| `as` | `ElementType` | No | `"div"` | Polymorphic component type |
| `children` | `React.ReactNode` | No | - | Tab panel content |

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| Inactive tab | Click on trigger | Activates tab, shows content | `aria-selected="true"` on new tab, `aria-selected="false"` on others, content becomes visible |
| Active tab | Click on trigger | No change | No change (already selected) |
| Disabled tab | Click/keyboard | No change | Tab remains unselectable, maintains `aria-disabled="true"` |
| Focus on tab (automatic) | Arrow key navigation | Activates focused tab | `aria-selected="true"` on focused tab, content switches immediately |
| Focus on tab (manual) | Arrow key navigation | Moves focus only | Focus moves, but `aria-selected` unchanged until Enter/Space |
| Focus on tab (manual) | Enter/Space | Activates focused tab | `aria-selected="true"` on activated tab, content switches |
| Horizontal orientation | Right arrow | Focus next tab (left-to-right) | Focus management, selection if automatic |
| Horizontal orientation | Left arrow | Focus previous tab (left-to-right) | Focus management, selection if automatic |
| Horizontal orientation | Down arrow | Focus next tab (alternative) | Focus management, selection if automatic |
| Horizontal orientation | Up arrow | Focus previous tab (alternative) | Focus management, selection if automatic |
| Vertical orientation | Down arrow | Focus next tab | Focus management, selection if automatic |
| Vertical orientation | Up arrow | Focus previous tab | Focus management, selection if automatic |
| RTL direction | Left arrow | Focus next tab (right-to-left) | Focus management, reversed navigation |
| Focus on tab | Home | Focus first non-disabled tab | Focus management, selection if automatic |
| Focus on tab | End | Focus last non-disabled tab | Focus management, selection if automatic |
| Tab navigation | Tab key | Exit tablist, focus content or next focusable | Focus moves to tab panel or next element |

## 4. Accessibility

### Roles
- Root: No specific role (semantic `div`)
- TabsList: `role="tablist"` with `aria-orientation`
- TabsTrigger: `role="tab"` with `aria-selected`, `aria-controls`, and optional `aria-disabled`
- TabsContent: `role="tabpanel"` with `aria-labelledby` and optional `tabindex="0"`

### Keyboard Navigation
- **Tab**: Moves focus into and out of the tab list. When focus moves into the tab list, it goes to the active tab
- **Arrow Keys**: 
  - Horizontal orientation: Left/Right arrows navigate between tabs
  - Vertical orientation: Up/Down arrows navigate between tabs
  - RTL support: Reverses Left/Right arrow behavior
- **Home**: Moves focus to the first non-disabled tab
- **End**: Moves focus to the last non-disabled tab
- **Enter/Space**: In manual activation mode, activates the focused tab

### Focus Management
- Focus moves to the currently selected tab when entering the tablist via Tab key
- When a tab is activated, focus typically remains on the tab trigger (not the content)
- Tab panel content should be programmatically focusable (`tabindex="0"`) to allow screen readers to navigate to it
- Disabled tabs are skipped during keyboard navigation
- Focus wraps around at the ends of the tab list (always enabled)

### Screen Reader Announcements
- Tab selection changes announce the new tab name and "selected" state
- Tab panels should be properly labeled via `aria-labelledby` pointing to their associated tab
- Dynamic content changes within panels should use appropriate live regions

### Name/Role/Value Exposure
- Each tab has an accessible name (from its text content or `aria-label`)
- Tab role is exposed as "tab" to assistive technology
- Selected state is exposed via `aria-selected="true"`
- Disabled state is exposed via `aria-disabled="true"`
- Tab controls relationship is exposed via `aria-controls` pointing to panel ID
- Panel labeling relationship is exposed via `aria-labelledby` pointing to tab ID

## 5. Implementation Architecture

### State Hooks Design
```tsx
// Internal state management hook
const useTabsState = (props: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [selectedValue, setSelectedValue] = useControlledState({
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: props.onValueChange,
  });
  
  return { selectedValue, setSelectedValue };
};

// Focus management for keyboard navigation
const useTabsKeyboard = (props: {
  orientation: TabsOrientation;
  dir: "ltr" | "rtl";
  activationMode: "automatic" | "manual";
}) => {
  // Handle arrow key navigation
  // Handle Home/End keys
  // Handle Enter/Space for manual mode
  // Return keyboard handlers
};
```

### Context Requirements
```tsx
interface TabsContextValue {
  selectedValue: string;
  onValueChange: (value: string) => void;
  orientation: "horizontal" | "vertical";
  dir: "ltr" | "rtl";
  activationMode: "automatic" | "manual";
  // Internal refs and focus management
}
```

### Ref Forwarding Strategy
- Forward refs to the appropriate DOM element for each component
- Root: `div` element
- TabsList: `div` element with `role="tablist"`
- TabsTrigger: `button` element with `role="tab"`
- TabsContent: `div` element with `role="tabpanel"`

### Event System
- Click handlers on tab triggers for activation
- Keyboard handlers on tablist for navigation
- Focus/blur handlers for managing focus state
- Roving tabindex pattern for single tab stop behavior

### SSR/CSR Safety and Deterministic IDs
- Generate stable, unique IDs using `useId()` for tab-panel relationships
- Handle hydration mismatches gracefully
- Ensure `aria-controls` and `aria-labelledby` use consistent IDs across renders
- Default to first available tab if no defaultValue provided and no controlled value

## 6. Styling & Data Attributes

### Required Data Attributes

#### Tabs (Root)
- `data-orientation`: `"horizontal" | "vertical"` - Current orientation
- `data-dir`: `"ltr" | "rtl"` - Text direction

#### TabsList
- `data-orientation`: `"horizontal" | "vertical"` - Current orientation

#### TabsTrigger
- `data-state`: `"active" | "inactive"` - Selection state
- `data-disabled`: Present when disabled
- `data-orientation`: `"horizontal" | "vertical"` - Current orientation

#### TabsContent
- `data-state`: `"active" | "inactive"` - Visibility state
- `data-orientation`: `"horizontal" | "vertical"` - Current orientation

### State-Based Styling Hooks
These data attributes enable CSS selectors for styling different states:
- Active/inactive tabs: `[data-state="active"]` / `[data-state="inactive"]`
- Disabled tabs: `[data-disabled]`
- Orientation-based layouts: `[data-orientation="vertical"]`
- Direction-based positioning: `[data-dir="rtl"]`

## 7. Test Coverage Plan

### Unit Tests
- **State Management**: Controlled vs uncontrolled behavior
- **Tab Selection**: Click and keyboard activation
- **Keyboard Navigation**: Arrow keys, Home/End, Tab behavior
- **Activation Modes**: Automatic vs manual activation
- **Orientation**: Horizontal vs vertical navigation patterns
- **Direction**: LTR vs RTL arrow key behavior
- **Disabled States**: Skipping disabled tabs
- **Edge Cases**: Empty tablist, single tab, all tabs disabled

### Accessibility Tests
- **ARIA Attributes**: Proper roles, states, and properties
- **Keyboard Support**: Complete keyboard navigation testing
- **Focus Management**: Focus visible, roving tabindex, focus restoration
- **Screen Reader**: Tab announcements, panel labeling
- **Axe Compliance**: Automated accessibility testing with jest-axe

### Integration Tests
- **Content Switching**: Panel visibility based on selection
- **Dynamic Tabs**: Adding/removing tabs dynamically
- **Nested Content**: Complex content within tab panels
- **Form Integration**: Form controls within tab panels
- **Performance**: Large numbers of tabs and content

## 8. Constraints

### Zero Styling
- No CSS imports or default styles
- No visual opinions about appearance
- Styling achieved entirely through data attributes
- Layout behavior (horizontal/vertical) handled via CSS

### Styling via Data Attributes
- All visual states exposed through `data-*` attributes
- Consistent naming convention with other Spar components
- Support for complex styling scenarios (themes, variants, animations)

### Tree-Shakeable Exports
- Named exports for individual components
- Compound export pattern with dot notation
- No side effects in component modules

### TypeScript Strict Mode
- Explicit typing for all props and internal state
- No `any` types
- Proper generic constraints for polymorphic components
- Exported types for consumer usage

### WCAG 2.2 AA Compliant
- Full keyboard navigation support
- Proper ARIA semantics following APG patterns
- Screen reader compatibility
- Focus management and visual indicators

### Controlled/Uncontrolled Support
- Support both controlled (`value`) and uncontrolled (`defaultValue`) patterns
- Consistent behavior with React form patterns
- Proper change event handling

## 9. Migration & Implementation Checklist

### Migration Guidance
- **From Traditional Tabs**: Replace click-only interactions with full keyboard support
- **ARIA Updates**: Ensure proper tablist/tab/tabpanel semantics
- **Focus Management**: Implement roving tabindex pattern
- **Activation Modes**: Choose automatic vs manual based on use case (automatic for most cases)

### Implementation Checklist

#### Core Functionality
- [ ] Root Tabs component with context provider
- [ ] TabsList component with tablist role and keyboard navigation
- [ ] TabsTrigger component with tab role and selection state
- [ ] TabsContent component with tabpanel role and visibility management
- [ ] Controlled and uncontrolled state management
- [ ] Proper TypeScript definitions exported

#### Accessibility Implementation
- [ ] All ARIA roles and properties implemented per APG pattern
- [ ] Complete keyboard navigation (arrows, Home/End, Tab, Enter/Space)
- [ ] Roving tabindex pattern for single tab stop
- [ ] Proper focus management and visual indicators
- [ ] Screen reader announcements for state changes
- [ ] RTL and orientation support

#### Testing
- [ ] Unit tests for all component behaviors
- [ ] Accessibility tests with jest-axe (zero violations)
- [ ] Keyboard navigation integration tests
- [ ] Screen reader compatibility testing
- [ ] Cross-browser testing

#### Documentation & Integration
- [ ] Data attributes documented for styling
- [ ] Component exported properly (named + compound)
- [ ] Integration with existing Spar patterns
- [ ] Performance optimization for large tab sets
