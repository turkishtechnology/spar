/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Dialog } from '@turkish-technology/spar';

import '../../../styles/accessibility-demos.scss';

export default function DialogDemo() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <Layout title='Dialog'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Dialog – Accessibility Demo</h1>
        <p className='page-description'>
          Modal and non-modal dialog with focus trap, <code>aria-modal</code>, title/description
          linking, Escape to close, and focus restoration.
        </p>

        {/* 1. Basic Modal Dialog */}
        <section className='demo-section'>
          <h2>1. Basic Modal Dialog</h2>
          <p className='demo-description'>
            Modal dialog traps focus inside. Escape closes it. Focus returns to the trigger. Title
            and description are linked via <code>aria-labelledby</code> and{' '}
            <code>aria-describedby</code>.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Dialog.Root>
                  <Dialog.Trigger className='demo-btn'>Open Modal Dialog</Dialog.Trigger>
                  <Dialog.Overlay className='demo-overlay' />
                  <Dialog.Content className='demo-dialog'>
                    <Dialog.Title className='demo-dialog-title'>Confirm Action</Dialog.Title>
                    <Dialog.Description className='demo-dialog-description'>
                      Are you sure you want to proceed? This action cannot be undone.
                    </Dialog.Description>
                    <div className='demo-dialog-actions'>
                      <Dialog.Close className='demo-btn'>Cancel</Dialog.Close>
                      <Dialog.Close className='demo-btn'>Confirm</Dialog.Close>
                    </div>
                  </Dialog.Content>
                </Dialog.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Enter/Space to open → Tab cycles within dialog → Escape
                to close → Focus returns to trigger
              </div>
            </div>
          </div>
        </section>

        {/* 2. Non-modal Dialog */}
        <section className='demo-section'>
          <h2>2. Non-modal Dialog</h2>
          <p className='demo-description'>
            Non-modal dialog does NOT trap focus. Background content remains interactive. Uses{' '}
            <code>modal=&#123;false&#125;</code>.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Dialog.Root modal={false}>
                  <Dialog.Trigger className='demo-btn'>Open Non-modal Dialog</Dialog.Trigger>
                  <Dialog.Content className='demo-dialog' style={{ marginTop: 8 }}>
                    <Dialog.Title className='demo-dialog-title'>Info Panel</Dialog.Title>
                    <Dialog.Description className='demo-dialog-description'>
                      This is a non-modal dialog. You can still interact with the page behind it.
                    </Dialog.Description>
                    <Dialog.Close className='demo-btn'>Close</Dialog.Close>
                  </Dialog.Content>
                </Dialog.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Tab can leave the dialog to page content.
              </div>
            </div>
          </div>
        </section>

        {/* 3. Controlled Dialog */}
        <section className='demo-section'>
          <h2>3. Controlled Dialog</h2>
          <p className='demo-description'>
            Parent manages open state. Can be opened/closed programmatically.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-row'>
                  <button className='demo-btn' onClick={() => setControlledOpen(true)}>
                    Open from external button
                  </button>
                </div>
                <Dialog.Root
                  open={controlledOpen}
                  onOpenChange={(open) => {
                    setControlledOpen(open);
                  }}
                >
                  <Dialog.Trigger className='demo-btn'>Open Controlled Dialog</Dialog.Trigger>
                  <Dialog.Overlay className='demo-overlay' />
                  <Dialog.Content className='demo-dialog'>
                    <Dialog.Title className='demo-dialog-title'>Controlled Dialog</Dialog.Title>
                    <Dialog.Description className='demo-dialog-description'>
                      This dialog is controlled by parent state.
                    </Dialog.Description>
                    <Dialog.Close className='demo-btn'>Close</Dialog.Close>
                  </Dialog.Content>
                </Dialog.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Dialog with Form */}
        <section className='demo-section'>
          <h2>4. Dialog with Interactive Form</h2>
          <p className='demo-description'>
            Dialog containing form elements. Focus should move to the first focusable element. Tab
            order stays within the dialog.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Dialog.Root>
                  <Dialog.Trigger className='demo-btn'>Edit Profile</Dialog.Trigger>
                  <Dialog.Overlay className='demo-overlay' />
                  <Dialog.Content className='demo-dialog'>
                    <Dialog.Title className='demo-dialog-title'>Edit Profile</Dialog.Title>
                    <Dialog.Description className='demo-dialog-description'>
                      Update your profile information below.
                    </Dialog.Description>
                    <div className='demo-col' style={{ gap: '0.75rem', margin: '1rem 0' }}>
                      <div className='demo-input-wrapper'>
                        <label htmlFor='dialog-name' className='demo-label'>
                          Name
                        </label>
                        <input
                          id='dialog-name'
                          className='demo-input'
                          type='text'
                          placeholder='Your name'
                        />
                      </div>
                      <div className='demo-input-wrapper'>
                        <label htmlFor='dialog-email' className='demo-label'>
                          Email
                        </label>
                        <input
                          id='dialog-email'
                          className='demo-input'
                          type='email'
                          placeholder='your@email.com'
                        />
                      </div>
                      <div className='demo-input-wrapper'>
                        <label htmlFor='dialog-bio' className='demo-label'>
                          Bio
                        </label>
                        <textarea
                          id='dialog-bio'
                          className='demo-input'
                          placeholder='About you'
                          style={{ minHeight: 60 }}
                        />
                      </div>
                    </div>
                    <div className='demo-dialog-actions'>
                      <Dialog.Close className='demo-btn'>Cancel</Dialog.Close>
                      <Dialog.Close className='demo-btn'>Save</Dialog.Close>
                    </div>
                  </Dialog.Content>
                </Dialog.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Focus test:</strong> Tab should cycle through Name → Email → Bio → Cancel →
                Save → back to Name
              </div>
            </div>
          </div>
        </section>

        {/* 5. Disabled Trigger */}
        <section className='demo-section'>
          <h2>5. Disabled Trigger</h2>
          <p className='demo-description'>Dialog trigger can be disabled to prevent opening.</p>
          <div className='demo-area demo-row'>
            <Dialog.Root disabled>
              <Dialog.Trigger className='demo-btn'>Disabled Trigger</Dialog.Trigger>
              <Dialog.Overlay className='demo-overlay' />
              <Dialog.Content className='demo-dialog'>
                <Dialog.Title className='demo-dialog-title'>Should not open</Dialog.Title>
                <Dialog.Close className='demo-btn'>Close</Dialog.Close>
              </Dialog.Content>
            </Dialog.Root>
          </div>
        </section>

        {/* 6. Default Open */}
        <section className='demo-section'>
          <h2>6. Render Props Pattern</h2>
          <p className='demo-description'>Trigger exposes render props to show open/close state.</p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Dialog.Root>
                  <Dialog.Trigger className='demo-btn'>
                    {({ isOpen }) => (isOpen ? '✕ Close dialog' : '⊕ Open dialog')}
                  </Dialog.Trigger>
                  <Dialog.Overlay className='demo-overlay' />
                  <Dialog.Content className='demo-dialog'>
                    <Dialog.Title className='demo-dialog-title'>Render Props Demo</Dialog.Title>
                    <Dialog.Description className='demo-dialog-description'>
                      The trigger text changes based on open state.
                    </Dialog.Description>
                    <Dialog.Close className='demo-btn'>Close</Dialog.Close>
                  </Dialog.Content>
                </Dialog.Root>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
