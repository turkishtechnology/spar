import '@testing-library/jest-dom';

// =============================================================================
// JSDOM Polyfills
// =============================================================================

/**
 * Polyfill for HTMLFormElement.prototype.requestSubmit
 * JSDOM doesn't implement this method which is used by form submissions
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit
 */
if (typeof HTMLFormElement.prototype.requestSubmit !== 'function') {
  HTMLFormElement.prototype.requestSubmit = function (submitter?: HTMLElement) {
    if (submitter) {
      // Validate submitter is associated with this form
      if (!(submitter instanceof HTMLButtonElement) && !(submitter instanceof HTMLInputElement)) {
        throw new TypeError(
          "The specified element is not a submit button or is not a member of this form's elements.",
        );
      }
      const form = (submitter as HTMLButtonElement | HTMLInputElement).form;
      if (form !== this) {
        throw new DOMException(
          'The specified element is not owned by this form element.',
          'NotFoundError',
        );
      }
    }

    // Dispatch submit event
    const submitEvent = new Event('submit', {
      bubbles: true,
      cancelable: true,
    });
    const notCanceled = this.dispatchEvent(submitEvent);
    if (notCanceled) {
      this.submit();
    }
  };
}

/**
 * Polyfill for HTMLElement.prototype.scrollIntoView
 * JSDOM doesn't implement this method. Components (DropdownMenu, Select) call it to
 * keep the highlighted item visible during keyboard navigation, and tests spy on it.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
 */
if (typeof HTMLElement.prototype.scrollIntoView !== 'function') {
  HTMLElement.prototype.scrollIntoView = function scrollIntoView() {};
}

// =============================================================================
// Console Warning Filters
// =============================================================================

// Store the original console.error
// eslint-disable-next-line no-console
const originalConsoleError = console.error;

/**
 * Patterns for console.error messages to suppress in tests
 * These are known JSDOM limitations or expected behaviors that don't indicate actual problems
 */
const SUPPRESSED_ERROR_PATTERNS = [
  // React act() warnings from Floating UI internals using flushSync
  'inside a test was not wrapped in act',
  'The current testing environment is not configured to support act',
  // JSDOM navigation limitation - doesn't support full page navigation
  'Not implemented: navigation (except hash changes)',
  // JSDOM form submission limitation (covered by polyfill but may still appear)
  'Not implemented: HTMLFormElement.prototype.requestSubmit',
];

/**
 * Filter out known JSDOM limitations and expected warnings from console.error
 * These warnings are expected in the JSDOM environment and don't indicate actual problems
 */
// eslint-disable-next-line no-console
console.error = (...args: unknown[]) => {
  const message = args[0];

  // Check if the message matches any suppressed pattern (string format)
  if (typeof message === 'string') {
    const shouldSuppress = SUPPRESSED_ERROR_PATTERNS.some((pattern) => message.includes(pattern));
    if (shouldSuppress) {
      return;
    }
  }

  // Check Error objects (JSDOM throws Error objects for not-implemented features)
  if (message instanceof Error && message.message) {
    const shouldSuppress = SUPPRESSED_ERROR_PATTERNS.some((pattern) =>
      message.message.includes(pattern),
    );
    if (shouldSuppress) {
      return;
    }
  }

  // Also check stringified version of all arguments (catches formatted error messages)
  const fullMessage = args
    .map((arg) => {
      if (arg instanceof Error) return arg.message;
      if (typeof arg === 'string') return arg;
      try {
        return String(arg);
      } catch {
        return '';
      }
    })
    .join(' ');

  const shouldSuppressFull = SUPPRESSED_ERROR_PATTERNS.some((pattern) =>
    fullMessage.includes(pattern),
  );
  if (shouldSuppressFull) {
    return;
  }

  originalConsoleError(...args);
};
