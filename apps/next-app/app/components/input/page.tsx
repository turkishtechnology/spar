import * as Input from '@turkish-technology/spar/input';

export default function InputPage() {
  return (
    <section>
      <h1>Input - App Router Test</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
        <Input.Root>
          <Input.Label>Email</Input.Label>
          <Input.Field type='email' placeholder='you@example.com' />
          <Input.Description>Enter a valid email address.</Input.Description>
        </Input.Root>

        <Input.Root>
          <Input.Label>Password</Input.Label>
          <Input.Field type='password' placeholder='••••••••' />
          <Input.ErrorMessage>Password is required.</Input.ErrorMessage>
        </Input.Root>
      </div>
    </section>
  );
}
