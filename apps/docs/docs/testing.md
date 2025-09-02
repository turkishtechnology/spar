---
sidebar_position: 3
---

# Test Strategy & Guidelines

Bu dokümantasyon headless komponent kütüphanesi için test stratejisini açıklar.

## 📊 Test Piramidi

```
    🔹 Unit Tests (Jest)
       ├─ Component logic
       ├─ Props handling
       ├─ Event handlers
       ├─ Edge cases
       └─ ~60% of total tests

    🔸 Integration Tests (Jest)
       ├─ Component interactions
       ├─ State management
       ├─ Form workflows
       └─ ~25% of total tests

    ♿ Accessibility Tests (Jest + jest-axe)
       ├─ WCAG compliance
       ├─ Keyboard navigation
       ├─ Screen reader support
       └─ ~15% of total tests
```

## 🎯 Test Categories

### 1. Unit Tests (`*.test.tsx`)

**Purpose**: Test individual component logic and props
**Location**: `src/components/*/tests/*.test.tsx`
**Tools**: Jest + Testing Library

```typescript
// Example: Button.test.tsx
describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      const { getByRole } = render(<Button>Test</Button>);
      expect(getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('should handle variant prop', () => {
      // Test prop variations
    });
  });

  describe('Event Handling', () => {
    it('should call onClick when clicked', () => {
      // Test event handlers
    });
  });
});
```

### 2. Accessibility Tests (`*.a11y.test.tsx`)

**Purpose**: Ensure WCAG compliance and screen reader compatibility
**Location**: `src/components/*/tests/*.a11y.test.tsx`
**Tools**: Jest + jest-axe + Testing Library

```typescript
// Example: Button.a11y.test.tsx
describe('Button Accessibility', () => {
  describe('Automated A11y Testing', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Test</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support Enter and Space keys', () => {
      // Test keyboard interactions
    });
  });
});
```

### 3. Integration Tests (`*.integration.test.tsx`)

**Purpose**: Test component interactions and workflows
**Location**: `src/components/*/tests/*.integration.test.tsx`
**Tools**: Jest + Testing Library

```typescript
// Example: Button.integration.test.tsx
describe('Button Integration Tests', () => {
  describe('Form Integration', () => {
    it('should work as form submit button', () => {
      // Test form workflows
    });
  });

  describe('State Management', () => {
    it('should work with external state', () => {
      // Test state interactions
    });
  });
});
```

## 🛠️ Test Setup

### Jest Configuration

```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Minimal, clean configuration
};
```

### Setup File

```typescript
// src/__tests__/setup/jest.setup.ts
import '@testing-library/jest-dom';

// React 19 compatibility
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Essential DOM mocks
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Minimal 26-line setup - no complexity!
```

## 📝 Test Commands

### Development

```bash
# Run all tests
pnpm test

# Watch mode for development
pnpm test:watch

# Run specific test types
pnpm test:unit
pnpm test:integration
pnpm test:a11y-unit

# Coverage report
pnpm test:coverage
```

### Bundle Size

```bash
# Check bundle size
pnpm size-check
```

## 📊 Coverage Requirements

### Global Thresholds

- **Branches**: 85%
- **Functions**: 85%
- **Lines**: 85%
- **Statements**: 85%

### Focus Areas

- **Unit Tests**: Component logic and props
- **Integration Tests**: Real-world usage scenarios
- **Accessibility Tests**: WCAG compliance and keyboard support

## 🧪 Testing Best Practices

### 1. Test Structure

```typescript
describe('ComponentName', () => {
  describe('Feature Group', () => {
    it('should do specific behavior', () => {
      // Arrange
      const props = { variant: 'primary' };

      // Act
      const { getByRole } = render(<Component {...props} />);

      // Assert
      expect(getByRole('button')).toBeInTheDocument();
    });
  });
});
```

### 2. Accessibility Testing

```typescript
// Always test WCAG compliance
it('should be accessible', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Test keyboard navigation
it('should support keyboard navigation', async () => {
  const { getByRole } = render(<Component />);
  const element = getByRole('button');

  element.focus();
  expect(element).toHaveFocus();

  fireEvent.keyDown(element, { key: 'Enter' });
  // Assert expected behavior
});
```

### 3. Headless Compliance

```typescript
// Ensure truly headless components
it('should be headless', () => {
  const { getByRole } = render(<Component />);
  const element = getByRole('button');

  // Should accept custom styling
  expect(element).not.toHaveStyle('background-color: red');
  expect(element.className).toBe(''); // No built-in styles
});
```

### 4. Integration Testing

```typescript
// Test real-world scenarios
it('should work in forms', () => {
  const mockSubmit = jest.fn();
  const { getByRole } = render(
    <form onSubmit={mockSubmit}>
      <Button type="submit">Submit</Button>
    </form>
  );

  fireEvent.click(getByRole('button'));
  expect(mockSubmit).toHaveBeenCalled();
});
```

## 🎯 Component Test Structure

```bash
src/components/Button/__tests__/
├── Button.test.tsx           # Unit tests
├── Button.a11y.test.tsx      # Accessibility tests
└── Button.integration.test.tsx # Integration tests

Each component follows this 3-file structure:
- Unit: Logic, props, events, edge cases
- A11y: WCAG, keyboard, screen readers
- Integration: Forms, state, real scenarios
```

## 📈 Metrics & Reporting

### Test Reports

- **Jest**: Console output and coverage reports
- **Coverage**: HTML report in `coverage/`
- **Bundle Size**: Monitored via size-limit

### Performance

- **Execution Time**: ~1 second for full test suite
- **File Count**: 6 test files (Button + Input)
- **Test Count**: 36 placeholder tests ready for implementation

## 🔧 Debugging Tests

### Jest Debugging

```bash
# Debug specific test
pnpm test Button.test.tsx

# Verbose output
pnpm test --verbose

# Watch mode
pnpm test:watch
```

## 📚 Key Tools

- **Jest**: Test runner and assertions
- **@testing-library/react**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **jest-axe**: Automated accessibility testing
- **jsdom**: DOM environment for tests

---

## 🚀 Ready for Manual Test Implementation

Bu minimal, temiz test altyapısı ile 17 komponentiniz için solid testler yazabilirsiniz!

**Test piramidi: Unit (60%) + Integration (25%) + A11y (15%) = Comprehensive coverage** 🎉
