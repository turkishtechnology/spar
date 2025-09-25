import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState, useRef } from 'react';
import { Textarea } from '../Textarea';

describe('Textarea Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Integration', () => {
    it('should integrate with forms correctly', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Textarea name='feedback' aria-label='Feedback' />
          <button type='submit'>Submit</button>
        </form>,
      );

      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button');

      await user.type(textarea, 'User feedback');
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
      expect(textarea).toHaveValue('User feedback');
    });

    it('should work with form validation', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Textarea name='feedback' aria-label='Feedback' isRequired minLength={10} />
          <button type='submit'>Submit</button>
        </form>,
      );

      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button');

      // Submit with invalid input
      await user.type(textarea, 'short');
      await user.click(submitButton);

      // Check if form validation is triggered by checking required attribute
      expect(textarea).toHaveAttribute('required');
      expect(textarea).toHaveAttribute('minlength', '10');
    });

    it('should support form data extraction', async () => {
      const user = userEvent.setup();
      let formData: FormData | null = null;

      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formData = new FormData(e.currentTarget);
      };

      render(
        <form onSubmit={handleSubmit}>
          <Textarea name='comments' aria-label='Comments' />
          <button type='submit'>Submit</button>
        </form>,
      );

      const textarea = screen.getByRole('textbox');
      const submitButton = screen.getByRole('button');

      await user.type(textarea, 'Form data test');
      await user.click(submitButton);

      expect(formData).toBeDefined();
      expect(formData!.get('comments')).toBe('Form data test');
    });

    it('should work with form reset', async () => {
      const user = userEvent.setup();

      const FormWithReset = () => {
        const [value, setValue] = useState('Initial value');

        const handleReset = () => {
          setValue('Initial value');
        };

        return (
          <form>
            <Textarea
              name='comments'
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label='Comments'
            />
            <button type='button' onClick={handleReset}>
              Reset
            </button>
          </form>
        );
      };

      render(<FormWithReset />);

      const textarea = screen.getByRole('textbox');
      const resetButton = screen.getByRole('button');

      await user.clear(textarea);
      await user.type(textarea, 'New value');
      expect(textarea).toHaveValue('New value');

      await user.click(resetButton);
      expect(textarea).toHaveValue('Initial value');
    });

    it('should work with controlled form state', async () => {
      const user = userEvent.setup();

      const ControlledForm = () => {
        const [values, setValues] = useState({ feedback: '' });

        const handleChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setValues((prev) => ({ ...prev, [field]: e.target.value }));
        };

        return (
          <form>
            <Textarea
              value={values.feedback}
              onChange={handleChange('feedback')}
              aria-label='Feedback'
            />
            <div data-testid='value-display'>{values.feedback}</div>
          </form>
        );
      };

      render(<ControlledForm />);

      const textarea = screen.getByRole('textbox');
      const display = screen.getByTestId('value-display');

      await user.type(textarea, 'Controlled input');

      expect(display).toHaveTextContent('Controlled input');
      expect(textarea).toHaveValue('Controlled input');
    });
  });

  describe('Validation Integration', () => {
    it('should work with custom validation', async () => {
      const user = userEvent.setup();

      const ValidatedTextarea = () => {
        const [value, setValue] = useState('');
        const [error, setError] = useState('');

        const validate = (val: string) => {
          if (val.length < 5) {
            setError('Minimum 5 characters required');
          } else if (val.includes('badword')) {
            setError('Contains inappropriate content');
          } else {
            setError('');
          }
        };

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const newValue = e.target.value;
          setValue(newValue);
          validate(newValue);
        };

        return (
          <Textarea
            value={value}
            onChange={handleChange}
            errorMessage={error}
            isInvalid={!!error}
            aria-label='Comments'
          />
        );
      };

      render(<ValidatedTextarea />);

      const textarea = screen.getByRole('textbox');

      // Test short input
      await user.type(textarea, 'hi');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');

      // Test valid input
      await user.clear(textarea);
      await user.type(textarea, 'valid input');
      await waitFor(() => {
        expect(textarea).not.toHaveAttribute('aria-invalid', 'true');
      });

      // Test invalid content
      await user.clear(textarea);
      await user.type(textarea, 'this contains badword');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('should work with validation libraries pattern', async () => {
      const user = userEvent.setup();

      // Simulate a validation library pattern
      const useValidation = (value: string) => {
        const [errors, setErrors] = useState<string[]>([]);

        React.useEffect(() => {
          const newErrors: string[] = [];
          if (!value) newErrors.push('Field is required');
          if (value.length < 10) newErrors.push('Minimum 10 characters');
          if (value.length > 500) newErrors.push('Maximum 500 characters');
          setErrors(newErrors);
        }, [value]);

        return { errors, isValid: errors.length === 0 };
      };

      const ValidatedComponent = () => {
        const [value, setValue] = useState('');
        const { errors, isValid } = useValidation(value);

        return (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            validationErrors={errors}
            isInvalid={!isValid}
            aria-label='Feedback'
          />
        );
      };

      render(<ValidatedComponent />);

      const textarea = screen.getByRole('textbox');

      // Test empty state
      expect(textarea).toHaveAttribute('aria-invalid', 'true');

      // Test partial input
      await user.type(textarea, 'short');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');

      // Test valid input
      await user.clear(textarea);
      await user.type(textarea, 'This is a sufficiently long input to pass validation');
      await waitFor(() => {
        expect(textarea).toHaveAttribute('aria-invalid', 'false');
      });
    });

    it('should trigger validation on blur', async () => {
      const user = userEvent.setup();
      const handleInvalid = jest.fn();

      render(
        <Textarea
          validationErrors={['Required field']}
          onInvalid={handleInvalid}
          aria-label='Comments'
        />,
      );

      const textarea = screen.getByRole('textbox');

      await user.click(textarea);
      await user.tab(); // Trigger blur

      expect(handleInvalid).toHaveBeenCalledWith(['Required field']);
    });
  });

  describe('State Management', () => {
    it('should work with external state management', async () => {
      const user = userEvent.setup();

      // Simulate a state management pattern
      const StateManager = () => {
        const [globalState, setGlobalState] = useState({
          comments: '',
          isEditing: false,
        });

        const updateComments = (value: string) => {
          setGlobalState((prev) => ({ ...prev, comments: value }));
        };

        const toggleEditing = () => {
          setGlobalState((prev) => ({ ...prev, isEditing: !prev.isEditing }));
        };

        return (
          <div>
            <Textarea
              value={globalState.comments}
              onChange={(e) => updateComments(e.target.value)}
              isReadOnly={!globalState.isEditing}
              aria-label='Comments'
            />
            <button onClick={toggleEditing}>{globalState.isEditing ? 'Save' : 'Edit'}</button>
            <div data-testid='state-display'>
              {globalState.comments} - {globalState.isEditing ? 'Editing' : 'Viewing'}
            </div>
          </div>
        );
      };

      render(<StateManager />);

      const textarea = screen.getByRole('textbox');
      const toggleButton = screen.getByRole('button');
      const stateDisplay = screen.getByTestId('state-display');

      // Initially readonly
      expect(textarea).toHaveAttribute('readonly');

      // Enable editing
      await user.click(toggleButton);
      expect(textarea).not.toHaveAttribute('readonly');

      // Type content
      await user.type(textarea, 'New comment');
      expect(stateDisplay).toHaveTextContent('New comment - Editing');

      // Disable editing
      await user.click(toggleButton);
      expect(textarea).toHaveAttribute('readonly');
      expect(stateDisplay).toHaveTextContent('New comment - Viewing');
    });

    it('should sync with multiple state sources', async () => {
      const user = userEvent.setup();

      const MultiSyncComponent = () => {
        const [localValue, setLocalValue] = useState('');
        const [syncedValue, setSyncedValue] = useState('');
        const [autoSave, setAutoSave] = useState(false);

        // Simulate auto-save functionality
        React.useEffect(() => {
          if (autoSave && localValue !== syncedValue) {
            const timer = setTimeout(() => {
              setSyncedValue(localValue);
            }, 500);
            return () => clearTimeout(timer);
          }
          return undefined;
        }, [localValue, syncedValue, autoSave]);

        return (
          <div>
            <Textarea
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              aria-label='Comments'
            />
            <button onClick={() => setAutoSave(!autoSave)}>
              Auto-save: {autoSave ? 'ON' : 'OFF'}
            </button>
            <div data-testid='local-value'>Local: {localValue}</div>
            <div data-testid='synced-value'>Synced: {syncedValue}</div>
          </div>
        );
      };

      render(<MultiSyncComponent />);

      const textarea = screen.getByRole('textbox');
      const autoSaveButton = screen.getByRole('button');
      const localDisplay = screen.getByTestId('local-value');
      const syncedDisplay = screen.getByTestId('synced-value');

      // Type content
      await user.type(textarea, 'Test content');
      expect(localDisplay).toHaveTextContent('Local: Test content');
      expect(syncedDisplay).toHaveTextContent('Synced:');

      // Enable auto-save
      await user.click(autoSaveButton);

      // Wait for auto-save
      await waitFor(
        () => {
          expect(syncedDisplay).toHaveTextContent('Synced: Test content');
        },
        { timeout: 1000 },
      );
    });
  });

  describe('Event Propagation', () => {
    it('should handle event propagation correctly', async () => {
      const user = userEvent.setup();
      const parentHandler = jest.fn();
      const textareaHandler = jest.fn();

      render(
        <div onClick={parentHandler} data-testid='parent'>
          <Textarea onClick={textareaHandler} aria-label='Comments' />
        </div>,
      );

      const textarea = screen.getByRole('textbox');

      await user.click(textarea);

      expect(textareaHandler).toHaveBeenCalled();
      expect(parentHandler).toHaveBeenCalled();
    });

    it('should support event delegation patterns', async () => {
      const user = userEvent.setup();
      const delegatedHandler = jest.fn();

      const handleDelegatedEvent = (e: React.FormEvent<HTMLFormElement>) => {
        if (e.target instanceof HTMLTextAreaElement) {
          delegatedHandler(e.target.value);
        }
      };

      render(
        <form onChange={handleDelegatedEvent}>
          <Textarea name='comments' aria-label='Comments' />
          <Textarea name='feedback' aria-label='Feedback' />
        </form>,
      );

      const commentsTextarea = screen.getByLabelText('Comments');
      const feedbackTextarea = screen.getByLabelText('Feedback');

      await user.type(commentsTextarea, 'comment');
      await user.type(feedbackTextarea, 'feedback');

      expect(delegatedHandler).toHaveBeenCalledWith('comment');
      expect(delegatedHandler).toHaveBeenCalledWith('feedback');
    });
  });

  describe('Async Operations', () => {
    it('should work with async operations', async () => {
      const user = userEvent.setup();
      const mockApiCall = jest.fn().mockResolvedValue({ success: true });

      const AsyncComponent = () => {
        const [value, setValue] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [saved, setSaved] = useState(false);

        const handleSave = async () => {
          setIsLoading(true);
          try {
            await mockApiCall(value);
            setSaved(true);
          } finally {
            setIsLoading(false);
          }
        };

        return (
          <div>
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              isDisabled={isLoading}
              aria-label='Comments'
            />
            <button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            {saved && <div data-testid='saved'>Saved!</div>}
          </div>
        );
      };

      render(<AsyncComponent />);

      const textarea = screen.getByRole('textbox');
      const saveButton = screen.getByRole('button');

      await user.type(textarea, 'Async content');
      await user.click(saveButton);

      // Check that operation started and async state is handled
      await waitFor(() => {
        expect(mockApiCall).toHaveBeenCalledWith('Async content');
      });

      await waitFor(() => {
        expect(screen.getByTestId('saved')).toBeInTheDocument();
      });

      expect(mockApiCall).toHaveBeenCalledWith('Async content');
      expect(textarea).not.toBeDisabled();
    });

    it('should handle debounced operations', async () => {
      const user = userEvent.setup();
      const debouncedCallback = jest.fn();

      const DebouncedComponent = () => {
        const [value, setValue] = useState('');

        // Simple debounce implementation
        React.useEffect(() => {
          const timer = setTimeout(() => {
            if (value) {
              debouncedCallback(value);
            }
          }, 300);

          return () => clearTimeout(timer);
        }, [value]);

        return (
          <Textarea value={value} onChange={(e) => setValue(e.target.value)} aria-label='Search' />
        );
      };

      render(<DebouncedComponent />);

      const textarea = screen.getByRole('textbox');

      await user.type(textarea, 'debounced');

      // Should not call immediately
      expect(debouncedCallback).not.toHaveBeenCalled();

      // Should call after debounce delay
      await waitFor(
        () => {
          expect(debouncedCallback).toHaveBeenCalledWith('debounced');
        },
        { timeout: 500 },
      );
    });
  });

  describe('Real-world Scenarios', () => {
    it('should work in a comment system', async () => {
      const user = userEvent.setup();

      const CommentSystem = () => {
        const [comments, setComments] = useState<string[]>([]);
        const [newComment, setNewComment] = useState('');
        const [charCount, setCharCount] = useState(0);
        const maxLength = 280;

        const addComment = () => {
          if (newComment.trim() && newComment.length <= maxLength) {
            setComments((prev) => [...prev, newComment]);
            setNewComment('');
            setCharCount(0);
          }
        };

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value;
          setNewComment(value);
          setCharCount(value.length);
        };

        return (
          <div>
            <div data-testid='comments'>
              {comments.map((comment, index) => (
                <div key={index}>{comment}</div>
              ))}
            </div>
            <Textarea
              value={newComment}
              onChange={handleChange}
              maxLength={maxLength}
              placeholder='Write a comment...'
              aria-label='New comment'
              helperText={`${charCount}/${maxLength} characters`}
            />
            <button onClick={addComment} disabled={!newComment.trim() || charCount > maxLength}>
              Post Comment
            </button>
          </div>
        );
      };

      render(<CommentSystem />);

      const textarea = screen.getByRole('textbox');
      const postButton = screen.getByRole('button');
      const commentsContainer = screen.getByTestId('comments');

      await user.type(textarea, 'This is my first comment!');
      await user.click(postButton);

      expect(commentsContainer).toHaveTextContent('This is my first comment!');
      expect(textarea).toHaveValue('');

      await user.type(textarea, 'Second comment here.');
      await user.click(postButton);

      expect(commentsContainer).toHaveTextContent('This is my first comment!');
      expect(commentsContainer).toHaveTextContent('Second comment here.');
    });

    it('should work in a rich text editor setup', async () => {
      const user = userEvent.setup();

      const RichTextEditor = () => {
        const [content, setContent] = useState('');
        const [mode, setMode] = useState<'edit' | 'preview'>('edit');
        const textareaRef = useRef<HTMLTextAreaElement>(null);

        const insertText = (text: string) => {
          if (textareaRef.current) {
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            const newContent = content.substring(0, start) + text + content.substring(end);
            setContent(newContent);

            // Restore cursor position
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.selectionStart = start + text.length;
                textareaRef.current.selectionEnd = start + text.length;
                textareaRef.current.focus();
              }
            }, 0);
          }
        };

        return (
          <div>
            <div>
              <button onClick={() => insertText('**bold**')}>Bold</button>
              <button onClick={() => insertText('*italic*')}>Italic</button>
              <button onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}>
                {mode === 'edit' ? 'Preview' : 'Edit'}
              </button>
            </div>
            {mode === 'edit' ? (
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder='Write your content...'
                aria-label='Content editor'
              />
            ) : (
              <div data-testid='preview'>{content}</div>
            )}
          </div>
        );
      };

      render(<RichTextEditor />);

      const textarea = screen.getByRole('textbox');
      const boldButton = screen.getByText('Bold');
      const previewButton = screen.getByText('Preview');

      await user.type(textarea, 'This is ');
      await user.click(boldButton);
      await user.type(textarea, ' text.');

      expect(textarea).toHaveValue('This is **bold** text.');

      await user.click(previewButton);
      const preview = screen.getByTestId('preview');
      expect(preview).toHaveTextContent('This is **bold** text.');
    });
  });
});
