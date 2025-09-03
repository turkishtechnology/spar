# Accessibility Guidelines - Glide

## Context
Accessibility is **mandatory**. Every component must be fully accessible and WCAG 2.2 AA compliant. No component ships without it.

## Core Principles
- **Perceivable**: Content must be available to all senses  
- **Operable**: Full keyboard support required  
- **Understandable**: Clear and predictable behavior  
- **Robust**: Must work with assistive technologies  

## Mandatory Rules
1. **Keyboard Support**  
   - Tab / Shift+Tab → move focus  
   - Enter / Space → activate  
   - Arrows → navigate lists/widgets  
   - Escape → close/cancel  
   - Home/End → first/last item  
   - PageUp/PageDown → large jumps  

2. **ARIA Usage**  
   - Prefer semantic HTML, add ARIA when needed  
   - Common attributes: `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-expanded`, `aria-selected`, `aria-checked`, `aria-disabled`, `aria-busy`, `aria-invalid`, `aria-errormessage`, `aria-controls`, `aria-hidden`, `aria-modal`, `aria-haspopup`, `aria-current`, `aria-activedescendant`, `tabindex`  

3. **Focus Management**  
   - Always show visible focus indicators  
   - Trap focus in modals  
   - Restore focus on close  

4. **Screen Readers**  
   - Use `aria-live` for dynamic updates  
   - Provide alerts, loading, and error announcements  

5. **Color & Contrast**  
   - WCAG 2.2 AA contrast ratios:  
     - Text: 4.5:1  
     - Large text: 3:1  
     - UI/focus indicators: 3:1  
   - Never rely on color alone for meaning  

## Component Patterns
Research component-specific accessibility patterns before implementation:

**Primary Source**: [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/)

**Process**:
1. Find component pattern in APG first
2. Implement ALL required ARIA roles/properties
3. Add complete keyboard interactions  
4. Test with screen readers

## Code Examples

**Accessible Interactive Element**:
```tsx
<element
  role="button"
  tabIndex={0}
  aria-label="Action description"
  onKeyDown={(e) => e.key === 'Enter' && handleAction()}
  onClick={handleAction}
/>
```

**Error State Pattern**:
```tsx
aria-invalid={hasError}
aria-describedby={hasError ? "error-id" : undefined}
// + <div id="error-id" role="alert">{errorMessage}</div>
```

**Live Region Update**:
```tsx
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

## APG Pattern Research

**When implementing any interactive component**:
1. Go to [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/)
2. Find the matching interaction pattern
3. Copy ALL required ARIA attributes from the pattern
4. Implement ALL keyboard behaviors from the pattern
5. Test with the pattern's example code

**Key Pattern Categories**:
- Interactive controls (buttons, links, inputs)
- Composite widgets (menus, tabs, grids)
- Disclosure patterns (dropdowns, accordions)
- Dialog patterns (modals, alerts)

**Always reference the official APG pattern before coding.**

## Testing
- **Automated**: run `jest-axe`, must pass with zero violations  
- **Manual**: keyboard navigation, screen reader, zoom, contrast  
- **Required**: accessibility tests for every component  

## Common Mistakes
- Missing labels on interactive elements  
- Hidden focus indicators  
- Wrong ARIA roles (use semantic HTML first)  
- Click-only interactions without keyboard support  
- Missing error announcements  
- No live regions for dynamic content  

## Tools & Resources
- **Testing**: axe, WAVE, Lighthouse, Pa11y  
- **Screen Readers**: NVDA, JAWS, VoiceOver, TalkBack  
- **Standards**: WCAG 2.2, ARIA Authoring Practices, Section 508  

## Reminders
- Build accessible from the start  
- Test with real assistive technologies  

## Implementation Rules
**Every component MUST have**:
- Accessible name for all interactive elements
- Complete keyboard navigation support  
- Proper focus management and indicators
- Error handling with announcements
- jest-axe tests passing with 0 violations
