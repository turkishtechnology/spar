import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '../';

describe('DropdownMenu Integration', () => {
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

    it('should handle preferences menu with mixed controls', async () => {
      const onThemeChange = jest.fn();
      const onShowToolbarToggle = jest.fn();
      const onShowSidebarToggle = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu closeOnSelect={false}>
          <DropdownMenuTrigger>Preferences</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuRadioGroup value='light' onValueChange={onThemeChange}>
                <DropdownMenuRadioItem value='light'>Light Theme</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='dark'>Dark Theme</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='auto'>Auto Theme</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>View Options</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked={true} onCheckedChange={onShowToolbarToggle}>
                Show Toolbar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={false} onCheckedChange={onShowSidebarToggle}>
                Show Sidebar
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      // Open preferences menu
      const trigger = screen.getByRole('button', { name: 'Preferences' });
      await user.click(trigger);

      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Change theme to dark
      const darkTheme = screen.getByRole('menuitemradio', { name: 'Dark Theme' });
      await user.click(darkTheme);

      expect(onThemeChange).toHaveBeenCalledWith('dark');
      expect(screen.getByRole('menu')).toBeInTheDocument(); // Menu stays open

      // Toggle sidebar
      const sidebarToggle = screen.getByRole('menuitemcheckbox', { name: 'Show Sidebar' });
      await user.click(sidebarToggle);

      expect(onShowSidebarToggle).toHaveBeenCalledWith(true);
      expect(screen.getByRole('menu')).toBeInTheDocument(); // Menu stays open

      // Close menu by clicking outside
      await user.click(document.body);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
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

    it('should handle submenu navigation workflow', async () => {
      const onNewDocument = jest.fn();
      const onNewSpreadsheet = jest.fn();
      const onOpenRecent1 = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>File</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>New</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={onNewDocument}>Document</DropdownMenuItem>
                <DropdownMenuItem onSelect={onNewSpreadsheet}>Spreadsheet</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Open Recent</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={onOpenRecent1}>Document 1.txt</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      // Open main menu
      const trigger = screen.getByRole('button', { name: 'File' });
      await user.click(trigger);

      // Click on "New" submenu trigger
      const newSubmenu = screen.getByText('New');
      await user.click(newSubmenu);

      // Wait for submenu content to appear
      await waitFor(() => {
        expect(screen.getByText('Document')).toBeInTheDocument();
      });

      // Click on Document
      const documentItem = screen.getByRole('menuitem', { name: 'Document' });
      await user.click(documentItem);

      expect(onNewDocument).toHaveBeenCalled();
    });

    it('should handle complex form integration', async () => {
      const onSubmit = jest.fn();
      const user = userEvent.setup();

      const FormWithDropdown = () => {
        const [selectedOption, setSelectedOption] = React.useState('');
        const [notifications, setNotifications] = React.useState(false);

        return (
          <form onSubmit={onSubmit}>
            <label htmlFor='name'>Name:</label>
            <input id='name' name='name' type='text' />

            <DropdownMenu>
              <DropdownMenuTrigger>Select Priority</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  <DropdownMenuRadioItem value='low'>Low</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='medium'>Medium</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value='high'>High</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={notifications}
                  onCheckedChange={setNotifications}
                >
                  Enable Notifications
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div>Selected: {selectedOption || 'None'}</div>
            <div>Notifications: {notifications ? 'On' : 'Off'}</div>

            <button type='submit'>Submit</button>
          </form>
        );
      };

      render(<FormWithDropdown />);

      // Fill in name
      const nameInput = screen.getByLabelText('Name:');
      await user.type(nameInput, 'John Doe');

      // Open dropdown and select priority
      const dropdownTrigger = screen.getByRole('button', { name: 'Select Priority' });
      await user.click(dropdownTrigger);

      const mediumOption = screen.getByRole('menuitemradio', { name: 'Medium' });
      await user.click(mediumOption);

      expect(screen.getByText('Selected: medium')).toBeInTheDocument();

      // Toggle notifications
      const notificationsToggle = screen.getByRole('menuitemcheckbox', {
        name: 'Enable Notifications',
      });
      await user.click(notificationsToggle);

      expect(screen.getByText('Notifications: On')).toBeInTheDocument();

      // Close dropdown by clicking outside
      await user.click(nameInput);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });

      // Submit form
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      expect(onSubmit).toHaveBeenCalled();
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
