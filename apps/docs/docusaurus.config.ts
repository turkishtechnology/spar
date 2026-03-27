import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Turkish Technology Headless UI',
  tagline: 'Modern headless React component library',
  favicon: 'img/Vector3.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://spar.app.turkishtechlab.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'turkishtechnology', // Usually your GitHub org/user name.
  projectName: 'headless', // Usually your repo name.

  onBrokenLinks: 'throw',
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    path: 'i18n',
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'en',
      },
    },
  },
  plugins: ['docusaurus-plugin-sass'],
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/styles/index.scss'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      // title: "Takeoff UI",
      logo: {
        srcDark: 'img/thy-logo.svg',
        src: 'img/thy-logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        // { to: "/blog", label: "Blog", position: "left" },
        {
          to: '/accessibility',
          label: 'Accessibility Demos',
          position: 'left',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/turkishtechnology/spar',
          label: 'Github',
          position: 'right',
        },
        /*
        {
          type: 'localeDropdown',
          position: 'right',
        },
        */
      ],
      hideOnScroll: true,
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
    },
    // Algolia DocSearch Configuration
    // Get your credentials by applying at: https://docsearch.algolia.com/apply
    // Replace with your own credentials after DocSearch approval
    algolia: {
      // The application ID provided by Algolia
      appId: process.env.ALGOLIA_APP_ID || 'X1Z85QJPUV',

      // Public API key: it is safe to commit it
      apiKey: process.env.ALGOLIA_SEARCH_API_KEY || 'bf7211c161e8205da2f933a02534105a',

      // The index name provided by Algolia
      indexName: process.env.ALGOLIA_INDEX_NAME || 'docusaurus-2',

      // Optional: Enable contextual search (search within current section)
      contextualSearch: true,

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch
      insights: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
