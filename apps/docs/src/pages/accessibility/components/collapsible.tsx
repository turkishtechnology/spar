/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Collapsible } from '@turkish-technology/spar';
import '../../../styles/accessibility-demos.scss';

export default function CollapsibleDemo() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <Layout title='Collapsible'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Collapsible</h1>
        <p className='page-description'>
          Collapsible toggles the visibility of a content area, useful for optional details and
          progressive disclosure patterns.
        </p>
        {/* 1. Basic Collapsible */}
        <section className='demo-section'>
          <h2>1. Basic Collapsible</h2>
          <p className='demo-description'>
            Click or press Enter/Space to toggle. Screen readers announce expanded/collapsed state
            via <code>aria-expanded</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Collapsible.Root className='demo-collapsible'>
                  <Collapsible.Trigger className='demo-collapsible-trigger'>
                    Show more info <span className='demo-chevron'>▾</span>
                  </Collapsible.Trigger>
                  <Collapsible.Content className='demo-collapsible-content'>
                    <p>
                      This is the collapsible content. It can contain any elements including links,
                      buttons, and other interactive content.
                    </p>
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab to trigger → Enter/Space to toggle → Tab into content
                when expanded
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Collapsible.Root>
  <Collapsible.Trigger>Show more info</Collapsible.Trigger>
  <Collapsible.Content>
    <p>Collapsible content</p>
  </Collapsible.Content>
</Collapsible.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 2. Default Open */}
        <section className='demo-section'>
          <h2>2. Default Open</h2>
          <p className='demo-description'>Collapsible that starts expanded.</p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Collapsible.Root className='demo-collapsible' defaultOpen>
                  <Collapsible.Trigger className='demo-collapsible-trigger'>
                    This is already expanded<span className='demo-chevron'>▾</span>
                  </Collapsible.Trigger>
                  <Collapsible.Content className='demo-collapsible-content'>
                    <p>
                      By setting <code>defaultOpen</code>, the collapsible starts in the expanded
                      state.
                    </p>
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Collapsible.Root defaultOpen>
  <Collapsible.Trigger>This is already expanded</Collapsible.Trigger>
  <Collapsible.Content>
    <p>Starts open</p>
  </Collapsible.Content>
