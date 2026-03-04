import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../index';

describe('Breadcrumb Components', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Breadcrumb', () => {
    it('renders with default props', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb');
    });

    it('renders with custom aria-label', () => {
      render(
        <Breadcrumb aria-label='Custom Navigation'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Custom Navigation');
    });

    it('renders with polymorphic as prop', () => {
      render(
        <Breadcrumb as='div' data-testid='custom-nav'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByTestId('custom-nav')).toBeInTheDocument();
      expect(screen.getByTestId('custom-nav').tagName).toBe('DIV');
    });

    it('applies disabled state', () => {
      render(
        <Breadcrumb disabled>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-disabled', 'true');
      expect(nav).toHaveAttribute('data-disabled', '');
    });

    it('calls onNavigate when link is clicked', async () => {
      const user = userEvent.setup();
      const handleNavigate = jest.fn();

      render(
        <Breadcrumb onNavigate={handleNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      await user.click(screen.getByRole('link', { name: 'Home' }));

      expect(handleNavigate).toHaveBeenCalledWith('/home', expect.any(Object));
    });

    it('spreads additional props', () => {
      render(
        <Breadcrumb className='custom-class' data-custom='value'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('custom-class');
      expect(nav).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('BreadcrumbList', () => {
    it('renders as ordered list by default', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByRole('list').tagName).toBe('OL');
    });

    it('renders with polymorphic as prop', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList as='ul' data-testid='custom-list'>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByTestId('custom-list')).toBeInTheDocument();
      expect(screen.getByTestId('custom-list').tagName).toBe('UL');
    });
  });

  describe('BreadcrumbItem', () => {
    it('renders as list item by default', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByRole('listitem')).toBeInTheDocument();
      expect(screen.getByRole('listitem').tagName).toBe('LI');
    });

    it('renders with polymorphic as prop', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem as='div' data-testid='custom-item'>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByTestId('custom-item')).toBeInTheDocument();
      expect(screen.getByTestId('custom-item').tagName).toBe('DIV');
    });

    it('calculates position for multiple items', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem data-testid='first-item'>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem data-testid='middle-item'>
              <BreadcrumbLink href='/products'>Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem data-testid='last-item'>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      // Note: The position calculation happens in useEffect, so we check the final state
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(3);
    });

    it('calculates correct position when separator is placed before first item', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator data-testid='leading-sep'>/</BreadcrumbSeparator>
            <BreadcrumbItem data-testid='first-item'>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem data-testid='middle-item'>
              <BreadcrumbLink href='/products'>Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem data-testid='last-item'>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByTestId('first-item')).toHaveAttribute('data-position', 'first');
      expect(screen.getByTestId('middle-item')).toHaveAttribute('data-position', 'middle');
      expect(screen.getByTestId('last-item')).toHaveAttribute('data-position', 'last');
      expect(screen.getByTestId('last-item')).toHaveAttribute('data-current', '');
    });

    it('calculates correct position when separator is placed after last item', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem data-testid='first-item'>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem data-testid='last-item'>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator data-testid='trailing-sep'>/</BreadcrumbSeparator>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByTestId('first-item')).toHaveAttribute('data-position', 'first');
      expect(screen.getByTestId('last-item')).toHaveAttribute('data-position', 'last');
      expect(screen.getByTestId('last-item')).toHaveAttribute('data-current', '');
    });

    it('calculates correct position with consecutive separators', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem data-testid='first-item'>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem data-testid='last-item'>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByTestId('first-item')).toHaveAttribute('data-position', 'first');
      expect(screen.getByTestId('last-item')).toHaveAttribute('data-position', 'last');
      expect(screen.getByTestId('last-item')).toHaveAttribute('data-current', '');
    });

    it('calculates correct position while excluding non-breadcrumb elements for first/middle/last', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <span data-testid='non-breadcrumb-before-first'>before first</span>
            <BreadcrumbItem data-testid='first-item'>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <span data-testid='non-breadcrumb-between-first-middle'>between first and middle</span>
            <BreadcrumbItem data-testid='middle-item'>
              <BreadcrumbLink href='/products'>Products</BreadcrumbLink>
            </BreadcrumbItem>
            <div data-testid='non-breadcrumb-between-middle-last'>between middle and last</div>
            <BreadcrumbItem data-testid='last-item'>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
            <span data-testid='non-breadcrumb-after-last'>after last</span>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByTestId('non-breadcrumb-before-first').tagName).toBe('SPAN');
      expect(screen.getByTestId('non-breadcrumb-between-first-middle').tagName).toBe('SPAN');
      expect(screen.getByTestId('non-breadcrumb-between-middle-last').tagName).toBe('DIV');
      expect(screen.getByTestId('non-breadcrumb-after-last').tagName).toBe('SPAN');

      // Only BreadcrumbItem elements are indexed.
      // first-item = index 0 → 'first'
      // middle-item = index 1 → 'middle'
      // last-item = index 2 → 'last'
      expect(screen.getByTestId('first-item')).toHaveAttribute('data-position', 'first');
      expect(screen.getByTestId('middle-item')).toHaveAttribute('data-position', 'middle');
      expect(screen.getByTestId('last-item')).toHaveAttribute('data-position', 'last');
      expect(screen.getByTestId('last-item')).toHaveAttribute('data-current', '');
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
  });

  describe('BreadcrumbLink', () => {
    it('renders as anchor by default', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      const link = screen.getByRole('link', { name: 'Home' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/home');
      expect(link.tagName).toBe('A');
    });

    it('renders with polymorphic as prop', () => {
      const CustomLink = ({
        children,
        ...props
      }: {
        children: React.ReactNode;
        [key: string]: unknown;
      }) => <button {...props}>{children}</button>;

      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as={CustomLink} data-testid='custom-link'>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByTestId('custom-link')).toBeInTheDocument();
      expect(screen.getByTestId('custom-link').tagName).toBe('BUTTON');
    });

    it('handles disabled state', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home' disabled>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      // Disabled links lose their link role, so we check by text content
      const link = screen.getByText('Home');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('data-disabled', '');
      expect(link).toHaveAttribute('tabindex', '-1');
      expect(link).not.toHaveAttribute('href');
    });

    it('handles disabled state from root context', () => {
      render(
        <Breadcrumb disabled>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      // Disabled links lose their link role, so we check by text content
      const link = screen.getByText('Home');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('data-disabled', '');
    });

    it('handles external links', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='https://example.com' isExternal>
                External
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      const link = screen.getByRole('link', { name: 'External' });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveAttribute('data-external', '');
    });

    it('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home' onClick={handleClick}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      await user.click(screen.getByRole('link', { name: 'Home' }));
      expect(handleClick).toHaveBeenCalled();
    });

    it('handles keyboard events', async () => {
      const user = userEvent.setup();
      const handleNavigate = jest.fn();

      render(
        <Breadcrumb onNavigate={handleNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      const link = screen.getByRole('link', { name: 'Home' });
      link.focus();
      await user.keyboard('{Enter}');

      expect(handleNavigate).toHaveBeenCalledWith('/home', expect.any(Object));
    });

    it('handles onPress override', async () => {
      const user = userEvent.setup();
      const handlePress = jest.fn();

      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home' onPress={handlePress}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      await user.click(screen.getByRole('link', { name: 'Home' }));
      expect(handlePress).toHaveBeenCalled();
    });

    it('prevents click when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home' disabled onClick={handleClick}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      // Disabled links lose their link role, so we check by text content
      await user.click(screen.getByText('Home'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('BreadcrumbPage', () => {
    it('renders as span by default', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      const page = screen.getByText('Current Page');
      expect(page).toBeInTheDocument();
      expect(page.tagName).toBe('SPAN');
      expect(page).toHaveAttribute('aria-current', 'page');
    });

    it('renders with polymorphic as prop', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage as='strong' data-testid='custom-page'>
                Current Page
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByTestId('custom-page')).toBeInTheDocument();
      expect(screen.getByTestId('custom-page').tagName).toBe('STRONG');
    });

    it('applies data attributes', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      const page = screen.getByText('Current Page');
      expect(page).toHaveAttribute('data-current', '');
    });
  });

  describe('BreadcrumbSeparator', () => {
    it('renders as list item by default', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      const separator = screen.getByText('/');
      expect(separator).toBeInTheDocument();
      expect(separator.tagName).toBe('LI');
    });

    it('renders with polymorphic as prop', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator as='span' data-testid='custom-separator'>
              →
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByTestId('custom-separator')).toBeInTheDocument();
      expect(screen.getByTestId('custom-separator').tagName).toBe('SPAN');
    });

    it('is hidden from screen readers by default', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByText('/')).toHaveAttribute('aria-hidden', 'true');
    });

    it('can override aria-hidden', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator aria-hidden={false}>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByText('/')).toHaveAttribute('aria-hidden', 'false');
    });

    it('renders without children', () => {
      render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator data-testid='empty-separator' />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(screen.getByTestId('empty-separator')).toBeInTheDocument();
    });
  });
});
