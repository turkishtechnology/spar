---
mode: agent
model: claude-4.1-opus
description: Comprehensive review of Glide headless component implementation against accessibility and headless standards
---

# Component Review & Validation

Review the **${input:ComponentName:Button}** component for compliance with Glide headless crinciples: fully headless (unstyled), accessible by default, keyboard navigable, and assistive-technology friendly.

## Phase 1: Benchmark Research

Compare implementation against:

- Leading headless component libraries (architecture patterns, API design)
- Recognized accessibility standards and authoring practices
- Modern interaction and keyboard navigation patterns

Use Context7 MCP or web search for up-to-date sources.

## Phase 2: Component Analysis

Examine `packages/glide/src/components/${ComponentName}/` and `.github/instructions/components/${component-name}.md`:

### 1. Instruction Template Conformance

- The instructions file MUST follow this exact template and order:
  - 1. Component Overview
  - 2. API
  - 3. Behavior Matrix
  - 4. Accessibility
  - 5. Implementation Architecture
  - 6. Styling & Data Attributes
  - 7. Test Coverage Plan
  - 8. Constraints
  - 9. Migration & Implementation Checklist

### 2. Architecture Review

- Headless by default (no visual styles; only `data-*` hooks for styling)
- Compound component structure (where applicable)
- Proper separation of concerns (logic vs presentation)
- Tree-shaking optimization and minimal bundle impact
- Polymorphic `as` support and semantic correctness
- SSR/CSR safety; no layout thrash; deterministic output

### 3. API Validation

```typescript
Check for:
- Strong typing and generics where useful
- Prop forwarding (className, style, data-*, aria-*)
- Controlled / uncontrolled patterns (if relevant)
- Ref forwarding and programmatic focus support
- Event handler conventions (onX, no surprise side effects)
- Polymorphic `as` and native vs custom semantics
- Disabled vs aria-disabled semantics (native vs non-native)
- Stable ids/labels when needed (e.g., aria-describedby)
- Children/slots flexibility without coupling to styles
```

### 4. Accessibility & Interaction

- Correct semantics (native element first; fall back to `role` + `tabIndex`)
- Full keyboard support (Enter/Space activation, arrow/escape where applicable)
- Prevent default where needed (e.g., Space to avoid scroll)
- Focus management (roving focus when applicable, `data-focus-visible` hooks)
- Announcements for dynamic states (`aria-live` for loading/progress)
- Clear labeling requirements (e.g., icon-only requires accessible name)
- State relationships (aria-expanded/controls/selected/pressed where relevant)
- Name/Role/Value exposed correctly for AT

### 5. State & Data Attributes

- Provide `data-*` hooks for styling and state targeting:
  - Variants, sizes (if applicable)
  - Interaction states (hovered, focused, focus-visible, pressed)
  - Disabled, loading/busy, selected/expanded (as relevant)

### 6. Test Coverage Analysis

- Unit tests: Core logic, edge cases, interaction states
- A11y tests: Roles, names, states, focus order, keyboard
- Integration/E2E: Realistic flows and regression paths

### 7. Documentation Quality

- API completeness and prop tables
- Usage examples (headless patterns; styling via `data-*`)
- Accessibility notes and keyboard behavior
- Migration guidance (if applicable)
