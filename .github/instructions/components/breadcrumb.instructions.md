---
applyTo: '**/Breadcrumb/**/*.{ts,tsx}'
---

# Breadcrumb Component Instructions - TK Headless

<identity>
This document defines the requirements and specifications for the TK Headless Breadcrumb component.
The Breadcrumb MUST follow slot-based pattern for maximum customization.
ALWAYS implement with full accessibility support.
NEVER add visual styles - component must remain headless.
</identity>

## Component Architecture

### Core Pattern: Full Slot Pattern

```tsx
<Breadcrumb aria-label='Breadcrumb navigation'>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href='/'>Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator>/</Breadcrumb.Separator>
    <Breadcrumb.Item>
      <Breadcrumb.Link href='/products'>Products</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator>/</Breadcrumb.Separator>
    <Breadcrumb.Item current>
      <Breadcrumb.Text>Laptops</Breadcrumb.Text>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb>
```

### Component Structure

```typescript
// Core Components
Breadcrumb
├── Breadcrumb.List
├── Breadcrumb.Item
├── Breadcrumb.Link
├── Breadcrumb.Text
└── Breadcrumb.Separator
```

## API Specifications

### Breadcrumb (Root)

```typescript
interface BreadcrumbProps {
  /** Optional custom label for screen readers */
  'aria-label'?: string;
  /** ID for labelling breadcrumb via aria-labelledby */
  'aria-labelledby'?: string;
  /** Reference to root nav element */
  ref?: React.Ref<HTMLElement>;
  /** Child elements - typically Breadcrumb.List */
  children: React.ReactNode;
  /** Controlled: Current active item index */
  activeIndex?: number;
  /** Controlled: Handler for active item changes */
  onActiveIndexChange?: (index: number) => void;
  /** Controlled: Array of breadcrumb items */
  items?: Array<{
    /** Item label */
    label: string;
    /** Item href - if not provided, renders as text */
    href?: string;
    /** Optional custom render function */
    render?: (item: { label: string; href?: string; isCurrent: boolean }) => React.ReactNode;
  }>;
  /** Default active index for uncontrolled usage */
  defaultActiveIndex?: number;
  /** Custom separator - can be string or ReactNode */
  separator?: React.ReactNode;
}

// Hook for uncontrolled usage
interface UseBreadcrumbProps {
  /** Default active index */
  defaultActiveIndex?: number;
  /** Items array */
  items?: BreadcrumbProps['items'];
}

interface UseBreadcrumbReturn {
  /** Current active index */
  activeIndex: number;
  /** Set active index */
  setActiveIndex: (index: number) => void;
  /** Get props for item */
  getItemProps: (index: number) => {
    isCurrent: boolean;
    href?: string;
    onClick: (e: React.MouseEvent) => void;
  };
}
```

### Breadcrumb.List

```typescript
interface BreadcrumbListProps {
  /** Child elements - typically Breadcrumb.Item components */
  children: React.ReactNode;
  /** Reference to list element */
  ref?: React.Ref<HTMLOListElement>;
}
```

### Breadcrumb.Item

```typescript
interface BreadcrumbItemProps {
  /** Whether this is the current/active breadcrumb */
  current?: boolean;
  /** Child elements - typically Link or Text */
  children: React.ReactNode;
  /** Reference to list item element */
  ref?: React.Ref<HTMLLIElement>;
}
```

### Breadcrumb.Link

```typescript
interface BreadcrumbLinkProps {
  /** URL for the breadcrumb link */
  href: string;
  /** Child elements - typically text content */
  children: React.ReactNode;
  /** Reference to anchor element */
  ref?: React.Ref<HTMLAnchorElement>;
  /** Optional click handler */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}
```

### Breadcrumb.Text

```typescript
interface BreadcrumbTextProps {
  /** Child elements - typically text content */
  children: React.ReactNode;
  /** Reference to text span element */
  ref?: React.Ref<HTMLSpanElement>;
}
```

### Breadcrumb.Separator

```typescript
interface BreadcrumbSeparatorProps {
  /** Child elements - typically a separator character or icon */
  children: React.ReactNode;
  /** Reference to separator element */
  ref?: React.Ref<HTMLLIElement>;
}
```

## Accessibility Requirements

