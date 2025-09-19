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

describe('Breadcrumb Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('BreadcrumbRoot', () => {
    it('renders with default props', () => {
      render(
        <BreadcrumbRoot>
          <div>Breadcrumb content</div>
        </BreadcrumbRoot>,
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
      expect(nav).toHaveAttribute('data-glide-breadcrumb-root', '');
    });

    it('renders with custom aria-label', () => {
      render(
        <BreadcrumbRoot aria-label='Custom Navigation'>
          <div>Content</div>
        </BreadcrumbRoot>,
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Custom Navigation');
    });

    it('renders with disabled state', () => {
      render(
        <BreadcrumbRoot isDisabled>
          <div>Content</div>
        </BreadcrumbRoot>,
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-disabled', 'true');
      expect(nav).toHaveAttribute('data-disabled', 'true');
    });

    it('renders as custom element when using as prop', () => {
      render(
        <BreadcrumbRoot as='div' role='navigation'>
          <div>Content</div>
        </BreadcrumbRoot>,
      );

      const element = screen.getByRole('navigation');
      expect(element.tagName).toBe('DIV');
    });

    it('accepts custom props', () => {
      render(
        <BreadcrumbRoot data-testid='custom-breadcrumb' className='custom-class'>
          <div>Content</div>
        </BreadcrumbRoot>,
      );

      const nav = screen.getByTestId('custom-breadcrumb');
      expect(nav).toHaveClass('custom-class');
    });

    it('provides navigation handler context', () => {
      const mockNavigate = jest.fn();
      render(
        <BreadcrumbRoot onNavigate={mockNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // The context is provided, we'll test the actual navigation in integration tests
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('BreadcrumbList', () => {
    it('renders as ordered list by default', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>Item 1</BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const list = screen.getByRole('list');
      expect(list.tagName).toBe('OL');
      expect(list).toHaveAttribute('data-glide-breadcrumb-list', '');
    });

    it('renders as custom element when using as prop', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList as='ul'>
            <BreadcrumbItem>Item 1</BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const list = screen.getByRole('list');
      expect(list.tagName).toBe('UL');
    });

    it('accepts custom props', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList data-testid='custom-list' className='list-class'>
            <BreadcrumbItem>Item 1</BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const list = screen.getByTestId('custom-list');
      expect(list).toHaveClass('list-class');
    });
  });

  describe('BreadcrumbItem', () => {
    it('renders as list item by default', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span>Item content</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const item = screen.getByRole('listitem');
      expect(item.tagName).toBe('LI');
      expect(item).toHaveAttribute('data-glide-breadcrumb-item', '');
    });

    it('renders as custom element when using as prop', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem as='div' role='listitem'>
              <span>Item content</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const item = screen.getByRole('listitem');
      expect(item.tagName).toBe('DIV');
    });

    it('accepts custom props', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem data-testid='custom-item' className='item-class'>
              <span>Item content</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const item = screen.getByTestId('custom-item');
      expect(item).toHaveClass('item-class');
    });
  });

  describe('BreadcrumbLink', () => {
    it('renders as anchor by default', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveAttribute('data-glide-breadcrumb-link', '');
      expect(link).toHaveTextContent('Test Link');
    });

    it('renders as custom element when using as prop', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as='button' type='button'>
                Test Button
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveTextContent('Test Button');
    });

    it('should handle disabled link correctly', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test' disabled>
                Disabled Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByText('Disabled Link');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).not.toHaveAttribute('href');
    });
    it('handles external links', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='https://example.com' isExternal>
                External Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveAttribute('data-external', 'true');
    });

    it('handles custom target and rel for external links', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='https://example.com' isExternal target='_self' rel='custom-rel'>
                External Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_self');
      expect(link).toHaveAttribute('rel', 'custom-rel');
    });

    it('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test' onClick={handleClick}>
                Clickable Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      await user.click(link);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('prevents click when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test' disabled onClick={handleClick}>
                Disabled Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Disabled links without href don't have link role - query by text instead
      const link = screen.getByText('Disabled Link');
      await user.click(link);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles custom onPress events', async () => {
      const user = userEvent.setup();
      const handlePress = jest.fn();

      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test' onPress={handlePress}>
                Press Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      await user.click(link);

      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard events (Enter)', async () => {
      const user = userEvent.setup();
      const handleKeyDown = jest.fn();

      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test' onKeyDown={handleKeyDown}>
                Keyboard Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard('[Enter]');

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard events (Space)', async () => {
      const user = userEvent.setup();
      const handleKeyDown = jest.fn();

      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test' onKeyDown={handleKeyDown}>
                Keyboard Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard(' ');

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('prevents keyboard events when disabled', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test' disabled>
                Disabled Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Verify disabled accessibility attributes that prevent keyboard interaction
      const link = screen.getByText('Disabled Link');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabindex', '-1'); // Prevents keyboard focus
      expect(link).not.toHaveAttribute('href'); // No navigation target
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
      expect(page.tagName).toBe('SPAN');
      expect(page).toHaveAttribute('aria-current', 'page');
      expect(page).toHaveAttribute('data-glide-breadcrumb-page', '');
    });

    it('renders as custom element when using as prop', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage as='div'>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const page = screen.getByText('Current Page');
      expect(page.tagName).toBe('DIV');
      expect(page).toHaveAttribute('aria-current', 'page');
    });

    it('accepts custom props', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage data-testid='custom-page' className='page-class'>
                Current Page
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const page = screen.getByTestId('custom-page');
      expect(page).toHaveClass('page-class');
    });
  });

  describe('BreadcrumbSeparator', () => {
    it('renders as span by default', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const separator = screen.getByText('/');
      expect(separator.tagName).toBe('SPAN');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
      expect(separator).toHaveAttribute('data-glide-breadcrumb-separator', '');
    });

    it('renders as custom element when using as prop', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator as='div'>/</BreadcrumbSeparator>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const separator = screen.getByText('/');
      expect(separator.tagName).toBe('DIV');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });

    it('accepts custom props', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator data-testid='custom-sep' className='sep-class'>
              →
            </BreadcrumbSeparator>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const separator = screen.getByTestId('custom-sep');
      expect(separator).toHaveClass('sep-class');
      expect(separator).toHaveTextContent('→');
    });
  });

  describe('Context Integration', () => {
    it('propagates disabled state from root to links', () => {
      render(
        <BreadcrumbRoot isDisabled>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Link 1</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test2'>Link 2</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // When disabled via context, links lose their href and link role - query by text
      const link1 = screen.getByText('Link 1');
      const link2 = screen.getByText('Link 2');

      expect(link1).toHaveAttribute('aria-disabled', 'true');
      expect(link1).not.toHaveAttribute('href');
      expect(link2).toHaveAttribute('aria-disabled', 'true');
      expect(link2).not.toHaveAttribute('href');
    });

    it('combines root and individual link disabled states', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Enabled Link</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test2' disabled>
                Disabled Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Only enabled link will have link role, disabled link must be found by text
      const enabledLink = screen.getByRole('link');
      const disabledLink = screen.getByText('Disabled Link');

      expect(enabledLink).toHaveAttribute('href', '/test');
      expect(enabledLink).not.toHaveAttribute('aria-disabled');

      expect(disabledLink).not.toHaveAttribute('href');
      expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <div data-testid='empty-placeholder'></div>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      const placeholder = screen.getByTestId('empty-placeholder');
      expect(placeholder).toBeInTheDocument();
    });

    it('handles undefined href in BreadcrumbLink', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>No Href Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Links without href don't have link role - query by text
      const link = screen.getByText('No Href Link');
      expect(link).not.toHaveAttribute('href');
    });

    it('handles null onNavigate handler', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });
  });
});
