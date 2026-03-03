# Tooltip — Spar Headless Instructions

## 1. Component Overview

- **Purpose**: A popup that displays supplementary information when an element receives focus or hover, providing clarification without cluttering the interface
- **Use Cases**: 
  - Icon-only buttons that need accessible labels
  - Supplementary descriptions for form inputs  
  - Additional context for complex UI controls
  - Clarifying abbreviations or technical terms
- **Compound Component Structure**: Flexible composition with Provider, Root, Trigger, Content, and Arrow parts
- **Key Differentiators**: 
  - Non-modal, lightweight information display
  - Dismissible with Escape or focus/hover loss
  - Never receives focus itself
  - Supports both primary labeling and auxiliary description patterns

## 2. API

### Tooltip Props

#### TooltipProvider Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | No | - | Tooltip components to share provider context |
| `delayDuration` | `number` | No | `700` | Global delay duration for all tooltips |
| `skipDelayDuration` | `number` | No | `300` | Duration to skip delay when moving between tooltips |
| `disableHoverableContent` | `boolean` | No | `false` | Disable hoverable content globally |

#### TooltipRoot Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | No | - | Tooltip trigger and content components |
| `open` | `boolean` | No | - | Controlled state for tooltip visibility |
| `defaultOpen` | `boolean` | No | `false` | Default open state for uncontrolled tooltip |
| `onOpenChange` | `(open: boolean) => void` | No | - | Callback when tooltip open state changes |
| `delay` | `number` | No | - | Override provider delay for this tooltip |
| `hideDelay` | `number` | No | `0` | Override provider hide delay for this tooltip |
| `disabled` | `boolean` | No | `false` | Whether tooltip is disabled |

#### TooltipTrigger Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode \| ((state: TooltipTriggerRenderProps) => ReactNode)` | No | - | The trigger element or render function for render props pattern |
| `as` | `ElementType` | No | `'button'` | Element type for the trigger |

#### TooltipTriggerRenderProps

| Name | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Whether the tooltip is currently visible |
| `disabled` | `boolean` | Whether the tooltip is disabled |
| `placement` | `Side` | Current placement side of the tooltip |
| `show` | `() => void` | Function to show the tooltip |
| `hide` | `() => void` | Function to hide the tooltip |

#### TooltipContent Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | No | - | Content to display in tooltip |
| `className` | `string` | No | - | CSS class names for styling |
| `style` | `React.CSSProperties` | No | - | Inline styles |
| `as` | `ElementType` | No | `'div'` | Element type for tooltip content container |
| `asLabel` | `boolean` | No | `false` | Whether tooltip provides primary label or auxiliary description |
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | No | `'top'` | Preferred placement relative to trigger |
| `sideOffset` | `number` | No | `8` | Distance in pixels from the trigger |
| `align` | `'start' \| 'center' \| 'end'` | No | `'center'` | Alignment relative to trigger |
| `alignOffset` | `number` | No | `0` | Offset for alignment |
| `avoidCollisions` | `boolean` | No | `true` | Whether to avoid viewport collisions |
| `collisionBoundary` | `Element \| Element[]` | No | - | Collision boundary elements |
| `collisionPadding` | `number \| Partial<Record<Side, number>>` | No | `8` | Padding for collision detection |
| `sticky` | `'partial' \| 'always'` | No | `'partial'` | Sticky behavior during scroll |
| `hideWhenDetached` | `boolean` | No | `false` | Hide when trigger becomes detached |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | No | - | Escape key handler |
| `onPointerDownOutside` | `(event: PointerEvent) => void` | No | - | Outside pointer down handler |
| `onOpenAutoFocus` | `(event: Event) => void` | No | - | Called when auto-focusing on open |
| `onCloseAutoFocus` | `(event: Event) => void` | No | - | Called when auto-focusing on close |
| `container` | `HTMLElement` | No | `document.body` | Portal target container for the tooltip content |

#### TooltipArrow Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `width` | `number` | No | `10` | Arrow width in pixels |
| `height` | `number` | No | `5` | Arrow height in pixels |
| `as` | `ElementType` | No | `'svg'` | Element type for arrow |

### Ref Support
- Forwards ref to trigger element
- Content component supports polymorphic `as` prop for semantic flexibility
- Arrow component supports polymorphic `as` prop (defaults to `'svg'`)

