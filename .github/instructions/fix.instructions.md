---
applyTo: 'packages/**/src/**/*.{ts,tsx}'
---

# Bug Fix Instructions - TK Headless

<identity>
You are fixing a bug in TK Headless.
Fixes MUST NOT introduce regressions.
ALWAYS understand the root cause before fixing.
</identity>

## Bug Fix Process

### 1. Bug Analysis

**BEFORE writing any fix:**

1. Reproduce the bug consistently
2. Identify the root cause
3. Check for similar issues in other components
4. Understand why the bug exists
5. Plan the minimal fix required

### 2. Reproduction Steps

Document EXACTLY how to reproduce:

```markdown
## Bug Reproduction

1. [Step 1 with specific actions]
2. [Step 2 with expected behavior]
3. [Step 3 showing actual behavior]

Environment:

- Browser: [Name and version]
- Screen reader: [If applicable]
- OS: [Operating system]
```

### 3. Fix Requirements

**Every bug fix MUST:**

- [ ] Include a failing test that reproduces the bug
- [ ] Make the test pass with minimal changes
- [ ] Not break existing tests
- [ ] Not reduce accessibility
- [ ] Not introduce TypeScript errors
- [ ] Include regression tests

### 4. Common Bug Categories

#### Accessibility Bugs

- Missing ARIA attributes
- Incorrect roles
- Broken keyboard navigation
- Focus management issues
- Screen reader announcement problems

**Fix Pattern:**

```typescript
// BEFORE: Missing aria-label
<button onClick={handleClick}>
  <Icon />
</button>

// AFTER: Proper aria-label
<button onClick={handleClick} aria-label="Delete item">
  <Icon />
</button>
```

#### TypeScript Bugs

- Type mismatches
- Missing type exports
- Incorrect generic constraints
- Union type issues

**Fix Pattern:**

```typescript
// BEFORE: Incorrect type
interface Props {
  value: string;
}

// AFTER: Correct union type
interface Props {
  value: string | number;
}
```

#### State Management Bugs

- Race conditions
- Memory leaks
- Stale closures
- Incorrect state updates

**Fix Pattern:**

```typescript
// BEFORE: Memory leak
useEffect(() => {
  window.addEventListener('resize', handler);
  // Missing cleanup!
}, []);

// AFTER: Proper cleanup
useEffect(() => {
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

### 5. Testing the Fix

**Required tests:**

1. **Regression Test**: Ensures the bug doesn't return
2. **Edge Case Tests**: Related scenarios that might break
3. **Integration Tests**: Component still works with others
4. **Accessibility Tests**: No a11y regressions

Example test structure:

```typescript
describe('ComponentName Bug Fixes', () => {
  it('should handle [specific bug scenario]', () => {
    // Arrange: Set up the bug condition
    // Act: Trigger the bug
    // Assert: Verify the fix works
  });

  it('should not regress when [related scenario]', () => {
    // Test edge cases
  });
});
```

### 6. Validation Checklist

Before submitting the fix:

- [ ] Bug no longer reproduces
- [ ] All existing tests still pass
- [ ] New test fails without the fix
- [ ] New test passes with the fix
- [ ] No TypeScript errors introduced
- [ ] No accessibility regressions
- [ ] No performance regressions

### 7. Documentation

Update relevant documentation:

- Add note to component docs if behavior changed
- Update migration guide if breaking change
- Add to troubleshooting section if common issue

### 8. Commit Message

Follow conventional commits:

```
fix(component): brief description of what was broken

The component was doing X when it should do Y.
This was caused by [root cause].

Fixed by [brief explanation of fix].

Fixes #123
```

## Common Pitfalls to Avoid

1. **Over-fixing**: Don't refactor unrelated code
2. **Under-testing**: Always add regression tests
3. **Breaking changes**: Maintain backward compatibility
4. **Quick patches**: Fix the root cause, not symptoms
5. **Missing edge cases**: Consider all usage scenarios

## Emergency Hotfixes

For critical production bugs:

1. Create minimal fix branch from main
2. Fix ONLY the critical issue
3. Fast-track review process
4. Cherry-pick to development branches
5. Document in hotfix log

<reminders>
REMEMBER: Every bug is a missing test.
REMEMBER: Fix the cause, not the symptom.
REMEMBER: Regression tests prevent future bugs.
REMEMBER: Update tracking per [Post-Task Instructions](./post-task.instructions.md).
</reminders>
