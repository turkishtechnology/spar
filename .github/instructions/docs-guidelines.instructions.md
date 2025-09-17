---
applyTo: 'docs/Components/*.mdx'
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
- Interactive live example using the `LiveCode` component
- Minimal working implementation showing core functionality
- Must be unstyled (headless) - no visual styling opinions
- Include accessibility features demonstration
- Progressive examples from basic to advanced
 
### 5. Features List
- Bulleted list of key capabilities
- Accessibility features highlighted
- Keyboard interaction support
- ARIA compliance notes
 
### 6. Anatomy Diagram
- Visual component tree structure
- Shows all compound component parts
- Hierarchical relationship diagram
- Data flow indicators where relevant
 
### 7. Core Features & Code Examples
- **Basic Usage**: Minimal implementation with LiveCode
- **Advanced Usage**: Complex scenarios
- **Accessibility**: ARIA patterns and keyboard navigation
- **Customization**: Render props, compound patterns
- **Integration**: Common use cases with other components
 
### 8. API Reference Tables
- **Root Component Props Table**
- **Child Component Props Tables** (for each compound part)
- **Event Handlers Table**
- **Methods/Refs Table** (if applicable)
- **Keyboard Interactions Table** (accessibility)
- **CSS Custom Properties** (if any styling hooks exist)
 
## Content Rules
 
### Writing Style
- **Developer-First**: Technical accuracy over marketing copy
- **Concise**: Clear, scannable content
- **Action-Oriented**: Focus on what developers can do
- **Inclusive**: Accessibility-first language
 
### Code Examples
- **TypeScript**: All examples use TypeScript
- **Headless**: No styling in examples
- **Functional**: Real-world scenarios, not toy examples
- **Accessible**: Demonstrate ARIA patterns and keyboard navigation
- **Progressive**: Simple to complex examples
- **Interactive**: Use LiveCode component for all executable examples

 
### Table Standards
- **Props Table Columns**: Name, Type, Default, Required, Description
- **Events Table Columns**: Name, Parameters, Description, When Triggered
- **Methods Table Columns**: Name, Parameters, Returns, Description
- **Keyboard Table Columns**: Key, Action, Context, Notes
- **ARIA Table Columns**: Attribute, Value, Purpose, Applied To
- **Clear Types**: Use exact TypeScript notation (e.g., `string | number | undefined`)
- **Required Indicators**: Use ✅ for required, ❌ for optional
- **Default Values**: Show actual default values, use `undefined` when applicable
 
## LiveCode Component Integration
 
### Import Requirements
Always import the LiveCode component at the top of your MDX documentation:

```tsx
import React from 'react';
import LiveCode from '../../src/components/LiveCode';
```

### LiveCode Props
- `code`: String containing the example code to execute
- `title`: Title for the collapsible code section (default: "Show Code")
- `defaultCollapsed`: Whether code editor starts collapsed (default: true)
- `editorHidden`: Hide the code editor completely (default: false)

### LiveCode Usage Patterns

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

#### Advanced Example with State
```tsx
<LiveCode 
  title="Advanced Implementation"
  defaultCollapsed={false}
  code={`function AdvancedExample() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <ComponentName.Root open={isOpen} onOpenChange={setIsOpen}>
      <ComponentName.Trigger>
        {isOpen ? 'Close' : 'Open'}
      </ComponentName.Trigger>
      <ComponentName.Content>
        <ComponentName.Item>Item 1</ComponentName.Item>
        <ComponentName.Item>Item 2</ComponentName.Item>
      </ComponentName.Content>
    </ComponentName.Root>
  );
}`}
/>
```

#### Accessibility Demo
```tsx
<LiveCode 
  title="Accessibility Features"
  code={`function A11yExample() {
  return (
    <ComponentName.Root>
      <ComponentName.Trigger 
        aria-label="Open menu with 3 options"
      >
        Menu
      </ComponentName.Trigger>
      <ComponentName.Content role="menu">
        <ComponentName.Item role="menuitem">
          Option 1
        </ComponentName.Item>
        <ComponentName.Item role="menuitem">
          Option 2
        </ComponentName.Item>
      </ComponentName.Content>
    </ComponentName.Root>
  );
}`}
/>
```

### LiveCode Best Practices

#### DO
- ✅ Keep examples functional and behavior-focused
- ✅ Show real component interactions (state changes, events)
- ✅ Demonstrate accessibility features
- ✅ Use meaningful variable names
- ✅ Include keyboard interaction examples
- ✅ Progressive complexity (basic → advanced)
- ✅ Focus on headless behavior only

#### DON'T
- ❌ Add any CSS styling or visual opinions
- ❌ Include theme or design system references
- ❌ Use external styling libraries (Tailwind, styled-components)
- ❌ Create overly complex examples for basic usage
- ❌ Include non-functional or toy examples
- ❌ Add visual styling even with inline styles

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

### LiveCode Error Handling
The LiveCode component automatically displays errors in the preview area. Common error patterns:

- **Import Errors**: Component not in scope
- **Syntax Errors**: Invalid JavaScript/JSX
- **Runtime Errors**: Component crashes during execution
- **Type Errors**: TypeScript compilation failures

### LiveCode Styling Rules
The LiveCode component automatically:
- Renders examples in a bordered preview area
- Provides collapsible code editor
- Shows errors in red text
- Maintains clean, minimal presentation
- No custom styling should be added to examples

## File Naming & Structure
 
```
docs/Components/{ComponentName}.md
```
 
- Use PascalCase for component names
- Match the actual component name exactly
- Place in `/docs/Components/` directory
 
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
 
## Examples
 
### Basic Usage
 
[Simple, minimal example]
 
### Advanced Usage
 
[Complex scenario examples]
 
### Accessibility Features
 
[Demonstrate ARIA patterns and keyboard navigation]
 
## API Reference
 
### ComponentName.Root
 
[Props table]
 
### ComponentName.Trigger
 
[Props table]
 
### ComponentName.Content
 
[Props table]
 
### Events
 
[Events table]
 
### Methods
 
[Methods table if applicable]
```

## Documentation Requirements
 
### MUST Include
- All compound component parts documented
- Complete TypeScript types in tables
- Accessibility implementation details
- Keyboard navigation instructions
- ARIA attributes explanation
- Real-world code examples using LiveCode component
- Installation and import instructions
 
### MUST NOT Include
- Styling examples or CSS
- Visual design opinions
- Framework-specific styling solutions
- Theme or design system references
- Marketing language or sales copy
 
### Quality Checklist
- [ ] All props documented with correct TypeScript types
- [ ] Required props clearly marked
- [ ] Event handlers documented with parameters
- [ ] Accessibility features explained
- [ ] Code examples are functional and headless
- [ ] Installation instructions are accurate
- [ ] Component anatomy diagram is clear
- [ ] Live demos work without styling dependencies
- [ ] Keyboard interactions table is complete
 
## Documentation Workflow
 
1. **Create Base Structure**: Use the template above
2. **Component Analysis**: Examine the component's TypeScript interface
3. **Feature Documentation**: List all behavioral capabilities
4. **LiveCode Examples**: Create progressive examples using the LiveCode component
5. **API Documentation**: Generate complete tables from TypeScript types
6. **Accessibility Audit**: Document all a11y features and patterns
7. **Review & Validate**: Ensure examples work and types are accurate
 
## Special Considerations
 
### Compound Components
- Document each part separately
- Show hierarchical relationships
- Explain data flow between parts
- Include composition examples
 
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
 