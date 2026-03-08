import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../index';

expect.extend(toHaveNoViolations);

describe('Collapsible accessibility', () => {
  it('has no a11y violations in closed and open states', async () => {
    const { container } = render(
      <Collapsible>
        <CollapsibleTrigger>Toggle section</CollapsibleTrigger>
        <CollapsibleContent>Section content</CollapsibleContent>
      </Collapsible>,
    );

    expect(await axe(container)).toHaveNoViolations();

    await userEvent.click(screen.getByRole('button', { name: 'Toggle section' }));

    expect(await axe(container)).toHaveNoViolations();
  });

  it('exposes correct ARIA relationship and updates expanded state', async () => {
    const user = userEvent.setup();

    render(
      <Collapsible id='settings' defaultOpen>
        <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
        <CollapsibleContent>Settings content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Advanced settings' });

    expect(trigger).toHaveAttribute('aria-controls', 'settings-content');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Settings content')).toHaveAttribute('id', 'settings-content');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports keyboard activation and preserves focus on trigger', async () => {
    const user = userEvent.setup();

    render(
      <Collapsible>
        <CollapsibleTrigger>Keyboard trigger</CollapsibleTrigger>
        <CollapsibleContent>Keyboard content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Keyboard trigger' });
    trigger.focus();

    await user.keyboard('{Enter}');
    expect(screen.getByText('Keyboard content')).toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.keyboard(' ');
    expect(screen.queryByText('Keyboard content')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('supports custom trigger element with button semantics', async () => {
    const user = userEvent.setup();

    render(
      <Collapsible>
        <CollapsibleTrigger as='div'>Custom trigger</CollapsibleTrigger>
        <CollapsibleContent>Custom content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Custom trigger' });

    expect(trigger).toHaveAttribute('tabIndex', '0');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    trigger.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('prevents focus/activation when custom trigger is disabled', async () => {
    const user = userEvent.setup();

    render(
      <Collapsible disabled>
        <CollapsibleTrigger as='div'>Disabled custom trigger</CollapsibleTrigger>
        <CollapsibleContent>Disabled content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Disabled custom trigger' });

    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(trigger).toHaveAttribute('tabIndex', '-1');

    trigger.focus();
    await user.keyboard('{Enter}');

    expect(screen.queryByText('Disabled content')).not.toBeInTheDocument();
  });

  it('keeps force mounted content hidden until opened', async () => {
    const user = userEvent.setup();

    render(
      <Collapsible>
        <CollapsibleTrigger>Reveal hidden content</CollapsibleTrigger>
        <CollapsibleContent forceMount>Hidden but mounted content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Reveal hidden content' });
    const content = screen.getByText('Hidden but mounted content');

    expect(content).toHaveAttribute('hidden');

    await user.click(trigger);

    expect(content).not.toHaveAttribute('hidden');
  });
});
