import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from '../Label';

describe('Label', () => {
  it('renders a label element by default', () => {
    render(<Label htmlFor='username'>Username</Label>);

    const label = screen.getByText('Username');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'username');
  });

  it('renders as custom element with as prop', () => {
    render(<Label as='span'>Email</Label>);

    expect(screen.getByText('Email').tagName).toBe('SPAN');
  });

  it('forwards ref to rendered element', () => {
    const ref = React.createRef<HTMLLabelElement>();

    render(<Label ref={ref}>Ref Label</Label>);

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current).toHaveTextContent('Ref Label');
  });

  it('passes through native HTML attributes', () => {
    render(
      <Label id='label-id' title='Username label'>
        Username
      </Label>,
    );

    const label = screen.getByText('Username');
    expect(label).toHaveAttribute('id', 'label-id');
    expect(label).toHaveAttribute('title', 'Username label');
  });

  it('supports implicit association with nested control', () => {
    render(
      <Label>
        Email
        <input type='email' />
      </Label>,
    );

    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('applies state data attributes only for truthy state props', () => {
    const { rerender } = render(
      <Label required isOptional disabled readOnly isInvalid>
        Field
      </Label>,
    );

    const label = screen.getByText('Field');
    expect(label).toHaveAttribute('data-required');
    expect(label).toHaveAttribute('data-optional');
    expect(label).toHaveAttribute('data-disabled');
    expect(label).toHaveAttribute('data-readonly');
    expect(label).toHaveAttribute('data-invalid');

    rerender(<Label>Field</Label>);

    expect(label).not.toHaveAttribute('data-required');
    expect(label).not.toHaveAttribute('data-optional');
    expect(label).not.toHaveAttribute('data-disabled');
    expect(label).not.toHaveAttribute('data-readonly');
    expect(label).not.toHaveAttribute('data-invalid');
  });
});
