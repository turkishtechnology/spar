import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from '../Popover';
import { PopoverClose } from '../PopoverClose';
import { PopoverContent } from '../PopoverContent';
import { PopoverTrigger } from '../PopoverTrigger';

describe('Popover', () => {
  it('renders closed by default with trigger ARIA contract', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-controls');
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('toggles in uncontrolled mode via click', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });

    await user.click(trigger);
    expect(await screen.findByText('Content')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(trigger);
    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports controlled mode and only emits onOpenChange until parent updates open', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    const { rerender } = render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();

    rerender(
      <Popover open={true} onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    expect(await screen.findByText('Content')).toBeInTheDocument();
  });

  it('uses provided id as base for aria-controls/content id relationship', async () => {
    const user = userEvent.setup();

    render(
      <Popover id='profile'>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Profile content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-controls', 'profile-content');

    await user.click(trigger);
    const content = await screen.findByText('Profile content');
    expect(content).toHaveAttribute('id', 'profile-content');
  });

  it('opens with ArrowDown and does not toggle closed on repeated ArrowDown', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    trigger.focus();

    await user.keyboard('{ArrowDown}');
    expect(await screen.findByText('Content')).toBeInTheDocument();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('closes on Escape by default', async () => {
    const user = userEvent.setup();

    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    expect(await screen.findByText('Content')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });

  it('keeps popover open when onEscapeKeyDown prevents default', async () => {
    const user = userEvent.setup();

    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent onEscapeKeyDown={(event) => event.preventDefault()}>Content</PopoverContent>
      </Popover>,
    );

    expect(await screen.findByText('Content')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('restores focus to trigger on close unless onCloseAutoFocus is prevented', async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <button>First focus target</button>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });

    await user.click(trigger);
    expect(await screen.findByRole('button', { name: 'First focus target' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });

    rerender(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent onCloseAutoFocus={(event) => event.preventDefault()}>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(await screen.findByRole('button', { name: 'Close' }));
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });
    expect(trigger).not.toHaveFocus();
  });

  it('throws when parts are used outside Popover context', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<PopoverTrigger>Trigger</PopoverTrigger>)).toThrow(
      'Popover components must be used within Popover',
    );
    expect(() => render(<PopoverContent>Content</PopoverContent>)).toThrow(
      'Popover components must be used within Popover',
    );
    expect(() => render(<PopoverClose>Close</PopoverClose>)).toThrow(
      'Popover components must be used within Popover',
    );

    jest.restoreAllMocks();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
