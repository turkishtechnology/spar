/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Switch } from '@turkish-technology/spar';

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
                <Switch.Root id='basic-switch' className='demo-field'>
                  <Switch.Control className='demo-switch'>
                    <Switch.Track className='demo-switch-track'>
                      <Switch.Thumb className='demo-switch-thumb' />
                    </Switch.Track>
                  </Switch.Control>
                  <Switch.Label className='demo-label'>Enable feature</Switch.Label>
                </Switch.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab to focus → Space or Enter to toggle
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Switch.Root id='basic-switch'>
  <Switch.Control>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Control>
  <Switch.Label>Enable feature</Switch.Label>
</Switch.Root>`}</code>
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
                <Switch.Root
                  id='controlled-switch'
                  className='demo-field'
                  checked={controlled}
                  onChange={(checked) => {
                    setControlled(checked);
                  }}
                >
                  <Switch.Control className='demo-switch'>
                    <Switch.Track className='demo-switch-track'>
                      <Switch.Thumb className='demo-switch-thumb' />
                    </Switch.Track>
                  </Switch.Control>
                  <Switch.Label className='demo-label'>Dark mode</Switch.Label>
                </Switch.Root>
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

<Switch.Root
  id='controlled-switch'
  checked={checked}
  onChange={(nextChecked) => setChecked(nextChecked)}
>
  <Switch.Control>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Control>
  <Switch.Label>Dark mode</Switch.Label>
</Switch.Root>`}</code>
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
                <Switch.Root id='default-checked-switch' className='demo-field' defaultChecked>
                  <Switch.Control className='demo-switch'>
                    <Switch.Track className='demo-switch-track'>
                      <Switch.Thumb className='demo-switch-thumb' />
                    </Switch.Track>
                  </Switch.Control>
                  <Switch.Label className='demo-label'>Notifications (default on)</Switch.Label>
                </Switch.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Switch.Root id='default-checked-switch' defaultChecked>
  <Switch.Control>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Control>
  <Switch.Label>Notifications</Switch.Label>
</Switch.Root>`}</code>
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
                <Switch.Root id='disabled-off' className='demo-field' disabled>
                  <Switch.Control className='demo-switch'>
                    <Switch.Track className='demo-switch-track'>
                      <Switch.Thumb className='demo-switch-thumb' />
                    </Switch.Track>
                  </Switch.Control>
                  <Switch.Label className='demo-label'>Disabled (off)</Switch.Label>
                </Switch.Root>
                <Switch.Root id='disabled-on' className='demo-field' disabled defaultChecked>
                  <Switch.Control className='demo-switch'>
                    <Switch.Track className='demo-switch-track'>
                      <Switch.Thumb className='demo-switch-thumb' />
                    </Switch.Track>
                  </Switch.Control>
                  <Switch.Label className='demo-label'>Disabled (on)</Switch.Label>
                </Switch.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Tab should skip disabled switches.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Switch.Root id='disabled-off' disabled>
  <Switch.Control>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Control>
  <Switch.Label>Disabled (off)</Switch.Label>
</Switch.Root>

<Switch.Root id='disabled-on' disabled defaultChecked>
  <Switch.Control>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Control>
  <Switch.Label>Disabled (on)</Switch.Label>
</Switch.Root>`}</code>
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
                <Switch.Root id='readonly-switch' className='demo-field' readOnly defaultChecked>
                  <Switch.Control className='demo-switch'>
                    <Switch.Track className='demo-switch-track'>
                      <Switch.Thumb className='demo-switch-thumb' />
                    </Switch.Track>
                  </Switch.Control>
                  <Switch.Label className='demo-label'>Read-only (on)</Switch.Label>
                </Switch.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Switch.Root id='readonly-switch' readOnly defaultChecked>
  <Switch.Control>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Control>
  <Switch.Label>Read-only (on)</Switch.Label>
</Switch.Root>`}</code>
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
                <Switch.Root id='required-switch' className='demo-field' required>
                  <Switch.Control className='demo-switch'>
                    <Switch.Track className='demo-switch-track'>
                      <Switch.Thumb className='demo-switch-thumb' />
                    </Switch.Track>
                  </Switch.Control>
                  <Switch.Label className='demo-label'>Agree to terms *</Switch.Label>
                </Switch.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Switch.Root id='required-switch' required>
  <Switch.Control>
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Control>
  <Switch.Label>Agree to terms *</Switch.Label>
</Switch.Root>`}</code>
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
