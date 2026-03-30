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
        <p>
          Explore interactive demos showcasing the accessibility features of our components. Each
          demo highlights how to use the component with proper ARIA attributes, keyboard navigation,
          and screen reader support. Click on a component to see detailed examples and test its
          accessibility in action.
        </p>
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
