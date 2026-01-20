# Accordion — Spar Headless Instructions

## 1. Component Overview

### Purpose and Use Cases
The Accordion component provides a vertically stacked set of interactive headings that control the visibility of associated content sections. Used to reduce scrolling by allowing users to selectively reveal content sections of interest.

### Compound Component Structure
```tsx
<Accordion>
  <AccordionItem>
    <AccordionHeader>
      <AccordionTrigger>Heading 1</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
  <AccordionItem>
    <AccordionHeader>
      <AccordionTrigger>Heading 2</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>Content 2</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Key Differentiators
- Headless behavior-only implementation with zero styling
- Full keyboard navigation support (Tab, Enter/Space, Arrow keys, Home/End)
- Proper semantic heading structure with AccordionHeader component
- Controlled and uncontrolled modes
- Single or multiple panel expansion modes
- WCAG 2.2 AA compliant with proper ARIA semantics
- Polymorphic components with ref forwarding

## 2. API

### Accordion (Root)
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | `"single" \| "multiple"` | No | `"single"` | Single panel or multiple panels can be expanded |
| `collapsible` | `boolean` | No | `false` | Whether panels can be collapsed (only for single type) |
| `value` | `string \| string[]` | No | `undefined` | Controlled state - single value or array for multiple |
| `defaultValue` | `string \| string[]` | No | `undefined` | Uncontrolled initial state |
| `onValueChange` | `(value: string \| string[]) => void` | No | `undefined` | Callback when state changes |
| `disabled` | `boolean` | No | `false` | Disables all accordion items |
| `orientation` | `"vertical" \| "horizontal"` | No | `"vertical"` | Orientation for keyboard navigation |
| `as` | `PolymorphicAs` | No | `"div"` | Polymorphic component type |
| `children` | `React.ReactNode` | Yes | - | AccordionItem components |

### AccordionItem
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | Yes | - | Unique identifier for the item |
| `disabled` | `boolean` | No | `false` | Disables this specific item |
| `as` | `PolymorphicAs` | No | `"div"` | Polymorphic component type |
| `children` | `React.ReactNode` | Yes | - | AccordionHeader and AccordionContent components |

### AccordionHeader
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `level` | `number` | No | `3` | Heading level (1-6) for document hierarchy |
| `as` | `PolymorphicAs` | No | `"h3"` | Polymorphic component type (heading element) |
| `children` | `React.ReactNode` | Yes | - | AccordionTrigger component |

### AccordionTrigger
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `PolymorphicAs` | No | `"button"` | Polymorphic component type |
| `children` | `React.ReactNode \| ((state: AccordionTriggerRenderProps) => React.ReactNode)` | Yes | - | Trigger content or render function for render props pattern |

### AccordionTriggerRenderProps
| Name | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Whether the accordion item is currently expanded |
| `disabled` | `boolean` | Whether the trigger is disabled |
| `open` | `() => void` | Function to programmatically open the accordion item |
| `close` | `() => void` | Function to programmatically close the accordion item |
| `toggle` | `() => void` | Function to programmatically toggle the accordion item |

### AccordionContent
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `forceMount` | `boolean` | No | `false` | Force content to remain mounted when collapsed |
| `as` | `PolymorphicAs` | No | `"div"` | Polymorphic component type |
| `children` | `React.ReactNode` | Yes | - | Panel content |

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| Collapsed Panel | Click/Enter/Space on trigger | Expands panel | `aria-expanded="true"`, content visible |
| Expanded Panel (collapsible) | Click/Enter/Space on trigger | Collapses panel | `aria-expanded="false"`, content hidden |
| Expanded Panel (non-collapsible) | Click/Enter/Space on trigger | No change | Trigger has `aria-disabled="true"` |
| Single type, other panel open | Expand different panel | Previous collapses, new expands | Previous `aria-expanded="false"`, new `aria-expanded="true"` |
| Multiple type | Expand/collapse panels | Independent panel states | Each panel's `aria-expanded` reflects state |
| Disabled item | Any interaction | No change | `aria-disabled="true"` on trigger |
| Focus on trigger | Down arrow | Focus moves to next trigger | Focus management |
| Focus on trigger | Up arrow | Focus moves to previous trigger | Focus management |
| Focus on trigger | Home | Focus moves to first trigger | Focus management |
| Focus on trigger | End | Focus moves to last trigger | Focus management |

## 4. Accessibility

### Roles
- Root: No specific role (semantic `div`)
- Item: No specific role (semantic `div`)
- Header: `role="heading"` with appropriate `aria-level` (implicit via heading element)
- Trigger: `role="button"` (implicit via `<button>` element)
- Content: `role="region"` with `aria-labelledby` (optional, avoid proliferation)

### Keyboard Navigation
- **Tab/Shift+Tab**: Navigate through accordion triggers in document order
- **Enter/Space**: Toggle panel expansion when focused on trigger
- **Down Arrow**: Move focus to next accordion trigger
- **Up Arrow**: Move focus to previous accordion trigger  
- **Home**: Move focus to first accordion trigger
- **End**: Move focus to last accordion trigger

### Focus Management
- Focus indicators must be visible on all interactive elements
- Focus remains on trigger after activation
- Tab sequence includes all accordion triggers

### Screen Reader Announcements
- State changes announced via `aria-expanded` 
- Panel content associated with trigger via `aria-controls`
- Optional live region announcements for dynamic content changes
- Error states announced via `aria-describedby` and `role="alert"`

### Name/Role/Value Exposure
- Each trigger has accessible name from its text content
- `aria-expanded` exposes current state (true/false)
- `aria-controls` connects trigger to panel content
- `aria-disabled` for disabled triggers
- `aria-labelledby` connects content region to trigger
- Header provides semantic heading structure with appropriate level for document hierarchy

### Heading Structure Requirements
- Each accordion trigger must be wrapped in a heading element
- Use semantic heading elements (h1-h6) or `role="heading"` with `aria-level`
- Heading levels should fit the document's information architecture
- Triggers are the only interactive element within each heading

## 5. Implementation Architecture

### State Hooks Design
```tsx
// Internal hook for accordion logic
const useAccordion = (props: AccordionProps) => {
  // Controlled/uncontrolled state management
  // Single vs multiple expansion logic
  // Keyboard navigation state
  return { expandedItems, toggleItem, focusedIndex, ... }
}

