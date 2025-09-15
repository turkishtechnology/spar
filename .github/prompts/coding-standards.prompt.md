---
mode: agent
model: claude-4.1-opus
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

## Phase 4: Standards Compliance Checklist

Before finalizing, verify ALL items in the coding standards checklist:

### 🔒 Type Safety (Critical)

- [ ] No `any` types or type assertions
- [ ] All function parameters have explicit types
- [ ] Proper null safety with optional chaining
- [ ] Union types for variants and states
- [ ] Readonly props interfaces

### ⚛️ React Patterns (Performance & Compliance)

- [ ] All React hooks follow rules of hooks
- [ ] Hooks at top level only (no conditional hooks)
- [ ] Exhaustive dependencies in useEffect/useCallback
- [ ] Stable keys for dynamic lists
- [ ] Proper event handler naming starting with "on"
- [ ] Component.displayName set for debugging

### 🏗️ Component Architecture

- [ ] React 19+ patterns (no unnecessary forwardRef)
- [ ] Props extend appropriate HTML element types
- [ ] JSDoc comments for all props with @defaultValue
- [ ] Compound pattern for complex components
- [ ] Safe prop spreading (extract known props first)

### ♿ Accessibility (WCAG 2.2 AA)

- [ ] ARIA attributes for screen readers
- [ ] Proper role and aria-\* properties
- [ ] Keyboard navigation support
- [ ] Focus management for interactive elements
- [ ] aria-label required for icon-only variants

### 🛡️ Security & Safety

- [ ] No dangerous HTML injection without sanitization
- [ ] Input validation for user-provided data
- [ ] Safe prop handling (no blind spreading)
- [ ] Error boundaries for error handling

### 📁 File Organization & Exports

- [ ] Named exports only (tree-shakeable)
- [ ] Proper import order and grouping
- [ ] Index files for clean component exports
- [ ] TypeScript types co-located or in .types.ts

### 🎯 Performance & Code Quality

- [ ] No unused imports/variables
- [ ] No magic numbers - use named constants
- [ ] Exhaustive switch statements with default
- [ ] Simplified boolean expressions
- [ ] Functions have reasonable parameter count
- [ ] Cognitive complexity under threshold
- [ ] No duplicate code blocks

## Phase 5: Output

Provide the refined ${input:Target} that fully complies with the coding standards.

If refining spec: Output the updated specification document with checklist compliance notes.
If refining code: Output the corrected code with explanations of changes made and checklist verification.

Ensure the output maintains all existing functionality while improving adherence to standards.

### Verification Summary

Include a brief summary of checklist compliance:

```
✅ Type Safety: All types explicit, no any usage
✅ React Patterns: Hooks compliant, stable keys
✅ Architecture: Props extend HTML types, compound pattern
✅ Accessibility: ARIA compliant, keyboard navigation
✅ Security: Safe prop handling, no XSS risks
✅ Performance: Optimized renders, no code duplication
```
