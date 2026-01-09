# Popover — Spar Headless Instructions

## 1. Component Overview

- **Purpose**: A non-modal overlay that displays rich content in a floating container, triggered by user interaction and positioned relative to a trigger element
- **Use Cases**: 
  - Form field help content with rich formatting
  - Settings panels and configuration menus
  - User profile cards and action menus  
  - Content previews and detailed information displays
  - Custom dropdowns with complex interactions
- **Compound Component Structure**: Root container, Trigger, Content, Anchor, Portal, Close, and optional Arrow components
- **Key Differentiators**: 
  - Modal-like behavior without blocking the entire page
  - Rich content support (forms, buttons, links)
  - Sophisticated focus management with focus trapping
  - Light dismissal behavior (click outside, escape)
  - Collision detection and dynamic positioning

## 2. API

### PopoverRoot Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | No | - | Controlled state for popover visibility |
| `onOpenChange` | `(open: boolean) => void` | No | - | Callback when popover open state changes |
| `defaultOpen` | `boolean` | No | `false` | Initial open state for uncontrolled mode |
| `modal` | `boolean` | No | `false` | Whether popover should behave modally (focus trap + backdrop) |
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | No | `'bottom'` | Preferred side for popover positioning |
| `align` | `'start' \| 'center' \| 'end'` | No | `'center'` | Preferred alignment relative to trigger |
| `sideOffset` | `number` | No | `8` | Distance in pixels between trigger and popover |
| `children` | `React.ReactNode` | Yes | - | PopoverTrigger and PopoverContent components |

### PopoverTrigger Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `asChild` | `boolean` | No | `false` | Whether to render as child element instead of button |
| `children` | `React.ReactNode` | Yes | - | Trigger element content |
| `disabled` | `boolean` | No | `false` | Whether trigger is disabled |

### PopoverContent Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | No | `'bottom'` | Side of trigger to position against |
| `align` | `'start' \| 'center' \| 'end'` | No | `'center'` | Alignment relative to trigger |
| `sideOffset` | `number` | No | `8` | Distance from trigger |
| `alignOffset` | `number` | No | `0` | Offset along alignment axis |
| `avoidCollisions` | `boolean` | No | `true` | Whether to adjust position to avoid viewport collisions |
| `collisionBoundary` | `Element \| Element[]` | No | - | Boundary elements for collision detection |
| `hideWhenDetached` | `boolean` | No | `false` | Whether to hide when trigger is occluded |
| `onOpenAutoFocus` | `(event: Event) => void` | No | - | Called when popover opens and focus moves inside. Call `event.preventDefault()` to prevent default focus behavior |
| `onCloseAutoFocus` | `(event: Event) => void` | No | - | Called when popover closes and focus returns to trigger. Call `event.preventDefault()` to prevent default focus behavior |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | No | - | Called when escape is pressed. Call `event.preventDefault()` to prevent closing |
| `onPointerDownOutside` | `(event: PointerEvent) => void` | No | - | Called when pointer down occurs outside the content. Call `event.preventDefault()` to prevent closing |
| `onFocusOutside` | `(event: FocusEvent) => void` | No | - | Called when focus moves outside the content. Call `event.preventDefault()` to prevent closing |
| `onInteractOutside` | `(event: PointerEvent \| FocusEvent) => void` | No | - | Called when interaction occurs outside the content. Call `event.preventDefault()` to prevent closing |
| `trapFocus` | `boolean` | No | `false` | Whether to trap focus within content |
| `children` | `React.ReactNode` | Yes | - | Popover content |

### PopoverArrow Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `width` | `number` | No | `10` | Arrow width in pixels |
| `height` | `number` | No | `5` | Arrow height in pixels |
| `offset` | `number` | No | `0` | Offset along the edge |

### PopoverAnchor Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `asChild` | `boolean` | No | `false` | Whether to render as child element instead of div |
| `children` | `React.ReactNode` | Yes | - | Anchor element content |

