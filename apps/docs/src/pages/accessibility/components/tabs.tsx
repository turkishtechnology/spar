/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Tabs } from '@turkish-technology/spar';

import '../../../styles/accessibility-demos.scss';

export default function TabsDemo() {
  const [controlledTab, setControlledTab] = useState('tab-1');

  return (
    <Layout title='Tabs'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Tabs</h1>
        <p className='page-description'>
          Tabs organize related content into separate panels and let users switch sections quickly.
        </p>

        {/* 1. Automatic Activation */}
        <section className='demo-section'>
          <h2>1. Automatic Activation (Default)</h2>
          <p className='demo-description'>
            Tabs activate on focus. Arrow keys move focus AND activate the tab simultaneously.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Tabs.Root className='demo-tabs' defaultValue='auto-1'>
                  <Tabs.List className='demo-tablist'>
                    <Tabs.Trigger className='demo-tab-trigger' value='auto-1'>
                      Account
                    </Tabs.Trigger>
                    <Tabs.Trigger className='demo-tab-trigger' value='auto-2'>
                      Password
                    </Tabs.Trigger>
                    <Tabs.Trigger className='demo-tab-trigger' value='auto-3'>
                      Notifications
                    </Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content className='demo-tab-content' value='auto-1'>
                    <h3>Account Settings</h3>
                    <p>Manage your account details, display name, and avatar.</p>
                  </Tabs.Content>
                  <Tabs.Content className='demo-tab-content' value='auto-2'>
                    <h3>Password Settings</h3>
                    <p>Change your password and enable two-factor authentication.</p>
                  </Tabs.Content>
                  <Tabs.Content className='demo-tab-content' value='auto-3'>
                    <h3>Notification Preferences</h3>
                    <p>Choose which notifications you want to receive.</p>
                  </Tabs.Content>
                </Tabs.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab to tablist → ← → to navigate & activate → Tab to
                panel content
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Tabs.Root defaultValue='auto-1'>
  <Tabs.List>
    <Tabs.Trigger value='auto-1'>Account</Tabs.Trigger>
    <Tabs.Trigger value='auto-2'>Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value='auto-1'>Account settings</Tabs.Content>
</Tabs.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 2. Manual Activation */}
        <section className='demo-section'>
          <h2>2. Manual Activation</h2>
          <p className='demo-description'>
            Arrow keys move focus but do NOT activate. Press Enter or Space to activate the focused
            tab. Useful when tab content is expensive to load.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Tabs.Root className='demo-tabs' activationMode='manual' defaultValue='man-1'>
                  <Tabs.List className='demo-tablist'>
                    <Tabs.Trigger className='demo-tab-trigger' value='man-1'>
                      Overview
                    </Tabs.Trigger>
                    <Tabs.Trigger className='demo-tab-trigger' value='man-2'>
                      Analytics
                    </Tabs.Trigger>
                    <Tabs.Trigger className='demo-tab-trigger' value='man-3'>
                      Reports
                    </Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content className='demo-tab-content' value='man-1'>
                    <p>
                      Overview panel. Arrow to other tabs — they won&apos;t activate until
                      Enter/Space.
                    </p>
                  </Tabs.Content>
                  <Tabs.Content className='demo-tab-content' value='man-2'>
                    <p>Analytics panel. Only shown when explicitly activated.</p>
                  </Tabs.Content>
                  <Tabs.Content className='demo-tab-content' value='man-3'>
                    <p>Reports panel. Requires explicit activation.</p>
                  </Tabs.Content>
                </Tabs.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> ← → to move focus → Enter/Space to activate the focused
                tab
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Tabs.Root activationMode='manual' defaultValue='man-1'>
  <Tabs.List>
    <Tabs.Trigger value='man-1'>Overview</Tabs.Trigger>
    <Tabs.Trigger value='man-2'>Analytics</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value='man-1'>Overview panel</Tabs.Content>
</Tabs.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Vertical Orientation */}
        <section className='demo-section'>
          <h2>3. Vertical Orientation</h2>
          <p className='demo-description'>
            With <code>orientation=&quot;vertical&quot;</code>, Arrow Up/Down navigate tabs instead
            of Left/Right.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Tabs.Root className='demo-tabs' orientation='vertical' defaultValue='vert-1'>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <Tabs.List
                      className='demo-tablist'
                      style={{
                        flexDirection: 'column',
                        borderBottom: 'none',
                        borderRight: '1px solid var(--ifm-toc-border-color)',
                      }}
                    >
                      <Tabs.Trigger
                        className='demo-tab-trigger'
                        value='vert-1'
                        style={{
                          borderBottom: 'none',
                          borderRight: '2px solid transparent',
                          textAlign: 'left',
                        }}
                      >
                        General
                      </Tabs.Trigger>
                      <Tabs.Trigger
                        className='demo-tab-trigger'
                        value='vert-2'
                        style={{
                          borderBottom: 'none',
                          borderRight: '2px solid transparent',
                          textAlign: 'left',
                        }}
                      >
                        Privacy
                      </Tabs.Trigger>
                      <Tabs.Trigger
                        className='demo-tab-trigger'
                        value='vert-3'
                        style={{
                          borderBottom: 'none',
                          borderRight: '2px solid transparent',
                          textAlign: 'left',
                        }}
                      >
                        Security
                      </Tabs.Trigger>
                    </Tabs.List>
                    <div>
                      <Tabs.Content className='demo-tab-content' value='vert-1'>
                        <p>General settings panel. Use ↑ ↓ to navigate tabs.</p>
                      </Tabs.Content>
                      <Tabs.Content className='demo-tab-content' value='vert-2'>
                        <p>Privacy settings panel.</p>
                      </Tabs.Content>
                      <Tabs.Content className='demo-tab-content' value='vert-3'>
                        <p>Security settings panel.</p>
                      </Tabs.Content>
                    </div>
                  </div>
                </Tabs.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> ↑ ↓ to navigate (not ← →)
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Tabs.Root orientation='vertical' defaultValue='vert-1'>
  <Tabs.List>
    <Tabs.Trigger value='vert-1'>General</Tabs.Trigger>
    <Tabs.Trigger value='vert-2'>Privacy</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value='vert-1'>General settings</Tabs.Content>
