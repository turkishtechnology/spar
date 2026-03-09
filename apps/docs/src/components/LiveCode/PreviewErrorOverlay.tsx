import { useContext } from 'react';
import { LiveContext } from 'react-live';
import Translate from '@docusaurus/Translate';
import { ErrorIcon, CodeIcon, ResetIcon } from './icons';

interface PreviewErrorOverlayProps {
  /** Whether the preview has successfully rendered at least once */
  hasRenderedOnce: boolean;
  /** Callback to expand the code panel and scroll to it */
  onShowInCode: () => void;
  /** Callback to reset the live code editor to initial state */
  onReset: () => void;
}

/**
 * Full-screen error overlay displayed when preview fails before any successful render.
 * Shows actionable buttons to view error in code or reset the editor.
 */
export const PreviewErrorOverlay = ({
  hasRenderedOnce,
  onShowInCode,
  onReset,
}: PreviewErrorOverlayProps) => {
  const { error } = useContext(LiveContext);

  // No error - nothing to show
  if (!error) return null;

  // Stale preview: footer is rendered outside the canvas (see PreviewErrorFooter)
  if (hasRenderedOnce) return null;

  // Never rendered successfully → full fallback overlay
  return (
    <div className='preview-error-overlay' role='alert'>
      <div className='preview-error-overlay-content'>
        <div className='preview-error-overlay-icon'>
          <ErrorIcon size={20} />
        </div>
        <span className='preview-error-overlay-title'>
          <Translate id='liveCode.previewFailed'>Preview failed</Translate>
        </span>
        <div className='preview-error-overlay-actions'>
          <button className='preview-error-action' type='button' onClick={onShowInCode}>
            <CodeIcon size={14} />
            <Translate id='liveCode.showInCode'>Show in code</Translate>
          </button>
          <button className='preview-error-action' type='button' onClick={onReset}>
            <ResetIcon size={14} />
            <Translate id='liveCode.reset'>Reset</Translate>
          </button>
        </div>
      </div>
    </div>
  );
};

PreviewErrorOverlay.displayName = 'PreviewErrorOverlay';

export default PreviewErrorOverlay;
