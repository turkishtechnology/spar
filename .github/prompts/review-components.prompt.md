---
mode: agent
model: Claude Sonnet 4 (copilot)
description: Comprehensive component review against all established rules (accessibility, headless, composition, type safety, test/documentation separation, etc.)
---

# Component Review Prompt

Purpose: Audit selected Glide headless component(s) for full compliance with all previously defined rules (accessibility, headless, composition, type safety, test/documentation separation, etc.) and generate a correction plan for deficiencies. No partial reviews; all headings are always evaluated.

## Reference Instruction Files

**MUST** reference the following instruction files during review:

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

## Input Examples

- "Review Button"
- "Evaluate Accordion and Tabs components"
- "Check Tooltip for accessibility and testing" (note: all headings still reported)
- "Compare DropdownMenu, Popover and Tooltip" (separate blocks in same report)
- "Find a11y issues in Switch and Checkbox" (all categories still evaluated)

Extract component names/folders from content and assume relevant directories at `packages/glide/src/components/<Name>`.

## Evaluation Headings

For each heading, reference the relevant instruction file and pull detailed rules from there:

### 1. Accessibility
**Reference**: `accessibility-guidelines.instructions.md`
- ARIA Authoring Practices Guide (APG) pattern compliance
- Mandatory keyboard support (Tab, Shift+Tab, Enter, Space, Escape, Arrows, Home/End)
- ARIA attributes (role, aria-label, aria-labelledby, aria-expanded, aria-controls, etc.)
- Focus management (visible indicators, trap, restore)
- Screen reader announcements (aria-live regions)
- WCAG 2.2 AA compliance (contrast ratios, perceivable, operable, understandable, robust)

### 2. Prop Quality & Type Safety
**Reference**: `coding-standards.instructions.md` (TypeScript Standards, Component Props Pattern)
- Explicit types in `types.ts`
- No `any` usage (strict mode)
- `React.AriaAttributes` for ARIA props
- Discriminated unions for complex states
- No redundant `children` declaration (inherited from HTMLAttributes)
- Proper generic usage
- Callback signatures consistency

### 3. Composition Structure
**Reference**: `coding-standards.instructions.md` (File Organization Standards)
- **File Separation Rule**: Each logical component in separate file
- No multiple component definitions in single file
- Simple vs Compound component patterns
- Context structure minimal (no unnecessary nesting)

### 4. Headlessness
**Reference**: `copilot-instructions.md` (Core Rules - Headless Only)
- Zero styling opinions
- No CSS imports
- No className forcing
- No inline style patterns (only optional className pass-through)
- Behavior-only props

### 5. State & Logic Separation
**Reference**: `coding-standards.instructions.md` (State Management, Component Architecture)
- Controlled + Uncontrolled support (`value` + `defaultValue` + `onChange`)
- Proper cleanup (event listeners, timeouts, observers)
- No global mutations in render
- `useItemRegistry` usage (for keyboard navigation)
- RefObject<T> usage (not MutableRefObject)

### 6. Export & Tree-shake
**Reference**: `coding-standards.instructions.md` (Module Exports)
- Named exports only
- No side effects (no top-level subscriptions)
- `index.ts` re-export only
- **Dual export pattern** (compound + named exports)
- No generic aliases (Root, Item, Trigger) - component-specific names

### 7. Test Coverage
**Reference**: `testing-guidelines.instructions.md`
- 3 test files: `Component.test.tsx`, `Component.a11y.test.tsx`, `Component.integration.test.tsx`
- Coverage 90%+ (statements, branches, functions, lines)
- jest-axe mandatory (zero violations)
- Pre-test linting (`pnpm lint`) and type checking
- User behavior testing (not implementation)

### 8. Documentation Compliance
**Reference**: `docs-guidelines.instructions.md`
- **LiveCode**: Single interactive demo (basic inline styles for visibility)
- **AnatomyViewer**: data-glide-part attributes, parts array with descriptions
- **API Reference**: 3 tables per compound part (Props, Events, ARIA)
- **Code Examples**: Progressive, headless, static markdown blocks with line highlighting
- **Global Keyboard Interactions**: Complete keyboard behavior table
- Structure, Data Flow explanation

