import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  useCollapsibleContext,
} from '../index';

describe('Collapsible', () => {
  it('starts closed by default and toggles in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();

    render(
      <Collapsible onOpenChange={handleOpenChange}>
        <CollapsibleTrigger>Toggle details</CollapsibleTrigger>
        <CollapsibleContent>Details content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Toggle details' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Details content')).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Details content')).toBeInTheDocument();
    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });

  it('respects defaultOpen in uncontrolled mode', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Show content</CollapsibleTrigger>
        <CollapsibleContent>Open by default</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Show content' });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Open by default')).toBeInTheDocument();
  });

  it('works in controlled mode without internal state mutation', async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();

    const { rerender } = render(
      <Collapsible open={false} onOpenChange={handleOpenChange}>
        <CollapsibleTrigger>Controlled trigger</CollapsibleTrigger>
        <CollapsibleContent>Controlled content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Controlled trigger' });

    await user.click(trigger);

    expect(handleOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Controlled content')).not.toBeInTheDocument();

    rerender(
      <Collapsible open={true} onOpenChange={handleOpenChange}>
        <CollapsibleTrigger>Controlled trigger</CollapsibleTrigger>
        <CollapsibleContent>Controlled content</CollapsibleContent>
      </Collapsible>,
    );

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Controlled content')).toBeInTheDocument();
  });

  it('prevents state changes when disabled', async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();

    render(
      <Collapsible disabled onOpenChange={handleOpenChange}>
        <CollapsibleTrigger>Disabled trigger</CollapsibleTrigger>
        <CollapsibleContent>Disabled content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Disabled trigger' });

    await user.click(trigger);

    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Disabled content')).not.toBeInTheDocument();
    expect(handleOpenChange).not.toHaveBeenCalled();
  });

  it('derives trigger/content ids from provided base id', () => {
    render(
      <Collapsible id='faq-item' defaultOpen>
        <CollapsibleTrigger>FAQ trigger</CollapsibleTrigger>
        <CollapsibleContent>FAQ content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'FAQ trigger' });
    const content = screen.getByText('FAQ content');

    expect(trigger).toHaveAttribute('id', 'faq-item-trigger');
    expect(content).toHaveAttribute('id', 'faq-item-content');
    expect(trigger).toHaveAttribute('aria-controls', 'faq-item-content');
  });

  it('prioritizes explicit triggerId and contentId overrides', () => {
    render(
      <Collapsible
        id='ignored-base'
        triggerId='explicit-trigger'
        contentId='explicit-content'
        defaultOpen
      >
        <CollapsibleTrigger>Explicit ids trigger</CollapsibleTrigger>
        <CollapsibleContent>Explicit ids content</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole('button', { name: 'Explicit ids trigger' });
    const content = screen.getByText('Explicit ids content');

    expect(trigger).toHaveAttribute('id', 'explicit-trigger');
    expect(content).toHaveAttribute('id', 'explicit-content');
    expect(trigger).toHaveAttribute('aria-controls', 'explicit-content');
  });

  it('throws a clear error when context hook is used outside provider', () => {
    const OutsideContextConsumer = () => {
      useCollapsibleContext();
      return null;
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<OutsideContextConsumer />)).toThrow(
      'Collapsible components must be used within a Collapsible',
    );

    consoleSpy.mockRestore();
  });
});
