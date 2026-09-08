import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { InputField } from '../index';
import type { Mask, MaskResolver } from '@/types';
import { createDateMask, createNumberMask, createTimeMask } from '@/index';

/**
 * Acceptance criteria for the mask, case for case from the spec's §10.10 table.
 *
 * The numbering is load-bearing: each `describe` is one row of that table, so a
 * failure names the requirement it broke rather than an implementation detail.
 */

const DMY: Mask = { blocks: [2, 2, 4], delimiter: '/' };

const field = () => screen.getByRole('textbox') as HTMLInputElement;

/** Places a collapsed caret. user-event reads the live DOM selection. */
const caretTo = (element: HTMLInputElement, position: number): void => {
  element.setSelectionRange(position, position);
};

/**
 * Groups digits in threes from the right, like a thousands separator.
 *
 * Deliberately hand-written even though Spar now ships `createNumberMask`: rows
 * 20–22 are about what a *userland* resolver can do, and the built-in must not
 * be the only way to reach this behaviour. §26 covers the built-in.
 */
const numeral: MaskResolver = (value) => {
  const digits = value.replace(/\D/g, '');
  const parts: string[] = [];
  let cursor = digits.length;
  while (cursor > 3) {
    parts.unshift(digits.slice(cursor - 3, cursor));
    cursor -= 3;
  }
  if (cursor > 0) parts.unshift(digits.slice(0, cursor));
  return { value: parts.join('.') };
};

describe('Input mask - 1. type sequentially', () => {
  it('inserts delimiters and leaves the caret after the last typed character', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} />);

    await user.type(field(), '31122024');

    expect(field()).toHaveValue('31/12/2024');
    expect(field().selectionStart).toBe(10);
  });

  it('keeps the caret after the character that completed a block', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} />);

    await user.type(field(), '31');

    // No trailing delimiter yet, so the caret has nothing to step over.
    expect(field()).toHaveValue('31');
    expect(field().selectionStart).toBe(2);
  });

  it('steps the caret past a delimiter the mask just inserted', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} />);

    await user.type(field(), '311');

    expect(field()).toHaveValue('31/1');
    expect(field().selectionStart).toBe(4);
  });

  it('marks the field with data-mask and data-mask-completed', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} />);

    expect(field()).toHaveAttribute('data-mask', '');
    expect(field()).not.toHaveAttribute('data-mask-completed');

    await user.type(field(), '31122024');

    expect(field()).toHaveAttribute('data-mask-completed', '');
  });
});

describe('Input mask - 2. insert mid-string', () => {
  it('lands the caret after the inserted character, not at the end', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} defaultValue='1234' />);

    await user.click(field());
    caretTo(field(), 1);
    await user.keyboard('9');

    expect(field()).toHaveValue('19/23/4');
    expect(field().selectionStart).toBe(2);
  });
});

describe('Input mask - 3. backspace over a delimiter', () => {
  it('removes the preceding character too when backspace is true', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} defaultValue='1234' />);

    await user.click(field());
    caretTo(field(), 3); // just past the '/'
    await user.keyboard('{Backspace}');

    // The delimiter alone cannot be deleted — the mask would re-insert it and
    // the field would appear stuck. The digit before it goes instead.
    expect(field()).toHaveValue('13/4');
    expect(field().selectionStart).toBe(1);
  });

  it('steps over the delimiter without deleting when backspace is false', async () => {
    const user = userEvent.setup();
    render(
      <InputField aria-label='date' mask={{ ...DMY, backspace: false }} defaultValue='1234' />,
    );

    await user.click(field());
    caretTo(field(), 3);
    await user.keyboard('{Backspace}');

    expect(field()).toHaveValue('12/34');
    expect(field().selectionStart).toBe(2);
  });

  it('deletes normally when the caret is not behind a delimiter', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} defaultValue='1234' />);

    await user.click(field());
    await user.keyboard('{Backspace}');

    expect(field()).toHaveValue('12/3');
    expect(field().selectionStart).toBe(4);
  });
});

