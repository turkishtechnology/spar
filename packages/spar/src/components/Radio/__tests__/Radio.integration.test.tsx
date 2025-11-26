import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from '../Radio';

// Helper function to get visible radio buttons (labels, not hidden inputs)
const getVisibleRadio = (name: string) => {
  const radios = screen.getAllByRole('radio', { name });
  return radios.find((radio) => {
    const style = window.getComputedStyle(radio);
    return style.opacity !== '0' && style.pointerEvents !== 'none';
  })!;
};

// Helper function to count visible radio buttons within a specific container
const getVisibleRadioCountInContainer = (container: HTMLElement) => {
  const allRadios = Array.from(container.querySelectorAll('[role="radio"]'));
  return allRadios.filter((radio) => {
    const style = window.getComputedStyle(radio as HTMLElement);
    return style.opacity !== '0' && style.pointerEvents !== 'none';
  }).length;
};

describe('Radio Integration Tests', () => {
  describe('Form Integration', () => {
    it('should integrate with forms correctly for submission', async () => {
      const handleSubmit = jest.fn((e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        return Object.fromEntries(formData);
      });

      const user = userEvent.setup();

      render(
        <form onSubmit={handleSubmit}>
          <Radio.Group name='plan' defaultValue='basic'>
            <Radio.Item value='basic'>Basic Plan</Radio.Item>
            <Radio.Item value='premium'>Premium Plan</Radio.Item>
            <Radio.Item value='enterprise'>Enterprise Plan</Radio.Item>
          </Radio.Group>
          <button type='submit'>Submit</button>
        </form>,
      );

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalled();
    });

    it('should update form data when selection changes', async () => {
      const user = userEvent.setup();
      let formData: FormData | null = null;

      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formData = new FormData(e.target as HTMLFormElement);
      };

      render(
        <form onSubmit={handleSubmit}>
          <Radio.Group name='plan'>
            <Radio.Item value='basic'>Basic Plan</Radio.Item>
            <Radio.Item value='premium'>Premium Plan</Radio.Item>
          </Radio.Group>
          <button type='submit'>Submit</button>
        </form>,
      );

      const basicOption = getVisibleRadio('Basic Plan');
      const premiumOption = getVisibleRadio('Premium Plan');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      // Select basic plan
      await user.click(basicOption);
      await user.click(submitButton);

      expect(formData).not.toBeNull();
      expect(formData!.get('plan')).toBe('basic');

      // Change to premium plan
      await user.click(premiumOption);
      await user.click(submitButton);

      expect(formData).not.toBeNull();
      expect(formData!.get('plan')).toBe('premium');
    });

    it('should work with controlled forms', async () => {
      const user = userEvent.setup();

      const FormWrapper = () => {
        const [selectedPlan, setSelectedPlan] = React.useState('');
        const [submittedPlan, setSubmittedPlan] = React.useState('');

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          setSubmittedPlan(selectedPlan);
        };

        return (
          <div>
            <form onSubmit={handleSubmit}>
              <Radio.Group name='plan' value={selectedPlan} onValueChange={setSelectedPlan}>
                <Radio.Item value='basic'>Basic Plan</Radio.Item>
                <Radio.Item value='premium'>Premium Plan</Radio.Item>
              </Radio.Group>
              <button type='submit'>Submit</button>
            </form>
            <div data-testid='submitted-plan'>{submittedPlan}</div>
          </div>
        );
      };

      render(<FormWrapper />);

      const basicOption = getVisibleRadio('Basic Plan');
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      await user.click(basicOption);
      await user.click(submitButton);

      expect(screen.getByTestId('submitted-plan')).toHaveTextContent('basic');
    });

    it('should work with form validation', async () => {
      const user = userEvent.setup();

      const FormWrapper = () => {
        const [selectedPlan, setSelectedPlan] = React.useState('');
        const [error, setError] = React.useState('');

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!selectedPlan) {
            setError('Please select a plan');
          } else {
            setError('');
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <Radio.Group
              name='plan'
              value={selectedPlan}
              onValueChange={setSelectedPlan}
              aria-describedby={error ? 'error-message' : undefined}
              required
            >
              <Radio.Item value='basic'>Basic Plan</Radio.Item>
              <Radio.Item value='premium'>Premium Plan</Radio.Item>
            </Radio.Group>
            {error && (
              <div id='error-message' role='alert'>
                {error}
              </div>
            )}
            <button type='submit'>Submit</button>
          </form>
        );
      };

      render(<FormWrapper />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });

      // Submit without selection
      await user.click(submitButton);
      expect(screen.getByRole('alert')).toHaveTextContent('Please select a plan');

      // Select option and submit
      const basicOption = getVisibleRadio('Basic Plan');
      await user.click(basicOption);
      await user.click(submitButton);

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Components', () => {
    it('should work with multiple independent radio groups', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Radio.Group name='size' aria-label='Choose size'>
            <Radio.Item value='small'>Small</Radio.Item>
            <Radio.Item value='medium'>Medium</Radio.Item>
            <Radio.Item value='large'>Large</Radio.Item>
          </Radio.Group>

          <Radio.Group name='color' aria-label='Choose color'>
            <Radio.Item value='red'>Red</Radio.Item>
            <Radio.Item value='blue'>Blue</Radio.Item>
            <Radio.Item value='green'>Green</Radio.Item>
          </Radio.Group>
        </div>,
      );

      const sizeSmall = getVisibleRadio('Small');
      const colorRed = getVisibleRadio('Red');

      await user.click(sizeSmall);
      await user.click(colorRed);

      expect(sizeSmall).toHaveAttribute('aria-checked', 'true');
      expect(colorRed).toHaveAttribute('aria-checked', 'true');

      // Each group should function independently
      const sizeMedium = getVisibleRadio('Medium');
      await user.click(sizeMedium);

      expect(sizeMedium).toHaveAttribute('aria-checked', 'true');
      expect(sizeSmall).toHaveAttribute('aria-checked', 'false');
      expect(colorRed).toHaveAttribute('aria-checked', 'true'); // Should remain checked
    });

    it('should work with nested components', async () => {
      const user = userEvent.setup();

      const NestedComponent = () => (
        <div>
          <h3>Preferences</h3>
          <Radio.Group name='notification' aria-label='Notification settings'>
            <Radio.Item value='all'>All notifications</Radio.Item>
            <Radio.Item value='important'>Important only</Radio.Item>
            <Radio.Item value='none'>None</Radio.Item>
          </Radio.Group>
        </div>
      );

      render(
        <div>
          <Radio.Group name='theme' aria-label='Theme selection'>
            <Radio.Item value='light'>Light</Radio.Item>
            <Radio.Item value='dark'>Dark</Radio.Item>
          </Radio.Group>
          <NestedComponent />
        </div>,
      );

      const lightTheme = getVisibleRadio('Light');
      const allNotifications = getVisibleRadio('All notifications');

      await user.click(lightTheme);
      await user.click(allNotifications);

      expect(lightTheme).toHaveAttribute('aria-checked', 'true');
      expect(allNotifications).toHaveAttribute('aria-checked', 'true');
    });

    it('should work with dynamic component rendering', async () => {
      const user = userEvent.setup();

      const DynamicRadioGroup = () => {
        const [showAdditional, setShowAdditional] = React.useState(false);

        return (
          <div>
            <button onClick={() => setShowAdditional(!showAdditional)}>
              Toggle Additional Options
            </button>
            <Radio.Group name='options' aria-label='Available options'>
              <Radio.Item value='option1'>Option 1</Radio.Item>
              <Radio.Item value='option2'>Option 2</Radio.Item>
              {showAdditional && (
                <>
                  <Radio.Item value='option3'>Option 3</Radio.Item>
                  <Radio.Item value='option4'>Option 4</Radio.Item>
                </>
              )}
            </Radio.Group>
          </div>
        );
      };

      const { container } = render(<DynamicRadioGroup />);

      const toggleButton = screen.getByRole('button', { name: 'Toggle Additional Options' });

      // Initially should have 2 options
      expect(getVisibleRadioCountInContainer(container)).toBe(2);

      // Toggle to show additional options
      await user.click(toggleButton);
      expect(getVisibleRadioCountInContainer(container)).toBe(4);

      // Select an additional option
      const option3 = getVisibleRadio('Option 3');
      await user.click(option3);
      expect(option3).toHaveAttribute('aria-checked', 'true');

      // Toggle back to hide additional options
      await user.click(toggleButton);
      expect(getVisibleRadioCountInContainer(container)).toBe(2);
    });
  });

  describe('State Management', () => {
    it('should work with external state management', async () => {
      const user = userEvent.setup();

      const StateManager = () => {
        const [globalState, setGlobalState] = React.useState({
          userPreferences: {
            theme: '',
            language: '',
          },
        });

        const updateTheme = (theme: string) => {
          setGlobalState((prev) => ({
            ...prev,
            userPreferences: {
              ...prev.userPreferences,
              theme,
            },
          }));
        };

        const updateLanguage = (language: string) => {
          setGlobalState((prev) => ({
            ...prev,
            userPreferences: {
              ...prev.userPreferences,
              language,
            },
          }));
        };

        return (
          <div>
            <Radio.Group
              name='theme'
              value={globalState.userPreferences.theme}
              onValueChange={updateTheme}
              aria-label='Theme selection'
            >
              <Radio.Item value='light'>Light</Radio.Item>
              <Radio.Item value='dark'>Dark</Radio.Item>
            </Radio.Group>

            <Radio.Group
              name='language'
              value={globalState.userPreferences.language}
              onValueChange={updateLanguage}
              aria-label='Language selection'
            >
              <Radio.Item value='en'>English</Radio.Item>
              <Radio.Item value='tr'>Turkish</Radio.Item>
            </Radio.Group>

            <div data-testid='current-state'>{JSON.stringify(globalState.userPreferences)}</div>
          </div>
        );
      };

      render(<StateManager />);

      const lightTheme = getVisibleRadio('Light');
      const englishLanguage = getVisibleRadio('English');

      await user.click(lightTheme);
      await user.click(englishLanguage);

      const stateDisplay = screen.getByTestId('current-state');
      expect(stateDisplay).toHaveTextContent('{"theme":"light","language":"en"}');
    });

    it('should handle complex state transitions', async () => {
      const user = userEvent.setup();

      const ComplexStateComponent = () => {
        const [selectedPlan, setSelectedPlan] = React.useState('');
        const [isProcessing, setIsProcessing] = React.useState(false);
        const [confirmationMessage, setConfirmationMessage] = React.useState('');

        const handlePlanChange = async (plan: string) => {
          setIsProcessing(true);
          setSelectedPlan(plan);

          // Simulate async operation
          await new Promise((resolve) => setTimeout(resolve, 100));

          setIsProcessing(false);
          setConfirmationMessage(`Selected ${plan} plan`);
        };

        return (
          <div>
            <Radio.Group
              name='plan'
              value={selectedPlan}
              onValueChange={handlePlanChange}
              disabled={isProcessing}
              aria-label='Plan selection'
            >
              <Radio.Item value='basic'>Basic Plan</Radio.Item>
              <Radio.Item value='premium'>Premium Plan</Radio.Item>
              <Radio.Item value='enterprise'>Enterprise Plan</Radio.Item>
            </Radio.Group>

            {isProcessing && <div data-testid='processing'>Processing...</div>}
            {confirmationMessage && <div data-testid='confirmation'>{confirmationMessage}</div>}
          </div>
        );
      };

      render(<ComplexStateComponent />);

      const basicPlan = getVisibleRadio('Basic Plan');
      await user.click(basicPlan);

      // Should show processing state
      expect(screen.getByTestId('processing')).toBeInTheDocument();

      // Wait for async operation to complete
      await waitFor(() => {
        expect(screen.getByTestId('confirmation')).toHaveTextContent('Selected basic plan');
      });

      expect(screen.queryByTestId('processing')).not.toBeInTheDocument();
    });
  });

  describe('Event Propagation', () => {
    it('should handle event propagation correctly', async () => {
      const user = userEvent.setup();
      const containerClick = jest.fn();
      const radioGroupClick = jest.fn();
      const radioItemClick = jest.fn();

      render(
        <div onClick={containerClick} data-testid='container'>
          <Radio.Group onClick={radioGroupClick} aria-label='Options' name='test-group'>
            <Radio.Item value='option1' onClick={radioItemClick}>
              Option 1
            </Radio.Item>
            <Radio.Item value='option2'>Option 2</Radio.Item>
          </Radio.Group>
        </div>,
      );

      const option1 = getVisibleRadio('Option 1');
      await user.click(option1);

      expect(radioItemClick).toHaveBeenCalled();
      expect(radioGroupClick).toHaveBeenCalled();
      expect(containerClick).toHaveBeenCalled();
    });

    it('should prevent event propagation when needed', async () => {
      const user = userEvent.setup();
      const containerClick = jest.fn();

      const handleItemClick = (e: React.MouseEvent) => {
        e.stopPropagation();
      };

      render(
        <div onClick={containerClick} data-testid='container'>
          <Radio.Group aria-label='Options' name='test-group-2'>
            <Radio.Item value='option1' onClick={handleItemClick}>
              Option 1
            </Radio.Item>
          </Radio.Group>
        </div>,
      );

      const option1 = getVisibleRadio('Option 1');
      await user.click(option1);

      expect(containerClick).not.toHaveBeenCalled();
    });
  });

  describe('Async Operations', () => {
    it('should work with async value changes', async () => {
      const user = userEvent.setup();

      const AsyncRadioGroup = () => {
        const [selectedValue, setSelectedValue] = React.useState('');
        const [isLoading, setIsLoading] = React.useState(false);

        const handleValueChange = async (value: string) => {
          setIsLoading(true);

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 100));

          setSelectedValue(value);
          setIsLoading(false);
        };

        return (
          <div>
            <Radio.Group
              value={selectedValue}
              onValueChange={handleValueChange}
              disabled={isLoading}
              aria-label='Async options'
            >
              <Radio.Item value='option1'>Option 1</Radio.Item>
              <Radio.Item value='option2'>Option 2</Radio.Item>
              <Radio.Item value='option3'>Option 3</Radio.Item>
            </Radio.Group>
            {isLoading && <div data-testid='loading'>Loading...</div>}
            {selectedValue && <div data-testid='selected-value'>Selected: {selectedValue}</div>}
          </div>
        );
      };

      render(<AsyncRadioGroup />);

      const option1 = getVisibleRadio('Option 1');
      await user.click(option1);

      // Should show loading state
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Wait for async operation to complete
      await waitFor(() => {
        expect(screen.getByTestId('selected-value')).toHaveTextContent('Selected: option1');
      });

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(option1).toHaveAttribute('aria-checked', 'true');
    });

    it('should handle async validation', async () => {
      const user = userEvent.setup();

      const AsyncValidationRadioGroup = () => {
        const [selectedValue, setSelectedValue] = React.useState('');
        const [validationError, setValidationError] = React.useState('');
        const [isValidating, setIsValidating] = React.useState(false);

        const handleValueChange = async (value: string) => {
          setIsValidating(true);
          setValidationError('');

          // Simulate async validation
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (value === 'invalid') {
            setValidationError('This option is not available');
          } else {
            setSelectedValue(value);
          }

          setIsValidating(false);
        };

        return (
          <div>
            <Radio.Group
              value={selectedValue}
              onValueChange={handleValueChange}
              aria-describedby={validationError ? 'error-message' : undefined}
              aria-label='Validation options'
            >
              <Radio.Item value='valid'>Valid Option</Radio.Item>
              <Radio.Item value='invalid'>Invalid Option</Radio.Item>
            </Radio.Group>
            {isValidating && <div data-testid='validating'>Validating...</div>}
            {validationError && (
              <div id='error-message' role='alert' data-testid='error'>
                {validationError}
              </div>
            )}
          </div>
        );
      };

      render(<AsyncValidationRadioGroup />);

      const invalidOption = getVisibleRadio('Invalid Option');
      await user.click(invalidOption);

      // Should show validating state
      expect(screen.getByTestId('validating')).toBeInTheDocument();

      // Wait for validation to complete
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('This option is not available');
      });

      expect(screen.queryByTestId('validating')).not.toBeInTheDocument();
      expect(invalidOption).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Real-world Scenarios', () => {
    it('should work in a complex settings page', async () => {
      const user = userEvent.setup();

      const SettingsPage = () => {
        const [settings, setSettings] = React.useState({
          theme: 'light',
          notifications: 'all',
          privacy: 'public',
        });

        const updateSetting = (key: string, value: string) => {
          setSettings((prev) => ({ ...prev, [key]: value }));
        };

        return (
          <div>
            <h1>Settings</h1>

            <section>
              <h2 id='theme-heading'>Theme</h2>
              <Radio.Group
                name='theme'
                value={settings.theme}
                onValueChange={(value) => updateSetting('theme', value)}
                aria-labelledby='theme-heading'
              >
                <Radio.Item value='light'>Light</Radio.Item>
                <Radio.Item value='dark'>Dark</Radio.Item>
                <Radio.Item value='auto'>Auto</Radio.Item>
              </Radio.Group>
            </section>

            <section>
              <h2 id='notifications-heading'>Notifications</h2>
              <Radio.Group
                name='notifications'
                value={settings.notifications}
                onValueChange={(value) => updateSetting('notifications', value)}
                aria-labelledby='notifications-heading'
              >
                <Radio.Item value='all'>All notifications</Radio.Item>
                <Radio.Item value='important'>Important only</Radio.Item>
                <Radio.Item value='none'>None</Radio.Item>
              </Radio.Group>
            </section>

            <section>
              <h2 id='privacy-heading'>Privacy</h2>
              <Radio.Group
                name='privacy'
                value={settings.privacy}
                onValueChange={(value) => updateSetting('privacy', value)}
                aria-labelledby='privacy-heading'
              >
                <Radio.Item value='public'>Public</Radio.Item>
                <Radio.Item value='friends'>Friends only</Radio.Item>
                <Radio.Item value='private'>Private</Radio.Item>
              </Radio.Group>
            </section>

            <div data-testid='current-settings'>{JSON.stringify(settings)}</div>
          </div>
        );
      };

      render(<SettingsPage />);

      const darkTheme = getVisibleRadio('Dark');
      const importantNotifications = getVisibleRadio('Important only');
      const privatePrivacy = getVisibleRadio('Private');

      await user.click(darkTheme);
      await user.click(importantNotifications);
      await user.click(privatePrivacy);

      const settingsDisplay = screen.getByTestId('current-settings');
      expect(settingsDisplay).toHaveTextContent(
        '{"theme":"dark","notifications":"important","privacy":"private"}',
      );
    });

    it('should work in a survey/questionnaire scenario', async () => {
      const user = userEvent.setup();

      const Survey = () => {
        const [answers, setAnswers] = React.useState<Record<string, string>>({});
        const [currentQuestion, setCurrentQuestion] = React.useState(0);

        const questions = [
          {
            id: 'satisfaction',
            text: 'How satisfied are you with our service?',
            options: [
              { value: 'very-satisfied', label: 'Very Satisfied' },
              { value: 'satisfied', label: 'Satisfied' },
              { value: 'neutral', label: 'Neutral' },
              { value: 'dissatisfied', label: 'Dissatisfied' },
            ],
          },
          {
            id: 'recommend',
            text: 'Would you recommend us to others?',
            options: [
              { value: 'definitely', label: 'Definitely' },
              { value: 'probably', label: 'Probably' },
              { value: 'maybe', label: 'Maybe' },
              { value: 'probably-not', label: 'Probably Not' },
              { value: 'definitely-not', label: 'Definitely Not' },
            ],
          },
        ];

        const updateAnswer = (questionId: string, value: string) => {
          setAnswers((prev) => ({ ...prev, [questionId]: value }));
        };

        const nextQuestion = () => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
          }
        };

        const question = questions[currentQuestion];

        if (!question) {
          return <div>Question not found</div>;
        }

        return (
          <div>
            <h1>Survey</h1>
            <p>
              Question {currentQuestion + 1} of {questions.length}
            </p>

            <h2 id={`question-${question.id}`}>{question.text}</h2>
            <Radio.Group
              name={question.id}
              value={answers[question.id] || ''}
              onValueChange={(value) => updateAnswer(question.id, value)}
              aria-labelledby={`question-${question.id}`}
              required
            >
              {question.options.map((option) => (
                <Radio.Item key={option.value} value={option.value}>
                  {option.label}
                </Radio.Item>
              ))}
            </Radio.Group>

            {currentQuestion < questions.length - 1 && (
              <button
                onClick={nextQuestion}
                disabled={!answers[question.id]}
                data-testid='next-button'
              >
                Next
              </button>
            )}

            {currentQuestion === questions.length - 1 && (
              <div data-testid='final-answers'>{JSON.stringify(answers)}</div>
            )}
          </div>
        );
      };

      render(<Survey />);

      // Answer first question
      const satisfied = getVisibleRadio('Satisfied');
      await user.click(satisfied);

      // Go to next question
      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).not.toBeDisabled();
      await user.click(nextButton);

      // Answer second question
      const definitely = getVisibleRadio('Definitely');
      await user.click(definitely);

      // Check final answers
      const finalAnswers = screen.getByTestId('final-answers');
      expect(finalAnswers).toHaveTextContent(
        '{"satisfaction":"satisfied","recommend":"definitely"}',
      );
    });
  });
});
