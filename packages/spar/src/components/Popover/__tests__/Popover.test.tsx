import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from '../Popover';
import { PopoverTrigger } from '../PopoverTrigger';
import { PopoverContent } from '../PopoverContent';
import { PopoverArrow } from '../PopoverArrow';

import { PopoverClose } from '../PopoverClose';

describe('Popover', () => {
  it('renders children without errors', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });

  it('provides default props', () => {
    const onOpenChange = jest.fn();

    render(
      <Popover onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports controlled state with open prop', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    const { rerender } = render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Content')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    rerender(
      <Popover open={true} onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('supports uncontrolled state with defaultOpen', async () => {
    const user = userEvent.setup();

    render(
      <Popover defaultOpen={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });

  it('supports custom positioning props', () => {
    render(
      <Popover side='top' align='start' sideOffset={16}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('adds data-state attribute based on open state', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('data-state', 'closed');

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(root).toHaveAttribute('data-state', 'open');
    });
  });

  it('should disable all triggers when root disabled is true', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(
      <Popover disabled onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('data-disabled', '');

    await user.click(trigger);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('should allow trigger disabled to override root disabled', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(
      <Popover disabled={false} onOpenChange={onOpenChange}>
        <PopoverTrigger disabled>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();

    await user.click(trigger);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('should allow trigger disabled=false to override root disabled=true', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(
      <Popover disabled onOpenChange={onOpenChange}>
        <PopoverTrigger disabled={false}>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button');
    expect(trigger).not.toBeDisabled();

    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe('PopoverTrigger', () => {
  it('renders as button by default', () => {
    render(
      <Popover>
        <PopoverTrigger>Click me</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Click me' });
    expect(trigger).toBeInTheDocument();
    expect(trigger.tagName).toBe('BUTTON');
  });

  it('supports render props pattern for state access', () => {
    render(
      <Popover>
        <PopoverTrigger>{({ isOpen }) => <span>{isOpen ? 'Close' : 'Open'}</span>}</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveTextContent('Open');
  });

  it('handles disabled state', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger disabled>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('data-disabled', '');

    await user.click(trigger);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('toggles popover on click', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button');

    // Open popover
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // Close popover
    await user.click(trigger);
    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports keyboard interactions', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button');

    // Enter key to open
    fireEvent.keyDown(trigger, { key: 'Enter' });
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    // Enter key to close
    fireEvent.keyDown(trigger, { key: 'Enter' });
    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    // Space key to open
    fireEvent.keyDown(trigger, { key: ' ' });
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    // Space key to close
    fireEvent.keyDown(trigger, { key: ' ' });
    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    // Arrow down opens but doesn't close
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    // Arrow down again doesn't close
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('calls custom onClick handler', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Popover>
        <PopoverTrigger onClick={handleClick}>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('sets proper ARIA attributes', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-controls');
  });

  it('updates aria-controls when popover is open', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button');
    await user.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-controls');
    });
  });
});

describe('PopoverContent', () => {
  it('renders content when popover is open', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Test content</PopoverContent>
      </Popover>,
    );

    expect(screen.queryByText('Test content')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });
  });

  it('does not render when popover is closed', () => {
    render(
      <Popover open={false}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Test content</PopoverContent>
      </Popover>,
    );

    expect(screen.queryByText('Test content')).not.toBeInTheDocument();
  });

  it('sets proper data attributes', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent side='top' align='start'>
          Content
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      const content = screen.getByText('Content');
      expect(content).toHaveAttribute('data-state', 'open');
      // The actual placement might differ from requested due to viewport constraints
      expect(content).toHaveAttribute('data-side');
      expect(content).toHaveAttribute('data-align');
    });
  });

  it('supports modal behavior', async () => {
    const user = userEvent.setup();

    render(
      <Popover modal={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Modal content</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      const content = screen.getByText('Modal content');
      expect(content).toHaveAttribute('role', 'dialog');
      expect(content).toHaveAttribute('aria-modal', 'true');
    });
  });

  it('closes on escape key', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });

  it('closes on outside click', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
        <div>Outside element</div>
      </div>,
    );

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Outside element'));
    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });

  it('calls event handlers', async () => {
    const user = userEvent.setup();
    const onEscapeKeyDown = jest.fn();
    const onPointerDownOutside = jest.fn();
    const onOpenAutoFocus = jest.fn();

    render(
      <div>
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
            onOpenAutoFocus={onOpenAutoFocus}
          >
            Content
          </PopoverContent>
        </Popover>
        <div>Outside</div>
      </div>,
    );

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(onOpenAutoFocus).toHaveBeenCalled();
    });

    await user.keyboard('{Escape}');
    expect(onEscapeKeyDown).toHaveBeenCalled();

    // Reopen to test outside click
    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    fireEvent.pointerDown(screen.getByText('Outside'));
    expect(onPointerDownOutside).toHaveBeenCalled();
  });

  it('supports focus trapping', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent trapFocus={true}>
          <button>First</button>
          <button>Last</button>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    await waitFor(() => {
      expect(screen.getByText('First')).toBeInTheDocument();
    });

    const firstButton = screen.getByRole('button', { name: 'First' });
    const lastButton = screen.getByRole('button', { name: 'Last' });

    // Tab should cycle through buttons
    await user.tab();
    expect(lastButton).toHaveFocus();

    await user.tab();
    expect(firstButton).toHaveFocus();

    // Shift+Tab should go backwards
    await user.tab({ shift: true });
    expect(lastButton).toHaveFocus();
  });

  it('handles Home and End keys', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <button>First</button>
          <button>Middle</button>
          <button>Last</button>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));

    await waitFor(() => {
      const middleButton = screen.getByRole('button', { name: 'Middle' });
      middleButton.focus();
    });

    await user.keyboard('{Home}');
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();

    await user.keyboard('{End}');
    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
  });
});

