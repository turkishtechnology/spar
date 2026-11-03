import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, DialogContent, DialogOverlay, DialogTitle, DialogTrigger } from '../Dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../Select';

// Real portals on purpose: the bug only exists because nested layers are
// rendered into `document.body`, outside the parent layer's DOM node.

const CabinSelect = ({ onChange }: { onChange?: (value: string) => void }) => (
  <Select onChange={onChange}>
    <SelectTrigger aria-label='Cabin' placeholder='Pick a cabin' />
    <SelectContent>
      <SelectItem value='economy' label='Economy'>
        Economy
      </SelectItem>
      <SelectItem value='business' label='Business'>
        Business
      </SelectItem>
    </SelectContent>
  </Select>
);

const getDialog = () => screen.queryByRole('dialog', { name: 'Passenger' });

describe('Nested floating layers', () => {
  describe('inside a modal Dialog', () => {
    const renderDialog = (onOpenChange = jest.fn(), onChange = jest.fn()) => {
      render(
        <>
          <button type='button'>Elsewhere</button>
          <Dialog defaultOpen onOpenChange={onOpenChange}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogOverlay />
            <DialogContent>
              <DialogTitle>Passenger</DialogTitle>
              <CabinSelect onChange={onChange} />
              <Popover>
                <PopoverTrigger>Baggage</PopoverTrigger>
                <PopoverContent>
                  <button type='button'>Inside popover</button>
                </PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Pick seat</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DialogContent>
          </Dialog>
        </>,
      );
      return { onOpenChange, onChange };
    };

    it('stays open when an option of a nested Select is picked', async () => {
      const user = userEvent.setup();
      const { onOpenChange, onChange } = renderDialog();

      await user.click(screen.getByRole('combobox', { name: 'Cabin' }));
      const option = screen.getByRole('option', { name: 'Business' });
      expect(getDialog()?.contains(option)).toBe(false);
      await user.click(option);

      expect(onChange).toHaveBeenCalledWith('business');
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(getDialog()).toBeInTheDocument();
    });

    it('stays open when pressing inside a nested Popover', async () => {
      const user = userEvent.setup();
      const { onOpenChange } = renderDialog();

      await user.click(screen.getByRole('button', { name: 'Baggage' }));
      const inside = screen.getByRole('button', { name: 'Inside popover' });
      expect(getDialog()?.contains(inside)).toBe(false);
      await user.click(inside);

      expect(onOpenChange).not.toHaveBeenCalled();
      expect(getDialog()).toBeInTheDocument();
    });

    it('stays open when an item of a nested DropdownMenu is picked', async () => {
      const user = userEvent.setup();
      const { onOpenChange } = renderDialog();

      await user.click(screen.getByRole('button', { name: 'Actions' }));
      const item = screen.getByRole('menuitem', { name: 'Pick seat' });
      expect(getDialog()?.contains(item)).toBe(false);
      await user.click(item);

      expect(onOpenChange).not.toHaveBeenCalled();
      expect(getDialog()).toBeInTheDocument();
    });

    it('still closes on a genuine outside press', async () => {
      const user = userEvent.setup();
      const { onOpenChange } = renderDialog();

      await user.click(screen.getByRole('button', { name: 'Elsewhere' }));

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('does not report nested-layer presses to onPointerDownOutside', async () => {
      const user = userEvent.setup();
      const onPointerDownOutside = jest.fn();
      const onPointerDownCapture = jest.fn();
      render(
        <Dialog defaultOpen>
          <DialogContent
            onPointerDownOutside={onPointerDownOutside}
            onPointerDownCapture={onPointerDownCapture}
          >
            <DialogTitle>Passenger</DialogTitle>
            <CabinSelect />
          </DialogContent>
        </Dialog>,
      );

      await user.click(screen.getByRole('combobox', { name: 'Cabin' }));
      await user.click(screen.getByRole('option', { name: 'Economy' }));

      expect(onPointerDownOutside).not.toHaveBeenCalled();
      // The consumer's own capture handler is composed, not replaced.
      expect(onPointerDownCapture).toHaveBeenCalled();
    });
  });

  describe('inside a non-modal Popover', () => {
    it('stays open when focus and pointer move into a nested Select', async () => {
      const user = userEvent.setup();
      const onOpenChange = jest.fn();
      const onChange = jest.fn();
      render(
        <>
          <button type='button'>Elsewhere</button>
          <Popover defaultOpen onOpenChange={onOpenChange}>
            <PopoverTrigger>Filters</PopoverTrigger>
            <PopoverContent aria-label='Filters panel'>
              <CabinSelect onChange={onChange} />
            </PopoverContent>
          </Popover>
        </>,
      );

      await user.click(screen.getByRole('combobox', { name: 'Cabin' }));
      await user.click(screen.getByRole('option', { name: 'Business' }));

      expect(onChange).toHaveBeenCalledWith('business');
      expect(onOpenChange).not.toHaveBeenCalledWith(false);
      expect(screen.getByLabelText('Filters panel')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Elsewhere' }));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
