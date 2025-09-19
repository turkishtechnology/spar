# Breadcrumb — Glide Headless Instructions

## 1. Component Overview

The Breadcrumb component provides a navigation trail showing the hierarchical path from the root to the current page. It helps users understand their location within the site structure and enables easy navigation to parent pages.

### Purpose and Use Cases
- Show hierarchical navigation trail in content hierarchies
- Enable navigation to parent pages with clear visual indication
- Provide navigation landmark for assistive technologies
- Support SEO through structured navigation data

### Compound Component Structure
```tsx
// Basic usage
<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/home">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/products">Products</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Current Page</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>

// With routing integration
<Breadcrumb.Root onNavigate={(href, event) => {
  event.preventDefault();
  router.push(href);
}}>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/home">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/products" disabled={!hasAccess}>Products</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="https://external.com" isExternal>External</Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>

// With custom components (polymorphic)
<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link as={NextLink} href="/home">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator as="span">→</Breadcrumb.Separator>
    <Breadcrumb.Item>
      <Breadcrumb.Page as="strong">Current Page</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

### Key Differentiators
- Zero visual styling - pure behavior and accessibility
- Compound pattern for maximum flexibility
- Automatic ARIA annotations and navigation landmark
- Built-in separator handling with screen reader optimization
- Current page detection and proper ARIA-current annotation
- SSR-safe with deterministic IDs

## 2. API

### Breadcrumb.Root
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'nav'` | Polymorphic element type |
| `children` | `ReactNode` | Yes | - | Breadcrumb content |
| `aria-label` | `string` | No | `'Breadcrumb'` | Accessible name for navigation landmark |
| `onNavigate` | `(href: string, event: MouseEvent) => void` | No | - | Navigation event handler for routing integration |
| `disabled` | `boolean` | No | `false` | Disable all breadcrumb navigation |

### Breadcrumb.List
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'ol'` | Polymorphic element type |
| `children` | `ReactNode` | Yes | - | List items content |

### Breadcrumb.Item
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'li'` | Polymorphic element type |
| `children` | `ReactNode` | Yes | - | Item content (Link or Page) |

### Breadcrumb.Link
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'a'` | Polymorphic element type |
| `href` | `string` | No | - | Link destination |
| `children` | `ReactNode` | Yes | - | Link text content |
| `disabled` | `boolean` | No | `false` | Disable this specific link |
| `isExternal` | `boolean` | No | `false` | Indicates external link (adds security attributes) |
| `target` | `string` | No | - | Link target attribute |
| `rel` | `string` | No | - | Link relationship attribute |
| `onPress` | `(event: PressEvent) => void` | No | - | Press event handler (overrides default navigation) |

### Breadcrumb.Page
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'span'` | Polymorphic element type |
| `children` | `ReactNode` | Yes | - | Current page name |

### Breadcrumb.Separator
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `ElementType` | No | `'li'` | Polymorphic element type |
| `children` | `ReactNode` | No | - | Custom separator content |
| `aria-hidden` | `boolean` | No | `true` | Hide from screen readers |

**Ref Forwarding**: All components forward refs to their underlying DOM elements.

**Controlled/Uncontrolled**: Breadcrumb is stateless - no controlled/uncontrolled modes.

**TypeScript Definitions**: 
```tsx
// Generic polymorphic component types
interface BreadcrumbRootProps<T extends ElementType = 'nav'> extends ComponentPropsWithoutRef<T> {
  as?: T;
  onNavigate?: (href: string, event: MouseEvent) => void;
  disabled?: boolean;
}

interface BreadcrumbLinkProps<T extends ElementType = 'a'> extends ComponentPropsWithoutRef<T> {
  as?: T;
  href?: string;
  disabled?: boolean;
  isExternal?: boolean;
  onPress?: (event: PressEvent) => void;
}

// Event handler types
type NavigationHandler = (href: string, event: MouseEvent) => void;
type PressEvent = MouseEvent | KeyboardEvent;
```

## 3. Behavior Matrix

