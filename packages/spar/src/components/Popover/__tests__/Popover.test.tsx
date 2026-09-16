import { act, render, screen, waitFor } from '@testing-library/react';
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

  it('assigns the documented `${id}-trigger` id to the trigger and lets props override it', () => {
    const { rerender } = render(
      <Popover id='profile'>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Profile content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('id', 'profile-trigger');
    expect(trigger).toHaveAttribute('aria-controls', 'profile-content');

    rerender(
      <Popover id='profile'>
        <PopoverTrigger id='custom-trigger'>Open</PopoverTrigger>
        <PopoverContent>Profile content</PopoverContent>
      </Popover>,
    );

    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('id', 'custom-trigger');
  });

  it('generates a trigger id when no id is provided', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger.id).toMatch(/-trigger$/);
    expect(trigger.getAttribute('aria-controls')).toBe(trigger.id.replace(/-trigger$/, '-content'));
  });

  it('does not open with ArrowDown and opens with Enter', async () => {
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
    expect(screen.queryByText('Content')).not.toBeInTheDocument();

    await user.keyboard('{Enter}');
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

  it('calls onOpenAutoFocus with a cancelable event before moving focus into content', async () => {
    const user = userEvent.setup();
    const onOpenAutoFocus = jest.fn((event: Event) => {
      expect(event.cancelable).toBe(true);
      // Auto-focus has not happened yet when the handler runs
      expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
    });

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent onOpenAutoFocus={onOpenAutoFocus}>
          <button>First focus target</button>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('button', { name: 'First focus target' })).toHaveFocus();
  });

  it('skips auto-focus when onOpenAutoFocus prevents default', async () => {
    const user = userEvent.setup();
    const onOpenAutoFocus = jest.fn((event: Event) => event.preventDefault());

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent onOpenAutoFocus={onOpenAutoFocus}>
          <button>First focus target</button>
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);

    expect(await screen.findByRole('button', { name: 'First focus target' })).toBeInTheDocument();
    expect(onOpenAutoFocus).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'First focus target' })).not.toHaveFocus();
    expect(trigger).toHaveFocus();
  });

  describe('focus moving outside', () => {
    const renderWithOutsideButton = async (
      contentProps: Partial<React.ComponentProps<typeof PopoverContent>> = {},
    ) => {
      const user = userEvent.setup();
      render(
        <div>
          <Popover>
            <PopoverTrigger>Open</PopoverTrigger>
            <PopoverContent {...contentProps}>
              <button>Inside</button>
            </PopoverContent>
          </Popover>
          <button>Outside</button>
        </div>,
      );
      await user.click(screen.getByRole('button', { name: 'Open' }));
      return user;
    };

    it('calls onFocusOutside and onInteractOutside with a cancelable event and closes', async () => {
      const onFocusOutside = jest.fn();
      const onInteractOutside = jest.fn();

      await renderWithOutsideButton({ onFocusOutside, onInteractOutside });
      expect(await screen.findByRole('button', { name: 'Inside' })).toHaveFocus();

      const outside = screen.getByRole('button', { name: 'Outside' });
      act(() => {
        outside.focus();
      });

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Inside' })).not.toBeInTheDocument();
      });

      expect(onFocusOutside).toHaveBeenCalledTimes(1);
      expect(onInteractOutside).toHaveBeenCalledTimes(1);
      const event = onFocusOutside.mock.calls[0]?.[0] as FocusEvent;
      expect(event).toBeInstanceOf(FocusEvent);
      expect(event.cancelable).toBe(true);
      expect(event.target).toBe(outside);
      expect(onInteractOutside.mock.calls[0]?.[0]).toBe(event);
    });

    it('stays open when onFocusOutside prevents default', async () => {
      const onFocusOutside = jest.fn((event: FocusEvent) => event.preventDefault());

      await renderWithOutsideButton({ onFocusOutside });
      expect(await screen.findByRole('button', { name: 'Inside' })).toHaveFocus();

      const outside = screen.getByRole('button', { name: 'Outside' });
      act(() => {
        outside.focus();
      });

      expect(onFocusOutside).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: 'Inside' })).toBeInTheDocument();
      expect(outside).toHaveFocus();
    });

    it('stays open when onInteractOutside prevents default on the focus path', async () => {
      const onInteractOutside = jest.fn((event: PointerEvent | FocusEvent) =>
        event.preventDefault(),
      );

      await renderWithOutsideButton({ onInteractOutside });
      expect(await screen.findByRole('button', { name: 'Inside' })).toHaveFocus();

      act(() => {
        screen.getByRole('button', { name: 'Outside' }).focus();
      });

      expect(onInteractOutside).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: 'Inside' })).toBeInTheDocument();
    });

    it('still closes on outside pointer down', async () => {
      const onPointerDownOutside = jest.fn();

      const user = await renderWithOutsideButton({ onPointerDownOutside });
      await user.click(screen.getByRole('button', { name: 'Outside' }));
      expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Inside' })).not.toBeInTheDocument();
      });
    });
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
