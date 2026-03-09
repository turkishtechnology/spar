/**
 * Represents a parsed error state from react-live compilation/runtime errors.
 */
export interface ErrorState {
  /** Whether an error is currently present */
  hasError: boolean;
  /** The error type name (e.g., "SyntaxError", "TypeError") */
  errorName: string;
  /** The human-readable error message */
  errorMessage: string;
  /** The full stack trace, if available */
  stack: string;
  /** The line number where the error occurred, if available */
  line: number | null;
  /** The column number where the error occurred, if available */
  column: number | null;
  /** Timestamp when the error was captured */
  timestamp: number;
}
