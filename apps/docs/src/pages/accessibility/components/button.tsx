/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Button } from '@turkish-technology/spar';

import '../../../styles/accessibility-demos.scss';

export default function ButtonDemo() {
  const [controlledToggle, setControlledToggle] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const simulateLoading = () => {
    setLoadingBtn(true);
    setTimeout(() => {
      setLoadingBtn(false);
    }, 2000);
  };

  return (
    <Layout title='Button'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Button</h1>
        <p className='page-description'>
          Button triggers user actions such as submit, confirm, cancel, or state toggles.
        </p>
        {/* 1. Basic Button */}
        <section className='demo-section'>
          <h2>1. Basic Button</h2>
          <p className='demo-description'>
            A standard button that responds to click and keyboard activation (Enter/Space).
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Button className='demo-btn' onClick={() => alert('Clicked')}>
                  Click me
                </Button>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab to focus → Enter or Space to activate
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Button onClick={() => alert('Clicked')}>
  Click me
</Button>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 2. Disabled Button */}
        <section className='demo-section'>
          <h2>2. Disabled Button</h2>
          <p className='demo-description'>
            Disabled buttons cannot be activated. Screen readers announce the disabled state. Focus
            should skip the disabled button when tabbing.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-row'>
                <Button className='demo-btn' disabled>
                  Disabled button
                </Button>
              </div>
              <div className='keyboard-hint'>
                <strong>Expected:</strong> Tab should skip the disabled button and focus the enabled
                one.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Button disabled>
  Disabled button
</Button>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 3. Loading State */}
        <section className='demo-section'>
          <h2>3. Loading State</h2>
          <p className='demo-description'>
            Loading button uses <code>aria-busy=&quot;true&quot;</code> and{' '}
            <code>aria-live=&quot;polite&quot;</code> to announce loading state to screen readers.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Button className='demo-btn' isLoading={loadingBtn} onClick={simulateLoading}>
                  {loadingBtn ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
              <div className='keyboard-hint'>
                <strong>Screen reader:</strong> Should announce busy state when loading starts.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Button isLoading={isLoading} onClick={simulateLoading}>
  {isLoading ? 'Saving…' : 'Save changes'}
</Button>`}</code>
              </pre>
            </div>
          </div>
        </section>
        {/* 4. Toggle Button */}
        <section className='demo-section'>
          <h2>4. Toggle Button </h2>
          <p className='demo-description'>
            Controlled toggle where parent manages the pressed state.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-row'>
                <Button
                  className='demo-btn'
                  isPressed={controlledToggle}
                  onPressedChange={(pressed) => setControlledToggle(pressed)}
                >
                  {controlledToggle ? '🔔 Notifications On' : '🔕 Notifications Off'}
                </Button>
                <Button
                  className='demo-btn'
                  onClick={() => {
                    setControlledToggle(!controlledToggle);
                  }}
                >
                  External toggle
                </Button>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`const [isPressed, setIsPressed] = useState(false);

<Button isPressed={isPressed} onPressedChange={(pressed) => setIsPressed(pressed)}>
  {isPressed ? 'Notifications On' : 'Notifications Off'}
</Button>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 5. Polymorphic Rendering */}
        <section className='demo-section'>
          <h2>5. Polymorphic Rendering (as prop)</h2>
          <p className='demo-description'>
            Button can render as different HTML elements. When rendered as non-button elements, it
            adds <code>role=&quot;button&quot;</code>, <code>tabIndex</code>, and keyboard handlers.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area demo-row'>
                <Button className='demo-btn' onClick={() => alert('Native Button is Clicked')}>
                  Native &lt;button&gt;
                </Button>
                <Button
                  as='a'
                  href='#polymorphic-link'
                  className='demo-btn'
                  onClick={() => alert('Anchor is Clicked')}
                >
                  Rendered as &lt;a&gt;
                </Button>
                <Button as='span' className='demo-btn' onClick={() => alert('Span is Clicked')}>
                  Rendered as &lt;span&gt;
                </Button>
              </div>
              <div className='keyboard-hint'>
                <strong>Screen reader:</strong> All three should be announced as buttons regardless
                of underlying element.
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Button>Native button</Button>

<Button as='a' href='#polymorphic-link'>
  Rendered as a
</Button>

<Button as='span'>Rendered as span</Button>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* 6. Auto Focus */}
        <section className='demo-section'>
          <h2>6. Auto Focus</h2>
          <p className='demo-description'>
            This button receives focus automatically on mount. Useful for modal dialogs or important
            CTAs.
          </p>
          <div className='demo-section-split'>
            <div>
              <div className='demo-area'>
                <Button className='demo-btn' autoFocus>
                  I should be focused on page load
                </Button>
              </div>
            </div>
            <div className='demo-side-example'>
              <pre className='demo-code-block'>
                <code>{`<Button autoFocus>
  I should be focused on page load
</Button>`}</code>
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