### PopoverPortal Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `container` | `Element \| null` | No | `document.body` | Container element to portal content into |
| `children` | `React.ReactNode` | Yes | - | Content to be portaled (typically PopoverContent) |

### PopoverClose Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `asChild` | `boolean` | No | `false` | Whether to render as child element instead of button |
| `children` | `React.ReactNode` | Yes | - | Close trigger element content |
| `onClick` | `(event: MouseEvent) => void` | No | - | Additional click handler (popover will close automatically) |

### Ref Support
- PopoverTrigger forwards ref to trigger element
- PopoverContent forwards ref to content container
- PopoverAnchor forwards ref to anchor element
- Polymorphic `asChild` prop for PopoverTrigger composition

### Controlled/Uncontrolled
- **Uncontrolled**: Use `defaultOpen` for initial state, internal state management
- **Controlled**: Provide `open` and `onOpenChange` for external state control

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| Closed | Click trigger | Open popover, focus first focusable element | `aria-expanded="true"`, `aria-controls` points to content |
| Closed | Enter/Space on trigger | Open popover, focus first focusable element | `aria-expanded="true"`, `aria-controls` points to content |
| Closed | Down Arrow on trigger | Open popover, focus first focusable element | `aria-expanded="true"`, `aria-controls` points to content |
| Open | Click trigger | Close popover, return focus to trigger | `aria-expanded="false"`, remove `aria-controls` |
| Open | Enter/Space on trigger | Close popover, return focus to trigger | `aria-expanded="false"`, remove `aria-controls` |
| Open | Escape anywhere | Close popover, return focus to trigger | `aria-expanded="false"`, remove `aria-controls` |
| Open | Click outside content | Close popover, return focus to trigger | `aria-expanded="false"`, remove `aria-controls` |
| Open | Focus outside content (when not trapped) | Close popover | `aria-expanded="false"`, remove `aria-controls` |
| Open | Tab within content | Navigate between focusable elements | No change |
| Open | Shift+Tab from first element (when trapped) | Focus last element | No change |
| Open | Tab from last element (when trapped) | Focus first element | No change |:
| Open | Click PopoverClose | Close popover, return focus to trigger | aria-expanded="false" |
| Open | PopoverAnchor element moves/removed | Reposition or close popover | Update position data attributes |
| Open | Viewport resize | Reposition popover with collision detection | Update `data-side`, `data-align` |
| Open | Scroll container | Update popover position | Update position CSS variables |
| Open | Click PopoverPortal container | No action (event isolated) | No change |
| Open | PopoverArrow positioning | Arrow follows content placement | Update `data-side` on arrow |
| Modal | Focus outside attempt | Block focus change, return to content | No change |
| Disabled | Any trigger interaction | No action | No attributes applied |
| Error | Invalid configuration | Log error, graceful degradation | Add `data-error` attribute |
| Loading | Async content loading | Show loading state | Add `data-loading` attribute |


## 4. Accessibility

### Roles
- **Trigger element**: `button` role (default) or maintains semantic role with `asChild`
- **Content element**: `dialog` role for modal popover, no specific role for non-modal
- **Arrow element**: `presentation` role (purely decorative)
- **Anchor element**: No specific role (inherits from child or defaults to generic)
- **Portal element**: No role (transparent rendering container)
- **Close element**: `button` role (default) or maintains semantic role with `asChild`

### Keyboard
- **Tab/Shift+Tab**: Navigate focusable elements within popover
- **Enter/Space on trigger**: Toggle popover open/closed state
- **Down Arrow on trigger**: Open popover and focus first element
- **Escape**: Close popover, return focus to trigger
- **Home/End within content**: Move to first/last focusable element (when appropriate)
- **Arrow keys within content**: Navigate between actionable items when appropriate
- **Page Up/Page Down**: Scroll content when overflow exists


### Focus Management
- **Opening**: Focus moves to first focusable element in content (configurable)
- **Closing**: Focus returns to trigger element
- **Trapping**: Optional focus trapping within content when `trapFocus={true}`
- **Restoration**: Proper focus restoration on all close scenarios
- **Visible indicators**: Clear focus indicators on all interactive elements
- **Focus loss recovery**: If focus is lost unexpectedly, return to trigger element
- **Programmatic focus**: Support for manual focus management via refs