| State | Trigger | Result | ARIA/DOM Update |
|-------|---------|--------|-----------------|
| Initial | Mount | Render navigation structure | `role="navigation"`, `aria-label="Breadcrumb"` applied to Root |
| Link Focus | Tab navigation | Focus moves to link | Standard focus behavior, `data-focus-visible="true"` applied |
| Link Activation | Click/Enter/Space | Navigate to href or trigger onPress | Standard link activation or custom handler |
| Current Page | Page component used | Marks current location | `aria-current="page"` applied, `data-current="true"` |
| Separator | Render | Visual separator | `aria-hidden="true"` prevents screen reader announcement |
| Disabled Root | `disabled=true` | Disables all links | `aria-disabled="true"` on nav, `data-disabled="true"` |
| Disabled Link | `disabled=true` | Disables specific link | `aria-disabled="true"` on link, `data-disabled="true"` |
| External Link | `isExternal=true` | Adds security attributes | `target="_blank"`, `rel="noopener noreferrer"`, `data-external="true"` |
| Navigation Event | Link click with onNavigate | Custom navigation handling | onNavigate called with href and event |
| Position Calculation | Item registration | Determines item position | `data-position="first|middle|last"` applied |

## 4. Accessibility

### Roles
- **Root**: `navigation` role (semantic `<nav>` element)
- **List**: `list` role (semantic `<ol>` element)
- **Item**: `listitem` role (semantic `<li>` element)
- **Link**: `link` role (semantic `<a>` element)
- **Page**: No specific role (semantic `<span>` element)
- **Separator**: `listitem` role with `aria-hidden="true"`

### Keyboard Navigation
- **Tab/Shift+Tab**: Navigate through breadcrumb links (skip disabled links)
- **Enter**: Activate focused link (unless disabled)
- **Space**: Activate focused link (if implemented as button, unless disabled)

### Focus Management
- Links receive focus in tab order (disabled links are skipped)
- Focus indicators must be visible with `data-focus-visible`
- No focus trapping required (standard navigation)
- Current page (non-link) should not be focusable
- Disabled links should not be focusable (`tabindex="-1"`)

### Screen Reader Announcements
- Navigation landmark announced as "Breadcrumb navigation"
- Each link announced with its accessible name
- Separators hidden from screen reader (`aria-hidden="true"`)
- Current page announced with "current page" suffix via `aria-current="page"`
- List structure provides context ("list with N items", "item N of N")
- Disabled links announced as "unavailable" or "disabled"
- External links announced with security context

### Name/Role/Value Exposure
- **Navigation**: Accessible name via `aria-label="Breadcrumb"`
- **Links**: Accessible name from text content or `aria-label`
- **Current Page**: `aria-current="page"` indicates current location
- **List Structure**: Semantic HTML provides hierarchical context

### Accessibility Compliance
- WCAG 2.2 AA compliant
- Section 508 compliant
- Follows ARIA Authoring Practices Guide breadcrumb pattern
- All interactive elements have accessible names
- Keyboard accessible with proper focus management

## 5. Implementation Architecture

### State Hooks Design
```tsx
// Enhanced context for component communication
interface BreadcrumbContextValue {
  disabled?: boolean;
  onNavigate?: (href: string, event: MouseEvent) => void;
  currentPath?: string;
  separator?: ReactNode;
  itemCount?: number;
  registerItem?: (id: string) => void;
  unregisterItem?: (id: string) => void;
}

const useBreadcrumb = () => {
  return useContext(BreadcrumbContext);
}

const useBreadcrumbItem = () => {
  const context = useBreadcrumb();
  const [position, setPosition] = useState<'first' | 'middle' | 'last'>('middle');
  
  // Position calculation logic based on context
  return { position, ...context };
}
```

### Context Requirements
- Context for compound component communication and shared state
- Context provides component identification and configuration
- Shared disabled state management across all components
- Navigation event handler propagation to child links
- Item position calculation for styling hooks
- Current path tracking for active state management