### Controlled/Uncontrolled
- **Uncontrolled**: Default behavior with internal show/hide state
- **Controlled**: Provide `open` and `onOpenChange` for external state management

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| Closed | Mouse hover on trigger | Show tooltip after delay | `aria-describedby` or `aria-labelledby` points to tooltip |
| Closed | Focus trigger | Show tooltip immediately | `aria-describedby` or `aria-labelledby` points to tooltip |
| Closed | Touch trigger | No tooltip shown | No change |
| Open | Mouse enter tooltip | Tooltip stays open | No change (WCAG 1.4.13 hoverable requirement) |
| Open | Mouse leave trigger | Hide tooltip after hideDelay | Remove `aria-describedby`/`aria-labelledby` |
| Open | Blur trigger | Hide tooltip | Remove `aria-describedby`/`aria-labelledby` |
| Open | Press Escape | Hide tooltip | Remove `aria-describedby`/`aria-labelledby`, focus remains on trigger |
| Open | Click outside | Hide tooltip | Remove `aria-describedby`/`aria-labelledby` |
| Open | Trigger click (when closeOnClick=true) | Hide tooltip | Remove `aria-describedby`/`aria-labelledby` |
| Disabled | Any interaction | No tooltip | No ARIA attributes applied |
| **Controlled** | `isOpen=true` prop | Show tooltip immediately | ARIA attributes applied |
| **Controlled** | `isOpen=false` prop | Hide tooltip immediately | ARIA attributes removed |
| **Provider Context** | Multiple tooltips hover quickly | Skip delay for subsequent tooltips | Optimized timing coordination |
| **Provider Context** | Tooltip hover while another open | Close previous, open new with skip delay | Provider state coordination |

## 4. Accessibility

### Roles
- **Tooltip element**: `role="tooltip"` 
- **Trigger element**: Maintains its semantic role (button, input, etc.)

### WCAG 1.4.13 Compliance (Content on Hover or Focus)
- **Dismissible**: Tooltip can be dismissed with Escape key without moving pointer
- **Hoverable**: Tooltip itself can be hovered without disappearing (critical for large pointers/magnification)
- **Persistent**: Tooltip remains visible until hover/focus removed, dismissed, or information invalid

### Keyboard
- **Tab/Shift+Tab**: Navigate to/from trigger, tooltip shows on focus
- **Escape**: Dismiss tooltip, focus remains on trigger
- **No direct keyboard navigation**: Tooltip never receives focus

### Focus Management
- Focus always remains on trigger element
- Tooltip appears/disappears based on trigger focus state
- No focus trapping (tooltip is non-modal)
- Clear focus indicators on trigger element

### Announcements (Screen Reader)
- **Primary Label Mode** (`asLabel={true}`): 
  - Use `aria-labelledby` to associate tooltip as primary label
  - Content announced when trigger receives focus
- **Auxiliary Description Mode** (`asLabel={false}` - default):
  - Use `aria-describedby` to associate tooltip as supplementary info
  - Content announced after label and role information
- **No live regions**: Tooltip content is not dynamically announced

### Name/Role/Value Exposure
- Trigger element must have accessible name (via `aria-label`, `aria-labelledby`, or text content)
- Tooltip content provides either primary label or supplementary description
- Proper association via `aria-labelledby` or `aria-describedby`

## 5. Implementation Architecture

### State Hooks Design
```typescript
interface TooltipState {
  isOpen: boolean;
  hovering: boolean;
  focused: boolean;
  hoveringTooltip: boolean;
  showTimeoutId: number | null;
  hideTimeoutId: number | null;
}

// Compound API context
interface TooltipContextValue {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  delay: number;
  hideDelay: number;
  skipDelayDuration: number;
  disableHoverableContent: boolean;
  // Internal state for compound components
  triggerId: string;
  contentId: string;
  asLabel: boolean;
}

interface TooltipProviderContextValue {
  delayDuration: number;
  skipDelayDuration: number;
  disableHoverableContent: boolean;
  skipDelay: boolean;
  setSkipDelay: (open: boolean) => void;
}
```

### Context Requirements
- **Compound API**: Provider context for shared state management across multiple tooltip instances
- **Provider-level optimizations**: Skip delay when moving between tooltips quickly
- **Tooltip-level context**: Each tooltip root manages its own state independently
- **Provider shares common configuration**: Delays, global settings, and inter-tooltip coordination
- **Context isolation**: Multiple providers can coexist without interference

### Ref Forwarding Strategy
- Forward ref to trigger element (the child)
- Tooltip portal element gets internal ref for positioning

### Event System
- Mouse enter/leave on trigger element
- **Mouse enter/leave on tooltip element** (WCAG 1.4.13 hoverable requirement)
- Focus/blur on trigger element  
- Keydown (Escape) on trigger element
- Click outside detection via document listener
- Debounced hover delay using setTimeout
- **Hide delay** for mouse leave events
- **Pointer grace area**: Allow pointer to move from trigger to tooltip without dismissing
- **Skip delay optimization**: Reduce delay when moving between tooltips quickly
- **Touch event handling**: Prevent tooltip on touch-only devices

### SSR/CSR Safety and Deterministic IDs
- Generate stable IDs using `useId()` hook
- Built-in portal (via `createPortal` in TooltipContent) renders only after hydration
- No layout shift during tooltip appearance
- Graceful degradation when JS disabled
- **Hydration safety**: Prevent hydration mismatches with proper SSR handling
- **Progressive enhancement**: Ensure tooltip content is accessible even without JS
- **Deterministic rendering**: Consistent behavior across server and client

## 6. Styling & Data Attributes

### Required Data Attributes

#### Trigger Element
- `data-state`: `"open" | "closed"`
- `data-placement`: `"top" | "bottom" | "left" | "right"` (actual placement after collision detection)
- `data-focus-visible`: `"true" | "false"` (focus visible state)
- `data-disabled`: `"true" | "false"` (disabled state)

