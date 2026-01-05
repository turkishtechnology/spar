import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogRoot,
  DialogTrigger,
  DialogPortal,
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
  describe('DialogRoot', () => {
    it('should render children without crashing', () => {
      render(
        <DialogRoot>
          <div>Dialog content</div>
        </DialogRoot>,
      );
    });

    it('should provide context to child components', () => {
      const TestComponent = () => {
        return (
          <DialogRoot>
            <DialogTrigger>Open</DialogTrigger>
          </DialogRoot>
        );
      };

      expect(() => render(<TestComponent />)).not.toThrow();
    });

    it('should handle controlled state', () => {
      const onOpenChange = jest.fn();
      const { rerender } = render(
        <DialogRoot isOpen={false} onOpenChange={onOpenChange}>
          <DialogTrigger>Open</DialogTrigger>
        </DialogRoot>,
      );

      rerender(
        <DialogRoot isOpen={true} onOpenChange={onOpenChange}>
          <DialogTrigger>Open</DialogTrigger>
        </DialogRoot>,
      );

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should handle uncontrolled state with defaultOpen', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should set modal to true by default', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogOverlay data-testid='overlay' />
          </DialogPortal>
        </DialogRoot>,
      );

      expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'open');
    });

    it('should handle non-modal dialogs', () => {
      render(
        <DialogRoot modal={false} defaultOpen={true}>
          <DialogPortal>
            <DialogOverlay data-testid='overlay' />
          </DialogPortal>
        </DialogRoot>,
      );

      expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'open');
    });
  });

  describe('DialogTrigger', () => {
    it('should render as button by default', () => {
      render(
        <DialogRoot>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </DialogRoot>,
      );

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      expect(trigger).toBeInTheDocument();
      expect(trigger.tagName).toBe('BUTTON');
    });

    it('should have proper ARIA attributes', () => {
      render(
        <DialogRoot>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </DialogRoot>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('data-state', 'closed');
    });

    it('should update aria-expanded when dialog opens', async () => {
      const user = userEvent.setup();
      render(
        <DialogRoot>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
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
        <DialogRoot>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should open dialog on Enter key', async () => {
      const user = userEvent.setup();
      render(
        <DialogRoot>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      const trigger = screen.getByRole('button');
      trigger.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should open dialog on Space key', async () => {
      const user = userEvent.setup();
      render(
        <DialogRoot>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
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
        <DialogRoot>
          <DialogTrigger disabled onClick={onClick}>
            Open Dialog
          </DialogTrigger>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
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
        <DialogRoot>
          <DialogTrigger as='div'>Open Dialog</DialogTrigger>
        </DialogRoot>,
      );

      const trigger = screen.getByText('Open Dialog');
      expect(trigger.tagName).toBe('DIV');
      expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    });

    it('should call custom onClick handler', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <DialogRoot>
          <DialogTrigger onClick={onClick}>Open Dialog</DialogTrigger>
        </DialogRoot>,
      );

      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call custom onKeyDown handler', async () => {
      const user = userEvent.setup();
      const onKeyDown = jest.fn();
      render(
        <DialogRoot>
          <DialogTrigger onKeyDown={onKeyDown}>Open Dialog</DialogTrigger>
        </DialogRoot>,
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
        <DialogRoot>
          <DialogPortal>
            <DialogOverlay data-testid='overlay' />
          </DialogPortal>
        </DialogRoot>,
      );

      expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    });

    it('should render when dialog is open', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogOverlay data-testid='overlay' />
          </DialogPortal>
        </DialogRoot>,
      );

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
      expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'open');
    });

    it('should render when forceMount is true (without portal)', () => {
      render(
        <DialogRoot>
          <DialogOverlay forceMount data-testid='overlay' />
        </DialogRoot>,
      );

      expect(screen.getByTestId('overlay')).toBeInTheDocument();
      expect(screen.getByTestId('overlay')).toHaveAttribute('data-state', 'closed');
    });

    it('should close dialog on overlay click in modal mode', async () => {
      const user = userEvent.setup();
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogOverlay data-testid='overlay'>
              <DialogContent>
                <DialogTitle>Title</DialogTitle>
              </DialogContent>
            </DialogOverlay>
          </DialogPortal>
        </DialogRoot>,
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
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogOverlay data-testid='overlay'>
              <DialogContent data-testid='content'>
                <DialogTitle>Title</DialogTitle>
                <button>Inside button</button>
              </DialogContent>
            </DialogOverlay>
          </DialogPortal>
        </DialogRoot>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Click on button inside content - should not close dialog
      await user.click(screen.getByRole('button', { name: 'Inside button' }));

      // Dialog should still be open after clicking content
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should support polymorphic as prop', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogOverlay as='section' data-testid='overlay' />
          </DialogPortal>
        </DialogRoot>,
      );

      const overlay = screen.getByTestId('overlay');
      expect(overlay.tagName).toBe('SECTION');
    });

    it('should call custom onClick handler', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogOverlay onClick={onClick} data-testid='overlay' />
          </DialogPortal>
        </DialogRoot>,
      );

      await user.click(screen.getByTestId('overlay'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('DialogContent', () => {
    it('should render with proper role', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
              <p>Content</p>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog description</DialogDescription>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby');
      expect(dialog).toHaveAttribute('aria-describedby');
    });

    it('should support alertdialog role', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent role='alertdialog'>
              <DialogTitle>Alert Title</DialogTitle>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });

    it('should not render when dialog is closed', () => {
      render(
        <DialogRoot>
          <DialogPortal>
            <DialogContent data-testid='content'>
              <DialogTitle>Title</DialogTitle>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('should render when forceMount is true (without portal)', () => {
      render(
        <DialogRoot>
          <DialogContent forceMount data-testid='content'>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>
        </DialogRoot>,
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toHaveAttribute('data-state', 'closed');
    });

    it('should support polymorphic as prop', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent as='section' data-testid='content'>
              <DialogTitle>Title</DialogTitle>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      const content = screen.getByTestId('content');
      expect(content.tagName).toBe('SECTION');
      expect(content).toHaveAttribute('role', 'dialog');
    });
  });

  describe('DialogTitle', () => {
    it('should render as h2 by default', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Dialog Title');
    });

    it('should support custom heading level via data attribute', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle level={1}>Dialog Title</DialogTitle>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      const title = screen.getByRole('heading', { name: 'Dialog Title' });
      expect(title).toHaveAttribute('data-level', '1');
    });

    it('should support polymorphic as prop', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle as='div' data-testid='title'>
                Dialog Title
              </DialogTitle>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      const title = screen.getByTestId('title');
      expect(title.tagName).toBe('DIV');
      expect(title).toHaveTextContent('Dialog Title');
    });
  });

  describe('DialogDescription', () => {
    it('should render as paragraph by default', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
              <DialogDescription>This is a description</DialogDescription>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      const description = screen.getByText('This is a description');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
    });

    it('should support polymorphic as prop', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
              <DialogDescription as='div' data-testid='description'>
                This is a description
              </DialogDescription>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      const description = screen.getByTestId('description');
      expect(description.tagName).toBe('DIV');
      expect(description).toHaveTextContent('This is a description');
    });
  });

  describe('DialogClose', () => {
    it('should render as button by default', () => {
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
              <DialogClose>Close</DialogClose>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      const closeButton = screen.getByRole('button', { name: 'Close' });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton.tagName).toBe('BUTTON');
    });

    it('should close dialog on click', async () => {
      const user = userEvent.setup();
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
              <DialogClose>Close</DialogClose>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
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
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
              <DialogClose>Close</DialogClose>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
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
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
              <DialogClose>Close</DialogClose>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
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
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
              <DialogClose as='div' data-testid='close'>
                Close
              </DialogClose>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      const close = screen.getByTestId('close');
      expect(close.tagName).toBe('DIV');
    });

    it('should call custom onClick handler', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
              <DialogClose onClick={onClick}>Close</DialogClose>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call custom onKeyDown handler', async () => {
      const user = userEvent.setup();
      const onKeyDown = jest.fn();
      render(
        <DialogRoot defaultOpen={true}>
          <DialogPortal>
            <DialogContent>
              <DialogTitle>Title</DialogTitle>
              <DialogClose onKeyDown={onKeyDown}>Close</DialogClose>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>,
      );

      const closeButton = screen.getByRole('button', { name: 'Close' });
      closeButton.focus();
      await user.keyboard('{Enter}');

      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Compound Component API', () => {
    it('should support dot notation access', () => {
      expect(Dialog.Root).toBe(DialogRoot);
      expect(Dialog.Trigger).toBe(DialogTrigger);
      expect(Dialog.Portal).toBe(DialogPortal);
      expect(Dialog.Overlay).toBe(DialogOverlay);
      expect(Dialog.Content).toBe(DialogContent);
      expect(Dialog.Title).toBe(DialogTitle);
      expect(Dialog.Description).toBe(DialogDescription);
      expect(Dialog.Close).toBe(DialogClose);
    });

    it('should work with dot notation', () => {
      render(
        <Dialog defaultOpen={true}>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay>
              <Dialog.Content>
                <Dialog.Title>Title</Dialog.Title>
                <Dialog.Description>Description</Dialog.Description>
                <Dialog.Close>Close</Dialog.Close>
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when DialogTrigger is used outside DialogRoot', () => {
      // Suppress console.error for this test
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<DialogTrigger>Open</DialogTrigger>);
      }).toThrow('Dialog components must be used within a DialogRoot');

      jest.restoreAllMocks();
    });

    it('should throw error when DialogOverlay is used outside DialogRoot', () => {
      // Suppress console.error for this test
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<DialogOverlay />);
      }).toThrow('Dialog components must be used within a DialogRoot');

      jest.restoreAllMocks();
    });

    it('should throw error when DialogContent is used outside DialogRoot', () => {
      // Suppress console.error for this test
      jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(
          <DialogContent>
            <DialogTitle>Title</DialogTitle>
          </DialogContent>,
        );
      }).toThrow('Dialog components must be used within a DialogRoot');

      jest.restoreAllMocks();
    });
  });
});
