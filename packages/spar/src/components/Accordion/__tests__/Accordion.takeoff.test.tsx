import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from '../index';

const item = (value: string | number, label = `Item ${value}`, forceMount = false) => (
  <AccordionItem key={value} value={value} data-testid={`item-${value}`}>
    <AccordionHeader data-testid={`header-${value}`}>
      <AccordionTrigger>{label}</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent forceMount={forceMount}>{label} body</AccordionContent>
  </AccordionItem>
);

describe('Accordion value API', () => {
  it('opens the matching item from defaultValue', () => {
    render(
      <Accordion defaultValue='b'>
        {item('a')}
        {item('b')}
        {item('c')}
      </Accordion>,
    );

    expect(screen.getByRole('button', { name: 'Item a' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Item b' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Item c' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('starts closed and updates internal state when uncontrolled', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(
      <Accordion onValueChange={onValueChange}>
        {item('fare')}
        {item('bag')}
      </Accordion>,
    );

    const fare = screen.getByRole('button', { name: 'Item fare' });
    const bag = screen.getByRole('button', { name: 'Item bag' });

    expect(fare).toHaveAttribute('aria-expanded', 'false');
    expect(bag).toHaveAttribute('aria-expanded', 'false');

    await user.click(fare);

    expect(fare).toHaveAttribute('aria-expanded', 'true');
    expect(onValueChange).toHaveBeenCalledWith('fare');
  });

  it('does not treat onValueChange alone as controlled', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(<Accordion onValueChange={onValueChange}>{item('fare')}</Accordion>);

    const fare = screen.getByRole('button', { name: 'Item fare' });
    await user.click(fare);

    expect(fare).toHaveAttribute('aria-expanded', 'true');
    expect(onValueChange).toHaveBeenCalledWith('fare');
  });

  it('uses defaultValue only as uncontrolled initial state', () => {
    const { rerender } = render(
      <Accordion defaultValue='fare'>
        {item('fare')}
        {item('bag')}
      </Accordion>,
    );

    expect(screen.getByRole('button', { name: 'Item fare' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    rerender(
      <Accordion defaultValue='bag'>
        {item('fare')}
        {item('bag')}
      </Accordion>,
    );

    expect(screen.getByRole('button', { name: 'Item fare' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Item bag' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('calls onValueChange without mutating UI until controlled value updates', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const { rerender } = render(
      <Accordion value='a' onValueChange={onValueChange}>
        {item('a')}
        {item('b')}
      </Accordion>,
    );

    const itemA = screen.getByRole('button', { name: 'Item a' });
    const itemB = screen.getByRole('button', { name: 'Item b' });

    await user.click(itemB);

    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(itemA).toHaveAttribute('aria-expanded', 'true');
    expect(itemB).toHaveAttribute('aria-expanded', 'false');

    rerender(
      <Accordion value='b' onValueChange={onValueChange}>
        {item('a')}
        {item('b')}
      </Accordion>,
    );

    expect(itemA).toHaveAttribute('aria-expanded', 'false');
    expect(itemB).toHaveAttribute('aria-expanded', 'true');
  });

  it('emits an array in allowMultiple mode', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(
      <Accordion allowMultiple defaultValue={['a']} onValueChange={onValueChange}>
        {item('a')}
        {item('b')}
      </Accordion>,
    );

    await user.click(screen.getByRole('button', { name: 'Item b' }));

    expect(onValueChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('preserves numeric values as numbers', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(
      <Accordion defaultValue={0} onValueChange={onValueChange}>
        {item(0)}
        {item(1)}
      </Accordion>,
    );

    await user.click(screen.getByRole('button', { name: 'Item 1' }));

    expect(onValueChange).toHaveBeenCalledWith(1);
    expect(typeof onValueChange.mock.calls[0]?.[0]).toBe('number');
  });

  it('supports string values', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(
      <Accordion defaultValue='fare' onValueChange={onValueChange}>
        {item('fare')}
        {item('bag')}
      </Accordion>,
    );

    expect(screen.getByRole('button', { name: 'Item fare' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Item bag' }));

    expect(onValueChange).toHaveBeenCalledWith('bag');
  });

  it('reflects open and closed state with data attributes', async () => {
    const user = userEvent.setup();

    render(
      <Accordion defaultValue='a'>
        {item('a', 'Item a', true)}
        {item('b', 'Item b', true)}
      </Accordion>,
    );

    const itemA = screen.getByTestId('item-a');
    const itemB = screen.getByTestId('item-b');
    const triggerA = screen.getByRole('button', { name: 'Item a' });
    const triggerB = screen.getByRole('button', { name: 'Item b' });
    const contentA = screen.getByText('Item a body');
    const contentB = screen.getByText('Item b body');

    expect(itemA).toHaveAttribute('data-open');
    expect(triggerA).toHaveAttribute('data-open');
    expect(contentA).toHaveAttribute('data-open');
    expect(itemB).toHaveAttribute('data-closed');
    expect(triggerB).toHaveAttribute('data-closed');
    expect(contentB).toHaveAttribute('data-closed');

    await user.click(triggerB);

    expect(itemA).toHaveAttribute('data-closed');
    expect(triggerA).toHaveAttribute('data-closed');
    expect(contentA).toHaveAttribute('data-closed');
    expect(itemB).toHaveAttribute('data-open');
    expect(triggerB).toHaveAttribute('data-open');
    expect(contentB).toHaveAttribute('data-open');
  });
});
