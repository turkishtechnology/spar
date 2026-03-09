# Radio — Spar Headless Instructions

## 1. Component Overview

### Purpose and Use Cases
- **Radio Group**: A set of mutually exclusive options where only one can be selected at a time
- **Single Selection**: Enforces exactly one selection within the group (unlike checkboxes)
- **Form Input**: Captures user choice from predefined options for form submission
- **Settings/Preferences**: UI for configuration options, filters, or categorical selections
- **Decision Points**: When users must choose exactly one option from multiple alternatives

### Compound Component Structure
```tsx
<RadioGroup>
  <RadioItem value="option1">Option 1</RadioItem>
  <RadioItem value="option2">Option 2</RadioItem>
  <RadioItem value="option3">Option 3</RadioItem>
</RadioGroup>
```

### Key Differentiators
- **Headless**: Zero styling, behavior-only implementation
- **Roving Tabindex**: Efficient keyboard navigation using single tab stop
- **Controlled/Uncontrolled**: Supports both patterns for flexibility
- **Compound Pattern**: Granular parts for maximum composition flexibility
- **Full Accessibility**: WCAG 2.2 AA compliant with complete keyboard support

## 2. API

### RadioGroup Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `id` | `string` | No | `undefined` | Custom base ID used for generated group name when `name` is not provided |
| `value` | `string \| undefined` | No | `undefined` | Controlled value of selected radio item |
| `defaultValue` | `string \| undefined` | No | `undefined` | Uncontrolled default selected value |
| `onValueChange` | `(value: string) => void` | No | `undefined` | Callback when selection changes |
| `name` | `string` | No | Auto-generated | HTML name attribute for form submission |
| `disabled` | `boolean` | No | `false` | Disables entire radio group |
| `required` | `boolean` | No | `false` | Marks group as required for form validation |
| `orientation` | `'horizontal' \| 'vertical'` | No | `'vertical'` | Layout direction affecting keyboard navigation |
| `selectOnFocus` | `boolean` | No | `true` | Whether arrow keys automatically select the focused item |
| `autoFocus` | `boolean` | No | `false` | Whether to focus selected/first item on mount |
| `children` | `React.ReactNode` | No | — | RadioItem components |
| `aria-label` | `string` | No | `undefined` | Accessible name for the group |
| `aria-labelledby` | `string` | No | `undefined` | References element that labels the group |
| `aria-describedby` | `string` | No | `undefined` | References element that describes the group |
| `as` | `ElementType` | No | `'div'` | Polymorphic root element |

### RadioItem Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | Yes | — | Unique value for this radio item |
| `disabled` | `boolean` | No | `false` | Disables this specific radio item |
| `children` | `React.ReactNode \| ((state: RadioItemRenderProps) => React.ReactNode)` | No | — | Label content or render function for render props pattern |
| `aria-label` | `string` | No | `undefined` | Accessible name when children insufficient |
| `aria-describedby` | `string` | No | `undefined` | References element that describes this item |
| `as` | `ElementType` | No | `'label'` | Polymorphic root element |

### RadioItemRenderProps

| Name | Type | Description |
|------|------|-------------|
| `isChecked` | `boolean` | Whether this radio item is currently selected |
| `disabled` | `boolean` | Whether this radio item is disabled |
| `isFocused` | `boolean` | Whether this radio item currently has focus |
| `select` | `() => void` | Function to programmatically select this radio item |

### Ref Forwarding
- **RadioGroup**: Forwards ref to root element (div by default)
- **RadioItem**: Forwards ref to root element (label by default)

### Controlled/Uncontrolled Support
- **Controlled**: Provide `value` and `onValueChange` props
- **Uncontrolled**: Provide only `defaultValue` prop

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| **Initial Load** | Component mounts | Focus on first item or checked item | `tabindex="0"` on focusable item, `-1` on others |
| **Tab Into Group** | Tab key | Focus moves to checked item or first item | Focus visible on target item |
| **Space/Enter on Focused** | Space/Enter key | Select focused item when `selectOnFocus={false}` | `aria-checked="true"` on focused, `false` on others |
| **Arrow Keys (Normal)** | ↓/→ or ↑/← | Move focus and selection to next/prev item | Focus moves, `aria-checked` updates, `tabindex` shifts |
| **Arrow Keys (Toolbar)** | ↓/→ or ↑/← | Move focus only (no selection change) | Focus moves, `tabindex` shifts, selection unchanged |
| **End Key (Normal)** | End key | Focus and select last item | Focus on last item, selection updates |
| **End Key (Toolbar)** | End key | Move focus to last item (no selection) | Focus on last item, selection unchanged |
| **Home Key (Normal)** | Home key | Focus and select first item | Focus on first item, selection updates |
| **Home Key (Toolbar)** | Home key | Move focus to first item (no selection) | Focus on first item, selection unchanged |
| **Disabled Item** | Any navigation | Skip disabled items | No focus on disabled items |
| **Value Change** | Programmatic | Update selection and focus | `aria-checked` updates, focus may shift |
| **Form Submit** | Submit event | Include selected value in form data | Hidden input with name/value submitted |

