import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../index';

describe('Breadcrumb Integration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Navigation Integration', () => {
    it('should integrate with client-side routing', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();
      const mockRouter = {
        push: mockNavigate,
        pathname: '/products/shoes/running',
      };

      const TestApp = () => (
        <Breadcrumb
          onNavigate={(href, event) => {
            event.preventDefault();
            mockRouter.push(href);
          }}
        >
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products'>Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products/shoes'>Shoes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Running Shoes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      render(<TestApp />);

      await user.click(screen.getByRole('link', { name: 'Products' }));
      expect(mockNavigate).toHaveBeenCalledWith('/products');
    });

    it('should work with dynamic breadcrumb generation', () => {
      const routes = [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Products' },
        { href: '/products/electronics', label: 'Electronics' },
      ];
      const currentPage = 'Laptops';

      const DynamicBreadcrumb = () => (
        <Breadcrumb>
          <BreadcrumbList>
            {routes.map((route, index) => (
              <React.Fragment key={route.href}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={route.href}>{route.label}</BreadcrumbLink>
                </BreadcrumbItem>
                {index < routes.length - 1 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
              </React.Fragment>
            ))}
            {routes.length > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      render(<DynamicBreadcrumb />);

      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Electronics' })).toBeInTheDocument();
      expect(screen.getByText('Laptops')).toHaveAttribute('aria-current', 'page');
    });

    it('should handle URL changes and update active state', () => {
      const TestBreadcrumb = ({ currentPath }: { currentPath: string }) => {
        const isActive = (href: string) => currentPath === href;

        return (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/' disabled={isActive('/')}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href='/products' disabled={isActive('/products')}>
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Current</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        );
      };

      const { rerender } = render(<TestBreadcrumb currentPath='/' />);
      // Disabled links lose their link role, so we check by text content
      expect(screen.getByText('Home')).toHaveAttribute('aria-disabled', 'true');

      rerender(<TestBreadcrumb currentPath='/products' />);
      expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-disabled');
      // Disabled links lose their link role, so we check by text content
      expect(screen.getByText('Products')).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Form Integration', () => {
    it('should work within form elements without causing submission', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      const handleNavigate = jest.fn();

      render(
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Breadcrumb onNavigate={handleNavigate}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Form Page</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <button type='submit'>Submit Form</button>
        </form>,
      );

      await user.click(screen.getByRole('link', { name: 'Home' }));
      expect(handleNavigate).toHaveBeenCalled();
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('should integrate with form validation states', () => {
      const FormWithBreadcrumb = () => {
        const [hasError, setHasError] = useState(true);

        return (
          <div>
            <Breadcrumb disabled={hasError}>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href='/form-step-1'>Step 1</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href='/form-step-2'>Step 2</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Step 3 (Current)</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <button onClick={() => setHasError(false)}>Fix Errors</button>
          </div>
        );
      };

      render(<FormWithBreadcrumb />);

      // Initially disabled due to form errors
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-disabled', 'true');
      // Disabled links lose their link role, so we check by text content
      expect(screen.getByText('Step 1')).toHaveAttribute('aria-disabled', 'true');

      // Enable after fixing errors
      fireEvent.click(screen.getByRole('button', { name: 'Fix Errors' }));
      expect(screen.getByRole('navigation')).not.toHaveAttribute('aria-disabled');
      expect(screen.getByRole('link', { name: 'Step 1' })).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('Multi-Component Interaction', () => {
    it('should handle complex nested structures', () => {
      const ComplexBreadcrumb = () => (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>
                <span role='img' aria-label='home'>
                  🏠
                </span>{' '}
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <span role='img' aria-label='separator'>
                ▶
              </span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href='/category'>
                Category{' '}
                <span role='img' aria-label='category'>
                  📂
                </span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <span role='img' aria-label='separator'>
                ▶
              </span>
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>
                Current Page{' '}
                <span role='img' aria-label='current'>
                  📄
                </span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      render(<ComplexBreadcrumb />);

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /category/i })).toBeInTheDocument();
      expect(screen.getByText(/current page/i)).toBeInTheDocument();
    });

    it('should work with conditional rendering', () => {
      const ConditionalBreadcrumb = ({ showCategory }: { showCategory: boolean }) => (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            {showCategory && (
              <>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href='/category'>Category</BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const { rerender } = render(<ConditionalBreadcrumb showCategory={false} />);
      expect(screen.queryByRole('link', { name: 'Category' })).not.toBeInTheDocument();

      rerender(<ConditionalBreadcrumb showCategory={true} />);
      expect(screen.getByRole('link', { name: 'Category' })).toBeInTheDocument();
    });

    it('should handle multiple breadcrumbs on same page', async () => {
      const user = userEvent.setup();
      const handleNavigate1 = jest.fn();
      const handleNavigate2 = jest.fn();

      render(
        <div>
          <Breadcrumb onNavigate={handleNavigate1} data-testid='breadcrumb-1'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/home'>Home 1</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Breadcrumb onNavigate={handleNavigate2} data-testid='breadcrumb-2'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/home'>Home 2</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>,
      );

      await user.click(screen.getByRole('link', { name: 'Home 1' }));
      expect(handleNavigate1).toHaveBeenCalledWith('/home', expect.any(Object));
      expect(handleNavigate2).not.toHaveBeenCalled();

      await user.click(screen.getByRole('link', { name: 'Home 2' }));
      expect(handleNavigate2).toHaveBeenCalledWith('/home', expect.any(Object));
    });
  });

  describe('Async Operations', () => {
    it('should handle async navigation operations', async () => {
      const user = userEvent.setup();
      let resolveNavigation: (value: unknown) => void;
      const navigationPromise = new Promise((resolve) => {
        resolveNavigation = resolve;
      });

      const AsyncBreadcrumb = () => {
        const [isNavigating, setIsNavigating] = useState(false);

        const handleNavigate = async (
          href: string,
          event: React.MouseEvent<Element> | React.KeyboardEvent<Element>,
        ) => {
          event.preventDefault();
          setIsNavigating(true);
          await navigationPromise;
          setIsNavigating(false);
        };

        return (
          <Breadcrumb onNavigate={handleNavigate} disabled={isNavigating}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/home'>{isNavigating ? 'Loading...' : 'Home'}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Current</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        );
      };

      render(<AsyncBreadcrumb />);

      await user.click(screen.getByRole('link', { name: 'Home' }));
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-disabled', 'true');

      // Resolve the async operation
      await act(async () => {
        resolveNavigation!(true);
        // Wait for the next tick to allow state update
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('navigation')).not.toHaveAttribute('aria-disabled');
    });

    it('should handle loading states for dynamic breadcrumbs', () => {
      const LoadingBreadcrumb = ({ isLoading }: { isLoading: boolean }) => (
        <Breadcrumb disabled={isLoading}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{isLoading ? 'Loading...' : 'Loaded Content'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const { rerender } = render(<LoadingBreadcrumb isLoading={true} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-disabled', 'true');

      rerender(<LoadingBreadcrumb isLoading={false} />);
      expect(screen.getByText('Loaded Content')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('should handle e-commerce breadcrumb navigation', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      const EcommerceBreadcrumb = () => (
        <Breadcrumb onNavigate={mockNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator> &gt; </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href='/electronics'>Electronics</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator> &gt; </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href='/electronics/computers'>Computers</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator> &gt; </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href='/electronics/computers/laptops'>Laptops</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator> &gt; </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>MacBook Pro 16"</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      render(<EcommerceBreadcrumb />);

      // Test navigation at different levels
      await user.click(screen.getByRole('link', { name: 'Electronics' }));
      expect(mockNavigate).toHaveBeenCalledWith('/electronics', expect.any(Object));

      await user.click(screen.getByRole('link', { name: 'Computers' }));
      expect(mockNavigate).toHaveBeenCalledWith('/electronics/computers', expect.any(Object));

      // Verify current page is not clickable
      expect(screen.getByText('MacBook Pro 16"')).not.toHaveAttribute('href');
      expect(screen.getByText('MacBook Pro 16"')).toHaveAttribute('aria-current', 'page');
    });

    it('should handle admin panel breadcrumb with permissions', () => {
      const AdminBreadcrumb = ({ canAccessUsers }: { canAccessUsers: boolean }) => (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin'>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href='/admin/users' disabled={!canAccessUsers}>
                Users
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Edit User</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      const { rerender } = render(<AdminBreadcrumb canAccessUsers={false} />);
      // Disabled links lose their link role, so we check by text content
      expect(screen.getByText('Users')).toHaveAttribute('aria-disabled', 'true');

      rerender(<AdminBreadcrumb canAccessUsers={true} />);
      expect(screen.getByRole('link', { name: 'Users' })).not.toHaveAttribute('aria-disabled');
    });

    it('should handle search results breadcrumb with query', () => {
      const searchQuery = 'laptop computers';
      const SearchBreadcrumb = () => (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href='/search'>Search</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Results for "{searchQuery}"</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      render(<SearchBreadcrumb />);

      expect(screen.getByText('Results for "laptop computers"')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Search' })).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty href gracefully', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href=''>Empty Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByText('Empty Link')).toHaveAttribute('href', '');
    });

    it('should handle special characters in navigation paths', async () => {
      const user = userEvent.setup();
      const handleNavigate = jest.fn();
      const specialPath = '/products/café & restaurants';

      render(
        <Breadcrumb onNavigate={handleNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={specialPath}>Café & Restaurants</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      await user.click(screen.getByRole('link', { name: 'Café & Restaurants' }));
      expect(handleNavigate).toHaveBeenCalledWith(specialPath, expect.any(Object));
    });

    it('should handle very long breadcrumb paths', () => {
      const LongBreadcrumb = () => (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/level1'>Level 1</BreadcrumbLink>
            </BreadcrumbItem>
            {Array.from({ length: 10 }, (_, i) => (
              <React.Fragment key={`level-${i + 2}`}>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/level${i + 2}`}>Level {i + 2}</BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Final Level</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );

      render(<LongBreadcrumb />);

      expect(screen.getByRole('link', { name: 'Level 1' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Level 11' })).toBeInTheDocument();
      expect(screen.getByText('Final Level')).toBeInTheDocument();
    });

    it('should allow navigation callback to be called', async () => {
      const user = userEvent.setup();
      const handleNavigate = jest.fn();

      render(
        <Breadcrumb onNavigate={handleNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      // Navigation callback should be called with correct params
      await user.click(screen.getByRole('link', { name: 'Test' }));
      expect(handleNavigate).toHaveBeenCalledWith('/test', expect.any(Object));
      expect(handleNavigate).toHaveBeenCalledTimes(1);
    });
  });
});