### Announcements (Screen Reader)
- **State changes**: Popover open/close state announced via `aria-expanded`
- **Content relationship**: Clear association between trigger and content via `aria-controls`
- **Modal behavior**: When modal, announced as dialog with proper labeling
- **No live regions**: Content changes are not auto-announced unless specifically designed
- **Error states**: Screen reader announcements for validation errors within popover
- **Loading states**: Proper announcements during async content loading


### Name/Role/Value Exposure
- Trigger must have accessible name via text content, `aria-label`, or `aria-labelledby`
- Content should have accessible name via `aria-labelledby` pointing to trigger or explicit label
- Clear indication of expandable/collapsible state via `aria-expanded`
- Proper owner relationship via `aria-controls` pointing to content ID
- `aria-disabled="true"` when trigger is disabled


### WCAG 2.2 AA Compliance
- **Keyboard accessible**: Full keyboard operability for all functions
- **Focus visible**: Clear focus indicators with minimum 3:1 contrast ratio
- **Focus order**: Logical focus sequence within popover content
- **Content on hover/focus**: Content remains available and persistent
- **Target size**: Minimum 44×44px clickable areas for interactive elements
- **High contrast support**: Respects `prefers-contrast: high` media query
- **Reduced motion**: Respects `prefers-reduced-motion: reduce` for animations

## 5. Implementation Architecture

### State Hooks Design
```typescript
interface PopoverState {
  isOpen: boolean;
  triggerRect: DOMRect | null;
  contentRect: DOMRect | null;
  side: PopoverSide;
  align: PopoverAlign;
  actualSide: PopoverSide;
  actualAlign: PopoverAlign;
  isPositioned: boolean;
  triggerElement: HTMLElement | null;
  contentElement: HTMLElement | null;
  anchorElement: HTMLElement | null;
}

type PopoverSide = 'top' | 'bottom' | 'left' | 'right';
type PopoverAlign = 'start' | 'center' | 'end';

// Enhanced TypeScript Generics for AsChild Pattern
type AsChildProps<T extends React.ElementType> = {
  asChild?: boolean;
} & (
  | { asChild: true; children: React.ReactElement }
  | { asChild?: false; children: React.ReactNode }
);

// Polymorphic component type with proper ref forwarding
type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

type PolymorphicComponentProps<T extends React.ElementType, P = {}> = P &
  Omit<React.ComponentPropsWithoutRef<T>, keyof P> &
  AsChildProps<T> & {
    as?: T;
  };

type PolymorphicComponent<T extends React.ElementType, P = {}> = <C extends React.ElementType = T>(
  props: PolymorphicComponentProps<C, P> & { ref?: PolymorphicRef<C> }
) => React.ReactElement | null;

// Enhanced component interfaces with generics
interface PopoverTriggerProps<T extends React.ElementType = 'button'> 
  extends PolymorphicComponentProps<T> {
  disabled?: boolean;
}

interface PopoverContentProps<T extends React.ElementType = 'div'> 
  extends PolymorphicComponentProps<T> {
  side?: PopoverSide;
  align?: PopoverAlign;
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionBoundary?: Element | Element[];
  hideWhenDetached?: boolean;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onFocusOutside?: (event: FocusEvent) => void;
  onInteractOutside?: (event: PointerEvent | FocusEvent) => void;
  trapFocus?: boolean;
}

interface PopoverAnchorProps<T extends React.ElementType = 'div'> 
  extends PolymorphicComponentProps<T> {}

interface PopoverCloseProps<T extends React.ElementType = 'button'> 
  extends PolymorphicComponentProps<T> {
  onClick?: (event: MouseEvent) => void;
}

// Generic component declarations
declare const PopoverTrigger: PolymorphicComponent<'button', PopoverTriggerProps>;
declare const PopoverContent: PolymorphicComponent<'div', PopoverContentProps>;
declare const PopoverAnchor: PolymorphicComponent<'div', PopoverAnchorProps>;
declare const PopoverClose: PolymorphicComponent<'button', PopoverCloseProps>;

const usePopover = (props: PopoverRootProps) => {
  // Controlled/uncontrolled state management
  // Position calculation and collision detection
  // Focus management utilities
  // Event coordination between trigger and content
  // Viewport resize and scroll listeners
  // Portal management
}

const usePopoverContext = () => {
  // Access to shared popover state
  // Trigger and content coordination
  // Throws error if used outside PopoverRoot
}

// Specialized hooks for component logic
const usePopoverTrigger = <T extends React.ElementType = 'button'>(
  props: PopoverTriggerProps<T>
) => {
  // Returns trigger-specific props and handlers
  // ARIA attributes management
  // Keyboard event handling
  // Type-safe element-specific props
}

const usePopoverContent = <T extends React.ElementType = 'div'>(
  props: PopoverContentProps<T>
) => {
  // Returns content-specific props and handlers
  // Positioning styles and data attributes
  // Outside interaction handlers
  // Type-safe element-specific props
}
```