</Collapsible.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Controlled */}
        <section className='demo-section'>
          <h2>3. Controlled Collapsible</h2>
          <p className='demo-description'>
            Parent manages open state. External buttons can toggle programmatically.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-row'>
                  <button className='demo-btn' onClick={() => setControlledOpen(true)}>
                    Expand
                  </button>
                  <button className='demo-btn' onClick={() => setControlledOpen(false)}>
                    Collapse
                  </button>
                  <button className='demo-btn' onClick={() => setControlledOpen((o) => !o)}>
                    Toggle
                  </button>
                </div>
                <Collapsible.Root
                  className='demo-collapsible'
                  open={controlledOpen}
                  onOpenChange={(open) => {
                    setControlledOpen(open);
                  }}
                >
                  <Collapsible.Trigger className='demo-collapsible-trigger'>
                    Controlled section <span className='demo-chevron'>▾</span>
                  </Collapsible.Trigger>
                  <Collapsible.Content className='demo-collapsible-content'>
                    <p>This content is controlled by parent state.</p>
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`const [open, setOpen] = useState(false);

<Collapsible.Root open={open} onOpenChange={(o)=>setOpen(o)}>
  <Collapsible.Trigger>Controlled section</Collapsible.Trigger>
  <Collapsible.Content>
    <p>This content is controlled by parent state.</p>
  </Collapsible.Content>
</Collapsible.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 4. Disabled */}
        <section className='demo-section'>
          <h2>4. Disabled Collapsible</h2>
          <p className='demo-description'>Disabled collapsible trigger cannot be activated.</p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <Collapsible.Root className='demo-collapsible' disabled>
                  <Collapsible.Trigger className='demo-collapsible-trigger'>
                    Disabled (collapsed) <span className='demo-chevron'>▾</span>
                  </Collapsible.Trigger>
                  <Collapsible.Content className='demo-collapsible-content'>
                    <p>Should not be reachable.</p>
                  </Collapsible.Content>
                </Collapsible.Root>
                <Collapsible.Root className='demo-collapsible' disabled defaultOpen>
                  <Collapsible.Trigger className='demo-collapsible-trigger'>
                    Disabled (expanded) <span className='demo-chevron'>▾</span>
                  </Collapsible.Trigger>
                  <Collapsible.Content className='demo-collapsible-content'>
                    <p>Content is visible but trigger cannot be toggled.</p>
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Collapsible.Root disabled>
  <Collapsible.Trigger>Disabled (collapsed)</Collapsible.Trigger>
  <Collapsible.Content>
    <p>Should not be reachable.</p>
  </Collapsible.Content>
</Collapsible.Root>

<Collapsible.Root disabled defaultOpen>
  <Collapsible.Trigger>Disabled (expanded)</Collapsible.Trigger>
  <Collapsible.Content>
    <p>Content is visible but cannot be toggled.</p>
  </Collapsible.Content>
</Collapsible.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 5. Render Props */}
        <section className='demo-section'>
          <h2>5. Render Props Pattern</h2>
          <p className='demo-description'>
            Trigger exposes <code>isOpen</code>, <code>open</code>, <code>close</code>,{' '}
            <code>toggle</code> for custom rendering.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Collapsible.Root className='demo-collapsible'>
                  <Collapsible.Trigger className='demo-collapsible-trigger'>
                    {({ isOpen }) => (
                      <>
                        {isOpen ? '📂 Collapse details' : '📁 Expand details'}
                        <span className='demo-chevron'>{isOpen ? '▴' : '▾'}</span>
                      </>
                    )}
                  </Collapsible.Trigger>
                  <Collapsible.Content className='demo-collapsible-content'>
                    <p>The trigger text and icon change based on open state.</p>
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Collapsible.Root>
  <Collapsible.Trigger>
    {({ isOpen }) => (isOpen ? 'Collapse details' : 'Expand details')}
  </Collapsible.Trigger>
  <Collapsible.Content>
    <p>Content</p>
  </Collapsible.Content>
</Collapsible.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Nested Content with Interactive Elements */}
        <section className='demo-section'>
          <h2>6. Content with Interactive Elements</h2>
          <p className='demo-description'>
            Collapsible content containing focusable elements. Tab order should include content
            elements when expanded.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Collapsible.Root className='demo-collapsible'>
                  <Collapsible.Trigger className='demo-collapsible-trigger'>
                    Advanced settings <span className='demo-chevron'>▾</span>
                  </Collapsible.Trigger>
                  <Collapsible.Content className='demo-collapsible-content'>
                    <div className='demo-col' style={{ gap: '0.5rem' }}>
                      <div className='demo-input-wrapper'>
                        <label htmlFor='collapsible-input' className='demo-label'>
                          API Key
                        </label>
                        <input
                          id='collapsible-input'
                          className='demo-input'
                          type='text'
                          placeholder='Enter API key'
                        />
                      </div>
                      <div className='demo-row'>
                        <button className='demo-btn'>Save</button>
                        <button className='demo-btn'>Reset</button>
                      </div>
                    </div>
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Tab order:</strong> Trigger → (when expanded) Input → Save → Reset → next
                element
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Collapsible.Root>
  <Collapsible.Trigger>Advanced settings</Collapsible.Trigger>
  <Collapsible.Content>
    <input type='text' placeholder='Enter API key' />
    <button>Save</button>
    <button>Reset</button>
  </Collapsible.Content>
</Collapsible.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 7. Multiple Collapsibles */}
        <section className='demo-section'>
          <h2>7. Multiple Collapsibles (FAQ Pattern)</h2>
          <p className='demo-description'>
            Multiple independent collapsible sections. Each manages its own state. Unlike Accordion,
            multiple can be open simultaneously.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                {[
                  {
                    q: 'What browsers are supported?',
                    a: 'All modern browsers including Chrome, Firefox, Safari, and Edge.',
                  },
                  {
                    q: 'Is it free to use?',
                    a: 'Yes, Spar is open source and free for both personal and commercial use.',
                  },
                  {
                    q: 'Does it work with Next.js?',
                    a: 'Yes, Spar is fully compatible with Next.js, Remix, and other React frameworks.',
                  },
                ].map((faq) => (
                  <Collapsible.Root key={`faq-${faq.q.slice(0, 20)}`} className='demo-collapsible'>
                    <Collapsible.Trigger className='demo-collapsible-trigger'>
                      {faq.q}
                      <span className='demo-chevron'>▾</span>
                    </Collapsible.Trigger>
                    <Collapsible.Content className='demo-collapsible-content'>
                      <p>{faq.a}</p>
                    </Collapsible.Content>
                  </Collapsible.Root>
                ))}
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Collapsible.Root>
  <Collapsible.Trigger>What browsers are supported?</Collapsible.Trigger>
  <Collapsible.Content>
    <p>All modern browsers.</p>
  </Collapsible.Content>
</Collapsible.Root>

<Collapsible.Root>
  <Collapsible.Trigger>Is it free to use?</Collapsible.Trigger>
  <Collapsible.Content>
    <p>Yes, it is open source.</p>
  </Collapsible.Content>
</Collapsible.Root>`}</code>
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