describe('PopoverArrow', () => {
  it('renders when popover is open', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          Content
          <PopoverArrow data-testid='arrow' />
        </PopoverContent>
      </Popover>,
    );

    expect(screen.queryByTestId('arrow')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByTestId('arrow')).toBeInTheDocument();
    });
  });

  it('does not render when popover is closed', () => {
    render(
      <Popover open={false}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          Content
          <PopoverArrow data-testid='arrow' />
        </PopoverContent>
      </Popover>,
    );

    expect(screen.queryByTestId('arrow')).not.toBeInTheDocument();
  });

  it('supports custom dimensions', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          Content
          <PopoverArrow width={20} height={10} offset={5} data-testid='arrow' />
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      const arrow = screen.getByTestId('arrow');
      expect(arrow).toHaveStyle({ width: '20px', height: '10px' });
    });
  });

  it('sets presentation role', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          Content
          <PopoverArrow data-testid='arrow' />
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByTestId('arrow')).toHaveAttribute('role', 'presentation');
    });
  });
});

describe('PopoverClose', () => {
  it('renders as button by default', async () => {
    render(
      <Popover defaultOpen={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: 'Close' });
      expect(closeButton.tagName).toBe('BUTTON');
      expect(closeButton).toHaveAttribute('data-popover-close', '');
    });
  });

  it('supports render props pattern for state access', async () => {
    render(
      <Popover defaultOpen={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverClose>
            {({ isOpen }) => <span>{isOpen ? 'Close popover' : 'Hidden'}</span>}
          </PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: 'Close popover' });
      expect(closeButton).toHaveTextContent('Close popover');
      expect(closeButton).toHaveAttribute('data-popover-close', '');
    });
  });

  it('closes popover when clicked', async () => {
    const user = userEvent.setup();

    render(
      <Popover defaultOpen={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          Content
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });

  it('calls custom onClick handler', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Popover defaultOpen={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverClose onClick={handleClick}>Close</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(handleClick).toHaveBeenCalled();
  });
});

describe('Error Handling', () => {
  it('throws error when PopoverTrigger is used outside Popover', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<PopoverTrigger>Trigger</PopoverTrigger>);
    }).toThrow('Popover components must be used within Popover');

    jest.restoreAllMocks();
  });

  it('throws error when PopoverContent is used outside Popover', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<PopoverContent>Content</PopoverContent>);
    }).toThrow('Popover components must be used within Popover');

    jest.restoreAllMocks();
  });

  it('throws error when PopoverClose is used outside Popover', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<PopoverClose>Close</PopoverClose>);
    }).toThrow('Popover components must be used within Popover');

    jest.restoreAllMocks();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
