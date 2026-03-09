---
applyTo: '**/components/**/*.tsx'
---

# Component Review Instructions - Glide

This file defines the operational steps to follow when performing component reviews using `review-components.prompt.md`.

## 0. Reference Files

The following instruction files should be referenced during component review:
- **Accessibility**: `.github/instructions/accessibility-guidelines.instructions.md`
- **Coding Standards**: `.github/instructions/coding-standards.instructions.md`
- **Testing**: `.github/instructions/testing-guidelines.instructions.md`
- **Documentation**: `.github/instructions/docs-guidelines.instructions.md`

These files contain detailed rules and best practices for each category.

## 1. Preparation
- Users can express in natural language (e.g., "Do it for Button", "Check Accordion and Tabs").
- Extract component names from text: PascalCase or word list → map to `packages/glide/src/components/<Name>` directory.
- Generate `missing component path` warning in report for unmatched names.
- List fragment files for each path (`*Root.tsx`, `*Trigger.tsx`, etc.) and note the existence of `types.ts`, `index.ts`, `__tests__` folder.
- **Current Layout Analysis**: Note the existing format, naming patterns, and code style of each file to be reviewed.

## 2. Review Flow (Per Component)
Apply sequential checks; record findings with severity for each heading.

### A. Accessibility
**Reference**: `accessibility-guidelines.instructions.md`

- ARIA Authoring Practices Guide (APG) pattern compliance
- Keyboard-supported keys: Tab, Shift+Tab, Enter, Space, Escape, Arrow keys (if needed). Mark missing ones.
- aria-* relationships: Correct usage of `aria-controls`, `aria-labelledby`, `aria-expanded`, `role`.
- Focus management: Context usage in programmatic `focus()` or roving tab index needs.
- Live region or announcement if needed (e.g., dynamic content) - present/absent.
- WCAG 2.2 AA compliance (contrast, focus indicators, screen reader support).

### B. Prop & Type Quality
**Reference**: `coding-standards.instructions.md` (TypeScript Standards, Props Interface Template)

- Public props defined in `types.ts`.
- Unnecessary use of `any`, `unknown`.
- Callback signatures (e.g., `onChange(value: T)`), appropriate for generic or discriminated union needs.
- Default prop values breaking headless behavior.
- ARIA attribute types using `React.AriaAttributes`.
- No redundant `children` props declaration (comes from HTMLAttributes).

### C. Composition
**Reference**: `coding-standards.instructions.md` (File Organization Standards, Module Exports)

- Each part in separate file (Root, Trigger, Content, etc.).
- Nested context structure minimal, no redundancy.
- Dot notation export (index.ts) correct (dual export pattern).
- Generic aliases (Root, Item, Trigger) not used (component-specific names required).

### D. Headlessness
**Reference**: `copilot-instructions.md` (Core Rules - Headless Only)

- No visual styling opinions, className forcing, or CSS imports.
- Behavioral inline styles are allowed only when required for runtime mechanics (e.g., floating/positioning coordinates, collision offsets, transform origin) and must not introduce visual design tokens (color, typography, shadows, spacing aesthetics).
- No styling added when adding A11y required attributes.
- Zero styling opinions, no CSS imports.

### E. State & Logic Separation
**Reference**: `coding-standards.instructions.md` (State Management, Component Architecture)

- Uncontrolled + controlled usage option (e.g., `value` + `defaultValue` + `onChange`).
- Cleanup: event listener / timeout / observer removal.
- Side effects: no global mutations outside render.
- Appropriate `useItemRegistry` usage (when keyboard navigation needed).

### F. Export & Tree-shake
**Reference**: `coding-standards.instructions.md` (Module Exports)

- Named exports, no side-effects (e.g., top-level subscription).
- `index.ts` contains only re-exports.
- Dual export pattern (compound + named exports).

### G. Test Coverage
**Reference**: `testing-guidelines.instructions.md`

- Files: `<Comp>.test.tsx`, `<Comp>.a11y.test.tsx`, `<Comp>.integration.test.tsx`.
- Basic scenarios: render, prop changes, keyboard interaction, a11y attribute assertions.
- jest-axe tests zero violations.
- Coverage 90%+ (statements, branches, functions, lines).
- Pre-test linting (`pnpm lint`) and type checking.

### H. Documentation
**Reference**: `docs-guidelines.instructions.md`

- Anatomy section present (all parts listed, AnatomyViewer usage).
- Props table (every public prop explained - 3 tables per compound part: Props, Events, ARIA).
- Usage example (at least one controlled or uncontrolled variant).
- LiveCode demo (single interactive example).
- Code Examples (progressive, headless, static markdown blocks).
- Accessibility note (critical role/aria emphasis).
- Global Keyboard Interactions table.

### I. Performance
**Reference**: `coding-standards.instructions.md` (Performance Guidelines)

- Unnecessary context width (excessively large value object).
- Memoization (`useCallback`, `useMemo`) truly needed in necessary places.
- Reduced anonymous functions triggering re-renders.
- Early returns used for conditional rendering.

