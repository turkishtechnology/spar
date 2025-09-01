---
applyTo: '**/*'
---

# Commit Message Instructions - TK Headless

<identity>
You are generating commit messages for TK Headless project.
ALWAYS follow Conventional Commits specification.
NEVER deviate from the format.
</identity>

## Format

```
type(scope): description

[optional body]

[optional footer(s)]
```

## Rules

### Type (REQUIRED)

MUST be one of:

- `feat`: New feature or component
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Changes to build system or dependencies
- `ci`: CI configuration changes
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Scope (OPTIONAL)

The scope SHOULD be the component or module name:

- Component names: `button`, `dialog`, `dropdown`, etc.
- Module names: `core`, `utils`, `hooks`, etc.
- Build tools: `deps`, `npm`, `turbo`, etc.

### Description (REQUIRED)

- MUST use imperative mood ("add" not "added" or "adds")
- MUST NOT capitalize first letter
- MUST NOT end with period
- MUST be under 50 characters
- MUST be meaningful and descriptive

### Body (OPTIONAL)

- Use when change requires additional context
- Wrap at 72 characters
- Explain WHAT and WHY, not HOW

### Footer (OPTIONAL)

- Breaking changes: Start with `BREAKING CHANGE:`
- Issue references: `Fixes #123` or `Closes #456`

## Examples

### ✅ CORRECT Examples

```
feat(button): add keyboard navigation support

Implemented full keyboard navigation including:
- Arrow key navigation
- Enter/Space activation
- Escape key handling

Fixes #123
```

```
fix(dialog): prevent focus trap memory leak

The focus trap was not properly cleaned up when the dialog
was unmounted, causing memory leaks in long-running applications.

Closes #456
```

```
docs(readme): update installation instructions
```

```
refactor(hooks): extract common keyboard logic

BREAKING CHANGE: useKeyboard hook now requires a ref parameter
```

```
test(button): add accessibility tests
```

```
perf(dropdown): optimize render performance
```

```
build(deps): upgrade react to v18.2.0
```

```
ci: add accessibility checks to pipeline
```

```
chore: update prettier config
```

### ❌ WRONG Examples

```
feat: Added new button component.
^ Wrong: Capitalized, past tense, ends with period
```

```
Fix dialog issue
^ Wrong: Missing type format, capitalized
```

```
feat(button): This adds keyboard navigation support to the button
^ Wrong: Not imperative mood, too long
```

```
FEAT(button): add keyboard support
^ Wrong: Type should be lowercase
```

```
update tests
^ Wrong: Missing type
```

## Special Cases

### Breaking Changes

```
feat(api): change component prop interface

BREAKING CHANGE: The `onPress` prop has been renamed to `onClick`
to align with React conventions. Update all Button usages.
```

### Reverting

```
revert: feat(button): add keyboard navigation support

This reverts commit abc123def456.

The keyboard navigation implementation caused
unexpected focus issues in Safari.
```

### Multiple Issues

```
fix(dialog): resolve focus and scroll issues

- Prevent body scroll when dialog is open
- Restore focus to trigger element on close
- Fix tab order in nested dialogs

Fixes #123, #124, #125
```

## Commit Message Linting

All commit messages are validated by Commitlint with Husky pre-commit hooks.

### Common Errors and Solutions

1. **"subject may not be empty"**
   - Add a description after type(scope):

2. **"type must be one of [feat, fix, docs, ...]"**
   - Use a valid type from the list above

3. **"subject must not be sentence-case"**
   - Use lowercase: `add feature` not `Add feature`

4. **"subject must not end with full stop"**
   - Remove the period at the end

5. **"header must not be longer than 72 characters"**
   - Shorten your commit message

## Best Practices

1. **Atomic Commits**: One logical change per commit
2. **Meaningful History**: Each commit should be understandable standalone
3. **Link Issues**: Always reference related issues
4. **Document Breaking Changes**: Be explicit about migration needs
5. **Use Conventional Scope**: Help with changelog generation

<reminders>
REMEMBER: Commit messages are documentation for future developers.
REMEMBER: Good commit messages save debugging time.
REMEMBER: Consistency is key for automation and tooling.
</reminders>