describe('Input mask - 4. forward delete', () => {
  it('deletes forward, stepping over a delimiter', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} defaultValue='1234' />);

    await user.click(field());
    caretTo(field(), 2); // immediately before the '/'
    await user.keyboard('{Delete}');

    expect(field()).toHaveValue('12/4');
    // A forward delete does not move the caret; the delimiter it sits behind is
    // stepped over silently.
    expect(field().selectionStart).toBe(2);
  });

  it('deletes the character under the caret when no delimiter is in the way', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} defaultValue='1234' />);

    await user.click(field());
    caretTo(field(), 0);
    await user.keyboard('{Delete}');

    expect(field()).toHaveValue('23/4');
    expect(field().selectionStart).toBe(0);
  });
});

describe('Input mask - 5. type over a selected range', () => {
  it('replaces the selection and puts the caret after the replacement', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} defaultValue='1234' />);

    await user.click(field());
    field().setSelectionRange(0, 2);
    await user.keyboard('9');

    expect(field()).toHaveValue('93/4');
    expect(field().selectionStart).toBe(1);
  });
});

describe('Input mask - 6. paste longer than the mask', () => {
  it('truncates at the block total and leaves the caret at the end', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} />);

    await user.click(field());
    await user.paste('1234567890123');

    expect(field()).toHaveValue('12/34/5678');
    expect(field().selectionStart).toBe(10);
  });
});

describe('Input mask - 7. paste an already-masked value', () => {
  it('is idempotent — no doubled delimiters', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} />);

    await user.click(field());
    await user.paste('12/34/5678');

    expect(field()).toHaveValue('12/34/5678');
  });
});

describe('Input mask - 8. IME composition', () => {
  const compose = (element: HTMLInputElement, inputType: string, value: string): void => {
    fireEvent(
      element,
      new InputEvent('beforeinput', { inputType, bubbles: true, cancelable: true }),
    );
    fireEvent.change(element, { target: { value } });
  };

  it('does not mask while a composition is in flight', () => {
    render(<InputField aria-label='date' mask={DMY} />);

    compose(field(), 'insertCompositionText', '1234');

    // Masking mid-composition would fight the composer over the same text.
    expect(field()).toHaveValue('1234');
  });

  it('masks once the composition commits', () => {
    render(<InputField aria-label='date' mask={DMY} />);

    compose(field(), 'insertCompositionText', '1234');
    fireEvent(
      field(),
      new InputEvent('beforeinput', {
        inputType: 'insertFromComposition',
        bubbles: true,
        cancelable: true,
      }),
    );
    fireEvent.change(field(), { target: { value: '1234' } });

    expect(field()).toHaveValue('12/34');
  });

  it('resumes masking after compositionend, even without insertFromComposition', () => {
    render(<InputField aria-label='date' mask={DMY} />);

    compose(field(), 'insertCompositionText', '1234');
    fireEvent.compositionEnd(field());
    fireEvent.change(field(), { target: { value: '1234' } });

    expect(field()).toHaveValue('12/34');
  });
});

describe('Input mask - 9. controlled echo', () => {
  /** A consumer that stores the raw digits and writes them back unmasked. */
  const Controlled = () => {
    const [raw, setRaw] = useState('');
    return (
      <InputField
        aria-label='date'
        mask={DMY}
        value={raw}
        onValueChange={(_value, meta) => setRaw(meta.raw)}
      />
    );
  };

  it('displays the masked projection and does not shift the caret', async () => {
    const user = userEvent.setup();
    render(<Controlled />);

    await user.type(field(), '1234');

    expect(field()).toHaveValue('12/34');
    expect(field().selectionStart).toBe(5);
  });

  it('keeps the caret in place when typing mid-string', async () => {
    const user = userEvent.setup();
    render(<Controlled />);

    await user.type(field(), '1234');
    caretTo(field(), 1);
    await user.keyboard('9');

    expect(field()).toHaveValue('19/23/4');
    expect(field().selectionStart).toBe(2);
  });
});

