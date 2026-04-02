/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Accordion } from '@turkish-technology/spar';
import '../../../styles/accessibility-demos.scss';

const ChevronIcon = () => (
  <svg className='demo-chevron' width='16' height='16' viewBox='0 0 20 20' fill='currentColor'>
    <path d='M13.2292 7.5L9.99583 10.7333L6.7625 7.5C6.4375 7.175 5.9125 7.175 5.5875 7.5C5.2625 7.825 5.2625 8.35 5.5875 8.675L9.4125 12.5C9.7375 12.825 10.2625 12.825 10.5875 12.5L14.4125 8.675C14.7375 8.35 14.7375 7.825 14.4125 7.5C14.0875 7.183 13.5542 7.175 13.2292 7.5Z' />
  </svg>
);

export default function AccordionDemo() {
  const [controlledValue, setControlledValue] = useState<string | string[]>('item-1');

  return (
    <Layout title='Accordion'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Accordion</h1>
        <p className='page-description'>
          Accordion organizes related content into expandable sections, helping keep long interfaces
          structured and scannable.
        </p>

        {/* 1. Single Expand (Default) */}
        <section className='demo-section'>
          <h2>1. Single Expand Mode</h2>
          <p>
            Only one panel open at a time. Arrow Up/Down navigate between triggers. Enter/Space
            toggles the focused panel.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Accordion.Root className='demo-accordion' defaultValue='s-1'>
                  {['Tab 1', 'Tab 2', 'Tab 3'].map((title, i) => (
                    <Accordion.Item
                      key={`item-${i + 1}`}
                      className='demo-accordion-item'
                      value={`item-${i + 1}`}
                    >
                      <Accordion.Header className='demo-accordion-header'>
                        <Accordion.Trigger className='demo-accordion-trigger'>
                          {title}
                          <ChevronIcon />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className='demo-accordion-content'>
                        Only one panel can be open. Opening another closes the previous one.
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab to first trigger → ↑↓ to navigate → Enter/Space to
                toggle → Home/End for first/last
              </div>
            </div>
          </div>
        </section>

        {/* 2. Multiple Expand */}
        <section className='demo-section'>
          <h2>2. Multiple Expand Mode</h2>
          <p className='demo-description'>
            Multiple panels can be open simultaneously with <code>type=&quot;multiple&quot;</code>.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Accordion.Root
                  className='demo-accordion'
                  type='multiple'
                  defaultValue={['m-1', 'm-3']}
                >
                  {['Tab 1', 'Tab 2', 'Tab 3'].map((title, i) => (
                    <Accordion.Item
                      key={`item-${i + 1}`}
                      className='demo-accordion-item'
                      value={`item-${i + 1}`}
                    >
                      <Accordion.Header className='demo-accordion-header'>
                        <Accordion.Trigger className='demo-accordion-trigger'>
                          {title}
                          <ChevronIcon />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className='demo-accordion-content'>
                        All panels can be open at the same time. Toggling one does not affect
                        others.
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Collapsible (single) */}
        <section className='demo-section'>
          <h2>3. Collapsible Single Mode</h2>
          <p className='demo-description'>
            With <code>isCollapsible</code>, all panels can be closed in single mode. Without it,
            one panel always stays open.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Accordion.Root className='demo-accordion' isCollapsible>
                  {['Panel A', 'Panel B', 'Panel C'].map((title, i) => (
                    <Accordion.Item
                      key={`c-${i + 1}`}
                      className='demo-accordion-item'
                      value={`c-${i + 1}`}
                    >
                      <Accordion.Header className='demo-accordion-header'>
                        <Accordion.Trigger className='demo-accordion-trigger'>
                          {title}
                          <ChevronIcon />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className='demo-accordion-content'>
                        This panel can be collapsed. Click the trigger again to close it.
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Controlled State */}
        <section className='demo-section'>
          <h2>4. Controlled Accordion</h2>
          <p className='demo-description'>
            Parent manages which panel is open. External buttons can open specific panels.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area demo-col'>
                <div className='demo-row'>
                  <button className='demo-btn' onClick={() => setControlledValue('item-1')}>
                    Open 1
                  </button>
                  <button className='demo-btn' onClick={() => setControlledValue('item-2')}>
                    Open 2
                  </button>
                  <button className='demo-btn' onClick={() => setControlledValue('item-3')}>
                    Open 3
                  </button>
                </div>
                <Accordion.Root
                  className='demo-accordion'
                  value={controlledValue}
                  onValueChange={(v) => {
                    setControlledValue(v);
                  }}
                >
                  {['First', 'Second', 'Third'].map((title, i) => (
                    <Accordion.Item
                      key={`item-${i + 1}`}
                      className='demo-accordion-item'
                      value={`item-${i + 1}`}
                    >
                      <Accordion.Header className='demo-accordion-header'>
                        <Accordion.Trigger className='demo-accordion-trigger'>
                          {title} Panel
                          <ChevronIcon />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className='demo-accordion-content'>
                        Content for the {title.toLowerCase()} panel. Controlled by parent state.
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Disabled Items */}
        <section className='demo-section'>
          <h2>5. Disabled Items</h2>
          <p className='demo-description'>
            Individual items can be disabled. Keyboard navigation skips disabled triggers.
          </p>
          <div className='demo-area'>
            <Accordion.Root className='demo-accordion' isCollapsible>
              <Accordion.Item className='demo-accordion-item' value='d-1'>
                <Accordion.Header className='demo-accordion-header'>
                  <Accordion.Trigger className='demo-accordion-trigger'>
                    Enabled item
                    <ChevronIcon />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className='demo-accordion-content'>
                  This item is enabled and interactive.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item className='demo-accordion-item' value='d-2' disabled>
                <Accordion.Header className='demo-accordion-header'>
                  <Accordion.Trigger className='demo-accordion-trigger'>
                    Disabled item
                    <ChevronIcon />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className='demo-accordion-content'>
                  This content should not be reachable.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item className='demo-accordion-item' value='d-3'>
                <Accordion.Header className='demo-accordion-header'>
                  <Accordion.Trigger className='demo-accordion-trigger'>
                    Another enabled item
                    <ChevronIcon />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className='demo-accordion-content'>
                  Arrow Down from first item should skip disabled and land here.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
          <div className='keyboard-hint'>
            <strong>Expected:</strong> Arrow keys skip the disabled item.
          </div>
        </section>

        {/* 6. Horizontal Orientation */}
        <section className='demo-section'>
          <h2>6. Horizontal Orientation</h2>
          <p className='demo-description'>
            With <code>orientation=&quot;horizontal&quot;</code>, arrow Left/Right navigate instead
            of Up/Down.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Accordion.Root
                  className='demo-accordion'
                  orientation='horizontal'
                  isCollapsible
                  style={{ flexDirection: 'row', gap: 8 }}
                >
                  {['Tab 1', 'Tab 2', 'Tab 3'].map((title, i) => (
                    <Accordion.Item
                      key={`h-${i + 1}`}
                      className='demo-accordion-item'
                      value={`h-${i + 1}`}
                      style={{ flex: 1 }}
                    >
                      <Accordion.Header className='demo-accordion-header'>
                        <Accordion.Trigger className='demo-accordion-trigger'>
                          {title}
                          <ChevronIcon />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className='demo-accordion-content'>
                        Horizontal content {i + 1}
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> ← → to navigate (not ↑ ↓)
              </div>
            </div>
          </div>
        </section>

        {/* 7. All Disabled */}
        <section className='demo-section'>
          <h2>7. Fully Disabled Accordion</h2>
          <p className='demo-description'>
            All items disabled via root <code>disabled</code> prop.
          </p>
          <div className='demo-area'>
            <Accordion.Root className='demo-accordion' disabled>
              {['Item A', 'Item B'].map((title, i) => (
                <Accordion.Item
                  key={`ad-${i + 1}`}
                  className='demo-accordion-item'
                  value={`ad-${i + 1}`}
                >
                  <Accordion.Header className='demo-accordion-header'>
                    <Accordion.Trigger className='demo-accordion-trigger'>
                      {title} (all disabled)
                      <ChevronIcon />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className='demo-accordion-content'>
                    Should not be accessible.
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </section>

        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
      </div>
    </Layout>
  );
}
