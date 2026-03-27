/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Input } from '@turkish-technology/spar';

import '../../../styles/accessibility-demos.scss';

export default function InputDemo() {
  const [value, setValue] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  const validateEmail = (v: string) => {
    if (v.length === 0) return false;
    return !v.includes('@');
  };

  return (
    <Layout title='Input – A11y Demo'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Input – Accessibility Demo</h1>
        <p className='page-description'>
          Compound input component with label, field, description, and error message. All parts are
          linked via ARIA attributes automatically.
        </p>

        {/* 1. Basic Input */}
        <section className='demo-section'>
          <h2>1. Basic Input with Label</h2>
          <p className='demo-description'>
            Label is automatically linked to the field. Clicking the label focuses the input.{' '}
            <code>aria-labelledby</code> and <code>aria-describedby</code> are set automatically.
          </p>
          <div className='demo-area'>
            <Input>
              <Input.Label className='demo-label'>Username</Input.Label>
              <Input.Field className='demo-input' placeholder='Enter your username' />
              <Input.Description className='demo-input-description'>
                Your unique username for login
              </Input.Description>
            </Input>
          </div>
          <div className='keyboard-hint'>
            <strong>Test:</strong> Click the label → input should focus. Screen reader should read
            label + description.
          </div>
        </section>

        {/* 2. Required Input */}
        <section className='demo-section'>
          <h2>2. Required Input</h2>
          <p className='demo-description'>
            Uses <code>aria-required</code> on the field. Screen readers announce as required.
          </p>
          <div className='demo-area'>
            <Input required>
              <Input.Label className='demo-label'>Email *</Input.Label>
              <Input.Field className='demo-input' type='email' placeholder='Required field' />
              <Input.Description className='demo-input-description'>
                We&apos;ll never share your email
              </Input.Description>
            </Input>
          </div>
        </section>

        {/* 3. Invalid Input with Error Message */}
        <section className='demo-section'>
          <h2>3. Invalid Input with Error Message</h2>
          <p className='demo-description'>
            When invalid, the error message is linked via <code>aria-errormessage</code> or{' '}
            <code>aria-describedby</code>. The error uses <code>role=&quot;alert&quot;</code> for
            live announcement.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Input isInvalid={isInvalid} required>
                  <Input.Label className='demo-label'>Email</Input.Label>
                  <Input.Field
                    className='demo-input'
                    type='email'
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const v = e.target.value;
                      setValue(v);
                      setIsInvalid(validateEmail(v));
                    }}
                    placeholder='Type an invalid email to see error'
                  />
                  <Input.Description className='demo-input-description'>
                    Enter a valid email address
                  </Input.Description>
                  {isInvalid && (
                    <Input.ErrorMessage className='demo-input-error'>
                      Please enter a valid email address (must contain @)
                    </Input.ErrorMessage>
                  )}
                </Input>
              </div>
              <div className='keyboard-hint'>
                <strong>Screen reader:</strong> Error message should be announced when it appears.
              </div>
            </div>
          </div>
        </section>

        {/* 4. Disabled Input */}
        <section className='demo-section'>
          <h2>4. Disabled Input</h2>
          <p className='demo-description'>Disabled inputs cannot be focused or edited.</p>
          <div className='demo-area'>
            <Input disabled>
              <Input.Label className='demo-label'>Organization</Input.Label>
              <Input.Field className='demo-input' value='Acme Corporation' />
              <Input.Description className='demo-input-description'>
                Contact support to change your organization
              </Input.Description>
            </Input>
          </div>
          <div className='keyboard-hint'>
            <strong>Expected:</strong> Tab should skip the disabled input.
          </div>
        </section>

        {/* 5. Read-only Input */}
        <section className='demo-section'>
          <h2>5. Read-only Input</h2>
          <p className='demo-description'>
            Read-only inputs are focusable and selectable but cannot be edited. Uses{' '}
            <code>aria-readonly</code>.
          </p>
          <div className='demo-area'>
            <Input readOnly>
              <Input.Label className='demo-label'>Account ID</Input.Label>
              <Input.Field className='demo-input' value='ACC-2025-XYZ' />
              <Input.Description className='demo-input-description'>
                This value cannot be changed
              </Input.Description>
            </Input>
          </div>
        </section>

        {/* 6. Auto Focus */}
        <section className='demo-section'>
          <h2>6. Auto Focus Input</h2>
          <p className='demo-description'>Input that automatically receives focus on mount.</p>
          <div className='demo-area'>
            <Input>
              <Input.Label className='demo-label'>Search</Input.Label>
              <Input.Field className='demo-input' placeholder='I should be focused' autoFocus />
            </Input>
          </div>
        </section>
      </div>
    </Layout>
  );
}