describe('Input mask - 10. mask omitted', () => {
  it('leaves the field identical to its previous behavior', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='plain' />);

    await user.type(field(), '31122024');

    expect(field()).toHaveValue('31122024');
    expect(field().selectionStart).toBe(8);
    expect(field()).not.toHaveAttribute('data-mask');
    expect(field()).not.toHaveAttribute('data-mask-completed');
  });

  it('does not touch the caret when typing mid-string', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='plain' defaultValue='1234' />);

    await user.click(field());
    caretTo(field(), 1);
    await user.keyboard('9');

    expect(field()).toHaveValue('19234');
    expect(field().selectionStart).toBe(2);
  });

  it('still forwards value and defaultValue natively', () => {
    const { unmount } = render(<InputField aria-label='plain' defaultValue='abc' />);
    expect(field()).toHaveValue('abc');
    unmount();

    render(<InputField aria-label='plain' value='xyz' onChange={() => {}} />);
    expect(field()).toHaveValue('xyz');
  });

  it('accepts a numeric value, as the native element does', () => {
    render(<InputField aria-label='plain' defaultValue={42} />);
    expect(field()).toHaveValue('42');
  });

  it('never calls onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(<InputField aria-label='plain' onValueChange={onValueChange} />);

    await user.type(field(), '12');

    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('Input mask - 11. undo / redo', () => {
  const history = (element: HTMLInputElement, inputType: 'historyUndo' | 'historyRedo'): void => {
    fireEvent(
      element,
      new InputEvent('beforeinput', { inputType, bubbles: true, cancelable: true }),
    );
  };

  it('restores the previous value and caret, then reapplies it', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} />);

    await user.type(field(), '1234');
    expect(field()).toHaveValue('12/34');

    history(field(), 'historyUndo');
    expect(field()).toHaveValue('12/3');
    expect(field().selectionStart).toBe(4);

    history(field(), 'historyUndo');
    expect(field()).toHaveValue('12');

    history(field(), 'historyRedo');
    expect(field()).toHaveValue('12/3');

    history(field(), 'historyRedo');
    expect(field()).toHaveValue('12/34');
  });

  it('stops at the start of the stack instead of clearing the field', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} />);

    await user.type(field(), '1');
    history(field(), 'historyUndo');
    expect(field()).toHaveValue('');

    history(field(), 'historyUndo');
    expect(field()).toHaveValue('');
  });

  it('stops at the end of the stack', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={DMY} />);

    await user.type(field(), '12');
    history(field(), 'historyRedo');
    expect(field()).toHaveValue('12');
  });
});

describe('Input mask - 12. input without beforeinput', () => {
  it('masks from the resulting value when no beforeinput arrives', () => {
    render(<InputField aria-label='date' mask={DMY} />);

    // fireEvent.change dispatches no beforeinput — exactly the fallback path.
    fireEvent.change(field(), { target: { value: '1234' } });

    expect(field()).toHaveValue('12/34');
    expect(field().selectionStart).toBe(5);
  });

  it('still clamps through the fallback', () => {
    render(<InputField aria-label='date' mask={{ date: true, delimiter: '/' }} />);

    fireEvent.change(field(), { target: { value: '35' } });

    expect(field()).toHaveValue('31');
  });
});

describe('Input mask - 13. L2 clamp while typing', () => {
  const dateMask: Mask = { date: true, delimiter: '/' };

  it('zero-pads a day first digit above 3', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={dateMask} />);

    await user.type(field(), '4');

    expect(field()).toHaveValue('04');
    expect(field().selectionStart).toBe(2);
  });

  it('clamps a day above 31', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={dateMask} />);

    await user.type(field(), '35');

    expect(field()).toHaveValue('31');
  });

  it('zero-pads rather than clamps when the first digit settles the block', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='date' mask={dateMask} />);

    // '4' can only be the 4th, so the day is complete after one keystroke and
    // the '5' starts the month. It never becomes '45', so it never clamps to 31.
    await user.type(field(), '45');

    expect(field()).toHaveValue('04/05');
  });

  it('zero-pads an hour first digit above 2', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='time' mask={{ time: true, delimiter: ':' }} />);

    await user.type(field(), '9');

    expect(field()).toHaveValue('09');
  });

  it('reports iso through onValueChange once the value is complete', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(<InputField aria-label='date' mask={dateMask} onValueChange={onValueChange} />);

    await user.type(field(), '31122024');

    expect(onValueChange).toHaveBeenLastCalledWith('31/12/2024', {
      raw: '31122024',
      completed: true,
      iso: '2024-12-31',
    });
  });
});

describe('Input mask - 14. L2 range clamp', () => {
  it('snaps a date past dateMax down to it', async () => {
    const user = userEvent.setup();
    render(
      <InputField aria-label='date' mask={{ date: true, delimiter: '/', dateMax: '2020-12-31' }} />,
    );

    await user.type(field(), '31122024');

    expect(field()).toHaveValue('31/12/2020');
  });

  it('ignores the range while the year is still incomplete', async () => {
    const user = userEvent.setup();
    render(
      <InputField aria-label='date' mask={{ date: true, delimiter: '/', dateMin: '2030-01-01' }} />,
    );

    await user.type(field(), '3112');

    // Clamping mid-typing would fight the user on every keystroke.
    expect(field()).toHaveValue('31/12');
  });
});

