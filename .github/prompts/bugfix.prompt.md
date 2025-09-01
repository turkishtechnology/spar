---
mode: 'agent'
description: 'Fix specific bugs in existing code'
tools: ['codebase', 'githubRepo']
---

# Bug Fix Prompt

<taskScope>
You are fixing a SPECIFIC bug or issue.
Focus ONLY on understanding and resolving the reported problem.
DO NOT add features or refactor unrelated code.
</taskScope>

## Bug Fix Process

<process>
1. **Understand the Issue**
   - Read the bug report carefully
   - Identify the expected vs actual behavior
   - Reproduce the issue if possible
   - Ask clarifying questions if needed

2. **Root Cause Analysis**
   - Locate the source of the problem
   - Understand why it's happening
   - Check for related issues

3. **Implement Fix**
   - Make the minimal change needed
   - Don't over-engineer the solution
   - Preserve existing functionality

4. **Verify Fix**
   - Ensure the bug is resolved
   - Check for regression
   - Add test to prevent recurrence
     </process>

## What to Include

<includeList>
- Direct fix for the reported issue
- Regression prevention (minimal test)
- Fix for closely related issues if found
- Brief inline comments explaining the fix
- Update to relevant error messages if needed
</includeList>

## What to Exclude

<excludeList>
- Feature additions
- Unrelated refactoring
- Style changes
- Performance optimizations (unless that's the bug)
- Documentation updates (unless directly related)
- Architecture changes
</excludeList>

## Fix Patterns

### State Management Bugs

```typescript
// BEFORE (buggy)
const [state, setState] = useState(initialValue);
setState(newValue); // Called during render

// AFTER (fixed)
const [state, setState] = useState(initialValue);
useEffect(() => {
  setState(newValue); // Moved to effect
}, [dependency]);
```

### Event Handler Bugs

```typescript
// BEFORE (buggy)
onClick={handleClick()} // Calls immediately

// AFTER (fixed)
onClick={() => handleClick()} // Wrapped in arrow function
// OR
onClick={handleClick} // Pass reference
```

### Focus Management Bugs

```typescript
// BEFORE (buggy)
elementRef.current.focus(); // May be null

// AFTER (fixed)
elementRef.current?.focus(); // Safe navigation
// OR
if (elementRef.current) {
  elementRef.current.focus();
}
```

## Verification Checklist

<checklist>
□ Bug is reproducible before fix
□ Bug is resolved after fix
□ No new issues introduced
□ Existing tests still pass
□ New test added to prevent regression
□ Edge cases considered
□ Error handling improved if relevant
</checklist>

<reminders>
REMEMBER: Fix ONLY the reported issue.
REMEMBER: Keep changes minimal and targeted.
REMEMBER: Don't refactor unrelated code.
REMEMBER: Add test to prevent regression.
REMEMBER: Verify no new issues introduced.
</reminders>