#### Tooltip Element  
- `data-state`: `"open" | "closed"`
- `data-placement`: `"top" | "bottom" | "left" | "right"`
- `data-as-label`: `"true" | "false"` (matches asLabel prop)

### Positioning Data
- CSS custom properties for dynamic positioning:
  - `--tooltip-x`: Horizontal position
  - `--tooltip-y`: Vertical position
  - `--tooltip-offset`: Distance from trigger
  - `--tooltip-arrow-x`: Arrow horizontal position
  - `--tooltip-arrow-y`: Arrow vertical position

## 7. Test Coverage Plan

### Unit Tests
- Props validation and defaults
- Controlled vs uncontrolled behavior
- Event handler registration and cleanup
- ID generation and stability
- Ref forwarding to trigger element

### Accessibility Tests
- Proper ARIA attributes in both modes (`aria-labelledby` vs `aria-describedby`)
- Keyboard navigation (focus/escape)
- Screen reader announcements
- Focus management and indicators
- Touch accessibility considerations
- **WCAG 1.4.13 compliance**: Dismissible, hoverable, persistent requirements
- **Magnification scenarios**: Large cursor/viewport testing
- **Color contrast**: Ensure tooltip content meets AA contrast ratios
- **Focus-visible testing**: Verify focus indicators work properly
- **Screen reader timing**: Test announcement timing and content clarity

### Integration Tests
- Multiple tooltips on same page (tooltip groups and isolation)
- Tooltip within forms and complex components
- Built-in portal rendering and positioning (via `container` prop on TooltipContent)
- Performance with many tooltips (virtual scrolling scenarios)
- Edge cases (rapidly hovering, nested focusable elements)
- **Provider behavior**: Test skip delay and inter-tooltip coordination
- **Collision detection**: Verify positioning adjustments work correctly
- **Z-index management**: Ensure proper layering in complex UIs
- **Memory leaks**: Verify proper cleanup of event listeners and timeouts

## 8. Constraints

- Zero styling (behavior only)
- Styling via `data-*` attributes and CSS custom properties
- **Tree-shakeable exports**: Named exports only, zero side effects, ES modules compatible
- **Side-effect-free imports**: No global state mutations, CSS imports, or initialization code in module scope
- **Bundle optimization**: Supports dead code elimination and partial imports (`import { Tooltip } from '@turkish-technology/spar'`)
- TypeScript strict mode
- WCAG 2.2 AA compliant
- Controlled/uncontrolled support
- No focus capture (tooltip never focusable)
- Touch users must have alternative access to tooltip content
- **Framework agnostic patterns**: Minimal React-specific dependencies
- **Accessibility by default**: All features accessible without configuration

## 9. Migration & Implementation Checklist

### Migration Guidance
- **From title attribute**: Replace `title` with proper tooltip component
- **From custom solutions**: Ensure proper ARIA relationships and keyboard support
- **From libraries**: Verify accessibility compliance and touch device behavior

### Implementation Checklist
- [ ] Single trigger element validation (children must be one focusable element)
- [ ] Proper ARIA association (`aria-describedby` vs `aria-labelledby`)
- [ ] Hover delay implementation with cleanup
- [ ] Focus-based immediate showing
- [ ] **WCAG 1.4.13 compliance**: Dismissible, hoverable, persistent behavior
- [ ] **Tooltip hoverable**: Mouse can move from trigger to tooltip without dismissing
- [ ] **Hide delay implementation**: Prevents accidental dismissal during pointer movement
- [ ] Escape key dismissal
- [ ] Click outside dismissal
- [ ] Built-in portal via `createPortal` in TooltipContent for z-index independence
- [ ] Collision detection and placement adjustment
- [ ] **Touch device accessibility**: Alternative content access patterns
- [ ] **Media query detection**: Proper hover capability detection
- [ ] SSR compatibility and hydration safety
- [ ] Performance optimization for multiple tooltips
- [ ] TypeScript strict mode compliance
- [ ] **Compound API implementation**: Provider, Root, Trigger, Content, Arrow components (portal is built into Content)
- [ ] **Context state management**: Provider shares configuration across tooltip instances
- [ ] **Composition flexibility**: Support for custom layouts and advanced positioning
- [ ] **Arrow component**: Optional arrow with customizable size and styling hooks
- [ ] **Advanced positioning**: Collision detection, alignment, sticky behavior, and boundary constraints
- [ ] **Provider optimizations**: Skip delay and inter-tooltip coordination
- [ ] **Pointer grace area**: Smooth pointer movement between trigger and tooltip
- [ ] **Performance monitoring**: Event listener cleanup and memory leak prevention
- [ ] **Bundle size analysis**: Tree-shaking verification and side effects audit
- [ ] **Dead code elimination**: Test partial imports work correctly (`import { Tooltip } from '@turkish-technology/spar'`)
- [ ] **Prop forwarding**: className, style, data-*, aria-* attributes support
- [ ] Keyboard-only testing
- [ ] Touch device testing with real devices