### WAI-ARIA Roles and States

- Root element: `<nav>` with `aria-label` or `aria-labelledby`
- List element: `<ol>` with role="list"
- List items: `<li>` with appropriate roles
- Current item: `aria-current="page"`
- Separators: `aria-hidden="true"`

### Keyboard Navigation

- Links MUST be focusable via Tab key
- MUST maintain logical tab order
- Current/last item SHOULD NOT be interactive

### Screen Reader Support

- MUST announce "Current page" for active item
- MUST properly convey navigation hierarchy
- Separators MUST be hidden from screen readers

## State Management

### Item State

```typescript
interface BreadcrumbItemState {
  isCurrent: boolean;
  isInteractive: boolean;
}
```

## Usage Examples

### Usage Examples

#### Uncontrolled Usage (with Hook)

```tsx
const BreadcrumbExample = () => {
  const { activeIndex, getItemProps } = useBreadcrumb({
    defaultActiveIndex: 0,
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Laptops' },
    ],
  });

  return (
    <Breadcrumb aria-label='Navigation'>
      <Breadcrumb.List>
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            <Breadcrumb.Item {...getItemProps(index)}>
              {item.href ? (
                <Breadcrumb.Link href={item.href}>{item.label}</Breadcrumb.Link>
              ) : (
                <Breadcrumb.Text>{item.label}</Breadcrumb.Text>
              )}
            </Breadcrumb.Item>
            {index < items.length - 1 && <Breadcrumb.Separator>/</Breadcrumb.Separator>}
          </React.Fragment>
        ))}
      </Breadcrumb.List>
    </Breadcrumb>
  );
};
```

#### Controlled Usage

```tsx
const BreadcrumbExample = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Laptops' },
  ];

  return (
    <Breadcrumb
      aria-label='Navigation'
      items={items}
      activeIndex={activeIndex}
      onActiveIndexChange={setActiveIndex}
      separator='/'
    />
  );
};
```

#### Basic Slot Pattern Usage

```tsx
<Breadcrumb aria-label='Navigation'>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href='/'>Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator>/</Breadcrumb.Separator>
    <Breadcrumb.Item current>
      <Breadcrumb.Text>Products</Breadcrumb.Text>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb>
```

### With Custom Separator

```tsx
<Breadcrumb aria-label='Navigation'>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href='/'>Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator>
      <ChevronRight aria-hidden='true' />
    </Breadcrumb.Separator>
    <Breadcrumb.Item current>
      <Breadcrumb.Text>Products</Breadcrumb.Text>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb>
```

## Test Requirements

### Unit Tests

1. Component Rendering
   - Renders all subcomponents correctly
   - Applies correct ARIA attributes
   - Handles empty/missing items gracefully

2. Interaction Tests
   - Link clicks work as expected
   - Current item is non-interactive
   - Keyboard navigation functions properly

3. Accessibility Tests
   - Screen reader output is correct
   - Keyboard focus management works
   - ARIA attributes are present and correct

### Integration Tests

1. Custom Separator Tests
   - Renders custom separators correctly
   - Maintains accessibility with custom separators

2. Dynamic Breadcrumb Tests
   - Handles dynamic item updates
   - Maintains accessibility during updates

## Error Handling

### Invalid Props

```typescript
// Example validation using development-only checks
if (process.env.NODE_ENV === 'development') {
  const isInvalidCurrentProp = current && !isLastItem;
  // Throw error in development, fail silently in production
  if (isInvalidCurrentProp) {
    throw new Error('[Breadcrumb]: Current prop should only be used on the last breadcrumb item');
  }
}
```

## Performance Considerations

1. Memoization
   - Memoize separator component if custom
   - Optimize for frequent route changes

2. Bundle Size
   - Keep core bundle minimal
   - Separate complex features

## Customization API

### Custom Separator Example

```tsx
const CustomSeparator = () => (
  <Breadcrumb.Separator>
    <span aria-hidden='true'>•</span>
  </Breadcrumb.Separator>
);
```

<reminders>
REMEMBER: Component must remain unstyled
REMEMBER: Accessibility is non-negotiable
REMEMBER: Full slot pattern must be maintained
REMEMBER: TypeScript types are required
REMEMBER: Screen reader support is essential
</reminders>
