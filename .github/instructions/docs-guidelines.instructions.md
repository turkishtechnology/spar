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
- **Keyboard Table Columns**: Key, Action, Context, Notes
- **ARIA Table Columns**: Attribute, Value, Purpose, Applied To
- **Clear Types**: Use exact TypeScript notation (e.g., `string | number | undefined`)
- **Required Indicators**: Use TypeScript `?` syntax in Name column (`prop?` for optional)
- **Default Values**: Show actual default values, use `undefined` when applicable

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
  // Add new Glide components here
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
import CodeBlock from '@theme/CodeBlock';
 
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

**EVERY compound component part must have its own dedicated section with complete documentation:**

[Document only actual compound parts and their real props/events/methods]

```

## Documentation Requirements
 
### MUST Include FOR EACH COMPOUND PART
- **Complete Props Table**: All props with exact TypeScript types
- **Complete Events Table**: All event handlers with parameters
- **Complete Keyboard Table**: All keyboard interactions for that part
- **Complete ARIA Table**: All accessibility attributes for that part
- **Individual Sections**: Each compound part gets its own dedicated section

### MUST Include
- All compound component parts documented
- Real TypeScript types from component interfaces
- Actual accessibility implementation
- Real keyboard navigation that exists
- Verified ARIA attributes that are applied
- Working code examples using actual component features
 
### MUST NOT Include
- Framework-specific styling solutions
- Theme or design system references
- Marketing language or sales copy
 
### Quality Checklist FOR EACH COMPOUND PART
- [ ] Props table with all actual props and exact TypeScript types
- [ ] Events table with all actual event handlers and parameters  
- [ ] Keyboard interactions table with all actual keyboard behaviors
- [ ] ARIA attributes table with all actual accessibility attributes
- [ ] Required props clearly marked with TypeScript `?` syntax
- [ ] Default values showing actual defaults from implementation
- [ ] Complete documentation for every compound part that exists

### Quality Checklist
- [ ] Accessibility features explained
- [ ] Code examples are functional and headless
- [ ] Installation instructions are accurate
- [ ] Component anatomy diagram is clear

## Documentation Workflow
1. **Component Analysis**: Examine actual TypeScript interfaces and implementation
2. **Create Base Structure**: Use template with actual component details
3. **Feature Documentation**: List only behavioral capabilities that exist
4. **LiveCode Demo**: Single example using actual component API
5. **Code Examples**: Progressive examples using actual component features
6. **API Documentation**: Generate complete tables from TypeScript types
7. **Accessibility Audit**: Document only implemented a11y features
8. **Review & Validate**: Ensure examples work and types are accurate

## Special Considerations
 
### Compound Components Documentation Strategy
- **Analyze component structure**: Identify all compound parts (Root, Trigger, Content, Item, etc.)
- **Document each part separately**: Every compound part gets its own section
- **Complete table coverage**: Each part needs Props, Events, Keyboard, ARIA tables
- **Real implementation**: Only document compound parts and features that actually exist
- **Progressive complexity**: Start with Root, then child parts in logical order

 
### Accessibility Documentation
- Always include keyboard interaction table
- Document ARIA roles and properties
- Explain screen reader behavior
- Show focus management examples
 
### TypeScript Integration
- Use actual TypeScript interfaces in documentation
- Show generic type usage where applicable
- Document complex type patterns
- Include type-only imports when relevant
 
## Integration with Docusaurus
 
- Use proper frontmatter for SEO
- Include sidebar positioning
- Add meta descriptions
- Use proper heading hierarchy (H1 → H6)
- Include code block language hints
- Use admonitions for important notes
 
Remember: Documentation should empower developers to implement accessible, headless components confidently without imposing design opinions.
 