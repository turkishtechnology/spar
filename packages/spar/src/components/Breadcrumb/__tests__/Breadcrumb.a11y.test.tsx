import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../index';

expect.extend(toHaveNoViolations);

describe('Breadcrumb Accessibility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('has no axe violations in default and disabled states', async () => {
    const { container, rerender } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Breadcrumb disabled>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('exposes expected landmark, list and current-page semantics', () => {
    render(
      <Breadcrumb aria-label='Page Navigation'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole('navigation', { name: 'Page Navigation' })).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Current Page')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('/')).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps disabled links announced and removed from link role/tab order', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button>Before</button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/products' disabled>
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href='/about'>About</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <button>After</button>
      </div>,
    );

    const disabledText = screen.getByText('Products');
    expect(disabledText).toHaveAttribute('aria-disabled', 'true');
    expect(disabledText).toHaveAttribute('tabindex', '-1');
    expect(disabledText).not.toHaveAttribute('href');
    expect(screen.queryByRole('link', { name: 'Products' })).not.toBeInTheDocument();

    await user.tab();
    await user.tab();
    expect(screen.getByRole('link', { name: 'About' })).toHaveFocus();
  });

  it('supports keyboard activation with Enter and Space for enabled links only', async () => {
    const user = userEvent.setup();
    const onNavigate = jest.fn();

    render(
      <Breadcrumb onNavigate={onNavigate}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href='/disabled' disabled>
              Disabled
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const enabled = screen.getByRole('link', { name: 'Home' });
    enabled.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    const disabled = screen.getByText('Disabled');
    disabled.focus();
    await user.keyboard('{Enter}');

    expect(onNavigate).toHaveBeenCalledTimes(2);
    expect(onNavigate).toHaveBeenNthCalledWith(1, '/home', expect.any(Object));
    expect(onNavigate).toHaveBeenNthCalledWith(2, '/home', expect.any(Object));
  });

  it('does not trap focus inside breadcrumb navigation', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button>Before</button>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <button>After</button>
      </div>,
    );

    await user.tab();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });
});
