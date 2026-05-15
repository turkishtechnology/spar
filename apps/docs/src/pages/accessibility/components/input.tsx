/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Field, Input } from '@turkish-technology/spar';

import '../../../styles/accessibility-demos.scss';

export default function InputDemo() {
  const [value, setValue] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  const validateEmail = (v: string) => {
    if (v.length === 0) return false;
    return !v.includes('@');
  };

  return (
    <Layout title='Input'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Input</h1>
        <p className='page-description'>
          Input combines field, label, hint, and error parts for collecting and validating user text
          input.
        </p>

        {/* 1. Basic Input */}
        <section className='demo-section'>
          <h2>1. Basic Input with Label</h2>
          <p className='demo-description'>
            Label is automatically linked to the field. Clicking the label focuses the input.{' '}
            <code>aria-labelledby</code> and <code>aria-describedby</code> are set automatically.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field>
                  <Field.Label className='demo-label'>Username</Field.Label>
                  <Input>
                    <Input.Field className='demo-input' placeholder='Enter your username' />
                  </Input>
                  <Field.Description className='demo-input-description'>
                    Your unique username for login
                  </Field.Description>
                </Field>
              </div>
              <div className='keyboard-hint'>
                <strong>Test:</strong> Click the label → input should focus. Screen reader should
                read label + description.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field>
  <Field.Label>Username</Field.Label>
  <Input>
    <Input.Field placeholder='Enter your username' />
  </Input>
  <Field.Description>Your unique username for login</Field.Description>
</Field>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 2. Required Input */}
        <section className='demo-section'>
          <h2>2. Required Input</h2>
          <p className='demo-description'>
            Uses <code>aria-required</code> on the field. Screen readers announce as required.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field required>
                  <Field.Label className='demo-label'>Email *</Field.Label>
                  <Input>
                    <Input.Field className='demo-input' type='email' placeholder='Required field' />
                  </Input>
                  <Field.Description className='demo-input-description'>
                    We&apos;ll never share your email
                  </Field.Description>
                </Field>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field required>
  <Field.Label>Email *</Field.Label>
  <Input>
    <Input.Field type='email' placeholder='Required field' />
  </Input>
</Field>`}</code>
              </pre>
            </div>
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
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field invalid={isInvalid} required>
                  <Field.Label className='demo-label'>Email</Field.Label>
                  <Input>
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
                  </Input>
                  <Field.Description className='demo-input-description'>
                    Enter a valid email address
                  </Field.Description>
                  <Field.ErrorMessage className='demo-input-error'>
                    Please enter a valid email address (must contain @)
                  </Field.ErrorMessage>
                </Field>
              </div>
              <div className='keyboard-hint'>
                <strong>Screen reader:</strong> Error message should be announced when it appears.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field invalid={isInvalid} required>
  <Field.Label>Email</Field.Label>
  <Input>
    <Input.Field value={value} onChange={handleChange} />
  </Input>
  <Field.ErrorMessage>Please enter a valid email</Field.ErrorMessage>
</Field>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 4. Disabled Input */}
        <section className='demo-section'>
          <h2>4. Disabled Input</h2>
          <p className='demo-description'>Disabled inputs cannot be focused or edited.</p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field disabled>
                  <Field.Label className='demo-label'>Organization</Field.Label>
                  <Input>
                    <Input.Field className='demo-input' value='Acme Corporation' />
                  </Input>
                  <Field.Description className='demo-input-description'>
                    Contact support to change your organization
                  </Field.Description>
                </Field>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Tab should skip the disabled input.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field disabled>
  <Field.Label>Organization</Field.Label>
  <Input>
    <Input.Field value='Acme Corporation' />
  </Input>
</Field>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 5. Read-only Input */}
        <section className='demo-section'>
          <h2>5. Read-only Input</h2>
          <p className='demo-description'>
            Read-only inputs are focusable and selectable but cannot be edited. Uses{' '}
            <code>aria-readonly</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field readOnly>
                  <Field.Label className='demo-label'>Account ID</Field.Label>
                  <Input>
                    <Input.Field className='demo-input' value='ACC-2025-XYZ' />
                  </Input>
                  <Field.Description className='demo-input-description'>
                    This value cannot be changed
                  </Field.Description>
                </Field>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field readOnly>
  <Field.Label>Account ID</Field.Label>
  <Input>
    <Input.Field value='ACC-2025-XYZ' />
  </Input>
</Field>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Auto Focus */}
        <section className='demo-section'>
          <h2>6. Auto Focus Input</h2>
          <p className='demo-description'>Input that automatically receives focus on mount.</p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Field>
                  <Field.Label className='demo-label'>Search</Field.Label>
                  <Input>
                    <Input.Field
                      className='demo-input'
                      placeholder='I should be focused'
                      autoFocus
                    />
                  </Input>
                </Field>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Field>
  <Field.Label>Search</Field.Label>
  <Input>
    <Input.Field placeholder='I should be focused' autoFocus />
  </Input>
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
