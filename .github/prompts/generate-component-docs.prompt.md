---
mode: agent
model: Claude Opus 4.1
description: Generate comprehensive documentation for Glide components
---

# Documentation Generator

Generate documentation for **${input:ComponentName:Button}** component.

## Prerequisites

1. **Component must already exist** – Implementation is complete
2. **Tests completed** – Full test coverage required
3. **Types exported** – All TypeScript interfaces exported
4. **Accessibility verified** – Passes all a11y tests
5. **LiveCode scope updated** – Component added to LiveCode.tsx scope if new

**ALWAYS follow instructions in [Documentation Guidelines](../instructions/docs-guidelines.instructions.md).**

## Documentation Sections Required

1. **Component Name & Brief Description**
   - Title, one-sentence purpose, badges (accessibility, tree-shakeable, TypeScript)
2. **Live Demo**
   - Single interactive LiveCode example (minimal, accessibility demonstrated)
3. **Features List**
   - Bulleted list of component specific actual capabilities
   - Pay attention to the do's and don'ts
4. **Installation**
   - pnpm install command, import statement, peer dependencies if any
5. **Anatomy Viewer**
   - Interactive anatomy using AnatomyViewer component
   - **Use the exact same demo code from LiveCode section**
   - Add data-glide-part attributes to each compound part
   - All compound parts with names, labels, and descriptions
   - Basic inline styles for visibility (same as LiveCode)
   - Structure code block after the viewer
   - Data flow explanation
6. **Code Examples**
   - Multiple progressive, static TypeScript code blocks (unstyled, headless, accessible, real-world scenarios)
   - Use Docusaurus line highlighting syntax to emphasize key lines (e.g., `tsx {1,4-6,11}`)
6. **API Reference Tables**
   - For EACH compound part: Props, Events, ARIA tables (exact TypeScript types, actual defaults, required indicators)
7. **Keyboard Interactions**
   - Global keyboard behavior table for the entire component

## Requirements

- **TypeScript First**: All examples use strict TypeScript
- **Accessibility Detailed**: Document ARIA patterns, keyboard navigation
- **Complete API**: All props, events, methods, keyboard interactions documented with exact TypeScript types
- **Demo Consistency**: AnatomyViewer must use the exact same demo code as LiveCode section, only adding data-glide-part attributes

## File Location

Create documentation at: `apps/docs/docs/Components/${ComponentName}.mdx`
- Use `.mdx` extension for LiveCode integration

## Content Standards

- **MDX Format**: Use `.mdx` with React imports for LiveCode and AnatomyViewer
- **Required Imports**:
  - `import React from 'react';`
  - `import LiveCode from '../../src/components/LiveCode';`
  - `import AnatomyViewer from '../../src/components/AnatomyViewer/AnatomyViewer';`
  - `import { [ComponentName] } from '@turkish-technology/glide';`
- **Docusaurus Frontmatter**: SEO metadata, sidebar position, title, description
- **LiveCode Example**: Only one, minimal, accessibility-focused
- **AnatomyViewer**: Same demo as LiveCode + data-glide-part attributes + parts array
- **Code Examples**: Static, progressive, TypeScript, headless, accessible
  - Use line highlighting for important sections: `tsx {1,4-6,11}`
  - Highlight state management, event handlers, accessibility props
- **Table Standards**:
  - Props: Name, Type, Default, Description
  - Events: Name, Parameters, Description, When Triggered
  - ARIA: Attribute, Value, Purpose, Applied To
  - Keyboard: Key, Action, Context, Notes
- **No Styling**: Zero visual opinions, no CSS, no theme references (except basic inline styles in demos)

## Success Criteria

- **Structure Compliance**: Follows 7-section structure exactly
- **Compound Documentation**: All compound parts documented separately
- **LiveCode Functionality**: Example renders correctly
- **AnatomyViewer Consistency**: Uses same demo as LiveCode with data-glide-part attributes
- **Headless Implementation**: No styling opinions
- **API Completeness**: All props, events, methods with exact TypeScript types
- **Keyboard Documentation**: Complete keyboard behavior table

## Quality Checklist

- [ ] Component TypeScript interfaces analyzed
- [ ] All compound parts identified and documented
- [ ] AnatomyViewer uses same demo as LiveCode with data-glide-part attributes
- [ ] All parts have clear names, labels, and descriptions
- [ ] Accessibility implementation verified and explained
- [ ] Real examples tested with component
- [ ] Props/events/ARIA tables complete for each compound part
- [ ] Global keyboard interactions table documented
- [ ] Code examples are functional, headless, and accessible
- [ ] Installation instructions accurate
- [ ] Structure code block and data flow explanation provided

**Remember:** Documentation must empower developers to implement accessible, headless components confidently, without imposing design opinions. Only document features and APIs that actually exist in the component.