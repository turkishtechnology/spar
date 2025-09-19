import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../Breadcrumb';
import type { NavigationHandler } from '../types';

describe('Breadcrumb Integration Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Navigation workflows', () => {
    it('should handle complete breadcrumb navigation flow', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      render(
        <BreadcrumbRoot onNavigate={mockNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products'>Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products/laptops'>Laptops</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>MacBook Pro</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);

      // Navigate to home
      await user.click(links[0]!);
      expect(mockNavigate).toHaveBeenCalledWith('/', expect.any(Object));

      // Navigate to products
      await user.click(links[1]!);
      expect(mockNavigate).toHaveBeenCalledWith('/products', expect.any(Object));

      // Navigate to laptops
      await user.click(links[2]!);
      expect(mockNavigate).toHaveBeenCalledWith('/products/laptops', expect.any(Object));

      expect(mockNavigate).toHaveBeenCalledTimes(3);
    });

    it('should integrate with custom routing solutions', async () => {
      const user = userEvent.setup();
      const mockRouter = {
        push: jest.fn(),
        replace: jest.fn(),
      };

      const customNavigationHandler: NavigationHandler = (href, event) => {
        event.preventDefault();
        if (event.ctrlKey || event.metaKey) {
          mockRouter.push(href);
        } else {
          mockRouter.replace(href);
        }
      };

      render(
        <BreadcrumbRoot onNavigate={customNavigationHandler}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/dashboard'>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>›</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');

      // Regular click should use replace
      await user.click(link);
      expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      expect(mockRouter.push).not.toHaveBeenCalled();

      mockRouter.replace.mockClear();

      // Ctrl/Cmd + click should use push
      await user.keyboard('[ControlLeft>]');
      await user.click(link);
      await user.keyboard('[/ControlLeft]');
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });

  describe('Multi-component interactions', () => {
    it('should handle mixed interactive and static elements', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      render(
        <BreadcrumbRoot onNavigate={mockNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/category' disabled>
                Disabled Category
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='https://external.com' isExternal>
                External Resource
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const links = screen.getAllByRole('link');
      const separators = screen.getAllByText('/');
      const currentPage = screen.getByText('Current Page');
      const disabledLink = screen.getByText('Disabled Category');

      // Verify structure - disabled links lose link role, so we have 2 active links + 1 disabled
      expect(links).toHaveLength(2); // Home + External Resource
      expect(separators).toHaveLength(3);
      expect(currentPage).toHaveAttribute('aria-current', 'page');
      expect(disabledLink).toHaveAttribute('aria-disabled', 'true');

      // Test home navigation
      await user.click(links[0]!);
      expect(mockNavigate).toHaveBeenCalledWith('/', expect.any(Object));

      // Test disabled link doesn't navigate
      await user.click(disabledLink);
      expect(mockNavigate).toHaveBeenCalledTimes(1); // Still only 1 from home click

      // Test external link has correct attributes but doesn't use onNavigate
      expect(links[1]!).toHaveAttribute('href', 'https://external.com');
      expect(links[1]!).toHaveAttribute('target', '_blank');
      expect(links[1]!).toHaveAttribute('rel', 'noopener noreferrer');

      // Separators should be hidden from screen readers
      separators.forEach((separator) => {
        expect(separator).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('should handle context propagation across components', () => {
      const mockNavigate = jest.fn();

      const { rerender } = render(
        <BreadcrumbRoot onNavigate={mockNavigate} isDisabled={false}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      let link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test');
      expect(link).not.toHaveAttribute('aria-disabled');

      // Update root to disabled
      rerender(
        <BreadcrumbRoot onNavigate={mockNavigate} isDisabled={true}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      link = screen.getByText('Test Link'); // Disabled links lose their link role
      expect(link).not.toHaveAttribute('href');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should handle e-commerce breadcrumb scenario', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      render(
        <BreadcrumbRoot onNavigate={mockNavigate} aria-label='Product navigation'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Store</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>›</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/electronics'>Electronics</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>›</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/electronics/computers'>Computers</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>›</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/electronics/computers/laptops'>Laptops</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>›</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>MacBook Pro 16"</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Verify navigation landmark
      const nav = screen.getByLabelText('Product navigation');
      expect(nav).toBeInTheDocument();

      // Test keyboard navigation through the breadcrumb
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(4);

      // Tab through all links
      for (let i = 0; i < links.length; i++) {
        await user.tab();
        expect(links[i]!).toHaveFocus();
      }

      // Test navigation from each level
      await user.click(links[1]!); // Electronics
      expect(mockNavigate).toHaveBeenCalledWith('/electronics', expect.any(Object));

      await user.click(links[3]!); // Laptops
      expect(mockNavigate).toHaveBeenCalledWith(
        '/electronics/computers/laptops',
        expect.any(Object),
      );
    });

    it('should handle admin dashboard breadcrumb scenario', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      render(
        <BreadcrumbRoot onNavigate={mockNavigate} aria-label='Admin navigation'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin'>Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin/users'>Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin/users/permissions' disabled>
                Permissions (Restricted)
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Role</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2); // Only enabled links: Admin and Users

      const restrictedLink = screen.getByText('Permissions (Restricted)'); // Disabled link loses link role

      // Verify restricted access is properly indicated
      expect(restrictedLink).toHaveAttribute('aria-disabled', 'true');
      expect(restrictedLink).toHaveAttribute('tabIndex', '-1');

      // Test that clicking disabled link doesn't navigate
      await user.click(restrictedLink);
      expect(mockNavigate).not.toHaveBeenCalled();

      // Test that other links still work
      await user.click(links[0]!); // Admin
      expect(mockNavigate).toHaveBeenCalledWith('/admin', expect.any(Object));

      await user.click(links[1]!); // Users
      expect(mockNavigate).toHaveBeenCalledWith('/admin/users', expect.any(Object));
    });

    it('should handle documentation site breadcrumb scenario', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      render(
        <BreadcrumbRoot onNavigate={mockNavigate} aria-label='Documentation breadcrumb'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/docs'>Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>→</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/docs/components'>Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>→</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='https://github.com/repo/issues' isExternal>
                GitHub Issues
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>→</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Bug Report #123</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const links = screen.getAllByRole('link');
      const externalLink = links[2]!;

      // Test internal navigation
      await user.click(links[0]!); // Docs
      expect(mockNavigate).toHaveBeenCalledWith('/docs', expect.any(Object));

      // Test external link behavior
      expect(externalLink).toHaveAttribute('href', 'https://github.com/repo/issues');
      expect(externalLink).toHaveAttribute('target', '_blank');
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');

      // External links shouldn't trigger onNavigate
      mockNavigate.mockClear();
      await user.click(externalLink);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Dynamic breadcrumb updates', () => {
    it('should handle breadcrumb path changes', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      const { rerender } = render(
        <BreadcrumbRoot onNavigate={mockNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Page 1</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByText('Page 1')).toHaveAttribute('aria-current', 'page');

      // Navigate deeper
      rerender(
        <BreadcrumbRoot onNavigate={mockNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/page1'>Page 1</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Page 2</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByText('Page 2')).toHaveAttribute('aria-current', 'page');
      expect(screen.getByText('Page 1')).not.toHaveAttribute('aria-current');

      // Test navigation still works
      await user.click(screen.getByText('Page 1'));
      expect(mockNavigate).toHaveBeenCalledWith('/page1', expect.any(Object));
    });

    it('should handle permission-based breadcrumb changes', () => {
      const mockNavigate = jest.fn();
      const { rerender } = render(
        <BreadcrumbRoot onNavigate={mockNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin'>Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin/users'>Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>User Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      let links = screen.getAllByRole('link');
      expect(links[1]).toHaveAttribute('href', '/admin/users');
      expect(links[1]).not.toHaveAttribute('aria-disabled');

      // Permission revoked - disable the link
      rerender(
        <BreadcrumbRoot onNavigate={mockNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin'>Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin/users' disabled>
                Users
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>User Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      links = screen.getAllByRole('link');
      expect(links).toHaveLength(1); // Only Admin link remains active

      const disabledUsersLink = screen.getByText('Users'); // Disabled link loses link role
      expect(disabledUsersLink).not.toHaveAttribute('href');
      expect(disabledUsersLink).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Event propagation', () => {
    it('should handle event propagation correctly', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();
      const mockLinkClick = jest.fn();
      const mockListClick = jest.fn();

      render(
        <BreadcrumbRoot onNavigate={mockNavigate}>
          <BreadcrumbList onClick={mockListClick}>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test' onClick={mockLinkClick}>
                Test Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      await user.click(link);

      expect(mockLinkClick).toHaveBeenCalledTimes(1);
      expect(mockListClick).toHaveBeenCalledTimes(1);
      expect(mockNavigate).not.toHaveBeenCalled(); // onClick should prevent onNavigate
    });

    it('should prevent default navigation when custom onClick is provided', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();
      const mockPreventDefault = jest.fn((event) => {
        event.preventDefault();
      });

      render(
        <BreadcrumbRoot onNavigate={mockNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test' onClick={mockPreventDefault}>
                Custom Handler
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      await user.click(link);

      expect(mockPreventDefault).toHaveBeenCalledTimes(1);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
