import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../Switch';

describe('Switch Integration', () => {
  describe('Form integration workflows', () => {
    it('should work in a complete form submission flow', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();

      render(
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleSubmit({
              notifications: formData.get('notifications'),
              darkMode: formData.get('darkMode'),
              newsletter: formData.get('newsletter'),
            });
          }}
        >
          <Switch name='notifications' defaultChecked={true}>
            Enable notifications
          </Switch>
          <Switch name='darkMode' defaultChecked={false}>
            Dark mode
          </Switch>
          <Switch name='newsletter'>Newsletter</Switch>
          <button type='submit'>Save Settings</button>
        </form>,
      );

      const notificationsSwitch = screen.getByRole('switch', {
        name: 'Enable notifications',
      });
      const darkModeSwitch = screen.getByRole('switch', { name: 'Dark mode' });
      const newsletterSwitch = screen.getByRole('switch', {
        name: 'Newsletter',
      });
      const submitButton = screen.getByRole('button', { name: 'Save Settings' });

      // Verify initial states
      expect(notificationsSwitch).toHaveAttribute('aria-checked', 'true');
      expect(darkModeSwitch).toHaveAttribute('aria-checked', 'false');
      expect(newsletterSwitch).toHaveAttribute('aria-checked', 'false');

      // Toggle dark mode
      await user.click(darkModeSwitch);
      expect(darkModeSwitch).toHaveAttribute('aria-checked', 'true');

      // Toggle newsletter
      await user.click(newsletterSwitch);
      expect(newsletterSwitch).toHaveAttribute('aria-checked', 'true');

      // Submit form
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledWith({
        notifications: 'on',
        darkMode: 'on',
        newsletter: 'on',
      });
    });

    it('should work with controlled switches in a form', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();

      const FormComponent = () => {
        const [settings, setSettings] = React.useState({
          notifications: true,
          darkMode: false,
          autoSave: false,
        });

        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(settings);
            }}
          >
            <Switch
              name='notifications'
              checked={settings.notifications}
              onChange={(checked) => setSettings((prev) => ({ ...prev, notifications: checked }))}
            >
              Notifications
            </Switch>
            <Switch
              name='darkMode'
              checked={settings.darkMode}
              onChange={(checked) => setSettings((prev) => ({ ...prev, darkMode: checked }))}
            >
              Dark Mode
            </Switch>
            <Switch
              name='autoSave'
              checked={settings.autoSave}
              onChange={(checked) => setSettings((prev) => ({ ...prev, autoSave: checked }))}
            >
              Auto Save
            </Switch>
            <button type='submit'>Submit</button>
          </form>
        );
      };

      render(<FormComponent />);

      const notificationsSwitch = screen.getByRole('switch', {
        name: 'Notifications',
      });
      const darkModeSwitch = screen.getByRole('switch', { name: 'Dark Mode' });
      const autoSaveSwitch = screen.getByRole('switch', { name: 'Auto Save' });
      const submitButton = screen.getByRole('button', { name: 'Submit' });

      // Toggle settings
      await user.click(darkModeSwitch);
      await user.click(autoSaveSwitch);
      await user.click(notificationsSwitch); // Turn off

      // Submit
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledWith({
        notifications: false,
        darkMode: true,
        autoSave: true,
      });
    });

    it('should handle form validation with required switches', async () => {
      const user = userEvent.setup();
      let validationMessage = '';

      render(
        <form>
          <Switch name='terms' isRequired>
            I accept the terms and conditions
          </Switch>
          <Switch name='privacy' isRequired>
            I accept the privacy policy
          </Switch>
          <button
            type='submit'
            onClick={(e) => {
              const form = e.currentTarget.form;
              if (!form?.checkValidity()) {
                e.preventDefault();
                validationMessage = 'Please accept all required terms';
              }
            }}
          >
            Register
          </button>
        </form>,
      );

      const termsSwitch = screen.getByRole('switch', {
        name: 'I accept the terms and conditions',
      });
      const privacySwitch = screen.getByRole('switch', {
        name: 'I accept the privacy policy',
      });
      const registerButton = screen.getByRole('button', { name: 'Register' });

      // Try to submit without accepting terms
      await user.click(registerButton);
      expect(validationMessage).toBe('Please accept all required terms');

      // Accept terms and try again
      await user.click(termsSwitch);
      await user.click(privacySwitch);

      validationMessage = '';
      await user.click(registerButton);
      expect(validationMessage).toBe('');
    });

    it('should work with custom form values', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();

      render(
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleSubmit({
              theme: formData.get('theme'),
              language: formData.get('language'),
            });
          }}
        >
          <Switch name='theme' value='dark' defaultChecked={true}>
            Dark Theme
          </Switch>
          <Switch name='language' value='spanish'>
            Spanish Language
          </Switch>
          <button type='submit'>Save</button>
        </form>,
      );

      const languageSwitch = screen.getByRole('switch', {
        name: 'Spanish Language',
      });
      const saveButton = screen.getByRole('button', { name: 'Save' });

      // Toggle language on
      await user.click(languageSwitch);

      await user.click(saveButton);

      expect(handleSubmit).toHaveBeenCalledWith({
        theme: 'dark',
        language: 'spanish',
      });
    });
  });

  describe('User interaction workflows', () => {
    it('should handle complex user interaction sequences', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <div>
          <Switch onChange={handleChange}>Primary Switch</Switch>
          <Switch onChange={handleChange}>Secondary Switch</Switch>
          <button>Other Button</button>
        </div>,
      );

      const primarySwitch = screen.getByRole('switch', {
        name: 'Primary Switch',
      });
      const secondarySwitch = screen.getByRole('switch', {
        name: 'Secondary Switch',
      });
      const button = screen.getByRole('button', { name: 'Other Button' });

      // Complex interaction sequence
      await user.click(primarySwitch);
      await user.tab();
      expect(secondarySwitch).toHaveFocus();

      await user.keyboard(' ');
      await user.tab();
      expect(button).toHaveFocus();

      await user.tab({ shift: true });
      expect(secondarySwitch).toHaveFocus();

      await user.tab({ shift: true });
      expect(primarySwitch).toHaveFocus();

      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenNthCalledWith(1, true); // Click
      expect(handleChange).toHaveBeenNthCalledWith(2, true); // Space on secondary
      expect(handleChange).toHaveBeenNthCalledWith(3, false); // Enter on primary (toggle back)
    });

    it('should handle rapid user interactions', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Switch onChange={handleChange}>Rapid Toggle</Switch>);

      const switchElement = screen.getByRole('switch');

      // Rapid clicking
      await user.click(switchElement);
      await user.click(switchElement);
      await user.click(switchElement);
      await user.click(switchElement);
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(5);
      expect(handleChange).toHaveBeenNthCalledWith(1, true);
      expect(handleChange).toHaveBeenNthCalledWith(2, false);
      expect(handleChange).toHaveBeenNthCalledWith(3, true);
      expect(handleChange).toHaveBeenNthCalledWith(4, false);
      expect(handleChange).toHaveBeenNthCalledWith(5, true);
    });

    it('should handle mixed mouse and keyboard interactions', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Switch onChange={handleChange}>Mixed Interaction</Switch>);

      const switchElement = screen.getByRole('switch');

      // Start with click
      await user.click(switchElement);
      expect(handleChange).toHaveBeenLastCalledWith(true);

      // Then keyboard
      switchElement.focus();
      await user.keyboard(' ');
      expect(handleChange).toHaveBeenLastCalledWith(false);

      // Then Enter
      await user.keyboard('{Enter}');
      expect(handleChange).toHaveBeenLastCalledWith(true);

      // Then click again
      await user.click(switchElement);
      expect(handleChange).toHaveBeenLastCalledWith(false);

      expect(handleChange).toHaveBeenCalledTimes(4);
    });
  });

  describe('Dynamic state management', () => {
    it('should handle dynamic prop changes', async () => {
      const user = userEvent.setup();

      const DynamicSwitch = () => {
        const [isDisabled, setIsDisabled] = React.useState(false);
        const [isReadOnly, setIsReadOnly] = React.useState(false);
        const [checked, setChecked] = React.useState(false);

        return (
          <div>
            <Switch
              checked={checked}
              onChange={setChecked}
              isDisabled={isDisabled}
              isReadOnly={isReadOnly}
            >
              Dynamic Switch
            </Switch>
            <button onClick={() => setIsDisabled(!isDisabled)}>Toggle Disabled</button>
            <button onClick={() => setIsReadOnly(!isReadOnly)}>Toggle ReadOnly</button>
          </div>
        );
      };

      render(<DynamicSwitch />);

      const switchElement = screen.getByRole('switch');
      const disabledButton = screen.getByRole('button', {
        name: 'Toggle Disabled',
      });
      const readOnlyButton = screen.getByRole('button', {
        name: 'Toggle ReadOnly',
      });

      // Initially should be interactive
      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');

      // Make disabled
      await user.click(disabledButton);
      expect(switchElement).toHaveAttribute('aria-disabled', 'true');
      expect(switchElement).toHaveAttribute('data-disabled', '');

      // Try to interact while disabled (should not work)
      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'true'); // No change

      // Make read-only instead
      await user.click(disabledButton); // Remove disabled
      await user.click(readOnlyButton); // Add read-only

      expect(switchElement).toHaveAttribute('aria-readonly', 'true');
      expect(switchElement).toHaveAttribute('data-readonly', '');
      expect(switchElement).not.toHaveAttribute('aria-disabled');

      // Try to interact while read-only (should not work)
      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'true'); // No change
    });

    it('should handle conditional rendering', async () => {
      const user = userEvent.setup();

      const ConditionalSwitch = () => {
        const [showSwitch, setShowSwitch] = React.useState(true);
        const [switchValue, setSwitchValue] = React.useState(false);

        return (
          <div>
            <button onClick={() => setShowSwitch(!showSwitch)}>
              {showSwitch ? 'Hide' : 'Show'} Switch
            </button>
            {showSwitch && (
              <Switch checked={switchValue} onChange={setSwitchValue}>
                Conditional Switch
              </Switch>
            )}
          </div>
        );
      };

      render(<ConditionalSwitch />);

      const toggleButton = screen.getByRole('button', { name: 'Hide Switch' });
      let switchElement = screen.getByRole('switch');

      // Toggle switch on
      await user.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');

      // Hide switch
      await user.click(toggleButton);
      expect(screen.queryByRole('switch')).not.toBeInTheDocument();

      // Show switch again
      await user.click(screen.getByRole('button', { name: 'Show Switch' }));
      switchElement = screen.getByRole('switch');

      // State should be preserved
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Error boundaries and edge cases', () => {
    it('should handle missing onChange gracefully in interactive scenarios', async () => {
      const user = userEvent.setup();

      // Mock console.error to check for warnings
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<Switch>Switch without onChange</Switch>);

      const switchElement = screen.getByRole('switch');

      // Should not throw error or show console errors
      await user.click(switchElement);
      await user.keyboard(' ');
      await user.keyboard('{Enter}');

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle unmounting during interaction', async () => {
      const user = userEvent.setup();

      const UnmountingComponent = () => {
        const [mounted, setMounted] = React.useState(true);

        if (!mounted) return null;

        return (
          <div>
            <Switch
              onChange={() => {
                // Simulate unmounting during onChange
                setTimeout(() => setMounted(false), 0);
              }}
            >
              Unmounting Switch
            </Switch>
          </div>
        );
      };

      render(<UnmountingComponent />);

      const switchElement = screen.getByRole('switch');

      // Should not throw error when component unmounts during interaction
      await user.click(switchElement);

      await waitFor(() => {
        expect(screen.queryByRole('switch')).not.toBeInTheDocument();
      });
    });

    it('should handle rapid prop changes', async () => {
      const RapidChanges = () => {
        const [counter, setCounter] = React.useState(0);

        React.useEffect(() => {
          const interval = setInterval(() => {
            setCounter((c) => c + 1);
          }, 10);

          setTimeout(() => clearInterval(interval), 100);
          return () => clearInterval(interval);
        }, []);

        return <Switch checked={counter % 2 === 0}>Rapid Changes ({counter})</Switch>;
      };

      render(<RapidChanges />);

      const switchElement = screen.getByRole('switch');

      // Wait for some rapid changes
      await waitFor(
        () => {
          const text = switchElement.textContent;
          expect(text).toMatch(/\d+/);
          const number = parseInt(text?.match(/\d+/)?.[0] || '0');
          expect(number).toBeGreaterThan(5);
        },
        { timeout: 200 },
      );

      // Component should still be functional
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).toHaveAttribute('role', 'switch');
    });
  });

  describe('Performance considerations', () => {
    it('should handle many switches efficiently', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      const switches = Array.from({ length: 50 }, (_, i) => (
        <Switch key={i} onChange={handleChange}>
          Switch {i + 1}
        </Switch>
      ));

      render(<div>{switches}</div>);

      // Should render all switches
      const switchElements = screen.getAllByRole('switch');
      expect(switchElements).toHaveLength(50);

      // Should be able to interact with individual switches
      await user.click(switchElements[0]!);
      await user.click(switchElements[25]!);
      await user.click(switchElements[49]!);

      expect(handleChange).toHaveBeenCalledTimes(3);
    });

    it('should handle frequent state updates efficiently', async () => {
      const user = userEvent.setup();

      const FrequentUpdates = () => {
        const [value, setValue] = React.useState(false);
        const [updateCount, setUpdateCount] = React.useState(0);

        React.useEffect(() => {
          setUpdateCount((c) => c + 1);
        }, [value]);

        return (
          <div>
            <Switch checked={value} onChange={setValue}>
              Frequent Updates
            </Switch>
            <div data-testid='update-count'>{updateCount}</div>
          </div>
        );
      };

      render(<FrequentUpdates />);

      const switchElement = screen.getByRole('switch');
      const updateCounter = screen.getByTestId('update-count');

      // Initial render
      expect(updateCounter).toHaveTextContent('1');

      // Toggle multiple times
      await user.click(switchElement);
      expect(updateCounter).toHaveTextContent('2');

      await user.click(switchElement);
      expect(updateCounter).toHaveTextContent('3');

      await user.click(switchElement);
      expect(updateCounter).toHaveTextContent('4');
    });
  });
});
