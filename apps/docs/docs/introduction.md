---
title: Introduction
description: Spar is a headless React component library built with TypeScript. Unstyled, accessible, and composable primitives for building your own design system.
---

**Spar is a headless UI component library. Zero styling opinions, maximum flexibility.**

Traditional component libraries come with predefined styles and visual designs. While this works for quick prototyping, it becomes limiting when you need components that match your unique design system.

Spar takes a different approach: **we provide the behavior, you provide the style.** Each component is a fully accessible, keyboard-navigable primitive with zero styling to be modified exactly how you want.

## Quick Start

```bash
pnpm add @turkish-technology/spar
```

```tsx
import { Button } from '@turkish-technology/spar';

function App() {
  return <Button onClick={() => alert('Hello!')}>Click me</Button>;
}
```

See the [Installation Guide](/docs/installation) for detailed setup instructions.

## Core Principles

Spar is built around the following principles:

- **Headless Architecture:** Components handle logic and accessibility, not visuals.
- **Composition First:** Granular component parts that work together seamlessly.
- **Accessibility by Default:** WCAG 2.2 AA compliant with full keyboard support.
- **TypeScript Strict:** Fully typed with explicit interfaces.
- **Tree-Shakeable:** Import only what you need with named exports.

## Headless Architecture

Spar components are completely unstyled. They provide:

- **Behavior Logic:** State management, event handling, and user interactions.
- **Accessibility Features:** ARIA attributes, keyboard navigation, and screen reader support.
- **Component API:** A clean, predictable interface for each component.

## Composition

Every component in Spar uses a compound component pattern with granular parts:

```tsx
// Simple accordion example
<AccordionRoot type='single'>
  <AccordionItem value='item-1'>
    <AccordionHeader>
      <AccordionTrigger>What is Spar?</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>A headless UI library with zero styling opinions.</AccordionContent>
  </AccordionItem>
</AccordionRoot>
```

This pattern provides:

- **Flexibility:** Use only the parts you need.
- **Consistency:** All components follow the same pattern.
- **Predictability:** Easy to learn and use across different components.

## Accessibility

All Spar components are built with accessibility as a core requirement:

- **WCAG 2.2 AA Compliant:** Meets modern accessibility standards.
- **Keyboard Navigation:** Full keyboard support for all interactive elements.
- **Screen Reader Support:** Proper ARIA labels, roles, and live regions.
- **Focus Management:** Intelligent focus trapping and restoration.
- **Automated Testing:** Every component tested with jest-axe for zero accessibility violations.

You get accessible components out of the box—no extra work required.

## TypeScript First

Spar is written in TypeScript with strict mode enabled:

- **Full Type Safety:** Every prop, state, and callback is explicitly typed.
- **No `any` Types:** Strict typing throughout the codebase.
- **Generic Components:** Type-safe components that work with your data models.

```tsx
import { Button, type ButtonProps } from '@turkish-technology/spar';

// Full type safety and autocomplete
const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Tree-Shakeable

Spar is designed for optimal bundle size:

- **Named Exports:** Import only what you use.
- **Zero Side Effects:** No global styles or automatic registration.
- **Modular Architecture:** Each component is independent.

```tsx
// Import only what you need
import { Button, DialogRoot, TooltipRoot } from '@turkish-technology/spar';
```

## What's Included

Spar provides **15 production-ready headless components**:

- **Layout & Navigation:** Accordion, Breadcrumb, Tabs
- **Form Controls:** Button, Checkbox, Input, Label, Radio, Select, Switch
- **Overlays:** Dialog, DropdownMenu, Popover, Tooltip
- **Utilities:** Collapsible

Plus utility hooks and TypeScript types. See all components in the [Components](/docs/overview) section.

## Why Headless?

Headless components separate behavior from presentation. This gives you:

1. **Design Freedom:** Style components to match any design system.
2. **Consistency:** Use the same components across different projects with different designs.
3. **Maintainability:** Update behavior without touching styles, and vice versa.
4. **Flexibility:** Works with any CSS framework or styling solution.
5. **Performance:** Include only the JavaScript you need; styles are up to you.

_Spar handles the hard parts—state management, accessibility, keyboard navigation—so you can focus on making your UI look exactly how you want._

## Next Steps

Ready to get started?

1. **[Install Spar](/docs/installation)** - Set up the library in your project
2. **[Browse Components](/docs/overview)** - Explore all 15 available components

## Community & Support

- **GitHub:** [turkishtechnology/spar](https://github.com/turkishtechnology/spar)
- **Issues:** [Report bugs or request features](https://github.com/turkishtechnology/spar/issues)
