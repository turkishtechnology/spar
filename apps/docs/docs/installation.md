---
title: Installation
description: Get started with Spar in your React project. Learn how to install and configure the library with your preferred package manager and styling solution.
---

# Installation

Get up and running with Spar in minutes. This guide covers installation, setup, and basic configuration for your React project.

## Requirements

Before installing Spar, ensure your project meets these requirements:

- **Node.js:** >=22.18.0
- **React:** >=19.0.0
- **pnpm:** >=10.0.0 (if using pnpm)
- **TypeScript:** >=5.0.0 (recommended)

:::info Peer Dependencies
Spar requires React 19+ as a peer dependency. The library will automatically install `@floating-ui/react-dom` for positioning components (Dialog, Popover, Tooltip, DropdownMenu).
:::

## Package Manager

Spar is available on npm and can be installed with any package manager.

### pnpm (Recommended)

```bash
pnpm add @turkish-technology/spar
```

### npm

```bash
npm install @turkish-technology/spar
```

### yarn

```bash
yarn add @turkish-technology/spar
```

## Basic Setup

After installation, you can start importing and using Spar components:

```tsx
import { Button, Dialog, Tooltip } from '@turkish-technology/spar';

export default function App() {
  return (
    <div>
      <Button onClick={() => console.log('clicked')}>Click me</Button>
    </div>
  );
}
```

## Next Steps

Now that you have Spar installed:

1. **Explore Components:** Check out the [Components](/docs/overview) page to see all available components
2. **Learn Patterns:** Read component documentation for usage examples
3. **Style Your Components:** Choose your preferred styling solution and customize
4. **Build Accessible UIs:** All components come with built-in accessibility

## Getting Help

Need help with installation or setup?

- **GitHub Issues:** [Report a bug or issue](https://github.com/turkishtechnology/spar/issues)
- **Documentation:** Browse component docs for detailed usage examples
- **Contributing:** Check our [Contributing Guide](https://github.com/turkishtechnology/spar/blob/main/CONTRIBUTING.md)
