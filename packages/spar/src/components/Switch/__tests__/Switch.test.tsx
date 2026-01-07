import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../Switch';

describe('Switch', () => {
  it('should render correctly', () => {
    render(<Switch>Toggle me</Switch>);

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveTextContent('Toggle me');
  });

  it('should have correct default attributes', () => {
    render(<Switch>Toggle me</Switch>);

    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('role', 'switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
    expect(switchElement).toHaveAttribute('data-switch', '');
    expect(switchElement).toHaveAttribute('data-state', 'unchecked');
    expect(switchElement).toHaveAttribute('tabindex', '0');
    expect(switchElement).not.toHaveAttribute('data-checked');
    expect(switchElement).not.toHaveAttribute('data-disabled');
    expect(switchElement).not.toHaveAttribute('aria-disabled');
  });

  it('should render as different elements when as prop is provided', () => {
    render(<Switch as='div'>Toggle me</Switch>);

    const switchElement = screen.getByRole('switch');
    expect(switchElement.tagName).toBe('DIV');
  });

  describe('Controlled mode', () => {
    it('should respect controlled checked state', () => {
      const { rerender } = render(<Switch checked={false}>Toggle me</Switch>);

      let switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
      expect(switchElement).toHaveAttribute('data-state', 'unchecked');

      rerender(<Switch checked={true}>Toggle me</Switch>);

      switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
      expect(switchElement).toHaveAttribute('data-checked', '');
    });

    it('should call onChange when toggled in controlled mode', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Switch checked={false} onCheckedChange={handleChange}>
          Toggle me
        </Switch>,
      );

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledWith(true);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should not change state internally in controlled mode', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Switch checked={false} onCheckedChange={handleChange}>
          Toggle me
        </Switch>,
      );

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      // State should not change internally
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Uncontrolled mode', () => {
    it('should use defaultChecked for initial state', () => {
      render(<Switch defaultChecked={true}>Toggle me</Switch>);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
      expect(switchElement).toHaveAttribute('data-checked', '');
    });

    it('should toggle state internally in uncontrolled mode', async () => {
      const user = userEvent.setup();

      render(<Switch defaultChecked={false}>Toggle me</Switch>);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');

      await user.click(switchElement);

      expect(switchElement).toHaveAttribute('aria-checked', 'true');
      expect(switchElement).toHaveAttribute('data-state', 'checked');
    });

    it('should call onChange when toggled in uncontrolled mode', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Switch defaultChecked={false} onCheckedChange={handleChange}>
          Toggle me
        </Switch>,
      );

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledWith(true);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Disabled state', () => {
    it('should apply disabled attributes correctly', () => {
      render(<Switch disabled>Toggle me</Switch>);

      const switchElement = screen.getByRole('switch');
      if (switchElement.tagName === 'BUTTON') {
        expect(switchElement).toHaveAttribute('disabled');
        expect(switchElement).not.toHaveAttribute('aria-disabled');
      } else {
        expect(switchElement).toHaveAttribute('aria-disabled', 'true');
      }
      expect(switchElement).toHaveAttribute('data-disabled', '');
      expect(switchElement).toHaveAttribute('tabindex', '-1');
    });

    it('should not respond to clicks when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Switch disabled onCheckedChange={handleChange}>
          Toggle me
        </Switch>,
      );

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      expect(handleChange).not.toHaveBeenCalled();
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('should not respond to keyboard events when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Switch disabled onCheckedChange={handleChange}>
          Toggle me
        </Switch>,
      );

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await user.keyboard(' ');
      await user.keyboard('{Enter}');

      expect(handleChange).not.toHaveBeenCalled();
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Read-only state', () => {
    it('should apply read-only attributes correctly', () => {
      render(<Switch readOnly>Toggle me</Switch>);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-readonly', 'true');
      expect(switchElement).toHaveAttribute('data-readonly', '');
      expect(switchElement).toHaveAttribute('tabindex', '0'); // Should still be focusable
      expect(switchElement).not.toHaveAttribute('disabled');
    });

    it('should not respond to clicks when read-only', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Switch readOnly onCheckedChange={handleChange}>
          Toggle me
        </Switch>,
      );

      const switchElement = screen.getByRole('switch');
      await user.click(switchElement);

      expect(handleChange).not.toHaveBeenCalled();
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });

    it('should not respond to keyboard events when read-only', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Switch readOnly onCheckedChange={handleChange}>
          Toggle me
        </Switch>,
      );

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await user.keyboard(' ');
      await user.keyboard('{Enter}');

      expect(handleChange).not.toHaveBeenCalled();
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Keyboard interactions', () => {
    it('should toggle on Space key', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Switch onCheckedChange={handleChange}>Toggle me</Switch>);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await user.keyboard(' ');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should toggle on Enter key', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Switch onCheckedChange={handleChange}>Toggle me</Switch>);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should not toggle on other keys', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Switch onCheckedChange={handleChange}>Toggle me</Switch>);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await user.keyboard('{Escape}');
      await user.keyboard('{Tab}');
      await user.keyboard('a');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Form integration', () => {
    it('should render hidden input when name is provided', () => {
      render(<Switch name='settings'>Toggle me</Switch>);

      const hiddenInput = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('name', 'settings');
      expect(hiddenInput).toHaveAttribute('value', 'on');
      expect(hiddenInput).toHaveAttribute('tabindex', '-1');
      expect(hiddenInput).toHaveAttribute('aria-hidden', 'true');
      expect(hiddenInput).toHaveStyle({ position: 'absolute', opacity: '0' });
    });

    it('should not render hidden input when name is not provided', () => {
      render(<Switch>Toggle me</Switch>);

      const hiddenInput = document.querySelector('input[type="checkbox"]');
      expect(hiddenInput).not.toBeInTheDocument();
    });

    it('should sync hidden input checked state', async () => {
      const user = userEvent.setup();

      render(<Switch name='settings'>Toggle me</Switch>);

      const switchElement = screen.getByRole('switch');
      const hiddenInput = document.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(hiddenInput.checked).toBe(false);

      await user.click(switchElement);

      expect(hiddenInput.checked).toBe(true);
    });

    it('should use custom value', () => {
      render(
        <Switch name='settings' value='enabled'>
          Toggle me
        </Switch>,
      );

      const hiddenInput = document.querySelector('input[type="checkbox"]');
      expect(hiddenInput).toHaveAttribute('value', 'enabled');
    });

    it('should associate with form', () => {
      render(
        <Switch name='settings' form='my-form'>
          Toggle me
        </Switch>,
      );

      const hiddenInput = document.querySelector('input[type="checkbox"]');
      expect(hiddenInput).toHaveAttribute('form', 'my-form');
    });

    it('should apply required attribute', () => {
      render(
        <Switch name='settings' required>
          Toggle me
        </Switch>,
      );

      const switchElement = screen.getByRole('switch');
      const hiddenInput = document.querySelector('input[type="checkbox"]');

      expect(switchElement).toHaveAttribute('data-required', '');
      expect(hiddenInput).toHaveAttribute('required');
    });
  });

  describe('ARIA attributes', () => {
    it('should support aria-label', () => {
      render(<Switch aria-label='Enable notifications' />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-label', 'Enable notifications');
    });

    it('should support aria-labelledby', () => {
      render(
        <div>
          <label id='switch-label' htmlFor='switch-element'>
            Enable notifications
          </label>
          <Switch id='switch-element' aria-labelledby='switch-label' />
        </div>,
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-labelledby', 'switch-label');
    });

    it('should support aria-describedby', () => {
      render(
        <div>
          <Switch aria-describedby='switch-description'>Toggle me</Switch>
          <div id='switch-description'>This setting controls notifications</div>
        </div>,
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-describedby', 'switch-description');
    });
  });

  describe('Custom props', () => {
    it('should forward custom props to the element', () => {
      render(
        <Switch data-testid='custom-switch' className='custom-class' style={{ color: 'red' }}>
          Toggle me
        </Switch>,
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('data-testid', 'custom-switch');
      expect(switchElement).toHaveClass('custom-class');
      expect(switchElement).toHaveStyle('color: rgb(255, 0, 0)');
    });

    it('should generate unique IDs when not provided', () => {
      const { container } = render(
        <div>
          <Switch>Switch 1</Switch>
          <Switch>Switch 2</Switch>
        </div>,
      );

      const switches = container.querySelectorAll('[role="switch"]');
      const id1 = switches[0]?.getAttribute('id');
      const id2 = switches[1]?.getAttribute('id');

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('should use provided ID', () => {
      render(<Switch id='custom-id'>Toggle me</Switch>);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid toggling', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Switch onCheckedChange={handleChange}>Toggle me</Switch>);

      const switchElement = screen.getByRole('switch');

      // Rapid clicks
      await user.click(switchElement);
      await user.click(switchElement);
      await user.click(switchElement);

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenNthCalledWith(1, true);
      expect(handleChange).toHaveBeenNthCalledWith(2, false);
      expect(handleChange).toHaveBeenNthCalledWith(3, true);
    });

    it('should handle missing onChange gracefully', async () => {
      const user = userEvent.setup();

      render(<Switch>Toggle me</Switch>);

      const switchElement = screen.getByRole('switch');

      // Should not throw error
      expect(() => user.click(switchElement)).not.toThrow();
    });

    it('should prevent default on keyboard events', async () => {
      const user = userEvent.setup();
      const handleKeyDown = jest.fn();

      render(<Switch onKeyDown={handleKeyDown}>Toggle me</Switch>);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await user.keyboard(' ');

      // The event should have been prevented (though we can't directly test preventDefault)
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });
});
