import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createToaster,
  Toast,
  ToastClose,
  ToastDescription,
  ToastRoot,
  ToastTitle,
  Toaster,
} from '../index';

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should create and auto dismiss toasts', () => {
    const toaster = createToaster({ duration: 1000, removeDelay: 0 });
    const id = toaster.success({ title: 'Saved' });

    expect(toaster.getSnapshot()).toHaveLength(1);
    expect(toaster.getSnapshot()[0]).toMatchObject({ id, title: 'Saved', type: 'success' });

    act(() => {
      jest.advanceTimersByTime(1000);
      jest.advanceTimersByTime(0);
    });

    expect(toaster.getSnapshot()).toHaveLength(0);
  });

  it('should update an existing toast', () => {
    const toaster = createToaster({ duration: 1000 });
    const id = toaster.loading({ title: 'Uploading' });

    toaster.update(id, { title: 'Uploaded', type: 'success', duration: 3000 });

    expect(toaster.getSnapshot()[0]).toMatchObject({
      id,
      title: 'Uploaded',
      type: 'success',
      duration: 3000,
      remaining: 3000,
    });
  });

  it('should pause and resume toast timers', () => {
    const toaster = createToaster({ duration: 1000, removeDelay: 0 });
    const id = toaster.create({ title: 'Queued' });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    toaster.pause(id);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(toaster.getSnapshot()).toHaveLength(1);

    toaster.resume(id);

    act(() => {
      jest.advanceTimersByTime(600);
      jest.advanceTimersByTime(0);
    });

    expect(toaster.getSnapshot()).toHaveLength(0);
  });

  it('should render visible toasts through the toaster render prop', () => {
    const toaster = createToaster({ maxVisibleToasts: 1 });
    toaster.create({ title: 'First' });
    toaster.create({ title: 'Second' });

    expect(toaster.getSnapshot()).toEqual([
      expect.objectContaining({ title: 'Second', status: 'visible' }),
      expect.objectContaining({ title: 'First', status: 'queued' }),
    ]);

    render(
      <Toaster toaster={toaster}>
        {(toast) => (
          <ToastRoot key={toast.id} toast={toast} toaster={toaster}>
            <ToastTitle />
          </ToastRoot>
        )}
      </Toaster>,
    );

    expect(screen.getByRole('region', { name: 'Notifications (F8)' })).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.queryByText('First')).not.toBeInTheDocument();
  });

  it('should allow disabling the toaster hotkey with an empty array', () => {
    const toaster = createToaster();

    render(
      <Toaster toaster={toaster} hotkey={[]}>
        {(toast) => <ToastRoot key={toast.id} toast={toast} toaster={toaster} />}
      </Toaster>,
    );

    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('should expand overlapping toasts on interaction', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const toaster = createToaster();

    render(
      <Toaster toaster={toaster} overlap>
        {(toast) => <ToastRoot key={toast.id} toast={toast} toaster={toaster} />}
      </Toaster>,
    );

    const region = screen.getByRole('region');

    expect(region).toHaveAttribute('data-overlap');
    expect(region).not.toHaveAttribute('data-expanded');

    await user.hover(region);
    expect(region).toHaveAttribute('data-expanded');

    act(() => {
      region.focus();
    });

    await user.unhover(region);
    expect(region).toHaveAttribute('data-expanded');

    act(() => {
      region.blur();
    });

    expect(region).not.toHaveAttribute('data-expanded');

    act(() => {
      region.focus();
    });

    expect(region).toHaveAttribute('data-expanded');
  });

  it('should render the newest bottom toast last when overlap is enabled', () => {
    const toaster = createToaster({ placement: 'bottom-end' });
    toaster.create({ title: 'First' });
    toaster.create({ title: 'Second' });

    render(
      <Toaster toaster={toaster} overlap>
        {(toast) => (
          <ToastRoot key={toast.id} toast={toast} toaster={toaster} data-testid='toast'>
            <ToastTitle />
          </ToastRoot>
        )}
      </Toaster>,
    );

    expect(screen.getAllByTestId('toast').map((toast) => toast.textContent)).toEqual([
      'First',
      'Second',
    ]);
  });

  it('should focus the toaster only when the hotkey matches exactly', () => {
    const toaster = createToaster();

    render(
      <Toaster toaster={toaster} hotkey={['altKey', 'KeyT']}>
        {(toast) => <ToastRoot key={toast.id} toast={toast} toaster={toaster} />}
      </Toaster>,
    );

    const region = screen.getByRole('region', { name: 'Notifications (altKey+KeyT)' });
    const extraModifierEvent = new KeyboardEvent('keydown', {
      altKey: true,
      shiftKey: true,
      code: 'KeyT',
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(extraModifierEvent);

    expect(document.activeElement).not.toBe(region);
    expect(extraModifierEvent.defaultPrevented).toBe(false);

    const hotkeyEvent = new KeyboardEvent('keydown', {
      altKey: true,
      code: 'KeyT',
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(hotkeyEvent);

    expect(document.activeElement).toBe(region);
    expect(hotkeyEvent.defaultPrevented).toBe(true);
  });

  it('should not consume queued toast duration before the toast is visible', () => {
    const toaster = createToaster({ duration: 1000, maxVisibleToasts: 1, removeDelay: 0 });
    const firstId = toaster.create({ title: 'First' });
    const secondId = toaster.create({ title: 'Second' });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(toaster.getSnapshot().map((toast) => toast.id)).toEqual([firstId]);
    expect(toaster.getSnapshot()[0]).toMatchObject({
      title: 'First',
      remaining: 1000,
      status: 'visible',
    });

    act(() => {
      jest.advanceTimersByTime(999);
    });

    expect(toaster.getSnapshot().map((toast) => toast.id)).toEqual([firstId]);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(toaster.getSnapshot()).toHaveLength(0);
    expect(secondId).not.toBe(firstId);
  });

  it('should not start the next toast timer while a dismissing toast still occupies the visible slot', () => {
    const toaster = createToaster({ duration: 1000, maxVisibleToasts: 1, removeDelay: 300 });
    const firstId = toaster.create({ title: 'First' });
    toaster.create({ title: 'Second' });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(toaster.getSnapshot()[0]).toMatchObject({ title: 'Second', status: 'dismissing' });
    expect(toaster.getSnapshot()[1]).toMatchObject({ title: 'First', remaining: 1000 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(toaster.getSnapshot().map((toast) => toast.id)).toEqual([firstId]);

    act(() => {
      jest.advanceTimersByTime(999);
    });

    expect(toaster.getSnapshot().map((toast) => toast.id)).toEqual([firstId]);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(toaster.getSnapshot()[0]).toMatchObject({ title: 'First', status: 'dismissing' });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(toaster.getSnapshot()).toHaveLength(0);
  });

  it('should call lifecycle callbacks', () => {
    const events: string[] = [];
    const toaster = createToaster({
      duration: 1000,
      removeDelay: 0,
      onCreate: (toast) => events.push(`create:${toast.id}:${String(toast.title)}`),
      onUpdate: (toast) => events.push(`update:${toast.id}:${String(toast.title)}`),
      onDismiss: (toast) => events.push(`dismiss:${toast.id}:${toast.status}`),
      onRemove: (toast) => events.push(`remove:${toast.id}:${String(toast.title)}`),
      onPause: (toast) => events.push(`pause:${toast.id}:${toast.remaining}`),
      onResume: (toast) => events.push(`resume:${toast.id}:${toast.remaining}`),
    });

    const id = toaster.create({ id: 'booking', title: 'Saving' });
    toaster.update(id, { title: 'Saved' });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    toaster.pause(id);
    toaster.resume(id);
    toaster.dismiss(id);

    expect(events).toEqual([
      'create:booking:Saving',
      'update:booking:Saved',
      'pause:booking:600',
      'resume:booking:600',
      'dismiss:booking:dismissing',
      'remove:booking:Saved',
    ]);
  });

  it('should treat duplicate ids as an update', () => {
    const onCreate = jest.fn();
    const onUpdate = jest.fn();
    const toaster = createToaster({ onCreate, onUpdate });

    toaster.create({ id: 'same-id', title: 'First' });
    toaster.create({ id: 'same-id', title: 'Second' });

    expect(toaster.getSnapshot()).toHaveLength(1);
    expect(toaster.getSnapshot()[0]).toMatchObject({ id: 'same-id', title: 'Second' });
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  it('should not remove a recreated toast after a pending remove delay', () => {
    const toaster = createToaster({ removeDelay: 300 });

    toaster.create({ id: 'same-id', title: 'First', duration: null });
    toaster.dismiss('same-id');
    toaster.create({ id: 'same-id', title: 'Second', duration: null });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(toaster.getSnapshot()).toHaveLength(1);
    expect(toaster.getSnapshot()[0]).toMatchObject({ id: 'same-id', title: 'Second' });
  });

  it('should keep an updated toast visible after it was dismissed', () => {
    const toaster = createToaster({ removeDelay: 300, duration: null });

    toaster.create({ id: 'same-id', title: 'First' });
    toaster.dismiss('same-id');
    toaster.update('same-id', { title: 'Revived' });

    expect(toaster.getSnapshot()[0]).toMatchObject({ id: 'same-id', status: 'visible' });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(toaster.getSnapshot()).toHaveLength(1);
    expect(toaster.getSnapshot()[0]).toMatchObject({ id: 'same-id', title: 'Revived' });
  });

  it('should clean timers and page idle listener when destroyed', () => {
    const addSpy = jest.spyOn(document, 'addEventListener');
    const removeSpy = jest.spyOn(document, 'removeEventListener');
    const toaster = createToaster({ pauseOnPageIdle: true, duration: 1000, removeDelay: 300 });
    const visibilityListener = addSpy.mock.calls.find(([type]) => type === 'visibilitychange')?.[1];

    toaster.create({ title: 'Destroy me' });
    toaster.dismiss();
    toaster.destroy();

    expect(removeSpy).toHaveBeenCalledWith('visibilitychange', visibilityListener);

    act(() => {
      jest.advanceTimersByTime(1300);
    });

    expect(toaster.getSnapshot()).toHaveLength(0);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('should close a toast from the close control', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const toaster = createToaster({ removeDelay: 0 });
    toaster.create({ title: 'Closable' });

    render(
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root key={toast.id} toast={toast} toaster={toaster}>
            <Toast.Title />
            <Toast.Close>Close</Toast.Close>
          </Toast.Root>
        )}
      </Toaster>,
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => expect(screen.queryByText('Closable')).not.toBeInTheDocument());
  });

  it('should not render the close control when a toast is not dismissible', () => {
    const toaster = createToaster();
    toaster.create({ title: 'Pinned', dismissible: false });

    render(
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root key={toast.id} toast={toast} toaster={toaster}>
            <Toast.Title />
            <Toast.Close>Close</Toast.Close>
          </Toast.Root>
        )}
      </Toaster>,
    );

    expect(screen.getByText('Pinned')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('should trigger action and dismiss the toast', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onAction = jest.fn();
    const toaster = createToaster({ removeDelay: 0 });
    toaster.create({
      title: 'Removed',
      action: {
        label: 'Undo',
        altText: 'Undo remove',
        onClick: onAction,
      },
    });

    render(
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root key={toast.id} toast={toast} toaster={toaster}>
            <Toast.Title />
            <Toast.Action />
          </Toast.Root>
        )}
      </Toaster>,
    );

    await user.click(screen.getByRole('button', { name: 'Undo remove' }));

    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ title: 'Removed' }));
    await waitFor(() => expect(screen.queryByText('Removed')).not.toBeInTheDocument());
  });

  it('should update promise toasts after resolution', async () => {
    const toaster = createToaster({ removeDelay: 0 });
    const promise = Promise.resolve('done');

    await expect(
      toaster.promise(promise, {
        loading: { title: 'Loading' },
        success: (value) => ({ title: value }),
        error: { title: 'Failed' },
      }),
    ).resolves.toBe('done');

    expect(toaster.getSnapshot()[0]).toMatchObject({
      title: 'done',
      type: 'success',
      duration: 5000,
    });
  });

  it('should keep promise loading toasts visible until the promise settles', async () => {
    const toaster = createToaster({ duration: 1000, removeDelay: 0 });
    let resolvePromise: (value: string) => void = () => {};
    const promise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });

    const trackedPromise = toaster.promise(promise, {
      loading: { title: 'Loading' },
      success: (value) => ({ title: value }),
      error: { title: 'Failed' },
    });

    expect(toaster.getSnapshot()[0]).toMatchObject({
      title: 'Loading',
      type: 'loading',
      duration: null,
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(toaster.getSnapshot()[0]).toMatchObject({ title: 'Loading', type: 'loading' });

    resolvePromise('done');
    await expect(trackedPromise).resolves.toBe('done');

    expect(toaster.getSnapshot()[0]).toMatchObject({
      title: 'done',
      type: 'success',
      duration: 1000,
    });
  });

  it('should fall back to default when a toast type is not provided', () => {
    const toaster = createToaster();

    toaster.create({ title: 'Heads up' });

    expect(toaster.getSnapshot()[0]).toMatchObject({ title: 'Heads up', type: 'default' });
  });

  it('should expose toast content through compound parts', () => {
    const toaster = createToaster();
    toaster.info({ title: 'Flight updated', description: 'Gate changed', announcement: 'polite' });
    const toast = toaster.getSnapshot()[0];

    render(
      <ToastRoot toast={toast} toaster={toaster}>
        <ToastTitle />
        <ToastDescription />
        <ToastClose />
      </ToastRoot>,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('data-toast-id', toast?.id);
    expect(screen.getByText('Flight updated')).toBeInTheDocument();
    expect(screen.getByText('Gate changed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument();
  });

  it('should use assertive announcements for errors by default', () => {
    const toaster = createToaster();
    toaster.error({ title: 'Payment failed' });
    const toast = toaster.getSnapshot()[0];

    render(
      <ToastRoot toast={toast} toaster={toaster}>
        <ToastTitle />
      </ToastRoot>,
    );

    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });
});
