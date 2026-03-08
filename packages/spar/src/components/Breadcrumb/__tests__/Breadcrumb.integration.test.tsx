import { render, screen } from '@testing-library/react';
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

  it('integrates with client-side routing through onNavigate', async () => {
    const user = userEvent.setup();
    const push = jest.fn();

    render(
      <Breadcrumb
        onNavigate={(href, event) => {
          event.preventDefault();
          push(href);
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
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    await user.click(screen.getByRole('link', { name: 'Products' }));
    expect(push).toHaveBeenCalledWith('/products');
  });

  it('supports controlled disabled state changes via rerender', () => {
    const Controlled = ({ disabled }: { disabled: boolean }) => (
      <Breadcrumb disabled={disabled}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/step-1'>Step 1</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Step 2</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    const { rerender } = render(<Controlled disabled={true} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Step 1')).toHaveAttribute('aria-disabled', 'true');

    rerender(<Controlled disabled={false} />);
    expect(screen.getByRole('navigation')).not.toHaveAttribute('aria-disabled');
    expect(screen.getByRole('link', { name: 'Step 1' })).toHaveAttribute('href', '/step-1');
  });

  it('supports uncontrolled interaction flow by default', async () => {
    const user = userEvent.setup();
    const onNavigate = jest.fn();

    render(
      <Breadcrumb onNavigate={onNavigate}>
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

    expect(screen.getByRole('navigation')).not.toHaveAttribute('aria-disabled');
    await user.click(screen.getByRole('link', { name: 'Home' }));
    expect(onNavigate).toHaveBeenCalledWith('/home', expect.any(Object));
  });

  it('keeps two breadcrumb instances isolated', async () => {
    const user = userEvent.setup();
    const onNavigate1 = jest.fn();
    const onNavigate2 = jest.fn();

    render(
      <div>
        <Breadcrumb onNavigate={onNavigate1}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/a'>Home A</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Breadcrumb onNavigate={onNavigate2}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/b'>Home B</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>,
    );

    await user.click(screen.getByRole('link', { name: 'Home A' }));
    expect(onNavigate1).toHaveBeenCalledWith('/a', expect.any(Object));
    expect(onNavigate2).not.toHaveBeenCalled();

    await user.click(screen.getByRole('link', { name: 'Home B' }));
    expect(onNavigate2).toHaveBeenCalledWith('/b', expect.any(Object));
  });

  it('keeps id contract stable and supports dynamic trail generation', () => {
    const routes = [
      { href: '/', label: 'Home' },
      { href: '/catalog', label: 'Catalog' },
    ];

    render(
      <Breadcrumb id='route-breadcrumb' aria-label='Route breadcrumb'>
        <BreadcrumbList>
          {routes.map((route) => (
            <React.Fragment key={route.href}>
              <BreadcrumbItem>
                <BreadcrumbLink href={route.href}>{route.label}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            </React.Fragment>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage>Current Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole('navigation', { name: 'Route breadcrumb' })).toHaveAttribute(
      'id',
      'route-breadcrumb',
    );
    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute('href', '/catalog');
    expect(screen.getByText('Current Page')).toHaveAttribute('aria-current', 'page');
  });

  it('handles async disable/enable flow deterministically', async () => {
    const user = userEvent.setup();

    const AsyncBreadcrumb = () => {
      const [isNavigating, setIsNavigating] = useState(false);

      const handleNavigate = async (
        _href: string,
        event: React.MouseEvent<Element> | React.KeyboardEvent<Element>,
      ) => {
        event.preventDefault();
        setIsNavigating(true);
      };

      return (
        <div>
          <Breadcrumb onNavigate={handleNavigate} disabled={isNavigating}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{isNavigating ? 'Loading...' : 'Current'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <button onClick={() => setIsNavigating(false)}>Reset</button>
        </div>
      );
    };

    render(<AsyncBreadcrumb />);

    await user.click(screen.getByRole('link', { name: 'Home' }));
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('navigation')).not.toHaveAttribute('aria-disabled');
    expect(screen.getByText('Current')).toBeInTheDocument();
  });
});
