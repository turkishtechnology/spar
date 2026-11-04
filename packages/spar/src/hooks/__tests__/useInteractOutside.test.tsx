import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { useInteractOutside, type UseInteractOutsideOptions } from '../useInteractOutside';

const Layer = (options: UseInteractOutsideOptions) => {
  const ref = useRef<HTMLDivElement>(null);
  const insideHandlers = useInteractOutside([ref], options);
  return (
    <div ref={ref} data-testid='layer' {...insideHandlers}>
      <button type='button'>In DOM</button>
      {createPortal(<button type='button'>Portaled child</button>, document.body)}
    </div>
  );
};

const renderLayer = (options: UseInteractOutsideOptions = {}) => {
  const onPointerDownOutside = jest.fn();
  const onFocusOutside = jest.fn();
  render(
    <>
      <button type='button'>Outside</button>
      <Layer
        includeFocus
        onPointerDownOutside={onPointerDownOutside}
        onFocusOutside={onFocusOutside}
        {...options}
      />
    </>,
  );
  return { onPointerDownOutside, onFocusOutside };
};

const button = (name: string) => screen.getByRole('button', { name });

describe('useInteractOutside', () => {
  it('treats DOM descendants of the refs as inside', () => {
    const { onPointerDownOutside, onFocusOutside } = renderLayer();

    fireEvent.pointerDown(button('In DOM'));
    fireEvent.focusIn(button('In DOM'));

    expect(onPointerDownOutside).not.toHaveBeenCalled();
    expect(onFocusOutside).not.toHaveBeenCalled();
  });

  it('treats a portaled React child as inside although it is outside the DOM node', () => {
    const { onPointerDownOutside, onFocusOutside } = renderLayer();
    const portaled = button('Portaled child');
    expect(screen.getByTestId('layer').contains(portaled)).toBe(false);

    fireEvent.pointerDown(portaled);
    fireEvent.focusIn(portaled);

    expect(onPointerDownOutside).not.toHaveBeenCalled();
    expect(onFocusOutside).not.toHaveBeenCalled();
  });

  it('reports an element outside both the DOM node and the React subtree', () => {
    const { onPointerDownOutside, onFocusOutside } = renderLayer();

    fireEvent.pointerDown(button('Outside'));
    fireEvent.focusIn(button('Outside'));

    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
    expect(onFocusOutside).toHaveBeenCalledTimes(1);
  });

  it('reports nothing while disabled', () => {
    const { onPointerDownOutside } = renderLayer({ enabled: false });

    fireEvent.pointerDown(button('Outside'));

    expect(onPointerDownOutside).not.toHaveBeenCalled();
  });
});
