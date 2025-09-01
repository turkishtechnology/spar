---
applyTo: '**/*.{ts,tsx,js,jsx}'
---

# Style Instructions - TK Headless

<identity>
You are improving code style in TK Headless.
Style changes MUST NOT affect functionality.
ALWAYS follow established patterns and conventions.
</identity>

## Code Style Guidelines

### 1. Style Change Scope

**Style changes include:**

- Code formatting (handled by Prettier)
- Import organization
- Variable naming improvements
- Comment formatting
- Whitespace consistency
- File organization
- Code structure improvements

**Style changes do NOT include:**

- Logic changes
- Behavior modifications
- API changes
- Performance optimizations

### 2. Import Organization

**REQUIRED import order:**

```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { render } from '@testing-library/react';
import clsx from 'clsx';

// 3. Internal packages
import { useButton } from '@tk-headless/hooks';

// 4. Relative imports - utilities
import { mergeProps } from '../../utils';

// 5. Relative imports - components
import { Icon } from '../Icon';

// 6. Relative imports - types
import type { ButtonProps } from './types';

// 7. Styles (if any)
import './styles.css';
```

### 3. Code Organization

**Component file structure:**

```typescript
// 1. Imports
import React from 'react';

// 2. Type definitions (if small)
interface LocalType {}

// 3. Constants
const DEFAULT_VALUE = 'default';

// 4. Helper functions
function helperFunction() {}

// 5. Main component
export const Component = () => {};

// 6. Sub-components (if any)
const SubComponent = () => {};

// 7. Display name
Component.displayName = 'Component';
```

### 4. Naming Conventions

**Consistency requirements:**

```typescript
// Components: PascalCase
export const ButtonGroup = () => {};

// Hooks: camelCase with 'use' prefix
export const useButtonGroup = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_ITEMS = 10;
const DEFAULT_TIMEOUT = 5000;

// Enums: PascalCase with UPPER_SNAKE_CASE values
enum ButtonSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
}

// Boolean variables: is/has/should prefix
const isDisabled = true;
const hasError = false;
const shouldFocus = true;
```

### 5. Comment Formatting

**Comment style guide:**

```typescript
/**
 * Component-level documentation
 * Multi-line for exports
 */
export const Component = () => {};

// Single-line comments for internal code
const internalVar = 'value'; // Inline comment when necessary

/*
 * Block comments for temporary notes
 * TODO: Remove after implementing feature X
 */

// Section separators
// ==================
// Helper Functions
// ==================
```

### 6. TypeScript Style

**Type definition patterns:**

```typescript
// Prefer interfaces for object types
interface ComponentProps {
  // Group related props
  // Visual props
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';

  // State props
  isDisabled?: boolean;
  isLoading?: boolean;

  // Event handlers
  onClick?: (event: React.MouseEvent) => void;
  onChange?: (value: string) => void;
}

// Use type for unions and utility types
type Size = 'sm' | 'md' | 'lg';
type ButtonElement = HTMLButtonElement | HTMLAnchorElement;
```

### 7. React Patterns

**Consistent React patterns:**

```typescript
// Destructure props with defaults
export const Component = ({
  variant = 'primary',
  size = 'md',
  ...rest
}: ComponentProps) => {
  // Hooks at the top
  const [state, setState] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Event handlers
  const handleClick = useCallback(() => {
    // Handler logic
  }, []);

  // Early returns for conditionals
  if (!isValid) {
    return null;
  }

  // Main render
  return <div {...rest} />;
};
```

### 8. File Naming

**File naming conventions:**

```
components/
  Button/
    Button.tsx          # Main component
    Button.test.tsx     # Tests
    Button.stories.tsx  # Storybook stories
    types.ts           # Type definitions
    index.ts           # Exports
    useButton.ts       # Hook
```

### 9. ESLint and Prettier

**Automated formatting:**

```bash
# Run before committing
pnpm lint        # Check for issues
pnpm lint:fix    # Auto-fix issues
pnpm format      # Format with Prettier
```

### 10. Common Style Issues

**Fix these when found:**

- Inconsistent indentation (use 2 spaces)
- Missing semicolons (add them)
- Unused imports (remove them)
- Console.logs in production code (remove)
- Commented out code (remove if obsolete)
- Magic numbers (extract to constants)
- Long lines (break at 80-100 chars)

## Style Change Checklist

Before committing style changes:

- [ ] No functionality changed
- [ ] All tests still pass
- [ ] ESLint passes
- [ ] Prettier formatted
- [ ] Import order correct
- [ ] Naming consistent
- [ ] Comments helpful
- [ ] No console.logs
- [ ] No commented code

<reminders>
REMEMBER: Style consistency improves readability.
REMEMBER: Don't mix style changes with logic changes.
REMEMBER: Follow existing patterns in the codebase.
REMEMBER: Update tracking per [Post-Task Instructions](./post-task.instructions.md).
</reminders>
