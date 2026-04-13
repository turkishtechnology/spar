/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Checkbox, Label, CheckedState } from '@turkish-technology/spar';

import '../../../styles/accessibility-demos.scss';

export default function CheckboxDemo() {
  const [controlled, setControlled] = useState<CheckedState>(false);
  const [indeterminate, setIndeterminate] = useState<CheckedState>('indeterminate');
  const [formValues, setFormValues] = useState<Record<string, CheckedState>>({
    terms: false,
    newsletter: false,
    privacy: false,
  });

  const checkedSymbol = (checked: CheckedState) => {
    if (checked === 'indeterminate') return '–';
    if (checked === true) return '✓';
    return '';
  };

  const allChecked = Object.values(formValues).every((v) => v === true);
  const someChecked = Object.values(formValues).includes(true);

  return (
    <Layout title='Checkbox'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Checkbox</h1>
        <p className='page-description'>
          Checkbox allows users to select one or more options, including checked, unchecked, and
          indeterminate states.
        </p>
        {/* 1. Basic Checkbox */}
        <section className='demo-section'>
          <h2>1. Basic Checkbox (Uncontrolled)</h2>
          <p className='demo-description'>
            Click or press Space to toggle. Screen readers announce checked/unchecked state via{' '}
            <code>aria-checked</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <div className='demo-field'>
                  <Checkbox id='basic-checkbox' className='demo-checkbox'>
                    {({ checked }) => (checked ? '✓' : '')}
                  </Checkbox>
                  <Label htmlFor='basic-checkbox' className='demo-label'>
                    Accept terms
                  </Label>
                </div>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab to focus → Space to toggle
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Checkbox id='basic-checkbox'>
  {({ checked }) => (checked ? '✓' : '')}
</Checkbox>
<Label htmlFor='basic-checkbox'>Accept terms</Label>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 2. Controlled Checkbox */}
        <section className='demo-section'>
          <h2>2. Controlled Checkbox</h2>
          <p className='demo-description'>
            Parent manages the checked state. External buttons can also change the state.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-field'>
                  <Checkbox
                    id='controlled-checkbox'
                    className='demo-checkbox'
                    checked={controlled}
                    onChange={(checked) => {
                      setControlled(checked);
                    }}
                  >
                    {({ checked }) => (checked === true ? '✓' : '')}
                  </Checkbox>
                  <Label htmlFor='controlled-checkbox' className='demo-label'>
                    Controlled checkbox
                  </Label>
                </div>
                <div className='demo-row'>
                  <button className='demo-btn' onClick={() => setControlled(true)}>
                    Set Checked
                  </button>
                  <button className='demo-btn' onClick={() => setControlled(false)}>
                    Set Unchecked
                  </button>
                </div>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`const [checked, setChecked] = useState<CheckedState>(false);

<Checkbox id='controlled-checkbox' checked={checked} onChange={(c)=>setChecked(c)}>
  {({ checked }) => (checked === true ? '✓' : '')}
</Checkbox>
<Label htmlFor='controlled-checkbox'>Controlled checkbox</Label>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Indeterminate State */}
        <section className='demo-section'>
          <h2>3. Indeterminate (Mixed) State</h2>
          <p className='demo-description'>
            Checkbox can be in a &quot;mixed&quot; state using{' '}
            <code>aria-checked=&quot;mixed&quot;</code>. Screen readers should announce
            &quot;partially checked&quot; or &quot;mixed&quot;.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-field'>
                  <Checkbox
                    id='indeterminate-checkbox'
                    className='demo-checkbox'
                    checked={indeterminate}
                    onChange={(checked) => {
                      setIndeterminate(checked);
                    }}
                  >
                    {({ checked }) => checkedSymbol(checked)}
                  </Checkbox>
                  <Label htmlFor='indeterminate-checkbox' className='demo-label'>
                    Select all items
                  </Label>
                </div>
                <div className='demo-row'>
                  <button className='demo-btn' onClick={() => setIndeterminate('indeterminate')}>
                    Set Indeterminate
                  </button>
                  <button className='demo-btn' onClick={() => setIndeterminate(true)}>
                    Set Checked
                  </button>
                  <button className='demo-btn' onClick={() => setIndeterminate(false)}>
                    Set Unchecked
                  </button>
                </div>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`const [checked, setChecked] = useState<CheckedState>('indeterminate');

<Checkbox id='indeterminate-checkbox' checked={checked} onChange={(c)=>setChecked(c)}>
  {({ checked }) => (checked === 'indeterminate' ? '–' : checked ? '✓' : '')}
</Checkbox>
<Label htmlFor='indeterminate-checkbox'>Select all items</Label>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 4. Disabled Checkbox */}
        <section className='demo-section'>
          <h2>4. Disabled Checkbox</h2>
          <p className='demo-description'>
            Disabled checkboxes cannot be interacted with and are announced as disabled.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-field'>
                  <Checkbox id='disabled-unchecked' className='demo-checkbox' disabled>
                    {({ checked }) => (checked ? '✓' : '')}
                  </Checkbox>
                  <Label htmlFor='disabled-unchecked' className='demo-label' disabled>
                    Disabled (unchecked)
                  </Label>
                </div>
                <div className='demo-field'>
                  <Checkbox id='disabled-checked' className='demo-checkbox' disabled defaultChecked>
                    {({ checked }) => (checked ? '✓' : '')}
                  </Checkbox>
                  <Label htmlFor='disabled-checked' className='demo-label' disabled>
                    Disabled (checked)
                  </Label>
                </div>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Tab should skip disabled checkboxes.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Checkbox id='disabled-unchecked' disabled>
  {({ checked }) => (checked ? '✓' : '')}
</Checkbox>
<Label htmlFor='disabled-unchecked' disabled>
  Disabled (unchecked)
