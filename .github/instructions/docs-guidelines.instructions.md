---
applyTo: 'apps/docs/docs/Components/*.mdx'
---

# Documentation Guidelines
 
## Context
 
You're creating documentation pages for headless React components in a Docusaurus-powered documentation site. Focus on comprehensive, developer-friendly documentation that showcases component capabilities without visual styling opinions.
 
## Documentation Structure
 
Every component documentation page MUST follow this exact structure:
 
### 1. Component Name & Brief Description
- Clear, concise component title
- One-sentence description of the component's purpose
 
### 2. Live Demo
- Single interactive example using the `LiveCode` component
- Shows the most basic, minimal working implementation
- Demonstrates core functionality only
- Basic inline styles allowed for demonstration purposes (borders, padding for visibility)
- Include accessibility features demonstration

### 3. Features List
- Bulleted list of component specific actual capabilities

#### DO
- ✅ Functional features

#### DON'T
- ❌ Keyboard navigation
- ❌ Accessibility features
- ❌ Aria and Data attributes
- ❌ Zero styling and styling hooks
- ❌ Compound component

### 4. Installation
- Import statements

### 5. Anatomy Viewer
- Interactive component anatomy using `AnatomyViewer` component
- Shows all compound component parts with hover highlighting
- Parts list with descriptions
- Live demo with `data-spar-part` attributes
- Data flow explanation after the viewer

### 6. Code Examples
- Multiple progressive examples without `LiveCode` component
- Static code blocks using standard markdown syntax
- Must be unstyled (headless) - no visual styling opinions
- Include accessibility features demonstration
- Progressive examples from basic to advanced
- Use standard markdown code blocks with TypeScript syntax highlighting

### 7. API Reference Tables
- **Root Component Props Table**
- **Child Component Props Tables** (for each compound part)
- **Event Handlers Table**
- **Methods/Refs Table** (if applicable)
- **Keyboard Interactions Table** (accessibility)
 
## Content Rules

### Writing Style
- **Developer-First**: Technical accuracy over marketing copy
- **Concise**: Clear, scannable content
- **Action-Oriented**: Focus on what developers can do
- **Inclusive**: Accessibility-first language

### Live Demo Guidelines
- **Single Example Only**: One basic interactive example using LiveCode
- **Core Functionality**: Demonstrates primary component behavior
- **Basic Inline Styles**: Minimal styles allowed for visibility
- **Accessibility Demo**: Show one key accessibility feature
- **Minimal Implementation**: Simplest working example possible

### Code Examples Guidelines
- **TypeScript**: All examples use TypeScript syntax
- **Headless**: Completely unstyled - no visual styling opinions
- **Standard Markdown**: Use triple backtick code blocks only
- **Line Highlighting**: Use Docusaurus syntax to highlight important lines (e.g., `tsx {1,4-6,11}`)
- **Functional**: Real-world scenarios, not toy examples
- **Accessible**: Demonstrate ARIA patterns and keyboard navigation
- **Progressive**: Simple to complex examples
- **No LiveCode**: Static examples only, no interactive components
- **Description**: Detailed code example explanation

### Table Standards
- **Props Table Columns**: Name, Type, Default, Description
- **Events Table Columns**: Name, Parameters, Description, When Triggered
- **Methods Table Columns**: Name, Parameters, Returns, Description
- **HTML Attributes Table Columns**: Attribute, Value, Purpose
- **Clear Types**: Use exact TypeScript notation (e.g., `string | number | undefined`)
- **Required Indicators**: Use TypeScript `?` syntax in Name column (`prop?` for optional)
- **Default Values**: Show actual default values, use `undefined` when applicable
- **Keyboard Table Columns**: Key, Action, Context, Notes

## LiveCode Component Integration
 
### LiveCode Props
- `code`: String containing the example code to execute
- `title`: Title for the collapsible code section (default: "Show Code")

### LiveCode Usage Pattern

#### Basic Example
```tsx
<LiveCode 
  code={`function BasicExample() {
  return (
    <ComponentName.Root>
      <ComponentName.Trigger>Click me</ComponentName.Trigger>
    </ComponentName.Root>
  );
}`}
/>
```

