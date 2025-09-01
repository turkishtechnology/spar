---
applyTo: '**/vite.config.{ts,js,mjs}, **/rollup.config.{ts,js,mjs}, **/tsconfig.json, **/package.json, turbo.json'
---

# Build System Instructions - TK Headless

<identity>
You are modifying the build system for TK Headless.
Build changes MUST maintain monorepo integrity.
ALWAYS test builds across all packages.
</identity>

## Build System Overview

TK Headless uses:

- **Turbo**: Monorepo build orchestration
- **PNPM**: Package management
- **TypeScript**: Compilation
- **Rollup/Vite**: Bundling
- **ESBuild**: Fast transforms

### 1. Build Configuration Files

**Key configuration files:**

```
.
├── turbo.json          # Turbo pipeline configuration
├── package.json        # Root package scripts
├── pnpm-workspace.yaml # PNPM workspace config
├── tsconfig.json       # Root TypeScript config
└── packages/
    └── [package]/
        ├── package.json     # Package-specific config
        ├── tsconfig.json    # Package TypeScript config
        └── vite.config.ts   # Build configuration
```

### 2. Turbo Pipeline Configuration

**Example turbo.json updates:**

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

### 3. Package.json Scripts

**Standard scripts for packages:**

```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf dist node_modules"
  }
}
```

### 4. TypeScript Configuration

**Base tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist"
  }
}
```

### 5. Vite Configuration

**Component library vite.config.ts:**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'TKHeadless',
      formats: ['es', 'cjs'],
      fileName: (format) => `tk-headless.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
```

### 6. Build Optimizations

#### Tree Shaking Setup

```typescript
// Ensure side-effect free code
{
  "sideEffects": false,
  "module": "./dist/tk-headless.es.js",
  "main": "./dist/tk-headless.cjs.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/tk-headless.es.js",
      "require": "./dist/tk-headless.cjs.js",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### 7. Build Tasks

#### Adding New Build Task

```bash
# 1. Update package.json
"scripts": {
  "build:minified": "vite build --mode production"
}

# 2. Update turbo.json
"build:minified": {
  "dependsOn": ["^build"],
  "outputs": ["dist/**"]
}

# 3. Test the pipeline
pnpm turbo run build:minified
```

### 8. Dependency Management

**Adding dependencies:**

```bash
# Add to specific package
pnpm add typescript -D --filter @tk-headless/button

# Add to root
pnpm add -w -D eslint

# Add to all packages
pnpm add react -r
```

### 9. Build Validation

**Pre-build checks:**

```bash
# Clean build
pnpm clean
pnpm install
pnpm build

# Verify outputs
ls -la packages/*/dist/

# Test package
npm pack --dry-run
```

### 10. CI Build Configuration

**GitHub Actions example:**

```yaml
name: Build
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run build test lint
```

## Build Checklist

Before committing build changes:

- [ ] All packages build successfully
- [ ] Types generate correctly
- [ ] Bundle sizes are acceptable
- [ ] Source maps generate
- [ ] Exports work (ESM and CJS)
- [ ] Dependencies are correct
- [ ] CI pipeline passes
- [ ] Documentation updated

<reminders>
REMEMBER: Test builds across ALL packages.
REMEMBER: Maintain backward compatibility.
REMEMBER: Keep build times fast.
REMEMBER: Update tracking per [Post-Task Instructions](./post-task.instructions.md).
</reminders>
