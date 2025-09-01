---
applyTo: '**/*'
---

# Revert Instructions - TK Headless

<identity>
You are reverting changes in TK Headless.
Reverts MUST be justified and documented.
ALWAYS explain why the revert is necessary.
</identity>

## Revert Process

### 1. When to Revert

**Valid reasons to revert:**

- Critical bugs in production
- Breaking changes that block development
- Performance regressions
- Security vulnerabilities introduced
- Accessibility regressions
- Failed deployments
- Incorrect merges

**NOT valid reasons:**

- Personal preference
- Minor issues (fix forward instead)
- Style disagreements
- Feature not complete (disable instead)

### 2. Revert Decision Matrix

| Severity | Impact               | Action              |
| -------- | -------------------- | ------------------- |
| Critical | Production broken    | Immediate revert    |
| High     | Major feature broken | Revert within hours |
| Medium   | Minor issues         | Fix forward         |
| Low      | Cosmetic issues      | Fix in next release |

### 3. Revert Process

#### Step 1: Identify Commit(s)

```bash
# Find the problematic commit
git log --oneline -n 20

# Show what changed
git show <commit-hash>

# Find merge commit
git log --merges --oneline
```

#### Step 2: Create Revert

```bash
# Revert single commit
git revert <commit-hash>

# Revert merge commit
git revert -m 1 <merge-commit-hash>

# Revert multiple commits
git revert <oldest-hash>..<newest-hash>
```

#### Step 3: Test Revert

```bash
# Ensure build works
pnpm build

# Run all tests
pnpm test

# Check specific functionality
pnpm test -- --testNamePattern="affected feature"
```

### 4. Commit Message Format

```
revert: <original commit subject>

This reverts commit <hash>.

Reason: <clear explanation of why>
Impact: <what was broken>
Action: <what needs to be done next>

Refs: #<issue-number>
```

#### Example Messages

```
revert: feat(button): add keyboard navigation support

This reverts commit abc123def456.

Reason: Keyboard navigation causes focus trap in Safari
Impact: Users cannot tab out of button groups
Action: Fix Safari compatibility and re-implement

Refs: #789
```

```
revert: fix(dialog): prevent focus trap memory leak

This reverts commit 123abc456def.

Reason: Fix introduced regression in focus restoration
Impact: Focus not returned to trigger element on close
Action: Implement proper cleanup without breaking restoration

Refs: #456
```

### 5. Post-Revert Actions

**REQUIRED after reverting:**

1. Create issue documenting the problem
2. Notify team of the revert
3. Plan proper fix
4. Add regression tests
5. Update tracking files

#### Issue Template

```markdown
## Revert: [Component] [Feature]

**Reverted Commit**: <hash>
**Reverted PR**: #<number>
**Reason**: <why reverted>

### Problem Description

[Detailed description of what went wrong]

### Steps to Reproduce

1. [Step 1]
2. [Step 2]
3. [Expected vs Actual]

### Proposed Solution

[How to fix it properly]

### Tests Needed

- [ ] Regression test for original issue
- [ ] Test for the problem that caused revert
- [ ] Edge case coverage
```

### 6. Re-implementing After Revert

**Before re-implementing:**

- [ ] Root cause understood
- [ ] Regression tests written
- [ ] Solution reviewed
- [ ] All environments tested
- [ ] Rollback plan ready

**Re-implementation PR description:**

```markdown
## Re-implementation of [Feature]

This re-implements #<original-pr> which was reverted in #<revert-pr>.

### Original Issue

[What the feature was supposed to fix]

### Why It Was Reverted

[What went wrong]

### What's Different This Time

[How this implementation avoids the problem]

### Testing

- [ ] Original functionality works
- [ ] Previous regression doesn't occur
- [ ] New edge cases covered
- [ ] Tested in all browsers
```

### 7. Emergency Revert Protocol

**For critical production issues:**

1. **Immediate Action** (< 5 minutes)

   ```bash
   # Create revert branch
   git checkout -b emergency-revert-<issue>

   # Revert the commit
   git revert --no-edit <commit>

   # Push and create PR
   git push origin emergency-revert-<issue>
   ```

2. **Fast-track Review**
   - Tag: `emergency`
   - Reviewers: Senior team members
   - Bypass: Normal CI if necessary

3. **Deploy**
   - Merge immediately after basic validation
   - Deploy to production
   - Monitor for resolution

4. **Follow-up**
   - Create detailed issue
   - Schedule post-mortem
   - Plan proper fix

### 8. Revert Prevention

**Avoid needing reverts:**

- Comprehensive testing
- Feature flags for risky changes
- Gradual rollouts
- Canary deployments
- Proper code review
- CI/CD validation

### 9. Common Revert Scenarios

#### Scenario: Breaking API Change

```bash
# Original commit introduced breaking change
git revert <commit> -m "revert: breaking API change in Button component"

# Fix: Add compatibility layer first
```

#### Scenario: Performance Regression

```bash
# Optimization caused memory leak
git revert <commit> -m "revert: performance optimization causing memory leak"

# Fix: Profile and fix leak, then re-apply
```

#### Scenario: Failed Merge

```bash
# Merge brought in incomplete feature
git revert -m 1 <merge-commit> -m "revert: premature merge of feature branch"

# Fix: Complete feature, then re-merge
```

### 10. Documentation

**Update after revert:**

- Changelog noting the revert
- Known issues section
- Migration guide if needed
- Team communication

<reminders>
REMEMBER: Reverts are not failures, they're safety measures.
REMEMBER: Always document WHY you're reverting.
REMEMBER: Fix forward when possible, revert when necessary.
REMEMBER: Update tracking per [Post-Task Instructions](./post-task.instructions.md).
</reminders>
