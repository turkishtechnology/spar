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

  it('renders semantic structure with default landmark label', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home');
  });

  it('forwards base props including id and custom aria-label', () => {
    render(
      <Breadcrumb id='crumb-root' aria-label='Page trail' data-custom='ok'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const navigation = screen.getByRole('navigation', { name: 'Page trail' });
    expect(navigation).toHaveAttribute('id', 'crumb-root');
    expect(navigation).toHaveAttribute('data-custom', 'ok');
  });

  it('applies root disabled state to landmark and links', () => {
    render(
      <Breadcrumb disabled>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole('navigation')).toHaveAttribute('aria-disabled', 'true');
    const link = screen.getByText('Home');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(link).not.toHaveAttribute('href');
  });

  it('computes first/middle/last from BreadcrumbItem children only', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <span>ignored node</span>
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

    const itemWithHome = screen.getByRole('link', { name: 'Home' }).closest('li');
    const itemWithProducts = screen.getByRole('link', { name: 'Products' }).closest('li');
    const itemWithCurrent = screen.getByText('Current').closest('li');

    expect(itemWithHome).toHaveAttribute('data-position', 'first');
    expect(itemWithProducts).toHaveAttribute('data-position', 'middle');
    expect(itemWithCurrent).toHaveAttribute('data-position', 'last');
    expect(itemWithCurrent).toHaveAttribute('data-current', '');
  });

  it('supports BreadcrumbItem render props with current and disabled state', () => {
    render(
      <Breadcrumb disabled>
        <BreadcrumbList>
          <BreadcrumbItem>
            {({ position, isCurrent, isDisabled }) => (
              <span>{`${position}-${String(isCurrent)}-${String(isDisabled)}`}</span>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByText('first-true-true')).toBeInTheDocument();
  });

  it('calls onNavigate for click, Enter and Space when href exists', async () => {
    const user = userEvent.setup();
    const onNavigate = jest.fn();

    render(
      <Breadcrumb onNavigate={onNavigate}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home'>Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const link = screen.getByRole('link', { name: 'Home' });
    await user.click(link);
    link.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onNavigate).toHaveBeenCalledTimes(3);
    expect(onNavigate).toHaveBeenNthCalledWith(1, '/home', expect.any(Object));
    expect(onNavigate).toHaveBeenNthCalledWith(2, '/home', expect.any(Object));
    expect(onNavigate).toHaveBeenNthCalledWith(3, '/home', expect.any(Object));
  });

  it('prefers onPress over onNavigate for click and keyboard activation', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    const onNavigate = jest.fn();

    render(
      <Breadcrumb onNavigate={onNavigate}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home' onPress={onPress}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const link = screen.getByRole('link', { name: 'Home' });
    await user.click(link);
    link.focus();
    await user.keyboard('{Enter}');

    expect(onPress).toHaveBeenCalledTimes(2);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('keeps disabled links non-interactive for mouse and keyboard', async () => {
    const user = userEvent.setup();
    const onNavigate = jest.fn();
    const onClick = jest.fn();

    render(
      <Breadcrumb onNavigate={onNavigate}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home' disabled onClick={onClick}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const disabledLink = screen.getByText('Home');
    await user.click(disabledLink);
    disabledLink.focus();
    await user.keyboard('{Enter}');

    expect(onClick).not.toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('applies external link defaults and allows explicit overrides', () => {
    const { rerender } = render(
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

    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );

    rerender(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='https://example.com' isExternal target='_self' rel='author'>
              External
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute('target', '_self');
    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute('rel', 'author');
  });

  it('marks current page and hides separators from assistive tech by default', () => {
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

    expect(screen.getByText('Current')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('/')).toHaveAttribute('aria-hidden', 'true');
  });
});
