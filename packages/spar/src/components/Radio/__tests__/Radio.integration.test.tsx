import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio, RadioItem } from '../index';
import { Field, FieldDescription, FieldErrorMessage, FieldLabel } from '../../Field';

const getRadio = (name: string) => {
  const radios = screen.getAllByRole('radio', { name });
  const interactiveRadio = radios.find((radio) => radio.tagName !== 'INPUT');
  if (!interactiveRadio) {
    throw new Error(`Interactive radio with name "${name}" not found`);
  }
  return interactiveRadio as HTMLElement;
};

describe('Radio Integration Tests', () => {
  describe('Form Integration', () => {
    it('submits selected value in an uncontrolled form', async () => {
      const user = userEvent.setup();
      let submittedValue: FormDataEntryValue | null = null;

      const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        submittedValue = formData.get('plan');
      };

      render(
        <form onSubmit={handleSubmit}>
          <Radio name='plan' defaultValue='basic'>
            <RadioItem value='basic'>Basic Plan</RadioItem>
            <RadioItem value='premium'>Premium Plan</RadioItem>
          </Radio>
          <button type='submit'>Submit</button>
        </form>,
      );

      await user.click(getRadio('Premium Plan'));
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(submittedValue).toBe('premium');
    });

    it('does not submit plan key when no option is selected', async () => {
      const user = userEvent.setup();
      let hasPlanKey = true;

      const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        hasPlanKey = formData.has('plan');
      };

      render(
        <form onSubmit={handleSubmit}>
          <Radio name='plan'>
            <RadioItem value='basic'>Basic Plan</RadioItem>
            <RadioItem value='premium'>Premium Plan</RadioItem>
          </Radio>
          <button type='submit'>Submit</button>
        </form>,
      );

      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(hasPlanKey).toBe(false);
    });

    it('works with controlled state and submit', async () => {
      const user = userEvent.setup();

      const FormWrapper = () => {
        const [selectedPlan, setSelectedPlan] = React.useState('basic');
        const [submittedPlan, setSubmittedPlan] = React.useState<string | null>(null);

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          setSubmittedPlan((formData.get('plan') as string) ?? null);
        };

        return (
          <div>
            <form onSubmit={handleSubmit}>
              <Radio name='plan' value={selectedPlan} onValueChange={setSelectedPlan}>
                <RadioItem value='basic'>Basic Plan</RadioItem>
                <RadioItem value='premium'>Premium Plan</RadioItem>
              </Radio>
              <button type='submit'>Submit</button>
            </form>
            <div>{submittedPlan}</div>
          </div>
        );
      };

      render(<FormWrapper />);

      await user.click(getRadio('Premium Plan'));
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.getByText('premium')).toBeInTheDocument();
    });

    it('sets and clears validation message with required radio group', async () => {
      const user = userEvent.setup();

      const FormWrapper = () => {
        const [selectedPlan, setSelectedPlan] = React.useState('');
        const [error, setError] = React.useState('');

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!selectedPlan) {
            setError('Please select a plan');
          } else {
            setError('');
          }
        };

        return (
          // noValidate so the custom JS validation runs instead of the
          // browser's native required-radio enforcement (which now blocks
          // submit when no radio is selected).
          <form onSubmit={handleSubmit} noValidate>
            <Radio
              name='plan'
              value={selectedPlan}
              onValueChange={setSelectedPlan}
              aria-describedby={error ? 'error-message' : undefined}
              required
            >
              <RadioItem value='basic'>Basic Plan</RadioItem>
              <RadioItem value='premium'>Premium Plan</RadioItem>
            </Radio>
            {error && (
              <div id='error-message' role='alert'>
                {error}
              </div>
            )}
            <button type='submit'>Submit</button>
          </form>
        );
      };

      render(<FormWrapper />);

      await user.click(screen.getByRole('button', { name: 'Submit' }));
      expect(screen.getByRole('alert')).toHaveTextContent('Please select a plan');

      await user.click(getRadio('Basic Plan'));
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Components', () => {
    it('keeps multiple groups independent in same form', async () => {
      const user = userEvent.setup();
      let submitted: Record<string, FormDataEntryValue> = {};

      render(
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitted = Object.fromEntries(new FormData(event.currentTarget));
          }}
        >
          <Radio name='size' aria-label='Choose size' defaultValue='small'>
            <RadioItem value='small'>Small</RadioItem>
            <RadioItem value='large'>Large</RadioItem>
          </Radio>

          <Radio name='color' aria-label='Choose color' defaultValue='red'>
            <RadioItem value='red'>Red</RadioItem>
            <RadioItem value='blue'>Blue</RadioItem>
          </Radio>
          <button type='submit'>Submit</button>
        </form>,
      );

      await user.click(getRadio('Large'));
      await user.click(getRadio('Blue'));
      await user.click(screen.getByRole('button', { name: 'Submit' }));

      expect(submitted).toEqual({ size: 'large', color: 'blue' });
    });

    it('supports dynamic option mount/unmount without breaking selection', async () => {
      const user = userEvent.setup();

      const DynamicRadio = () => {
        const [showAdditional, setShowAdditional] = React.useState(false);
        const [value, setValue] = React.useState('option1');

        return (
          <div>
            <button type='button' onClick={() => setShowAdditional((prev) => !prev)}>
              Toggle Additional Options
            </button>
            <Radio
              name='options'
              value={value}
              onValueChange={setValue}
              aria-label='Available options'
            >
              <RadioItem value='option1'>Option 1</RadioItem>
              <RadioItem value='option2'>Option 2</RadioItem>
              {showAdditional && (
                <>
                  <RadioItem value='option3'>Option 3</RadioItem>
                  <RadioItem value='option4'>Option 4</RadioItem>
                </>
              )}
            </Radio>
          </div>
        );
      };

      render(<DynamicRadio />);

      expect(screen.queryByText('Option 3')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Toggle Additional Options' }));
      const option3 = getRadio('Option 3');
      await user.click(option3);
      expect(option3).toHaveAttribute('aria-checked', 'true');

      await user.click(screen.getByRole('button', { name: 'Toggle Additional Options' }));
      expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
      expect(getRadio('Option 1')).toHaveAttribute('aria-checked', 'false');
      expect(getRadio('Option 2')).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Field Integration', () => {
    it('reuses Field coordinated IDs for ARIA wiring', () => {
      render(
        <Field id='shipping-method'>
          <FieldLabel>Shipping method</FieldLabel>
          <Radio name='shipping'>
            <RadioItem value='standard'>Standard</RadioItem>
            <RadioItem value='express'>Express</RadioItem>
          </Radio>
          <FieldDescription>Choose how you want it delivered</FieldDescription>
        </Field>,
      );

      const group = screen.getByRole('radiogroup');

      expect(group).toHaveAttribute('id', 'shipping-method-field');
      expect(group).toHaveAttribute('aria-labelledby', 'shipping-method-label');
      expect(group).toHaveAttribute('aria-describedby', 'shipping-method-description');
    });

    it('inherits disabled/required/invalid from Field context', () => {
      render(
        <Field invalid disabled required>
          <FieldLabel>Plan</FieldLabel>
          <Radio>
            <RadioItem value='basic'>Basic</RadioItem>
            <RadioItem value='premium'>Premium</RadioItem>
          </Radio>
        </Field>,
      );

      const group = screen.getByRole('radiogroup');

      expect(group).toHaveAttribute('aria-invalid', 'true');
      expect(group).toHaveAttribute('aria-required', 'true');
      expect(group).toHaveAttribute('data-invalid', '');
      expect(group).toHaveAttribute('data-disabled', '');
      expect(group).toHaveAttribute('data-required', '');
    });

    it('switches aria-describedby to errorId when Field is invalid', () => {
      render(
        <Field invalid>
          <FieldLabel>Plan</FieldLabel>
          <Radio>
            <RadioItem value='basic'>Basic</RadioItem>
          </Radio>
          <FieldDescription>Pick one</FieldDescription>
          <FieldErrorMessage>Selection required</FieldErrorMessage>
        </Field>,
      );

      const group = screen.getByRole('radiogroup');
      const error = screen.getByText('Selection required');

      expect(group).toHaveAttribute('aria-describedby', error.id);
    });

    it('propagates Field required to hidden radio inputs for native validation', () => {
      render(
        <Field required>
          <FieldLabel>Plan</FieldLabel>
          <Radio name='plan'>
            <RadioItem value='basic'>Basic</RadioItem>
            <RadioItem value='premium'>Premium</RadioItem>
          </Radio>
        </Field>,
      );

      // Each hidden input must carry `required` so the browser enforces a
      // selection on native form submission. The Spar Radio renders a sibling
      // `<input type="radio" aria-hidden="true">` per item for form integration.
      const hiddenInputs = document.querySelectorAll<HTMLInputElement>(
        'input[type="radio"][aria-hidden="true"]',
      );
      expect(hiddenInputs.length).toBeGreaterThan(0);
      hiddenInputs.forEach((input) => {
        expect(input).toBeRequired();
      });
    });

    it('direct props override Field context', () => {
      render(
        <Field invalid disabled>
          <FieldLabel>Plan</FieldLabel>
          <Radio isInvalid={false} disabled={false}>
            <RadioItem value='basic'>Basic</RadioItem>
          </Radio>
        </Field>,
      );

      const group = screen.getByRole('radiogroup');

      expect(group).not.toHaveAttribute('aria-invalid');
      expect(group).not.toHaveAttribute('data-invalid');
      expect(group).not.toHaveAttribute('data-disabled');
    });
  });
});
