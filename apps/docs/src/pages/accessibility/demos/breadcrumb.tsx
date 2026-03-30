/* eslint-disable @docusaurus/no-untranslated-text, @docusaurus/prefer-docusaurus-heading */
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Breadcrumb } from '@turkish-technology/spar';
import '../../../styles/accessibility-demos.scss';

export default function BreadcrumbDemo() {
  return (
    <Layout title='Breadcrumb'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Breadcrumb – Accessibility Demo</h1>
        <p className='page-description'>
          Navigation landmark with <code>aria-label=&quot;Breadcrumb&quot;</code>, ordered list
          semantics, and <code>aria-current=&quot;page&quot;</code> on the current page item.
        </p>

        {/* 1. Basic Breadcrumb */}
        <section className='demo-section'>
          <h2>1. Basic Breadcrumb</h2>
          <p className='demo-description'>
            Standard breadcrumb trail with links and a current page. Screen readers announce the{' '}
            <code>nav</code> landmark and each link; the last item is marked with{' '}
            <code>aria-current=&quot;page&quot;</code>.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Breadcrumb.Root className='demo-breadcrumb'>
                  <Breadcrumb.List className='demo-breadcrumb-list'>
                    <Breadcrumb.Item>
                      <Breadcrumb.Link href='#home'>Home</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>/</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.Link href='#products'>Products</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>/</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.Page>Widget</Breadcrumb.Page>
                    </Breadcrumb.Item>
                  </Breadcrumb.List>
                </Breadcrumb.Root>
              </div>
              <div className='keyboard-hint'>
                <strong>Keyboard:</strong> Tab through links → Enter/Space to activate → Current
                page is not focusable
              </div>
            </div>
          </div>
        </section>

        {/* 2. With onNavigate Handler */}
        <section className='demo-section'>
          <h2>2. With Navigation Handler</h2>
          <p className='demo-description'>
            Root <code>onNavigate</code> intercepts all link clicks for SPA routing integration.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Breadcrumb.Root
                  className='demo-breadcrumb'
                  onNavigate={(href, e) => {
                    e.preventDefault();
                  }}
                >
                  <Breadcrumb.List className='demo-breadcrumb-list'>
                    <Breadcrumb.Item>
                      <Breadcrumb.Link href='/dashboard'>Dashboard</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>/</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.Link href='/dashboard/settings'>Settings</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>/</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.Page>Profile</Breadcrumb.Page>
                    </Breadcrumb.Item>
                  </Breadcrumb.List>
                </Breadcrumb.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Custom Separators */}
        <section className='demo-section'>
          <h2>3. Custom Separators</h2>
          <p className='demo-description'>
            Separators are decorative and hidden from screen readers via{' '}
            <code>aria-hidden=&quot;true&quot;</code>.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area demo-col'>
                <Breadcrumb.Root className='demo-breadcrumb'>
                  <Breadcrumb.List className='demo-breadcrumb-list'>
                    <Breadcrumb.Item>
                      <Breadcrumb.Link href='#'>Home</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>→</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.Link href='#'>Docs</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>→</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.Page>Components</Breadcrumb.Page>
                    </Breadcrumb.Item>
                  </Breadcrumb.List>
                </Breadcrumb.Root>

                <Breadcrumb.Root className='demo-breadcrumb'>
                  <Breadcrumb.List className='demo-breadcrumb-list'>
                    <Breadcrumb.Item>
                      <Breadcrumb.Link href='#'>Home</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>•</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.Link href='#'>Blog</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>•</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.Page>Article</Breadcrumb.Page>
                    </Breadcrumb.Item>
                  </Breadcrumb.List>
                </Breadcrumb.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Disabled */}
        <section className='demo-section'>
          <h2>4. Disabled Breadcrumb</h2>
          <p className='demo-description'>
            Fully disabled breadcrumb prevents all navigation. Individual link disabling is also
            supported.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area demo-col'>
                <div>
                  <p style={{ margin: '0 0 0.5rem' }}>
                    <strong>Fully disabled:</strong>
                  </p>
                  <Breadcrumb.Root className='demo-breadcrumb' disabled>
                    <Breadcrumb.List className='demo-breadcrumb-list'>
                      <Breadcrumb.Item>
                        <Breadcrumb.Link href='#'>Home</Breadcrumb.Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Separator>/</Breadcrumb.Separator>
                      <Breadcrumb.Item>
                        <Breadcrumb.Link href='#'>Products</Breadcrumb.Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Separator>/</Breadcrumb.Separator>
                      <Breadcrumb.Item>
                        <Breadcrumb.Page>Widget</Breadcrumb.Page>
                      </Breadcrumb.Item>
                    </Breadcrumb.List>
                  </Breadcrumb.Root>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.5rem' }}>
                    <strong>Individual link disabled:</strong>
                  </p>
                  <Breadcrumb.Root className='demo-breadcrumb'>
                    <Breadcrumb.List className='demo-breadcrumb-list'>
                      <Breadcrumb.Item>
                        <Breadcrumb.Link href='#' disabled>
                          Home (disabled)
                        </Breadcrumb.Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Separator>/</Breadcrumb.Separator>
                      <Breadcrumb.Item>
                        <Breadcrumb.Link href='#'>Products</Breadcrumb.Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Separator>/</Breadcrumb.Separator>
                      <Breadcrumb.Item>
                        <Breadcrumb.Page>Widget</Breadcrumb.Page>
                      </Breadcrumb.Item>
                    </Breadcrumb.List>
                  </Breadcrumb.Root>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. External Links */}
        <section className='demo-section'>
          <h2>5. External Links</h2>
          <p className='demo-description'>
            External links get <code>target=&quot;_blank&quot;</code> and{' '}
            <code>rel=&quot;noopener noreferrer&quot;</code> for security.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Breadcrumb.Root className='demo-breadcrumb'>
                  <Breadcrumb.List className='demo-breadcrumb-list'>
                    <Breadcrumb.Item>
                      <Breadcrumb.Link href='https://github.com' isExternal>
                        GitHub ↗
                      </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>/</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.Link href='#'>Repository</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>/</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.Page>Issues</Breadcrumb.Page>
                    </Breadcrumb.Item>
                  </Breadcrumb.List>
                </Breadcrumb.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Render Props on Items */}
        <section className='demo-section'>
          <h2>6. Render Props Pattern</h2>
          <p className='demo-description'>
            <code>BreadcrumbItem</code> provides <code>position</code>,<code>isCurrent</code>, and{' '}
            <code>isDisabled</code> via render props.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Breadcrumb.Root className='demo-breadcrumb'>
                  <Breadcrumb.List className='demo-breadcrumb-list'>
                    <Breadcrumb.Item>
                      {({ position }) => (
                        <Breadcrumb.Link href='#'>Home [{position}]</Breadcrumb.Link>
                      )}
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>/</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      {({ position }) => (
                        <Breadcrumb.Link href='#'>Docs [{position}]</Breadcrumb.Link>
                      )}
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>/</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      {({ position, isCurrent }) => (
                        <Breadcrumb.Page>
                          Current [{position}] {isCurrent ? '✓' : ''}
                        </Breadcrumb.Page>
                      )}
                    </Breadcrumb.Item>
                  </Breadcrumb.List>
                </Breadcrumb.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Polymorphic Root */}
        <section className='demo-section'>
          <h2>7. Polymorphic Root</h2>
          <p className='demo-description'>
            Root element can be changed with <code>as</code> prop. When not using <code>nav</code>,
            ensure proper ARIA labeling.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Breadcrumb.Root
                  as='div'
                  role='navigation'
                  aria-label='File path'
                  className='demo-breadcrumb'
                >
                  <Breadcrumb.List className='demo-breadcrumb-list'>
                    <Breadcrumb.Item>
                      <Breadcrumb.Link href='#'>src</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>/</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.Link href='#'>components</Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator>/</Breadcrumb.Separator>
                    <Breadcrumb.Item>
                      <Breadcrumb.Page>Breadcrumb.tsx</Breadcrumb.Page>
                    </Breadcrumb.Item>
                  </Breadcrumb.List>
                </Breadcrumb.Root>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Long Trail */}
        <section className='demo-section'>
          <h2>8. Long Breadcrumb Trail</h2>
          <p className='demo-description'>
            Deeply nested navigation path. All links remain tabbable in sequence.
          </p>
          <div className='demo-section-layout'>
            <div>
              <div className='demo-area'>
                <Breadcrumb.Root className='demo-breadcrumb'>
                  <Breadcrumb.List className='demo-breadcrumb-list'>
                    {['Home', 'Electronics', 'Computers', 'Laptops', 'Gaming'].map(
                      (label, i, arr) => (
                        <React.Fragment key={label}>
                          {i > 0 && <Breadcrumb.Separator>/</Breadcrumb.Separator>}
                          <Breadcrumb.Item>
                            {i === arr.length - 1 ? (
                              <Breadcrumb.Page>{label}</Breadcrumb.Page>
                            ) : (
                              <Breadcrumb.Link href='#'>{label}</Breadcrumb.Link>
                            )}
                          </Breadcrumb.Item>
                        </React.Fragment>
                      ),
                    )}
                  </Breadcrumb.List>
                </Breadcrumb.Root>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
