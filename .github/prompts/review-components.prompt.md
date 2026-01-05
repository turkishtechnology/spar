---
agent: Plan
model: Gemini 3 Pro (Preview) (copilot)
description: Comprehensive component review against all established rules (accessibility, headless, composition, type safety, test/documentation separation, etc.)
---

# Component Review Prompt

Purpose: Audit selected Glide headless component(s) for full compliance with all previously defined rules (accessibility, headless, composition, type safety, test/documentation separation, etc.) and generate a correction plan for deficiencies. No partial reviews; all headings are always evaluated.

## Reference Instruction Files

**MUST** reference the following instruction files during review:

0. **Operational Guide**: `.github/instructions/review-components.instructions.md`
   - **CRITICAL**: This file defines the EXACT operational steps, review flow, scoring system, and output format for this prompt. You MUST follow the process defined in this file strictly.

1. **Main Instructions**: `.github/copilot-instructions.md`
   - Core Rules (Headless Only, Accessibility First, TypeScript Strict, Tree-Shakeable)
   - Component Structure (Simple/Compound patterns)
   - Task-Specific Instructions references

2. **Accessibility**: `.github/instructions/accessibility-guidelines.instructions.md`
   - WCAG 2.2 AA compliance
   - ARIA Authoring Practices Guide (APG) patterns
   - Keyboard support patterns
   - Focus management
   - Screen reader support

3. **Coding Standards**: `.github/instructions/coding-standards.instructions.md`
   - TypeScript Standards
   - Component Props Pattern
   - File Organization (separate files rule)
   - Module Exports (dual export pattern)
   - State Management
   - ARIA Attributes Standards

4. **Testing**: `.github/instructions/testing-guidelines.instructions.md`
   - Coverage Requirements (90%)
   - Test Structure (3 files: unit, a11y, integration)
   - jest-axe mandatory zero violations
   - Pre-test linting requirements

5. **Documentation**: `.github/instructions/docs-guidelines.instructions.md`
   - Documentation Structure
   - LiveCode integration (single demo)
   - AnatomyViewer usage
   - Code Examples (progressive, headless)
   - API Reference Tables (Props, Events, ARIA for each compound part)
   - Global Keyboard Interactions table

