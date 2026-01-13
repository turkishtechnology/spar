import React from 'react';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';
import '../styles/ComponentsList.scss';

interface Component {
  name: string;
  description: string;
  path: string;
  image: string;
  dark?: string;
}

const components: Component[] = [
  {
    name: 'Accordion',
    description: 'Collapsible content sections with expand/collapse functionality',
    path: '/docs/Components/Accordion',
    image: '/img/accordion.png',
    dark: '/img/accordion-dark.png',
  },
  {
    name: 'Breadcrumb',
    description: 'Navigation breadcrumbs to show the current page location',
    path: '/docs/Components/Breadcrumb',
    image: '/img/breadcrumb.png',
    dark: '/img/breadcrumb-dark.png',
  },
  {
    name: 'Button',
    description: 'Interactive button element with keyboard support',
    path: '/docs/Components/Button',
    image: '/img/button.png',
    dark: '/img/button-dark.png',
  },
  {
    name: 'Checkbox',
    description: 'Toggle checkbox input with indeterminate state support',
    path: '/docs/Components/Checkbox',
    image: '/img/checkbox.png',
    dark: '/img/checkbox-dark.png',
  },
  {
    name: 'Collapsible',
    description: 'Show and hide content with smooth transitions',
    path: '/docs/Components/Collapsible',
    image: '/img/collapsible.png',
    dark: '/img/collapsible-dark.png',
  },
  {
    name: 'Dialog',
    description: 'Modal dialogs and overlays with focus management',
    path: '/docs/Components/Dialog',
    image: '/img/dialog.png',
    dark: '/img/dialog-dark.png',
  },
  {
    name: 'DropdownMenu',
    description: 'Dropdown menus with nested items and keyboard navigation',
    path: '/docs/Components/DropdownMenu',
    image: '/img/dropdown.png',
    dark: '/img/dropdown-dark.png',
  },
  {
    name: 'Input',
    description: 'Text input field with validation support',
    path: '/docs/Components/Input',
    image: '/img/input.png',
    dark: '/img/input-dark.png',
  },
  {
    name: 'Label',
    description: 'Form labels with automatic association to form controls',
    path: '/docs/Components/Label',
    image: '/img/label.png',
    dark: '/img/label-dark.png',
  },
  {
    name: 'Popover',
    description: 'Floating content overlay positioned relative to a trigger',
    path: '/docs/Components/Popover',
    image: '/img/popover.png',
    dark: '/img/popover-dark.png',
  },
  {
    name: 'Radio',
    description: 'Radio button groups for mutually exclusive selections',
    path: '/docs/Components/Radio',
    image: '/img/radio.png',
    dark: '/img/radio-dark.png',
  },
  {
    name: 'Select',
    description: 'Custom select dropdown with search and keyboard navigation',
    path: '/docs/Components/Select',
    image: '/img/select.png',
    dark: '/img/select-dark.png',
  },
  {
    name: 'Switch',
    description: 'Toggle switch for binary on/off states',
    path: '/docs/Components/Switch',
    image: '/img/switch.png',
    dark: '/img/switch-dark.png',
  },
  {
    name: 'Tabs',
    description: 'Tabbed interfaces with keyboard navigation',
    path: '/docs/Components/Tabs',
    image: '/img/tabs.png',
    dark: '/img/tabs-dark.png',
  },
  {
    name: 'Tooltip',
    description: 'Hover tooltips with customizable positioning',
    path: '/docs/Components/Tooltip',
    image: '/img/tooltip.png',
    dark: '/img/tooltip-dark.png',
  },
];

export default function ComponentsList(): React.ReactElement {
  const { colorMode } = useColorMode();
  const color = colorMode === 'light' ? 'black' : 'white';
  const isDark = colorMode === 'dark';

  return (
    <div className='components-grid'>
      {components.map((component) => {
        const imageSrc = isDark && component.dark ? component.dark : component.image;

        return (
          <div key={component.name} className='component-card'>
            <div className='component-card-header'>
              <div className='component-card-title'>{component.name} </div>
              <Link to={component.path} className='component-card-link'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M6.29148 6.70898C6.29148 7.25898 6.74148 7.70898 7.29148 7.70898H14.8815L6.00148 16.589C5.61148 16.979 5.61148 17.609 6.00148 17.999C6.39148 18.389 7.02148 18.389 7.41148 17.999L16.2915 9.11898V16.709C16.2915 17.259 16.7415 17.709 17.2915 17.709C17.8415 17.709 18.2915 17.259 18.2915 16.709V6.70898C18.2915 6.15898 17.8415 5.70898 17.2915 5.70898H7.29148C6.74148 5.70898 6.29148 6.15898 6.29148 6.70898Z'
                    fill={color}
                  />
                </svg>
              </Link>
            </div>
            <div className='component-card-body'>
              <img
                src='/img/upper-bg.png'
                alt='upper background'
                className='component-card-upper-bg'
              />
              <img
                src={imageSrc}
                alt={`${component.name} component preview`}
                className='component-card-image'
              />
              <img
                src='/img/lower-bg.png'
                alt='lower background'
                className='component-card-lower-bg'
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
