import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import {
  composeInsideHandlers,
  useInteractOutside,
  type UseInteractOutsideOptions,
} from '../useInteractOutside';

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

  it('treats a React child as inside through the capture handlers alone', () => {
    // No refs: only the returned handlers can mark the events as inside.
    const NoRefLayer = (options: UseInteractOutsideOptions) => {
      const insideHandlers = useInteractOutside([], options);
      return (
        <div {...insideHandlers}>
          <button type='button'>Handler only</button>
        </div>
      );
    };
    const onPointerDownOutside = jest.fn();
    const onFocusOutside = jest.fn();
    render(
      <>
        <button type='button'>Outside</button>
        <NoRefLayer
          includeFocus
          onPointerDownOutside={onPointerDownOutside}
          onFocusOutside={onFocusOutside}
        />
      </>,
    );

    fireEvent.pointerDown(button('Handler only'));
    fireEvent.focusIn(button('Handler only'));
    expect(onPointerDownOutside).not.toHaveBeenCalled();
    expect(onFocusOutside).not.toHaveBeenCalled();

    fireEvent.pointerDown(button('Outside'));
    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
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

describe('composeInsideHandlers', () => {
  it('runs the consumer handler first, then the inside handler', () => {
    const calls: string[] = [];
    const composed = composeInsideHandlers(
      {
        onPointerDownCapture: () => calls.push('inside:pointer'),
        onFocusCapture: () => calls.push('inside:focus'),
      },
      {
        onPointerDownCapture: () => calls.push('consumer:pointer'),
        onFocusCapture: () => calls.push('consumer:focus'),
      },
    );

    composed.onPointerDownCapture({} as React.PointerEvent<Element>);
    composed.onFocusCapture({} as React.FocusEvent<Element>);

    expect(calls).toEqual(['consumer:pointer', 'inside:pointer', 'consumer:focus', 'inside:focus']);
  });

  it('works without consumer handlers', () => {
    const inside = { onPointerDownCapture: jest.fn(), onFocusCapture: jest.fn() };
    const composed = composeInsideHandlers(inside, {});

    composed.onPointerDownCapture({} as React.PointerEvent<Element>);
    composed.onFocusCapture({} as React.FocusEvent<Element>);

    expect(inside.onPointerDownCapture).toHaveBeenCalledTimes(1);
    expect(inside.onFocusCapture).toHaveBeenCalledTimes(1);
  });
});
