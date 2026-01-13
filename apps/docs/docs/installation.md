---
title: Installation
description: Get started with Spar in your React project. Learn how to install and configure the library with your preferred package manager and styling solution.
---

# Installation

Get started with Spar in minutes. This guide covers installation, setup, and basic configuration for your React project.

## Requirements

Before installing Spar, ensure your project meets these requirements:

- **Node.js:** >=22.18.0
- **React:** >=19.0.0
- **TypeScript:** >=5.0.0 (recommended)
- **pnpm:** >=10.0.0 (if using pnpm)

## Package Manager

Spar is available on [npm](https://www.npmjs.com/package/@turkish-technology/spar) and can be installed with any package manager.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs defaultValue="npm" groupId="package-manager">
  <TabItem value="npm" label="npm">
    ```bash
    npm install @turkish-technology/spar
    ```
  </TabItem>
  <TabItem value="yarn" label="yarn">
    ```bash
    yarn add @turkish-technology/spar
    ```
  </TabItem>
    <TabItem value="pnpm" label="pnpm">
    ```bash
    pnpm add @turkish-technology/spar
    ```
  </TabItem>
</Tabs>

## Framework Guides

Spar works seamlessly with modern React frameworks.

### React

Import components in your React files, and start developing:

```tsx title="src/App.tsx"
import { Button } from '@turkish-technology/spar';
import './App.css';

function App() {
  return (
    <Button className='my-button' onClick={() => console.log('Clicked!')}>
      Click me
    </Button>
  );
}
```

### Next.js

Spar is fully compatible with Next.js 14+ (App Router & Server Components supported).

#### Server Component Example

```tsx title="app/page.tsx"
import { Breadcrumb } from '@turkish-technology/spar';

export default function Home() {
  return (
    <main>
      <Breadcrumb.Root>
        <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb.Root>
      <h1>Welcome to Spar + Next.js</h1>
    </main>
  );
}
```

#### Client Component with Dynamic Import

For client-side only components, use dynamic imports to prevent SSR.

```tsx title="app/components/DynamicButton.tsx"
'use client';

import dynamic from 'next/dynamic';

const Button = dynamic(() => import('@turkish-technology/spar').then((mod) => mod.Button), {
  ssr: false,
});

export default function DynamicButton() {
  return <Button onClick={() => alert('Clicked!')}>Click me</Button>;
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