</Label>

<Checkbox id='disabled-checked' disabled defaultChecked>
  {({ checked }) => (checked ? '✓' : '')}
</Checkbox>
<Label htmlFor='disabled-checked' disabled>
  Disabled (checked)
</Label>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 5. Read-only Checkbox */}
        <section className='demo-section'>
          <h2>5. Read-only Checkbox</h2>
          <p className='demo-description'>
            Read-only checkboxes are focusable but cannot be changed. Announced with{' '}
            <code>aria-readonly</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <div className='demo-field'>
                  <Checkbox
                    id='readonly-checkbox'
                    className='demo-checkbox'
                    readOnly
                    defaultChecked
                  >
                    {({ checked }) => (checked ? '✓' : '')}
                  </Checkbox>
                  <Label htmlFor='readonly-checkbox' className='demo-label' readOnly>
                    Read-only (checked)
                  </Label>
                </div>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Focusable but Space does not toggle.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Checkbox id='readonly-checkbox' readOnly defaultChecked>
  {({ checked }) => (checked ? '✓' : '')}
</Checkbox>
<Label htmlFor='readonly-checkbox' readOnly>
  Read-only (checked)
</Label>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Required Checkbox */}
        <section className='demo-section'>
          <h2>6. Required Checkbox</h2>
          <p className='demo-description'>
            Required checkboxes are announced with <code>aria-required</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <div className='demo-field'>
                  <Checkbox id='required-checkbox' className='demo-checkbox' required>
                    {({ checked }) => (checked ? '✓' : '')}
                  </Checkbox>
                  <Label htmlFor='required-checkbox' className='demo-label' required>
                    I agree to the terms *
                  </Label>
                </div>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Checkbox id='required-checkbox' required>
  {({ checked }) => (checked ? '✓' : '')}
</Checkbox>
<Label htmlFor='required-checkbox' required>
  I agree to the terms *
</Label>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 7. Group with Select All */}
        <section className='demo-section'>
          <h2>7. Checkbox Group with Select All</h2>
          <p className='demo-description'>
            A parent checkbox controls child checkboxes. The parent shows indeterminate when some
            (but not all) children are checked.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-field'>
                  <Checkbox
                    id='select-all'
                    className='demo-checkbox'
                    checked={(() => {
                      if (allChecked) return true;
                      if (someChecked) return 'indeterminate';
                      return false;
                    })()}
                    onChange={(checked) => {
                      const newVal = checked === true;
                      setFormValues({ terms: newVal, newsletter: newVal, privacy: newVal });
                    }}
                  >
                    {({ checked }) => checkedSymbol(checked)}
                  </Checkbox>
                  <Label htmlFor='select-all' className='demo-label'>
                    Select all
                  </Label>
                </div>
                <div style={{ marginLeft: '1.5rem' }} className='demo-col'>
                  <div className='demo-field'>
                    <Checkbox
                      id='group-terms'
                      className='demo-checkbox'
                      checked={formValues.terms}
                      onChange={(checked) => {
                        setFormValues((prev) => ({ ...prev, terms: checked }));
                      }}
                    >
                      {({ checked }) => (checked ? '✓' : '')}
                    </Checkbox>
                    <Label htmlFor='group-terms' className='demo-label'>
                      Terms
                    </Label>
                  </div>

                  <div className='demo-field'>
                    <Checkbox
                      id='group-newsletter'
                      className='demo-checkbox'
                      checked={formValues.newsletter}
                      onChange={(checked) => {
                        setFormValues((prev) => ({ ...prev, newsletter: checked }));
                      }}
                    >
                      {({ checked }) => (checked ? '✓' : '')}
                    </Checkbox>
                    <Label htmlFor='group-newsletter' className='demo-label'>
                      Newsletter
                    </Label>
                  </div>

                  <div className='demo-field'>
                    <Checkbox
                      id='group-privacy'
                      className='demo-checkbox'
                      checked={formValues.privacy}
                      onChange={(checked) => {
                        setFormValues((prev) => ({ ...prev, privacy: checked }));
                      }}
                    >
                      {({ checked }) => (checked ? '✓' : '')}
                    </Checkbox>
                    <Label htmlFor='group-privacy' className='demo-label'>
                      Privacy
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`const [values, setValues] = useState({ terms: false, newsletter: false, privacy: false });

<Checkbox
  id='select-all'
  checked={values.terms && values.newsletter && values.privacy ? true : values.terms || values.newsletter || values.privacy ? 'indeterminate' : false}
  onChange={(checked) => {
    const next = checked === true;
    setValues({ terms: next, newsletter: next, privacy: next });
  }}
>
  {({ checked }) => (checked === 'indeterminate' ? '–' : checked ? '✓' : '')}
</Checkbox>
<Label htmlFor='select-all'>Select all</Label>

<Checkbox
  id='group-terms'
  checked={values.terms}
  onChange={(checked) => setValues((prev) => ({ ...prev, terms: checked }))}
>
  {({ checked }) => (checked ? '✓' : '')}
</Checkbox>
<Label htmlFor='group-terms'>Terms</Label>

<Checkbox
  id='group-newsletter'
  checked={values.newsletter}
  onChange={(checked) => setValues((prev) => ({ ...prev, newsletter: checked }))}
>
  {({ checked }) => (checked ? '✓' : '')}
</Checkbox>
<Label htmlFor='group-newsletter'>Newsletter</Label>

<Checkbox
  id='group-privacy'
  checked={values.privacy}
  onChange={(checked) => setValues((prev) => ({ ...prev, privacy: checked }))}
>
  {({ checked }) => (checked ? '✓' : '')}
</Checkbox>
<Label htmlFor='group-privacy'>Privacy</Label>`}</code>
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
