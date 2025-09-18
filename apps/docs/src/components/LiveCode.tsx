import React, { useState } from 'react';
import '../styles/LiveCode.scss';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { Tooltip } from '@turkish-technology/glide';
interface LiveCodeProps {
  title?: string;
  code?: string;
}

interface CollapsibleCodeBlockProps {
  title?: string;
}

const CollapsibleCodeBlock: React.FC<CollapsibleCodeBlockProps> = ({ title = 'Kodu Göster' }) => {
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
      ></div>
    </div>
  );
};
const LiveCode: React.FC<LiveCodeProps> = ({ title, code }) => {
  // Code'u children veya code prop'undan al
  const codeContent = code || '';

  // React Live scope - burada kullanılabilir değişkenler ve bileşenler
  const scope = {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    Tooltip,
    // Buraya daha sonra Glide bileşenlerini ekleyebiliriz
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
            <LiveEditor className='live-editor' />
          </div>
        </CollapsibleCodeBlock>
      </LiveProvider>
    </div>
  );
};
export default LiveCode;
