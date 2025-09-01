---
applyTo: '.github/progress.md, .github/feature-tasks.md'
---

# Post-Task Instructions for TK Headless

<identity>
You have completed a task for TK Headless.
You MUST update all tracking files to reflect the current state.
NEVER leave tracking files outdated after completing work.
</identity>

## Required Updates After Task Completion

### 1. Update Feature Tasks File

When you complete any subtask, you MUST update `.github/feature-tasks.md`:

```markdown
# For completed subtasks, change:

- [ ] Write unit tests

# To:

- [x] Write unit tests
```

**Checkbox Format Rules:**

- `- [ ]` = Not completed (with space between brackets)
- `- [x]` = Completed (lowercase 'x', no spaces)
- NEVER use `[X]` (uppercase) or `[]` (no space)

### 2. Update Progress File

After completing significant milestones, update `.github/progress.md`:

1. **Update Component Status Table**:
   - Change status from "Not Started" to "In Progress" when work begins
   - Change from "In Progress" to "Complete" when all subtasks finish
   - Update individual columns (Design, Implementation, Tests, etc.)

2. **Add to Recent Updates Section**:

   ```markdown
   ### YYYY-MM-DD

   - **Component Name**: Brief description of what was completed
     - Completed: List of completed items
     - In Progress: List of items still being worked on
   ```

### 3. Task State Transitions

**When Starting a Task:**

1. Change status from "Planned" to "In Progress"
2. Add your name/identifier as Assignee
3. Update the first subtask checkbox when you begin

**During Task Progress:**

1. Mark subtasks with `[x]` as you complete them
2. Add notes to "Implementation Notes" section if needed
3. Update progress.md if completing major milestones

**When Completing a Task:**

1. Ensure ALL subtasks are marked `[x]`
2. Change status from "In Progress" to "Complete"
3. Move the entire task to "Completed Tasks" section
4. Update progress.md component row to "Complete"
5. Add completion date to the task

### 4. Example Update Flow

**Before starting Button tests:**

```markdown
- [ ] Write unit tests
- [ ] Write accessibility tests with jest-axe
```

**After completing Button tests:**

```markdown
- [x] Write unit tests
- [x] Write accessibility tests with jest-axe
```

**In progress.md, update:**

```markdown
| Button | Complete | Complete | Complete | In Progress | Complete | In Progress |
```

**Add to Recent Updates:**

```markdown
### 2025-01-09

- **Button Component**: Completed test suite
  - Completed: Unit tests with 95% coverage, accessibility tests pass with jest-axe
  - In Progress: Documentation and usage examples
```

### 5. Commit Message for Updates

When committing tracking file updates, use:

```
chore(progress): update task tracking for [component] [subtask]

- Updated feature-tasks.md checkboxes
- Updated progress.md status table
- Added recent update entry
```

## Critical Rules

<updateRules>
1. ALWAYS update immediately after completing work
2. NEVER leave checkboxes unchecked if work is done
3. ALWAYS use lowercase 'x' in checkboxes: `[x]`
4. ALWAYS include space in empty checkboxes: `[ ]`
5. ALWAYS update both feature-tasks.md AND progress.md
6. ALWAYS add entries to Recent Updates for significant completions
7. NEVER update future dates - only use current date
</updateRules>

## Validation Checklist

Before finishing your work session, verify:

- [ ] All completed subtasks are marked with `[x]`
- [ ] Progress.md table reflects current state
- [ ] Recent Updates section has been updated
- [ ] Task status is accurate (Planned/In Progress/Complete)
- [ ] Last Updated date is current

<reminders>
REMEMBER: Accurate tracking enables effective project management.
REMEMBER: Other developers rely on these files being current.
REMEMBER: Update tracking BEFORE committing code changes.
</reminders>
