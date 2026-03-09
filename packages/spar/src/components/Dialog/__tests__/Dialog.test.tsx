import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../index';

// Mock portal rendering for testing
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (children: React.ReactNode) => children,
}));

describe('Dialog', () => {
  describe('Dialog', () => {
    it('should render children without crashing', () => {
      render(
        <Dialog>
          <div>Dialog content</div>
        </Dialog>,
      );
    });

    it('should keep ARIA id contract when custom id is provided', async () => {
      const user = userEvent.setup();

      render(
        <Dialog id='settings-dialog'>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Manage preferences</DialogDescription>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      expect(trigger).toHaveAttribute('aria-controls', 'settings-dialog-content');

      await user.click(trigger);

      const dialog = screen.getByRole('dialog');
      const title = screen.getByRole('heading', { name: 'Settings' });
      const description = screen.getByText('Manage preferences');

      expect(dialog).toHaveAttribute('id', 'settings-dialog-content');
      expect(title).toHaveAttribute('id', 'settings-dialog-title');
      expect(description).toHaveAttribute('id', 'settings-dialog-description');
      expect(dialog).toHaveAttribute('aria-labelledby', 'settings-dialog-title');
      expect(dialog).toHaveAttribute('aria-describedby', 'settings-dialog-description');
    });

    it('should use controlled mode by emitting change without opening until prop changes', async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      const { rerender } = render(
        <Dialog open={false} onOpenChange={onOpenChange}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Controlled</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Controlled</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle uncontrolled state with defaultOpen', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should set modal to true by default', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogOverlay data-testid='overlay' />
        </Dialog>,
      );

      expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'open');
    });

    it('should handle non-modal dialogs', () => {
      render(
        <Dialog modal={false} defaultOpen={true}>
          <DialogOverlay data-testid='overlay' />
        </Dialog>,
      );

      expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'open');
    });

    it('should disable all triggers when root disabled is true', async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();

      render(
        <Dialog disabled onOpenChange={onOpenChange}>
          <DialogTrigger>Open Dialog</DialogTrigger>

          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute('data-disabled', '');

      await user.click(trigger);
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should allow trigger disabled to override root disabled', async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();

      render(
        <Dialog disabled={false} onOpenChange={onOpenChange}>
          <DialogTrigger disabled>Open Dialog</DialogTrigger>

          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>,
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
        <Dialog disabled onOpenChange={onOpenChange}>
          <DialogTrigger disabled={false}>Open Dialog</DialogTrigger>

          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).not.toBeDisabled();

      await user.click(trigger);
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('DialogTrigger', () => {
    it('should render as button by default', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>,
      );

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      expect(trigger).toBeInTheDocument();
      expect(trigger.tagName).toBe('BUTTON');
    });

    it('should have proper ARIA attributes', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('data-state', 'closed');
    });

    it('should update aria-expanded when dialog opens', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>

          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveAttribute('data-state', 'open');
    });

    it('should open dialog on click', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>

          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should open dialog on Enter key', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>

          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole('button');
      trigger.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should open dialog on Space key', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>

          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole('button');
      trigger.focus();
      await user.keyboard(' ');

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not respond to events when disabled', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Dialog>
          <DialogTrigger disabled onClick={onClick}>
            Open Dialog
          </DialogTrigger>

          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute('data-disabled', '');

      await user.click(trigger);
      expect(onClick).not.toHaveBeenCalled();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should support polymorphic as prop', () => {
      render(
        <Dialog>
          <DialogTrigger as='div'>Open Dialog</DialogTrigger>
        </Dialog>,
      );

      const trigger = screen.getByText('Open Dialog');
      expect(trigger.tagName).toBe('DIV');
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    });

    it('should call custom onClick handler', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Dialog>
          <DialogTrigger onClick={onClick}>Open Dialog</DialogTrigger>
        </Dialog>,
      );

      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call custom onKeyDown handler', async () => {
      const user = userEvent.setup();
      const onKeyDown = jest.fn();
      render(
        <Dialog>
          <DialogTrigger onKeyDown={onKeyDown}>Open Dialog</DialogTrigger>
        </Dialog>,
      );

      const trigger = screen.getByRole('button');
      trigger.focus();
      await user.keyboard('{Enter}');

      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('DialogOverlay', () => {
    it('should not render when dialog is closed', () => {
      render(
        <Dialog>
          <DialogOverlay data-testid='overlay' />
        </Dialog>,
      );

      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    it('should render when dialog is open', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogOverlay data-testid='overlay' />
        </Dialog>,
      );

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
      expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'open');
    });

    it('should render when forceMount is true (without portal)', () => {
      render(
        <Dialog forceMount>
          <DialogOverlay data-testid='overlay' />
        </Dialog>,
      );

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
      expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'closed');
    });

    it('should close dialog on overlay click in modal mode', async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen={true}>
          <DialogOverlay data-testid='overlay'>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
            </DialogContent>
          </DialogOverlay>
        </Dialog>,
      );

      const overlay = screen.getByTestId('overlay');
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(overlay);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should not close dialog on content click', async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen={true}>
          <DialogOverlay data-testid='overlay'>
            <DialogContent data-testid='content'>
              <DialogTitle>Title</DialogTitle>
              <button>Inside button</button>
            </DialogContent>
          </DialogOverlay>
        </Dialog>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Inside button' }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should support polymorphic as prop', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogOverlay as='section' data-testid='overlay' />
        </Dialog>,
      );

      const overlay = screen.getByTestId('overlay');
      expect(overlay.tagName).toBe('SECTION');
    });

    it('should call custom onClick handler', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Dialog defaultOpen={true}>
          <DialogOverlay onClick={onClick} data-testid='overlay' />
        </Dialog>,
      );

      await user.click(screen.getByTestId('overlay'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('DialogContent', () => {
    it('should render with proper role', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <p>Content</p>
          </DialogContent>
        </Dialog>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogContent>
        </Dialog>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby');
      expect(dialog).toHaveAttribute('aria-describedby');
    });

    it('should support alertdialog role', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogContent role='alertdialog'>
            <DialogTitle>Alert Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('should not render when dialog is closed', () => {
      render(
        <Dialog>
          <DialogContent data-testid='content'>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('should render when forceMount is true (without portal)', () => {
      render(
        <Dialog forceMount>
          <DialogContent data-testid='content'>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toHaveAttribute('data-state', 'closed');
    });

    it('should support polymorphic as prop', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogContent as='section' data-testid='content'>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const content = screen.getByTestId('content');
      expect(content.tagName).toBe('SECTION');
      expect(content).toHaveAttribute('role', 'dialog');
    });
  });

  describe('DialogTitle', () => {
    it('should render as h2 by default', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Dialog Title');
    });

    it('should support custom heading level via data attribute', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle level={1}>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const title = screen.getByRole('heading', { name: 'Dialog Title' });
      expect(title).toHaveAttribute('data-level', '1');
    });

    it('should support polymorphic as prop', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle as='div' data-testid='title'>
              Dialog Title
            </DialogTitle>
          </DialogContent>
        </Dialog>,
      );

      const title = screen.getByTestId('title');
      expect(title.tagName).toBe('DIV');
      expect(title).toHaveTextContent('Dialog Title');
    });
  });

  describe('DialogDescription', () => {
    it('should render as paragraph by default', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>This is a description</DialogDescription>
          </DialogContent>
        </Dialog>,
      );

      const description = screen.getByText('This is a description');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
    });

    it('should support polymorphic as prop', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription as='div' data-testid='description'>
              This is a description
            </DialogDescription>
          </DialogContent>
        </Dialog>,
      );

      const description = screen.getByTestId('description');
      expect(description.tagName).toBe('DIV');
      expect(description).toHaveTextContent('This is a description');
    });
  });

  describe('DialogClose', () => {
    it('should render as button by default', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>,
      );

      const closeButton = screen.getByRole('button', { name: 'Close' });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton.tagName).toBe('BUTTON');
    });

    it('should close dialog on click', async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Close' }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should close dialog on Enter key', async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>,
      );

      const closeButton = screen.getByRole('button', { name: 'Close' });
      closeButton.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should close dialog on Space key', async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>,
      );

      const closeButton = screen.getByRole('button', { name: 'Close' });
      closeButton.focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should support polymorphic as prop', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogClose as='div' data-testid='close'>
              Close
            </DialogClose>
          </DialogContent>
        </Dialog>,
      );

      const close = screen.getByTestId('close');
      expect(close.tagName).toBe('DIV');
    });

    it('should call custom onClick handler', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogClose onClick={onClick}>Close</DialogClose>
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call custom onKeyDown handler', async () => {
      const user = userEvent.setup();
      const onKeyDown = jest.fn();
      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
            <DialogClose onKeyDown={onKeyDown}>Close</DialogClose>
          </DialogContent>
        </Dialog>,
      );

      const closeButton = screen.getByRole('button', { name: 'Close' });
      closeButton.focus();
      await user.keyboard('{Enter}');

      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Named Component API', () => {
    it('should work with named exports', () => {
      render(
        <Dialog defaultOpen={true}>
          <DialogTrigger>Open</DialogTrigger>

          <DialogOverlay>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
              <DialogDescription>Description</DialogDescription>
              <DialogClose>Close</DialogClose>
            </DialogContent>
          </DialogOverlay>
        </Dialog>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when DialogTrigger is used outside Dialog', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<DialogTrigger>Open</DialogTrigger>);
      }).toThrow('Dialog components must be used within a Dialog');

      jest.restoreAllMocks();
    });

    it('should throw error when DialogOverlay is used outside Dialog', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<DialogOverlay />);
      }).toThrow('Dialog components must be used within a Dialog');

      jest.restoreAllMocks();
    });

    it('should throw error when DialogContent is used outside Dialog', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>,
        );
      }).toThrow('Dialog components must be used within a Dialog');

      jest.restoreAllMocks();
    });
  });
});
