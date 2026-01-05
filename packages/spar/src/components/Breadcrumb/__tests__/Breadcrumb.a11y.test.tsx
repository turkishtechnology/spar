import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import {
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../Breadcrumb';

expect.extend(toHaveNoViolations);

describe('Breadcrumb Accessibility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ARIA and Semantic Structure', () => {
    it('should have no axe violations - basic structure', async () => {
      const { container } = render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products'>Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no axe violations - disabled state', async () => {
      const { container } = render(
        <BreadcrumbRoot disabled>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products' disabled>
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no axe violations - external links', async () => {
      const { container } = render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='https://external.com' isExternal>
                External Link
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should provide navigation landmark', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    });

    it('should provide navigation landmark with custom label', () => {
      render(
        <BreadcrumbRoot aria-label='Page Navigation'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('navigation', { name: 'Page Navigation' })).toBeInTheDocument();
    });

    it('should mark current page with aria-current', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByText('Current Page')).toHaveAttribute('aria-current', 'page');
    });

    it('should hide separators from screen readers', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByText('/')).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have proper list structure', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });
  });

  describe('Disabled State Accessibility', () => {
    it('should handle root disabled state accessibility', () => {
      render(
        <BreadcrumbRoot disabled>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('navigation')).toHaveAttribute('aria-disabled', 'true');
      // Disabled links lose their link role, so we check by text content
      expect(screen.getByText('Test')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should handle individual link disabled state', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products' disabled>
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-disabled');
      // Disabled links lose their link role, so we check by text content
      expect(screen.getByText('Products')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should make disabled links unfocusable', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test' disabled>
                Test
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Disabled links lose their link role, so we check by text content
      expect(screen.getByText('Test')).toHaveAttribute('tabindex', '-1');
    });

    it('should remove href from disabled links', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test' disabled>
                Test
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Disabled links lose their link role, so we check by text content
      expect(screen.getByText('Test')).not.toHaveAttribute('href');
    });
  });

  describe('External Link Accessibility', () => {
    it('should handle external links with security attributes', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='https://external.com' isExternal>
                External
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should preserve custom target and rel for external links', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='https://external.com' isExternal target='_self' rel='custom'>
                External
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_self');
      expect(link).toHaveAttribute('rel', 'custom');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support Tab navigation through links', async () => {
      const user = userEvent.setup();

      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products'>Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      await user.tab();
      expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('link', { name: 'Products' })).toHaveFocus();
    });

    it('should skip disabled links in tab order', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Before</button>
          <BreadcrumbRoot>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href='/products' disabled>
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href='/about'>About</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </BreadcrumbRoot>
          <button>After</button>
        </div>,
      );

      await user.tab(); // Focus "Before" button
      await user.tab(); // Focus "Home" link
      expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();

      await user.tab(); // Should skip disabled "Products" and go to "About"
      expect(screen.getByRole('link', { name: 'About' })).toHaveFocus();

      await user.tab(); // Focus "After" button
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('should activate links with Enter key', async () => {
      const user = userEvent.setup();
      const handleNavigate = jest.fn();

      render(
        <BreadcrumbRoot onNavigate={handleNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link', { name: 'Home' });
      link.focus();
      await user.keyboard('{Enter}');

      expect(handleNavigate).toHaveBeenCalledWith('/home', expect.any(Object));
    });

    it('should activate links with Space key', async () => {
      const user = userEvent.setup();
      const handleNavigate = jest.fn();

      render(
        <BreadcrumbRoot onNavigate={handleNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link', { name: 'Home' });
      link.focus();
      await user.keyboard(' ');

      expect(handleNavigate).toHaveBeenCalledWith('/home', expect.any(Object));
    });

    it('should not activate disabled links with keyboard', async () => {
      const user = userEvent.setup();
      const handleNavigate = jest.fn();

      render(
        <BreadcrumbRoot onNavigate={handleNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home' disabled>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Disabled links lose their link role, so we check by text content
      const link = screen.getByText('Home');
      // Manually focus since disabled links have tabindex="-1"
      link.focus();
      await user.keyboard('{Enter}');

      expect(handleNavigate).not.toHaveBeenCalled();
    });

    it('should not focus current page element', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const currentPage = screen.getByText('Current Page');
      expect(currentPage).not.toHaveAttribute('tabindex');
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide proper accessible names for links', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products' aria-label='Product Catalog'>
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Product Catalog' })).toBeInTheDocument();
    });

    it('should announce disabled state to screen readers', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products' disabled>
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Disabled links lose their link role, so we check by text content
      const link = screen.getByText('Products');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });

    it('should provide context through list structure', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products'>Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Screen readers will announce this as a list with 3 items
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
  });

  describe('Focus Management', () => {
    it('should show focus indicators on focusable elements', async () => {
      const user = userEvent.setup();

      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      await user.tab();
      const link = screen.getByRole('link', { name: 'Home' });
      expect(link).toHaveFocus();
    });

    it('should not trap focus in breadcrumb', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Before</button>
          <BreadcrumbRoot>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </BreadcrumbRoot>
          <button>After</button>
        </div>,
      );

      await user.tab(); // Focus "Before"
      await user.tab(); // Focus "Home"
      await user.tab(); // Focus "After"

      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('should handle focus with polymorphic components', async () => {
      const user = userEvent.setup();
      const CustomLink = ({
        children,
        ...props
      }: {
        children: React.ReactNode;
        [key: string]: unknown;
      }) => <button {...props}>{children}</button>;

      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as={CustomLink}>Custom Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      await user.tab();
      expect(screen.getByRole('button', { name: 'Custom Link' })).toHaveFocus();
    });
  });
});
