import { useContext } from 'react';
import { LiveContext } from 'react-live';
import Translate from '@docusaurus/Translate';
import { getPreviewErrorMessage } from './utils';
import { ErrorIcon } from './icons';

interface PreviewErrorFooterProps {
  /** Whether the preview has successfully rendered at least once */
  hasRenderedOnce: boolean;
  /** Whether the code panel is currently expanded */
  isCodePanelOpen: boolean;
  /** Callback to expand the code panel and scroll to it */
  onShowInCode: () => void;
  /** Callback to reset the live code editor to initial state */
  onReset: () => void;
}

/**
 * Footer bar displayed below the preview when there's an error but a snapshot exists.
 * Shows a brief error message with actions; hidden when code panel is open to avoid duplication.
 */
export const PreviewErrorFooter = ({
  hasRenderedOnce,
  isCodePanelOpen,
  onShowInCode,
  onReset,
}: PreviewErrorFooterProps) => {
  const { error } = useContext(LiveContext);

  // Only show when we have a stale preview (previously rendered, now erroring)
  if (!error || !hasRenderedOnce) return null;

  // When the code panel is open the detailed CodeErrorBanner is visible;
  // hide the footer entirely to avoid duplicate messaging.
  if (isCodePanelOpen) return null;

  return (
    <div className='preview-error-footer' role='status'>
      <span className='preview-error-footer-icon'>
        <ErrorIcon size={14} />
      </span>
      <span className='preview-error-footer-text'>{getPreviewErrorMessage(error)}</span>
      <div className='preview-error-footer-actions'>
        <button className='preview-error-footer-btn' type='button' onClick={onShowInCode}>
          <Translate id='liveCode.showInCode'>Show in code</Translate>
        </button>
        <button className='preview-error-footer-btn' type='button' onClick={onReset}>
          <Translate id='liveCode.reset'>Reset</Translate>
        </button>
      </div>
    </div>
  );
};

PreviewErrorFooter.displayName = 'PreviewErrorFooter';

export default PreviewErrorFooter;