## 4. Accessibility

### Roles
- **Radio Group**: `role="radiogroup"` on container element
- **Radio Items**: `role="radio"` on each selectable item
- **No nested roles**: Items are direct children with no intermediate containers

### Keyboard Navigation

#### Standard Radio Group (selectOnFocus={true})
- **Tab/Shift+Tab**: Move focus into/out of radio group (single tab stop)
- **Arrow Keys**: Navigate between items and change selection
  - **Down Arrow/Right Arrow**: Next item (wraps to first)
  - **Up Arrow/Left Arrow**: Previous item (wraps to last)
- **Space**: Select focused radio item (optional, arrows usually sufficient)
- **Home**: Move focus to and select first item
- **End**: Move focus to and select last item

#### Toolbar Radio Group (selectOnFocus={false})
- **Tab/Shift+Tab**: Move focus into/out of radio group (single tab stop)
- **Arrow Keys**: Navigate between items (focus only, no selection change)
  - **Down Arrow/Right Arrow**: Next item (wraps to first)
  - **Up Arrow/Left Arrow**: Previous item (wraps to last)
- **Space/Enter**: Select focused radio item
- **Home**: Move focus to first item (no selection change)
- **End**: Move focus to last item (no selection change)

### Focus Management
- **Roving Tabindex**: Only one radio item receives focus via Tab
- **Visual Focus**: Clear focus indicators required on focused item
- **Focus Restoration**: Maintain focus position when value changes programmatically
- **Skip Disabled**: Navigation skips over disabled items

### Screen Reader Announcements
- **Group Label**: Radio group must have accessible name via `aria-label` or `aria-labelledby`
- **Item Labels**: Each radio item must have accessible name via content or `aria-label`
- **Selection State**: `aria-checked` announces checked/unchecked state
- **Position Info**: Screen readers announce "X of Y" position information
- **Live Updates**: Selection changes announced automatically

### Name/Role/Value Exposure
- **Name**: Group and items have accessible names
- **Role**: `radiogroup` and `radio` roles properly applied
- **Value**: `aria-checked` exposes selection state
- **Form Value**: Hidden input ensures form submission works

### WCAG 2.2 AA Compliance
- **Focus Indicators**: 3:1 contrast ratio, clearly visible
- **Target Size**: Minimum 24×24px touch target
- **Keyboard Access**: Full functionality available via keyboard
- **Screen Reader**: Complete information available to assistive technology

## 5. Implementation Architecture

### State Hooks Design
```tsx
// Internal state management
const useRadioGroup = (props: RadioGroupProps) => {
  const [value, setValue] = useControlledState(props.value, props.defaultValue, props.onValueChange);
  const [focusedValue, setFocusedValue] = useState<string | null>(null);
  
  return {
    value,
    setValue,
    focusedValue,
    setFocusedValue,
    // ... other state
  };
};
```

### Context Requirements
```tsx
interface RadioGroupContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled: boolean;
  name: string;
  focusedValue: string | null;
  setFocusedValue: (value: string | null) => void;
  orientation: 'horizontal' | 'vertical';
  selectOnFocus: boolean;
  // Item registry — stores HTMLElement refs for imperative focus management
  registerItem: (value: string, element: HTMLElement) => void;
  unregisterItem: (value: string) => void;
  // Called by the root's keyboard handler to move focus imperatively
  // RadioItem.onFocus then syncs focusedValue state
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
```

### Ref Forwarding Strategy
- **Forward refs** to actual DOM elements, not wrapper components
- **Merge refs** when internal refs needed for focus management
- **Type safety** with proper generic constraints

### Event System
- **Synthetic Events**: Use React's event system for cross-browser compatibility
- **Event Bubbling**: Prevent unwanted bubbling of selection events
- **Custom Events**: Emit form-compatible events for integration

### SSR/CSR Safety
- **Deterministic IDs**: Generate consistent IDs across server/client
- **Hydration Safe**: No client-only logic in initial render
- **Progressive Enhancement**: Works without JavaScript

## 6. Styling & Data Attributes

### Required Data Attributes