describe('Input mask - 15. L3 prefix acceptance', () => {
  const plate: Mask = { regex: /^[A-Z]{2}[0-9]{4}$/ };

  it('accepts each valid prefix as it is typed', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='plate' mask={plate} />);

    await user.type(field(), 'A');
    expect(field()).toHaveValue('A');
    await user.type(field(), 'B');
    expect(field()).toHaveValue('AB');
    await user.type(field(), '1');
    expect(field()).toHaveValue('AB1');
  });

  it('rejects a character that could never lead to a match', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='plate' mask={plate} />);

    await user.type(field(), 'A1');

    expect(field()).toHaveValue('A');
  });

  it('completes only on a full match', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='plate' mask={plate} />);

    await user.type(field(), 'AB123');
    expect(field()).not.toHaveAttribute('data-mask-completed');

    await user.type(field(), '4');
    expect(field()).toHaveAttribute('data-mask-completed', '');
  });
});

describe('Input mask - 16. L3 unanalysable pattern', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it('degrades to pass-through rather than locking the user out', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='x' mask={{ regex: /^(?<=\d)[a-z]+$/ }} />);

    await user.type(field(), 'anything');

    expect(field()).toHaveValue('anything');
  });

  it('does not report the field as permanently incomplete', () => {
    render(<InputField aria-label='x' mask={{ regex: /^(?<=1)[a-z]+$/ }} />);

    expect(field()).toHaveAttribute('data-mask-completed', '');
  });
});

describe('Input mask - 16b. L3 unanalysable pattern warns', () => {
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it('warns once, naming the pattern and the reason', () => {
    render(<InputField aria-label='x' mask={{ regex: /^(?<=2)[a-z]+$/ }} />);

    expect(warn).toHaveBeenCalledTimes(1);
    const message = String(warn.mock.calls[0]?.[0]);
    expect(message).toContain('(?<=2)');
    expect(message).toContain('[spar]');
    // The reason is what makes the warning actionable rather than a shrug.
    expect(message.length).toBeGreaterThan(`(?<=2)[a-z]+`.length + 20);
  });

  it('does not repeat per keystroke', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='x' mask={{ regex: /^(?<=3)[a-z]+$/ }} />);
    warn.mockClear();

    await user.type(field(), 'abcdef');

    expect(warn).not.toHaveBeenCalled();
  });

  it('is absent in production', () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      render(<InputField aria-label='x' mask={{ regex: /^(?<=4)[a-z]+$/ }} />);
      expect(warn).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = previous;
    }
  });
});

describe('Input mask - 17. resolver context', () => {
  it('receives caret, previousValue and inputType', async () => {
    const user = userEvent.setup();
    const resolver = jest.fn<{ value: string }, Parameters<MaskResolver>>((value) => ({ value }));
    render(<InputField aria-label='x' mask={resolver} />);

    await user.type(field(), 'ab');

    // The pre-render pass calls the resolver too, with no inputType; the edit
    // calls are the ones carrying it.
    const edits = resolver.mock.calls.filter(([, context]) => context.inputType !== undefined);
    expect(edits.at(-1)).toEqual(['ab', { caret: 2, previousValue: 'a', inputType: 'insertText' }]);
  });
});

describe('Input mask - 18. resolver caret, unaided', () => {
  it('keeps the caret on the typed character when the resolver inserts a separator', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='amount' mask={numeral} />);

    await user.type(field(), '1234');

    // The resolver returned only a value; the caret came from anchor counting.
    expect(field()).toHaveValue('1.234');
    expect(field().selectionStart).toBe(5);
  });
});

describe('Input mask - 19. resolver caret override', () => {
  it('wins over anchor counting', async () => {
    const user = userEvent.setup();
    const pinned: MaskResolver = (value) => ({ value: value.replace(/\D/g, ''), caret: 0 });
    render(<InputField aria-label='x' mask={pinned} />);

    await user.type(field(), '1');
    // Anchor counting would put the caret at 1; the resolver said 0.
    expect(field().selectionStart).toBe(0);

    // And it keeps saying 0, so every further keystroke lands at the front.
    // (keyboard, not type — type() clicks first, which moves the caret to the end.)
    await user.keyboard('23');
    expect(field()).toHaveValue('321');
    expect(field().selectionStart).toBe(0);
  });
});

