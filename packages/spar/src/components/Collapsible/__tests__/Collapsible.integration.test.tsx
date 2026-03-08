import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type MouseEvent } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../index';

const FormWithCollapsible = () => {
  const [newsletter, setNewsletter] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <form>
      <label htmlFor='name'>Name</label>
      <input id='name' />

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger>Advanced options</CollapsibleTrigger>
        <CollapsibleContent>
          <label>
            <input
              type='checkbox'
              checked={newsletter}
              onChange={(event) => setNewsletter(event.target.checked)}
            />
            Receive newsletter
          </label>
        </CollapsibleContent>
      </Collapsible>

      <button type='submit'>Submit</button>
    </form>
  );
};

describe('Collapsible integration', () => {
  it('works with form controls and preserves nested field state after remount', async () => {
    const user = userEvent.setup();

    render(<FormWithCollapsible />);

    const trigger = screen.getByRole('button', { name: 'Advanced options' });

    await user.click(trigger);

    const checkbox = screen.getByRole('checkbox', { name: 'Receive newsletter' });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(trigger);
    expect(screen.queryByRole('checkbox', { name: 'Receive newsletter' })).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole('checkbox', { name: 'Receive newsletter' })).toBeChecked();
  });

  it('maintains independent state across nested collapsibles', async () => {
    const user = userEvent.setup();

    render(
      <Collapsible>
        <CollapsibleTrigger>Level 1</CollapsibleTrigger>
        <CollapsibleContent>
          <Collapsible>
            <CollapsibleTrigger>Level 2</CollapsibleTrigger>
            <CollapsibleContent>Level 2 content</CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>,
    );

    const level1Trigger = screen.getByRole('button', { name: 'Level 1' });
    const level2TriggerName = 'Level 2';

    await user.click(level1Trigger);
    const level2Trigger = screen.getByRole('button', { name: level2TriggerName });
    expect(level2Trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(level2Trigger);
    expect(screen.getByText('Level 2 content')).toBeInTheDocument();

    await user.click(level1Trigger);
    expect(screen.queryByText('Level 2 content')).not.toBeInTheDocument();

    await user.click(level1Trigger);
    expect(screen.getByRole('button', { name: level2TriggerName })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('keeps trigger click event propagation behavior customizable', async () => {
    const user = userEvent.setup();
    const parentClickHandler = jest.fn();
    const triggerClickHandler = jest.fn((event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
    });

    render(
      <div onClick={parentClickHandler}>
        <Collapsible>
          <CollapsibleTrigger onClick={triggerClickHandler}>Toggle content</CollapsibleTrigger>
          <CollapsibleContent>Content body</CollapsibleContent>
        </Collapsible>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Toggle content' }));

    expect(triggerClickHandler).toHaveBeenCalledTimes(1);
    expect(parentClickHandler).not.toHaveBeenCalled();
  });

  it('opens force mounted content when beforematch fires and calls callback', async () => {
    const onBeforeMatch = jest.fn();

    render(
      <Collapsible>
        <CollapsibleTrigger>Search target</CollapsibleTrigger>
        <CollapsibleContent forceMount onBeforeMatch={onBeforeMatch}>
          Hidden searchable content
        </CollapsibleContent>
      </Collapsible>,
    );

    const content = screen.getByText('Hidden searchable content');
    const trigger = screen.getByRole('button', { name: 'Search target' });

    expect(content).toHaveAttribute('hidden');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent(content, new Event('beforematch'));

    expect(onBeforeMatch).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(content).not.toHaveAttribute('hidden');
    });
  });
});
