import { useRef, useEffect, useContext } from 'react';
import { LiveProvider, LivePreview, LiveContext } from 'react-live';

interface SnapshotPreviewProps {
  /** Callback invoked when a successful render occurs */
  onHasRendered: () => void;
  /** The scope object containing available components for react-live */
  scope: Record<string, unknown>;
}

/**
 * Captures and displays the last successfully rendered preview.
 * When an error occurs, shows the snapshot of the last working state.
 */
export const SnapshotPreview = ({ onHasRendered, scope }: SnapshotPreviewProps) => {
  const { error, code } = useContext(LiveContext);
  const lastGoodCodeRef = useRef<string>('');
  const hasCalledRenderedRef = useRef(false);

  // Track the last code that compiled without errors
  // Only call onHasRendered once per successful compilation to avoid infinite loops
  useEffect(() => {
    if (!error && code) {
      lastGoodCodeRef.current = code;
      if (!hasCalledRenderedRef.current) {
        hasCalledRenderedRef.current = true;
        onHasRendered();
      }
    }
  }, [error, code, onHasRendered]);

  const showSnapshot = !!error && !!lastGoodCodeRef.current;

  return (
    <>
      {!error && <LivePreview className='live-preview' />}
      {showSnapshot && (
        <LiveProvider code={lastGoodCodeRef.current} scope={scope} noInline={false}>
          <LivePreview className='live-preview live-preview-snapshot' />
        </LiveProvider>
      )}
    </>
  );
};

SnapshotPreview.displayName = 'SnapshotPreview';

export default SnapshotPreview;
