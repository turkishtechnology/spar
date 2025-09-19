---
mode: agent
model: Claude Sonnet 4 (copilot)
description: Apply coding standards to component specifications or generated code
---

# Glide Coding Standards Application

Apply the coding standards from `.github/instructions/coding-standards.instructions.md` to refine the **${input:ComponentName:Button}** component ${input:Target:spec or code}.

## Phase 1: Standards Review

Read and internalize the coding standards from `.github/instructions/coding-standards.instructions.md`.

Key areas to focus on:
- TypeScript standards and patterns
- React component structure (React 19+)
- Props interface design
- State management
- Import/export conventions
- Code style and naming
- Performance guidelines
- Security considerations

## Phase 2: Target Analysis

Analyze the provided ${input:Target} for the ${input:ComponentName} component.

If target is "spec":
- Ensure the specification follows coding standards for props, types, and architecture
- Verify component structure matches the template
- Check for proper TypeScript usage and naming conventions

If target is "code":
- Review the generated code against coding standards
- Ensure proper TypeScript types, React patterns, and performance guidelines
- Validate naming conventions, imports, and code style

## Phase 3: Standards Application

Refine the ${input:Target} by applying the coding standards:

### TypeScript Standards
- Use explicit types, no `any`
- Extend appropriate HTML element props
- Follow discriminated union patterns for complex state

### React Patterns
- Use React 19+ patterns (no unnecessary forwardRef)
- Proper hooks usage with typed state
- Early returns for conditionals

### Component Architecture
- Follow the component template structure
- Proper props interface with JSDoc comments
- Named exports and tree-shakeable structure

### Code Quality
- Arrow functions for consistency
- Proper event handler naming (handle prefix)
- Boolean props with is/has/should/can prefixes

## Phase 4: Output

Provide the refined ${input:Target} that fully complies with the coding standards.

If refining spec: Output the updated specification document.
If refining code: Output the corrected code with explanations of changes made.

Ensure the output maintains all existing functionality while improving adherence to standards.
