---
applyTo: '.github/workflows/*.{yml,yaml}, .github/actions/**/*.{yml,yaml}'
---

# CI/CD Instructions - TK Headless

<identity>
You are configuring CI/CD for TK Headless.
CI changes MUST maintain reliability and speed.
ALWAYS include accessibility checks in CI.
</identity>

## CI/CD Pipeline Overview

### 1. GitHub Actions Workflows

**Required workflows:**

```
.github/workflows/
├── ci.yml              # Main CI pipeline
├── release.yml         # Release automation
├── accessibility.yml   # A11y checks
├── size-check.yml      # Bundle size monitoring
└── codeql.yml          # Security scanning
```

### 2. Main CI Pipeline

**.github/workflows/ci.yml:**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    types: [opened, synchronize, reopened]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: pnpm lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: pnpm typecheck

  test:
    name: Test
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20]
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
        with:
          node-version: ${{ matrix.node }}
      - run: pnpm test:ci
      - uses: codecov/codecov-action@v3

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: pnpm build
      - uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: packages/*/dist

  accessibility:
    name: Accessibility
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: pnpm test:a11y
```

### 3. Reusable Setup Action

**.github/actions/setup/action.yml:**

```yaml
name: Setup
description: Setup Node.js and install dependencies

inputs:
  node-version:
    description: Node.js version
    default: '18'

runs:
  using: composite
  steps:
    - uses: pnpm/action-setup@v2
      with:
        version: 8

    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: pnpm

    - name: Install dependencies
      shell: bash
      run: pnpm install --frozen-lockfile
```

### 4. Accessibility Checks

**.github/workflows/accessibility.yml:**

```yaml
name: Accessibility

on:
  pull_request:
    paths:
      - 'packages/**/*.tsx'
      - 'packages/**/*.ts'

jobs:
  a11y-tests:
    name: A11y Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup

      - name: Run accessibility tests
        run: pnpm test:a11y

      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: ./.lighthouserc.json

      - name: Pa11y tests
        run: pnpm pa11y:ci
```

### 5. Bundle Size Monitoring

**.github/workflows/size-check.yml:**

```yaml
name: Size Check

on:
  pull_request:
    paths:
      - 'packages/**'
      - 'package.json'
      - 'pnpm-lock.yaml'

jobs:
  size:
    name: Bundle Size
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup

      - name: Build packages
        run: pnpm build

      - name: Check bundle size
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          build_script: build
```

### 6. Release Automation

**.github/workflows/release.yml:**

```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: ./.github/actions/setup

      - name: Create Release PR
        uses: changesets/action@v1
        with:
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 7. Test Configuration

**CI-specific test settings:**

```json
{
  "scripts": {
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:a11y": "jest --testMatch='**/*.a11y.test.{ts,tsx}'",
    "pa11y:ci": "pa11y-ci --config .pa11yci.json"
  }
}
```

### 8. Caching Strategy

**Optimize CI speed:**

```yaml
- name: Cache pnpm store
  uses: actions/cache@v3
  with:
    path: ~/.pnpm-store
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-

- name: Cache turbo
  uses: actions/cache@v3
  with:
    path: .turbo
    key: ${{ runner.os }}-turbo-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-turbo-
```

### 9. Quality Gates

**Required checks for merge:**

- All tests pass (90% coverage)
- No TypeScript errors
- No ESLint errors
- Accessibility tests pass
- Bundle size within budget
- No security vulnerabilities

### 10. CI Best Practices

1. **Fast feedback**: Keep CI under 10 minutes
2. **Parallel jobs**: Run independent tasks concurrently
3. **Fail fast**: Exit on first failure
4. **Clear output**: Helpful error messages
5. **Reproducible**: Same results locally and in CI

## CI Checklist

Before committing CI changes:

- [ ] Workflow syntax is valid
- [ ] All required checks included
- [ ] Caching optimized
- [ ] Secrets properly used
- [ ] Documentation updated
- [ ] Test locally with `act`
- [ ] No security issues
- [ ] Performance acceptable

<reminders>
REMEMBER: CI should catch issues before merge.
REMEMBER: Keep CI fast for developer experience.
REMEMBER: Accessibility checks are MANDATORY.
REMEMBER: Update tracking per [Post-Task Instructions](./post-task.instructions.md).
</reminders>