### Context Requirements
- **PopoverContext**: Shared state between Root, Trigger, and Content components with strict TypeScript interface
- **Provider pattern**: Context.Provider with memoized values for performance optimization
- **Error boundaries**: Clear error messages when components used outside PopoverRoot
- **State synchronization**: Coordinated open/close state, positioning, and focus management
- **Event coordination**: Unified event handling across components with proper cleanup
- **ID management**: Automatic ID generation for ARIA relationships using React's useId()
- **Type safety**: Strict TypeScript definitions with null checks and proper error handling
- **Performance**: Memoized context values to prevent unnecessary re-renders
- **Positioning optimization**: Debounced positioning calculations with RAF scheduling
- **Memory efficiency**: Weak references for element tracking and automatic cleanup
- **Bundle impact**: Tree-shakeable exports targeting <5KB gzipped for core functionality

### Ref Forwarding Strategy
- **PopoverTrigger**: forwards ref to trigger element with asChild support and generic type safety
- **PopoverContent**: forwards ref to content container element with polymorphic element support
- **PopoverAnchor**: forwards ref to anchor element for positioning reference with type inference
- **PopoverArrow**: forwards ref to arrow SVG element for positioning
- **PopoverClose**: forwards ref to close button element with polymorphic element support
- **Internal ref system**: Separate refs for positioning calculations and focus management
- **Ref composition**: Safe merging of internal, forwarded, and child refs with type preservation
- **AsChild pattern**: Complete ref forwarding support with polymorphic composition and generic constraints
- **Type safety**: Strict TypeScript definitions for all ref element types with generic inference
- **Generic support**: Full TypeScript generic support for custom element types (e.g., `<PopoverTrigger<'a'>`)
- **Performance optimization**: Memoized ref callbacks and efficient cleanup
- **Portal compatibility**: Ref accessibility across portal rendering boundaries
- **Error handling**: Graceful fallback when ref targets become unavailable

### Event System
- **Click events**: Toggle on trigger click, close on outside click
- **Keyboard events**: Enter/Space toggle, Escape close, arrow navigation
- **Focus events**: Open on trigger focus (optional), close on focus outside
- **Positioning events**: Scroll/resize listeners for position updates
- **Escape handling**: Global escape key listener with proper event prevention
- **Event coordination**: Centralized event management with proper cleanup
- **Event bubbling**: Controlled propagation to prevent interference
- **Portal isolation**: Event boundaries for portal-rendered content
- **Performance optimization**: Debounced scroll/resize with passive listeners
- **Global listeners**: Window blur/focus for state management
- **Memory management**: Comprehensive cleanup of all event listeners

