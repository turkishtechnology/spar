import * as Field from '@turkish-technology/spar/field';
import * as Input from '@turkish-technology/spar/input';

export default function InputPage() {
  return (
    <section>
      <h1>Input - App Router Test</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input.Root>
            <Input.Field type='email' placeholder='you@example.com' />
          </Input.Root>
          <Field.Description>Enter a valid email address.</Field.Description>
        </Field.Root>

        <Field.Root invalid>
          <Field.Label>Password</Field.Label>
          <Input.Root>
            <Input.Field type='password' placeholder='••••••••' />
          </Input.Root>
          <Field.ErrorMessage>Password is required.</Field.ErrorMessage>
        </Field.Root>
      </div>
    </section>
  );
}
