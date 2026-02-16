import { ErrorState } from './types';

/** Best-effort extraction of error name, message, line and column from a react-live error string. */
export function parseErrorString(raw: string): Omit<ErrorState, 'hasError' | 'timestamp'> {
  let errorName = 'Error';
  let errorMessage = raw;
  let stack = '';
  let line: number | null = null;
  let column: number | null = null;

  // Separate first line (message) from stack trace
  const nlIdx = raw.indexOf('\n');
  const firstLine = nlIdx > -1 ? raw.slice(0, nlIdx) : raw;
  stack = nlIdx > -1 ? raw.slice(nlIdx + 1) : '';

  // Parse "ErrorType: message"
  const colonIdx = firstLine.indexOf(':');
  if (colonIdx > 0 && colonIdx < 30 && /^[A-Z]\w*Error$/.test(firstLine.slice(0, colonIdx))) {
    errorName = firstLine.slice(0, colonIdx);
    errorMessage = firstLine.slice(colonIdx + 1).trim();
  } else {
    errorMessage = firstLine;
  }

  // Best-effort line/column from message like "(1:15)" or "line 3" or stack frames
  const lineColMatch = raw.match(/\((\d+):(\d+)\)/) || raw.match(/(\d+):(\d+)/);
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    column = parseInt(lineColMatch[2], 10);
  } else {
    const lineOnlyMatch = raw.match(/line\s+(\d+)/i);
    if (lineOnlyMatch) {
      line = parseInt(lineOnlyMatch[1], 10);
    }
  }

  return { errorName, errorMessage, stack, line, column };
}

/** Maps an error string to a short, human-readable footer message. */
export function getPreviewErrorMessage(errorString: string): string {
  const parsed = parseErrorString(errorString);
  const name = parsed.errorName;

  switch (name) {
    case 'SyntaxError':
      return 'Syntax error. Preview not updated.';
    case 'ReferenceError':
      return 'Reference error (possible typo or missing import). Preview may be stale.';
    case 'TypeError':
      return 'Type error at runtime. Preview may be stale.';
    case 'RangeError':
      return 'Runtime error. Preview may be stale.';
    case 'ChunkLoadError':
      return 'Failed to load demo code. Try resetting.';
    default:
      if (/load|chunk/i.test(name) || /load|chunk/i.test(parsed.errorMessage)) {
        return 'Failed to load demo code. Try resetting.';
      }
      return 'Runtime error. Preview may be stale.';
  }
}
