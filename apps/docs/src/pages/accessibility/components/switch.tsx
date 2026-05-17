/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Field, Switch } from '@turkish-technology/spar';

import '../../../styles/accessibility-demos.scss';

export default function SwitchDemo() {
  const [controlled, setControlled] = useState(false);

  return (
    <Layout title='Switch'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Switch</h1>
        <p className='page-description'>Switch toggles a setting between on and off states.</p>

        {/* 1. Basic Switch */}
        <section className='demo-section'>
          <h2>1. Basic Switch (Uncontrolled)</h2>
          <p className='demo-description'>
            Click or press Space/Enter to toggle. Screen readers announce &quot;on&quot; or
            &quot;off&quot; via <code>role=&quot;switch&quot;</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field id='basic-switch' className='demo-field'>
                  <Field.Label className='demo-label'>Enable feature</Field.Label>
                  <Switch className='demo-switch' />
                </Field>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab to focus → Space or Enter to toggle
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field id='basic-switch'>
  <Field.Label>Enable feature</Field.Label>
  <Switch />
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
                <Field id='controlled-switch' className='demo-field'>
                  <Field.Label className='demo-label'>Dark mode</Field.Label>
                  <Switch
                    className='demo-switch'
                    checked={controlled}
                    onChange={(checked) => setControlled(checked)}
                  />
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

<Field id='controlled-switch'>
  <Field.Label>Dark mode</Field.Label>
  <Switch
    checked={checked}
    onChange={(nextChecked) => setChecked(nextChecked)}
  />
</Field>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Default Checked */}
        <section className='demo-section'>
          <h2>3. Default Checked</h2>
          <p className='demo-description'>Switch that starts in the &quot;on&quot; state.</p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field id='default-checked-switch' className='demo-field'>
                  <Field.Label className='demo-label'>Notifications (default on)</Field.Label>
                  <Switch className='demo-switch' defaultChecked />
                </Field>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field id='default-checked-switch'>
  <Field.Label>Notifications</Field.Label>
  <Switch defaultChecked />
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
                <Field id='disabled-off' className='demo-field' disabled>
                  <Field.Label className='demo-label'>Disabled (off)</Field.Label>
                  <Switch className='demo-switch' />
                </Field>
                <Field id='disabled-on' className='demo-field' disabled>
                  <Field.Label className='demo-label'>Disabled (on)</Field.Label>
                  <Switch className='demo-switch' defaultChecked />
                </Field>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Tab should skip disabled switches.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field id='disabled-off' disabled>
  <Field.Label>Disabled (off)</Field.Label>
  <Switch />
</Field>

<Field id='disabled-on' disabled>
  <Field.Label>Disabled (on)</Field.Label>
  <Switch defaultChecked />
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
                <Field id='readonly-switch' className='demo-field' readOnly>
                  <Field.Label className='demo-label'>Read-only (on)</Field.Label>
                  <Switch className='demo-switch' defaultChecked />
                </Field>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field id='readonly-switch' readOnly>
  <Field.Label>Read-only (on)</Field.Label>
  <Switch defaultChecked />
</Field>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Required Switch */}
        <section className='demo-section'>
          <h2>6. Required Switch</h2>
          <p className='demo-description'>
            Switch marked as required for form validation. Uses <code>aria-required</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field id='required-switch' className='demo-field' required>
                  <Field.Label className='demo-label'>Agree to terms</Field.Label>
                  <Switch className='demo-switch' />
                </Field>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field id='required-switch' required>
  <Field.Label>Agree to terms</Field.Label>
  <Switch />
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
