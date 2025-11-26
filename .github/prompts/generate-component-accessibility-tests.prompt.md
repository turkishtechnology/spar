---
mode: agent
model: Claude Sonnet 4 (copilot)
description: Generate comprehensive accessibility test suite for Spar components
---

# Accessibility Test Generator

Generate accessibility tests for **${input:ComponentName:Button}** component.

## Prerequisites

1. **Component must already exist** - Verify component logic is implemented
2. **Run linting first** - Execute `pnpm lint` and fix any ESLint errors
3. **Type checking** - Run `pnpm check-types` to ensure TypeScript compliance

ALWAYS follow instructions in [Testing Guidelines](../instructions/testing-guidelines.instructions.md).

## Test Types

- **Accessibility tests**: jest-axe compliance, keyboard navigation, screen reader support
- **ARIA tests**: Proper role, state, and property implementation
- **Focus management**: Tab order, focus trapping, focus restoration

## Requirements

- jest-axe zero violations
- All keyboard interactions covered
- Screen reader compatibility verified
- ARIA attributes tested
- Focus management validated
- Follow React Testing Library patterns
- Ensure all tests pass linting (`pnpm lint`)

## Files to Create

- `${ComponentName}.a11y.test.tsx` - Accessibility tests

## Success Criteria

- All accessibility tests pass (`pnpm test`)
- ESLint passes for test files (`pnpm lint`)
- Zero axe violations
- Full keyboard navigation coverage
