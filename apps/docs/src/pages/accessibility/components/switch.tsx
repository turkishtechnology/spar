/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Field, Switch } from '@turkish-technology/spar';

import '../../../styles/accessibility-demos.scss';

export default function SwitchDemo() {
  const [controlled, setControlled] = useState(false);
  const [required, setRequired] = useState(false);

  return (
    <Layout title='Switch'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Switch</h1>
        <p className='page-description'>
          Switch toggles a setting between on and off states. Wrap it in a Field to get automatic
          label, description, and error-message wiring with coordinated ARIA IDs.
        </p>

        {/* 1. Basic Switch with Field */}
        <section className='demo-section'>
          <h2>1. Basic Switch with Label</h2>
          <p className='demo-description'>
            Label is automatically linked to the control. Clicking the label toggles the switch.{' '}
            <code>aria-labelledby</code> and <code>aria-describedby</code> are set automatically.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field>
                  <div className='demo-row'>
                    <Field.Label className='demo-label'>Enable notifications</Field.Label>
                    <Switch.Root>
                      <Switch.Control className='demo-switch'>
                        <Switch.Track className='demo-switch-track'>
                          <Switch.Thumb className='demo-switch-thumb' />
                        </Switch.Track>
                      </Switch.Control>
                    </Switch.Root>
                  </div>
                  <Field.Description className='demo-input-description'>
                    Receive push notifications for flight updates
                  </Field.Description>
                </Field>
              </div>
              <div className='keyboard-hint'>
                <strong>Test:</strong> Click the label → switch should toggle. Screen reader should
                read label + description.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field>
  <Field.Label>Enable notifications</Field.Label>
  <Switch.Root>
    <Switch.Control>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Control>
  </Switch.Root>
  <Field.Description>
    Receive push notifications for flight updates
  </Field.Description>
</Field>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 2. Controlled Switch */}
        <section className='demo-section'>
          <h2>2. Controlled Switch</h2>
          <p className='demo-description'>
            Parent manages the checked state. External controls can change the value.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <Field>
                  <div className='demo-row'>
                    <Field.Label className='demo-label'>Dark mode</Field.Label>
                    <Switch.Root checked={controlled} onChange={setControlled}>
                      <Switch.Control className='demo-switch'>
                        <Switch.Track className='demo-switch-track'>
                          <Switch.Thumb className='demo-switch-thumb' />
                        </Switch.Track>
                      </Switch.Control>
                    </Switch.Root>
                  </div>
                </Field>
                <div className='demo-row'>
                  <button className='demo-btn' onClick={() => setControlled(true)}>
                    Turn On
                  </button>
                  <button className='demo-btn' onClick={() => setControlled(false)}>
                    Turn Off
                  </button>
                </div>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`const [checked, setChecked] = useState(false);

<Field>
  <Field.Label>Dark mode</Field.Label>
  <Switch.Root checked={checked} onChange={setChecked}>
    <Switch.Control>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Control>
  </Switch.Root>
</Field>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Required with Error Message */}
        <section className='demo-section'>
          <h2>3. Required Switch with Error Message</h2>
          <p className='demo-description'>
            When invalid, the error message is linked via <code>aria-describedby</code>. The error
            uses <code>role=&quot;alert&quot;</code> for live announcement.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field required invalid={!required}>
                  <div className='demo-row'>
                    <Field.Label className='demo-label'>Accept terms *</Field.Label>
                    <Switch.Root checked={required} onChange={setRequired}>
                      <Switch.Control className='demo-switch'>
                        <Switch.Track className='demo-switch-track'>
                          <Switch.Thumb className='demo-switch-thumb' />
                        </Switch.Track>
                      </Switch.Control>
                    </Switch.Root>
                  </div>
                  <Field.Description className='demo-input-description'>
                    You must accept the terms to continue
                  </Field.Description>
                  <Field.ErrorMessage className='demo-input-error'>
                    This field is required
                  </Field.ErrorMessage>
                </Field>
              </div>
              <div className='keyboard-hint'>
                <strong>Screen reader:</strong> Error message should be announced when it appears.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field required invalid={!accepted}>
  <Field.Label>Accept terms *</Field.Label>
  <Switch.Root checked={accepted} onChange={setAccepted}>
    <Switch.Control>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Control>
  </Switch.Root>
  <Field.ErrorMessage>This field is required</Field.ErrorMessage>
</Field>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 4. Disabled Switch */}
        <section className='demo-section'>
          <h2>4. Disabled Switch</h2>
          <p className='demo-description'>
            Disabled switches cannot be toggled. Screen readers announce the disabled state.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <Field disabled>
                  <div className='demo-row'>
                    <Field.Label className='demo-label'>Disabled (off)</Field.Label>
                    <Switch.Root>
                      <Switch.Control className='demo-switch'>
                        <Switch.Track className='demo-switch-track'>
                          <Switch.Thumb className='demo-switch-thumb' />
                        </Switch.Track>
                      </Switch.Control>
                    </Switch.Root>
                  </div>
                </Field>
                <Field disabled>
                  <div className='demo-row'>
                    <Field.Label className='demo-label'>Disabled (on)</Field.Label>
                    <Switch.Root defaultChecked>
                      <Switch.Control className='demo-switch'>
                        <Switch.Track className='demo-switch-track'>
                          <Switch.Thumb className='demo-switch-thumb' />
                        </Switch.Track>
                      </Switch.Control>
                    </Switch.Root>
                  </div>
                  <Field.Description className='demo-input-description'>
                    Contact support to change this setting
                  </Field.Description>
                </Field>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Tab should skip disabled switches.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field disabled>
  <Field.Label>Disabled (off)</Field.Label>
  <Switch.Root>
    <Switch.Control>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Control>
  </Switch.Root>
</Field>

<Field disabled>
  <Field.Label>Disabled (on)</Field.Label>
  <Switch.Root defaultChecked>
    <Switch.Control>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Control>
  </Switch.Root>
</Field>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 5. Read-only Switch */}
        <section className='demo-section'>
          <h2>5. Read-only Switch</h2>
          <p className='demo-description'>
            Focusable but state cannot be changed. Uses <code>aria-readonly</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field readOnly>
                  <div className='demo-row'>
                    <Field.Label className='demo-label'>Read-only (on)</Field.Label>
                    <Switch.Root defaultChecked>
                      <Switch.Control className='demo-switch'>
                        <Switch.Track className='demo-switch-track'>
                          <Switch.Thumb className='demo-switch-thumb' />
                        </Switch.Track>
                      </Switch.Control>
                    </Switch.Root>
                  </div>
                  <Field.Description className='demo-input-description'>
                    This value cannot be changed
                  </Field.Description>
                </Field>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field readOnly>
  <Field.Label>Read-only (on)</Field.Label>
  <Switch.Root defaultChecked>
    <Switch.Control>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Control>
  </Switch.Root>
</Field>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Default Checked */}
        <section className='demo-section'>
          <h2>6. Default Checked</h2>
          <p className='demo-description'>Switch that starts in the &quot;on&quot; state.</p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field>
                  <div className='demo-row'>
                    <Field.Label className='demo-label'>Notifications</Field.Label>
                    <Switch.Root defaultChecked>
                      <Switch.Control className='demo-switch'>
                        <Switch.Track className='demo-switch-track'>
                          <Switch.Thumb className='demo-switch-thumb' />
                        </Switch.Track>
                      </Switch.Control>
                    </Switch.Root>
                  </div>
                </Field>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field>
  <Field.Label>Notifications</Field.Label>
  <Switch.Root defaultChecked>
    <Switch.Control>
      <Switch.Track>
        <Switch.Thumb />
      </Switch.Track>
    </Switch.Control>
  </Switch.Root>
</Field>`}</code>
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