### LiveCode Best Practices
#### DO
- ✅ Keep the example minimal and focused on core functionality
- ✅ Show real component interactions (state changes, events)
- ✅ Use basic inline styles only for visibility (borders, padding)
- ✅ Demonstrate one key accessibility feature
- ✅ Use meaningful but simple content
- ✅ Show the most basic working implementation

#### DON'T
- ❌ Show multiple variations or complex scenarios
- ❌ Include advanced features or customization
- ❌ Add complex styling or design opinions
- ❌ Create multiple LiveCode examples
- ❌ Include framework-specific patterns
- ❌ Include theme or design system references
- ❌ Use external styling libraries (Tailwind, styled-components)

### Available Scope in LiveCode
The LiveCode component provides these React utilities in scope:
- `React` - Full React library
- `useState` - React.useState hook
- `useEffect` - React.useEffect hook
- All Spar components (automatically imported)

### LiveCode Component Integration
To add new components to LiveCode scope, update the scope object in `apps/docs/src/components/LiveCode.tsx`:

```tsx
const scope = {
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  Button,
  Input,
  Popover,
  // etc.
};
```

## AnatomyViewer Component Integration

### AnatomyViewer Props
- `parts`: Array of anatomy parts with name, label, and optional description
- `children`: Demo component with data-spar-part attributes

**IMPORTANT**: Use the same demo code from LiveCode section, only add `data-spar-part` attributes to each compound part.

### AnatomyViewer Usage Pattern

```tsx
<AnatomyViewer
  parts={[
    { name: 'root', label: 'Root', description: 'Container managing state' },
    { name: 'trigger', label: 'Trigger', description: 'Interactive element' },
    { name: 'content', label: 'Content', description: 'Content container' },
  ]}
>
  <ComponentName.Root data-spar-part="root">
    <ComponentName.Trigger
      data-spar-part="trigger"
      style={{ padding: '8px 16px', border: '1px solid #ccc' }}
    >
      Trigger
    </ComponentName.Trigger>
    <ComponentName.Content
      data-spar-part="content"
      style={{ border: '1px solid #ccc', padding: '8px' }}
    >
      Content
    </ComponentName.Content>
  </ComponentName.Root>
</AnatomyViewer>
```

### AnatomyViewer Best Practices

#### DO
- ✅ Use the exact same demo code from LiveCode section
- ✅ Add data-spar-part attribute to every compound part
- ✅ Use basic inline styles for visibility (same as LiveCode)
- ✅ Include all compound parts in the parts array
- ✅ Provide clear, concise descriptions for each part
- ✅ Follow with a Structure code block showing the hierarchy
- ✅ Add Data Flow explanation after the viewer
- ✅ **Wrap all text content in JSX expressions** - Use `{' text '}` syntax to prevent Docusaurus from automatically wrapping text in `<p>` tags

#### DON'T
- ❌ Create a different demo than LiveCode
- ❌ Skip any compound parts
- ❌ Use complex or styled demos
- ❌ Forget data-spar-part attributes
- ❌ Omit descriptions from parts array
- ❌ Include non-interactive or non-compound components
- ❌ Write plain text directly in component children - Always use JSX expression syntax `{' ... '}` to avoid unwanted paragraph tags

## Code Examples Integration

### Code Examples Usage Pattern

#### Standard Markdown Code Blocks
Use triple backtick syntax for all static code examples. Use Docusaurus line highlighting to emphasize important lines:

```tsx {2,4-10}
function codeExample() {
  const [open, setOpen] = React.useState(false);
  
  return (
    <ComponentName.Root open={open} onOpenChange={setOpen}>
      <ComponentName.Trigger>
        Click me
      </ComponentName.Trigger>
      <ComponentName.Content>
        Basic content
      </ComponentName.Content>
    </ComponentName.Root>
  );
}
```

**Line Highlighting Syntax:**
- Highlight specific lines: `tsx {1,3,5}` (highlights lines 1, 3, and 5)
- Highlight line ranges: `tsx {4-8}` (highlights lines 4 through 8)
- Combine both: `tsx {1,4-6,11}` (highlights line 1, lines 4-6, and line 11)
- Use to emphasize key parts like state management, event handlers, or accessibility props

### Code Examples Best Practices

