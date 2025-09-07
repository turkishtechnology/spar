---
mode: agent
model: claude-4.1-opus
description: Generate comprehensive test suite for Glide components
---

# Test Generator

Generate tests for **${input:ComponentName:Button}** component.

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

## Files to Create

- `${ComponentName}.test.tsx` - Unit tests
- `${ComponentName}.a11y.test.tsx` - Accessibility tests