### J. Code Standards
**Reference**: `coding-standards.instructions.md` (Naming Conventions, Code Style, Component Architecture)

- Function size: 50+ line single function warning.
- Single responsibility: complex branches should be extracted.
- Error states (e.g., invalid prop combination) early return or `console.warn` (optional) pattern.
- Arrow functions usage.
- Event handler naming (`handle` prefix).
- Boolean props naming (`is/has/should/can` prefix).

### K. Layout and Format Consistency
**Reference**: Current file structure and project standards

- **Naming Pattern Compliance**: Should match existing component naming convention (e.g., if `AccordionItem` exists, use `AccordionNewPart` pattern).
- **Import Order**: Should match import grouping in existing file (React, external libs, internal).
- **Code Structure**: Follow file organization patterns in similar components.
- **Comment Style**: Should match existing JSDoc or inline comment style if present.
- **Spacing and Indentation**: Consistent with project-wide prettier/eslint configuration.
- **Export Pattern**: Follow export pattern of other components in same category (continue dual export if exists).

## 3. Scoring
Starting score: 100 (all categories always included).
- High: -8
- Medium: -4
- Low: -2
- Critical missing artifact (a11y test, root part, types.ts): -10 additional.

**Important**: Layout and format consistency (K category) is generally evaluated as Low severity, but can be Medium if serious conflicts with existing structure exist.

No normalization; score remains directly in 0-100 range.

## 4. Output Format

**Format Rules:**
- Write in Markdown format (headings, lists, code blocks, tables)
- Separate H2 heading for each component (`## Component Review: ComponentName`)
- Show code files in backticks (`file.tsx`)
- Severity indicators: `[HIGH]`, `[MEDIUM]`, `[LOW]`
- Readable spacing and proper indentation
- Use bold for important headings

### Component Review Block

```markdown
## Component Review: **ComponentName**

**Status:** Needs Improvement | Compliant | Partial  
**Score:** <number>/100

---

### Findings

#### HIGH PRIORITY (count)
1. **[Category]** Description.
   - **Ref:** `file.instructions.md` - Section

#### MEDIUM PRIORITY (count)
1. **[Category]** Description.
   - **Ref:** `file.instructions.md` - Section

#### LOW PRIORITY (count)
1. **[Category]** Description.
   - **Ref:** `file.instructions.md` - Section

---

### Missing Artifacts
- **Tests:** `Component.a11y.test.tsx`
- **Docs:** Missing section

---

### Action Plan

#### HIGH PRIORITY ACTIONS

**1. Action title**
- **File:** `path/to/file.tsx`
- **Rationale:** Why needed
- **Reference:** `file.instructions.md`

#### MEDIUM PRIORITY ACTIONS

**2. Action title**
- **File:** `path/to/file.tsx`
- **Rationale:** Why needed
- **Reference:** `file.instructions.md`

---
```

### Global Plan and Next Actions

```markdown
## Global Refactoring Plan

### HIGH PRIORITY
**1. Action title**
- **Rationale:** Why
- **Reference:** `file.instructions.md`

### MEDIUM PRIORITY
**2. Action title**
- **Rationale:** Why
- **Reference:** `file.instructions.md`

---

## Next Actions (Top 5)

1. **[HIGH]** Action description
2. **[HIGH]** Action description
3. **[MEDIUM]** Action description
4. **[HIGH]** Action description
5. **[LOW]** Action description

---

### Summary Statistics

| Metric | Value |
|--------|-------|
| **Total Components Reviewed** | N |
| **Average Score** | N/100 |
| **High Priority Issues** | N |
| **Medium Priority Issues** | N |
| **Low Priority Issues** | N |
| **Missing Artifacts** | N |

---
```

## 5. Prioritization Criteria
- High: Accessibility breakage, test missing, public API error.
- Medium: Performance optimization, type improvement.
- Low: Cosmetic layout, file reordering.

## 6. Plan Generation Rules
- At least one clear file + action for each High issue.
- No irrelevant or vague suggestions; each step in "change single sentence" format.
- If more than 10 steps, move most critical first 10, rest to "backlog" sub-list.

## 7. Limitations
- No styling addition, docs writing, or test file creation at this stage; only planning.
- If code examples needed, brief diff hint format (e.g., `+ onKeyDown => handleSpace(event)`), not full file content.

## 8. Consistency Note
- Terminology: English headings + descriptions. Category tags in English, descriptions in English.
- Refactor suggestions should align with existing file layout; follow patterns in similar components.

## 9. Example Finding

**HIGH Priority:**
```
**[Accessibility]** TooltipTrigger missing Escape key closing behavior.
- **Ref:** `accessibility-guidelines.instructions.md` - Mandatory Rules - Keyboard Support
```

**LOW Priority:**
```
**[Format]** Import order inconsistent with existing component pattern (React imports should come first).
- **Ref:** Existing project structure
```

When ready and prompt is executed, generate evaluation according to this instruction set. Do not make file changes; only report. No partial or STRICT mode concept; all categories are mandatory.
