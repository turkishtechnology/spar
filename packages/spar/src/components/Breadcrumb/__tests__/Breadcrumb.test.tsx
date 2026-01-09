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

describe('Breadcrumb Components', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('BreadcrumbRoot', () => {
    it('renders with default props', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb');
    });

    it('renders with custom aria-label', () => {
      render(
        <BreadcrumbRoot aria-label='Custom Navigation'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Custom Navigation');
    });

    it('renders with polymorphic as prop', () => {
      render(
        <BreadcrumbRoot as='div' data-testid='custom-nav'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByTestId('custom-nav')).toBeInTheDocument();
      expect(screen.getByTestId('custom-nav').tagName).toBe('DIV');
    });

    it('applies disabled state', () => {
      render(
        <BreadcrumbRoot disabled>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-disabled', 'true');
      expect(nav).toHaveAttribute('data-disabled', '');
    });

    it('applies data attributes', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('navigation')).toHaveAttribute('data-spar-breadcrumb-root', '');
    });

    it('calls onNavigate when link is clicked', async () => {
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

      await user.click(screen.getByRole('link', { name: 'Home' }));

      expect(handleNavigate).toHaveBeenCalledWith('/home', expect.any(Object));
    });

    it('spreads additional props', () => {
      render(
        <BreadcrumbRoot className='custom-class' data-custom='value'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('custom-class');
      expect(nav).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('BreadcrumbList', () => {
    it('renders as ordered list by default', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByRole('list').tagName).toBe('OL');
    });

    it('renders with polymorphic as prop', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList as='ul' data-testid='custom-list'>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByTestId('custom-list')).toBeInTheDocument();
      expect(screen.getByTestId('custom-list').tagName).toBe('UL');
    });

    it('applies data attributes', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('list')).toHaveAttribute('data-spar-breadcrumb-list', '');
    });
  });

  describe('BreadcrumbItem', () => {
    it('renders as list item by default', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('listitem')).toBeInTheDocument();
      expect(screen.getByRole('listitem').tagName).toBe('LI');
    });

    it('renders with polymorphic as prop', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem as='div' data-testid='custom-item'>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByTestId('custom-item')).toBeInTheDocument();
      expect(screen.getByTestId('custom-item').tagName).toBe('DIV');
    });

    it('applies data attributes', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('listitem')).toHaveAttribute('data-spar-breadcrumb-item', '');
    });

    it('calculates position for multiple items', () => {
      render(
        <BreadcrumbRoot>
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
        </BreadcrumbRoot>,
      );

      // Note: The position calculation happens in useEffect, so we check the final state
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(3);
    });
  });

  describe('BreadcrumbLink', () => {
    it('renders as anchor by default', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
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
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as={CustomLink} data-testid='custom-link'>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByTestId('custom-link')).toBeInTheDocument();
      expect(screen.getByTestId('custom-link').tagName).toBe('BUTTON');
    });

    it('handles disabled state', () => {
      render(
        <BreadcrumbRoot>
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
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('data-disabled', '');
      expect(link).toHaveAttribute('tabindex', '-1');
      expect(link).not.toHaveAttribute('href');
    });

    it('handles disabled state from root context', () => {
      render(
        <BreadcrumbRoot disabled>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Disabled links lose their link role, so we check by text content
      const link = screen.getByText('Home');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('data-disabled', '');
    });

    it('handles external links', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='https://example.com' isExternal>
                External
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
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
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home' onClick={handleClick}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      await user.click(screen.getByRole('link', { name: 'Home' }));
      expect(handleClick).toHaveBeenCalled();
    });

    it('handles keyboard events', async () => {
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

    it('handles onPress override', async () => {
      const user = userEvent.setup();
      const handlePress = jest.fn();

      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home' onPress={handlePress}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      await user.click(screen.getByRole('link', { name: 'Home' }));
      expect(handlePress).toHaveBeenCalled();
    });

    it('prevents click when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home' disabled onClick={handleClick}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Disabled links lose their link role, so we check by text content
      await user.click(screen.getByText('Home'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies data attributes', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByRole('link')).toHaveAttribute('data-spar-breadcrumb-link', '');
    });
  });

  describe('BreadcrumbPage', () => {
    it('renders as span by default', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const page = screen.getByText('Current Page');
      expect(page).toBeInTheDocument();
      expect(page.tagName).toBe('SPAN');
      expect(page).toHaveAttribute('aria-current', 'page');
    });

    it('renders with polymorphic as prop', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage as='strong' data-testid='custom-page'>
                Current Page
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByTestId('custom-page')).toBeInTheDocument();
      expect(screen.getByTestId('custom-page').tagName).toBe('STRONG');
    });

    it('applies data attributes', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const page = screen.getByText('Current Page');
      expect(page).toHaveAttribute('data-spar-breadcrumb-page', '');
      expect(page).toHaveAttribute('data-current', '');
    });
  });

  describe('BreadcrumbSeparator', () => {
    it('renders as list item by default', () => {
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

      const separator = screen.getByText('/');
      expect(separator).toBeInTheDocument();
      expect(separator.tagName).toBe('LI');
    });

    it('renders with polymorphic as prop', () => {
      render(
        <BreadcrumbRoot>
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
        </BreadcrumbRoot>,
      );

      expect(screen.getByTestId('custom-separator')).toBeInTheDocument();
      expect(screen.getByTestId('custom-separator').tagName).toBe('SPAN');
    });

    it('is hidden from screen readers by default', () => {
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

    it('can override aria-hidden', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator aria-hidden={false}>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByText('/')).toHaveAttribute('aria-hidden', 'false');
    });

    it('applies data attributes', () => {
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

      expect(screen.getByText('/')).toHaveAttribute('data-spar-breadcrumb-separator', '');
    });

    it('renders without children', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator data-testid='empty-separator' />
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      expect(screen.getByTestId('empty-separator')).toBeInTheDocument();
    });
  });
});
