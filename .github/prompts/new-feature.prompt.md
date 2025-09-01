---
mode: 'agent'
description: 'Add new features to existing components'
---

# New Feature Prompt

<taskScope>
You are adding a NEW FEATURE to an existing component.
Focus on implementing the requested capability cleanly.
DO NOT refactor unrelated code or add unrequested features.
</taskScope>

## Feature Development Process

<process>
1. **Design API**
   - Define new props/methods
   - Ensure backward compatibility
   - Keep API intuitive and consistent

2. **Implementation**
   - Add feature incrementally
   - Maintain existing functionality
   - Follow established patterns

3. **Type Safety**
   - Update TypeScript interfaces
   - Add new types if needed
   - Ensure full type coverage

4. **Integration**
   - Ensure feature works with existing code
   - Handle edge cases
   - Add feature flags if needed
     </process>

## What to Include

<includeList>
- New feature implementation
- Updated TypeScript types
- New props/methods as needed
- Basic usage examples in comments
- Feature-specific error handling
- Backward compatibility
</includeList>

## What to Exclude

<excludeList>
- Unrelated refactoring
- Breaking changes (unless approved)
- Comprehensive tests (use /test command)
- Full accessibility (use /accessibility command)
- Extensive documentation (use /docs command)
- Performance optimizations (unless part of feature)
</excludeList>

## Common Feature Patterns

### Adding New Props

```typescript
export interface ComponentProps {
  // Existing props...

  // New feature props
  enableFeature?: boolean;
  featureConfig?: FeatureConfig;
  onFeatureChange?: (value: any) => void;
}
```

### Conditional Features

```typescript
const Component = ({ enableFeature = false, ...props }) => {
  // Feature-specific logic
  if (enableFeature) {
    // Feature implementation
  }

  // Existing component logic
};
```

### Feature Composition

```typescript
// Add as sub-component
Component.Feature = FeatureComponent;

// Or as hook
export const useComponentFeature = () => {
  // Feature logic
};
```

### Progressive Enhancement

```typescript
// Check for feature support
const isFeatureSupported = checkSupport();

// Graceful degradation
if (isFeatureSupported) {
  // Enhanced version
} else {
  // Basic version
}
```

## Integration Checklist

<checklist>
□ Feature works as specified
□ Backward compatibility maintained
□ TypeScript types updated
□ No breaking changes (or documented)
□ Edge cases handled
□ Feature can be disabled/optional
□ Follows component patterns
□ Error states handled
</checklist>

<reminders>
REMEMBER: Add ONLY the requested feature.
REMEMBER: Maintain backward compatibility.
REMEMBER: Update TypeScript types.
REMEMBER: Follow existing patterns.
REMEMBER: Keep changes focused.
</reminders>
