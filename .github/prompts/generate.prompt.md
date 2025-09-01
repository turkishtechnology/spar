---
mode: 'agent'
description: 'Generate a new component with core functionality'
---

# Create TK Headless Component

Create a new headless UI component for TK Headless with the following requirements:

Component name: ${input:componentName:Enter component name (e.g., Dialog, Dropdown)}

## Requirements

<structure>
The component generator MUST create the following files **only if needed**:

- Create component file at `packages/headless/src/components/${input:componentName}/${input:componentName}.tsx`
  _(Always required)_
- Create types file at `packages/headless/src/components/${input:componentName}/types.ts`
  _(Only if the component has complex or reusable types)_
- Create hook file at `packages/headless/src/components/${input:componentName}/hooks/use${input:componentName}.ts`
  _(Only if the component has internal state, effects, or reusable logic that justifies a separate hook)_
- Create index file at `packages/headless/src/components/${input:componentName}/index.ts`
  _(Always required)_

### Implementation Requirements

1. FIRST, check component-specific instructions at:
   `.github/instructions/components/${component-name}.instructions.md`

2. Then follow all guidelines from:
   - [TK Headless Instructions](.github/copilot-instructions.md)
   - [Accessibility Guidelines](.github/instructions/accessibility.instructions.md)
   - [TypeScript Standards](.github/instructions/typescript.instructions.md)
     </structure>

<taskScope>
You are generating a NEW component or adding core functionality.
Focus ONLY on the essential structure and functionality.
DO NOT add accessibility, tests, or extensive documentation unless explicitly requested.
</taskScope>

## What to Include

<includeList>
- Component structure with proper TypeScript interfaces
- Basic props interface with essential properties
- Ref forwarding setup using React.forwardRef
- Controlled and uncontrolled mode support
- Essential event handlers (onClick, onChange, etc.)
- Component composition structure if applicable
- Basic JSDoc comments for main component
- Export statements
</includeList>

## What to Exclude

<excludeList>
- ARIA attributes (unless absolutely critical for basic function)
- Keyboard navigation handlers (unless core to the component)
- Focus management
- Screen reader announcements
- Comprehensive tests
- Detailed documentation
- Animation/transition logic
- Complex error handling
- Performance optimizations
</excludeList>

## Implementation Guidelines

<guidelines>
1. Start with reading the .github/components/{component_name}.instructions.md
2. Implement the basic component structure
3. Add ref forwarding if the component interacts with DOM
4. Support both controlled and uncontrolled modes where applicable
5. Keep the implementation minimal and focused
6. Use semantic HTML elements where possible
7. Make sure that TypeScript interface for props are added
8. Follow the naming conventions in coding-standards.instructions.md
</guidelines>

## Example Structure

```typescript
import { forwardRef } from 'react';

export interface ComponentNameProps {
  // Essential props only
}

/**
 * Brief description of the component
 */
export const ComponentName = forwardRef<HTMLElement, ComponentNameProps>(
  ({ ...props }, ref) => {
    // Basic implementation
    return (
      <div ref={ref} {...props}>
        {/* Component structure */}
      </div>
    );
  }
);

ComponentName.displayName = 'ComponentName';
```

<reminders>
REMEMBER: This is ONLY for core functionality.
REMEMBER: Keep it minimal - no extras unless requested.
REMEMBER: Accessibility will be added later with /accessibility command.
REMEMBER: Tests will be added later with /test command.
</reminders>
