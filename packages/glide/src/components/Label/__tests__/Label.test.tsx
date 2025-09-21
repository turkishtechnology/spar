import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { Label, LabelRoot, LabelText, LabelIndicator } from '../index';

describe('Label', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('LabelRoot', () => {
    it('renders with default props', () => {
      render(<LabelRoot>Test Label</LabelRoot>);

      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('renders with htmlFor attribute', () => {
      render(<LabelRoot htmlFor='test-input'>Test Label</LabelRoot>);

      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('applies variant data attribute', () => {
      render(<LabelRoot variant='primary'>Test Label</LabelRoot>);

      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('data-variant', 'primary');
    });

    it('applies size data attribute', () => {
      render(<LabelRoot size='lg'>Test Label</LabelRoot>);

      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('data-size', 'lg');
    });

    it('applies all size variants correctly', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

      sizes.forEach((size) => {
        const { unmount } = render(<LabelRoot size={size}>Test Label</LabelRoot>);
        const label = screen.getByText('Test Label');
        expect(label).toHaveAttribute('data-size', size);
        unmount();
      });
    });

    it('applies all variant types correctly', () => {
      const variants = ['default', 'primary', 'secondary', 'danger', 'warning', 'success'] as const;

      variants.forEach((variant) => {
        const { unmount } = render(<LabelRoot variant={variant}>Test Label</LabelRoot>);
        const label = screen.getByText('Test Label');
        expect(label).toHaveAttribute('data-variant', variant);
        unmount();
      });
    });

    it('shows required indicator when isRequired is true', () => {
      render(<LabelRoot isRequired>Test Label</LabelRoot>);

      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('data-required', 'true');
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('shows custom required indicator', () => {
      render(
        <LabelRoot isRequired requiredIndicator={<span>Required</span>}>
          Test Label
        </LabelRoot>,
      );

      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('shows loading state with indicator', () => {
      render(<LabelRoot isLoading>Test Label</LabelRoot>);

      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('data-loading', 'true');
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows custom loading text', () => {
      render(
        <LabelRoot isLoading loadingText='Please wait...'>
          Test Label
        </LabelRoot>,
      );

      expect(screen.getByText('Please wait...')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('applies disabled state', () => {
      render(<LabelRoot isDisabled>Test Label</LabelRoot>);

      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('data-disabled', 'true');
    });

    it('forwards additional props to underlying element', () => {
      render(
        <LabelRoot data-testid='custom-label' className='custom-class'>
          Test Label
        </LabelRoot>,
      );

      const label = screen.getByTestId('custom-label');
      expect(label).toHaveClass('custom-class');
    });

    it('renders with polymorphic behavior', () => {
      // Since we simplified the component to only render as label for performance,
      // we test the standard label element behavior
      render(<LabelRoot>Test Label</LabelRoot>);

      const labelElement = screen.getByText('Test Label');
      expect(labelElement).toBeInTheDocument();
      expect(labelElement.tagName).toBe('LABEL');
    });

    it('handles click events on label', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<LabelRoot onClick={handleClick}>Test Label</LabelRoot>);

      await user.click(screen.getByText('Test Label'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('combines multiple states correctly', () => {
      render(
        <LabelRoot isRequired isLoading isDisabled variant='danger' size='lg'>
          Test Label
        </LabelRoot>,
      );

      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('data-required', 'true');
      expect(label).toHaveAttribute('data-loading', 'true');
      expect(label).toHaveAttribute('data-disabled', 'true');
      expect(label).toHaveAttribute('data-variant', 'danger');
      expect(label).toHaveAttribute('data-size', 'lg');

      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('does not show indicators when states are false', () => {
      render(
        <LabelRoot isRequired={false} isLoading={false}>
          Test Label
        </LabelRoot>,
      );

      const label = screen.getByText('Test Label');
      expect(label).not.toHaveAttribute('data-required');
      expect(label).not.toHaveAttribute('data-loading');
      expect(screen.queryByText('*')).not.toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('LabelText component', () => {
    it('renders text content properly', () => {
      render(
        <LabelRoot>
          <LabelText>Text Content</LabelText>
        </LabelRoot>,
      );

      const textElement = screen.getByText('Text Content');
      expect(textElement).toBeInTheDocument();
      expect(textElement.tagName).toBe('SPAN');
    });

    it('forwards ref correctly', () => {
      const ref = createRef<HTMLSpanElement>();
      render(
        <LabelRoot>
          <LabelText ref={ref}>Text Content</LabelText>
        </LabelRoot>,
      );

      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current?.textContent).toBe('Text Content');
    });
  });

  describe('LabelIndicator', () => {
    it('renders required indicator by default', () => {
      render(<LabelIndicator />);

      const indicator = screen.getByText('*');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders loading indicator with live region', () => {
      render(<LabelIndicator type='loading' />);

      const indicator = screen.getByText('Loading...');
      expect(indicator).toBeInTheDocument();
      expect(indicator).toHaveAttribute('aria-live', 'polite');
      expect(indicator).toHaveAttribute('aria-atomic', 'true');
    });

    it('renders custom content when provided', () => {
      render(<LabelIndicator>Custom Content</LabelIndicator>);

      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('renders nothing for custom type without content', () => {
      const { container } = render(<LabelIndicator type='custom' />);

      expect(container.firstChild).toBeNull();
    });

    it('forwards props to underlying element', () => {
      render(
        <LabelIndicator className='indicator-class' data-testid='indicator'>
          Test
        </LabelIndicator>,
      );

      const indicator = screen.getByTestId('indicator');
      expect(indicator).toHaveClass('indicator-class');
    });
  });

  describe('Label alias', () => {
    it('works as alias for LabelRoot', () => {
      render(<Label>Test Label</Label>);

      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });

    it('accepts all LabelRoot props', () => {
      render(
        <Label variant='primary' size='lg' isRequired>
          Test Label
        </Label>,
      );

      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('data-variant', 'primary');
      expect(label).toHaveAttribute('data-size', 'lg');
      expect(label).toHaveAttribute('data-required', 'true');
    });
  });

  describe('Edge cases', () => {
    it('handles empty children gracefully', () => {
      render(<LabelRoot>{''}</LabelRoot>);

      // Should still render the label element
      const label = document.querySelector('label');
      expect(label).toBeInTheDocument();
    });

    it('handles complex children structures', () => {
      render(
        <LabelRoot>
          <span>Complex</span>
          <strong>Children</strong>
        </LabelRoot>,
      );

      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Children')).toBeInTheDocument();
    });

    it('handles undefined optional props gracefully', () => {
      render(<LabelRoot>Test Label</LabelRoot>);

      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
      // Should have default values
      expect(label).toHaveAttribute('data-variant', 'default');
      expect(label).toHaveAttribute('data-size', 'md');
    });
  });
});