describe('Input mask - 20. anchor counting is shared', () => {
  it('produces the same caret through an L1 delimiter mask and through a resolver', async () => {
    const l1: Mask = { blocks: [1, 3, 3], delimiter: '.' };

    /** The same grouping and the same capacity, expressed as a resolver. */
    const asResolver: MaskResolver = (value) => {
      const digits = value.replace(/\D/g, '').slice(0, 7);
      const parts = [digits.slice(0, 1), digits.slice(1, 4), digits.slice(4, 7)];
      return { value: parts.filter(Boolean).join('.') };
    };

    const run = async (mask: Mask): Promise<[string, number | null]> => {
      const user = userEvent.setup();
      const view = render(<InputField aria-label='x' mask={mask} />);
      await user.type(field(), '1234567');
      caretTo(field(), 5);
      await user.keyboard('9');
      const result: [string, number | null] = [field().value, field().selectionStart];
      view.unmount();
      return result;
    };

    const viaBlocks = await run(l1);
    const viaResolver = await run(asResolver);

    expect(viaBlocks[0]).toBe('1.234.956');
    expect(viaBlocks[1]).toBe(7);
    // Same offset algorithm, reached through two entirely different layers.
    expect(viaResolver).toEqual(viaBlocks);
  });
});

describe('Input mask - 21. numeral resolver', () => {
  it('keeps the caret on the typed digit after the separators shift', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='amount' mask={numeral} />);

    await user.type(field(), '1234567');
    expect(field()).toHaveValue('1.234.567');

    caretTo(field(), 5); // just after the '4'
    await user.keyboard('9');

    expect(field()).toHaveValue('12.349.567');
    expect(field().selectionStart).toBe(6);
  });

  it('does not drop the caret across a removed separator when deleting a digit', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='amount' mask={numeral} />);

    await user.type(field(), '1234567');
    caretTo(field(), 3); // just after the '2'
    await user.keyboard('{Backspace}');

    expect(field()).toHaveValue('134.567');
    expect(field().selectionStart).toBe(1);
  });
});

describe('Input mask - 22. insignificant override', () => {
  /** Separators that are themselves alphanumeric, so the default predicate misreads them. */
  const grouped =
    (insignificant?: RegExp): MaskResolver =>
    (value) => {
      const digits = value.replace(/\D/g, '');
      const parts = digits.match(/.{1,2}/g) ?? [];
      return {
        value: parts.join('x'),
        ...(insignificant ? { insignificant } : {}),
      };
    };

  const typeMidString = async (mask: Mask): Promise<number | null> => {
    const user = userEvent.setup();
    const view = render(<InputField aria-label='x' mask={mask} />);
    await user.type(field(), '1234');
    caretTo(field(), 2);
    await user.keyboard('9');
    const caret = field().selectionStart;
    view.unmount();
    return caret;
  };

  it('anchors correctly once the resolver supplies the predicate', async () => {
    expect(await typeMidString(grouped(/x/))).toBe(4);
  });

  it('misplaces the caret without it, which is why the override exists', async () => {
    // 'x' is a letter, so the default predicate counts it as significant and the
    // caret lands on the separator instead of after the typed digit.
    expect(await typeMidString(grouped())).toBe(3);
  });
});

/**
 * Rows 23–25 are not behaviours of the mask so much as of the *architecture*:
 * `date` and `time` are resolvers, so anything they can do a resolver you write
 * can do as well. Each case pairs a built-in against a userland equivalent — if
 * one of these ever fails, the built-ins have regained a privilege.
 */