#### RadioGroup
```tsx
data-orientation="horizontal" | "vertical"
data-disabled="true" | undefined
data-required="true" | undefined
data-select-on-focus="true" | undefined
data-autofocus="true" | undefined
```

#### RadioItem
```tsx
data-state="checked" | "unchecked"
data-disabled="true" | undefined
data-focused="true" | undefined
```

### Attribute Values
- **data-state**: `"checked"` when selected, `"unchecked"` when not selected
- **data-disabled**: `"true"` when disabled, undefined when enabled
- **data-focused**: `"true"` when focused, undefined when not focused
- **data-select-on-focus**: `"true"` when selectOnFocus is enabled, undefined when disabled
- **data-autofocus**: `"true"` when autoFocus is enabled, undefined when disabled
- **data-orientation**: `"horizontal"` or `"vertical"` for layout styling
- **data-required**: `"true"` when required, undefined when optional

## 7. Test Coverage Plan

### Unit Tests
- **State Management**: Controlled/uncontrolled behavior
- **Value Changes**: Selection updates and callbacks
- **Keyboard Navigation**: Arrow keys, Home/End, Space
- **Disabled States**: Group and individual item disabling
- **Form Integration**: Hidden input creation and value submission
- **Error Handling**: Invalid props and edge cases

### Accessibility Tests
- **jest-axe**: Zero accessibility violations
- **Keyboard Navigation**: Complete keyboard interaction testing
- **Screen Reader**: ARIA attributes and announcements
- **Focus Management**: Roving tabindex implementation
- **Color Contrast**: Focus indicators meet WCAG standards

### Integration Tests
- **Form Libraries**: Integration with popular form libraries
- **Real Usage**: Complex scenarios with dynamic values
- **Performance**: Large radio groups render efficiently
- **Browser Compatibility**: Cross-browser keyboard behavior

## 8. Constraints

### Zero Styling Requirements
- **No CSS imports**: Component imports zero stylesheets
- **No inline styles**: No `style` prop usage except for hiding
- **No style opinions**: No assumptions about visual design
- **Data attributes only**: Styling hooks via `data-*` attributes

### Behavior Only Design
- **Focus management**: Handle focus/blur programmatically
- **Selection logic**: Manage checked state internally
- **Keyboard events**: Process navigation without visual feedback
- **ARIA attributes**: Apply accessibility attributes correctly

### Tree-Shakeable Exports
- **Named exports**: No default exports for better tree-shaking
- **Minimal dependencies**: Reduce bundle size impact
- **Side effect free**: No side effects on import

### TypeScript Strict Mode
- **Explicit types**: All props and return types defined
- **No any**: Strict type checking throughout
- **Generic constraints**: Proper polymorphic prop typing

### WCAG 2.2 AA Compliance
- **Full keyboard support**: Complete navigation via keyboard
- **Screen reader support**: All information available to AT
- **Focus indicators**: Required visual focus feedback

### Controlled/Uncontrolled Support
- **Flexible patterns**: Support both controlled and uncontrolled usage
- **Development warnings**: Alert developers to incorrect usage patterns
- **Consistent behavior**: Predictable state management

## 9. Migration & Implementation Checklist

### Migration Guidance
- **From HTML radios**: Replace `<input type="radio">` with `<RadioGroup>` and `<RadioItem>`
- **From other libraries**: Map existing radio group props to new API structure
- **Form integration**: Use `name` prop for form submission compatibility
- **Styling migration**: Convert CSS selectors to data attribute selectors

### Implementation Checklist

#### Core Functionality
- [ ] Create compound component structure (RadioGroup + RadioItem)
- [ ] Implement controlled/uncontrolled state management
- [ ] Add roving tabindex focus management
- [ ] Support keyboard navigation (arrows, home/end, space)
- [ ] Generate hidden input for form submission

#### Accessibility Implementation
- [ ] Apply `role="radiogroup"` and `role="radio"`
- [ ] Implement `aria-checked` state management
- [ ] Add accessible naming support
- [ ] Ensure proper focus indicators
- [ ] Test with screen readers

#### TypeScript & API
- [ ] Define comprehensive prop interfaces
- [ ] Add polymorphic `as` prop support
- [ ] Implement proper ref forwarding
- [ ] Add development warnings for incorrect usage

#### Testing & Quality
- [ ] Write unit tests for all behaviors
- [ ] Add accessibility tests with jest-axe
- [ ] Test keyboard navigation thoroughly
- [ ] Verify form integration works
- [ ] Cross-browser testing

#### Documentation & Integration
- [ ] Add inline JSDoc comments
- [ ] Create usage examples
- [ ] Document data attributes for styling
- [ ] Test with popular form libraries
