/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Tooltip } from '@turkish-technology/spar';
import '../../../styles/accessibility-demos.scss';

export default function TooltipDemo() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <Layout title='Tooltip'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Tooltip</h1>
        <p className='page-description'>
          Tooltip displays short helper text for an element on hover or focus.
        </p>

        {/* 1. Basic Tooltip */}
        <section className='demo-section'>
          <h2>1. Basic Tooltip</h2>
          <p className='demo-description'>
            Hover or focus the trigger to show tooltip. Screen readers announce tooltip content via{' '}
            <code>aria-describedby</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger className='demo-btn'>Hover me</Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>
                      This is helpful tooltip text
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab to focus trigger → Tooltip appears → Escape to
                dismiss → Tab away hides tooltip
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>Hover me</Tooltip.Trigger>
    <Tooltip.Content>This is helpful tooltip text</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 2. Custom Delay */}
        <section className='demo-section'>
          <h2>2. Custom Delay</h2>
          <p className='demo-description'>
            Tooltip with a shorter delay (200ms) and a longer delay (1500ms). Provider-level{' '}
            <code>delayDuration</code> sets the default for all tooltips.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-row'>
                <Tooltip.Provider delayDuration={200}>
                  <Tooltip.Root>
                    <Tooltip.Trigger className='demo-btn'>Fast (200ms)</Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>
                      I appear quickly!
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
                <Tooltip.Provider delayDuration={1500}>
                  <Tooltip.Root>
                    <Tooltip.Trigger className='demo-btn'>Slow (1500ms)</Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>
                      I take a while to show up
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Tooltip.Provider delayDuration={200}>
  <Tooltip.Root>
    <Tooltip.Trigger>Fast</Tooltip.Trigger>
    <Tooltip.Content>I appear quickly</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Skip Delay (Moving Between Tooltips) */}
        <section className='demo-section'>
          <h2>3. Skip Delay Between Tooltips</h2>
          <p className='demo-description'>
            When moving between tooltips quickly, the delay is skipped.{' '}
            <code>skipDelayDuration</code> controls the window for instant show.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-row'>
                <Tooltip.Provider delayDuration={700} skipDelayDuration={300}>
                  <Tooltip.Root>
                    <Tooltip.Trigger className='demo-btn'>Button A</Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>Tooltip A</Tooltip.Content>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger className='demo-btn'>Button B</Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>Tooltip B</Tooltip.Content>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger className='demo-btn'>Button C</Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>Tooltip C</Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
              <div className='keyboard-hint'>
                <strong>Test:</strong> Hover A, then quickly move to B and C — they should appear
                instantly.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Tooltip.Provider delayDuration={700} skipDelayDuration={300}>
  <Tooltip.Root>
    <Tooltip.Trigger>Button A</Tooltip.Trigger>
    <Tooltip.Content>Tooltip A</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 4. Controlled Tooltip */}
        <section className='demo-section'>
          <h2>4. Controlled Tooltip</h2>
          <p className='demo-description'>
            Parent manages tooltip visibility. Can be shown/hidden programmatically.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-row'>
                  <button className='demo-btn' onClick={() => setControlledOpen(true)}>
                    Show Tooltip
                  </button>
                  <button className='demo-btn' onClick={() => setControlledOpen(false)}>
                    Hide Tooltip
                  </button>
                </div>
                <Tooltip.Provider>
                  <Tooltip.Root
                    open={controlledOpen}
                    onOpenChange={(open) => {
                      setControlledOpen(open);
                    }}
                  >
                    <Tooltip.Trigger className='demo-btn'>Controlled trigger</Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>
                      I am controlled by parent state
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`const [open, setOpen] = useState(false);

<Tooltip.Root open={open} onOpenChange={(nextOpen) => setOpen(nextOpen)}>
  <Tooltip.Trigger>Controlled trigger</Tooltip.Trigger>
  <Tooltip.Content>Controlled tooltip</Tooltip.Content>
</Tooltip.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 5. Default Open */}
        <section className='demo-section'>
          <h2>5. Default Open</h2>
          <p className='demo-description'>Tooltip that starts visible on mount.</p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Tooltip.Provider>
                  <Tooltip.Root defaultOpen>
                    <Tooltip.Trigger className='demo-btn'>
                      I start with tooltip visible
                    </Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>
                      I was open from the start!
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Tooltip.Root defaultOpen>
  <Tooltip.Trigger>Visible trigger</Tooltip.Trigger>
  <Tooltip.Content>I was open from the start!</Tooltip.Content>
</Tooltip.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Disabled Trigger */}
        <section className='demo-section'>
          <h2>6. Disabled Tooltip</h2>
          <p className='demo-description'>
            Tooltip with a disabled trigger. Tooltip should still work on hover but the trigger
            cannot be activated.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger className='demo-btn' disabled>
                      Disabled button
                    </Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>
                      This button is disabled
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Tooltip.Root>
  <Tooltip.Trigger disabled>Disabled button</Tooltip.Trigger>
  <Tooltip.Content>This button is disabled</Tooltip.Content>
</Tooltip.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 7. Long Content */}
        <section className='demo-section'>
          <h2>7. Long Tooltip Content</h2>
          <p className='demo-description'>
            Tooltips with longer descriptions. Should wrap properly within max-width.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-row'>
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger className='demo-btn'>Short</Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>Brief tip</Tooltip.Content>
                  </Tooltip.Root>
                  <Tooltip.Root>
                    <Tooltip.Trigger className='demo-btn'>Long</Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>
                      This is a much longer tooltip that contains detailed information about the
                      feature, including usage instructions and helpful context for the user.
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Tooltip.Root>
  <Tooltip.Trigger>Long</Tooltip.Trigger>
  <Tooltip.Content>This is a much longer tooltip text.</Tooltip.Content>
</Tooltip.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 8. Render Props */}
        <section className='demo-section'>
          <h2>8. Render Props Pattern</h2>
          <p className='demo-description'>
            Trigger exposes <code>isOpen</code> for custom rendering.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger className='demo-btn'>
                      {({ isOpen }) => (isOpen ? '👁 Tooltip visible' : '💬 Hover for info')}
                    </Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>
                      The trigger text changes when I&apos;m shown
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Tooltip.Root>
  <Tooltip.Trigger>
    {({ isOpen }) => (isOpen ? 'Tooltip visible' : 'Hover for info')}
  </Tooltip.Trigger>
  <Tooltip.Content>Trigger text changes when shown</Tooltip.Content>
</Tooltip.Root>`}</code>
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