// Context for sharing state between components
const AccordionContext = createContext<AccordionContextValue>()
```

### Context Requirements
- Share expanded state between all child components
- Provide item registration/deregistration
- Share keyboard navigation state
- Expose type (single/multiple) and collapsible settings

### Ref Forwarding Strategy
- Forward refs through polymorphic `as` prop to actual DOM elements
- Support both `ref` and compound `ref` patterns
- Ensure refs work with all polymorphic element types

### Event System
- Internal state management with optional external control
- Keyboard event handling with proper preventDefault/stopPropagation
- Click handlers that respect disabled states

### SSR/CSR Safety and Deterministic IDs
- Use `useId()` hook for deterministic ID generation
- Ensure server/client markup consistency
- Handle hydration mismatches gracefully
- Generate unique IDs for `aria-controls` and `aria-labelledby`

## 6. Styling & Data Attributes

### Required Data Attributes

#### Accordion Root
- `data-orientation`: `"vertical"` | `"horizontal"`
- `data-type`: `"single"` | `"multiple"`

#### AccordionItem  
- `data-state`: `"open"` | `"closed"`
- `data-disabled`: Present when item is disabled

#### AccordionHeader
- `data-state`: `"open"` | `"closed"`
- `data-disabled`: Present when item is disabled
- `data-level`: Heading level (1-6)

#### AccordionTrigger
- `data-state`: `"open"` | `"closed"` 
- `data-disabled`: Present when trigger is disabled

#### AccordionContent
- `data-state`: `"open"` | `"closed"`

### Usage Examples for Styling
```css
/* Styling expanded state */
[data-state="open"] { /* expanded styles */ }
[data-state="closed"] { /* collapsed styles */ }

/* Disabled state styling */  
[data-disabled] { /* disabled styles */ }

/* Orientation-specific styling */
[data-orientation="horizontal"] { /* horizontal layout */ }
```

## 7. Test Coverage Plan

### Unit Tests
- Controlled vs uncontrolled behavior
- Single vs multiple expansion modes
- Collapsible setting functionality
- Disabled state handling
- Value change callbacks
- Polymorphic `as` prop behavior
- Ref forwarding

### Accessibility Tests
- ARIA attributes correctness (`aria-expanded`, `aria-controls`, etc.)
- Keyboard navigation (Tab, Enter/Space, Arrow keys, Home/End)
- Screen reader announcements (jest-axe)
- Focus management and visible indicators
- Heading structure and levels
- Disabled state accessibility

### Integration Tests
- Full user interaction flows
- State synchronization between components
- Dynamic content changes
- Error boundary behavior
- SSR/hydration consistency

## 8. Constraints

### Zero Styling (Behavior Only)
- No CSS imports or styling logic
- No visual opinions or layout styles
- Styling achieved via `data-*` attributes only

### Tree-Shakeable Exports
- Named exports for all components
- No side effects in module loading
- Each component importable independently

### TypeScript Strict Mode
- Explicit types for all props and state
- No `any` types allowed
- Proper generic constraints for polymorphic props

### WCAG 2.2 AA Compliant
- All interactive elements keyboard accessible
- Proper ARIA semantics and announcements
- Focus management and visual indicators

### Controlled/Uncontrolled Support
- Support both controlled and uncontrolled patterns
- Consistent API with React conventions
- Proper warning for switching modes

## 9. Migration & Implementation Checklist

### Migration Guidance
For developers migrating from other accordion libraries:
- Replace styling props with CSS targeting `data-*` attributes
- Update controlled state handling to match React conventions
- Ensure keyboard navigation expectations align with ARIA APG patterns
- Test accessibility compliance with jest-axe

### Implementation Checklist

#### Setup Phase
- [ ] Create compound component structure with proper TypeScript interfaces
- [ ] Implement AccordionHeader component with heading semantics
- [ ] Implement context for state sharing between components
- [ ] Set up controlled/uncontrolled state management with `useControllableState`

#### Core Functionality
- [ ] Single vs multiple expansion modes
- [ ] Collapsible behavior for single mode
- [ ] Panel toggle functionality
- [ ] Disabled state handling

#### Accessibility Implementation
- [ ] Proper ARIA attributes (`aria-expanded`, `aria-controls`, `aria-labelledby`)
- [ ] AccordionHeader with semantic heading structure and appropriate levels
- [ ] Complete keyboard navigation (Tab, Enter/Space, Arrows, Home/End)
- [ ] Focus management and visible indicators
- [ ] Screen reader announcements and live regions

#### Polymorphic Support
- [ ] `as` prop implementation for all components
- [ ] Ref forwarding through polymorphic elements
- [ ] Type safety for polymorphic props

#### Data Attributes
- [ ] State-based `data-*` attributes for styling hooks
- [ ] Consistent attribute naming across all components

#### Testing
- [ ] Unit tests for all behavior scenarios
- [ ] Accessibility tests with jest-axe (zero violations)
- [ ] Keyboard navigation integration tests
- [ ] SSR/hydration consistency tests

#### Documentation & Examples
- [ ] TypeScript interfaces exported
- [ ] Usage examples for common patterns
- [ ] Styling guide with data attribute usage
