import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Popover } from '../Popover';
import { PopoverClose } from '../PopoverClose';
import { PopoverContent } from '../PopoverContent';
import { PopoverTrigger } from '../PopoverTrigger';

expect.extend(toHaveNoViolations);

describe('Popover Accessibility', () => {
  it('has no axe violations in closed state', async () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <h2>Popover Title</h2>
          <p>Popover content</p>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations in open modal state', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Popover modal>
        <PopoverTrigger>Open Modal</PopoverTrigger>
        <PopoverContent>
          <h2>Modal Title</h2>
          <button>Action</button>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Open Modal' }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('announces trigger/content ARIA relationship and expanded state', async () => {
    const user = userEvent.setup();

    render(
      <Popover id='a11y-popover'>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls', 'a11y-popover-content');

    await user.click(trigger);

    const content = await screen.findByText('Content');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(content).toHaveAttribute('id', 'a11y-popover-content');
  });

  it('supports required keyboard behavior: ArrowDown open and Escape close', async () => {
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

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });

  it('moves focus into content on open and restores it to trigger on close', async () => {
    const user = userEvent.setup();

    render(
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
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
