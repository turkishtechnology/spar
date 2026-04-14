/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Radio, Label } from '@turkish-technology/spar';
import '../../../styles/accessibility-demos.scss';

export default function RadioDemo() {
  const [controlled, setControlled] = useState(undefined);

  return (
    <Layout title='Radio'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Radio</h1>
        <p className='page-description'>
          Radio lets users choose a single option from a predefined set.
        </p>

        {/* 1. Basic Radio Group */}
        <section className='demo-section'>
          <h2>1. Basic Radio Group (Vertical)</h2>
          <p className='demo-description'>
            Tab into the group, then use arrow keys to navigate and select. Only one item can be
            selected at a time.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Radio.Root
                  className='demo-radio-group'
                  aria-label='Favorite color'
                  defaultValue='blue'
                >
                  {['Red', 'Blue', 'Green', 'Yellow'].map((color) => (
                    <div className='demo-radio-item-wrapper' key={color}>
                      <Radio.Item
                        className='demo-radio-item'
                        value={color.toLowerCase()}
                        id={`basic-${color.toLowerCase()}`}
                      >
                        {({ isChecked }) => isChecked && <span className='demo-radio-indicator' />}
                      </Radio.Item>
                      <Label htmlFor={`basic-${color.toLowerCase()}`} className='demo-label'>
                        {color}
                      </Label>
                    </div>
                  ))}
                </Radio.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Radio.Root defaultValue='blue' aria-label='Favorite color'>
  <Radio.Item value='red' id='red' />
  <Label htmlFor='red'>Red</Label>
  <Radio.Item value='blue' id='blue' />
  <Label htmlFor='blue'>Blue</Label>
</Radio.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 2. Controlled */}
        <section className='demo-section'>
          <h2>2. Controlled Radio Group</h2>
          <p className='demo-description'>
            Parent manages selected value. External buttons can change the selection.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-row'>
                  <button className='demo-btn' onClick={() => setControlled('monthly')}>
                    Set Monthly
                  </button>
                  <button className='demo-btn' onClick={() => setControlled('yearly')}>
                    Set Yearly
                  </button>
                  <button className='demo-btn' onClick={() => setControlled(undefined)}>
                    Clear
                  </button>
                </div>
                <Radio.Root
                  className='demo-radio-group'
                  value={controlled}
                  onValueChange={(v) => {
                    setControlled(v);
                  }}
                  aria-label='Billing cycle'
                >
                  {['Monthly', 'Quarterly', 'Yearly'].map((period) => (
                    <div className='demo-radio-item-wrapper' key={period}>
                      <Radio.Item
                        className='demo-radio-item'
                        value={period.toLowerCase()}
                        id={`ctrl-${period.toLowerCase()}`}
                      >
                        {({ isChecked }) => isChecked && <span className='demo-radio-indicator' />}
                      </Radio.Item>
                      <Label htmlFor={`ctrl-${period.toLowerCase()}`} className='demo-label'>
                        {period}
                      </Label>
                    </div>
                  ))}
                </Radio.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`const [value, setValue] = useState(undefined);

<Radio.Root value={value} onValueChange={(nextValue) => setValue(nextValue)} aria-label='Billing cycle'>
  <Radio.Item value='monthly' id='monthly' />
  <Label htmlFor='monthly'>Monthly</Label>
</Radio.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Disabled Items */}
        <section className='demo-section'>
          <h2>3. Disabled Radio Items</h2>
          <p className='demo-description'>
            Individual items can be disabled. Arrow key navigation skips disabled items.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Radio.Root className='demo-radio-group' aria-label='Plan selection'>
                  <div className='demo-radio-item-wrapper'>
                    <Radio.Item className='demo-radio-item' value='free' id='plan-free'>
                      {({ isChecked }) => isChecked && <span className='demo-radio-indicator' />}
                    </Radio.Item>
                    <Label htmlFor='plan-free' className='demo-label'>
                      Free
                    </Label>
                  </div>
                  <div className='demo-radio-item-wrapper'>
                    <Radio.Item className='demo-radio-item' value='pro' id='plan-pro' disabled>
                      {({ isChecked }) => isChecked && <span className='demo-radio-indicator' />}
                    </Radio.Item>
                    <Label htmlFor='plan-pro' className='demo-label' disabled>
                      Pro (sold out)
                    </Label>
                  </div>
                  <div className='demo-radio-item-wrapper'>
                    <Radio.Item className='demo-radio-item' value='enterprise' id='plan-enterprise'>
                      {({ isChecked }) => isChecked && <span className='demo-radio-indicator' />}
                    </Radio.Item>
                    <Label htmlFor='plan-enterprise' className='demo-label'>
                      Enterprise
                    </Label>
                  </div>
                </Radio.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Arrow keys skip &quot;Pro (sold out)&quot;.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Radio.Root aria-label='Plan selection'>
  <Radio.Item value='free' id='plan-free' />
  <Label htmlFor='plan-free'>Free</Label>
  <Radio.Item value='pro' id='plan-pro' disabled />
  <Label htmlFor='plan-pro' disabled>Pro (sold out)</Label>
</Radio.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 4. Fully Disabled Group */}
        <section className='demo-section'>
          <h2>4. Fully Disabled Group</h2>
          <p className='demo-description'>
            Entire group disabled via root <code>disabled</code> prop.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Radio.Root className='demo-radio-group' disabled aria-label='Disabled group'>
                  {['Option A', 'Option B', 'Option C'].map((label) => (
                    <div className='demo-radio-item-wrapper' key={label}>
                      <Radio.Item
                        className='demo-radio-item'
                        value={label.toLowerCase().replace(' ', '-')}
                        id={`disabled-${label.toLowerCase().replace(' ', '-')}`}
                      >
                        {({ isChecked }) => isChecked && <span className='demo-radio-indicator' />}
                      </Radio.Item>
                      <Label
                        htmlFor={`disabled-${label.toLowerCase().replace(' ', '-')}`}
                        className='demo-label'
                        disabled
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </Radio.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Radio.Root disabled aria-label='Disabled group'>
  <Radio.Item value='opt-a' id='opt-a' />
  <Label htmlFor='opt-a' disabled>Option A</Label>
</Radio.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 5. Required Group */}
        <section className='demo-section'>
          <h2>5. Required Radio Group</h2>
          <p className='demo-description'>
            Radio group with <code>required</code> prop. Uses <code>aria-required</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                  <legend className='demo-label' style={{ marginBottom: '0.5rem' }}>
                    Preferred contact method *
                  </legend>
                  <Radio.Root
                    className='demo-radio-group'
                    required
                    aria-label='Preferred contact method'
                  >
                    {['Email', 'Phone', 'SMS'].map((method) => (
                      <div className='demo-radio-item-wrapper' key={method}>
                        <Radio.Item
                          className='demo-radio-item'
                          value={method.toLowerCase()}
                          id={`req-${method.toLowerCase()}`}
                        >
                          {({ isChecked }) =>
                            isChecked && <span className='demo-radio-indicator' />
                          }
                        </Radio.Item>
                        <Label htmlFor={`req-${method.toLowerCase()}`} className='demo-label'>
                          {method}
                        </Label>
                      </div>
                    ))}
                  </Radio.Root>
                </fieldset>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Radio.Root required aria-label='Preferred contact method'>
  <Radio.Item value='email' id='req-email' />
  <Label htmlFor='req-email'>Email</Label>
</Radio.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Select on Focus vs Manual */}
        <section className='demo-section'>
          <h2>6. Select on Focus vs Manual Selection</h2>
          <p className='demo-description'>
            <code>selectOnFocus=&#123;true&#125;</code> (default): Arrow keys move AND select.{' '}
            <code>selectOnFocus=&#123;false&#125;</code>: Arrow keys only move focus, Space/Enter
            selects.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <div>
                  <p className='demo-label' style={{ marginBottom: '0.5rem' }}>
                    Auto-select (default):
                  </p>
                  <Radio.Root className='demo-radio-group' aria-label='Auto select demo'>
                    {['A', 'B', 'C'].map((letter) => (
                      <div className='demo-radio-item-wrapper' key={letter}>
                        <Radio.Item
                          className='demo-radio-item'
                          value={letter}
                          id={`auto-${letter}`}
                        >
                          {({ isChecked }) =>
                            isChecked && <span className='demo-radio-indicator' />
                          }
                        </Radio.Item>
                        <Label htmlFor={`auto-${letter}`} className='demo-label'>
                          {letter}
                        </Label>
                      </div>
                    ))}
                  </Radio.Root>
                </div>
                <div>
                  <p className='demo-label' style={{ marginBottom: '0.5rem' }}>
                    Manual select:
                  </p>
                  <Radio.Root
                    className='demo-radio-group'
                    selectOnFocus={false}
                    aria-label='Manual select demo'
                  >
                    {['X', 'Y', 'Z'].map((letter) => (
                      <div className='demo-radio-item-wrapper' key={letter}>
                        <Radio.Item
                          className='demo-radio-item'
                          value={letter}
                          id={`manual-${letter}`}
                        >
                          {({ isChecked }) =>
                            isChecked && <span className='demo-radio-indicator' />
                          }
                        </Radio.Item>
                        <Label htmlFor={`manual-${letter}`} className='demo-label'>
                          {letter}
                        </Label>
                      </div>
                    ))}
                  </Radio.Root>
                </div>
              </div>
              <div className='keyboard-hint'>
                <strong>Auto:</strong> Arrow keys move + select | <strong>Manual:</strong> Arrows
                move focus only, Space selects
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Radio.Root aria-label='Auto select demo'>
  <Radio.Item value='A' id='auto-A' />
  <Label htmlFor='auto-A'>A</Label>
</Radio.Root>

<Radio.Root selectOnFocus={false} aria-label='Manual select demo'>
  <Radio.Item value='X' id='manual-X' />
  <Label htmlFor='manual-X'>X</Label>
</Radio.Root>`}</code>
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
