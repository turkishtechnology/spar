---
applyTo: 'package.json, **/package.json, .github/**/*.{yml,yaml}, *.config.{js,ts,mjs}, .*.{js,json}'
---

# Chore Instructions - TK Headless

<identity>
You are performing maintenance tasks for TK Headless.
Chores MUST NOT affect production code functionality.
ALWAYS keep the project clean and organized.
</identity>

## Chore Task Guidelines

### 1. What Qualifies as a Chore

**Valid chore tasks:**

- Dependency updates
- Configuration updates
- Development tool changes
- Documentation typo fixes
- File/folder reorganization
- Script improvements
- CI/CD maintenance
- License updates
- README updates
- Example updates

**NOT chores (use appropriate type):**

- Bug fixes (use `fix`)
- New features (use `feat`)
- Code style changes (use `style`)
- Performance improvements (use `perf`)
- Test additions (use `test`)

### 2. Dependency Updates

#### Update Process

```bash
# Check outdated packages
pnpm outdated

# Update dependencies safely
pnpm update --interactive --latest

# Update specific package
pnpm update typescript --latest

# Test after updates
pnpm build
pnpm test
```

#### Version Constraints

```json
{
  "dependencies": {
    "react": "^18.0.0", // Minor updates OK
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "~5.3.0", // Patch updates only
    "jest": "^29.0.0" // Minor updates OK
  }
}
```

### 3. Configuration Maintenance

#### ESLint Updates

```javascript
// .eslintrc.js updates
module.exports = {
  // Add new rules gradually
  rules: {
    'new-rule': 'warn', // Start as warning
    // After fixing issues, change to error
    'new-rule': 'error',
  },
};
```

#### TypeScript Config

```json
// tsconfig.json updates
{
  "compilerOptions": {
    // New compiler options
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

### 4. Documentation Maintenance

#### Fix Documentation Issues

- Broken links
- Outdated examples
- Typos and grammar
- Missing sections
- Incorrect information

#### Update Examples

```typescript
// Before: Outdated API
const button = new Button({ text: 'Click' });

// After: Current API
const button = <Button>Click</Button>;
```

### 5. Project Organization

#### File Structure Cleanup

```bash
# Move files to proper locations
packages/
  core/
    src/
      utils/        # Utilities here
      hooks/        # Hooks here
      components/   # Components here
      types/        # Types here
```

#### Remove Unused Files

- Old migration scripts
- Deprecated components
- Unused configs
- Temporary files
- Build artifacts

### 6. Script Improvements

#### Package.json Scripts

```json
{
  "scripts": {
    // Add helpful scripts
    "check": "pnpm lint && pnpm typecheck && pnpm test",
    "clean": "turbo run clean",
    "fresh": "pnpm clean && rm -rf node_modules && pnpm install"
  }
}
```

### 7. Development Tools

#### Git Hooks

```bash
# Update husky hooks
pnpm husky add .husky/pre-push "pnpm test"

# Update commitlint
echo "module.exports = { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js
```

#### Editor Config

```ini
# .editorconfig
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

### 8. License and Legal

#### Update Copyright

```markdown
Copyright (c) 2024-2025 TK Headless Contributors
```

#### Update License Year

```
MIT License

Copyright (c) 2025 TK Headless
```

### 9. CI/CD Maintenance

#### Update Actions

```yaml
# Update to latest versions
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: pnpm/action-setup@v2
```

#### Clean Old Workflows

- Remove unused workflows
- Consolidate similar jobs
- Update deprecated actions

### 10. Common Chore Examples

```bash
# Dependency update
chore(deps): update typescript to 5.3.3

# Dev dependency update
chore(deps-dev): update jest to v29.7.0

# Configuration update
chore(config): update eslint rules for consistency

# Documentation fix
chore(docs): fix broken links in README

# Project maintenance
chore: remove deprecated utility functions

# CI update
chore(ci): update GitHub Actions to v4
```

## Chore Checklist

Before committing chores:

- [ ] No production code affected
- [ ] All tests still pass
- [ ] Build still works
- [ ] Documentation accurate
- [ ] No breaking changes
- [ ] Dependencies compatible
- [ ] Scripts still function
- [ ] CI/CD still works

<reminders>
REMEMBER: Chores keep the project healthy.
REMEMBER: Small, focused chores are better.
REMEMBER: Test after dependency updates.
REMEMBER: Update tracking per [Post-Task Instructions](./post-task.instructions.md).
REMEMBER: For any new package or major version upgrade, pause and ask for approval in the chat before proceeding.
</reminders>
