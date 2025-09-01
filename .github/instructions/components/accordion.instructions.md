---
applyTo: '**/Accordion/**/*.{ts,tsx}, **/useAccordion.{ts,tsx}'
---

# Accordion Component Instructions - TK Headless

<identity>
You are implementing an accessible, headless Accordion component for TK Headless.
This component MUST follow the slot-based pattern for maximum customization.
MUST adhere to WAI-ARIA Accordion design pattern.
NEVER compromise on accessibility requirements.
NEVER add visual styles - component must remain headless.
</identity>

## Component Overview

The Accordion component is a vertically stacked set of interactive headings that each reveal an associated section of content. It MUST:

- Be completely unstyled (headless)
- Support single or multiple expansion modes
- Handle full keyboard navigation
- Support all ARIA requirements
- Work with assistive technologies
- Follow the slot-based pattern for maximum customization
- Support horizontal/vertical orientation
- Allow controlled and uncontrolled usage

## Component Architecture

### Core Pattern: Full Slot Pattern

```tsx
<Accordion type='single' defaultValue='item-1' collapsible>
  <Accordion.Item value='item-1'>
    <Accordion.Header>
      <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content>
  </Accordion.Item>

  <Accordion.Item value='item-2'>
    <Accordion.Header>
      <Accordion.Trigger>Is it unstyled?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>
      Yes. It's unstyled by default, giving you freedom over the look and feel.
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### Component Structure

```typescript
// Core Components
Accordion                    // Root container with state management
├── Accordion.Item          // Individual accordion panel wrapper
│   ├── Accordion.Header    // Header wrapper (provides heading level)
│   │   └── Accordion.Trigger // Button that controls panel visibility
│   └── Accordion.Content   // Collapsible content panel
```

## API Requirements

### Accordion (Root)

**Required Props:**

- `type: 'single' | 'multiple'` - Expansion mode
- `children: React.ReactNode` - Child components

**Optional Props:**

- `defaultValue?: string | string[]` - Default open items
- `value?: string | string[]` - Controlled value
- `onValueChange?: (value: string | string[]) => void` - Change handler
- `collapsible?: boolean` - Allow all items to close (single mode only)
- `disabled?: boolean` - Disable all items
- `orientation?: 'vertical' | 'horizontal'` - Affects keyboard navigation

### Accordion.Item

**Required Props:**

- `value: string` - Unique identifier
- `children: React.ReactNode` - Header and Content

**Optional Props:**

- `disabled?: boolean` - Disable this item

### Accordion.Header

**Required Props:**

- `children: React.ReactNode` - Typically Accordion.Trigger

**Optional Props:**

- `level?: 1 | 2 | 3 | 4 | 5 | 6` - Heading level (default: 3)

### Accordion.Trigger

**Required Props:**

- `children: React.ReactNode` - Button content

**Optional Props:**

- Standard button props

### Accordion.Content

**Required Props:**

- `children: React.ReactNode` - Panel content

**Optional Props:**

- `forceMount?: boolean` - Keep in DOM when closed
- `transition?: boolean` - Add transition data attributes

## Accessibility Requirements (WAI-ARIA)

### MUST-HAVE ARIA Attributes

**Root:**

- `data-orientation` - vertical/horizontal
- `data-type` - single/multiple

**Item:**

- `data-state` - open/closed
- `data-disabled` - true when disabled

**Header:**

- `role="heading"` or use semantic heading element
- `aria-level` - heading level number

**Trigger:**

- `type="button"`
- `aria-expanded` - true/false based on open state
- `aria-controls` - ID of associated content
- `aria-disabled` - true when disabled

**Content:**

- `role="region"` (only when needed, avoid >6 regions)
- `aria-labelledby` - ID of associated trigger
- `hidden` - true when closed

### Keyboard Navigation (WAI-ARIA Pattern)

| Key                | Action                              |
| ------------------ | ----------------------------------- |
| `Enter` or `Space` | Toggle panel when trigger focused   |
| `ArrowDown`        | Focus next trigger (vertical)       |
| `ArrowUp`          | Focus previous trigger (vertical)   |
| `ArrowRight`       | Focus next trigger (horizontal)     |
| `ArrowLeft`        | Focus previous trigger (horizontal) |
| `Home`             | Focus first trigger                 |
| `End`              | Focus last trigger                  |
| `Tab`              | Normal tab sequence                 |

**Note**: Arrow key behavior automatically respects CSS `direction` property for RTL support. Use CSS logical properties (`inline-start`/`inline-end`) instead of `left`/`right` for proper RTL handling.

## Data Attributes for Styling

### Root Accordion

- `data-tk-accordion`
- `data-orientation="vertical|horizontal"`
- `data-type="single|multiple"`

### Items

- `data-tk-accordion-item`
- `data-state="open|closed"`
- `data-disabled="true"`

### Headers

- `data-tk-accordion-header`
- `data-state="open|closed"`

### Triggers

- `data-tk-accordion-trigger`
- `data-state="open|closed"`
- `data-disabled="true"`

### Content

- `data-tk-accordion-content`
- `data-state="open|closed"`
- `data-open` / `data-closed` (boolean attributes)
- `data-enter` / `data-leave` (when transition=true)

## State Management Rules

### Single Mode

- Only one item can be open at a time
- When `collapsible=false`, at least one item must be open
- When `collapsible=true`, all items can be closed

### Multiple Mode

- Multiple items can be open simultaneously
- Items can be opened/closed independently

### Controlled vs Uncontrolled

- **Uncontrolled**: Use `defaultValue` for initial state
- **Controlled**: Use `value` and `onValueChange` props

## Animation Support

### CSS Custom Properties

Components should set these CSS variables for animation:

- `--tk-accordion-content-height` - Content height in px
- `--tk-accordion-content-width` - Content width in px

### Transition Props

When `transition=true` on Content:

- Add `data-enter` during opening transition
- Add `data-leave` during closing transition
- Add `data-open`/`data-closed` boolean attributes

## RTL and Internationalization

### CSS Logical Properties Approach (Recommended)

```css
/* ✅ GOOD - Use logical properties for RTL support */
[data-tk-accordion-trigger] {
  text-align: start; /* Not left */
  margin-inline-start: 1rem; /* Not margin-left */
  border-inline-end: 1px solid; /* Not border-right */
}

