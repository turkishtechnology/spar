/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Switch, Label } from '@turkish-technology/spar';

import '../../../styles/accessibility-demos.scss';

export default function SwitchDemo() {
  const [controlled, setControlled] = useState(false);

  return (
    <Layout title='Switch – A11y Demo'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Switch – Accessibility Demo</h1>
        <p className='page-description'>
          Toggle switch component with <code>role=&quot;switch&quot;</code> and{' '}
          <code>aria-checked</code> for screen reader support.
        </p>

        {/* 1. Basic Switch */}
        <section className='demo-section'>
          <h2>1. Basic Switch (Uncontrolled)</h2>
          <p className='demo-description'>
            Click or press Space/Enter to toggle. Screen readers announce &quot;on&quot; or
            &quot;off&quot; via <code>role=&quot;switch&quot;</code>.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <div className='demo-field'>
                  <Switch id='basic-switch' className='demo-switch'>
                    {({ checked: _checked }) => <span className='demo-switch-thumb' />}
                  </Switch>
                  <Label htmlFor='basic-switch' className='demo-label'>
                    Enable feature
                  </Label>
                </div>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab to focus → Space or Enter to toggle
              </div>
            </div>
          </div>
        </section>

        {/* 2. Controlled Switch */}
        <section className='demo-section'>
          <h2>2. Controlled Switch</h2>
          <p className='demo-description'>
            Parent manages the checked state. External controls can change the value.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-field'>
                  <Switch
                    id='controlled-switch'
                    className='demo-switch'
                    checked={controlled}
                    onChange={(checked) => {
                      setControlled(checked);
                    }}
                  >
                    {() => <span className='demo-switch-thumb' />}
                  </Switch>
                  <Label htmlFor='controlled-switch' className='demo-label'>
                    Dark mode
                  </Label>
                </div>
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
          </div>
        </section>

        {/* 3. Default Checked */}
        <section className='demo-section'>
          <h2>3. Default Checked</h2>
          <p className='demo-description'>Switch that starts in the &quot;on&quot; state.</p>
          <div className='demo-area'>
            <div className='demo-field'>
              <Switch id='default-checked-switch' className='demo-switch' defaultChecked>
                {() => <span className='demo-switch-thumb' />}
              </Switch>
              <Label htmlFor='default-checked-switch' className='demo-label'>
                Notifications (default on)
              </Label>
            </div>
          </div>
        </section>

        {/* 4. Disabled Switch */}
        <section className='demo-section'>
          <h2>4. Disabled Switch</h2>
          <p className='demo-description'>
            Disabled switches cannot be toggled. Screen readers announce the disabled state.
          </p>
          <div className='demo-area demo-col'>
            <div className='demo-field'>
              <Switch id='disabled-off' className='demo-switch' disabled>
                {() => <span className='demo-switch-thumb' />}
              </Switch>
              <Label htmlFor='disabled-off' className='demo-label' disabled>
                Disabled (off)
              </Label>
            </div>
            <div className='demo-field'>
              <Switch id='disabled-on' className='demo-switch' disabled defaultChecked>
                {() => <span className='demo-switch-thumb' />}
              </Switch>
              <Label htmlFor='disabled-on' className='demo-label' disabled>
                Disabled (on)
              </Label>
            </div>
          </div>
          <div className='keyboard-hint'>
            <strong>Expected:</strong> Tab should skip disabled switches.
          </div>
        </section>

        {/* 5. Read-only Switch */}
        <section className='demo-section'>
          <h2>5. Read-only Switch</h2>
          <p className='demo-description'>
            Focusable but state cannot be changed. Uses <code>aria-readonly</code>.
          </p>
          <div className='demo-area'>
            <div className='demo-field'>
              <Switch id='readonly-switch' className='demo-switch' readOnly defaultChecked>
                {() => <span className='demo-switch-thumb' />}
              </Switch>
              <Label htmlFor='readonly-switch' className='demo-label' readOnly>
                Read-only (on)
              </Label>
            </div>
          </div>
        </section>

        {/* 6. Required Switch */}
        <section className='demo-section'>
          <h2>6. Required Switch</h2>
          <p className='demo-description'>
            Switch marked as required for form validation. Uses <code>aria-required</code>.
          </p>
          <div className='demo-area'>
            <div className='demo-field'>
              <Switch id='required-switch' className='demo-switch' required>
                {() => <span className='demo-switch-thumb' />}
              </Switch>
              <Label htmlFor='required-switch' className='demo-label' required>
                Agree to terms *
              </Label>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
