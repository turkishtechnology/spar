---
mode: agent
model: Claude Sonnet 4 (copilot)
description: Design comprehensive specifications for new Spar headless components
---

# Spar Component Specification Designer

Create a detailed specification for the **${input:ComponentName:Dialog}** Spar headless component.

## Phase 1: Research

Use Context7 MCP or web search to analyze:

- Leading headless component libraries (architecture and API patterns)
- Recognized accessibility standards and authoring practices
- Modern interaction and keyboard navigation patterns
- NEVER mention those libraries in the instruction, just search and decide the final features of the component

Focus on: API patterns, accessibility, state management, composition structure.

## Phase 2: Instruction Document Template

Use the exact section order and headings below:

```markdown
# ${ComponentName} — Spar Headless Instructions

## 1. Component Overview

- Purpose and use cases
- Compound component structure
- Key differentiators

## 2. API

- Props table (name, type, required, default, description)
- Polymorphic `as`, refs, controlled/uncontrolled

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |

## 4. Accessibility

- Roles
- Keyboard
- Focus management
- Announcements (screen reader)
- Name/Role/Value exposure
- Use .github/instructions/accessibility-guidelines.instructions.md file to rules

## 5. Implementation Architecture

- State hooks design
- Context requirements
- Ref forwarding strategy
- Event system
- SSR/CSR safety and deterministic ids

## 6. Styling & Data Attributes

- Required `data-*` attributes and values (variants, sizes, states)

## 7. Test Coverage Plan

- Unit tests
- Accessibility tests
- Integration tests

## 8. Constraints

- Zero styling (behavior only)
- Styling via `data-*` attributes
- Tree-shakeable exports
- TypeScript strict mode
- WCAG 2.2 AA compliant
- Controlled/uncontrolled support

## 9. Migration & Implementation Checklist

- Migration guidance informed by leading industry implementations
- Implementation checklist
```

## Constraints

✓ Zero styling (behavior only)
✓ Styling via `data-*` attributes
✓ Tree-shakeable exports
✓ TypeScript strict mode
✓ WCAG 2.2 AA compliant
✓ Controlled/uncontrolled support

## Output

Save specification to: `.github/instructions/components/${component-name}.md`
