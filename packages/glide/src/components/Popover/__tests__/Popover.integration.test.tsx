import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverAnchor,
  PopoverPortal,
  PopoverClose,
} from '../Popover';

describe('Popover Integration Tests', () => {
  describe('Real-world Usage Scenarios', () => {
    it('works as a settings menu with form controls', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      const SettingsPopover = () => {
        const [notifications, setNotifications] = useState(true);
        const [theme, setTheme] = useState('light');

        return (
          <PopoverRoot>
            <PopoverTrigger>⚙️ Settings</PopoverTrigger>
            <PopoverContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit({ notifications, theme });
                }}
              >
                <h3>Settings</h3>

                <label>
                  <input
                    type='checkbox'
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                  Enable notifications
                </label>

                <fieldset>
                  <legend>Theme</legend>
                  <label>
                    <input
                      type='radio'
                      name='theme'
                      value='light'
                      checked={theme === 'light'}
                      onChange={(e) => setTheme(e.target.value)}
                    />
                    Light
                  </label>
                  <label>
                    <input
                      type='radio'
                      name='theme'
                      value='dark'
                      checked={theme === 'dark'}
                      onChange={(e) => setTheme(e.target.value)}
                    />
                    Dark
                  </label>
                </fieldset>

                <button type='submit'>Save</button>
                <PopoverClose>Cancel</PopoverClose>
              </form>
            </PopoverContent>
          </PopoverRoot>
        );
      };

      render(<SettingsPopover />);

      // Open settings
      await user.click(screen.getByRole('button', { name: '⚙️ Settings' }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
      });

      // Interact with form controls
      const notificationCheckbox = screen.getByRole('checkbox', { name: 'Enable notifications' });
      expect(notificationCheckbox).toBeChecked();

      await user.click(notificationCheckbox);
      expect(notificationCheckbox).not.toBeChecked();

      const darkThemeRadio = screen.getByRole('radio', { name: 'Dark' });
      await user.click(darkThemeRadio);
      expect(darkThemeRadio).toBeChecked();

      // Submit form
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onSubmit).toHaveBeenCalledWith({
        notifications: false,
        theme: 'dark',
      });
    });

    it('works as a user profile card with actions', async () => {
      const user = userEvent.setup();
      const onFollow = jest.fn();
      const onMessage = jest.fn();
      const onBlock = jest.fn();

      const UserProfilePopover = () => (
        <PopoverRoot>
          <PopoverTrigger asChild>
            <button>
              <img src='/avatar.jpg' alt='John Doe' width={32} height={32} />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <img src='/avatar.jpg' alt='' width={64} height={64} />
              <h3>John Doe</h3>
              <p>@johndoe</p>
              <p>Frontend developer passionate about accessibility and UX.</p>

              <div>
                <button onClick={onFollow}>Follow</button>
                <button onClick={onMessage}>Message</button>
                <button onClick={onBlock}>Block</button>
              </div>

              <PopoverClose>Close</PopoverClose>
            </div>
          </PopoverContent>
        </PopoverRoot>
      );

      render(<UserProfilePopover />);

      // Open profile card
      await user.click(screen.getByRole('button', { name: 'John Doe' }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
      });

      // Interact with action buttons
      await user.click(screen.getByRole('button', { name: 'Follow' }));
      expect(onFollow).toHaveBeenCalled();

      await user.click(screen.getByRole('button', { name: 'Message' }));
      expect(onMessage).toHaveBeenCalled();

      // Close using close button
      await user.click(screen.getByRole('button', { name: 'Close' }));

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'John Doe' })).not.toBeInTheDocument();
      });
    });

    it('works as a complex tooltip with rich content', async () => {
      const user = userEvent.setup();

      const HelpPopover = () => (
        <div>
          <PopoverRoot>
            <PopoverTrigger aria-label='Get help about this feature'>ℹ️</PopoverTrigger>
            <PopoverContent side='top' align='start'>
              <div>
                <h4>Feature Help</h4>
                <p>This feature allows you to:</p>
                <ul>
                  <li>Create new items</li>
                  <li>Edit existing items</li>
                  <li>Delete items you no longer need</li>
                </ul>
                <p>
                  <strong>Tip:</strong> Use keyboard shortcuts for faster navigation.
                </p>
                <a href='/docs' target='_blank' rel='noopener noreferrer'>
                  Learn more in our documentation
                </a>
                <PopoverArrow />
              </div>
            </PopoverContent>
          </PopoverRoot>
        </div>
      );

      render(<HelpPopover />);

      // Open help
      await user.click(screen.getByRole('button', { name: 'Get help about this feature' }));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Feature Help' })).toBeInTheDocument();
      });

      // Verify rich content is accessible
      expect(screen.getByText('This feature allows you to:')).toBeInTheDocument();
      expect(screen.getByText('Create new items')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Learn more in our documentation' }),
      ).toBeInTheDocument();

      // Close by clicking outside
      await user.click(document.body);

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Feature Help' })).not.toBeInTheDocument();
      });
    });

    it('works with custom positioning anchor', async () => {
      const user = userEvent.setup();

      const AnchoredPopover = () => (
        <div style={{ padding: '100px' }}>
          <PopoverRoot>
            <PopoverAnchor>
              <div
                data-testid='anchor'
                style={{ width: '100px', height: '50px', background: 'gray' }}
              >
                Anchor Element
              </div>
            </PopoverAnchor>
            <PopoverTrigger>Open near anchor</PopoverTrigger>
            <PopoverContent>
              <p>This content is positioned relative to the anchor, not the trigger.</p>
            </PopoverContent>
          </PopoverRoot>
        </div>
      );

      render(<AnchoredPopover />);

      await user.click(screen.getByRole('button', { name: 'Open near anchor' }));

      await waitFor(() => {
        expect(
          screen.getByText('This content is positioned relative to the anchor, not the trigger.'),
        ).toBeInTheDocument();
      });

      // Verify anchor element exists
      expect(screen.getByTestId('anchor')).toBeInTheDocument();
    });

    it('works with portal rendering in custom container', async () => {
      const customContainer = document.createElement('div');
      customContainer.id = 'custom-portal';
      document.body.appendChild(customContainer);

      const PortalPopover = () => (
        <PopoverRoot>
          <PopoverTrigger>Open in portal</PopoverTrigger>
          <PopoverPortal container={customContainer}>
            <div data-testid='portal-content'>
              This content is rendered in a custom portal container.
            </div>
          </PopoverPortal>
        </PopoverRoot>
      );

      render(<PortalPopover />);

      // PopoverPortal renders immediately, doesn't depend on popover state
      expect(
        screen.getByText('This content is rendered in a custom portal container.'),
      ).toBeInTheDocument();

      // Verify content is in custom container
      expect(customContainer).toContainElement(screen.getByTestId('portal-content'));

      // Clean up
      document.body.removeChild(customContainer);
    });
  });

  describe('Multi-Component Interactions', () => {
    it('handles multiple popovers on the same page', async () => {
      const user = userEvent.setup();

      const MultiplePopovers = () => (
        <div>
          <PopoverRoot>
            <PopoverTrigger>Open First</PopoverTrigger>
            <PopoverContent>First popover content</PopoverContent>
          </PopoverRoot>

          <PopoverRoot>
            <PopoverTrigger>Open Second</PopoverTrigger>
            <PopoverContent>Second popover content</PopoverContent>
          </PopoverRoot>
        </div>
      );

      render(<MultiplePopovers />);

      // Open first popover
      await user.click(screen.getByRole('button', { name: 'Open First' }));
      await waitFor(() => {
        expect(screen.getByText('First popover content')).toBeInTheDocument();
      });

      // Close first and open second
      await user.click(screen.getByRole('button', { name: 'Open First' }));
      await waitFor(() => {
        expect(screen.queryByText('First popover content')).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Open Second' }));
      await waitFor(() => {
        expect(screen.getByText('Second popover content')).toBeInTheDocument();
      });

      // Close second with escape
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByText('Second popover content')).not.toBeInTheDocument();
      });
    });

    it('handles nested popovers', async () => {
      // Test that nested popover structure can be rendered without errors
      render(
        <PopoverRoot>
          <PopoverTrigger>Open Parent</PopoverTrigger>
          <PopoverContent>
            <p>Parent popover</p>
            <PopoverRoot>
              <PopoverTrigger>Open Child</PopoverTrigger>
              <PopoverContent>
                <p>Child popover</p>
                <PopoverClose>Close Child</PopoverClose>
              </PopoverContent>
            </PopoverRoot>
          </PopoverContent>
        </PopoverRoot>,
      );

      // Verify the structure renders without crashing
      expect(screen.getByRole('button', { name: 'Open Parent' })).toBeInTheDocument();
    });

    it('integrates with form validation', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      const FormWithPopoverValidation = () => {
        const [email, setEmail] = useState('');
        const [emailError, setEmailError] = useState('');
        const [showValidation, setShowValidation] = useState(false);

        const validateEmail = (value: string) => {
          if (!value) {
            setEmailError('Email is required');
            return false;
          }
          if (!value.includes('@')) {
            setEmailError('Email must contain @');
            return false;
          }
          setEmailError('');
          return true;
        };

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          const isValid = validateEmail(email);
          setShowValidation(!isValid);
          if (isValid) {
            onSubmit({ email });
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor='email'>Email:</label>
              <input
                id='email'
                type='text'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                aria-describedby={emailError ? 'email-error' : undefined}
              />

              <PopoverRoot isOpen={showValidation && !!emailError} onOpenChange={setShowValidation}>
                <PopoverTrigger asChild>
                  <span id='email-error' role='alert' aria-live='polite'>
                    {emailError && '⚠️'}
                  </span>
                </PopoverTrigger>
                <PopoverContent>
                  <div>
                    <strong>Validation Error</strong>
                    <p>{emailError}</p>
                    <PopoverClose>Dismiss</PopoverClose>
                  </div>
                </PopoverContent>
              </PopoverRoot>
            </div>

            <button type='submit'>Submit</button>
          </form>
        );
      };

      render(<FormWithPopoverValidation />);

      // Try to submit empty form
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      // Enter invalid email
      await user.type(screen.getByLabelText('Email:'), 'invalid-email');
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByText('Email must contain @')).toBeInTheDocument();
      });

      // Fix email
      await user.clear(screen.getByLabelText('Email:'));
      await user.type(screen.getByLabelText('Email:'), 'valid@email.com');
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({ email: 'valid@email.com' });
      });
    });
  });

  describe('Event Propagation and State Management', () => {
    it('prevents event bubbling when appropriate', async () => {
      const user = userEvent.setup();
      const onContainerClick = jest.fn();

      const EventPropagationTest = () => (
        <div data-testid='container'>
          <PopoverRoot>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent>
              <p>Content</p>
              <div onClick={onContainerClick}>
                <button onClick={(e) => e.stopPropagation()}>Click me (no propagation)</button>
              </div>
              <PopoverClose>Close</PopoverClose>
            </PopoverContent>
          </PopoverRoot>
        </div>
      );

      render(<EventPropagationTest />);

      await user.click(screen.getByRole('button', { name: 'Open' }));

      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });

      // Click button that stops propagation
      await user.click(screen.getByRole('button', { name: 'Click me (no propagation)' }));
      expect(onContainerClick).not.toHaveBeenCalled();

      // Click close button (should close popover)
      await user.click(screen.getByRole('button', { name: 'Close' }));

      await waitFor(() => {
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
      });
    });

    it('handles controlled state changes from external sources', async () => {
      const user = userEvent.setup();

      const ExternallyControlledPopover = () => {
        const [isOpen, setIsOpen] = useState(false);
        const [counter, setCounter] = useState(0);

        return (
          <div>
            <button onClick={() => setIsOpen(!isOpen)}>
              External Toggle ({isOpen ? 'Close' : 'Open'})
            </button>

            <button onClick={() => setCounter((c) => c + 1)}>Increment: {counter}</button>

            <PopoverRoot isOpen={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger>Internal Toggle</PopoverTrigger>
              <PopoverContent>
                <p>Counter value: {counter}</p>
                <button onClick={() => setCounter((c) => c + 1)}>Increment from popover</button>
                <PopoverClose>Close</PopoverClose>
              </PopoverContent>
            </PopoverRoot>
          </div>
        );
      };

      render(<ExternallyControlledPopover />);

      // Open via external control
      await user.click(screen.getByRole('button', { name: 'External Toggle (Open)' }));

      await waitFor(() => {
        expect(screen.getByText('Counter value: 0')).toBeInTheDocument();
      });

      // Show counter outside popover for verification
      expect(screen.getByText('Increment: 0')).toBeInTheDocument();

      // Increment counter from inside popover
      await user.click(screen.getByRole('button', { name: 'Increment from popover' }));
      expect(screen.getByText('Counter value: 1')).toBeInTheDocument();

      // Verify external counter also updated
      await waitFor(() => {
        expect(screen.getByText('Increment: 1')).toBeInTheDocument();
      });

      // Close via PopoverClose button instead of external toggle
      await user.click(screen.getByRole('button', { name: 'Close' }));

      await waitFor(() => {
        expect(screen.queryByText('Counter value: 1')).not.toBeInTheDocument();
      });
    });

    it('handles rapid open/close operations', async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();

      render(
        <PopoverRoot onOpenChange={onOpenChange}>
          <PopoverTrigger>Toggle</PopoverTrigger>
          <PopoverContent>
            <p>Content</p>
            <PopoverClose>Close</PopoverClose>
          </PopoverContent>
        </PopoverRoot>,
      );

      const trigger = screen.getByRole('button', { name: 'Toggle' });

      // Rapidly click trigger
      await user.click(trigger);
      await user.click(trigger);
      await user.click(trigger);
      await user.click(trigger);

      // Should handle rapid clicks gracefully
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalled();
      });

      // Final state should be consistent
      const isOpen = onOpenChange.mock.calls[onOpenChange.mock.calls.length - 1][0];
      if (isOpen) {
        expect(screen.getByText('Content')).toBeInTheDocument();
      } else {
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
      }
    });
  });

  describe('Async Operations', () => {
    it('handles async content loading', async () => {
      const user = userEvent.setup();

      const AsyncPopover = () => {
        const [isLoading, setIsLoading] = useState(false);
        const [data, setData] = useState<string | null>(null);

        const loadData = async () => {
          setIsLoading(true);
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 100));
          setData('Async content loaded!');
          setIsLoading(false);
        };

        return (
          <PopoverRoot>
            <PopoverTrigger onClick={loadData}>Load Data</PopoverTrigger>
            <PopoverContent>
              {isLoading ? (
                <p>Loading...</p>
              ) : data ? (
                <p>{data}</p>
              ) : (
                <p>Click trigger to load data</p>
              )}
              <PopoverClose>Close</PopoverClose>
            </PopoverContent>
          </PopoverRoot>
        );
      };

      render(<AsyncPopover />);

      await user.click(screen.getByRole('button', { name: 'Load Data' }));

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });

      // Should show loaded content
      await waitFor(
        () => {
          expect(screen.getByText('Async content loaded!')).toBeInTheDocument();
        },
        { timeout: 200 },
      );
    });

    it('handles cleanup when unmounted while open', async () => {
      const user = userEvent.setup();

      const UnmountablePopover = ({ show }: { show: boolean }) => {
        if (!show) return null;

        return (
          <PopoverRoot defaultOpen={true}>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent>
              <p>Content that will be unmounted</p>
            </PopoverContent>
          </PopoverRoot>
        );
      };

      const TestWrapper = () => {
        const [showPopover, setShowPopover] = useState(true);

        return (
          <div>
            <button onClick={() => setShowPopover(!showPopover)}>
              {showPopover ? 'Unmount' : 'Mount'} Popover
            </button>
            <UnmountablePopover show={showPopover} />
          </div>
        );
      };

      render(<TestWrapper />);

      // Verify popover is mounted and open
      await waitFor(() => {
        expect(screen.getByText('Content that will be unmounted')).toBeInTheDocument();
      });

      // Unmount while open
      await user.click(screen.getByRole('button', { name: 'Unmount Popover' }));

      // Should not crash and content should be gone
      expect(screen.queryByText('Content that will be unmounted')).not.toBeInTheDocument();
    });
  });
});

