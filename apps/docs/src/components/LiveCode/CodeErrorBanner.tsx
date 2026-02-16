import { useState, useRef, useEffect, useContext } from 'react';
import { LiveContext } from 'react-live';
import Translate from '@docusaurus/Translate';
import { parseErrorString } from './utils';
import { ErrorIcon, CopyIcon, CloseIcon, CheckIcon } from './icons';

interface CodeErrorBannerProps {
  /** Callback invoked when the user clicks the copy button */
  onCopy: (errorName: string, errorMessage: string, stack: string) => void;
  /** Callback invoked when the banner is dismissed */
  onDismiss: () => void;
}

/**
 * Displays a dismissible error banner at the top of the code panel.
 * Shows error details with copy and dismiss actions.
 */
export const CodeErrorBanner = ({ onCopy, onDismiss }: CodeErrorBannerProps) => {
  const { error } = useContext(LiveContext);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const prevError = useRef(error);

  // Reset states when error changes so banner reappears for new errors
  useEffect(() => {
    if (error !== prevError.current) {
      prevError.current = error;
      setIsDismissed(false);
      setIsCopied(false);
    }
  }, [error]);

  if (!error || isDismissed) return null;

  const parsed = parseErrorString(error);
  const errorState = { hasError: true as const, ...parsed, timestamp: 0 };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss();
  };

  const handleCopy = () => {
    onCopy(errorState.errorName, errorState.errorMessage, errorState.stack);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className='code-error-banner' role='alert'>
      <span className='code-error-banner-icon'>
        <ErrorIcon size={14} />
      </span>
      <span className='code-error-banner-text'>
        <strong>{errorState.errorName}:</strong> {errorState.errorMessage}
      </span>
      <div className='code-error-banner-actions'>
        <button
          className={`code-error-banner-btn${isCopied ? ' copied' : ''}`}
          type='button'
          onClick={handleCopy}
          title={isCopied ? 'Copied' : 'Copy error'}
          aria-label={isCopied ? 'Copied' : 'Copy error'}
        >
          {isCopied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
          {isCopied ? (
            <Translate id='liveCode.copied'>Copied</Translate>
          ) : (
            <Translate id='liveCode.copy'>Copy</Translate>
          )}
        </button>
        <button
          className='code-error-banner-btn code-error-banner-dismiss'
          type='button'
          onClick={handleDismiss}
          title='Dismiss'
          aria-label='Dismiss error'
        >
          <CloseIcon size={12} />
        </button>
      </div>
    </div>
  );
};

CodeErrorBanner.displayName = 'CodeErrorBanner';

export default CodeErrorBanner;
