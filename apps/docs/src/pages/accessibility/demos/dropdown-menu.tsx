/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { DropdownMenu } from '@turkish-technology/spar';
import '../../../styles/accessibility-demos.scss';

export default function DropdownMenuDemo() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <Layout title='DropdownMenu'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>DropdownMenu – Accessibility Demo</h1>
        <p className='page-description'>
          Menu button pattern with <code>role=&quot;menu&quot;</code> and{' '}
          <code>role=&quot;menuitem&quot;</code>. Full keyboard support including Arrow keys, Home,
          End, and type-ahead.
        </p>

        {/* 1. Basic Dropdown */}
        <section className='demo-section'>
          <h2>1. Basic Dropdown Menu</h2>
          <p className='demo-description'>
            Click or Enter/Space to open. Arrow keys navigate items. Enter activates an item. Escape
            closes the menu.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className='demo-btn'>Actions ▾</DropdownMenu.Trigger>
                  <DropdownMenu.Content className='demo-dropdown-content'>
                    <DropdownMenu.Item className='demo-dropdown-item'>Edit</DropdownMenu.Item>
                    <DropdownMenu.Item className='demo-dropdown-item'>Duplicate</DropdownMenu.Item>
                    <DropdownMenu.Separator className='demo-dropdown-separator' />
                    <DropdownMenu.Item className='demo-dropdown-item'>Delete</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Enter/Space to open → ↑↓ to navigate → Enter to select →
                Escape to close
              </div>
            </div>
          </div>
        </section>

        {/* 2. With Groups and Labels */}
        <section className='demo-section'>
          <h2>2. Grouped Items with Labels</h2>
          <p className='demo-description'>
            Items organized in groups with labels. Group labels provide context for screen readers.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className='demo-btn'>File ▾</DropdownMenu.Trigger>
                  <DropdownMenu.Content className='demo-dropdown-content'>
                    <DropdownMenu.Group>
                      <DropdownMenu.Label className='demo-dropdown-label'>
                        Document
                      </DropdownMenu.Label>
                      <DropdownMenu.Item className='demo-dropdown-item'>New</DropdownMenu.Item>
                      <DropdownMenu.Item className='demo-dropdown-item'>Open</DropdownMenu.Item>
                      <DropdownMenu.Item className='demo-dropdown-item'>Save</DropdownMenu.Item>
                    </DropdownMenu.Group>
                    <DropdownMenu.Separator className='demo-dropdown-separator' />
                    <DropdownMenu.Group>
                      <DropdownMenu.Label className='demo-dropdown-label'>
                        Export
                      </DropdownMenu.Label>
                      <DropdownMenu.Item className='demo-dropdown-item'>
                        Export as PDF
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className='demo-dropdown-item'>
                        Export as CSV
                      </DropdownMenu.Item>
                    </DropdownMenu.Group>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Disabled Items */}
        <section className='demo-section'>
          <h2>3. Disabled Items</h2>
          <p className='demo-description'>
            Disabled menu items are skipped by keyboard navigation.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className='demo-btn'>Edit ▾</DropdownMenu.Trigger>
                  <DropdownMenu.Content className='demo-dropdown-content'>
                    <DropdownMenu.Item className='demo-dropdown-item'>Cut</DropdownMenu.Item>
                    <DropdownMenu.Item className='demo-dropdown-item'>Copy</DropdownMenu.Item>
                    <DropdownMenu.Item className='demo-dropdown-item' disabled>
                      Paste (disabled)
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className='demo-dropdown-separator' />
                    <DropdownMenu.Item className='demo-dropdown-item'>Select All</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Arrow keys skip &quot;Paste (disabled)&quot;.
              </div>
            </div>
          </div>
        </section>

        {/* 4. Modal vs Non-modal */}
        <section className='demo-section'>
          <h2>4. Modal Menu (Focus Trap)</h2>
          <p className='demo-description'>
            Modal menu traps focus inside. Tab does not leave the menu. Default behavior is modal.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area demo-row'>
                <DropdownMenu.Root modal>
                  <DropdownMenu.Trigger className='demo-btn'>Modal Menu ▾</DropdownMenu.Trigger>
                  <DropdownMenu.Content className='demo-dropdown-content'>
                    <DropdownMenu.Item className='demo-dropdown-item'>Item 1</DropdownMenu.Item>
                    <DropdownMenu.Item className='demo-dropdown-item'>Item 2</DropdownMenu.Item>
                    <DropdownMenu.Item className='demo-dropdown-item'>Item 3</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
                <DropdownMenu.Root modal={false}>
                  <DropdownMenu.Trigger className='demo-btn'>Non-modal Menu ▾</DropdownMenu.Trigger>
                  <DropdownMenu.Content className='demo-dropdown-content'>
                    <DropdownMenu.Item className='demo-dropdown-item'>Item 1</DropdownMenu.Item>
                    <DropdownMenu.Item className='demo-dropdown-item'>Item 2</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Close on Select */}
        <section className='demo-section'>
          <h2>5. Keep Open After Selection</h2>
          <p className='demo-description'>
            With <code>closeOnSelect=&#123;false&#125;</code>, menu stays open after selecting an
            item. Useful for multi-action menus.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <DropdownMenu.Root closeOnSelect={false}>
                  <DropdownMenu.Trigger className='demo-btn'>Multi-action ▾</DropdownMenu.Trigger>
                  <DropdownMenu.Content className='demo-dropdown-content'>
                    <DropdownMenu.Item className='demo-dropdown-item'>Action A</DropdownMenu.Item>
                    <DropdownMenu.Item className='demo-dropdown-item'>Action B</DropdownMenu.Item>
                    <DropdownMenu.Item className='demo-dropdown-item'>Action C</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Menu stays open after selecting. Press Escape to close.
              </div>
            </div>
          </div>
        </section>

        {/* 6. Controlled Dropdown */}
        <section className='demo-section'>
          <h2>6. Controlled Dropdown</h2>
          <p className='demo-description'>
            Parent fully controls the open state via <code>open</code> + <code>onOpenChange</code>.
            External buttons can programmatically open and close.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area demo-row'>
                <DropdownMenu.Root
                  open={controlledOpen}
                  onOpenChange={(open) => {
                    setControlledOpen(open);
                  }}
                >
                  <DropdownMenu.Trigger className='demo-btn'>Controlled ▾</DropdownMenu.Trigger>
                  <DropdownMenu.Content className='demo-dropdown-content'>
                    <DropdownMenu.Item className='demo-dropdown-item'>Option A</DropdownMenu.Item>
                    <DropdownMenu.Item className='demo-dropdown-item'>Option B</DropdownMenu.Item>
                    <DropdownMenu.Item className='demo-dropdown-item'>Option C</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
                <button className='demo-btn' onClick={() => setControlledOpen(true)}>
                  External Open
                </button>
                <button className='demo-btn' onClick={() => setControlledOpen(false)}>
                  External Close
                </button>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> External buttons control the menu. Trigger and Escape
                also work.
              </div>
            </div>
          </div>
        </section>

        {/* 7. Disabled Trigger */}
        <section className='demo-section'>
          <h2>7. Disabled Trigger</h2>
          <p className='demo-description'>
            Disabled dropdown trigger prevents the menu from opening.
          </p>
          <div className='demo-area'>
            <DropdownMenu.Root disabled>
              <DropdownMenu.Trigger className='demo-btn'>Disabled ▾</DropdownMenu.Trigger>
              <DropdownMenu.Content className='demo-dropdown-content'>
                <DropdownMenu.Item className='demo-dropdown-item'>Unreachable</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </section>

        {/* 8. Render Props */}
        <section className='demo-section'>
          <h2>8. Render Props Pattern</h2>
          <p className='demo-description'>
            Trigger exposes <code>isOpen</code> for custom rendering.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className='demo-btn'>
                    {({ isOpen }) => (isOpen ? '✕ Close' : '☰ Menu')}
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className='demo-dropdown-content'>
                    <DropdownMenu.Item className='demo-dropdown-item'>Home</DropdownMenu.Item>
                    <DropdownMenu.Item className='demo-dropdown-item'>Settings</DropdownMenu.Item>
                    <DropdownMenu.Item className='demo-dropdown-item'>Logout</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
