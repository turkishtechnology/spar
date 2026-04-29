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

const item = (key: string | number, label = `Item ${key}`) => (
  <AccordionItem key={key} itemKey={key}>
    <AccordionHeader>
      <AccordionTrigger>{label}</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>{label} body</AccordionContent>
  </AccordionItem>
);

describe('Accordion — Takeoff vocabulary API', () => {
  describe('defaultActiveIndex (uncontrolled)', () => {
    it('opens the matching item in single mode', () => {
      render(
        <Accordion defaultActiveIndex='b'>
          {item('a')}
          {item('b')}
          {item('c')}
        </Accordion>,
      );
      expect(screen.getByRole('button', { name: 'Item a' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(screen.getByRole('button', { name: 'Item b' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByRole('button', { name: 'Item c' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('opens every listed item in allowMultiple mode', () => {
      render(
        <Accordion allowMultiple defaultActiveIndex={['a', 'c']}>
          {item('a')}
          {item('b')}
          {item('c')}
        </Accordion>,
      );
      expect(screen.getByRole('button', { name: 'Item a' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByRole('button', { name: 'Item b' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(screen.getByRole('button', { name: 'Item c' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });
  });

  describe('activeIndex normalization', () => {
    it('wraps a scalar activeIndex into an array when allowMultiple is set', () => {
      render(
        <Accordion allowMultiple activeIndex='b'>
          {item('a')}
          {item('b')}
        </Accordion>,
      );
      expect(screen.getByRole('button', { name: 'Item a' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(screen.getByRole('button', { name: 'Item b' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('uses the last entry of an array activeIndex in single mode', () => {
      render(
        <Accordion activeIndex={['a', 'c']}>
          {item('a')}
          {item('b')}
          {item('c')}
        </Accordion>,
      );
      expect(screen.getByRole('button', { name: 'Item a' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(screen.getByRole('button', { name: 'Item c' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('treats an empty-array activeIndex as nothing-active in single mode', () => {
      render(<Accordion activeIndex={[]}>{item('a')}</Accordion>);
      expect(screen.getByRole('button', { name: 'Item a' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });
  });

  describe('preventCollapse (single mode)', () => {
    it('lets an active item collapse by default (matches Takeoff Core)', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <Accordion defaultActiveIndex='a' onActiveIndexChange={onChange}>
          {item('a')}
          {item('b')}
        </Accordion>,
      );
      const triggerA = screen.getByRole('button', { name: 'Item a' });
      await user.click(triggerA);
      expect(triggerA).toHaveAttribute('aria-expanded', 'false');
      expect(onChange).toHaveBeenLastCalledWith('');
    });

    it('blocks the collapse when preventCollapse is set', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <Accordion defaultActiveIndex='a' preventCollapse onActiveIndexChange={onChange}>
          {item('a')}
          {item('b')}
        </Accordion>,
      );
      const triggerA = screen.getByRole('button', { name: 'Item a' });
      await user.click(triggerA);
      expect(triggerA).toHaveAttribute('aria-expanded', 'true');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('onActiveIndexChange payload', () => {
    it('keeps numeric itemKey as a number in single mode', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <Accordion defaultActiveIndex={0} onActiveIndexChange={onChange}>
          {item(0)}
          {item(1)}
          {item(2)}
        </Accordion>,
      );
      await user.click(screen.getByRole('button', { name: 'Item 1' }));
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(1);
      expect(typeof onChange.mock.calls[0]?.[0]).toBe('number');
    });

    it('emits an array shape in allowMultiple mode preserving numeric keys', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(
        <Accordion allowMultiple defaultActiveIndex={[0]} onActiveIndexChange={onChange}>
          {item(0)}
          {item(1)}
          {item(2)}
        </Accordion>,
      );
      await user.click(screen.getByRole('button', { name: 'Item 2' }));
      expect(onChange).toHaveBeenCalledWith([0, 2]);
      const payload = onChange.mock.calls[0]?.[0] as number[];
      expect(typeof payload[0]).toBe('number');
      expect(typeof payload[1]).toBe('number');
    });
  });

  describe('numeric and string itemKey identity', () => {
    it('keeps registry focus distinct for numeric and string lookalike keys', async () => {
      const user = userEvent.setup();

      render(
        <Accordion>
          <AccordionItem itemKey={1}>
            <AccordionHeader>
              <AccordionTrigger>Number one</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Number one body</AccordionContent>
          </AccordionItem>
          <AccordionItem itemKey='1'>
            <AccordionHeader>
              <AccordionTrigger>String one</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>String one body</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const numberTrigger = screen.getByRole('button', { name: 'Number one' });
      const stringTrigger = screen.getByRole('button', { name: 'String one' });

      stringTrigger.focus();
      await user.keyboard('{Home}');

      expect(numberTrigger).toHaveFocus();
    });
  });

  describe('controlled vs uncontrolled', () => {
    it('does not mutate an item state without a parent update when controlled', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const { rerender } = render(
        <Accordion activeIndex='a' onActiveIndexChange={onChange}>
          {item('a')}
          {item('b')}
        </Accordion>,
      );

      const triggerB = screen.getByRole('button', { name: 'Item b' });
      await user.click(triggerB);
      expect(onChange).toHaveBeenCalledWith('b');
      // Parent has not echoed activeIndex back; b stays closed.
      expect(triggerB).toHaveAttribute('aria-expanded', 'false');

      rerender(
        <Accordion activeIndex='b' onActiveIndexChange={onChange}>
          {item('a')}
          {item('b')}
        </Accordion>,
      );
      expect(triggerB).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('missing itemKey diagnostics', () => {
    it('warns once per misused item and gives every item a distinct identity', async () => {
      const user = userEvent.setup();
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

      render(
        <Accordion>
          <AccordionItem>
            <AccordionHeader>
              <AccordionTrigger>First</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>First body</AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionHeader>
              <AccordionTrigger>Second</AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>Second body</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      // Each keyless item triggers exactly one warning.
      expect(warnSpy).toHaveBeenCalledTimes(2);
      expect(warnSpy.mock.calls[0]?.[0]).toContain('itemKey');

      const first = screen.getByRole('button', { name: 'First' });
      const second = screen.getByRole('button', { name: 'Second' });

      // Critical regression guard: clicking First must not also expand Second.
      await user.click(first);
      expect(first).toHaveAttribute('aria-expanded', 'true');
      expect(second).toHaveAttribute('aria-expanded', 'false');

      warnSpy.mockRestore();
    });
  });
});
