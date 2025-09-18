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
- Badge indicators (accessibility, tree-shakeable, etc.)
 
### 2. Component Description
- Detailed explanation of what the component does
- Use cases and scenarios where it's most effective
- Key behavioral characteristics
- Design principles it follows
 
### 3. Installation
- Package installation commands
- Import statements
- Basic setup requirements
- Any peer dependency notes
 
### 4. Live Demo
- Single interactive example using the `LiveCode` component
- Shows the most basic, minimal working implementation
- Demonstrates core functionality only
- Basic inline styles allowed for demonstration purposes (borders, padding for visibility)
- Include accessibility features demonstration

### 5. Code Examples
- Multiple progressive examples without `LiveCode` component
- Static code blocks using standard markdown syntax
- Must be unstyled (headless) - no visual styling opinions
- Include accessibility features demonstration
- Progressive examples from basic to advanced
- Use standard markdown code blocks with TypeScript syntax highlighting

### 6. Features List
- Bulleted list of key capabilities
- Accessibility features highlighted
- Keyboard interaction support
- ARIA compliance notes
 
### 7. Anatomy Diagram
- Visual component tree structure
- Shows all compound component parts
- Hierarchical relationship diagram
- Data flow indicators where relevant
 
### 8. API Reference Tables
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
- **Functional**: Real-world scenarios, not toy examples
- **Accessible**: Demonstrate ARIA patterns and keyboard navigation
- **Progressive**: Simple to complex examples
- **No LiveCode**: Static examples only, no interactive components

### Table Standards
- **Props Table Columns**: Name, Type, Default, Description
- **Events Table Columns**: Name, Parameters, Description, When Triggered
- **Methods Table Columns**: Name, Parameters, Returns, Description
- **ARIA Table Columns**: Attribute, Value, Purpose, Applied To
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
- All Glide components (automatically imported)

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
## Code Examples Integration

### Code Examples Usage Pattern

#### Standard Markdown Code Blocks
Use triple backtick syntax for all static code examples:

```tsx
function codeExample() {
  return (
    <ComponentName.Root>
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

### Code Examples Best Practices

#### DO for Code Examples
- ✅ Use TypeScript syntax highlighting (`tsx`)
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
sidebar_position: [number]
title: [ComponentName]
description: [Brief description for SEO]
---

import React from 'react';
import LiveCode from '../../src/components/LiveCode';
 
# [ComponentName]
 
[Brief one-sentence description]
 
![Accessibility Badge] ![Tree-shakeable Badge] ![TypeScript Badge]
 
## Description
 
[Detailed component description, use cases, and design principles]
 
## Installation
 
```bash
pnpm add @turkishtechnology/glide
npm install @turkishtechnology/glide
yarn add @turkishtechnology/glide
```
 
```tsx
import { [ComponentName] } from '@turkishtechnology/glide'
```
 
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
- ✅ Full keyboard navigation
- ✅ ARIA compliance
- ✅ [Additional features...]
 
## Anatomy
 
[Component hierarchy diagram]
 
```tsx
<ComponentName.Root>
  <ComponentName.Trigger />
  <ComponentName.Content>
    <ComponentName.Item />
  </ComponentName.Content>
</ComponentName.Root>
```

## Code Examples

[Generate sections only for features that actually exist]

## API Reference

### ComponentName.Root

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

**ARIA Attributes**

| Attribute | Value | Purpose | Applied To |
|-----------|-------|---------|------------|
| `aria-expanded` | `boolean` | Indicates expansion state | Root element |
| `role` | `"group"` | Groups related elements | Root element |

### ComponentName.Trigger

**Props**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Trigger content |
| `asChild?` | `boolean` | `false` | Render as child element |
| `disabled?` | `boolean` | `false` | Disables trigger |

**Events**

| Name | Parameters | Description | When Triggered |
|------|------------|-------------|----------------|
| `onClick` | `(event: MouseEvent)` | Trigger clicked | Mouse click |
| `onKeyDown` | `(event: KeyboardEvent)` | Key pressed | Keyboard interaction |

**ARIA Attributes**

| Attribute | Value | Purpose | Applied To |
|-----------|-------|---------|------------|
| `aria-expanded` | `boolean` | Indicates if content is expanded | Trigger element |
| `aria-controls` | `string` | References controlled content | Trigger element |


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
- **ARIA Table**: Accessibility attributes

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
- [ ] ARIA table with accessibility attributes
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
- **Complete tables**: Each part needs all 3 tables
- **Use real implementation**: Only document what exists
- **Start simple**: Root first, then child parts
- **End with keyboard**: Global keyboard interactions as final section

### Accessibility Documentation
- Document ARIA roles and properties for each compound part
- Document ARIA roles and properties
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