### SSR/CSR Safety and Deterministic IDs
- **Stable ID generation**: Generate stable IDs using `useId()` hook for ARIA relationships
- **Portal hydration safety**: Portal creation only after hydration with `useEffect`
- **Graceful degradation**: Basic functionality when JavaScript disabled
- **Layout shift prevention**: No visual jumps during popover mounting
- **Hydration mismatch guards**: Prevent server/client rendering inconsistencies
- **Progressive enhancement**: Layer interactive features over accessible baseline
- **ID collision prevention**: Unique identifiers across multiple component instances
- **Content streaming support**: Compatible with React 18 streaming SSR
- **Portal error recovery**: Fallback behavior when portal containers unavailable
- **Client-only isolation**: Wrap CSR-specific features in hydration checks
- **State consistency**: Ensure server and client state synchronization
- **Performance optimization**: Lazy initialization of expensive operations
- **Bundle boundary respect**: Clean separation of SSR and CSR code paths
- **Memory leak prevention**: Proper cleanup during hydration edge cases
- **Feature detection**: Runtime checks for advanced browser capabilities

## 6. Styling & Data Attributes

### Required Data Attributes

#### PopoverRoot
- `data-state`: `"open" | "closed"`

#### PopoverTrigger  
- `data-state`: `"open" | "closed"`
- `data-disabled`: Present when disabled
- `data-focused`: Present when trigger has focus
- `data-pressed`: Present during active/pressed state

#### PopoverContent
- `data-state`: `"open" | "closed"`
- `data-side`: `"top" | "bottom" | "left" | "right"` (actual side)
- `data-align`: `"start" | "center" | "end"` (actual alignment)
- `data-modal`: Present when popover behaves modally
- `data-focus-trapped`: Present when focus is trapped within content
- `data-hidden`: Present when hideWhenDetached=true and trigger is occluded
- `data-error`: Present when configuration error occurs
- `data-loading`: Present during async content loading

#### PopoverArrow
- `data-side`: Matches content side for styling

#### PopoverAnchor
- `data-state`: `"open" | "closed"`

#### PopoverClose
- `data-state`: `"open" | "closed"`

#### PopoverPortal
- `data-portal`: Identifies portal-rendered content

#### Animation States (All Components)
- `data-entering`: Present during enter animation
- `data-exiting`: Present during exit animation

### Positioning Data
- CSS custom properties for dynamic positioning:
  - `--popover-content-transform-origin`: Transform origin based on placement
  - `--popover-arrow-offset`: Arrow position offset
  - `--popover-content-available-width`: Available space for content
  - `--popover-content-available-height`: Available space for content
  - `--popover-trigger-width`: Trigger element width for sizing reference
  - `--popover-trigger-height`: Trigger element height for sizing reference
  - `--popover-anchor-width`: Anchor element width (when using separate anchor)
  - `--popover-anchor-height`: Anchor element height (when using separate anchor)

### Animation Hooks
- `data-state` changes provide CSS transition hooks
- `data-entering`/`data-exiting` for fine-grained animation control
- `data-side` and `data-align` for directional animations
- Enter/exit animations via CSS transitions or CSS-in-JS
- Transform origin automatically set for natural scaling animations
- Animation duration and timing customizable via CSS custom properties

## 7. Test Coverage Plan

### Unit Tests
- **State management**: Open/close state transitions with controlled/uncontrolled modes
- **Prop validation**: Required props, default values, and TypeScript prop types
- **Event handling**: Click, keyboard (Enter/Space/Escape/Arrow), and focus events
- **ARIA attributes**: Correct application of `aria-expanded`, `aria-controls`, `aria-disabled`
- **Context sharing**: Proper state synchronization between Root, Trigger, and Content
- **Controlled/uncontrolled modes**: External state control vs internal state management
- **Element references**: Trigger, content, and anchor element tracking
- **Position calculations**: Placement updates and collision detection triggers
- **Portal behavior**: Content rendering in portal containers

