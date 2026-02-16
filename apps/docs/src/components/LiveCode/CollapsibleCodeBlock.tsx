import { useEffect, useContext, useId, useRef, type ReactNode, type RefObject } from 'react';
import { LiveContext } from 'react-live';
import Translate from '@docusaurus/Translate';
import { CodeToggleIcon, ChevronDownIcon } from './icons';

interface CollapsibleCodeBlockProps {
  /** The content to render inside the collapsible panel */
  children?: ReactNode;
  /** Ref to the content container for scroll/focus management */
  codeBlockRef?: RefObject<HTMLDivElement | null>;
  /** Whether the code block is currently collapsed */
  isCollapsed: boolean;
  /** Callback to toggle the collapsed state */
  onToggle: () => void;
}

/**
 * A collapsible container for the code editor panel.
 * Auto-expands when an error is detected to show the error inline.
 */
export const CollapsibleCodeBlock = ({
  children,
  codeBlockRef,
  isCollapsed,
  onToggle,
}: CollapsibleCodeBlockProps) => {
  const { error } = useContext(LiveContext);

  // Generate unique ID for aria-controls
  const contentId = useId();

  // Track previous error to detect when a NEW error appears
  const prevErrorRef = useRef(error);

  // Auto-expand only when a NEW error appears (not on every collapse toggle)
  useEffect(() => {
    const errorJustAppeared = error && !prevErrorRef.current;
    prevErrorRef.current = error;

    if (errorJustAppeared && isCollapsed) {
      onToggle();
    }
  }, [error, isCollapsed, onToggle]);

  return (
    <div className='collapsible-code-block'>
      <button
        className='collapsible-toggle'
        onClick={onToggle}
        aria-expanded={!isCollapsed}
        aria-controls={contentId}
      >
        <span className='toggle-icon'>
          <CodeToggleIcon />
        </span>
        <span className='toggle-text'>
          <Translate id='liveCode.codeToggle'>Code</Translate>
        </span>
        <span className='expand-icon'>
          <ChevronDownIcon />
        </span>
      </button>

      {/* Always render content, hide with CSS to preserve editor state */}
      <div
        id={contentId}
        className='collapsible-content'
        ref={codeBlockRef}
        aria-hidden={isCollapsed}
        style={{ display: isCollapsed ? 'none' : 'block' }}
      >
        {children}
      </div>
    </div>
  );
};

CollapsibleCodeBlock.displayName = 'CollapsibleCodeBlock';

export default CollapsibleCodeBlock;
