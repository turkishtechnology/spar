import React, { useState } from 'react';
import '../styles/LiveCode.scss';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
interface LiveCodeProps {
  children?: string;
  className?: string;
  metastring?: string;
  title?: string;
  defaultCollapsed?: boolean;
  code?: string;
  editorHidden?: boolean;
}

interface CollapsibleCodeBlockProps {
  children: React.ReactNode;
  title?: string;
  defaultCollapsed?: boolean;
}

const CollapsibleCodeBlock: React.FC<CollapsibleCodeBlockProps> = ({
  children,
  title = 'Kodu Göster',
  defaultCollapsed = true,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

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
const LiveCode: React.FC<LiveCodeProps> = ({
  children,
  title = 'Kodu Göster',
  defaultCollapsed = true,
  code,
  editorHidden = false,
}) => {
  // Code'u children veya code prop'undan al
  const codeContent = code || children || '';

  // React Live scope - burada kullanılabilir değişkenler ve bileşenler
  const scope = {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
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
        {!editorHidden && (
          <CollapsibleCodeBlock title={title} defaultCollapsed={defaultCollapsed}>
            <div className='live-code-wrapper'>
              <LiveEditor className='live-editor' />
            </div>
          </CollapsibleCodeBlock>
        )}
      </LiveProvider>
    </div>
  );
};
export default LiveCode;
