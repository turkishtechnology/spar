import React from 'react';
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

describe('Dialog Integration Tests', () => {
  describe('Complete Dialog Workflow', () => {
    it('should handle complete user workflow: open, interact, and close', async () => {
      const onOpenChange = jest.fn();
      const onSubmit = jest.fn();
      const user = userEvent.setup();

      render(
        <Dialog onOpenChange={onOpenChange}>
          <DialogTrigger>Open Settings</DialogTrigger>

          <DialogOverlay>
            <DialogContent>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>Configure your preferences</DialogDescription>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit();
                }}
              >
                <label htmlFor='username'>Username:</label>
                <input id='username' name='username' defaultValue='john' />
                <label htmlFor='email'>Email:</label>
                <input id='email' name='email' type='email' defaultValue='john@example.com' />
                <div>
                  <button type='submit'>Save</button>
                  <DialogClose type='button'>Cancel</DialogClose>
                </div>
              </form>
            </DialogContent>
          </DialogOverlay>
        </Dialog>,
      );

      // Initial state
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(onOpenChange).not.toHaveBeenCalled();

      // Open dialog
      await user.click(screen.getByRole('button', { name: 'Open Settings' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(onOpenChange).toHaveBeenCalledWith(true);

      // Verify content is accessible
      expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
      expect(screen.getByText('Configure your preferences')).toBeInTheDocument();

      // Interact with form elements
      const usernameInput = screen.getByLabelText('Username:');
      const emailInput = screen.getByLabelText('Email:');

      await user.clear(usernameInput);
      await user.type(usernameInput, 'jane');
      expect(usernameInput).toHaveValue('jane');

      await user.clear(emailInput);
      await user.type(emailInput, 'jane@example.com');
      expect(emailInput).toHaveValue('jane@example.com');

      // Submit form
      await user.click(screen.getByRole('button', { name: 'Save' }));
      expect(onSubmit).toHaveBeenCalledTimes(1);

      // Close dialog
      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('should handle confirmation dialog workflow', async () => {
      const onConfirm = jest.fn();
      const onCancel = jest.fn();
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Delete Item</DialogTrigger>

          <DialogOverlay>
            <DialogContent role='alertdialog'>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item? This action cannot be undone.
              </DialogDescription>
              <div>
                <button
                  onClick={() => {
                    onConfirm();
                  }}
                >
                  Delete
                </button>
                <DialogClose
                  onClick={() => {
                    onCancel();
                  }}
                >
                  Cancel
                </DialogClose>
              </div>
            </DialogContent>
          </DialogOverlay>
        </Dialog>,
      );

      // Open confirmation dialog
      await user.click(screen.getByRole('button', { name: 'Delete Item' }));
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();

      // Verify it's a proper alert dialog
      expect(screen.getByRole('heading', { name: 'Confirm Deletion' })).toBeInTheDocument();
      expect(screen.getByText(/cannot be undone/)).toBeInTheDocument();

      // Test cancel action
      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onConfirm).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      });
    });

    it('should handle nested interactive elements', async () => {
      const onTabSelect = jest.fn();
      const user = userEvent.setup();

      render(
        <Dialog defaultOpen={true}>
          <DialogContent>
            <DialogTitle>Advanced Settings</DialogTitle>
            <div role='tablist'>
              <button role='tab' aria-selected={true} onClick={() => onTabSelect('general')}>
                General
              </button>
              <button role='tab' aria-selected={false} onClick={() => onTabSelect('security')}>
                Security
              </button>
            </div>
            <div role='tabpanel'>
              <h3>General Settings</h3>
              <label>
                <input type='checkbox' defaultChecked />
                Enable notifications
              </label>
              <label>
                <input type='radio' name='theme' value='light' defaultChecked />
                Light theme
              </label>
              <label>
                <input type='radio' name='theme' value='dark' />
                Dark theme
              </label>
            </div>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>,
      );

      // Interact with tabs
      await user.click(screen.getByRole('tab', { name: 'Security' }));
      expect(onTabSelect).toHaveBeenCalledWith('security');

      // Interact with form controls
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();

      const darkThemeRadio = screen.getByRole('radio', { name: 'Dark theme' });
      await user.click(darkThemeRadio);
      expect(darkThemeRadio).toBeChecked();
    });
  });

  describe('Multiple Dialogs', () => {
    it('should handle multiple independent dialogs', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Dialog>
            <DialogTrigger>Open Dialog 1</DialogTrigger>

            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
              <DialogTitle>Dialog 1</DialogTitle>
              <DialogClose>Close</DialogClose>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>Open Dialog 2</DialogTrigger>

            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
              <DialogTitle>Dialog 2</DialogTitle>
              <DialogClose>Close</DialogClose>
            </DialogContent>
          </Dialog>
        </div>,
      );

      // Open first dialog
      await user.click(screen.getByRole('button', { name: 'Open Dialog 1' }));
      expect(screen.getByRole('heading', { name: 'Dialog 1' })).toBeInTheDocument();

      // Open second dialog
      await user.click(screen.getByRole('button', { name: 'Open Dialog 2' }));
      expect(screen.getByRole('heading', { name: 'Dialog 2' })).toBeInTheDocument();

      // Both dialogs should be open
      expect(screen.getAllByRole('dialog')).toHaveLength(2);

      // Close first dialog
      const closeButtons = screen.getAllByRole('button', { name: 'Close' });
      await user.click(closeButtons[0]!);

      await waitFor(() => {
        expect(screen.getAllByRole('dialog')).toHaveLength(1);
        expect(screen.getByRole('heading', { name: 'Dialog 2' })).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle rapid open/close interactions', async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup();

      render(
        <Dialog onOpenChange={onOpenChange}>
          <DialogTrigger>Toggle Dialog</DialogTrigger>

          <DialogContent>
            <DialogTitle>Rapid Toggle Dialog</DialogTitle>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole('button', { name: 'Toggle Dialog' });

      // Rapid clicks
      await user.click(trigger);
      await user.click(trigger);
      await user.click(trigger);

      // Dialog should end up open (odd number of clicks)
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Should have been called 5 times (interactions with overlay cause extra calls)
      expect(onOpenChange).toHaveBeenCalledTimes(5);
    });

    it('should handle keyboard interactions while dialog is opening', async () => {
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>

          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <button>First Button</button>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });

      // Use keyboard to open
      trigger.focus();
      await user.keyboard('{Enter}');

      // Dialog should be open and first button focused
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'First Button' })).toHaveFocus();
      });
    });

    it('should handle controlled state changes', async () => {
      const ControlledDialog = () => {
        const [open, setOpen] = React.useState(false);

        return (
          <div>
            <button onClick={() => setOpen(true)}>External Open</button>
            <button onClick={() => setOpen(false)}>External Close</button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>Internal Toggle</DialogTrigger>

              <DialogContent>
                <DialogTitle>Controlled Dialog</DialogTitle>
                <DialogClose>Internal Close</DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        );
      };

      const user = userEvent.setup();
      render(<ControlledDialog />);

      // External control
      await user.click(screen.getByRole('button', { name: 'External Open' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'External Close' }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // Internal control
      await user.click(screen.getByRole('button', { name: 'Internal Toggle' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Internal Close' }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should handle overlay clicks with nested content', async () => {
      const user = userEvent.setup();

      render(
        <Dialog defaultOpen={true}>
          <DialogOverlay data-testid='overlay'>
            <DialogContent data-testid='content'>
              <DialogTitle>Dialog with Nested Content</DialogTitle>
              <div data-testid='nested-div'>
                <button data-testid='nested-button'>Nested Button</button>
                <div data-testid='deeply-nested'>
                  <span data-testid='deep-span'>Deep content</span>
                </div>
              </div>
            </DialogContent>
          </DialogOverlay>
        </Dialog>,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Clicking nested content should not close dialog
      await user.click(screen.getByTestId('nested-button'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByTestId('deep-span'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Clicking overlay (not content) should close dialog
      const overlay = screen.getByTestId('overlay');
      // We need to click on the overlay itself, not its children
      await user.click(overlay);
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle login form dialog', async () => {
      const onLogin = jest.fn();
      const user = userEvent.setup();

      render(
        <Dialog>
          <DialogTrigger>Sign In</DialogTrigger>

          <DialogOverlay>
            <DialogContent>
              <DialogTitle>Sign In to Your Account</DialogTitle>
              <DialogDescription>Enter your credentials to access your account</DialogDescription>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  onLogin({
                    email: formData.get('email'),
                    password: formData.get('password'),
                  });
                }}
              >
                <div>
                  <label htmlFor='email'>Email:</label>
                  <input id='email' name='email' type='email' required autoComplete='email' />
                </div>
                <div>
                  <label htmlFor='password'>Password:</label>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    required
                    autoComplete='current-password'
                  />
                </div>
                <div>
                  <label>
                    <input type='checkbox' name='remember' />
                    Remember me
                  </label>
                </div>
                <div>
                  <button type='submit'>Sign In</button>
                  <DialogClose type='button'>Cancel</DialogClose>
                </div>
              </form>
            </DialogContent>
          </DialogOverlay>
        </Dialog>,
      );

      // Open dialog
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      // Fill form
      await user.type(screen.getByLabelText('Email:'), 'user@example.com');
      await user.type(screen.getByLabelText('Password:'), 'password123');
      await user.click(screen.getByRole('checkbox', { name: 'Remember me' }));

      // Submit using the submit button inside the form
      const allSignInButtons = screen.getAllByRole('button', { name: 'Sign In' });
      const formSubmitButton = allSignInButtons.find(
        (button) => (button as HTMLButtonElement).type === 'submit',
      );
      await user.click(formSubmitButton!);

      expect(onLogin).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
      });
    });

    it('should handle image gallery dialog', async () => {
      const images = [
        { id: 1, src: '/image1.jpg', alt: 'Image 1' },
        { id: 2, src: '/image2.jpg', alt: 'Image 2' },
        { id: 3, src: '/image3.jpg', alt: 'Image 3' },
      ];

      const ImageGallery = () => {
        const [selectedImage, setSelectedImage] = React.useState<number | null>(null);

        return (
          <div>
            {images.map((image) => (
              <button key={image.id} onClick={() => setSelectedImage(image.id)}>
                View {image.alt}
              </button>
            ))}

            <Dialog
              open={selectedImage !== null}
              onOpenChange={(open) => !open && setSelectedImage(null)}
            >
              <DialogOverlay>
                <DialogContent role='dialog'>
                  <DialogTitle>Image Viewer</DialogTitle>
                  {selectedImage && (
                    <div>
                      <img
                        src={images.find((img) => img.id === selectedImage)?.src}
                        alt={images.find((img) => img.id === selectedImage)?.alt}
                      />
                      <div>
                        <button
                          onClick={() => {
                            const currentIndex = images.findIndex(
                              (img) => img.id === selectedImage,
                            );
                            const prevIndex = (currentIndex - 1 + images.length) % images.length;
                            setSelectedImage(images[prevIndex]!.id);
                          }}
                          disabled={images.length <= 1}
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => {
                            const currentIndex = images.findIndex(
                              (img) => img.id === selectedImage,
                            );
                            const nextIndex = (currentIndex + 1) % images.length;
                            setSelectedImage(images[nextIndex]!.id);
                          }}
                          disabled={images.length <= 1}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  <DialogClose>Close</DialogClose>
                </DialogContent>
              </DialogOverlay>
            </Dialog>
          </div>
        );
      };

      const user = userEvent.setup();
      render(<ImageGallery />);

      // Open image dialog
      await user.click(screen.getByRole('button', { name: 'View Image 2' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Image 2' })).toBeInTheDocument();

      // Navigate images
      await user.click(screen.getByRole('button', { name: 'Next' }));
      expect(screen.getByRole('img', { name: 'Image 3' })).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Previous' }));
      expect(screen.getByRole('img', { name: 'Image 2' })).toBeInTheDocument();

      // Close dialog
      await user.click(screen.getByRole('button', { name: 'Close' }));
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });
});
