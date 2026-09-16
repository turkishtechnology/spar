import { render, screen, fireEvent } from '@testing-library/react';
import type { MouseEvent as ReactMouseEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import userEvent from '@testing-library/user-event';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  type BreadcrumbItemProps,
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

  it('passes computed position/isCurrent to items wrapped in a custom component', () => {
    const ItemWrapper = (props: BreadcrumbItemProps) => <BreadcrumbItem {...props} />;

    render(
      <Breadcrumb>
        <BreadcrumbList>
          <ItemWrapper>
            {({ position, isCurrent }) => <span>{`a:${position}:${String(isCurrent)}`}</span>}
          </ItemWrapper>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <ItemWrapper>
            {({ position, isCurrent }) => <span>{`b:${position}:${String(isCurrent)}`}</span>}
          </ItemWrapper>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <ItemWrapper>
            {({ position, isCurrent }) => <span>{`c:${position}:${String(isCurrent)}`}</span>}
          </ItemWrapper>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    expect(screen.getByText('a:first:false')).toBeInTheDocument();
    expect(screen.getByText('b:middle:false')).toBeInTheDocument();
    expect(screen.getByText('c:last:true')).toBeInTheDocument();

    expect(screen.getByText('a:first:false').closest('li')).toHaveAttribute(
      'data-position',
      'first',
    );
    expect(screen.getByText('c:last:true').closest('li')).toHaveAttribute('data-current', '');
  });

  it('recomputes positions when items mount and unmount', () => {
    const trail = (labels: string[]) => (
      <Breadcrumb>
        <BreadcrumbList>
          {labels.map((label) => (
            <BreadcrumbItem key={label}>
              {({ position, isCurrent }) => (
                <span>{`${label}:${position}:${String(isCurrent)}`}</span>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );

    const { rerender } = render(trail(['a', 'b', 'c']));

    expect(screen.getByText('c:last:true').closest('li')).toHaveAttribute('data-current', '');

    // Removing the last item unregisters it and promotes the previous one.
    rerender(trail(['a', 'b']));

    expect(screen.getByText('a:first:false')).toBeInTheDocument();
    expect(screen.getByText('b:last:true')).toBeInTheDocument();
    expect(screen.getByText('b:last:true').closest('li')).toHaveAttribute('data-position', 'last');
    expect(screen.getByText('b:last:true').closest('li')).toHaveAttribute('data-current', '');

    // Mounting a new tail item demotes it back to middle.
    rerender(trail(['a', 'b', 'd']));

    expect(screen.getByText('b:middle:false')).toBeInTheDocument();
    expect(screen.getByText('b:middle:false').closest('li')).not.toHaveAttribute('data-current');
    expect(screen.getByText('d:last:true').closest('li')).toHaveAttribute('data-current', '');
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

  it('runs the consumer onClick before onPress', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    const onClick = jest.fn(() => {
      calls.push('onClick');
    });
    const onPress = jest.fn(() => {
      calls.push('onPress');
    });

    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home' onClick={onClick} onPress={onPress}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    await user.click(screen.getByRole('link', { name: 'Home' }));

    expect(calls).toEqual(['onClick', 'onPress']);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('runs the consumer onClick alongside the root onNavigate', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const onNavigate = jest.fn();

    render(
      <Breadcrumb onNavigate={onNavigate}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home' onClick={onClick}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    await user.click(screen.getByRole('link', { name: 'Home' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith('/home', expect.any(Object));
  });

  it('skips onPress and onNavigate when the consumer onClick calls preventDefault', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn((event: ReactMouseEvent) => event.preventDefault());
    const onPress = jest.fn();
    const onNavigate = jest.fn();

    render(
      <Breadcrumb onNavigate={onNavigate}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home' onClick={onClick} onPress={onPress}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    await user.click(screen.getByRole('link', { name: 'Home' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('runs the consumer onKeyDown first and calls onPress exactly once for Enter', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    const onKeyDown = jest.fn(() => {
      calls.push('onKeyDown');
    });
    const onClick = jest.fn(() => {
      calls.push('onClick');
    });
    const onPress = jest.fn(() => {
      calls.push('onPress');
    });

    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home' onKeyDown={onKeyDown} onClick={onClick} onPress={onPress}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    screen.getByRole('link', { name: 'Home' }).focus();
    await user.keyboard('{Enter}');

    // Enter's synthesized click is suppressed, so onPress does not run twice.
    expect(calls).toEqual(['onKeyDown', 'onPress']);
    expect(onPress).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(onPress).toHaveBeenCalledTimes(2);
    expect(onKeyDown).toHaveBeenCalledTimes(2);
  });

  it('skips onPress when the consumer onKeyDown calls preventDefault', async () => {
    const user = userEvent.setup();
    const onKeyDown = jest.fn((event: ReactKeyboardEvent) => event.preventDefault());
    const onPress = jest.fn();

    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home' onKeyDown={onKeyDown} onPress={onPress}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    screen.getByRole('link', { name: 'Home' }).focus();
    await user.keyboard('{Enter}');

    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('lets non-activation keys reach the consumer onKeyDown on a disabled link', async () => {
    const user = userEvent.setup();
    const onKeyDown = jest.fn();
    const onPress = jest.fn();
    const onNavigate = jest.fn();

    render(
      <Breadcrumb onNavigate={onNavigate}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/home' disabled onKeyDown={onKeyDown} onPress={onPress}>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );

    const disabledLink = screen.getByText('Home');
    disabledLink.focus();

    await user.keyboard('{ArrowRight}');
    await user.keyboard('{Escape}');

    expect(onKeyDown).toHaveBeenCalledTimes(2);
    expect(onKeyDown.mock.calls.map(([event]) => (event as ReactKeyboardEvent).key)).toEqual([
      'ArrowRight',
      'Escape',
    ]);

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onKeyDown).toHaveBeenCalledTimes(2);
    expect(onPress).not.toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('prevents only Enter and Space on a disabled link', () => {
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

    const disabledLink = screen.getByText('Home');

    // fireEvent returns false when the default action was cancelled.
    expect(fireEvent.keyDown(disabledLink, { key: 'Enter' })).toBe(false);
    expect(fireEvent.keyDown(disabledLink, { key: ' ' })).toBe(false);
    expect(fireEvent.keyDown(disabledLink, { key: 'ArrowRight' })).toBe(true);
    expect(fireEvent.keyDown(disabledLink, { key: 'Escape' })).toBe(true);
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
