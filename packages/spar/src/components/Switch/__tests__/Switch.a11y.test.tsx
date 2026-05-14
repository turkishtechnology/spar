import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { Switch, SwitchControl, SwitchHint, SwitchLabel, SwitchRoot } from '..';

expect.extend(toHaveNoViolations);

describe('Switch Accessibility', () => {
  it.each([
    { label: 'default', props: {} },
    { label: 'checked', props: { checked: true } },
    { label: 'disabled', props: { disabled: true } },
    { label: 'readOnly', props: { readOnly: true } },
    { label: 'with form input', props: { name: 'notifications', required: true } },
  ])('passes axe checks for $label state', async ({ props }) => {
    const { container } = render(<Switch {...props}>Enable notifications</Switch>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('supports accessible name via aria-label and aria-labelledby', () => {
    const { rerender } = render(<Switch aria-label='Enable dark mode' />);
    expect(screen.getByRole('switch', { name: 'Enable dark mode' })).toBeInTheDocument();

    rerender(
      <>
        <span id='switch-label'>Enable notifications</span>
        <Switch aria-labelledby='switch-label' />
      </>,
    );

    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toHaveAttribute(
      'aria-labelledby',
      'switch-label',
    );
  });

  it('preserves aria-describedby relationship', () => {
    render(
      <>
        <Switch aria-describedby='switch-description'>Notifications</Switch>
        <p id='switch-description'>Controls push notification preference</p>
      </>,
    );

    expect(screen.getByRole('switch', { name: 'Notifications' })).toHaveAttribute(
      'aria-describedby',
      'switch-description',
    );
  });

  it('is reachable with Tab and updates focus state attribute', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>Before</button>
        <Switch>Keyboard switch</Switch>
        <button>After</button>
      </>,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();

    await user.tab();
    const switchElement = screen.getByRole('switch', { name: 'Keyboard switch' });
    expect(switchElement).toHaveFocus();
    expect(switchElement).toHaveAttribute('data-focus', '');

    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    expect(switchElement).not.toHaveAttribute('data-focus');
  });

  it('keeps disabled switch out of tab order and keeps readOnly focusable', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>Before</button>
        <Switch disabled>Disabled switch</Switch>
        <Switch readOnly>Read only switch</Switch>
        <button>After</button>
      </>,
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();

    await user.tab();
    const readOnlySwitch = screen.getByRole('switch', { name: 'Read only switch' });
    expect(readOnlySwitch).toHaveFocus();
    expect(readOnlySwitch).toHaveAttribute('aria-readonly', 'true');

    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    expect(screen.getByRole('switch', { name: 'Disabled switch' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('toggles with Space and Enter only', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Switch onChange={handleChange}>Toggle state</Switch>);
    const switchElement = screen.getByRole('switch', { name: 'Toggle state' });

    switchElement.focus();
    await user.keyboard(' ');
    await user.keyboard('{Enter}');
    await user.keyboard('{ArrowRight}');

    expect(handleChange).toHaveBeenNthCalledWith(1, true);
    expect(handleChange).toHaveBeenNthCalledWith(2, false);
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('passes axe checks for compound anatomy', async () => {
    const { container } = render(
      <SwitchRoot name='alerts' required>
        <SwitchControl />
        <SwitchLabel>Travel alerts</SwitchLabel>
        <SwitchHint>Only operational changes are sent here.</SwitchHint>
      </SwitchRoot>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
