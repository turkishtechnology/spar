import React, { useState } from 'react';
import '../styles/LiveCode.scss';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { format } from 'prettier/standalone';
import prettierPluginBabel from 'prettier/plugins/babel';
import prettierPluginEstree from 'prettier/plugins/estree';
import prettierPluginPostcss from 'prettier/plugins/postcss';
import { Highlight, themes } from 'prism-react-renderer';
import { useColorMode } from '@docusaurus/theme-common';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  Button,
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Dialog,
  Input,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverPortal,
  PopoverAnchor,
  PopoverClose,
  Radio,
  RadioGroup,
  RadioItem,
  Checkbox,
  Switch,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipArrow,
  Select,
  DropdownMenu,
} from '@turkish-technology/spar';

interface LiveCodeProps {
  code?: string;
  cssCode?: string;
}

interface CollapsibleCodeBlockProps {
  children: React.ReactNode;
}

const CollapsibleCodeBlock: React.FC<CollapsibleCodeBlockProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => setIsCollapsed((prev) => !prev);

  return (
    <div className='collapsible-code-block'>
      <button className='collapsible-toggle' onClick={handleToggle} aria-expanded={!isCollapsed}>
        <span className='toggle-icon'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
          >
            <path
              d='M7.83366 13.8333L4.00033 10L7.83366 6.16667L6.66699 5L1.66699 10L6.66699 15L7.83366 13.8333ZM12.167 13.8333L16.0003 10L12.167 6.16667L13.3337 5L18.3337 10L13.3337 15L12.167 13.8333Z'
              fill='black'
            />
          </svg>
        </span>
        <span className='toggle-text'>Code</span>
        <span className='expand-icon'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
          >
            <path
              d='M13.2292 7.49961L9.99583 10.7329L6.7625 7.49961C6.4375 7.17461 5.9125 7.17461 5.5875 7.49961C5.2625 7.82461 5.2625 8.34961 5.5875 8.67461L9.4125 12.4996C9.7375 12.8246 10.2625 12.8246 10.5875 12.4996L14.4125 8.67461C14.7375 8.34961 14.7375 7.82461 14.4125 7.49961C14.0875 7.18294 13.5542 7.17461 13.2292 7.49961Z'
              fill='#222530'
            />
          </svg>
        </span>
      </button>

      {!isCollapsed && <div className='collapsible-content'>{children}</div>}
    </div>
  );
};
const LiveCode: React.FC<LiveCodeProps> = ({ code, cssCode }) => {
  // Pick theme for syntax highlighting based on color mode
  const { colorMode } = useColorMode();
  const selectedTheme = colorMode === 'dark' ? themes.vsDark : themes.github;
  const [activeTab, setActiveTab] = useState<'js' | 'css'>('js');
  const [isCopied, setIsCopied] = useState(false);
  const [formattedCode, setFormattedCode] = useState(code || '');
  const [formattedCssCode, setFormattedCssCode] = useState(cssCode || '');

  // Format JSX code with Prettier
  React.useEffect(() => {
    if (!code) {
      setFormattedCode('');
      return;
    }

    const formatCode = async () => {
      try {
        const formatted = await format(code, {
          parser: 'babel',
          plugins: [prettierPluginBabel, prettierPluginEstree],
          semi: true,
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          arrowParens: 'always',
          endOfLine: 'lf',
          bracketSpacing: true,
          bracketSameLine: false,
          jsxSingleQuote: true,
          quoteProps: 'as-needed',
          proseWrap: 'preserve',
          htmlWhitespaceSensitivity: 'css',
          embeddedLanguageFormatting: 'auto',
        });
        setFormattedCode(formatted);
      } catch (error) {
        console.warn('Failed to format JSX code:', error);
        setFormattedCode(code); // Fallback to original code
      }
    };

    formatCode();
  }, [code]);

  // Format CSS code with Prettier
  React.useEffect(() => {
    if (!cssCode) {
      setFormattedCssCode('');
      return;
    }

    const formatCode = async () => {
      try {
        const formatted = await format(cssCode, {
          parser: 'css',
          plugins: [prettierPluginPostcss],
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          singleQuote: true,
          endOfLine: 'lf',
        });
        setFormattedCssCode(formatted);
      } catch (error) {
        console.warn('Failed to format CSS code:', error);
        setFormattedCssCode(cssCode); // Fallback to original code
      }
    };

    formatCode();
  }, [cssCode]);

  // React Live scope - burada kullanılabilir değişkenler ve bileşenler
  const scope = {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    // Breadcrumb components
    BreadcrumbRoot,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    // Popover components
    PopoverRoot,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverPortal,
    PopoverAnchor,
    PopoverClose,
    // Accordion components
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionTrigger,
    AccordionContent,
    // Button component
    Button,
    // Collapsible components
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
    // Radio components
    Radio,
    RadioGroup,
    RadioItem,
    // Input components
    Input,
    // Checkbox component
    Checkbox,
    // Switch component
    Switch,
    // Label component
    Label,
    // Tabs components
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    // Spar Tooltip components
    TooltipProvider,
    TooltipRoot,
    TooltipTrigger,
    TooltipContent,
    TooltipPortal,
    TooltipArrow,
    // Select component
    Select,
    // DropdownMenu components
    DropdownMenu,
    // Dialog components
    Dialog,
  };

  const handleCopy = async () => {
    const textToCopy = activeTab === 'js' ? formattedCode : formattedCssCode;
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className='live-code-container'>
      <LiveProvider code={formattedCode} scope={scope} noInline={false}>
        <div className='live-preview-wrapper'>
          <LivePreview className='live-preview' />
          <LiveError className='live-error' />
        </div>

        <CollapsibleCodeBlock>
          <div className='live-code-wrapper'>
            <div className='live-code-header'>
              <span className='live-code-icon'>
                {activeTab === 'js' ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='15'
                    height='15'
                    viewBox='0 0 15 15'
                    fill='none'
                  >
                    <path
                      d='M0 0H15V15H0V0ZM3.94167 12.5333C4.275 13.2417 4.93333 13.825 6.05833 13.825C7.30833 13.825 8.16667 13.1583 8.16667 11.7V6.88333H6.75V11.6667C6.75 12.3833 6.45833 12.5667 6 12.5667C5.51667 12.5667 5.31667 12.2333 5.09167 11.8417L3.94167 12.5333ZM8.925 12.3833C9.34167 13.2 10.1833 13.825 11.5 13.825C12.8333 13.825 13.8333 13.1333 13.8333 11.8583C13.8333 10.6833 13.1583 10.1583 11.9583 9.64167L11.6083 9.49167C11 9.23333 10.7417 9.05833 10.7417 8.64167C10.7417 8.3 11 8.03333 11.4167 8.03333C11.8167 8.03333 12.0833 8.20833 12.325 8.64167L13.4167 7.91667C12.9583 7.11667 12.3083 6.80833 11.4167 6.80833C10.1583 6.80833 9.35 7.60833 9.35 8.66667C9.35 9.81667 10.025 10.3583 11.0417 10.7917L11.3917 10.9417C12.0417 11.225 12.425 11.4 12.425 11.8833C12.425 12.2833 12.05 12.575 11.4667 12.575C10.775 12.575 10.375 12.2167 10.075 11.7167L8.925 12.3833Z'
                      fill='#525866'
                    />
                  </svg>
                ) : (
                  <svg
                    className='tab-icon'
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    style={{ transform: 'scale(0.75)' }}
                  >
                    <path d='M4.73125 2.5H17.5L15.2437 13.955L8.4225 16.25L2.5 13.955L3.1025 10.8962H5.625L5.375 12.16L8.955 13.5437L13.08 12.16L13.6562 9.25H3.40625L3.9 6.69375H14.1575L14.48 5.0525H4.23L4.73125 2.5Z' />
                  </svg>
                )}
              </span>
              <span className='live-code-title'>{activeTab === 'js' ? 'JavaScript' : 'CSS'}</span>
              <div className='live-code-header-actions'>
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as 'js' | 'css')}
                  className='tabs'
                >
                  <TabsList className='tabs-list'>
                    <TabsTrigger value='js' className='tab'>
                      <span className='tab-icon-container'>
                        <svg
                          className='tab-icon'
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 20 20'
                        >
                          <path d='M2.5 2.5H17.5V17.5H2.5V2.5ZM6.44167 15.0333C6.775 15.7417 7.43333 16.325 8.55833 16.325C9.80833 16.325 10.6667 15.6583 10.6667 14.2V9.38333H9.25V14.1667C9.25 14.8833 8.95833 15.0667 8.5 15.0667C8.01667 15.0667 7.81667 14.7333 7.59167 14.3417L6.44167 15.0333ZM11.425 14.8833C11.8417 15.7 12.6833 16.325 14 16.325C15.3333 16.325 16.3333 15.6333 16.3333 14.3583C16.3333 13.1833 15.6583 12.6583 14.4583 12.1417L14.1083 11.9917C13.5 11.7333 13.2417 11.5583 13.2417 11.1417C13.2417 10.8 13.5 10.5333 13.9167 10.5333C14.3167 10.5333 14.5833 10.7083 14.825 11.1417L15.9167 10.4167C15.4583 9.61667 14.8083 9.30833 13.9167 9.30833C12.6583 9.30833 11.85 10.1083 11.85 11.1667C11.85 12.3167 12.525 12.8583 13.5417 13.2917L13.8917 13.4417C14.5417 13.725 14.925 13.9 14.925 14.3833C14.925 14.7833 14.55 15.075 13.9667 15.075C13.275 15.075 12.875 14.7167 12.575 14.2167L11.425 14.8833Z' />
                        </svg>
                      </span>
                    </TabsTrigger>
                    {cssCode && (
                      <TabsTrigger value='css' className='tab'>
                        <span className='tab-icon-container'>
                          <svg
                            className='tab-icon'
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                          >
                            <path d='M4.73125 2.5H17.5L15.2437 13.955L8.4225 16.25L2.5 13.955L3.1025 10.8962H5.625L5.375 12.16L8.955 13.5437L13.08 12.16L13.6562 9.25H3.40625L3.9 6.69375H14.1575L14.48 5.0525H4.23L4.73125 2.5Z' />
                          </svg>
                        </span>
                      </TabsTrigger>
                    )}
                  </TabsList>
                </Tabs>
                <TooltipProvider delayDuration={0}>
                  <TooltipRoot>
                    <TooltipTrigger className='live-code-action-button' onClick={handleCopy}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='15'
                        height='19'
                        viewBox='0 0 15 19'
                        fill='none'
                      >
                        <path
                          d='M13.3333 1.66667H9.85C9.5 0.7 8.58333 0 7.5 0C6.41667 0 5.5 0.7 5.15 1.66667H1.66667C0.75 1.66667 0 2.41667 0 3.33333V16.6667C0 17.5833 0.75 18.3333 1.66667 18.3333H13.3333C14.25 18.3333 15 17.5833 15 16.6667V3.33333C15 2.41667 14.25 1.66667 13.3333 1.66667ZM7.5 1.66667C7.95833 1.66667 8.33333 2.04167 8.33333 2.5C8.33333 2.95833 7.95833 3.33333 7.5 3.33333C7.04167 3.33333 6.66667 2.95833 6.66667 2.5C6.66667 2.04167 7.04167 1.66667 7.5 1.66667ZM12.5 16.6667H2.5C2.04167 16.6667 1.66667 16.2917 1.66667 15.8333V4.16667C1.66667 3.70833 2.04167 3.33333 2.5 3.33333H3.33333V4.16667C3.33333 5.08333 4.08333 5.83333 5 5.83333H10C10.9167 5.83333 11.6667 5.08333 11.6667 4.16667V3.33333H12.5C12.9583 3.33333 13.3333 3.70833 13.3333 4.16667V15.8333C13.3333 16.2917 12.9583 16.6667 12.5 16.6667Z'
                          fill='#222530'
                        />
                      </svg>
                    </TooltipTrigger>
                    <TooltipPortal>
                      <TooltipContent
                        className='live-code-copy-tooltip'
                        side='bottom'
                        sideOffset={5}
                        style={{
                          borderColor: isCopied
                            ? 'var(--states-success-sub-base, #A0E6BA)'
                            : 'var(--border-dark, #525866)',
                          background: isCopied
                            ? 'var(--states-success-light, #CAF1D8)'
                            : 'var(--background-darkest, #222530)',
                          color: isCopied ? 'var(--text-darkest, #222530)' : '#fff',
                        }}
                      >
                        {isCopied && (
                          <div className='live-code-copy-tooltip-icon'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='14'
                              height='14'
                              viewBox='0 0 14 14'
                              fill='none'
                            >
                              <path
                                d='M6.66667 0C2.98667 0 0 2.98667 0 6.66667C0 10.3467 2.98667 13.3333 6.66667 13.3333C10.3467 13.3333 13.3333 10.3467 13.3333 6.66667C13.3333 2.98667 10.3467 0 6.66667 0ZM4.86 9.52667L2.46667 7.13333C2.20667 6.87333 2.20667 6.45333 2.46667 6.19333C2.72667 5.93333 3.14667 5.93333 3.40667 6.19333L5.33333 8.11333L9.92 3.52667C10.18 3.26667 10.6 3.26667 10.86 3.52667C11.12 3.78667 11.12 4.20667 10.86 4.46667L5.8 9.52667C5.54667 9.78667 5.12 9.78667 4.86 9.52667Z'
                                fill='#188A42'
                              />
                            </svg>
                          </div>
                        )}
                        {isCopied ? 'Copied successfully' : 'Copy'}
                      </TooltipContent>
                    </TooltipPortal>
                  </TooltipRoot>
                </TooltipProvider>
              </div>
            </div>

            {activeTab === 'js' ? (
              <LiveEditor theme={selectedTheme} className='live-editor' code={formattedCode} />
            ) : (
              // @ts-ignore
              <Highlight theme={selectedTheme} code={formattedCssCode} language='css'>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    className={`live-editor ${className}`}
                    style={{
                      ...style,
                      overflowX: 'auto',
                      overflowY: 'auto',
                      whiteSpace: 'pre',
                      wordWrap: 'normal',
                    }}
                  >
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line, key: i })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token, key })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            )}
          </div>
        </CollapsibleCodeBlock>
      </LiveProvider>
    </div>
  );
};
export default LiveCode;
