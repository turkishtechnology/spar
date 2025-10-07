import React, { useState } from 'react';
import '../styles/LiveCode.scss';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { themes } from 'prism-react-renderer';

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  Button,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Input,
  Radio,
  RadioGroup,
  RadioItem,
  Checkbox,
  Switch,
  Label,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipArrow,
} from '@turkish-technology/glide';

interface LiveCodeProps {
  title?: string;
  code?: string;
  theme?: 'vsDark' | 'vsLight';
}

interface CollapsibleCodeBlockProps {
  title?: string;
  children: React.ReactNode;
}

const CollapsibleCodeBlock: React.FC<CollapsibleCodeBlockProps> = ({
  title = 'Kodu Göster',
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className={`collapsible-code-block ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <button
        className='collapsible-toggle'
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
      >
        <span className='toggle-icon'>{isCollapsed ? '▶' : '▼'}</span>
        <span className='toggle-text'>{title}</span>
      </button>

      <div
        className='collapsible-content'
        style={{
          maxHeight: isCollapsed ? '0' : '1000px',
          opacity: isCollapsed ? 0 : 1,
        }}
      >
        {children}
      </div>
    </div>
  );
};
const LiveCode: React.FC<LiveCodeProps> = ({ title, code, theme }) => {
  // Code'u children veya code prop'undan al
  const codeContent = code || '';
  const selectedTheme = themes[theme as keyof typeof themes] || themes.vsDark;
  // React Live scope - burada kullanılabilir değişkenler ve bileşenler
  const scope = {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    // Buraya daha sonra Glide bileşenlerini ekleyebiliriz
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
    // Glide Tooltip components
    TooltipProvider,
    TooltipRoot,
    TooltipTrigger,
    TooltipContent,
    TooltipPortal,
    TooltipArrow,
  };

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (code) {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Live code block'u collapsible wrapper ile sar
  return (
    <div className={`live-code-container`}>
      <LiveProvider code={codeContent} scope={scope} noInline={false}>
        <div className='live-preview-wrapper'>
          <LivePreview className='live-preview' />
          <LiveError className='live-error' />
        </div>

        <CollapsibleCodeBlock title={title}>
          <div className='live-code-wrapper'>
            <button
              className='copy-button'
              onClick={handleCopy}
              title={copied ? 'Kopyalandı!' : 'Kodu Kopyala'}
            >
              {copied ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='white'
                  strokeWidth='2'
                >
                  <polyline points='20,6 9,17 4,12'></polyline>
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='white'
                  strokeWidth='2'
                >
                  <rect x='9' y='9' width='13' height='13' rx='2' ry='2'></rect>
                  <path d='m5,15 L5,5 A2,2 0 0,1 7,3 L17,3'></path>
                </svg>
              )}
            </button>
            <LiveEditor theme={selectedTheme} className='live-editor' />
          </div>
        </CollapsibleCodeBlock>
      </LiveProvider>
    </div>
  );
};
export default LiveCode;
