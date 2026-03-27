/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Popover } from '@turkish-technology/spar';
import '../../../styles/accessibility-demos.scss';

export default function PopoverDemo() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <Layout title='Popover – A11y Demo'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Popover – Accessibility Demo</h1>
        <p className='page-description'>
          Popover component with focus management, Escape to close, modal/non-modal modes, and ARIA
          attributes.
        </p>

        {/* 1. Basic Popover */}
        <section className='demo-section'>
          <h2>1. Basic Popover (Non-modal)</h2>
          <p className='demo-description'>
            Click trigger to open. Escape or click outside to close. Focus moves to popover content.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Popover.Root>
                  <Popover.Trigger className='demo-btn'>Open Popover</Popover.Trigger>
                  <Popover.Content className='demo-popover-content'>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Popover Title</h3>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem' }}>
                      This is a non-modal popover. You can interact with the page behind it.
                    </p>
                    <Popover.Close className='demo-btn'>Close</Popover.Close>
                  </Popover.Content>
                </Popover.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Enter/Space to open → Tab into content → Escape to close
                → Focus returns to trigger
              </div>
            </div>
          </div>
        </section>

        {/* 2. Modal Popover */}
        <section className='demo-section'>
          <h2>2. Modal Popover (Focus Trap)</h2>
          <p className='demo-description'>
            Modal popover traps focus inside. Background is not interactive.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Popover.Root modal>
                  <Popover.Trigger className='demo-btn'>Open Modal Popover</Popover.Trigger>
                  <Popover.Content className='demo-popover-content'>
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Modal Popover</h3>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>
                      Focus is trapped here. Tab cycles within the popover.
                    </p>
                    <div className='demo-input-wrapper' style={{ marginBottom: '0.75rem' }}>
                      <label htmlFor='popover-input' className='demo-label'>
                        Name
                      </label>
                      <input
                        id='popover-input'
                        className='demo-input'
                        type='text'
                        placeholder='Type here…'
                      />
                    </div>
                    <Popover.Close className='demo-btn'>Close</Popover.Close>
                  </Popover.Content>
                </Popover.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Tab cycles within popover only. Cannot reach page
                content.
              </div>
            </div>
          </div>
        </section>

        {/* 3. Controlled Popover */}
        <section className='demo-section'>
          <h2>3. Controlled Popover</h2>
          <p className='demo-description'>
            Parent manages open state. Can be opened/closed programmatically.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-row'>
                  <button className='demo-btn' onClick={() => setControlledOpen(true)}>
                    Open externally
                  </button>
                  <button className='demo-btn' onClick={() => setControlledOpen(false)}>
                    Close externally
                  </button>
                </div>
                <Popover.Root
                  open={controlledOpen}
                  onOpenChange={(open) => {
                    setControlledOpen(open);
                  }}
                >
                  <Popover.Trigger className='demo-btn'>Controlled Popover</Popover.Trigger>
                  <Popover.Content className='demo-popover-content'>
                    <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem' }}>
                      This popover is controlled by parent state.
                    </p>
                    <Popover.Close className='demo-btn'>Close</Popover.Close>
                  </Popover.Content>
                </Popover.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Disabled Trigger */}
        <section className='demo-section'>
          <h2>4. Disabled Trigger</h2>
          <p className='demo-description'>
            Disabled popover trigger prevents the popover from opening.
          </p>
          <div className='demo-area demo-row'>
            <Popover.Root disabled>
              <Popover.Trigger className='demo-btn'>Disabled Popover</Popover.Trigger>
              <Popover.Content className='demo-popover-content'>
                <p>Should not appear.</p>
              </Popover.Content>
            </Popover.Root>
          </div>
        </section>

        {/* 5. Render Props */}
        <section className='demo-section'>
          <h2>5. Render Props Pattern</h2>
          <p className='demo-description'>
            Trigger exposes <code>isOpen</code>, <code>open</code>, <code>close</code>,{' '}
            <code>toggle</code> for custom rendering.
          </p>
          <div className='demo-area'>
            <Popover.Root>
              <Popover.Trigger className='demo-btn'>
                {({ isOpen }) => (isOpen ? '✕ Close Info' : 'ℹ Show Info')}
              </Popover.Trigger>
              <Popover.Content className='demo-popover-content'>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Trigger text changes based on popover state.
                </p>
              </Popover.Content>
            </Popover.Root>
          </div>
        </section>
      </div>
    </Layout>
  );
}
