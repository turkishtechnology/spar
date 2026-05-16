import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '..';

describe('Switch Integration', () => {
  it('submits checked uncontrolled switches through form data', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          handleSubmit({
            notifications: formData.get('notifications'),
            darkMode: formData.get('darkMode'),
          });
        }}
      >
        <Switch name='notifications' defaultChecked>
          Notifications
        </Switch>
        <Switch name='darkMode'>Dark mode</Switch>
        <button type='submit'>Save</button>
      </form>,
    );

    await user.click(screen.getByRole('switch', { name: 'Dark mode' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleSubmit).toHaveBeenCalledWith({
      notifications: 'on',
      darkMode: 'on',
    });
  });

  it('works in controlled form state updates', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    const ControlledForm = () => {
      const [settings, setSettings] = React.useState({
        email: true,
        sms: false,
      });

      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit(settings);
          }}
        >
          <Switch
            checked={settings.email}
            onChange={(checked) => setSettings((prev) => ({ ...prev, email: checked }))}
          >
            Email alerts
          </Switch>
          <Switch
            checked={settings.sms}
            onChange={(checked) => setSettings((prev) => ({ ...prev, sms: checked }))}
          >
            SMS alerts
          </Switch>
          <button type='submit'>Submit</button>
        </form>
      );
    };

    render(<ControlledForm />);

    await user.click(screen.getByRole('switch', { name: 'SMS alerts' }));
    await user.click(screen.getByRole('switch', { name: 'Email alerts' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: false,
      sms: true,
    });
  });

  it('reflects required validation state through hidden inputs', async () => {
    const user = userEvent.setup();

    render(
      <form aria-label='preferences'>
        <Switch name='terms' required>
          Terms
        </Switch>
        <Switch name='privacy' required>
          Privacy
        </Switch>
      </form>,
    );

    const form = screen.getByRole('form', { name: 'preferences' });
    const termsSwitch = screen.getByRole('switch', { name: 'Terms' });
    const privacySwitch = screen.getByRole('switch', { name: 'Privacy' });

    expect(form.checkValidity()).toBe(false);

    await user.click(termsSwitch);
    await user.click(privacySwitch);

    expect(form.checkValidity()).toBe(true);
  });

  it('supports mixed keyboard and mouse workflow in a settings panel', async () => {
    const user = userEvent.setup();

    render(
      <>
        <Switch>Primary switch</Switch>
        <Switch>Secondary switch</Switch>
        <button>Save</button>
      </>,
    );

    const primarySwitch = screen.getByRole('switch', { name: 'Primary switch' });
    const secondarySwitch = screen.getByRole('switch', { name: 'Secondary switch' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.click(primarySwitch);
    expect(primarySwitch).toHaveAttribute('aria-checked', 'true');

    await user.tab();
    expect(secondarySwitch).toHaveFocus();

    await user.keyboard(' ');
    expect(secondarySwitch).toHaveAttribute('aria-checked', 'true');

    await user.tab();
    expect(saveButton).toHaveFocus();
  });

  it('submits value to an external form when form attribute is provided', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(
      <>
        <Switch name='marketing' form='preferences-form'>
          Marketing emails
        </Switch>

        <form
          id='preferences-form'
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            handleSubmit(formData.get('marketing'));
          }}
        >
          <button type='submit'>Submit preferences</button>
        </form>
      </>,
    );

    await user.click(screen.getByRole('switch', { name: 'Marketing emails' }));
    await user.click(screen.getByRole('button', { name: 'Submit preferences' }));

    expect(handleSubmit).toHaveBeenCalledWith('on');
  });
});
