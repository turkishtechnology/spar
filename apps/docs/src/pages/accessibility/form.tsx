import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
  Button,
  Checkbox,
  CheckedState,
  Collapsible,
  Field,
  Input,
  Label,
  Radio,
  Select,
  Switch,
  Tooltip,
} from '@turkish-technology/spar';

import '../../styles/accessibility-demos.scss';

type FormInputs = {
  fullName: string;
  email: string;
  role: string;
  plan: string;
  announcements: boolean;
  featureUpdates: boolean;
  marketingEmail: CheckedState;
  productEmail: CheckedState;
  terms: CheckedState;
};

export default function FormDemo() {
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      fullName: '',
      email: '',
      role: '',
      plan: 'starter',
      announcements: true,
      featureUpdates: false,
      marketingEmail: false,
      productEmail: true,
      terms: false,
    },
  });

  const onSubmit = (data: FormInputs) => {
    const msg = `Form submitted successfully. Plan: ${data.plan}, role: ${data.role}, announcements: ${data.announcements ? 'enabled' : 'disabled'}.`;
    setSubmittedMessage(msg);
    setSubmitStatus('success');
  };

  return (
    <Layout title='Form'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Form</h1>
        <p className='page-description'>
          Single-page form example built with Spar components and React Hook Form. Submit stays
          available, but when validation fails focus moves to the first invalid field. Success and
          error feedback are announced with an alert, and the code example is shown alongside the
          live form.
        </p>

        {submitStatus && (
          <div role='alert' className={`demo-alert demo-alert--${submitStatus}`}>
            {submittedMessage}
          </div>
        )}

        <div className='demo-section-split'>
          <form onSubmit={handleSubmit(onSubmit)} className='demo-col'>
            <div className='demo-col'>
              {/* Profile Fields */}
              <Field required invalid={!!errors.fullName}>
                <Field.Label className='demo-label'>Full name *</Field.Label>
                <Input>
                  <Input.Field
                    className='demo-input'
                    placeholder='Ada Lovelace'
                    {...register('fullName', {
                      required: true,
                      validate: (v) => v.trim().length > 0,
                    })}
                  />
                </Input>
                <Field.Description className='demo-input-description'>
                  This will be shown on your public profile.
                </Field.Description>
              </Field>

              <Field invalid={!!errors.email} required>
                <Field.Label className='demo-label'>Email *</Field.Label>
                <Input>
                  <Input.Field
                    className='demo-input'
                    type='email'
                    placeholder='ada@example.com'
                    {...register('email', {
                      validate: (v) => v.length === 0 || v.includes('@'),
                    })}
                  />
                </Input>
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger
                      className='demo-btn'
                      type='button'
                      aria-label='Show email format help'
                    >
                      <span aria-hidden='true'>ⓘ</span>
                    </Tooltip.Trigger>
                    <Tooltip.Content className='demo-tooltip-content'>
                      Use a valid format like name@example.com. We only use your email for account
                      notifications.
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
                {errors.email && (
                  <Field.ErrorMessage className='demo-input-error'>
                    Please include @ in the email address.
                  </Field.ErrorMessage>
                )}
              </Field>

              <div className='demo-col'>
                <Label className='demo-label' htmlFor='role-select-trigger' required>
                  Role *
                </Label>
                <Controller
                  control={control}
                  name='role'
                  rules={{ required: true }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  render={({ field }: any) => (
                    <Select.Root
                      required
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        field.onBlur();
                      }}
                    >
                      <Select.Trigger
                        ref={field.ref}
                        id='role-select-trigger'
                        className='demo-select-trigger'
                      >
                        <Select.Value placeholder='Select a role…' />
                        <span>▾</span>
                      </Select.Trigger>
                      <Select.Content className='demo-select-content'>
                        <Select.Item className='demo-select-item' value='frontend-engineer'>
                          <Select.ItemText>Frontend Engineer</Select.ItemText>
                        </Select.Item>
                        <Select.Item className='demo-select-item' value='product-designer'>
                          <Select.ItemText>Product Designer</Select.ItemText>
                        </Select.Item>
                        <Select.Item className='demo-select-item' value='engineering-manager'>
                          <Select.ItemText>Engineering Manager</Select.ItemText>
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  )}
                />
                {errors.role && (
                  <div className='demo-input-error' role='alert'>
                    Role selection is required
                  </div>
                )}
              </div>

              {/* Preferences Fields */}
              <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
                <legend className='demo-label' style={{ marginBottom: '0.5rem' }}>
                  Plan selection
                </legend>
                <Controller
                  control={control}
                  name='plan'
                  render={({ field: { value, onChange } }) => (
                    <Radio.Root
                      className='demo-radio-group'
                      value={value}
                      onValueChange={onChange}
                      aria-label='Plan selection'
                    >
                      {[
                        { label: 'Starter', value: 'starter' },
                        { label: 'Pro', value: 'pro' },
                        { label: 'Enterprise', value: 'enterprise' },
                      ].map((option) => (
                        <div className='demo-radio-item-wrapper' key={option.value}>
                          <Radio.Item
                            className='demo-radio-item'
                            value={option.value}
                            id={`plan-${option.value}`}
                          >
                            {({ isChecked }) =>
                              isChecked ? <span className='demo-radio-indicator' /> : null
                            }
                          </Radio.Item>
                          <Label htmlFor={`plan-${option.value}`} className='demo-label'>
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </Radio.Root>
                  )}
                />
              </fieldset>

              <div className='demo-col'>
                <Controller
                  control={control}
                  name='announcements'
                  render={({ field: { value, onChange } }) => (
                    <Switch.Root
                      id='announcements-switch'
                      className='demo-field'
                      checked={value}
                      onChange={onChange}
                    >
                      <Switch.Control className='demo-switch'>
                        <Switch.Track className='demo-switch-track'>
                          <Switch.Thumb className='demo-switch-thumb' />
                        </Switch.Track>
                      </Switch.Control>
                      <span className='demo-label'>Receive product announcements</span>
                    </Switch.Root>
                  )}
                />

                <Controller
                  control={control}
                  name='featureUpdates'
                  render={({ field: { value, onChange } }) => (
                    <Switch.Root
                      id='feature-updates-switch'
                      className='demo-field'
                      checked={value}
                      onChange={onChange}
                    >
                      <Switch.Control className='demo-switch'>
                        <Switch.Track className='demo-switch-track'>
                          <Switch.Thumb className='demo-switch-thumb' />
                        </Switch.Track>
                      </Switch.Control>
                      <span className='demo-label'>Enable experimental feature updates</span>
                    </Switch.Root>
                  )}
                />
              </div>

              <Collapsible.Root className='demo-collapsible'>
                <Collapsible.Trigger className='demo-collapsible-trigger'>
                  Email categories <span className='demo-chevron'>▾</span>
                </Collapsible.Trigger>
                <Collapsible.Content className='demo-collapsible-content'>
                  <div className='demo-col' style={{ gap: '0.5rem' }}>
                    <div className='demo-field'>
                      <Controller
                        control={control}
                        name='marketingEmail'
                        render={({ field: { value, onChange } }) => (
                          <Checkbox
                            id='marketing-email-checkbox'
                            className='demo-checkbox'
                            checked={value}
                            onChange={onChange}
                          >
                            {({ checked }) => (checked === true ? '✓' : '')}
                          </Checkbox>
                        )}
                      />
                      <Label htmlFor='marketing-email-checkbox' className='demo-label'>
                        Marketing emails
                      </Label>
                    </div>

                    <div className='demo-field'>
                      <Controller
                        control={control}
                        name='productEmail'
                        render={({ field: { value, onChange } }) => (
                          <Checkbox
                            id='product-email-checkbox'
                            className='demo-checkbox'
                            checked={value}
                            onChange={onChange}
                          >
                            {({ checked }) => (checked === true ? '✓' : '')}
                          </Checkbox>
                        )}
                      />
                      <Label htmlFor='product-email-checkbox' className='demo-label'>
                        Product update emails
                      </Label>
                    </div>
                  </div>
                </Collapsible.Content>
              </Collapsible.Root>

              {/* Review Fields */}
              <div className='demo-field'>
                <Controller
                  control={control}
                  name='terms'
                  rules={{ validate: (v) => v === true }}
                  render={({ field: { ref, value, onChange } }) => (
                    <Checkbox
                      ref={ref}
                      id='terms-checkbox'
                      className='demo-checkbox'
                      checked={value}
                      onChange={onChange}
                      required
                    >
                      {({ checked }) => (checked === true ? '✓' : '')}
                    </Checkbox>
                  )}
                />
                <Label htmlFor='terms-checkbox' className='demo-label' required>
                  I accept the Terms and Privacy Policy *
                </Label>
                {errors.terms && (
                  <div className='demo-input-error' role='alert'>
                    You must accept the terms to submit
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='demo-row form-row'>
                <Button type='submit' className='demo-btn'>
                  Submit form
                </Button>
                <Button
                  type='button'
                  className='demo-btn'
                  onClick={() => {
                    reset();
                    setSubmittedMessage('');
                    setSubmitStatus(null);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </form>

          <aside className='demo-side-example demo-code-aside'>
            <pre className='demo-code-block'>
              <code>{`// 1. shouldFocusError: true — RHF focuses the first
//    invalid field automatically on submit.
const { register, control, handleSubmit,
  formState: { errors } } = useForm({
  mode: 'onChange',
  shouldFocusError: true,
});

// 2. register with rules — RHF handles native inputs.
<Field required invalid={!!errors.fullName}>
  <Field.Label>Full name *</Field.Label>
  <Input>
    <Input.Field
      {...register('fullName', {
        required: true,
        validate: (v) => v.trim().length > 0,
      })}
    />
  </Input>
</Field>

// 3. Controller + field.ref — lets RHF focus custom
//    components (Select, Checkbox) on validation error.
<Controller name='role' rules={{ required: true }}
  render={({ field }) => (
    <Select.Root value={field.value}
      onValueChange={(v) => {
        field.onChange(v);
        field.onBlur();
      }}>
      <Select.Trigger ref={field.ref}>
        <Select.Value placeholder='Select a role…' />
      </Select.Trigger>
    </Select.Root>
  )}
/>

<Controller name='terms'
  rules={{ validate: (v) => v === true }}
  render={({ field: { ref, value, onChange } }) => (
    <Checkbox ref={ref} checked={value} onChange={onChange}>
      {({ checked }) => checked ? '✓' : ''}
    </Checkbox>
  )}
/>

// 4. onSubmit only runs on success — no manual checks.
const onSubmit = (data) => {
  setSubmittedMessage(\`Submitted: \${data.plan}\`);
};

// Error display via formState.errors:
{errors.role && <div role='alert'>Role is required</div>}
{errors.terms && <div role='alert'>Accept terms to submit</div>}`}</code>
            </pre>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
