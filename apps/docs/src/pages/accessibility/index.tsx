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
          Explore interactive demos showcasing the accessibility features of Spar components. Each
          demo highlights how to use the component with proper ARIA attributes, keyboard navigation,
          and screen reader support. Click a component card to view detailed examples and test
          accessibility behavior in action.
        </p>
        <div className='component-grid'>
          {components.map((c) => (
            <Link
              key={c.toLowerCase()}
              to={`/accessibility/components/${c.toLowerCase()}`}
              className='component-card'
            >
              <span>{c}</span>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <p>These examples are designed for complex, real-world use cases.</p>
          <div className='component-grid'>
            <Link to='/accessibility/form' className='component-card'>
              <span>Form Demo</span>
            </Link>
            <Link to='/accessibility/aviation/ticketing' className='component-card'>
              <span>Ticketing Demo</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
