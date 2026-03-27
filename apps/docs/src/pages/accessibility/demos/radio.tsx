/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Radio, Label } from '@turkish-technology/spar';
import '../../../styles/accessibility-demos.scss';

export default function RadioDemo() {
  const [controlled, setControlled] = useState('');

  return (
    <Layout title='Radio – A11y Demo'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Radio – Accessibility Demo</h1>
        <p className='page-description'>
          Radio group with <code>role=&quot;radiogroup&quot;</code> and{' '}
          <code>role=&quot;radio&quot;</code>. Arrow keys navigate and select within the group.
        </p>

        {/* 1. Basic Radio Group */}
        <section className='demo-section'>
          <h2>1. Basic Radio Group (Vertical)</h2>
          <p className='demo-description'>
            Tab into the group, then use Arrow Up/Down to navigate and select. Only one item can be
            selected at a time.
          </p>
          <div className='demo-section-layout'>
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
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab to group → ↑↓ to navigate & select → Tab to leave
                group
              </div>
            </div>
          </div>
        </section>

        {/* 2. Horizontal Orientation */}
        <section className='demo-section'>
          <h2>2. Horizontal Orientation</h2>
          <p className='demo-description'>
            With <code>orientation=&quot;horizontal&quot;</code>, Arrow Left/Right navigate instead
            of Up/Down.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Radio.Root
                  className='demo-radio-group'
                  orientation='horizontal'
                  aria-label='Size selection'
                >
                  {['Small', 'Medium', 'Large', 'XL'].map((size) => (
                    <div className='demo-radio-item-wrapper' key={size}>
                      <Radio.Item
                        className='demo-radio-item'
                        value={size.toLowerCase()}
                        id={`horiz-${size.toLowerCase()}`}
                      >
                        {({ isChecked }) => isChecked && <span className='demo-radio-indicator' />}
                      </Radio.Item>
                      <Label htmlFor={`horiz-${size.toLowerCase()}`} className='demo-label'>
                        {size}
                      </Label>
                    </div>
                  ))}
                </Radio.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> ← → to navigate & select (not ↑ ↓)
              </div>
            </div>
          </div>
        </section>

        {/* 3. Controlled */}
        <section className='demo-section'>
          <h2>3. Controlled Radio Group</h2>
          <p className='demo-description'>
            Parent manages selected value. External buttons can change the selection.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-row'>
                  <button className='demo-btn' onClick={() => setControlled('monthly')}>
                    Set Monthly
                  </button>
                  <button className='demo-btn' onClick={() => setControlled('yearly')}>
                    Set Yearly
                  </button>
                  <button className='demo-btn' onClick={() => setControlled('')}>
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
          </div>
        </section>

        {/* 4. Disabled Items */}
        <section className='demo-section'>
          <h2>4. Disabled Radio Items</h2>
          <p className='demo-description'>
            Individual items can be disabled. Arrow key navigation skips disabled items.
          </p>
          <div className='demo-section-layout'>
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
          </div>
        </section>

        {/* 5. Fully Disabled Group */}
        <section className='demo-section'>
          <h2>5. Fully Disabled Group</h2>
          <p className='demo-description'>
            Entire group disabled via root <code>disabled</code> prop.
          </p>
          <div className='demo-area'>
            <Radio.Root
              className='demo-radio-group'
              disabled
              defaultValue='opt-a'
              aria-label='Disabled group'
            >
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
        </section>

        {/* 6. Required Group */}
        <section className='demo-section'>
          <h2>6. Required Radio Group</h2>
          <p className='demo-description'>
            Radio group with <code>required</code> prop. Uses <code>aria-required</code>.
          </p>
          <div className='demo-section-layout'>
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
          </div>
        </section>

        {/* 7. Select on Focus vs Manual */}
        <section className='demo-section'>
          <h2>7. Select on Focus vs Manual Selection</h2>
          <p className='demo-description'>
            <code>selectOnFocus=&#123;true&#125;</code> (default): Arrow keys move AND select.{' '}
            <code>selectOnFocus=&#123;false&#125;</code>: Arrow keys only move focus, Space/Enter
            selects.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area demo-col'>
                <div>
                  <p className='demo-label' style={{ marginBottom: '0.5rem' }}>
                    Auto-select (default):
                  </p>
                  <Radio.Root
                    className='demo-radio-group'
                    orientation='horizontal'
                    aria-label='Auto select demo'
                  >
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
                    orientation='horizontal'
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
          </div>
        </section>
      </div>
    </Layout>
  );
}