### Accessibility Tests
- **jest-axe integration**: Zero accessibility violations across all component combinations
- **Focus management**: Focus flow on open/close, focus restoration, and focus trapping
- **Keyboard navigation**: Tab, Shift+Tab, Escape, Enter, Space, and Arrow key handling
- **Screen reader testing**: Proper announcements via aria-expanded and aria-controls
- **ARIA relationships**: Trigger-content associations and role assignments
- **Focus indicators**: Visible focus states meeting WCAG 2.2 contrast requirements
- **Modal behavior**: Focus trapping and backdrop interaction when modal=true
- **Disabled states**: Proper handling of disabled triggers and ARIA attributes

### Integration Tests
- **Complex content scenarios**: Interactive forms, buttons, and links within popover content
- **Positioning edge cases**: Viewport boundaries, collision detection, and dynamic repositioning
- **Multi-popover interactions**: Nested popovers, sequential opening, and focus management
- **Event propagation**: Click outside, escape key bubbling, and portal event isolation
- **Dynamic content**: Content size changes, lazy loading, and async data scenarios
- **Real-world patterns**: Dropdown menus, help tooltips, user profiles, and settings panels
- **Cross-browser compatibility**: Focus behavior, portal rendering, and event handling
- **Performance testing**: Large content rendering, rapid open/close cycles, and memory leaks

## 8. Constraints

### Core Architecture
- **Zero styling**: Behavior-only components with no CSS imports or visual opinions
- **Headless design**: Complete separation of logic and presentation layers
- **Tree-shakeable exports**: Named exports with zero side effects for optimal bundling
- **Compound pattern**: Granular component parts (Root, Trigger, Content, Arrow, etc.)

### TypeScript Requirements
- **Strict mode compliance**: No `any` types, explicit interfaces, complete type coverage
- **Public API types**: All props, refs, and return types properly exported
- **Generic support**: Flexible element types with proper ref forwarding
- **Error boundaries**: Clear TypeScript errors for improper component usage
- **Type inference**: Automatic type inference for ref types based on element generics
- **Constraint validation**: Compile-time validation of valid HTML element combinations

### Accessibility Standards
- **WCAG 2.2 AA compliant**: Full keyboard accessibility and screen reader support
- **Focus management**: Proper focus flow, trapping, and restoration patterns
- **ARIA implementation**: Complete roles, properties, and state management
- **Keyboard operability**: All functionality accessible via keyboard alone

### Framework Integration
- **React compatibility**: Support for React 16.8+ with hooks and modern patterns
- **SSR/hydration safety**: No client-only code in initial render, stable IDs
- **Portal rendering**: Proper z-index stacking and event isolation
- **Performance optimization**: Efficient re-renders and positioning calculations

### Developer Experience
- **Controlled/uncontrolled support**: Flexible state management patterns
- **AsChild composition**: Polymorphic component rendering with proper ref forwarding
- **Data attributes**: Comprehensive styling hooks via data-* attributes
- **CSS custom properties**: Dynamic positioning and animation support
- **Error handling**: Clear error messages and graceful degradation

### Implementation Boundaries
- **No styling assumptions**: Zero opinions about visual design or layout
- **No animation libraries**: CSS-based animations via data attributes only
- **No positioning libraries**: Custom collision detection and placement logic
- **No accessibility shortcuts**: Full WCAG compliance without third-party dependencies

## 9. Migration & Implementation Checklist

### Migration Guidance
- **From custom dropdowns**: Replace with PopoverTrigger + PopoverContent pattern
- **From modal dialogs**: Consider Popover for lighter, contextual content
- **From tooltip libraries**: Use Popover for interactive content, Tooltip for static text
- **From existing popover libraries**: Verify focus management and ARIA implementation
- **From legacy UI libraries**: Audit existing styling dependencies and CSS conflicts
- **From inline event handlers**: Centralize event logic through Popover context system

### Implementation Checklist

#### Core Architecture
- [ ] **Compound component architecture**: Root, Trigger, Content, Arrow, Anchor, Portal, Close components
- [ ] **Context-based state sharing**: Unified state across all components with TypeScript safety
- [ ] **Ref forwarding strategy**: Proper ref composition with asChild pattern support
- [ ] **Event system**: Comprehensive event handling with cleanup and prevention patterns
- [ ] **Hook architecture**: usePopover, usePopoverContext, usePopoverTrigger, usePopoverContent

