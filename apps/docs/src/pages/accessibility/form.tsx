import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
  Button,
  Checkbox,
  CheckedState,
  Collapsible,
  Dialog,
  Input,
  Label,
  Radio,
  Select,
  Switch,
  Tabs,
  Tooltip,
} from '@turkish-technology/spar';

import '../../styles/accessibility-demos.scss';

type FormState = {
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

const initialFormState: FormState = {
  fullName: '',
  email: '',
  role: '',
  plan: 'starter',
  announcements: true,
  featureUpdates: false,
  marketingEmail: false,
  productEmail: true,
  terms: false,
};

export default function FormDemo() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [activeTab, setActiveTab] = useState('profile');
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const isEmailInvalid = useMemo(() => {
    if (form.email.length === 0) {
      return false;
    }

    return !form.email.includes('@');
  }, [form.email]);

  const hasRequiredValues = form.fullName.trim().length > 0 && form.role.length > 0;
  const canSubmit = hasRequiredValues && !isEmailInvalid && form.terms === true;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setSubmittedMessage(
        'Form submission failed: Full name, a valid email, role selection, and terms consent are required.',
      );
      setIsStatusDialogOpen(true);
      return;
    }

    setSubmittedMessage(
      `Form submitted successfully. Plan: ${form.plan}, role: ${form.role}, announcements: ${form.announcements ? 'enabled' : 'disabled'}.`,
    );
    setIsStatusDialogOpen(true);
  };

  return (
    <Layout title='Form'>
      <div className='demo-page'>
        <Link to='/accessibility' className='back-link'>
          ← All Demos
        </Link>
        <h1>Form</h1>
        <p className='page-description'>
          End-to-end registration/preferences form example using multiple Spar components. Try full
          keyboard navigation: Tab/Shift+Tab for focus movement, Arrow keys inside radio group and
          tabs, Space to toggle checkbox/switch, and Enter to submit.
        </p>

        <form onSubmit={handleSubmit} className='demo-col'>
          <Tabs.Root
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
            }}
          >
            <Tabs.List className='demo-tablist' aria-label='Form sections'>
              <Tabs.Trigger className='demo-tab-trigger' value='profile'>
                Profile
              </Tabs.Trigger>
              <Tabs.Trigger className='demo-tab-trigger' value='preferences'>
                Preferences
              </Tabs.Trigger>
              <Tabs.Trigger className='demo-tab-trigger' value='review'>
                Review
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content className='demo-tab-content' value='profile'>
              <div className='demo-col'>
                <Input required isInvalid={form.fullName.trim().length === 0}>
                  <Input.Label className='demo-label'>Full name *</Input.Label>
                  <Input.Field
                    className='demo-input'
                    value={form.fullName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setForm((prev) => ({ ...prev, fullName: event.target.value }));
                    }}
                    placeholder='Ada Lovelace'
                  />
                  <Input.Description className='demo-input-description'>
                    This will be shown on your public profile.
                  </Input.Description>
                </Input>

                <Input isInvalid={isEmailInvalid} required>
                  <div className='demo-field'>
                    <Input.Label className='demo-label'>Email *</Input.Label>
                  </div>
                  <Input.Field
                    className='demo-input'
                    value={form.email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setForm((prev) => ({ ...prev, email: event.target.value }));
                    }}
                    type='email'
                    placeholder='ada@example.com'
                  />{' '}
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
                  {isEmailInvalid && (
                    <Input.ErrorMessage className='demo-input-error'>
                      Please include @ in the email address.
                    </Input.ErrorMessage>
                  )}
                </Input>

                <div className='demo-col'>
                  <Label className='demo-label' htmlFor='role-select-trigger' required>
                    Role *
                  </Label>
                  <Select.Root
                    required
                    value={form.role}
                    onValueChange={(value) => {
                      setForm((prev) => ({ ...prev, role: value }));
                    }}
                  >
                    <Select.Trigger id='role-select-trigger' className='demo-select-trigger'>
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
                </div>

                <div className='demo-row form-row'>
                  <Button
                    type='button'
                    className='demo-btn'
                    onClick={() => {
                      setActiveTab('preferences');
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content className='demo-tab-content' value='preferences'>
              <div className='demo-col'>
                <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
                  <legend className='demo-label' style={{ marginBottom: '0.5rem' }}>
                    Plan selection
                  </legend>
                  <Radio.Root
                    className='demo-radio-group'
                    value={form.plan}
                    onValueChange={(value) => {
                      setForm((prev) => ({ ...prev, plan: value }));
                    }}
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
                          aria-labelledby={`plan-${option.value}`}
                        >
                          {({ isChecked }) =>
                            isChecked ? <span className='demo-radio-indicator' /> : null
                          }
                        </Radio.Item>
                        <Label id={`plan-${option.value}`} className='demo-label'>
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </Radio.Root>
                </fieldset>

                <div className='demo-col'>
                  <div className='demo-field'>
                    <Switch
                      id='announcements-switch'
                      className='demo-switch'
                      checked={form.announcements}
                      onChange={(checked) => {
                        setForm((prev) => ({ ...prev, announcements: checked }));
                      }}
                    >
                      {() => <span className='demo-switch-thumb' />}
                    </Switch>
                    <Label htmlFor='announcements-switch' className='demo-label'>
                      Receive product announcements
                    </Label>
                  </div>

                  <div className='demo-field'>
                    <Switch
                      id='feature-updates-switch'
                      className='demo-switch'
                      checked={form.featureUpdates}
                      onChange={(checked) => {
                        setForm((prev) => ({ ...prev, featureUpdates: checked }));
                      }}
                    >
                      {() => <span className='demo-switch-thumb' />}
                    </Switch>
                    <Label htmlFor='feature-updates-switch' className='demo-label'>
                      Enable experimental feature updates
                    </Label>
                  </div>
                </div>

                <Collapsible.Root className='demo-collapsible'>
                  <Collapsible.Trigger className='demo-collapsible-trigger'>
                    Email categories <span className='demo-chevron'>▾</span>
                  </Collapsible.Trigger>
                  <Collapsible.Content className='demo-collapsible-content'>
                    <div className='demo-col' style={{ gap: '0.5rem' }}>
                      <div className='demo-field'>
                        <Checkbox
                          id='marketing-email-checkbox'
                          className='demo-checkbox'
                          checked={form.marketingEmail}
                          onChange={(checked) => {
                            setForm((prev) => ({ ...prev, marketingEmail: checked }));
                          }}
                        >
                          {({ checked }) => (checked === true ? '✓' : '')}
                        </Checkbox>
                        <Label htmlFor='marketing-email-checkbox' className='demo-label'>
                          Marketing emails
                        </Label>
                      </div>

                      <div className='demo-field'>
                        <Checkbox
                          id='product-email-checkbox'
                          className='demo-checkbox'
                          checked={form.productEmail}
                          onChange={(checked) => {
                            setForm((prev) => ({ ...prev, productEmail: checked }));
                          }}
                        >
                          {({ checked }) => (checked === true ? '✓' : '')}
                        </Checkbox>
                        <Label htmlFor='product-email-checkbox' className='demo-label'>
                          Product update emails
                        </Label>
                      </div>
                    </div>
                  </Collapsible.Content>
                </Collapsible.Root>

                <div className='demo-row form-row'>
                  <Button
                    type='button'
                    className='demo-btn'
                    onClick={() => {
                      setActiveTab('profile');
                    }}
                  >
                    Prev
                  </Button>
                  <Button
                    type='button'
                    className='demo-btn'
                    onClick={() => {
                      setActiveTab('review');
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content className='demo-tab-content' value='review'>
              <div className='demo-col'>
                <p style={{ margin: 0 }}>
                  Review your configuration, then submit. Successful/failed result is announced with{' '}
                  <code>aria-live</code>.
                </p>

                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  <li>
                    <strong>Name:</strong> {form.fullName || '—'}
                  </li>
                  <li>
                    <strong>Email:</strong> {form.email || '—'}
                  </li>
                  <li>
                    <strong>Role:</strong> {form.role || '—'}
                  </li>
                  <li>
                    <strong>Plan:</strong> {form.plan}
                  </li>
                </ul>

                <div className='demo-field'>
                  <Checkbox
                    id='terms-checkbox'
                    className='demo-checkbox'
                    checked={form.terms}
                    onChange={(checked) => {
                      setForm((prev) => ({ ...prev, terms: checked }));
                    }}
                    required
                  >
                    {({ checked }) => (checked === true ? '✓' : '')}
                  </Checkbox>
                  <Label htmlFor='terms-checkbox' className='demo-label' required>
                    I accept the Terms and Privacy Policy *
                  </Label>
                </div>

                <div className='demo-row form-row'>
                  <Button
                    type='button'
                    className='demo-btn'
                    onClick={() => {
                      setActiveTab('preferences');
                    }}
                  >
                    Prev
                  </Button>
                  <Button type='submit' className='demo-btn' disabled={!canSubmit}>
                    Submit form
                  </Button>
                  <Button
                    type='button'
                    className='demo-btn'
                    onClick={() => {
                      setForm(initialFormState);
                      setSubmittedMessage('Form reset to defaults.');
                      setIsStatusDialogOpen(false);
                      setActiveTab('profile');
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>

          <Dialog.Root
            open={isStatusDialogOpen}
            onOpenChange={(open) => {
              setIsStatusDialogOpen(open);
            }}
          >
            <Dialog.Overlay className='demo-overlay' />
            <Dialog.Content className='demo-dialog'>
              <Dialog.Title className='demo-dialog-title'>Submission Status</Dialog.Title>
              <Dialog.Description className='demo-dialog-description'>
                {submittedMessage || 'No submission status yet.'}
              </Dialog.Description>
              <div className='demo-dialog-actions'>
                <Dialog.Close className='demo-btn'>Close</Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </form>
      </div>
    </Layout>
  );
}
