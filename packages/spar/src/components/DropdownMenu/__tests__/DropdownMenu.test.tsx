import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '../';

describe('DropdownMenu', () => {
  describe('DropdownMenu', () => {
    it('should render children without crashing', () => {
      render(
        <DropdownMenu>
          <div>Test content</div>
        </DropdownMenu>,
      );
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should manage open state when uncontrolled', () => {
      const onOpenChange = jest.fn();
      render(
        <DropdownMenu defaultOpen={true} onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should respect controlled open state', async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      const { rerender } = render(
        <DropdownMenu open={false} onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      rerender(
        <DropdownMenu open={true} onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should derive trigger and content ids from provided id', () => {
      render(
        <DropdownMenu id='file-menu' defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button', { name: 'Open Menu' });
      const menu = screen.getByRole('menu');

      expect(trigger).toHaveAttribute('id', 'file-menu-trigger');
      expect(trigger).toHaveAttribute('aria-controls', 'file-menu-content');
      expect(menu).toHaveAttribute('id', 'file-menu-content');
      expect(menu).toHaveAttribute('aria-labelledby', 'file-menu-trigger');
    });

    it('should call onOpenChange when state changes', async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button', { name: 'Open Menu' });
      await user.click(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('should disable all triggers when root disabled is true', async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();

      render(
        <DropdownMenu disabled onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute('data-disabled');

      await user.click(trigger);
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should allow trigger disabled to override root disabled', async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();

      render(
        <DropdownMenu disabled={false} onOpenChange={onOpenChange}>
          <DropdownMenuTrigger disabled>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
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
        <DropdownMenu disabled onOpenChange={onOpenChange}>
          <DropdownMenuTrigger disabled={false}>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).not.toBeDisabled();

      await user.click(trigger);
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('DropdownMenuTrigger', () => {
    it('should render as button by default', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Open Menu');
    });

    it('should have proper ARIA attributes when closed', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      expect(trigger).toHaveAttribute('data-state', 'closed');
      expect(trigger).toHaveAttribute('aria-controls');
    });

    it('should have proper ARIA attributes when open', () => {
      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      const content = screen.getByRole('menu');

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveAttribute('aria-controls', content.id);
      expect(trigger).toHaveAttribute('data-state', 'open');
    });

    it('should toggle menu on click', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      await user.click(trigger);
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await user.click(trigger);
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should open menu on Arrow Down key', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      trigger.focus();

      await user.keyboard('[ArrowDown]');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should open menu on Arrow Up key', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      trigger.focus();

      await user.keyboard('[ArrowUp]');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should toggle menu on Enter key', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      trigger.focus();

      await user.keyboard('[Enter]');
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await user.keyboard('[Enter]');
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should toggle menu on Space key', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      trigger.focus();

      await user.keyboard(' ');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should respect disabled state', async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();

      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger disabled>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
      expect(trigger).toHaveAttribute('data-disabled');

      await user.click(trigger);
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should call custom onClick handler', async () => {
      const onClick = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger onClick={onClick}>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      expect(onClick).toHaveBeenCalled();
    });

    it('should call custom onKeyDown handler', async () => {
      const onKeyDown = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger onKeyDown={onKeyDown}>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      trigger.focus();
      await user.keyboard('[ArrowDown]');

      expect(onKeyDown).toHaveBeenCalled();
    });

    it('should support custom component via as prop', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger as='div'>Open Menu</DropdownMenuTrigger>
        </DropdownMenu>,
      );

      const trigger = screen.getByText('Open Menu');
      expect(trigger.tagName).toBe('DIV');
    });
  });

  describe('DropdownMenuContent', () => {
    it('should not render when menu is closed', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should render when menu is open', () => {
      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const content = screen.getByRole('menu');
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute('data-state', 'open');
    });

    it('should have proper ARIA attributes', () => {
      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const content = screen.getByRole('menu');
      const trigger = screen.getByRole('button');

      expect(content).toHaveAttribute('aria-labelledby', trigger.id);
      expect(content).toHaveAttribute('role', 'menu');
    });

    it('should support side and align props', () => {
      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent side='top' align='end'>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const content = screen.getByRole('menu');
      expect(content).toHaveAttribute('data-side', 'top');
      expect(content).toHaveAttribute('data-align', 'end');
    });

    it('should close on Escape key', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByRole('menu')).toBeInTheDocument();

      const content = screen.getByRole('menu');
      content.focus();
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should call onEscapeKeyDown when provided', async () => {
      const onEscapeKeyDown = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent onEscapeKeyDown={onEscapeKeyDown}>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const content = screen.getByRole('menu');
      await act(async () => {
        content.focus();
      });

      await act(async () => {
        await user.keyboard('[Escape]');
      });

      expect(onEscapeKeyDown).toHaveBeenCalled();
    });

    it('should not close on Tab key in non-modal mode', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu defaultOpen={true} modal={false}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByRole('menu')).toBeInTheDocument();

      const content = screen.getByRole('menu');
      content.focus();
      await user.keyboard('{Tab}');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuItem', () => {
    it('should render as div by default', () => {
      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const item = screen.getByRole('menuitem');
      expect(item).toBeInTheDocument();
      expect(item.tagName).toBe('DIV');
    });

    it('should keep disabled item non-focusable and announced', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem disabled>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      const items = screen.getAllByRole('menuitem');
      const enabledItem = items[0];
      const disabledItem = items[1];

      expect(enabledItem).toHaveAttribute('role', 'menuitem');
      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
      expect(disabledItem).toHaveAttribute('data-disabled');

      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        expect(enabledItem).toHaveAttribute('tabIndex', '0');
      });
      expect(disabledItem).toHaveAttribute('tabIndex', '-1');
    });

    it('should call onSelect on click', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onSelect}>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const item = screen.getByRole('menuitem');
      await user.click(item);

      expect(onSelect).toHaveBeenCalled();
    });

    it('should call onSelect on Enter key', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onSelect}>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const item = screen.getByRole('menuitem');
      item.focus();
      await user.keyboard('[Enter]');

      expect(onSelect).toHaveBeenCalled();
    });

    it('should call onSelect on Space key', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onSelect}>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const item = screen.getByRole('menuitem');
      item.focus();
      await user.keyboard(' ');

      expect(onSelect).toHaveBeenCalled();
    });

    it('should not call onSelect when disabled', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onSelect} disabled>
              Item 1
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const item = screen.getByRole('menuitem');
      await user.click(item);

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should close menu after selection with closeOnSelect=true', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu closeOnSelect={true} defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByRole('menu')).toBeInTheDocument();

      const item = screen.getByRole('menuitem');
      await user.click(item);

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should close menu after keyboard selection with closeOnSelect=true', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu closeOnSelect={true} defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const item = screen.getByRole('menuitem');
      item.focus();
      await user.keyboard('[Enter]');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Open Menu' }));

      const reopenedItem = screen.getByRole('menuitem');
      reopenedItem.focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should not close menu after selection with closeOnSelect=false', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu closeOnSelect={false} defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByRole('menu')).toBeInTheDocument();

      const item = screen.getByRole('menuitem');
      await user.click(item);

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

  describe('DropdownMenuSeparator', () => {
    it('should render with proper role and attributes', () => {
      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const separator = screen.getByRole('separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });
  });

  describe('DropdownMenuLabel', () => {
    it('should render as div by default', () => {
      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Menu Label</DropdownMenuLabel>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const label = screen.getByText('Menu Label');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('DIV');
    });
  });

  describe('DropdownMenuGroup', () => {
    it('should render with proper role', () => {
      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Item 1</DropdownMenuItem>
              <DropdownMenuItem>Item 2</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const groups = screen.getAllByRole('group');
      expect(groups).toHaveLength(1);
    });
  });

  describe('Context errors', () => {
    it('should throw error when DropdownMenuTrigger is used outside DropdownMenu', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<DropdownMenuTrigger>Trigger</DropdownMenuTrigger>);
      }).toThrow('DropdownMenu components must be used within DropdownMenu');

      consoleSpy.mockRestore();
    });

    it('should throw error when DropdownMenuContent is used outside DropdownMenu', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<DropdownMenuContent>Content</DropdownMenuContent>);
      }).toThrow('DropdownMenu components must be used within DropdownMenu');

      consoleSpy.mockRestore();
    });

    it('should throw error when DropdownMenuItem is used outside DropdownMenu', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<DropdownMenuItem>Item</DropdownMenuItem>);
      }).toThrow('DropdownMenu items must be rendered within DropdownMenuContent');

      consoleSpy.mockRestore();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
