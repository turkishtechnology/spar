import { act, renderHook } from '@testing-library/react';

import { useItemRegistry } from '../useItemRegistry';

const makeElements = (count: number): HTMLElement[] => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return Array.from({ length: count }, () =>
    container.appendChild(document.createElement('button')),
  );
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('useItemRegistry', () => {
  it('follows registration order for plain data', () => {
    const { result } = renderHook(() => useItemRegistry<{ label: string }>());

    act(() => {
      result.current.registerItem('b', { label: 'B' });
      result.current.registerItem('a', { label: 'A' });
    });

    expect(result.current.getItemIds()).toEqual(['b', 'a']);
    expect(result.current.getItemIndex('a')).toBe(1);
  });

  it('follows document order when the registered data are DOM nodes', () => {
    const [first, second, third] = makeElements(3);
    const { result } = renderHook(() => useItemRegistry<HTMLElement>());

    // The middle element registers last, as an item inserted between two
    // mounted siblings would.
    act(() => {
      result.current.registerItem('first', first);
      result.current.registerItem('third', third);
      result.current.registerItem('second', second);
    });

    expect(result.current.getItemIds()).toEqual(['first', 'second', 'third']);
    expect(result.current.getItemAtIndex(1)).toBe('second');
    expect(result.current.getItemIndex('third')).toBe(2);
  });

  it('keeps the indexed lookups accurate when an item is replaced without the count changing', () => {
    const [first, second, replacement] = makeElements(3);
    const { result } = renderHook(() => useItemRegistry<HTMLElement>());

    act(() => {
      result.current.registerItem('first', first);
      result.current.registerItem('second', second);
    });
    act(() => {
      result.current.unregisterItem('second');
    });
    act(() => {
      result.current.registerItem('replacement', replacement);
    });

    expect(result.current.count).toBe(2);
    expect(result.current.getItemIndex('second')).toBe(-1);
    expect(result.current.getItemIndex('replacement')).toBe(1);
    expect(result.current.getItemAtIndex(1)).toBe('replacement');
  });

  it('ignores an unregister for an unknown id without producing a new map', () => {
    const { result } = renderHook(() => useItemRegistry());
    const before = result.current.items;

    act(() => {
      result.current.unregisterItem('missing');
    });

    expect(result.current.items).toBe(before);
  });
});
