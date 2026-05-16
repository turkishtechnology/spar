---
title: Installation
description: Get started with Spar in a React project. Learn how to install and configure the library with a package manager and styling solution.
---

# Installation

Get started with Spar in minutes. This guide covers installation, setup, and basic configuration for a React project.

## Requirements

Before installing Spar, ensure the project meets these requirements:

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
  <TabItem value="bun" label="bun">
    ```bash
    bun add @turkish-technology/spar
    ```
  </TabItem>
</Tabs>

## Framework Guides

Spar works seamlessly with modern React frameworks.

### React

Import components into React files and start developing:

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

Spar is compatible with Next.js 14+ and the App Router.

All published Spar entrypoints are client-marked modules, so importing a Spar component from an App Router page or layout creates a client boundary automatically:

```ts
import * as Accordion from '@turkish-technology/spar/accordion';
import * as Breadcrumb from '@turkish-technology/spar/breadcrumb';
import * as Dialog from '@turkish-technology/spar/dialog';
import { Button } from '@turkish-technology/spar/button';
```

#### App Router Page Example

```tsx title="app/page.tsx"
import * as Breadcrumb from '@turkish-technology/spar/breadcrumb';
import { Button } from '@turkish-technology/spar/button';

export default function Home() {
  return (
    <main>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href='/'>Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.Page>Dashboard</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <h1>Welcome to Spar + Next.js</h1>
      <Button>Click me</Button>
    </main>
  );
}
```

#### Client Component Example

For components that require state (controlled mode), wrap them in a Client Component:

```tsx title="app/components/AccordionSection.tsx"
'use client';

import { useState } from 'react';
import * as Accordion from '@turkish-technology/spar/accordion';

export function AccordionSection() {
  const [value, setValue] = useState<string | string[]>('');

  return (
    <Accordion.Root value={value} onValueChange={setValue}>
      <Accordion.Item value='faq-1'>
        <Accordion.Header>
          <Accordion.Trigger>What is Spar?</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Spar is a headless React component library.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

#### Available Sub-path Imports

| Import Path                              | Components                                                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| `@turkish-technology/spar/accordion`     | Root, Item, Header, Trigger, Content                                          |
| `@turkish-technology/spar/breadcrumb`    | Root, List, Item, Link, Page, Separator                                       |
| `@turkish-technology/spar/button`        | Button                                                                        |
| `@turkish-technology/spar/checkbox`      | Checkbox                                                                      |
| `@turkish-technology/spar/collapsible`   | Root, Trigger, Content                                                        |
| `@turkish-technology/spar/dialog`        | Root, Trigger, Overlay, Content, Title, Description, Close                    |
| `@turkish-technology/spar/dropdown-menu` | Root, Trigger, Content, Item, Separator, Label, Group, Arrow                  |
| `@turkish-technology/spar/input`         | Root, Field, Label, Description, ErrorMessage                                 |
| `@turkish-technology/spar/label`         | Label                                                                         |
| `@turkish-technology/spar/popover`       | Root, Trigger, Content, Arrow, Close                                          |
| `@turkish-technology/spar/radio`         | Root, Group, Item                                                             |
| `@turkish-technology/spar/select`        | Root, Trigger, Value, Content, Item, Group, Label, ItemText, Separator, Arrow |
| `@turkish-technology/spar/switch`        | Switch, useSwitch                                                             |
| `@turkish-technology/spar/tabs`          | Root, List, Trigger, Content                                                  |
| `@turkish-technology/spar/tooltip`       | Provider, Root, Trigger, Content, Arrow                                       |

## Next Steps

After installing Spar:

1. **Explore Components:** Check out the [Components](/docs/overview) page to see all available components
2. **Learn Patterns:** Read component documentation for usage examples
3. **Style Components:** Choose a preferred styling solution and customize
4. **Build Accessible UIs:** All components come with built-in accessibility

## Getting Help

Need help with installation or setup?

- **GitHub Issues:** [Report a bug or issue](https://github.com/turkishtechnology/spar/issues)
- **Documentation:** Browse component docs for detailed usage examples
- **Contributing:** Check our [Contributing Guide](https://github.com/turkishtechnology/spar/blob/main/CONTRIBUTING.md)