describe('Edge Cases and Uncovered Code Paths', () => {
  describe('Positioning Edge Cases', () => {
    it('covers right positioning and end alignment combinations', async () => {
      const user = userEvent.setup();

      const PositioningTest = () => (
        <div style={{ padding: '200px', width: '800px', height: '600px' }}>
          <PopoverRoot>
            <PopoverTrigger style={{ position: 'absolute', left: '100px', top: '100px' }}>
              Right + End
            </PopoverTrigger>
            <PopoverContent side='right' align='end'>
              <div style={{ width: '150px', height: '100px' }}>
                Content positioned to the right with end alignment
              </div>
            </PopoverContent>
          </PopoverRoot>

          <PopoverRoot>
            <PopoverTrigger style={{ position: 'absolute', left: '400px', top: '300px' }}>
              Bottom + End
            </PopoverTrigger>
            <PopoverContent side='bottom' align='end'>
              <div style={{ width: '150px', height: '80px' }}>
                Content positioned bottom with end alignment
              </div>
            </PopoverContent>
          </PopoverRoot>

          <PopoverRoot>
            <PopoverTrigger style={{ position: 'absolute', left: '600px', top: '200px' }}>
              Left + End
            </PopoverTrigger>
            <PopoverContent side='left' align='end'>
              <div style={{ width: '120px', height: '60px' }}>
                Content positioned left with end alignment
              </div>
            </PopoverContent>
          </PopoverRoot>
        </div>
      );

      render(<PositioningTest />);

      // Test right positioning (covers line 167-168)
      await user.click(screen.getByRole('button', { name: 'Right + End' }));
      await waitFor(() => {
        const content = screen.getByText('Content positioned to the right with end alignment');
        expect(content).toBeInTheDocument();
        expect(content.closest('[data-side="right"]')).toBeInTheDocument();
        expect(content.closest('[data-align="end"]')).toBeInTheDocument();
      });

      // Test bottom + end alignment (covers lines 189-191)
      await user.click(screen.getByRole('button', { name: 'Bottom + End' }));
      await waitFor(() => {
        const content = screen.getByText('Content positioned bottom with end alignment');
        expect(content).toBeInTheDocument();
        expect(content.closest('[data-side="bottom"]')).toBeInTheDocument();
        expect(content.closest('[data-align="end"]')).toBeInTheDocument();
      });

      // Test left + end alignment (covers lines 192-194)
      await user.click(screen.getByRole('button', { name: 'Left + End' }));
      await waitFor(() => {
        const content = screen.getByText('Content positioned left with end alignment');
        expect(content).toBeInTheDocument();
        expect(content.closest('[data-side="left"]')).toBeInTheDocument();
        expect(content.closest('[data-align="end"]')).toBeInTheDocument();
      });
    });
  });

  describe('Function Ref Handling', () => {
    it('handles function refs for PopoverTrigger', async () => {
      const triggerRefCallback = jest.fn();
      const user = userEvent.setup();

      render(
        <PopoverRoot>
          <PopoverTrigger ref={triggerRefCallback}>Trigger with function ref</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      await user.click(screen.getByRole('button', { name: 'Trigger with function ref' }));

      // Function ref should be called with the element (covers lines 305, 307)
      expect(triggerRefCallback).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
    });

    it('handles function refs for PopoverContent', async () => {
      const contentRefCallback = jest.fn();

      render(
        <PopoverRoot defaultOpen>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent ref={contentRefCallback}>Content with function ref</PopoverContent>
        </PopoverRoot>,
      );

      await waitFor(() => {
        expect(screen.getByText('Content with function ref')).toBeInTheDocument();
      });

      // Function ref should be called with the element (covers lines 561, 563)
      expect(contentRefCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it('handles function refs for PopoverAnchor', () => {
      const anchorRefCallback = jest.fn();

      render(
        <PopoverRoot>
          <PopoverAnchor ref={anchorRefCallback}>
            <div>Anchor with function ref</div>
          </PopoverAnchor>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>,
      );

      // Function ref should be called with the element (covers lines 622, 624)
      expect(anchorRefCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it('handles function refs with asChild pattern', async () => {
      const triggerRefCallback = jest.fn();
      const contentRefCallback = jest.fn();
      const anchorRefCallback = jest.fn();

      render(
        <PopoverRoot defaultOpen>
          <PopoverAnchor asChild ref={anchorRefCallback}>
            <span>Custom anchor</span>
          </PopoverAnchor>
          <PopoverTrigger asChild ref={triggerRefCallback}>
            <button>Custom trigger</button>
          </PopoverTrigger>
          <PopoverContent ref={contentRefCallback}>Custom content</PopoverContent>
        </PopoverRoot>,
      );

      await waitFor(() => {
        expect(screen.getByText('Custom content')).toBeInTheDocument();
      });

      // All function refs should be called correctly
      expect(anchorRefCallback).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
      expect(triggerRefCallback).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
      expect(contentRefCallback).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  describe('Complex Positioning Scenarios', () => {
    it('covers all alignment cases for vertical sides', async () => {
      const user = userEvent.setup();

      render(
        <div style={{ padding: '100px' }}>
          <PopoverRoot>
            <PopoverTrigger style={{ position: 'absolute', left: '300px', top: '200px' }}>
              Test All Alignments
            </PopoverTrigger>
            <PopoverContent side='top' align='end'>
              <div style={{ width: '200px', height: '100px' }}>Top + End alignment content</div>
            </PopoverContent>
          </PopoverRoot>
        </div>,
      );

      await user.click(screen.getByRole('button', { name: 'Test All Alignments' }));

      await waitFor(() => {
        const content = screen.getByText('Top + End alignment content');
        expect(content).toBeInTheDocument();
        // Verify positioning attributes
        expect(content.closest('[data-side="top"]')).toBeInTheDocument();
        expect(content.closest('[data-align="end"]')).toBeInTheDocument();
      });
    });

    it('covers right side positioning logic', async () => {
      const user = userEvent.setup();

      render(
        <div style={{ padding: '50px', position: 'relative' }}>
          <PopoverRoot>
            <PopoverTrigger style={{ position: 'absolute', left: '50px', top: '50px' }}>
              Right Side Test
            </PopoverTrigger>
            <PopoverContent side='right' align='start'>
              <div style={{ width: '100px', height: '50px' }}>Right positioned content</div>
            </PopoverContent>
          </PopoverRoot>
        </div>,
      );

      await user.click(screen.getByRole('button', { name: 'Right Side Test' }));

      await waitFor(() => {
        const content = screen.getByText('Right positioned content');
        expect(content).toBeInTheDocument();
        // Ensure right positioning is applied
        expect(content.closest('[data-side="right"]')).toBeInTheDocument();
      });
    });
  });
});

describe('Ref Object Handling Edge Cases', () => {
  it('handles ref objects (not functions) for all components', async () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    const contentRef = React.createRef<HTMLDivElement>();
    const anchorRef = React.createRef<HTMLDivElement>();

    render(
      <PopoverRoot defaultOpen>
        <PopoverAnchor ref={anchorRef}>
          <div>Anchor with ref object</div>
        </PopoverAnchor>
        <PopoverTrigger ref={triggerRef}>Trigger with ref object</PopoverTrigger>
        <PopoverContent ref={contentRef}>Content with ref object</PopoverContent>
      </PopoverRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Content with ref object')).toBeInTheDocument();
    });

    // Ref objects should be populated (covers lines 307, 563, 624)
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(anchorRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it('covers center alignment for horizontal sides', async () => {
    const user = userEvent.setup();

    render(
      <div style={{ padding: '200px' }}>
        <PopoverRoot>
          <PopoverTrigger style={{ position: 'absolute', left: '300px', top: '200px' }}>
            Center Aligned
          </PopoverTrigger>
          <PopoverContent side='left' align='center'>
            <div style={{ width: '120px', height: '80px' }}>Left + Center alignment</div>
          </PopoverContent>
        </PopoverRoot>

        <PopoverRoot>
          <PopoverTrigger style={{ position: 'absolute', left: '500px', top: '300px' }}>
            Right Center
          </PopoverTrigger>
          <PopoverContent side='right' align='center'>
            <div style={{ width: '100px', height: '60px' }}>Right + Center alignment</div>
          </PopoverContent>
        </PopoverRoot>
      </div>,
    );

    // Test left + center alignment (covers lines 191-192)
    await user.click(screen.getByRole('button', { name: 'Center Aligned' }));
    await waitFor(() => {
      const content = screen.getByText('Left + Center alignment');
      expect(content).toBeInTheDocument();
      expect(content.closest('[data-side="left"]')).toBeInTheDocument();
      expect(content.closest('[data-align="center"]')).toBeInTheDocument();
    });

    // Close first popover
    await user.keyboard('{Escape}');

    // Test right + center alignment (also covers lines 191-192)
    await user.click(screen.getByRole('button', { name: 'Right Center' }));
    await waitFor(() => {
      const content = screen.getByText('Right + Center alignment');
      expect(content).toBeInTheDocument();
      expect(content.closest('[data-side="right"]')).toBeInTheDocument();
      expect(content.closest('[data-align="center"]')).toBeInTheDocument();
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
