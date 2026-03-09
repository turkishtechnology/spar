import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from '../Popover';
import { PopoverClose } from '../PopoverClose';
import { PopoverContent } from '../PopoverContent';
import { PopoverTrigger } from '../PopoverTrigger';

describe('Popover Integration Tests', () => {
  it('supports form usage inside content', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    const SettingsPopover = () => {
      const [notifications, setNotifications] = useState(true);

      return (
        <Popover>
          <PopoverTrigger>Settings</PopoverTrigger>
          <PopoverContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit({ notifications });
              }}
            >
              <label>
                <input
                  type='checkbox'
                  checked={notifications}
                  onChange={(event) => setNotifications(event.target.checked)}
                />
                Enable notifications
              </label>
              <button type='submit'>Save</button>
              <PopoverClose>Cancel</PopoverClose>
            </form>
          </PopoverContent>
        </Popover>
      );
    };

    render(<SettingsPopover />);

    await user.click(screen.getByRole('button', { name: 'Settings' }));
    const checkbox = await screen.findByRole('checkbox', { name: 'Enable notifications' });

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledWith({ notifications: false });
  });

  it('renders content into a custom portal container', async () => {
    const customContainer = document.createElement('div');
    customContainer.id = 'custom-portal';
    document.body.appendChild(customContainer);

    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent container={customContainer}>Portal content</PopoverContent>
      </Popover>,
    );

    const content = await screen.findByText('Portal content');
    expect(customContainer).toContainElement(content);

    document.body.removeChild(customContainer);
  });

  it('supports external controlled state synchronization', async () => {
    const user = userEvent.setup();

    const ControlledPopover = () => {
      const [open, setOpen] = useState(false);
      const [count, setCount] = useState(0);

      return (
        <div>
          <button onClick={() => setOpen((value) => !value)}>
            {open ? 'Close' : 'Open'} External
          </button>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>Internal Toggle</PopoverTrigger>
            <PopoverContent>
              <p>Count: {count}</p>
              <button onClick={() => setCount((value) => value + 1)}>Increment</button>
              <PopoverClose>Close</PopoverClose>
            </PopoverContent>
          </Popover>
        </div>
      );
    };

    render(<ControlledPopover />);

    await user.click(screen.getByRole('button', { name: 'Open External' }));
    expect(await screen.findByText('Count: 0')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => {
      expect(screen.queryByText('Count: 1')).not.toBeInTheDocument();
    });
  });

  it('keeps multiple popovers independent by allowing one to open while another closes', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Popover>
          <PopoverTrigger>Open First</PopoverTrigger>
          <PopoverContent>First content</PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger>Open Second</PopoverTrigger>
          <PopoverContent>Second content</PopoverContent>
        </Popover>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Open First' }));
    expect(await screen.findByText('First content')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open Second' }));
    expect(await screen.findByText('Second content')).toBeInTheDocument();
    expect(screen.queryByText('First content')).not.toBeInTheDocument();
    expect(screen.getByText('Second content')).toBeInTheDocument();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