describe('Input mask - 23. the built-in masks are resolvers', () => {
  it('the date sugar and createDateMask are the same mask', async () => {
    const user = userEvent.setup();
    const seen: Array<string | undefined> = [];

    const options = { date: true, delimiter: '/' } as const;

    for (const mask of [options as Mask, createDateMask(options)]) {
      const view = render(
        <InputField aria-label='d' mask={mask} onValueChange={(_v, meta) => seen.push(meta.iso)} />,
      );
      await user.type(field(), '31122024');
      expect(field().value).toBe('31/12/2024');
      view.unmount();
    }

    expect(seen.at(-1)).toBe('2024-12-31');
    expect(seen.filter((iso) => iso === '2024-12-31')).toHaveLength(2);
  });

  it('the time sugar and createTimeMask are the same mask', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='t' mask={createTimeMask({ time: true, delimiter: ':' })} />);
    await user.type(field(), '2360');
    expect(field().value).toBe('23:06');
  });

  it('a built-in mask can be wrapped, because it is an ordinary function', async () => {
    const user = userEvent.setup();
    const base = createDateMask({ date: true, delimiter: '/' });
    // Rejects a completed date outside the decade by deferring to the built-in
    // first — composition needs no API of its own.
    const nineties: MaskResolver = (raw, ctx) => {
      const result = base(raw, ctx);
      return result.completed && !result.iso?.startsWith('199')
        ? { ...result, completed: false }
        : result;
    };

    const onValueChange = jest.fn();
    render(<InputField aria-label='d' mask={nineties} onValueChange={onValueChange} />);
    await user.type(field(), '31121995');

    expect(field().value).toBe('31/12/1995');
    expect(onValueChange).toHaveBeenLastCalledWith(
      '31/12/1995',
      expect.objectContaining({ completed: true, iso: '1995-12-31' }),
    );
  });
});

describe('Input mask - 24. a resolver reports iso and raw', () => {
  /** Formats a Turkish IBAN in four-character groups and emits the flat form. */
  const iban: MaskResolver = (value) => {
    const flat = value
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase()
      .slice(0, 26);
    return {
      value: flat.match(/.{1,4}/g)?.join(' ') ?? '',
      iso: flat,
      completed: flat.length === 26,
    };
  };

  it('surfaces the resolver iso through onValueChange, like date does', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(<InputField aria-label='iban' mask={iban} onValueChange={onValueChange} />);

    await user.type(field(), 'TR330006100519786457841326');

    expect(field().value).toBe('TR33 0006 1005 1978 6457 8413 26');
    expect(onValueChange).toHaveBeenLastCalledWith(
      'TR33 0006 1005 1978 6457 8413 26',
      expect.objectContaining({ iso: 'TR330006100519786457841326', completed: true }),
    );
  });

  it('defaults raw to the value with separators stripped', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(<InputField aria-label='n' mask={numeral} onValueChange={onValueChange} />);

    await user.type(field(), '1234');

    expect(onValueChange).toHaveBeenLastCalledWith(
      '1.234',
      expect.objectContaining({ raw: '1234' }),
    );
  });

  it('honours an explicit raw, for a mask that adds characters of its own', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    // A currency symbol is a letter-or-number in some scripts and not in others,
    // so `insignificant` cannot describe it — the resolver states raw instead.
    const price: MaskResolver = (value) => {
      const digits = value.replace(/\D/g, '');
      return { value: digits ? `${digits} TL` : '', raw: digits };
    };
    render(<InputField aria-label='p' mask={price} onValueChange={onValueChange} />);

    await user.type(field(), '25');

    expect(onValueChange).toHaveBeenLastCalledWith('25 TL', expect.objectContaining({ raw: '25' }));
  });
});

describe('Input mask - 25. a resolver opts out of backspace-through', () => {
  const grouped = (backspace?: boolean): MaskResolver => {
    const resolver: MaskResolver = (value) => {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      return { value: digits.match(/.{1,2}/g)?.join('/') ?? '' };
    };
    if (backspace !== undefined) resolver.backspace = backspace;
    return resolver;
  };

  const backspaceAt = async (mask: Mask, position: number): Promise<[string, number | null]> => {
    const user = userEvent.setup();
    const view = render(<InputField aria-label='g' mask={mask} />);
    await user.type(field(), '1234');
    caretTo(field(), position);
    await user.keyboard('{Backspace}');
    const state: [string, number | null] = [field().value, field().selectionStart];
    view.unmount();
    return state;
  };

  it('deletes through the separator by default, like an L1 pattern', async () => {
    expect(await backspaceAt(grouped(), 3)).toEqual(['13/4', 1]);
  });

  it('steps over the separator when the resolver sets backspace to false', async () => {
    expect(await backspaceAt(grouped(false), 3)).toEqual(['12/34', 2]);
  });

  it('matches the L1 pattern with the same flag', async () => {
    const pattern: Mask = { blocks: [2, 2], delimiter: '/', backspace: false };
    expect(await backspaceAt(pattern, 3)).toEqual(['12/34', 2]);
  });
});