### Ref Forwarding Strategy
```tsx
const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbRootProps>((props, ref) => {
  // Forward ref to underlying nav element
});

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>((props, ref) => {
  // Forward ref to underlying anchor element
});
```

### Event System
- Standard DOM events (click, focus, blur)
- No custom event propagation needed
- Leverages browser's native navigation behavior

### SSR/CSR Safety and Deterministic IDs
```tsx
// Use deterministic ID generation for accessibility attributes
const useId = () => {
  // SSR-safe ID generation
  return `breadcrumb-${generateId()}`;
}
```

## 6. Styling & Data Attributes

### Required Data Attributes

**Breadcrumb.Root**
- `data-glide-breadcrumb-root`: Component identifier
- `data-disabled="true"`: Applied when root is disabled

**Breadcrumb.List**
- `data-glide-breadcrumb-list`: Component identifier

**Breadcrumb.Item**
- `data-glide-breadcrumb-item`: Component identifier
- `data-position="first|middle|last"`: Item position in breadcrumb trail

**Breadcrumb.Link**
- `data-glide-breadcrumb-link`: Component identifier
- `data-disabled="true"`: Applied when link is disabled
- `data-external="true"`: Applied to external links
- `data-focus-visible="true"`: Applied during keyboard focus

**Breadcrumb.Page**
- `data-glide-breadcrumb-page`: Component identifier
- `data-current="true"`: Indicates current page

**Breadcrumb.Separator**
- `data-glide-breadcrumb-separator`: Component identifier

### State-Based Data Attributes
- `data-current="true"`: Applied to current page item/page component
- `data-disabled="true"`: Applied to disabled root or links
- `data-external="true"`: Applied to external links for security styling
- `data-position="first|middle|last"`: Applied to items for contextual styling
- `data-focus-visible="true"`: Applied during keyboard navigation

## 7. Test Coverage Plan

### Unit Tests
- Component mounting and basic rendering
- Props validation and polymorphic `as` prop
- Ref forwarding to correct DOM elements
- Context provider/consumer functionality
- Default props and prop spreading

### Accessibility Tests
```tsx
describe('Breadcrumb Accessibility', () => {
  it('should have no axe violations', async () => {
    const { container } = render(<BreadcrumbExample />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should provide navigation landmark', () => {
    render(<Breadcrumb.Root />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('should mark current page with aria-current', () => {
    render(
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Current</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    );
    expect(screen.getByText('Current')).toHaveAttribute('aria-current', 'page');
  });

  it('should hide separators from screen readers', () => {
    render(<Breadcrumb.Separator />);
    expect(screen.getByRole('listitem')).toHaveAttribute('aria-hidden', 'true');
  });

  it('should handle disabled state accessibility', () => {
    render(
      <Breadcrumb.Root disabled>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/test">Test</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    );
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('link')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should handle external links with security attributes', () => {
    render(
      <Breadcrumb.Link href="https://external.com" isExternal>
        External
      </Breadcrumb.Link>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should call navigation handler instead of default navigation', () => {
    const onNavigate = jest.fn();
    render(
      <Breadcrumb.Root onNavigate={onNavigate}>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/test">Test</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
    );
    
    fireEvent.click(screen.getByRole('link'));
    expect(onNavigate).toHaveBeenCalledWith('/test', expect.any(Object));
  });
});
```

### Integration Tests
- Complete breadcrumb navigation flow with routing libraries
- Interaction with Next.js App Router and Pages Router
- React Router integration and navigation events
- SSR/CSR consistency across different environments
- Keyboard navigation patterns and focus management
- Screen reader announcement verification with real AT
- Disabled state behavior across all interaction modes
- External link security attribute handling
- Custom navigation event handling and preventDefault scenarios

## 8. Constraints

- **Zero Styling**: No CSS imports, styles, or visual opinions
- **Styling via Data Attributes**: All visual styling applied via `data-*` attributes
- **Tree-Shakeable Exports**: Named exports, zero side effects
- **TypeScript Strict Mode**: Explicit types, no `any` usage
- **WCAG 2.2 AA Compliant**: Full accessibility compliance
- **Controlled/Uncontrolled Support**: N/A (stateless component)
- **SSR Safe**: No client-side only features

