import { render, screen } from '@testing-library/react';
import { Field } from '../index';

describe('Field render props', () => {
  it('renders static children normally', () => {
    render(
      <Field>
        <span>static child</span>
      </Field>,
    );
    expect(screen.getByText('static child')).toBeInTheDocument();
  });

  it('calls children as a function with field state', () => {
    render(
      <Field invalid disabled required readOnly>
        {({ invalid, disabled, required, readOnly }) => (
          <span>{`${String(invalid)}-${String(disabled)}-${String(required)}-${String(readOnly)}`}</span>
        )}
      </Field>,
    );
    expect(screen.getByText('true-true-true-true')).toBeInTheDocument();
  });

  it('passes default (false) state values via render props', () => {
    render(
      <Field>
        {({ invalid, disabled, required, readOnly }) => (
          <span>{`${String(invalid)}-${String(disabled)}-${String(required)}-${String(readOnly)}`}</span>
        )}
      </Field>,
    );
    expect(screen.getByText('false-false-false-false')).toBeInTheDocument();
  });

  it('reflects partial state via render props', () => {
    render(
      <Field invalid required>
        {({ invalid, disabled, required, readOnly }) => (
          <span>{`${String(invalid)}-${String(disabled)}-${String(required)}-${String(readOnly)}`}</span>
        )}
      </Field>,
    );
    expect(screen.getByText('true-false-true-false')).toBeInTheDocument();
  });
});
