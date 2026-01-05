import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PopoverRoot } from '../Popover';
import { PopoverTrigger } from '../PopoverTrigger';
import { PopoverContent } from '../PopoverContent';
import { PopoverArrow } from '../PopoverArrow';
import { PopoverAnchor } from '../PopoverAnchor';
import { PopoverPortal } from '../PopoverPortal';
import { PopoverClose } from '../PopoverClose';

describe('PopoverRoot', () => {
  it('renders children without errors', () => {
    render(
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
    );
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });

  it('provides default props', () => {
    const onOpenChange = jest.fn();

    render(
      <PopoverRoot onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports controlled state with open prop', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    const { rerender } = render(
      <PopoverRoot open={false} onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Content')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(true);

    rerender(
      <PopoverRoot open={true} onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('supports uncontrolled state with defaultOpen', async () => {
    const user = userEvent.setup();

    render(
      <PopoverRoot defaultOpen={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
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
      <PopoverRoot side='top' align='start' sideOffset={16}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('adds data-state attribute based on open state', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('data-state', 'closed');

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(root).toHaveAttribute('data-state', 'open');
    });
  });
});

describe('PopoverTrigger', () => {
  it('renders as button by default', () => {
    render(
      <PopoverRoot>
        <PopoverTrigger>Click me</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
    );

    const trigger = screen.getByRole('button', { name: 'Click me' });
    expect(trigger).toBeInTheDocument();
    expect(trigger.tagName).toBe('BUTTON');
  });

  it('supports asChild prop for custom elements', () => {
    render(
      <PopoverRoot>
        <PopoverTrigger asChild>
          <div role='button'>Custom trigger</div>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
    );

    const trigger = screen.getByRole('button', { name: 'Custom trigger' });
    expect(trigger.tagName).toBe('DIV');
  });

  it('handles disabled state', async () => {
    const user = userEvent.setup();

    render(
      <PopoverRoot>
        <PopoverTrigger disabled>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
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
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
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
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
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
      <PopoverRoot>
        <PopoverTrigger onClick={handleClick}>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('sets proper ARIA attributes', () => {
    render(
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).not.toHaveAttribute('aria-controls');
  });

  it('updates aria-controls when popover is open', async () => {
    const user = userEvent.setup();

    render(
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
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
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Test content</PopoverContent>
      </PopoverRoot>,
    );

    expect(screen.queryByText('Test content')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });
  });

  it('does not render when popover is closed', () => {
    render(
      <PopoverRoot open={false}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Test content</PopoverContent>
      </PopoverRoot>,
    );

    expect(screen.queryByText('Test content')).not.toBeInTheDocument();
  });

  it('sets proper data attributes', async () => {
    const user = userEvent.setup();

    render(
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent side='top' align='start'>
          Content
        </PopoverContent>
      </PopoverRoot>,
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
      <PopoverRoot modal={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Modal content</PopoverContent>
      </PopoverRoot>,
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
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
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
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </PopoverRoot>
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
        <PopoverRoot>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
            onOpenAutoFocus={onOpenAutoFocus}
          >
            Content
          </PopoverContent>
        </PopoverRoot>
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
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent trapFocus={true}>
          <button>First</button>
          <button>Last</button>
        </PopoverContent>
      </PopoverRoot>,
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
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <button>First</button>
          <button>Middle</button>
          <button>Last</button>
        </PopoverContent>
      </PopoverRoot>,
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
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          Content
          <PopoverArrow data-testid='arrow' />
        </PopoverContent>
      </PopoverRoot>,
    );

    expect(screen.queryByTestId('arrow')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByTestId('arrow')).toBeInTheDocument();
    });
  });

  it('does not render when popover is closed', () => {
    render(
      <PopoverRoot open={false}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          Content
          <PopoverArrow data-testid='arrow' />
        </PopoverContent>
      </PopoverRoot>,
    );

    expect(screen.queryByTestId('arrow')).not.toBeInTheDocument();
  });

  it('supports custom dimensions', async () => {
    const user = userEvent.setup();

    render(
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          Content
          <PopoverArrow width={20} height={10} offset={5} data-testid='arrow' />
        </PopoverContent>
      </PopoverRoot>,
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
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          Content
          <PopoverArrow data-testid='arrow' />
        </PopoverContent>
      </PopoverRoot>,
    );

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByTestId('arrow')).toHaveAttribute('role', 'presentation');
    });
  });
});

describe('PopoverAnchor', () => {
  it('renders as div by default', () => {
    render(
      <PopoverRoot>
        <PopoverAnchor data-testid='anchor'>Anchor</PopoverAnchor>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
    );

    const anchor = screen.getByTestId('anchor');
    expect(anchor.tagName).toBe('DIV');
    expect(anchor).toHaveAttribute('data-popover-anchor', '');
  });

  it('supports asChild prop', () => {
    render(
      <PopoverRoot>
        <PopoverAnchor asChild>
          <span data-testid='anchor'>Custom anchor</span>
        </PopoverAnchor>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </PopoverRoot>,
    );

    const anchor = screen.getByTestId('anchor');
    expect(anchor.tagName).toBe('SPAN');
    expect(anchor).toHaveAttribute('data-popover-anchor', '');
  });
});

describe('PopoverPortal', () => {
  it('renders children in document.body by default', () => {
    render(
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverPortal>
          <div data-testid='portal-content'>Portal content</div>
        </PopoverPortal>
      </PopoverRoot>,
    );

    const portalContent = screen.getByTestId('portal-content');
    expect(portalContent).toBeInTheDocument();
    expect(document.body).toContainElement(portalContent);
  });

  it('renders children in custom container', () => {
    const customContainer = document.createElement('div');
    document.body.appendChild(customContainer);

    render(
      <PopoverRoot>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverPortal container={customContainer}>
          <div data-testid='portal-content'>Portal content</div>
        </PopoverPortal>
      </PopoverRoot>,
    );

    const portalContent = screen.getByTestId('portal-content');
    expect(portalContent).toBeInTheDocument();
    expect(customContainer).toContainElement(portalContent);

    document.body.removeChild(customContainer);
  });
});

describe('PopoverClose', () => {
  it('renders as button by default', async () => {
    render(
      <PopoverRoot defaultOpen={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </PopoverRoot>,
    );

    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: 'Close' });
      expect(closeButton.tagName).toBe('BUTTON');
      expect(closeButton).toHaveAttribute('data-popover-close', '');
    });
  });

  it('supports asChild prop', async () => {
    render(
      <PopoverRoot defaultOpen={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverClose asChild>
            <div role='button'>Custom close</div>
          </PopoverClose>
        </PopoverContent>
      </PopoverRoot>,
    );

    await waitFor(() => {
      const closeButton = screen.getByRole('button', { name: 'Custom close' });
      expect(closeButton.tagName).toBe('DIV');
      expect(closeButton).toHaveAttribute('data-popover-close', '');
    });
  });

  it('closes popover when clicked', async () => {
    const user = userEvent.setup();

    render(
      <PopoverRoot defaultOpen={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          Content
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </PopoverRoot>,
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
      <PopoverRoot defaultOpen={true}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverClose onClick={handleClick}>Close</PopoverClose>
        </PopoverContent>
      </PopoverRoot>,
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(handleClick).toHaveBeenCalled();
  });
});

describe('Error Handling', () => {
  it('throws error when PopoverTrigger is used outside PopoverRoot', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<PopoverTrigger>Trigger</PopoverTrigger>);
    }).toThrow('Popover components must be used within PopoverRoot');

    jest.restoreAllMocks();
  });

  it('throws error when PopoverContent is used outside PopoverRoot', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<PopoverContent>Content</PopoverContent>);
    }).toThrow('Popover components must be used within PopoverRoot');

    jest.restoreAllMocks();
  });

  it('throws error when PopoverClose is used outside PopoverRoot', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<PopoverClose>Close</PopoverClose>);
    }).toThrow('Popover components must be used within PopoverRoot');

    jest.restoreAllMocks();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