#### DO for Code Examples
- ✅ Use TypeScript syntax highlighting (`tsx`)
- ✅ Use line highlighting to emphasize key code sections (e.g. `tsx {1,4-6,11}`)
- ✅ Show progressive complexity across examples
- ✅ Include comprehensive accessibility patterns
- ✅ Demonstrate real-world usage scenarios
- ✅ Keep examples functional and behavior-focused
- ✅ Show state management patterns
- ✅ Include keyboard interaction examples
- ✅ Add meaningful variable names and comments
- ✅ Demonstrate error states and loading states

#### DON'T for Code Examples
- ❌ Add any styling (completely headless)
- ❌ Include LiveCode component (static only)
- ❌ Use external styling libraries
- ❌ Add visual design opinions
- ❌ Include theme or design system references
- ❌ Create non-functional or toy examples
- ❌ Skip error handling in complex examples
- ❌ Ignore accessibility patterns

## File Naming & Structure

```
apps/docs/docs/Components/{ComponentName}.mdx
```
 
- Use PascalCase for component names
- Match the actual component name exactly
- Place in `/apps/docs/docs/Components/` directory
- Use `.mdx` extension for LiveCode integration
 
## Template Structure
 
```markdown
---
title: [ComponentName]
description: [Brief description for SEO]
---

import React from 'react';
import LiveCode from '../../src/components/LiveCode';
import AnatomyViewer from '../../src/components/AnatomyViewer/AnatomyViewer';
import { [ComponentName] } from '@turkish-technology/spar';
 
# [ComponentName]
 
[Brief one-sentence description]
 
[Add three badges as specified in section 1]
 
## Live Demo
 
<LiveCode 
  code={`function BasicExample() {
  return (
    <ComponentName.Root>
      <ComponentName.Trigger>
        Basic Example
      </ComponentName.Trigger>
      <ComponentName.Content>
        Component content here
      </ComponentName.Content>
    </ComponentName.Root>
  );
}`}
/>
 
## Features
 
- ✅ [Feature 1]
- ✅ [Feature 2]
- ✅ [Additional Component Spesification features...]

## Installation
 
```tsx
import { [ComponentName] } from '@turkish-technology/spar'
```
 
## Anatomy

The [ComponentName] component is built as a compound component with multiple parts:

<AnatomyViewer
  parts={[
    { name: 'root', label: 'Root', description: 'Container managing state' },
    { name: 'trigger', label: 'Trigger', description: 'Interactive trigger element' },
    { name: 'content', label: 'Content', description: 'Content container' },
    // Add all compound parts with their descriptions
  ]}
>
  <ComponentName.Root data-spar-part="root">
    <ComponentName.Trigger
      data-spar-part="trigger"
      style={{
        padding: '8px 16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        background: 'white',
        cursor: 'pointer',
      }}
    >
      Trigger Text
    </ComponentName.Trigger>
    <ComponentName.Content
      data-spar-part="content"
      style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        background: 'white',
        padding: '8px',
      }}
    >
      Content here
    </ComponentName.Content>
  </ComponentName.Root>
</AnatomyViewer>

### Structure

```tsx
<ComponentName.Root>
  <ComponentName.Trigger />
  <ComponentName.Content>
    <ComponentName.Item />
  </ComponentName.Content>
</ComponentName.Root>
```

**Data Flow:**
- `ComponentName.Root` manages state and provides context
- `ComponentName.Trigger` controls visibility and manages focus
- `ComponentName.Content` handles positioning and behavior
- [Add relevant data flow explanation]

## Code Examples

[Detailed code example explanation]

[Generate sections only for features that actually exist]

## API Reference

### ComponentName.Root

[Detailed compound explanation]

**Props**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Root content |
| `open?` | `boolean` | `false` | Controls open state |
| `onOpenChange?` | `(open: boolean) => void` | `undefined` | State change handler |
| `defaultOpen?` | `boolean` | `false` | Initial open state |

**Events**

| Name | Parameters | Description | When Triggered |
|------|------------|-------------|----------------|
| `onOpenChange` | `(open: boolean)` | Open state changes | User interaction or programmatic change |

**HTML Attributes**

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-state` | `"open" \| "closed"` | Indicates expansion state |

### ComponentName.Trigger

[Detailed compound explanation]

