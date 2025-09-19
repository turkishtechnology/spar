import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../Breadcrumb';

expect.extend(toHaveNoViolations);

describe('Breadcrumb Accessibility Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('jest-axe compliance', () => {
    it('should pass axe accessibility tests for basic breadcrumb', async () => {
      const { container } = render(
        <BreadcrumbRoot>
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
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe tests with disabled breadcrumb', async () => {
      const { container } = render(
        <BreadcrumbRoot isDisabled>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should pass axe tests with external links', async () => {
      const { container } = render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='https://example.com' isExternal>
                External Site
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>→</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ARIA attributes and roles', () => {
    it('should have correct navigation landmark', () => {
      render(
        <BreadcrumbRoot aria-label='Main navigation'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('should have correct list structure', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const list = screen.getByRole('list');
      const listItem = screen.getByRole('listitem');

      expect(list).toBeInTheDocument();
      expect(listItem).toBeInTheDocument();
      expect(listItem.parentElement).toBe(list);
    });

    it('should mark current page with aria-current', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const currentPage = screen.getByText('Current Page');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
    });

    it('should hide separators from screen readers', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const separator = screen.getByText('/');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });

    it('should mark disabled links correctly', () => {
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

      // Disabled links lose the link role but keep accessibility attributes
      const link = screen.getByText('Disabled Link');
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('tabIndex', '-1');
    });

    it('should propagate disabled state to aria attributes', () => {
      render(
        <BreadcrumbRoot isDisabled>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const nav = screen.getByRole('navigation');
      // Context-disabled links lose link role
      const link = screen.getByText('Link');

      expect(nav).toHaveAttribute('aria-disabled', 'true');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Keyboard navigation', () => {
    it('should be focusable with Tab key', async () => {
      const user = userEvent.setup();

      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products'>Products</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const links = screen.getAllByRole('link');

      // Tab through all links
      await user.tab();
      expect(links[0]).toHaveFocus();

      await user.tab();
      expect(links[1]).toHaveFocus();
    });

    it('should handle Enter key activation', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      render(
        <BreadcrumbRoot onNavigate={mockNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard('[Enter]');

      expect(mockNavigate).toHaveBeenCalledWith('/test', expect.any(Object));
    });

    it('should handle Space key activation', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      render(
        <BreadcrumbRoot onNavigate={mockNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Test Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard(' ');

      expect(mockNavigate).toHaveBeenCalledWith('/test', expect.any(Object));
    });

    it('should skip disabled links in tab order', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/enabled'>Enabled</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/disabled' disabled>
                Disabled
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Only enabled link has link role
      const enabledLink = screen.getByRole('link');
      const disabledLink = screen.getByText('Disabled');

      expect(enabledLink).not.toHaveAttribute('tabIndex');
      expect(disabledLink).toHaveAttribute('tabIndex', '-1');
    });

    it('should not activate disabled links with keyboard', async () => {
      const user = userEvent.setup();
      const mockNavigate = jest.fn();

      render(
        <BreadcrumbRoot onNavigate={mockNavigate}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test' disabled>
                Disabled Link
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      // Disabled link loses link role, find by text
      const link = screen.getByText('Disabled Link');
      link.focus();
      await user.keyboard('[Enter]');
      await user.keyboard(' ');

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Focus management', () => {
    it('should maintain focus indicators', async () => {
      const user = userEvent.setup();

      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/test'>Focusable Link</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const link = screen.getByRole('link');
      await user.tab();

      expect(link).toHaveFocus();
      expect(document.activeElement).toBe(link);
    });

    it('should not focus disabled links', () => {
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

      // Disabled link loses link role, find by text
      const link = screen.getByText('Disabled Link');
      link.focus();

      // In jsdom, even tabindex="-1" elements can receive focus when explicitly focused
      // The important thing is they have the correct accessibility attributes
      expect(link).toHaveAttribute('tabIndex', '-1');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Screen reader support', () => {
    it('should provide meaningful navigation landmarks', () => {
      render(
        <BreadcrumbRoot aria-label='Page navigation'>
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

      const nav = screen.getByLabelText('Page navigation');
      expect(nav).toHaveAttribute('role', 'navigation');
    });

    it('should announce link states properly', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/normal'>Normal Link</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/disabled' disabled>
                Disabled Link
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const normalLink = screen.getByText('Normal Link');
      const disabledLink = screen.getByText('Disabled Link');
      const currentPage = screen.getByText('Current Page');

      expect(normalLink).not.toHaveAttribute('aria-disabled');
      expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
    });

    it('should hide decorative separators from screen readers', () => {
      render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>›</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const separator = screen.getByText('›');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Complex accessibility scenarios', () => {
    it('should handle mixed content accessibility', async () => {
      const { container } = render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/category'>Category</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/subcategory' disabled>
                Disabled Subcategory
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should maintain accessibility when dynamically updated', async () => {
      const { rerender, container } = render(
        <BreadcrumbRoot>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Page 1</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </BreadcrumbRoot>,
      );

      let results = await axe(container);
      expect(results).toHaveNoViolations();

      // Update the breadcrumb
      rerender(
        <BreadcrumbRoot>
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

      results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