#### Positioning & Layout
- [ ] **Comprehensive positioning system**: 12 placement options with collision detection
- [ ] **Collision boundary support**: Custom boundary elements and viewport edge detection
- [ ] **Dynamic repositioning**: Scroll and resize listeners with debounced updates
- [ ] **Portal rendering**: Proper z-index and positioning isolation
- [ ] **CSS custom properties**: Transform origin, positioning variables, sizing references

#### Accessibility & UX
- [ ] **Advanced focus management**: Optional focus trapping and restoration with escape routes
- [ ] **ARIA relationship management**: Proper `aria-controls`, `aria-expanded`, `aria-labelledby` implementation
- [ ] **Keyboard accessibility**: Complete keyboard navigation with Tab, Enter, Space, Escape, Arrow keys
- [ ] **Screen reader support**: Proper announcements and state changes
- [ ] **Modal and non-modal modes**: Support for both interaction patterns with focus trapping
- [ ] **Light dismissal patterns**: Click outside, escape key, focus outside with prevention options

#### Developer Experience
- [ ] **TypeScript definitions**: Complete type safety for all component props and refs
- [ ] **Generic component support**: Full TypeScript generic support for polymorphic components
- [ ] **AsChild type inference**: Automatic type inference for `asChild` pattern with element constraints
- [ ] **Polymorphic ref forwarding**: Type-safe ref forwarding for custom element types
- [ ] **Controlled/uncontrolled modes**: Flexible state management patterns
- [ ] **AsChild composition**: Polymorphic rendering with proper ref forwarding
- [ ] **Error boundaries**: Clear error messages for context misuse and invalid configurations
- [ ] **Performance optimization**: Efficient re-rendering and positioning updates with memoization

#### Framework Integration
- [ ] **SSR compatibility**: Hydration-safe with no layout shifts and stable ID generation
- [ ] **React 18 support**: Concurrent features, streaming SSR, and Suspense compatibility
- [ ] **Bundle optimization**: Tree-shakeable exports with zero side effects
- [ ] **Memory management**: Proper cleanup of event listeners and refs

#### Styling & Animation
- [ ] **Data attribute system**: Comprehensive styling hooks via data-* attributes
- [ ] **Animation support**: CSS custom properties for smooth transitions and transform origins
- [ ] **State visualization**: data-entering, data-exiting, data-state for animation hooks
- [ ] **Zero styling opinions**: No CSS imports or visual assumptions

#### Testing & Quality
- [ ] **jest-axe compliance**: Zero accessibility violations across all component combinations
- [ ] **Unit test coverage**: State management, event handling, ARIA attributes, context sharing
- [ ] **Integration testing**: Complex content scenarios, positioning edge cases, multi-popover interactions
- [ ] **Accessibility testing**: Focus management, keyboard navigation, screen reader announcements
- [ ] **Cross-browser testing**: Focus behavior, portal rendering, event handling across browsers
- [ ] **Real device testing**: Touch interactions, virtual keyboards, screen reader validation
- [ ] **Performance testing**: Large content rendering, rapid open/close cycles, memory leak detection

#### Production Readiness
- [ ] **Error handling**: Graceful degradation and fallback behaviors
- [ ] **Edge case coverage**: Portal container removal, dynamic content changes, nested scenarios
- [ ] **Documentation**: Complete API documentation with usage examples
- [ ] **Migration guides**: Clear upgrade paths from existing solutions
- [ ] **Performance benchmarks**: Baseline metrics for positioning calculations and re-renders
- [ ] Positioning calculation: <16ms for complex layouts
- [ ] Re-render optimization: <100 unnecessary renders per 1000 operations
- [ ] Bundle size: Core functionality <5KB gzipped
- [ ] Memory usage: <1MB for 100 concurrent popovers
