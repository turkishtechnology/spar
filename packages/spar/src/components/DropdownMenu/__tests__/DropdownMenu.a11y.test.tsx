import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '../';

expect.extend(toHaveNoViolations);

// Cleanup after each test to handle Floating UI state updates
afterEach(() => {
  // Allow any pending state updates to complete
  act(() => {});
});

describe('DropdownMenu Accessibility', () => {
  describe('WCAG Compliance', () => {
    it('should have no accessibility violations when closed', async () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations when open', async () => {
      const { container } = render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Copy</DropdownMenuItem>
            <DropdownMenuItem>Paste</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA Attributes', () => {
    it('should have proper ARIA roles for menu structure', () => {
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

      // Trigger should have proper role and attributes
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');

      // Content should have menu role
      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveAttribute('aria-labelledby', trigger.id);

      // Items should have menuitem role
      const items = screen.getAllByRole('menuitem');
      expect(items).toHaveLength(2);

      // Separator should have separator role
      const separator = screen.getByRole('separator');
      expect(separator).toBeInTheDocument();
    });

    it('should have proper disabled state attributes', () => {
      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger disabled>Disabled Trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Enabled Item</DropdownMenuItem>
            <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('disabled');
      expect(trigger).toHaveAttribute('data-disabled');

      const items = screen.getAllByRole('menuitem');
      expect(items[0]).not.toHaveAttribute('aria-disabled');
      expect(items[1]).toHaveAttribute('aria-disabled', 'true');
      expect(items[1]).toHaveAttribute('data-disabled');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open menu with Arrow Down key', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      act(() => {
        trigger.focus();
      });

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      await user.keyboard('[ArrowDown]');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should open menu with Arrow Up key', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      act(() => {
        trigger.focus();
      });

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      await user.keyboard('[ArrowUp]');

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should toggle menu with Enter key', async () => {
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
      act(() => {
        trigger.focus();
      });

      // Open menu
      await user.keyboard('[Enter]');
      expect(screen.getByRole('menu')).toBeInTheDocument();

      // Close menu
      await user.keyboard('[Enter]');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should toggle menu with Space key', async () => {
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
      act(() => {
        trigger.focus();
      });
      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('should close menu with Escape key', async () => {
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
      act(() => {
        content.focus();
      });
      await user.keyboard('[Escape]');

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('should activate menu items with Enter key', async () => {
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
      act(() => {
        item.focus();
      });

      await user.keyboard('[Enter]');

      expect(onSelect).toHaveBeenCalled();
    });

    it('should activate menu items with Space key', async () => {
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
      act(() => {
        item.focus();
      });
      await user.keyboard(' ');

      expect(onSelect).toHaveBeenCalled();
    });

    it('should not respond to keyboard when disabled', async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger disabled>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      act(() => {
        trigger.focus();
      });

      await user.keyboard('[ArrowDown]');
      await user.keyboard('[Enter]');
      await user.keyboard('{Space}');

      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should not activate disabled menu items', async () => {
      const onSelect = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled onSelect={onSelect}>
              Disabled Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const item = screen.getByRole('menuitem');
      act(() => {
        item.focus();
      });

      await user.keyboard('[Enter]');
      await user.keyboard('{Space}');

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus within menu when open', async () => {
      render(
        <div>
          <button>Before</button>
          <DropdownMenu defaultOpen={true}>
            <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Item 1</DropdownMenuItem>
              <DropdownMenuItem>Item 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button>After</button>
        </div>,
      );

      const items = screen.getAllByRole('menuitem');

      // Focus should be manageable within menu items
      act(() => {
        items[0]?.focus();
      });
      expect(document.activeElement).toBe(items[0]);

      act(() => {
        items[1]?.focus();
      });
      expect(document.activeElement).toBe(items[1]);
    });
  });

  describe('Screen Reader Support', () => {
    it('should announce menu state changes', () => {
      const { rerender } = render(
        <DropdownMenu open={false}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      rerender(
        <DropdownMenu open={true}>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('should provide proper labels for menu structure', () => {
      render(
        <DropdownMenu defaultOpen={true}>
          <DropdownMenuTrigger>File Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Recent Files</DropdownMenuLabel>
              <DropdownMenuItem>Document 1</DropdownMenuItem>
              <DropdownMenuItem>Document 2</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByRole('button', { name: 'File Menu' });
      const menu = screen.getByRole('menu');
      const group = screen.getByRole('group');
      const label = screen.getByText('Recent Files');

      expect(menu).toHaveAttribute('aria-labelledby', trigger.id);
      expect(group).toBeInTheDocument();
      expect(label).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
