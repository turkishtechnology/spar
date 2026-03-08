import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button Integration', () => {
  describe('Form Integration', () => {
    it('should submit form when type is submit', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Button type='submit'>Submit Form</Button>
        </form>,
      );

      const submitButton = screen.getByRole('button', { name: 'Submit Form' });
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should reset form when type is reset', async () => {
      const user = userEvent.setup();
      const handleReset = jest.fn();

      render(
        <form onReset={handleReset}>
          <input defaultValue='test' />
          <Button type='reset'>Reset Form</Button>
        </form>,
      );

      const resetButton = screen.getByRole('button', { name: 'Reset Form' });
      await user.click(resetButton);

      expect(handleReset).toHaveBeenCalledTimes(1);
    });

    it('should not submit form when disabled', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Button type='submit' disabled>
            Submit Disabled
          </Button>
        </form>,
      );

      const submitButton = screen.getByRole('button', { name: 'Submit Disabled' });
      await user.click(submitButton);

      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('should not submit form when loading', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Button type='submit' isLoading disabled>
            Submit Loading
          </Button>
        </form>,
      );

      const submitButton = screen.getByRole('button', { name: /Submit Loading/i });
      await user.click(submitButton);

      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Event Propagation', () => {
    it('should stop event propagation when specified', async () => {
      const user = userEvent.setup();
      const parentClick = jest.fn();
      const buttonClick = jest.fn((e) => e.stopPropagation());

      render(
        <div onClick={parentClick}>
          <Button onClick={buttonClick}>Stop Propagation</Button>
        </div>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(buttonClick).toHaveBeenCalledTimes(1);
      expect(parentClick).not.toHaveBeenCalled();
    });

    it('should allow event propagation by default', async () => {
      const user = userEvent.setup();
      const parentClick = jest.fn();
      const buttonClick = jest.fn();

      render(
        <div onClick={parentClick}>
          <Button onClick={buttonClick}>Allow Propagation</Button>
        </div>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(buttonClick).toHaveBeenCalledTimes(1);
      expect(parentClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events with propagation', async () => {
      const user = userEvent.setup();
      const parentKeyDown = jest.fn();
      const buttonKeyDown = jest.fn();

      render(
        <div onKeyDown={parentKeyDown}>
          <Button onKeyDown={buttonKeyDown}>Keyboard Test</Button>
        </div>,
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(buttonKeyDown).toHaveBeenCalledTimes(1);
      expect(parentKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Multi-Component Interactions', () => {
    it('should work with multiple buttons in a group', async () => {
      const user = userEvent.setup();
      const button1Click = jest.fn();
      const button2Click = jest.fn();
      const button3Click = jest.fn();

      render(
        <div role='group' aria-label='Button Group'>
          <Button onClick={button1Click}>Button 1</Button>
          <Button onClick={button2Click}>Button 2</Button>
          <Button onClick={button3Click} disabled>
            Button 3
          </Button>
        </div>,
      );

      const button1 = screen.getByRole('button', { name: 'Button 1' });
      const button2 = screen.getByRole('button', { name: 'Button 2' });
      const button3 = screen.getByRole('button', { name: 'Button 3' });

      await user.click(button1);
      await user.click(button2);
      await user.click(button3);

      expect(button1Click).toHaveBeenCalledTimes(1);
      expect(button2Click).toHaveBeenCalledTimes(1);
      expect(button3Click).not.toHaveBeenCalled();
    });

    it('should work with toggle buttons group', async () => {
      const user = userEvent.setup();

      const ToggleGroup = () => {
        const [selected, setSelected] = React.useState<string | null>(null);

        const handleToggle = (value: string) => {
          setSelected(selected === value ? null : value);
        };

        return (
          <div role='group' aria-label='Toggle Group'>
            <Button
              isPressed={selected === 'option1'}
              onPressedChange={() => handleToggle('option1')}
            >
              Option 1
            </Button>
            <Button
              isPressed={selected === 'option2'}
              onPressedChange={() => handleToggle('option2')}
            >
              Option 2
            </Button>
            <Button
              isPressed={selected === 'option3'}
              onPressedChange={() => handleToggle('option3')}
            >
              Option 3
            </Button>
          </div>
        );
      };

      render(<ToggleGroup />);

      const option1 = screen.getByRole('button', { name: 'Option 1' });
      const option2 = screen.getByRole('button', { name: 'Option 2' });
      const option3 = screen.getByRole('button', { name: 'Option 3' });

      // Initially none pressed
      expect(option1).toHaveAttribute('aria-pressed', 'false');
      expect(option2).toHaveAttribute('aria-pressed', 'false');
      expect(option3).toHaveAttribute('aria-pressed', 'false');

      // Click option 1
      await user.click(option1);
      expect(option1).toHaveAttribute('aria-pressed', 'true');
      expect(option2).toHaveAttribute('aria-pressed', 'false');
      expect(option3).toHaveAttribute('aria-pressed', 'false');

      // Click option 2
      await user.click(option2);
      expect(option1).toHaveAttribute('aria-pressed', 'false');
      expect(option2).toHaveAttribute('aria-pressed', 'true');
      expect(option3).toHaveAttribute('aria-pressed', 'false');

      // Click option 2 again to deselect
      await user.click(option2);
      expect(option1).toHaveAttribute('aria-pressed', 'false');
      expect(option2).toHaveAttribute('aria-pressed', 'false');
      expect(option3).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Deterministic loading flow', () => {
    it('should prevent repeated activation while parent keeps loading=true', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      const LoadingButton = () => {
        const [isLoading, setIsLoading] = React.useState(false);

        const onClick = () => {
          setIsLoading(true);
          handleClick();
        };

        return (
          <>
            <Button onClick={onClick} isLoading={isLoading}>
              Process
            </Button>
            <button type='button' onClick={() => setIsLoading(false)}>
              Finish
            </button>
          </>
        );
      };

      render(<LoadingButton />);

      const button = screen.getByRole('button', { name: 'Process' });
      const finish = screen.getByRole('button', { name: 'Finish' });

      await user.click(button);
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);

      await user.click(finish);
      await user.click(button);
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Real-world composition', () => {
    it('should work in a toolbar', async () => {
      const user = userEvent.setup();
      const actions = {
        bold: jest.fn(),
        italic: jest.fn(),
        underline: jest.fn(),
      };

      const Toolbar = () => {
        const [formatting, setFormatting] = React.useState({
          bold: false,
          italic: false,
          underline: false,
        });

        const toggleFormat = (format: keyof typeof formatting) => {
          setFormatting((prev) => ({
            ...prev,
            [format]: !prev[format],
          }));
          actions[format]();
        };

        return (
          <div role='toolbar' aria-label='Text Formatting'>
            <Button
              isPressed={formatting.bold}
              onPressedChange={() => toggleFormat('bold')}
              aria-label='Bold'
            >
              B
            </Button>
            <Button
              isPressed={formatting.italic}
              onPressedChange={() => toggleFormat('italic')}
              aria-label='Italic'
            >
              I
            </Button>
            <Button
              isPressed={formatting.underline}
              onPressedChange={() => toggleFormat('underline')}
              aria-label='Underline'
            >
              U
            </Button>
          </div>
        );
      };

      render(<Toolbar />);

      const boldButton = screen.getByRole('button', { name: 'Bold' });
      const italicButton = screen.getByRole('button', { name: 'Italic' });

      // Toggle bold
      await user.click(boldButton);
      expect(boldButton).toHaveAttribute('aria-pressed', 'true');
      expect(actions.bold).toHaveBeenCalledTimes(1);

      // Toggle italic
      await user.click(italicButton);
      expect(italicButton).toHaveAttribute('aria-pressed', 'true');
      expect(actions.italic).toHaveBeenCalledTimes(1);

      // Toggle bold again
      await user.click(boldButton);
      expect(boldButton).toHaveAttribute('aria-pressed', 'false');
      expect(actions.bold).toHaveBeenCalledTimes(2);
    });

    it('should work with custom elements in complex layouts', async () => {
      const user = userEvent.setup();
      const handleNavigation = jest.fn();

      const CustomLayout = () => (
        <div className='layout'>
          <nav>
            <Button as='a' onClick={handleNavigation}>
              Home
            </Button>
            <Button as='a' onClick={handleNavigation}>
              About
            </Button>
          </nav>
          <main>
            <article>
              <Button as='div' className='share-button'>
                Share Article
              </Button>
            </article>
          </main>
        </div>
      );

      render(<CustomLayout />);

      const homeButton = screen.getByRole('button', { name: 'Home' });
      const shareButton = screen.getByRole('button', { name: 'Share Article' });

      expect(homeButton.tagName).toBe('A');
      expect(shareButton.tagName).toBe('DIV');

      await user.click(homeButton);
      await user.click(shareButton);

      expect(handleNavigation).toHaveBeenCalledTimes(1);
    });
  });
});
