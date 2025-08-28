import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('is disabled when isDisabled is true', () => {
    const { getByRole } = render(<Button isDisabled>Disabled</Button>);
    expect(getByRole('button')).toBeDisabled();
  });

  it('shows loading text when isLoading', () => {
    const { getByText } = render(
      <Button isLoading loadingText='Loading...'>
        Submit
      </Button>,
    );
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('renders icon-only button with aria-label', () => {
    const { getByRole } = render(
      <Button isIconOnly aria-label='Delete item'>
        ×
      </Button>,
    );
    const button = getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Delete item');
    expect(button).toHaveAttribute('data-icon-only', 'true');
  });

  it('renders icon-only button without aria-label', () => {
    const { getByRole } = render(<Button isIconOnly>×</Button>);
    const button = getByRole('button');
    expect(button).toHaveAttribute('data-icon-only', 'true');
    // aria-label should be undefined when not provided
    expect(button).not.toHaveAttribute('aria-label');
  });
});
