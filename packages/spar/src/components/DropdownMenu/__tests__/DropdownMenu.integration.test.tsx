import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../';

describe('DropdownMenu Integration', () => {
  beforeAll(() => {
    if (!HTMLFormElement.prototype.requestSubmit) {
      HTMLFormElement.prototype.requestSubmit = function () {
        if (this.checkValidity()) {
          this.submit();
        }
      };
    }
  });

  describe('Real-world User Workflows', () => {
    it('should handle complete file menu workflow', async () => {
      const onNewFile = jest.fn();
      const onOpenFile = jest.fn();
      const onSaveFile = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>File</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onNewFile}>New File</DropdownMenuItem>
            <DropdownMenuItem onSelect={onOpenFile}>Open File</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onSaveFile}>Save File</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      // Open menu
      const trigger = screen.getByRole('button', { name: 'File' });
      await user.click(trigger);

      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Click on "New File"
      const newFileItem = screen.getByRole('menuitem', { name: 'New File' });
      await user.click(newFileItem);

      expect(onNewFile).toHaveBeenCalled();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should handle context menu workflow', async () => {
      const onCopy = jest.fn();
      const onPaste = jest.fn();
      const onDelete = jest.fn();
      const user = userEvent.setup();

      render(
        <div>
          <div>Right-click me</div>
          <DropdownMenu>
            <DropdownMenuTrigger>Context Menu</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={onCopy}>Copy</DropdownMenuItem>
              <DropdownMenuItem onSelect={onPaste}>Paste</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>,
      );

      const trigger = screen.getByRole('button', { name: 'Context Menu' });

      // Right-click to open context menu
      await user.click(trigger);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Use keyboard navigation
      await user.keyboard('[ArrowDown]');
      await user.keyboard('[ArrowDown]');

      // Select paste with Enter
      const pasteItem = screen.getByRole('menuitem', { name: 'Paste' });
      pasteItem.focus();
      await user.keyboard('[Enter]');

      expect(onPaste).toHaveBeenCalled();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle rapid open/close interactions', async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>Rapid Toggle</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');

      // Rapid clicking
      await user.click(trigger);
      await user.click(trigger);
      await user.click(trigger);
      await user.click(trigger);

      // Should handle state correctly
      expect(onOpenChange).toHaveBeenCalledTimes(4);
    });

    it('should handle keyboard and mouse interactions together', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Mixed Interaction</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onSelect}>Item 1</DropdownMenuItem>
            <DropdownMenuItem onSelect={onSelect}>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');

      // Open with keyboard
      trigger.focus();
      await user.keyboard('[ArrowDown]');

      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Select with mouse
      const item = screen.getByRole('menuitem', { name: 'Item 1' });
      await user.click(item);

      expect(onSelect).toHaveBeenCalled();
    });

    it('should handle dynamic content updates', async () => {
      const DynamicDropdown = () => {
        const [items, setItems] = React.useState(['Item 1', 'Item 2']);
        const [open, setOpen] = React.useState(true); // Force open initially

        const handleOpenChange = (newOpen: boolean) => {
          // Keep menu open during dynamic content updates for testing
          if (!newOpen && items.length < 3) {
            return;
          }
          setOpen(newOpen);
        };

        return (
          <div>
            <button onClick={() => setItems([...items, `Item ${items.length + 1}`])}>
              Add Item
            </button>
            <DropdownMenu open={open} onOpenChange={handleOpenChange}>
              <DropdownMenuTrigger>Dynamic Menu</DropdownMenuTrigger>
              <DropdownMenuContent>
                {items.map((item: string) => (
                  <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      };

      const user = userEvent.setup();
      render(<DynamicDropdown />);

      // Wait for the menu to be initially open
      await waitFor(() => {
        const trigger = screen.getByRole('button', { name: 'Dynamic Menu' });
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
      });

      // Menu should be open by controlled state, check for initial items
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();

      // Add new item while menu is open
      const addButton = screen.getByRole('button', { name: 'Add Item' });
      await user.click(addButton);

      // New item should appear
      await waitFor(() => {
        expect(screen.getByText('Item 3')).toBeInTheDocument();
      });
    });

    it('should handle controlled and uncontrolled state switches', async () => {
      const ControlledSwitchDropdown = () => {
        const [isControlled, setIsControlled] = React.useState(false);
        const [controlledOpen, setControlledOpen] = React.useState(false);

        return (
          <div>
            <button onClick={() => setIsControlled(!isControlled)}>Toggle Control Mode</button>
            <DropdownMenu
              {...(isControlled
                ? { open: controlledOpen, onOpenChange: setControlledOpen }
                : { defaultOpen: false })}
            >
              <DropdownMenuTrigger>Switch Mode Menu</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Item 1</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div>Mode: {isControlled ? 'Controlled' : 'Uncontrolled'}</div>
          </div>
        );
      };

      const user = userEvent.setup();
      render(<ControlledSwitchDropdown />);

      // Start in uncontrolled mode
      expect(screen.getByText('Mode: Uncontrolled')).toBeInTheDocument();

      const trigger = screen.getByRole('button', { name: 'Switch Mode Menu' });
      await user.click(trigger);

      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Switch to controlled mode
      const toggleButton = screen.getByRole('button', { name: 'Toggle Control Mode' });
      await user.click(toggleButton);

      expect(screen.getByText('Mode: Controlled')).toBeInTheDocument();
    });

    it('should handle multiple dropdowns on same page', async () => {
      const onSelect1 = jest.fn();
      const onSelect2 = jest.fn();
      const user = userEvent.setup();

      render(
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>Menu 1</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={onSelect1}>Menu 1 Item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>Menu 2</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={onSelect2}>Menu 2 Item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>,
      );

      // Open first menu
      const trigger1 = screen.getByRole('button', { name: 'Menu 1' });
      await user.click(trigger1);

      // Open second menu (should close first)
      const trigger2 = screen.getByRole('button', { name: 'Menu 2' });
      await user.click(trigger2);

      // Only one menu should be open
      const menus = screen.getAllByRole('menu');
      expect(menus).toHaveLength(1);

      // Select from second menu
      const item2 = screen.getByRole('menuitem', { name: 'Menu 2 Item' });
      await user.click(item2);

      expect(onSelect2).toHaveBeenCalled();
      expect(onSelect1).not.toHaveBeenCalled();
    });
  });

  describe('Performance and Memory Management', () => {
    it('should not leak event listeners', async () => {
      let removeEventListenerCount = 0;

      // Mock document event listener methods
      const originalAddEventListener = document.addEventListener;
      const originalRemoveEventListener = document.removeEventListener;

      document.addEventListener = jest.fn((...args) => {
        return originalAddEventListener.apply(document, args);
      });

      document.removeEventListener = jest.fn((...args) => {
        removeEventListenerCount++;
        return originalRemoveEventListener.apply(document, args);
      });

      const { unmount } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Test Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      // Open and close menu
      const trigger = screen.getByRole('button');
      const user = userEvent.setup();
      await user.click(trigger);
      await user.click(trigger);

      // Unmount component
      unmount();

      // Should clean up event listeners
      expect(removeEventListenerCount).toBeGreaterThan(0);

      // Restore original methods
      document.addEventListener = originalAddEventListener;
      document.removeEventListener = originalRemoveEventListener;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