### 9. Performance
**Reference**: `coding-standards.instructions.md` (Performance Guidelines)
- Context values granular (no large value objects)
- Memoization in necessary places (useCallback, useMemo)
- Reduced anonymous function usage
- Early returns for conditional rendering

### 10. Code Standards
**Reference**: `coding-standards.instructions.md` (Naming Conventions, Code Style)
- Arrow functions usage
- Event handler naming (`handle` prefix)
- Boolean props (`is/has/should/can` prefix)
- Function size (50+ lines warning)
- Single responsibility
- Error handling (early return, console.warn patterns)

### 11. Layout and Format Consistency
**Reference**: Current file structure and project standards
- **Naming Pattern Compliance**: Consistent with existing component naming conventions
- **Import Order**: Aligned with project-wide grouping (React, external, internal)
- **Code Structure**: Follow organization patterns of similar components
- **Comment Style**: Consistent with existing JSDoc or inline comment styles
- **Spacing and Indentation**: Aligned with Prettier/ESLint configuration
- **Export Pattern**: Follow export patterns of components in same category (dual export consistency)

Output Structure:
```
REVIEW_SUMMARY:
  component: Accordion
  status: needs-improvement | compliant | partial
  score: 83/100
  findings:
    - [Accessibility][High] Trigger doesn't test Enter + Space together.
    - [Types][Medium] onChange callback parameter could use generic instead of union.
  missingArtifacts:
    - tests: Accordion.a11y.test.tsx
  plan:
    - step: Add keyboard handling for Space key in AccordionTrigger. (High)
      file: packages/glide/src/components/Accordion/AccordionTrigger.tsx
      rationale: WCAG keyboard access requirement.
    - step: Create a11y test for Enter/Space toggling. (High)
      file: packages/glide/src/components/Accordion/__tests__/Accordion.a11y.test.tsx
    - step: Refactor onChange to use generic value type. (Medium)
```

## Scoring System

Starting score: 100 (all categories always included)

**Severity-Based Deductions:**
- **High**: -8 (Accessibility violations, test deficiencies, public API errors)
- **Medium**: -4 (Performance optimizations, type improvements)
- **Low**: -2 (Code layout, naming conventions)
- **Critical Missing Artifact**: -10 (a11y test file, root component, types.ts)

**Examples:**
- Missing `Component.a11y.test.tsx`: -10 (Critical) + -8 (High - no a11y compliance)
- Keyboard navigation missing: -8 (High)
- Type `any` usage: -4 (Medium)
- Import order messy: -2 (Low)

No normalization; score remains directly in 0-100 range.

## Prioritization Criteria

**High Priority:**
- Accessibility breakages (APG pattern violations)
- Test deficiencies (especially a11y tests)
- Public API errors (type safety issues)
- Headless principle violations (styling opinions)

**Medium Priority:**
- Performance optimizations
- Type improvements
- Documentation deficiencies
- Export pattern inconsistencies

**Low Priority:**
- Cosmetic adjustments
- Naming convention improvements
- File organization tweaks

## Output Structure

**Format Rules:**
- Write in Markdown format (headings, lists, code blocks)
- Separate H2 heading per component (`## Component Review: Accordion`)
- Show code files in backticks (`file.tsx`)
- Severity indicators: `[HIGH]`, `[MEDIUM]`, `[LOW]`
- Readable spacing and proper indentation
- Use bold for important headings

### Markdown Block Per Component

