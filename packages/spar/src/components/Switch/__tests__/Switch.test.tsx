import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch, SwitchControl, SwitchRoot, SwitchThumb, SwitchTrack } from '..';
import { Field } from '../../Field';

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

  it('wires Field.Label to the compound control via aria-labelledby', () => {
    render(
      <Field required>
        <Field.Label>Critical travel alerts</Field.Label>
        <SwitchRoot defaultChecked>
          <SwitchControl>
            <SwitchTrack>
              <SwitchThumb />
            </SwitchTrack>
          </SwitchControl>
        </SwitchRoot>
        <Field.Description>Only operational changes are sent here.</Field.Description>
      </Field>,
    );

    const control = screen.getByRole('switch');
    const label = screen.getByText('Critical travel alerts');
    const description = screen.getByText('Only operational changes are sent here.');

    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(control).toHaveAttribute('aria-required', 'true');
    expect(label).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('toggles compound state from control click with Field', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Field>
        <Field.Label>Clickable switch</Field.Label>
        <SwitchRoot onChange={handleChange}>
          <SwitchControl />
        </SwitchRoot>
      </Field>,
    );

    await user.click(screen.getByRole('switch'));

    expect(handleChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('supports controlled compound state with Field', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    const { rerender } = render(
      <Field>
        <Field.Label>Controlled compound</Field.Label>
        <SwitchRoot checked={false} onChange={handleChange}>
          <SwitchControl />
        </SwitchRoot>
      </Field>,
    );

    await user.click(screen.getByRole('switch'));

    expect(handleChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

    rerender(
      <Field>
        <Field.Label>Controlled compound</Field.Label>
        <SwitchRoot checked={true} onChange={handleChange}>
          <SwitchControl />
        </SwitchRoot>
      </Field>,
    );

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles compound control with Space and Enter inside Field', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Field>
        <Field.Label>Keyboard compound</Field.Label>
        <SwitchRoot onChange={handleChange}>
          <SwitchControl />
        </SwitchRoot>
      </Field>,
    );

    const control = screen.getByRole('switch');
    control.focus();
    await user.keyboard(' ');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenNthCalledWith(1, true);
    expect(handleChange).toHaveBeenNthCalledWith(2, false);
  });

  it('submits compound value through the hidden input with Field', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(new FormData(event.currentTarget).get('alerts'));
        }}
      >
        <Field>
          <Field.Label>Critical alerts</Field.Label>
          <SwitchRoot name='alerts' value='critical'>
            <SwitchControl />
          </SwitchRoot>
        </Field>
        <button type='submit'>Save</button>
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(handleSubmit).toHaveBeenLastCalledWith(null);

    await user.click(screen.getByRole('switch'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleSubmit).toHaveBeenLastCalledWith('critical');
  });

  it('inherits disabled and readOnly from Field in compound mode', async () => {
    const user = userEvent.setup();
    const disabledChange = jest.fn();
    const readonlyChange = jest.fn();

    render(
      <>
        <Field disabled>
          <Field.Label>Disabled compound</Field.Label>
          <SwitchRoot onChange={disabledChange}>
            <SwitchControl />
          </SwitchRoot>
        </Field>
        <Field readOnly>
          <Field.Label>Readonly compound</Field.Label>
          <SwitchRoot onChange={readonlyChange}>
            <SwitchControl />
          </SwitchRoot>
        </Field>
      </>,
    );

    const switches = screen.getAllByRole('switch');
    await user.click(switches[0]!);
    await user.click(switches[1]!);

    expect(disabledChange).not.toHaveBeenCalled();
    expect(readonlyChange).not.toHaveBeenCalled();
    expect(switches[0]!).toHaveAttribute('data-disabled', '');
    expect(switches[1]!).toHaveAttribute('aria-readonly', 'true');
  });

  it('keeps the namespace Switch.Root aliases available with Field', () => {
    render(
      <Field>
        <Field.Label>Namespaced switch</Field.Label>
        <Switch.Root>
          <Switch.Control />
        </Switch.Root>
      </Field>,
    );

    expect(screen.getByRole('switch')).toBeInTheDocument();
    expect(screen.getByText('Namespaced switch')).toBeInTheDocument();
  });
});
