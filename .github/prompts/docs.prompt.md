---
mode: 'agent'
description: 'Generate or update documentation'
---

# Documentation Prompt

<taskScope>
You are writing or updating documentation.
Focus ONLY on clear, helpful documentation.
DO NOT modify code implementation unless fixing doc examples.
</taskScope>

## Documentation Types

<docTypes>
1. **API Documentation**: Props, methods, types
2. **Usage Examples**: Common use cases
3. **Guides**: How-to tutorials
4. **Migration**: Breaking change guides
5. **JSDoc**: Inline code documentation
6. **README**: Component overview
</docTypes>

## What to Include

<includeList>
- Clear descriptions
- TypeScript examples
- Common use cases
- API references
- Props tables
- Method signatures
- Return types
- Edge cases
- Accessibility notes (if features complete)
- Browser compatibility
</includeList>

## What to Exclude

<excludeList>
- Code implementation changes
- New features
- Test additions
- Performance optimizations
- Refactoring
- Build configuration
</excludeList>

## Documentation Structure

### Component README

```markdown
# ComponentName

Brief description of what the component does.

## Installation

\`\`\`bash
pnpm add @tk-headless/component-name
\`\`\`

## Basic Usage

\`\`\`tsx
import { ComponentName } from '@tk-headless/component-name';

function App() {
return <ComponentName />;
}
\`\`\`

## API Reference

### Props

| Prop  | Type   | Default | Description |
| ----- | ------ | ------- | ----------- |
| prop1 | string | -       | Description |

### Methods

- \`methodName(param: Type): ReturnType\` - Description

## Examples

### Controlled Mode

\`\`\`tsx
// Example code
\`\`\`

### Uncontrolled Mode

\`\`\`tsx
// Example code
\`\`\`

## Accessibility

- Keyboard shortcuts (if implemented)
- ARIA attributes (if implemented)
- Screen reader support (if implemented)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
```

### JSDoc Comments

````typescript
/**
 * ComponentName provides [brief description]
 *
 * @example
 * ```tsx
 * <ComponentName value="example" />
 * ```
 */
export interface ComponentNameProps {
  /**
   * The value to display
   * @default undefined
   */
  value?: string;

  /**
   * Callback fired when value changes
   * @param value - The new value
   */
  onChange?: (value: string) => void;
}
````

### Props Table

```markdown
| Prop       | Type                 | Default | Required | Description          |
| ---------- | -------------------- | ------- | -------- | -------------------- |
| `children` | `ReactNode`          | -       | Yes      | Content to render    |
| `disabled` | `boolean`            | `false` | No       | Disables interaction |
| `onChange` | `(value: T) => void` | -       | No       | Change handler       |
```

### Usage Examples

```typescript
// Basic usage
<Component />

// With props
<Component
  value="example"
  onChange={(val) => console.log(val)}
/>

// Composition pattern
<Component>
  <Component.Header>Title</Component.Header>
  <Component.Body>Content</Component.Body>
</Component>

// With hooks
const { state, handlers } = useComponent();
```

## Documentation Checklist

<checklist>
□ Clear component description
□ Installation instructions
□ Basic usage example
□ Props documented with types
□ Methods documented with signatures
□ Common use cases covered
□ TypeScript examples included
□ Edge cases mentioned
□ Accessibility documented (if applicable)
□ Browser support listed
</checklist>

<reminders>
REMEMBER: Focus ONLY on documentation.
REMEMBER: Use clear, concise language.
REMEMBER: Include TypeScript examples.
REMEMBER: Don't modify implementation.
REMEMBER: Check if features are implemented before documenting.
</reminders>