## 9. Migration & Implementation Checklist

### Implementation Checklist
- [ ] Create compound component structure (Root, List, Item, Link, Page, Separator)
- [ ] Implement polymorphic `as` prop for all components
- [ ] Add proper ARIA roles and properties
- [ ] Implement ref forwarding for all components
- [ ] Add required data attributes for styling hooks
- [ ] Create comprehensive TypeScript types with generic polymorphic support
- [ ] Implement SSR-safe ID generation
- [ ] **Add navigation event handler (onNavigate) to Root component**
- [ ] **Implement disabled state for Root and Link components**
- [ ] **Add external link support with security attributes**
- [ ] **Implement position calculation and data-position attributes**
- [ ] **Add focus-visible data attribute for keyboard navigation**
- [ ] **Create enhanced context with shared configuration**
- [ ] Write unit tests with 100% coverage
- [ ] Write accessibility tests with axe (including disabled/external states)
- [ ] Write integration tests for navigation flows and routing libraries
- [ ] Validate WCAG 2.2 AA compliance
- [ ] Test with screen readers (NVDA, VoiceOver, JAWS)
- [ ] Verify keyboard navigation (including disabled state skipping)
- [ ] Test polymorphic behavior with routing library components
- [ ] Validate tree-shaking compatibility
- [ ] **Test navigation event handler with preventDefault scenarios**
- [ ] **Verify external link security attribute application**
- [ ] **Validate disabled state accessibility announcements**

### Migration Guidance
**From other breadcrumb libraries:**
1. **API Structure**: Convert flat breadcrumb APIs to compound pattern
2. **Styling**: Remove all CSS and replace with data-attribute selectors
3. **Accessibility**: Ensure `aria-current="page"` is applied to current page
4. **Navigation**: Leverage semantic HTML (`nav`, `ol`, `li`, `a`) structure
5. **Separators**: Move separator styling to CSS with `aria-hidden="true"`
6. **Events**: Replace onClick with onNavigate for routing integration

**Routing Library Integration Examples:**

```tsx
// Next.js App Router
import { useRouter } from 'next/navigation';

<Breadcrumb.Root onNavigate={(href, event) => {
  event.preventDefault();
  router.push(href);
}}>
  {/* breadcrumb items */}
</Breadcrumb.Root>

// Next.js Pages Router  
import { useRouter } from 'next/router';
import Link from 'next/link';

<Breadcrumb.Root>
  <Breadcrumb.Item>
    <Breadcrumb.Link as={Link} href="/home">Home</Breadcrumb.Link>
  </Breadcrumb.Item>
</Breadcrumb.Root>

// React Router
import { useNavigate, Link } from 'react-router-dom';

<Breadcrumb.Root onNavigate={(href, event) => {
  event.preventDefault();
  navigate(href);
}}>
  {/* or use as prop */}
  <Breadcrumb.Link as={Link} to="/home">Home</Breadcrumb.Link>
</Breadcrumb.Root>

// Custom router with disabled state
<Breadcrumb.Root 
  disabled={loading}
  onNavigate={async (href, event) => {
    event.preventDefault();
    setLoading(true);
    await router.push(href);
    setLoading(false);
  }}
>
  {/* breadcrumb items */}
</Breadcrumb.Root>
```

**Best Practices:**
- Use semantic HTML elements as base components
- Provide accessible names for navigation landmark
- Keep current page as non-interactive element
- Ensure proper focus management
- Test with assistive technologies
- Follow W3C ARIA Authoring Practices Guide patterns

**Common Pitfalls to Avoid:**
- Don't make current page focusable
- Don't announce visual separators to screen readers
- Don't rely on visual styling alone for state indication
- Don't skip the navigation landmark wrapper
- Don't forget `aria-current="page"` for current location