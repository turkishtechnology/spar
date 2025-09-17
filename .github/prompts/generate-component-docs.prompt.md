---
mode: agent
model: Claude Opus 4.1
description: Generate comprehensive documentation for Glide components
---
 
# Documentation Generator
 
Generate documentation for **${input:ComponentName:Button}** component.
 
## Prerequisites
 
1. **Component must already exist** - Verify component implementation is complete
2. **Tests completed** - Component should have full test coverage
3. **Types exported** - All TypeScript interfaces must be properly exported
4. **Accessibility verified** - Component should pass all a11y tests
5. **LiveCode scope updated** - Component added to LiveCode.tsx scope if new

ALWAYS follow instructions in [Documentation Guidelines](../instructions/docs-guidelines.instructions.md).
 
## Documentation Sections Required
 
1. **Component Name & Brief Description** - Title, one-sentence purpose, badges
2. **Component Description** - Detailed explanation, use cases, design principles
3. **Installation** - Package commands (pnpm/npm/yarn), imports, peer dependencies
4. **Live Demo** - Interactive LiveCode examples
5. **Features List** - Key capabilities, accessibility features, keyboard support, ARIA compliance
6. **Anatomy Diagram** - Component tree structure, compound parts, hierarchical relationships
7. **Core Features & Code Examples** - Progressive LiveCode examples
8. **API Reference Tables** - Complete props, events, methods, keyboard interactions, ARIA attributes
 
## Requirements
 
- **Headless Focus**: No styling examples, zero visual opinions
- **TypeScript First**: All examples use TypeScript with proper types
- **Accessibility Detailed**: Document ARIA patterns, keyboard navigation
- **LiveCode Integration**: Use LiveCode component for all interactive examples
- **Progressive Examples**: Simple → intermediate → advanced → accessibility demos
- **Complete API**: All props, events, methods, keyboard interactions documented with exact TypeScript types
 
## File Location
 
Create documentation at: `apps/docs/docs/Components/${ComponentName}.mdx`

**Important**: Use `.mdx` extension for proper LiveCode component integration.
 
## Content Standards
 
- **MDX Format**: Use `.mdx` extension with proper React imports for LiveCode
- **Docusaurus Frontmatter**: Include SEO metadata, sidebar position, title, description
- **LiveCode Examples**: All interactive examples must use LiveCode component
- **TypeScript Notation**: Use exact TypeScript syntax for all type references
- **Table Standards**: Name, Type, Default, Required, Description columns
- **Keyboard Interactions**: Complete table with Key, Action, Context, Notes
- **ARIA Documentation**: Attribute, Value, Purpose, Applied To columns
 
## Success Criteria
 
- **Structure Compliance**: Documentation follows 8-section structure exactly
- **Compound Documentation**: All compound component parts documented separately
- **LiveCode Functionality**: All examples render correctly in LiveCode component
- **Headless Implementation**: Zero styling opinions, pure behavioral focus
- **API Completeness**: All props, events, methods with exact TypeScript types
- **Accessibility Excellence**: Full ARIA implementation, keyboard navigation
- **Installation Accuracy**: All package managers (pnpm/npm/yarn) work correctly
- **Progressive Complexity**: Examples build from simple to advanced logically
 
## Quality Checklist
 
### Content Quality
- [ ] Component name and description clear and concise
- [ ] Installation instructions complete for all package managers (pnpm, npm, yarn)
- [ ] MDX file includes proper React and LiveCode imports
- [ ] Frontmatter includes SEO metadata and sidebar positioning

### LiveCode Integration
- [ ] All interactive examples use LiveCode component
- [ ] LiveCode examples render without errors
- [ ] No styling or visual opinions in any examples
- [ ] Progressive complexity: basic → intermediate → advanced → accessibility
- [ ] Component is added to LiveCode scope if new component

### API Documentation
- [ ] All compound component parts documented separately
- [ ] Props tables include: Name, Type, Default, Required, Description
- [ ] Event tables include: Name, Parameters, Description, When Triggered
- [ ] TypeScript types are exact and match implementation

### Accessibility Documentation
- [ ] Keyboard interactions table complete (Key, Action, Context, Notes)
- [ ] ARIA attributes table complete (Attribute, Value, Purpose, Applied To)

### Code Examples
- [ ] All examples are functional and demonstrate real use cases
- [ ] TypeScript syntax is correct and compiles
- [ ] Examples show proper error handling where applicable
- [ ] State management patterns demonstrated correctly
- [ ] Event handling examples are comprehensive

### Technical Accuracy
- [ ] All imports and exports are correct
- [ ] Component API matches actual implementation
- [ ] Version compatibility clearly stated
- [ ] Performance implications documented
- [ ] Bundle size impact noted

## LiveCode Implementation Guidelines

### Required Import Structure
```tsx
import React from 'react';
import LiveCode from '../../src/components/LiveCode';
```

### LiveCode Best Practices
- **DO**: Focus on behavior and functionality only
- **DO**: Show real state changes and user interactions  
- **DO**: Demonstrate accessibility features prominently
- **DO**: Use meaningful variable names and realistic content
- **DON'T**: Add any styling, even inline styles
- **DON'T**: Include theme or design system references
- **DON'T**: Create toy examples - make them functional and useful

## Documentation Template Structure

### Required MDX Template
```mdx
---
sidebar_position: [number]
title: ${ComponentName}
description: Brief SEO-friendly description of the component
---

import React from 'react';
import LiveCode from '../../src/components/LiveCode';

# ${ComponentName}

Brief one-sentence description of what this component does.

![Accessibility Badge] ![Tree-shakeable Badge] ![TypeScript Badge]

## Description

Detailed explanation of the component including:
- What it does and why it's useful
- Primary use cases and scenarios
- Key behavioral characteristics
- Design principles it follows

## Installation

```bash
pnpm add @turkishtechnology/glide
npm install @turkishtechnology/glide
yarn add @turkishtechnology/glide
```

```tsx
import { ${ComponentName} } from '@turkishtechnology/glide'
```

## Live Demo

<LiveCode 
  code={`function BasicDemo() {
  return (
    <${ComponentName}.Root>
      <${ComponentName}.Trigger>
        Click me to see behavior
      </${ComponentName}.Trigger>
      <${ComponentName}.Content>
        This demonstrates core functionality
      </${ComponentName}.Content>
    </${ComponentName}.Root>
  );
}`}
/>

## Features

- ✅ Feature 1 with behavioral focus
- ✅ Feature 2 with accessibility note
- ✅ Full keyboard navigation support
- ✅ WCAG 2.2 AA compliant
- ✅ Screen reader optimized
- ✅ Tree-shakeable and lightweight

## Anatomy

```tsx
<${ComponentName}.Root>
  <${ComponentName}.Trigger />
  <${ComponentName}.Content>
    <${ComponentName}.Item />
  </${ComponentName}.Content>
</${ComponentName}.Root>
```

## Examples

### Basic Usage
[Basic LiveCode example]

### Advanced Usage  
[Advanced LiveCode example with state]

### Accessibility Features
[Accessibility-focused LiveCode example]

## API Reference

### ${ComponentName}.Root
[Complete props table]

### ${ComponentName}.Trigger
[Complete props table]

### Events
[Events table]

### Keyboard Interactions
[Keyboard table]

### ARIA Attributes
[ARIA table]
```