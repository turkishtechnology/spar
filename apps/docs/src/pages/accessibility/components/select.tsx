/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Select } from '@turkish-technology/spar';

import '../../../styles/accessibility-demos.scss';

export default function SelectDemo() {
  const [controlled, setControlled] = useState('');

  return (
    <Layout title='Select'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Select</h1>
        <p className='page-description'>
          Select lets users choose one value from a list of available options.
        </p>

        {/* 1. Basic Select */}
        <section className='demo-section'>
          <h2>1. Basic Select</h2>
          <p className='demo-description'>
            Click trigger or press Enter/Space to open. Arrow keys navigate options. Enter selects.
            Escape closes.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Select.Root>
                  <Select.Trigger className='demo-select-trigger' placeholder='Choose a fruit…'>
                    <span>▾</span>
                  </Select.Trigger>
                  <Select.Content className='demo-select-content'>
                    <Select.Item className='demo-select-item' value='apple' label='Apple'>
                      Apple
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='banana' label='Banana'>
                      Banana
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='cherry' label='Cherry'>
                      Cherry
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='grape' label='Grape'>
                      Grape
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab to trigger → Enter/Space to open → ↑↓ to navigate →
                Enter to select → Escape to close
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Select.Root>
  <Select.Trigger placeholder='Choose a fruit…' />
  <Select.Content>
    <Select.Item value='apple' label='Apple'>Apple</Select.Item>
  </Select.Content>
</Select.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 2. With Groups */}
        <section className='demo-section'>
          <h2>2. Grouped Options</h2>
          <p className='demo-description'>
            Options organized in groups with labels. Group labels are announced by screen readers.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Select.Root>
                  <Select.Trigger className='demo-select-trigger' placeholder='Select a food…'>
                    <span>▾</span>
                  </Select.Trigger>
                  <Select.Content className='demo-select-content'>
                    <Select.Group>
                      <Select.Label className='demo-select-label'>Fruits</Select.Label>
                      <Select.Item className='demo-select-item' value='apple' label='Apple'>
                        Apple
                      </Select.Item>
                      <Select.Item className='demo-select-item' value='orange' label='Orange'>
                        Orange
                      </Select.Item>
                    </Select.Group>
                    <Select.Separator className='demo-select-separator' />
                    <Select.Group>
                      <Select.Label className='demo-select-label'>Vegetables</Select.Label>
                      <Select.Item className='demo-select-item' value='carrot' label='Carrot'>
                        Carrot
                      </Select.Item>
                      <Select.Item className='demo-select-item' value='broccoli' label='Broccoli'>
                        Broccoli
                      </Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Select.Root>
  <Select.Trigger placeholder='Select a food…' />
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      <Select.Item value='apple' label='Apple'>Apple</Select.Item>
    </Select.Group>
  </Select.Content>
</Select.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Disabled Options */}
        <section className='demo-section'>
          <h2>3. Disabled Options</h2>
          <p className='demo-description'>
            Individual options can be disabled. Arrow keys skip disabled options.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Select.Root>
                  <Select.Trigger className='demo-select-trigger' placeholder='Choose a plan…'>
                    <span>▾</span>
                  </Select.Trigger>
                  <Select.Content className='demo-select-content'>
                    <Select.Item className='demo-select-item' value='free' label='Free'>
                      Free
                    </Select.Item>
                    <Select.Item
                      className='demo-select-item'
                      value='pro'
                      disabled
                      label='Pro (sold out)'
                    >
                      Pro (sold out)
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='enterprise' label='Enterprise'>
                      Enterprise
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Arrow keys skip &quot;Pro (sold out)&quot;.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Select.Root>
  <Select.Trigger placeholder='Choose a plan…' />
  <Select.Content>
    <Select.Item value='free' label='Free'>Free</Select.Item>
    <Select.Item value='pro' disabled label='Pro (sold out)'>Pro (sold out)</Select.Item>
  </Select.Content>
</Select.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 4. Controlled Select */}
        <section className='demo-section'>
          <h2>4. Controlled Select</h2>
          <p className='demo-description'>
            Parent manages the selected value. External buttons can change the selection.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-row'>
                  <button className='demo-btn' onClick={() => setControlled('small')}>
                    Set Small
                  </button>
                  <button className='demo-btn' onClick={() => setControlled('medium')}>
                    Set Medium
                  </button>
                  <button className='demo-btn' onClick={() => setControlled('large')}>
                    Set Large
                  </button>
                </div>
                <Select.Root
                  value={controlled}
                  onChange={(v) => {
                    setControlled(v);
                  }}
                >
                  <Select.Trigger className='demo-select-trigger' placeholder='Select size…'>
                    <span>▾</span>
                  </Select.Trigger>
                  <Select.Content className='demo-select-content'>
                    <Select.Item className='demo-select-item' value='small' label='Small'>
                      Small
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='medium' label='Medium'>
                      Medium
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='large' label='Large'>
                      Large
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`const [value, setValue] = useState('');

<Select.Root value={value} onChange={(nextValue) => setValue(nextValue)}>
  <Select.Trigger placeholder='Select size…' />
  <Select.Content>
    <Select.Item value='small' label='Small'>Small</Select.Item>
  </Select.Content>
</Select.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 5. Disabled Select */}
        <section className='demo-section'>
          <h2>5. Disabled Select</h2>
          <p className='demo-description'>
            Entire select can be disabled. Trigger cannot be activated.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-row'>
                <Select.Root disabled>
                  <Select.Trigger className='demo-select-trigger' placeholder='Disabled select'>
                    <span>▾</span>
                  </Select.Trigger>
                  <Select.Content className='demo-select-content'>
                    <Select.Item className='demo-select-item' value='a' label='Option A'>
                      Option A
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Select.Root disabled>
  <Select.Trigger placeholder='Disabled select' />
  <Select.Content>
    <Select.Item value='a' label='Option A'>Option A</Select.Item>
  </Select.Content>
</Select.Root>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Required Select */}
        <section className='demo-section'>
          <h2>6. Required Select</h2>
          <p className='demo-description'>
            Select with <code>required</code> prop for form validation. Uses{' '}
            <code>aria-required</code>.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Select.Root required>
                  <Select.Trigger className='demo-select-trigger' placeholder='Required field *'>
                    <span>▾</span>
                  </Select.Trigger>
                  <Select.Content className='demo-select-content'>
                    <Select.Item className='demo-select-item' value='opt1' label='Option 1'>
                      Option 1
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='opt2' label='Option 2'>
                      Option 2
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Select.Root required>
  <Select.Trigger placeholder='Required field *' />
  <Select.Content>
    <Select.Item value='opt1' label='Option 1'>Option 1</Select.Item>
  </Select.Content>
</Select.Root>`}</code>
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