/**
 * Row 26 — the `number` mask. The third shipped resolver, and the only one whose
 * output length is not fixed: grouping is applied right-to-left as the value
 * grows, so every assertion here is really about the caret surviving separators
 * that move.
 */
describe('Input mask - 26. number', () => {
  const TRY: Mask = { number: true, numberLocale: 'tr-TR' };

  it('regroups while typing and keeps the caret at the end', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='amount' mask={TRY} />);

    await user.type(field(), '1234567');

    expect(field()).toHaveValue('1.234.567');
    expect(field().selectionStart).toBe(9);
  });

  it('holds the caret against a separator inserted to its left', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='amount' mask={TRY} />);

    // '1.234' with the caret between '2' and '3'; typing there pushes the
    // grouping one place left, so a fixed offset would drift.
    await user.type(field(), '1234');
    caretTo(field(), 3);
    await user.keyboard('9');

    expect(field()).toHaveValue('12.934');
    // Three significant characters in ('1', '2', '9'), the separator skipped —
    // the offset itself changed, the anchor did not.
    expect(field().selectionStart).toBe(4);
  });

  it('opens the fraction on the locale decimal mark', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='amount' mask={TRY} />);

    await user.type(field(), '1234,5');

    expect(field()).toHaveValue('1.234,5');
    expect(field().selectionStart).toBe(7);
  });

  it('supplies the integer zero when the fraction is opened first', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='amount' mask={TRY} />);

    await user.type(field(), ',5');

    // The mask synthesised the '0', so anchor counting cannot see it — the caret
    // is at the end, which is where the user is typing.
    expect(field()).toHaveValue('0,5');
    expect(field().selectionStart).toBe(3);
  });

  it('reports raw and a Number()-parseable iso', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(<InputField aria-label='amount' mask={TRY} onValueChange={onValueChange} />);

    await user.type(field(), '1234567,89');

    expect(onValueChange).toHaveBeenLastCalledWith('1.234.567,89', {
      raw: '1234567,89',
      completed: true,
      iso: '1234567.89',
    });
  });

  it('deletes through a group separator, like every other layer', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='amount' mask={TRY} />);

    await user.type(field(), '1234');
    // '1.234' — Backspace with the caret just after the separator removes the
    // digit before it, then the value regroups below the grouping threshold.
    caretTo(field(), 2);
    await user.keyboard('{Backspace}');

    expect(field()).toHaveValue('234');
  });

  it('clamps the integer part with numberIntegerScale', async () => {
    const user = userEvent.setup();
    render(<InputField aria-label='amount' mask={{ ...TRY, numberIntegerScale: 4 }} />);

    await user.type(field(), '123456789');

    expect(field()).toHaveValue('1.234');
  });

  it('the number sugar and createNumberMask are the same mask', async () => {
    const user = userEvent.setup();
    const options = { number: true, numberLocale: 'tr-TR' } as const;
    const seen: Array<string | undefined> = [];

    for (const mask of [options as Mask, createNumberMask(options)]) {
      const view = render(
        <InputField aria-label='n' mask={mask} onValueChange={(_v, meta) => seen.push(meta.iso)} />,
      );
      await user.type(field(), '1234,5');
      expect(field().value).toBe('1.234,5');
      view.unmount();
    }

    expect(seen.filter((iso) => iso === '1234.5')).toHaveLength(2);
  });

  it('can be wrapped, because it is an ordinary function', async () => {
    const user = userEvent.setup();
    const base = createNumberMask({ number: true, numberLocale: 'tr-TR' });
    // A budget field that refuses to report anything over the cap as complete.
    const capped: MaskResolver = (raw, ctx) => {
      const result = base(raw, ctx);
      return Number(result.iso) > 5000 ? { ...result, completed: false, iso: undefined } : result;
    };

    const onValueChange = jest.fn();
    render(<InputField aria-label='n' mask={capped} onValueChange={onValueChange} />);
    await user.type(field(), '9999');

    expect(field()).toHaveValue('9.999');
    // `iso` is absent rather than present-and-undefined: `useMask` omits the key
    // when a resolver withholds it, so a consumer can test `'iso' in meta`.
    const [value, meta] = onValueChange.mock.calls.at(-1) as [string, object];
    expect(value).toBe('9.999');
    expect(meta).toEqual({ raw: '9999', completed: false });
  });
});
