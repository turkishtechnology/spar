import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import '../../styles/accessibility-demos.scss';

const components = [
  'Accordion',
  'Breadcrumb',
  'Button',
  'Checkbox',
  'Collapsible',
  'Dialog',
  'Dropdown-Menu',
  'Input',
  'Label',
  'Popover',
  'Radio',
  'Select',
  'Switch',
  'Tabs',
  'Tooltip',
];
export default function AccessibilityDemos() {
  return (
    <Layout>
      <div className='demos-index'>
        <div className='section-heading'>Accessibility Demos</div>
        <div className='component-grid'>
          {components.map((c) => (
            <Link
              key={c.toLowerCase()}
              to={`/accessibility/demos/${c.toLowerCase()}`}
              className='component-card'
            >
              <span>{c}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
