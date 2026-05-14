import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Switch,
  SwitchControl,
  SwitchHint,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
  SwitchTrack,
} from '..';

describe('Switch', () => {
  it('renders with switch semantics and accessible name', () => {
    render(<Switch>Enable notifications</Switch>);

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeInTheDocument();
  });

  it('toggles internal state in uncontrolled mode and fires onChange', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Switch onChange={handleChange}>Toggle me</Switch>);

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');

    await user.click(switchElement);

    expect(handleChange).toHaveBeenCalledWith(true);
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
    expect(switchElement).toHaveAttribute('data-state', 'checked');
  });

  it('behaves as controlled when checked prop is provided', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    const { rerender } = render(
      <Switch checked={false} onChange={handleChange}>
        Toggle me
      </Switch>,
    );

    const switchElement = screen.getByRole('switch');
    await user.click(switchElement);

    expect(handleChange).toHaveBeenCalledWith(true);
    expect(switchElement).toHaveAttribute('aria-checked', 'false');

    rerender(
      <Switch checked={true} onChange={handleChange}>
        Toggle me
      </Switch>,
    );

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('supports Space and Enter keyboard activation, but ignores other keys', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Switch onChange={handleChange}>Keyboard switch</Switch>);

    const switchElement = screen.getByRole('switch');
    switchElement.focus();

    await user.keyboard(' ');
    await user.keyboard('{Enter}');
    await user.keyboard('{Escape}');

    expect(handleChange).toHaveBeenNthCalledWith(1, true);
    expect(handleChange).toHaveBeenNthCalledWith(2, false);
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('prevents state changes when disabled or readOnly', async () => {
    const user = userEvent.setup();
    const disabledChange = jest.fn();
    const readonlyChange = jest.fn();

    render(
      <>
        <Switch disabled onChange={disabledChange}>
          Disabled switch
        </Switch>
        <Switch readOnly onChange={readonlyChange}>
          Read only switch
        </Switch>
      </>,
    );

    const disabledSwitch = screen.getByRole('switch', { name: 'Disabled switch' });
    const readonlySwitch = screen.getByRole('switch', { name: 'Read only switch' });

    await user.click(disabledSwitch);
    readonlySwitch.focus();
    await user.keyboard(' ');

    expect(disabledChange).not.toHaveBeenCalled();
    expect(readonlyChange).not.toHaveBeenCalled();
    expect(disabledSwitch).toHaveAttribute('aria-checked', 'false');
    expect(readonlySwitch).toHaveAttribute('aria-readonly', 'true');
  });

  it('syncs form submission value when name is provided', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          handleSubmit(formData.get('settings'));
        }}
      >
        <Switch name='settings' value='enabled'>
          Form switch
        </Switch>
        <button type='submit'>Save</button>
      </form>,
    );

    const switchElement = screen.getByRole('switch', { name: 'Form switch' });
    const submitButton = screen.getByRole('button', { name: 'Save' });

    await user.click(submitButton);
    expect(handleSubmit).toHaveBeenLastCalledWith(null);

    await user.click(switchElement);
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenLastCalledWith('enabled');
  });

  it('forwards aria labeling relationships', () => {
    render(
      <>
        <span id='switch-label'>Notifications</span>
        <span id='switch-description'>Controls push notifications</span>
        <Switch aria-labelledby='switch-label' aria-describedby='switch-description' />
      </>,
    );

    const switchElement = screen.getByRole('switch', { name: 'Notifications' });
    expect(switchElement).toHaveAttribute('aria-labelledby', 'switch-label');
    expect(switchElement).toHaveAttribute('aria-describedby', 'switch-description');
  });

  it('uses provided id and generates unique ids when omitted', () => {
    const { container } = render(
      <>
        <Switch id='custom-switch-id'>With custom id</Switch>
        <Switch>Generated A</Switch>
        <Switch>Generated B</Switch>
      </>,
    );

    const customSwitch = screen.getByRole('switch', { name: 'With custom id' });
    const allSwitches = container.querySelectorAll('[role="switch"]');
    const generatedIdA = allSwitches[1]?.getAttribute('id');
    const generatedIdB = allSwitches[2]?.getAttribute('id');

    expect(customSwitch).toHaveAttribute('id', 'custom-switch-id');
    expect(generatedIdA).toBeTruthy();
    expect(generatedIdB).toBeTruthy();
    expect(generatedIdA).not.toBe(generatedIdB);
  });

  it('supports render-prop children and setChecked API', async () => {
    const user = userEvent.setup();

    render(
      <Switch>
        {({ checked, setChecked }) => (
          <span
            onClick={(event) => {
              event.stopPropagation();
              setChecked(!checked);
            }}
          >
            {checked ? 'On' : 'Off'}
          </span>
        )}
      </Switch>,
    );

    const switchElement = screen.getByRole('switch');
    const label = screen.getByText('Off');
    await user.click(label);

    expect(switchElement).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('On')).toBeInTheDocument();
  });

  it('wires compound label and hint ids to the control', () => {
    render(
      <SwitchRoot defaultChecked required>
        <SwitchControl>
          <SwitchTrack>
            <SwitchThumb />
          </SwitchTrack>
        </SwitchControl>
        <SwitchLabel>Critical travel alerts</SwitchLabel>
        <SwitchHint>Only operational changes are sent here.</SwitchHint>
      </SwitchRoot>,
    );

    const control = screen.getByRole('switch', { name: 'Critical travel alerts' });
    const label = screen.getByText('Critical travel alerts');
    const hint = screen.getByText('Only operational changes are sent here.');

    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(control).toHaveAttribute('aria-labelledby', label.id);
    expect(control).toHaveAttribute('aria-describedby', hint.id);
    expect(control).toHaveAttribute('aria-required', 'true');
  });

  it('toggles compound state from the label click', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <SwitchRoot onChange={handleChange}>
        <SwitchControl />
        <SwitchLabel>Clickable label</SwitchLabel>
      </SwitchRoot>,
    );

    await user.click(screen.getByText('Clickable label'));

    expect(handleChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch', { name: 'Clickable label' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('supports controlled compound state', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    const { rerender } = render(
      <SwitchRoot checked={false} onChange={handleChange}>
        <SwitchControl />
        <SwitchLabel>Controlled compound</SwitchLabel>
      </SwitchRoot>,
    );

    await user.click(screen.getByRole('switch', { name: 'Controlled compound' }));

    expect(handleChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch', { name: 'Controlled compound' })).toHaveAttribute(
      'aria-checked',
      'false',
    );

    rerender(
      <SwitchRoot checked={true} onChange={handleChange}>
        <SwitchControl />
        <SwitchLabel>Controlled compound</SwitchLabel>
      </SwitchRoot>,
    );

    expect(screen.getByRole('switch', { name: 'Controlled compound' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('toggles compound control with Space and Enter', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <SwitchRoot onChange={handleChange}>
        <SwitchControl />
        <SwitchLabel>Keyboard compound</SwitchLabel>
      </SwitchRoot>,
    );

    const control = screen.getByRole('switch', { name: 'Keyboard compound' });
    control.focus();
    await user.keyboard(' ');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenNthCalledWith(1, true);
    expect(handleChange).toHaveBeenNthCalledWith(2, false);
  });

  it('submits compound value through the hidden input', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(new FormData(event.currentTarget).get('alerts'));
        }}
      >
        <SwitchRoot name='alerts' value='critical'>
          <SwitchControl />
          <SwitchLabel>Critical alerts</SwitchLabel>
        </SwitchRoot>
        <button type='submit'>Save</button>
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(handleSubmit).toHaveBeenLastCalledWith(null);

    await user.click(screen.getByText('Critical alerts'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleSubmit).toHaveBeenLastCalledWith('critical');
  });

  it('prevents compound label toggles when disabled or readOnly', async () => {
    const user = userEvent.setup();
    const disabledChange = jest.fn();
    const readonlyChange = jest.fn();

    render(
      <>
        <SwitchRoot disabled onChange={disabledChange}>
          <SwitchControl />
          <SwitchLabel>Disabled compound</SwitchLabel>
        </SwitchRoot>
        <SwitchRoot readOnly onChange={readonlyChange}>
          <SwitchControl />
          <SwitchLabel>Readonly compound</SwitchLabel>
        </SwitchRoot>
      </>,
    );

    await user.click(screen.getByText('Disabled compound'));
    await user.click(screen.getByText('Readonly compound'));

    expect(disabledChange).not.toHaveBeenCalled();
    expect(readonlyChange).not.toHaveBeenCalled();
    expect(screen.getByRole('switch', { name: 'Disabled compound' })).toHaveAttribute(
      'data-disabled',
      '',
    );
    expect(screen.getByRole('switch', { name: 'Readonly compound' })).toHaveAttribute(
      'aria-readonly',
      'true',
    );
  });

  it('keeps the namespace Switch.Root aliases available', () => {
    render(
      <Switch.Root>
        <Switch.Control />
        <Switch.Label>Namespaced switch</Switch.Label>
      </Switch.Root>,
    );

    expect(screen.getByRole('switch', { name: 'Namespaced switch' })).toBeInTheDocument();
  });
});