```markdown
## Component Review: **Accordion**

**Status:** Needs Improvement  
**Score:** 83/100

---

### Findings

#### HIGH PRIORITY (2)

1. **[Accessibility]** Trigger doesn't test Enter + Space together.
   - **Ref:** `accessibility-guidelines.instructions.md` - Keyboard Support

2. **[Documentation]** AnatomyViewer missing, no data-glide-part attributes.
   - **Ref:** `docs-guidelines.instructions.md` - AnatomyViewer Integration

#### MEDIUM PRIORITY (1)

1. **[Types]** onChange callback parameter could use generic instead of union.
   - **Ref:** `coding-standards.instructions.md` - TypeScript Standards

---

### Missing Artifacts

- **Tests:** `Accordion.a11y.test.tsx`
- **Docs:** Global Keyboard Interactions table

---

### Action Plan

#### HIGH PRIORITY ACTIONS

**1. Add keyboard handling for Space key**
- **File:** `packages/glide/src/components/Accordion/AccordionTrigger.tsx`
- **Rationale:** WCAG keyboard access requirement
- **Reference:** `accessibility-guidelines.instructions.md`

**2. Create a11y test for Enter/Space toggling**
- **File:** `packages/glide/src/components/Accordion/__tests__/Accordion.a11y.test.tsx`
- **Rationale:** jest-axe mandatory testing
- **Reference:** `testing-guidelines.instructions.md`

**3. Add AnatomyViewer with data-glide-part attributes**
- **File:** `apps/docs/docs/Components/Accordion.mdx`
- **Rationale:** Required documentation structure
- **Reference:** `docs-guidelines.instructions.md`

#### MEDIUM PRIORITY ACTIONS

**4. Refactor onChange to use generic value type**
- **File:** `packages/glide/src/components/Accordion/types.ts`
- **Rationale:** Type safety improvement
- **Reference:** `coding-standards.instructions.md` - TypeScript Standards

---
```

### Global Plan (Cross-Component)

```markdown
## Global Refactoring Plan

### MEDIUM PRIORITY

**1. Consolidate shared aria utilities**
- **Create:** `hooks/useAriaIds.ts`
- **Rationale:** DRY principle, code reusability
- **Reference:** `coding-standards.instructions.md`

### HIGH PRIORITY

**2. Introduce test helper for keyboard events**
- **Rationale:** Standardize keyboard testing
- **Reference:** `testing-guidelines.instructions.md`

**3. Update all docs to include Global Keyboard Interactions table**
- **Rationale:** Required documentation section
- **Reference:** `docs-guidelines.instructions.md`

---
```

### Next Actions Summary

```markdown
## Next Actions (Top 5)

1. **[HIGH]** Fix all High severity accessibility issues (APG compliance)
2. **[HIGH]** Create missing a11y test files (jest-axe mandatory)
3. **[MEDIUM]** Implement dual export pattern for all compound components
4. **[HIGH]** Add Global Keyboard Interactions to all documentation
5. **[LOW]** Run `pnpm lint` and fix all violations

---

### Summary Statistics

| Metric | Value |
|--------|-------|
| **Total Components Reviewed** | 1 |
| **Average Score** | 83/100 |
| **High Priority Issues** | 2 |
| **Medium Priority Issues** | 1 |
| **Low Priority Issues** | 0 |
| **Missing Artifacts** | 2 |

---
```

## Plan Generation Rules

- At least one clear file + action per High issue
- No irrelevant or vague suggestions
- Each step in "single sentence change" format
- If more than 10 steps, move most critical first 10, rest to "backlog" sub-list
- **Reference relevant instruction file in each plan item**

## Limitations

- No styling addition, docs writing, or test file creation at this stage; only planning
- If code examples needed, brief diff hint format (e.g., `+ onKeyDown => handleSpace(event)`), not full file content
- All categories mandatory evaluation (no partial or STRICT mode concept)

## Review Process

1. **Read Instruction Files**: First read relevant `.github/instructions/*.instructions.md` files
2. **Component Analysis**: Examine `packages/glide/src/components/<Name>` contents
3. **Review Current Layout**: Look at existing format and layout of file to be reviewed (component, test, docs)
4. **Per Category**: Evaluate against rules in relevant instruction file
5. **Finding Format**: `[Category][Severity] Description. (Ref: relevant-file.instructions.md - section)`
6. **Generate Plan**: Actionable step + file + rationale (with instruction reference) per issue
7. **Layout Compliance**: Refactor suggestions should align with existing file layout (naming patterns, structure, formatting)

## Example Finding Format

```
[Accessibility][High] TooltipTrigger missing Escape key closing behavior. 
(Ref: accessibility-guidelines.instructions.md - Mandatory Rules - Keyboard Support)
```

**Notes:**
- Category tags in English, description in English
- Each finding must reference an instruction file
- Micro cosmetic improvements (e.g., import order) may not be reported if they don't create meaningful impact