**Props**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode \| ((state: TriggerRenderProps) => ReactNode)` | - | Trigger content or render function for render props pattern |
| `disabled?` | `boolean` | `false` | Disables trigger |

**TriggerRenderProps**

| Name | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Whether the component is currently open |
| `disabled` | `boolean` | Whether the trigger is disabled |
| `open` | `() => void` | Function to open the component |
| `close` | `() => void` | Function to close the component |
| `toggle` | `() => void` | Function to toggle the open/closed state |

**Events**

| Name | Parameters | Description | When Triggered |
|------|------------|-------------|----------------|
| `onClick` | `(event: MouseEvent)` | Trigger clicked | Mouse click |
| `onKeyDown` | `(event: KeyboardEvent)` | Key pressed | Keyboard interaction |

**HTML Attributes**

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `data-state` | `"open" \| "closed"` | Indicates expansion state |
| `data-disabled` | `""` | Present when disabled |


[Continue this pattern for EVERY compound part that exists]

## Keyboard Interactions

Complete keyboard behavior for the entire component:

| Key | Action | Context | Notes |
|-----|--------|---------|-------|
| `Tab` | Navigate | Always | Moves focus through interactive elements |
| `Shift + Tab` | Navigate backward | Always | Moves focus backward through elements |
| `Enter` | Activate | Focusable elements | Triggers primary action |
| `Space` | Activate | Buttons/toggles | Alternative activation method |
| `Escape` | Close/Cancel | Open states | Closes overlays, returns to trigger |
| `ArrowDown` | Navigate down | Lists/menus | Moves to next item |
| `ArrowUp` | Navigate up | Lists/menus | Moves to previous item |
| `Home` | First item | Lists/menus | Moves to first item |
| `End` | Last item | Lists/menus | Moves to last item |

**Note**: Only document keyboard interactions that are actually implemented in the component.
```

## Documentation Requirements

### FOR EACH COMPOUND PART - Include These 3 Tables
- **Props Table**: All props with TypeScript types
- **Events Table**: Event handlers with parameters  
- **HTML Attributes Table**: Data attributes for styling hooks

### MUST Include
- All compound parts documented separately
- Real TypeScript types from component files
- Actual accessibility features that exist
- Real keyboard navigation
- Working code examples using actual component

### MUST NOT Include
- Styling examples or CSS
- Design system references
- Marketing language

### Before Writing Documentation
- [ ] Analyze component TypeScript interfaces
- [ ] Identify all compound parts
- [ ] Verify accessibility implementation
- [ ] Test examples with real component

### Quality Check FOR EACH COMPOUND PART
- [ ] Props table complete with TypeScript types
- [ ] Events table with all handlers
- [ ] HTML Attributes table with data attributes
- [ ] Optional props marked with `?` syntax
- [ ] Real default values shown

### Final Quality Check
- [ ] Accessibility features explained
- [ ] Code examples work and are headless
- [ ] Installation instructions correct
- [ ] Component diagram clear
- [ ] Global keyboard interactions documented

## Documentation Steps
1. **Analyze Component** - Check TypeScript files and implementation
2. **Create Structure** - Use template with real component details
3. **Document Features** - Only what actually exists
4. **Add LiveCode Demo** - Single working example
5. **Write Code Examples** - Progressive examples using real API
6. **Create API Tables** - From actual TypeScript types
7. **Document Accessibility** - Only implemented features
8. **Add Global Keyboard Interactions** - Complete keyboard behavior documentation
9. **Review & Test** - Ensure examples work

## Compound Components Strategy
- **Find all parts**: Root, Trigger, Content, Item, etc.
- **Document each separately**: Every part gets own section
- **Complete tables**: Each part needs Props, Events, and HTML Attributes tables
- **Use real implementation**: Only document what exists
- **Start simple**: Root first, then child parts
- **End with keyboard**: Global keyboard interactions as final section

### Accessibility Documentation
- Document keyboard interactions
- Explain screen reader behavior
- Show focus management

### TypeScript Documentation
- Use actual interfaces from component files
- Show generic types when applicable
- Document complex type patterns
- Include type-only imports

## Docusaurus Integration
- Use proper frontmatter for SEO
- Include sidebar positioning
- Add meta descriptions
- Use heading hierarchy (H1 → H6)
- Add code block language hints

**Remember: Document only what actually exists. No styling. Help developers build accessible components.**
