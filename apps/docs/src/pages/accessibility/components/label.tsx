/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Label } from '@turkish-technology/spar';
import '../../../styles/accessibility-demos.scss';

export default function LabelDemo() {
  return (
    <Layout title='Label'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Label</h1>
        <p className='page-description'>
          Label provides a text caption for form controls and connects to inputs using{' '}
          <code>htmlFor</code>.
        </p>

        {/* 1. Basic Label */}
        <section className='demo-section'>
          <h2>1. Basic Label + Input</h2>
          <p className='demo-description'>
            Clicking the label focuses the associated input. Screen readers read the label when the
            input is focused.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <div className='demo-input-wrapper'>
                  <Label htmlFor='basic-input' className='demo-label'>
                    Username
                  </Label>
                  <input
                    id='basic-input'
                    className='demo-input'
                    type='text'
                    placeholder='Enter username'
                  />
                </div>
              </div>
              <div className='keyboard-hint'>
                <strong>Test:</strong> Click the label text — it should focus the input field.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Label htmlFor='basic-input'>Username</Label>
<input id='basic-input' type='text' />`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 2. Required Label */}
        <section className='demo-section'>
          <h2>2. Required Field Label</h2>
          <p className='demo-description'>
            Label with <code>required</code> prop. Exposes <code>data-required</code> for styling
            hooks. The control itself should also have <code>required</code> or{' '}
            <code>aria-required</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <div className='demo-input-wrapper'>
                  <Label htmlFor='required-input' className='demo-label' required>
                    Email *
                  </Label>
                  <input
                    id='required-input'
                    className='demo-input'
                    type='email'
                    required
                    aria-required='true'
                    placeholder='Required field'
                  />
                </div>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Label htmlFor='required-input' required>Email *</Label>
<input id='required-input' type='email' required />`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Optional Label */}
        <section className='demo-section'>
          <h2>3. Optional Field Label</h2>
          <p className='demo-description'>
            Label with <code>optional</code> prop for visual indicator. Exposes{' '}
            <code>data-optional</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <div className='demo-input-wrapper'>
                  <Label htmlFor='optional-input' className='demo-label' optional>
                    Phone (optional)
                  </Label>
                  <input
                    id='optional-input'
                    className='demo-input'
                    type='tel'
                    placeholder='Optional field'
                  />
                </div>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Label htmlFor='optional-input' optional>Phone</Label>
<input id='optional-input' type='tel' />`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 4. Disabled Label */}
        <section className='demo-section'>
          <h2>4. Disabled Field Label</h2>
          <p className='demo-description'>
            Label with <code>disabled</code> prop. Exposes <code>data-disabled</code>. The
            associated control should also be disabled.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <div className='demo-input-wrapper'>
                  <Label htmlFor='disabled-input' className='demo-label' disabled>
                    Organization (disabled)
                  </Label>
                  <input
                    id='disabled-input'
                    className='demo-input'
                    type='text'
                    disabled
                    value='Acme Corp'
                  />
                </div>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Clicking the label should NOT focus the disabled input.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Label htmlFor='disabled-input' disabled>Organization</Label>
<input id='disabled-input' disabled value='Acme Corp' />`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 5. Read-only Label */}
        <section className='demo-section'>
          <h2>5. Read-only Field Label</h2>
          <p className='demo-description'>
            Label with <code>readOnly</code> prop. Exposes <code>data-readonly</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <div className='demo-input-wrapper'>
                  <Label htmlFor='readonly-input' className='demo-label' readOnly>
                    Account ID (read-only)
                  </Label>
                  <input
                    id='readonly-input'
                    className='demo-input'
                    type='text'
                    readOnly
                    aria-readonly='true'
                    value='ACC-12345'
                  />
                </div>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Label htmlFor='readonly-input' readOnly>Account ID</Label>
<input id='readonly-input' readOnly value='ACC-12345' />`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Invalid Label */}
        <section className='demo-section'>
          <h2>6. Invalid Field Label</h2>
          <p className='demo-description'>
            Label with <code>invalid</code> prop. Exposes <code>data-invalid</code>. The control
            should have <code>aria-invalid=&quot;true&quot;</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <div className='demo-input-wrapper'>
                  <Label htmlFor='invalid-input' className='demo-label' invalid>
                    Password (invalid)
                  </Label>
                  <input
                    id='invalid-input'
                    className='demo-input'
                    type='password'
                    aria-invalid='true'
                    aria-describedby='invalid-error'
                    value='123'
                  />
                  <div id='invalid-error' role='alert' className='demo-input-error'>
                    Password must be at least 8 characters
                  </div>
                </div>
              </div>
              <div className='keyboard-hint'>
                <strong>Screen reader:</strong> Should announce invalid state and error message.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Label htmlFor='invalid-input' invalid>Password</Label>
<input id='invalid-input' aria-invalid='true' aria-describedby='invalid-error' />
<div id='invalid-error' role='alert'>Password must be at least 8 characters</div>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 7. Polymorphic Label */}
        <section className='demo-section'>
          <h2>7. Polymorphic Rendering</h2>
          <p className='demo-description'>
            Label can render as different HTML elements using the <code>as</code> prop.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-input-wrapper'>
                  <Label htmlFor='label-span' as='span' className='demo-label'>
                    As &lt;span&gt;
                  </Label>
                  <input
                    id='label-span'
                    className='demo-input'
                    type='text'
                    placeholder='span label'
                  />
                </div>
                <div className='demo-input-wrapper'>
                  <Label htmlFor='label-div' as='div' className='demo-label'>
                    As &lt;div&gt;
                  </Label>
                  <input
                    id='label-div'
                    className='demo-input'
                    type='text'
                    placeholder='div label'
                  />
                </div>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Label as='span' htmlFor='label-span'>As span</Label>
<input id='label-span' type='text' />

<Label as='div' htmlFor='label-div'>As div</Label>
<input id='label-div' type='text' />`}</code>
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
