---
applyTo: '**/*.md, **/README.md, docs/**/*'
---

# Documentation Instructions - TK Headless

<identity>
You are writing documentation for TK Headless.
Documentation MUST be clear, complete, and accessible.
ALWAYS include code examples and accessibility information.
</identity>

## Documentation Standards

### 1. Documentation Structure

Every component MUST have:

````markdown
# Component Name

Brief description of what the component does and when to use it.

## Features

- Key feature 1
- Key feature 2
- Accessibility features

## Installation

```bash
npm install @tk-headless/component-name
```
````

## Basic Usage

[Simple example with code]

## API Reference

[Complete props documentation]

## Accessibility

[Keyboard navigation and ARIA details]

## Examples

[Multiple examples showing different use cases]

## Migration Guide

[If replacing existing component]

````

### 2. Props Documentation

**REQUIRED format for props tables:**

```markdown
## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'danger'` | `'primary'` | No | Visual variant of the component |
| `isDisabled` | `boolean` | `false` | No | Whether the component is disabled |
| `aria-label` | `string` | - | Yes* | Required for icon-only variants |
````

### 3. Code Examples

**Every example MUST:**

- Be complete and runnable
- Include TypeScript types
- Show accessibility features
- Include import statements

```typescript
// Good Example
import { Button } from '@tk-headless/button';
import { TrashIcon } from '@tk-headless/icons';

function DeleteButton() {
  return (
    <Button
      variant="danger"
      aria-label="Delete item"
      onClick={() => console.log('Deleted')}
    >
      <TrashIcon />
    </Button>
  );
}
```

### 4. Accessibility Documentation

**MUST include:**

#### Keyboard Navigation Table

```markdown
## Keyboard Navigation

| Key      | Action                       |
| -------- | ---------------------------- |
| `Tab`    | Move focus to/from component |
| `Enter`  | Activate the component       |
| `Space`  | Activate the component       |
| `Escape` | Close/cancel (if applicable) |
```

#### ARIA Properties

```markdown
## ARIA Support

| Property        | Usage                                     |
| --------------- | ----------------------------------------- |
| `role`          | Automatically set based on component type |
| `aria-label`    | Required for icon-only variants           |
| `aria-disabled` | Applied when `isDisabled` is true         |
| `aria-busy`     | Applied during loading states             |
```

### 5. Usage Examples

Include examples for:

1. **Basic Usage** - Simplest implementation
2. **With States** - Loading, disabled, error states
3. **Accessibility** - Screen reader friendly examples
4. **Advanced** - Complex integrations
5. **Common Patterns** - Real-world scenarios

### 6. Documentation Comments

Use JSDoc for all exports:

````typescript
/**
 * A fully accessible button component that supports multiple variants and states.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 *
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/button/} ARIA Button Pattern
 */
export interface ButtonProps {
  /**
   * The visual variant of the button.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger';
}
````

### 7. Migration Guides

When replacing or updating components:

````markdown
## Migration from v1 to v2

### Breaking Changes

1. `onPress` prop renamed to `onClick`
   ```diff
   - <Button onPress={handler}>
   + <Button onClick={handler}>
   ```
````

2. `disabled` prop renamed to `isDisabled`
   ```diff
   - <Button disabled>
   + <Button isDisabled>
   ```

### New Features

- Added `isLoading` prop
- Added keyboard shortcut support

````

### 8. Troubleshooting Section

Include common issues:
```markdown
## Troubleshooting

### Component not responding to keyboard
Ensure the component is not inside a `disabled` fieldset or form.

### Screen reader not announcing state
Check that you've included proper `aria-label` for icon-only buttons.

### TypeScript errors
Ensure you're using TypeScript 4.5+ and have strict mode enabled.
````

## Documentation Checklist

Before publishing:

- [ ] All props documented with types
- [ ] Basic usage example works
- [ ] Accessibility section complete
- [ ] Keyboard navigation documented
- [ ] Multiple examples provided
- [ ] TypeScript examples included
- [ ] Links to ARIA patterns included
- [ ] Reviewed for clarity
- [ ] Spell-checked
- [ ] Code examples tested

## Writing Style

1. **Be Clear**: Use simple, direct language
2. **Be Complete**: Don't assume prior knowledge
3. **Be Practical**: Focus on real use cases
4. **Be Accessible**: Consider all readers
5. **Be Consistent**: Follow the same format

<reminders>
REMEMBER: Documentation is the first user experience.
REMEMBER: Include accessibility in EVERY example.
REMEMBER: Code examples must be copy-paste ready.
REMEMBER: Update tracking per [Post-Task Instructions](./post-task.instructions.md).
</reminders>