[data-tk-accordion-content] {
  padding-inline: 1rem; /* Not padding-left/right */
}
```

### Browser RTL Detection

```javascript
// Component automatically detects RTL from CSS
const isRTL = getComputedStyle(element).direction === 'rtl';

// Arrow key behavior adapts automatically:
// - ArrowRight moves forward in LTR, backward in RTL
// - ArrowLeft moves backward in LTR, forward in RTL
```

### Why No `dir` Prop?

1. **Headless Philosophy**: Visual concerns handled by CSS
2. **CSS Standards**: Use `direction: rtl` and logical properties
3. **Automatic Detection**: Component reads CSS direction
4. **Maintenance**: One less prop to manage and document

## Implementation Notes

- Arrow keys should move focus between triggers
- Focus should wrap around (first ↔ last)
- Direction automatically respects CSS `direction` property for RTL
- Use CSS logical properties for layout (`inline-start`/`inline-end` instead of `left`/`right`)

### Region Role Usage

- Use `role="region"` carefully on Content
- Avoid for accordions with >6 panels
- Only use when content has meaningful structure

### Animation Considerations

- Support both mounted and unmounted animations
- Provide `forceMount` option for complex animations
- Use data attributes for CSS-based animations

## Usage Examples

### Basic Single Accordion

```tsx
<Accordion type='single' defaultValue='item-1'>
  <Accordion.Item value='item-1'>
    <Accordion.Header>
      <Accordion.Trigger>Section 1</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content>Content 1</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

### Multiple Items

```tsx
<Accordion type='multiple' defaultValue={['item-1', 'item-2']}>
  {/* Multiple items can be open */}
</Accordion>
```

### Controlled

```tsx
const [value, setValue] = useState('item-1');
<Accordion type='single' value={value} onValueChange={setValue}>
  {/* Controlled accordion */}
</Accordion>;
```

### With Transitions

```tsx
<Accordion.Content transition className='data-closed:opacity-0 data-enter:animate-slideDown'>
  Animated content
</Accordion.Content>
```

## Testing Requirements

### Accessibility Tests

- MUST test all ARIA attributes
- MUST test keyboard navigation
- MUST test screen reader announcements
- MUST test focus management

### Interaction Tests

- MUST test single vs multiple modes
- MUST test controlled vs uncontrolled
- MUST test disabled states
- MUST test collapsible behavior

### State Tests

- MUST test proper state transitions
- MUST test value change events
- MUST test default values

## Common Mistakes to AVOID

1. ❌ **Missing proper heading structure**
   - Always wrap Trigger in Header with appropriate level

2. ❌ **Incorrect ARIA relationships**
   - Ensure aria-controls and aria-labelledby are properly connected

3. ❌ **Not preventing default on Space key**
   - Always prevent default to avoid page scroll

4. ❌ **Using region role excessively**
   - Avoid region for accordions with many panels (>6)

5. ❌ **Inconsistent keyboard navigation**
   - Implement full arrow key navigation per orientation

<reminders>
REMEMBER: Accessibility is NOT optional for TK Headless components.
REMEMBER: ALWAYS follow WAI-ARIA Accordion pattern.
REMEMBER: ALWAYS test with keyboard navigation.
REMEMBER: ALWAYS test with screen readers.
REMEMBER: Proper heading structure is crucial for navigation.
REMEMBER: Use data attributes for styling, not CSS classes.
REMEMBER: Support both controlled and uncontrolled usage.
REMEMBER: Animation should use CSS custom properties for flexibility.
</reminders>
