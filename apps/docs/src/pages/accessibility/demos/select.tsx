/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Select } from '@turkish-technology/spar';

import '../../../styles/accessibility-demos.scss';

export default function SelectDemo() {
  const [controlled, setControlled] = useState('');

  return (
    <Layout title='Select – A11y Demo'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Select – Accessibility Demo</h1>
        <p className='page-description'>
          Listbox-based select with keyboard navigation (Arrow keys, Home, End, type-ahead), groups,
          disabled options, and ARIA support.
        </p>

        {/* 1. Basic Select */}
        <section className='demo-section'>
          <h2>1. Basic Select</h2>
          <p className='demo-description'>
            Click trigger or press Enter/Space to open. Arrow keys navigate options. Enter selects.
            Escape closes.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Select.Root>
                  <Select.Trigger className='demo-select-trigger'>
                    <Select.Value placeholder='Choose a fruit…' />
                    <span>▾</span>
                  </Select.Trigger>
                  <Select.Content className='demo-select-content'>
                    <Select.Item className='demo-select-item' value='apple'>
                      <Select.ItemText>Apple</Select.ItemText>
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='banana'>
                      <Select.ItemText>Banana</Select.ItemText>
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='cherry'>
                      <Select.ItemText>Cherry</Select.ItemText>
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='grape'>
                      <Select.ItemText>Grape</Select.ItemText>
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab to trigger → Enter/Space to open → ↑↓ to navigate →
                Enter to select → Escape to close
              </div>
            </div>
          </div>
        </section>

        {/* 2. With Groups */}
        <section className='demo-section'>
          <h2>2. Grouped Options</h2>
          <p className='demo-description'>
            Options organized in groups with labels. Group labels are announced by screen readers.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Select.Root>
                  <Select.Trigger className='demo-select-trigger'>
                    <Select.Value placeholder='Select a food…' />
                    <span>▾</span>
                  </Select.Trigger>
                  <Select.Content className='demo-select-content'>
                    <Select.Group>
                      <Select.Label className='demo-select-label'>Fruits</Select.Label>
                      <Select.Item className='demo-select-item' value='apple'>
                        <Select.ItemText>Apple</Select.ItemText>
                      </Select.Item>
                      <Select.Item className='demo-select-item' value='orange'>
                        <Select.ItemText>Orange</Select.ItemText>
                      </Select.Item>
                    </Select.Group>
                    <Select.Separator className='demo-select-separator' />
                    <Select.Group>
                      <Select.Label className='demo-select-label'>Vegetables</Select.Label>
                      <Select.Item className='demo-select-item' value='carrot'>
                        <Select.ItemText>Carrot</Select.ItemText>
                      </Select.Item>
                      <Select.Item className='demo-select-item' value='broccoli'>
                        <Select.ItemText>Broccoli</Select.ItemText>
                      </Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Disabled Options */}
        <section className='demo-section'>
          <h2>3. Disabled Options</h2>
          <p className='demo-description'>
            Individual options can be disabled. Arrow keys skip disabled options.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Select.Root>
                  <Select.Trigger className='demo-select-trigger'>
                    <Select.Value placeholder='Choose a plan…' />
                    <span>▾</span>
                  </Select.Trigger>
                  <Select.Content className='demo-select-content'>
                    <Select.Item className='demo-select-item' value='free'>
                      <Select.ItemText>Free</Select.ItemText>
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='pro' disabled>
                      <Select.ItemText>Pro (sold out)</Select.ItemText>
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='enterprise'>
                      <Select.ItemText>Enterprise</Select.ItemText>
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Arrow keys skip &quot;Pro (sold out)&quot;.
              </div>
            </div>
          </div>
        </section>

        {/* 4. Controlled Select */}
        <section className='demo-section'>
          <h2>4. Controlled Select</h2>
          <p className='demo-description'>
            Parent manages the selected value. External buttons can change the selection.
          </p>
          <div className='demo-section-layout'>
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
                  onValueChange={(v) => {
                    setControlled(v);
                  }}
                >
                  <Select.Trigger className='demo-select-trigger'>
                    <Select.Value placeholder='Select size…' />
                    <span>▾</span>
                  </Select.Trigger>
                  <Select.Content className='demo-select-content'>
                    <Select.Item className='demo-select-item' value='small'>
                      <Select.ItemText>Small</Select.ItemText>
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='medium'>
                      <Select.ItemText>Medium</Select.ItemText>
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='large'>
                      <Select.ItemText>Large</Select.ItemText>
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Disabled Select */}
        <section className='demo-section'>
          <h2>5. Disabled Select</h2>
          <p className='demo-description'>
            Entire select can be disabled. Trigger cannot be activated.
          </p>
          <div className='demo-area demo-row'>
            <Select.Root disabled>
              <Select.Trigger className='demo-select-trigger'>
                <Select.Value placeholder='Disabled select' />
                <span>▾</span>
              </Select.Trigger>
              <Select.Content className='demo-select-content'>
                <Select.Item className='demo-select-item' value='a'>
                  <Select.ItemText>Option A</Select.ItemText>
                </Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </section>

        {/* 6. Required Select */}
        <section className='demo-section'>
          <h2>6. Required Select</h2>
          <p className='demo-description'>
            Select with <code>required</code> prop for form validation. Uses{' '}
            <code>aria-required</code>.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Select.Root required>
                  <Select.Trigger className='demo-select-trigger'>
                    <Select.Value placeholder='Required field *' />
                    <span>▾</span>
                  </Select.Trigger>
                  <Select.Content className='demo-select-content'>
                    <Select.Item className='demo-select-item' value='opt1'>
                      <Select.ItemText>Option 1</Select.ItemText>
                    </Select.Item>
                    <Select.Item className='demo-select-item' value='opt2'>
                      <Select.ItemText>Option 2</Select.ItemText>
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
