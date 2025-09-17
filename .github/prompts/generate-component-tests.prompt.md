---
mode: agent
model: Claude Sonnet 4 (copilot)
description: Generate comprehensive test suite for Glide components
---

# Test Generator

Generate tests for **${input:ComponentName:Button}** component.

## Prerequisites

1. **Component must already exist** - Verify component logic is implemented
2. **Run linting first** - Execute `pnpm lint` and fix any ESLint errors
3. **Type checking** - Run `pnpm check-types` to ensure TypeScript compliance

ALWAYS follow instructions in [Testing Guidelines](../instructions/testing-guidelines.instructions.md).

## Test Types

- **Unit tests**: Functionality, props, state, events
- **Accessibility tests**: jest-axe compliance, keyboard navigation
- **Integration tests**: User workflows, interactions

## Requirements

- Test coverage > 90%
- jest-axe zero violations
- All user interactions covered
- Edge cases included
- Follow React Testing Library patterns
- Ensure all tests pass linting (`pnpm lint`)

## Files to Create

- `${ComponentName}.test.tsx` - Unit tests
- `${ComponentName}.a11y.test.tsx` - Accessibility tests
- `${ComponentName}.integration.test.tsx` - Integration tests (if applicable)

## Success Criteria

- All tests pass (`pnpm test`)
- ESLint passes for test files (`pnpm lint`)
- Coverage meets requirements (> 90%)