</Tabs.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 4. Controlled Tabs */}
        <section className='demo-section'>
          <h2>4. Controlled Tabs</h2>
          <p className='demo-description'>
            Parent controls which tab is active. External buttons can switch tabs programmatically.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-row'>
                  <button className='demo-btn' onClick={() => setControlledTab('tab-1')}>
                    Go to Tab 1
                  </button>
                  <button className='demo-btn' onClick={() => setControlledTab('tab-2')}>
                    Go to Tab 2
                  </button>
                  <button className='demo-btn' onClick={() => setControlledTab('tab-3')}>
                    Go to Tab 3
                  </button>
                </div>
                <Tabs.Root
                  className='demo-tabs'
                  value={controlledTab}
                  onValueChange={(v) => {
                    setControlledTab(v);
                  }}
                >
                  <Tabs.List className='demo-tablist'>
                    <Tabs.Trigger className='demo-tab-trigger' value='tab-1'>
                      Tab 1
                    </Tabs.Trigger>
                    <Tabs.Trigger className='demo-tab-trigger' value='tab-2'>
                      Tab 2
                    </Tabs.Trigger>
                    <Tabs.Trigger className='demo-tab-trigger' value='tab-3'>
                      Tab 3
                    </Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content className='demo-tab-content' value='tab-1'>
                    <p>First tab panel (controlled).</p>
                  </Tabs.Content>
                  <Tabs.Content className='demo-tab-content' value='tab-2'>
                    <p>Second tab panel (controlled).</p>
                  </Tabs.Content>
                  <Tabs.Content className='demo-tab-content' value='tab-3'>
                    <p>Third tab panel (controlled).</p>
                  </Tabs.Content>
                </Tabs.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`const [value, setValue] = useState('tab-1');

<Tabs.Root value={value} onValueChange={(nextValue) => setValue(nextValue)}>
  <Tabs.List>
    <Tabs.Trigger value='tab-1'>Tab 1</Tabs.Trigger>
    <Tabs.Trigger value='tab-2'>Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value='tab-1'>First tab panel</Tabs.Content>
</Tabs.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 5. Disabled Tabs */}
        <section className='demo-section'>
          <h2>5. Disabled Tabs</h2>
          <p className='demo-description'>
            Individual tabs can be disabled. Arrow key navigation skips disabled tabs.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Tabs.Root className='demo-tabs' defaultValue='dis-1'>
                  <Tabs.List className='demo-tablist'>
                    <Tabs.Trigger className='demo-tab-trigger' value='dis-1'>
                      Active
                    </Tabs.Trigger>
                    <Tabs.Trigger className='demo-tab-trigger' value='dis-2' disabled>
                      Disabled
                    </Tabs.Trigger>
                    <Tabs.Trigger className='demo-tab-trigger' value='dis-3'>
                      Active
                    </Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content className='demo-tab-content' value='dis-1'>
                    <p>First tab. Arrow Right should skip the disabled tab.</p>
                  </Tabs.Content>
                  <Tabs.Content className='demo-tab-content' value='dis-2'>
                    <p>This panel should not be reachable via keyboard.</p>
                  </Tabs.Content>
                  <Tabs.Content className='demo-tab-content' value='dis-3'>
                    <p>Third tab. Arrow Left should skip the disabled tab.</p>
                  </Tabs.Content>
                </Tabs.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Arrow keys skip disabled tabs. Tab does not stop on
                disabled triggers.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Tabs.Root defaultValue='dis-1'>
  <Tabs.List>
    <Tabs.Trigger value='dis-1'>Active</Tabs.Trigger>
    <Tabs.Trigger value='dis-2' disabled>Disabled</Tabs.Trigger>
    <Tabs.Trigger value='dis-3'>Active</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value='dis-1'>First tab.</Tabs.Content>
</Tabs.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Render Props */}
        <section className='demo-section'>
          <h2>6. Render Props Pattern</h2>
          <p className='demo-description'>
            Use render props to access <code>isSelected</code>, <code>isFocused</code> and states
            for custom rendering.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Tabs.Root className='demo-tabs' defaultValue='rp-1'>
                  <Tabs.List className='demo-tablist'>
                    {['Home', 'Profile', 'Settings'].map((label, i) => (
                      <Tabs.Trigger
                        key={`rp-${i + 1}`}
                        className='demo-tab-trigger'
                        value={`rp-${i + 1}`}
                      >
                        {({ isSelected, isFocused }) => (
                          <span>
                            {isSelected ? '● ' : '○ '}
                            {label}
                            {isFocused ? ' 👁' : ''}
                          </span>
                        )}
                      </Tabs.Trigger>
                    ))}
                  </Tabs.List>
                  <Tabs.Content className='demo-tab-content' value='rp-1'>
                    <p>Home content. Trigger shows selected/focused indicators.</p>
                  </Tabs.Content>
                  <Tabs.Content className='demo-tab-content' value='rp-2'>
                    <p>Profile content.</p>
                  </Tabs.Content>
                  <Tabs.Content className='demo-tab-content' value='rp-3'>
                    <p>Settings content.</p>
                  </Tabs.Content>
                </Tabs.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Tabs.Root defaultValue='rp-1'>
  <Tabs.List>
    <Tabs.Trigger value='rp-1'>
      {({ isSelected }) => (isSelected ? '● Home' : '○ Home')}
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value='rp-1'>Home content</Tabs.Content>
</Tabs.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
      </div>
    </Layout>
  );
}
