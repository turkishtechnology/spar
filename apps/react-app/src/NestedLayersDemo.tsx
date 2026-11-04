import { useState, type CSSProperties } from 'react';
import { Dialog, DropdownMenu, Popover, Select } from '@turkish-technology/spar';

/**
 * Nested floating layers: Select / Popover / DropdownMenu content is portaled
 * to `document.body`, outside the parent layer's DOM node. Interacting with it
 * must not dismiss the parent (turkishtechnology/spar#196).
 */
export function NestedLayersDemo() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Ada Lovelace');
  const [cabin, setCabin] = useState<string>();
  const [log, setLog] = useState<string[]>([]);

  const record = (entry: string) =>
    setLog((current) =>
      [`${new Date().toLocaleTimeString('tr-TR')}  ${entry}`, ...current].slice(0, 8),
    );

  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>4) Dialog icinde Select, Popover ve DropdownMenu</h2>
      <p style={styles.sectionText}>
        Dialog'u acin, kabin secin, Popover ve DropdownMenu'yu kullanin. Dialog acik kalmali ve
        girdiginiz ad korunmali. Overlay'e tiklamak dialog'u yine kapatmali.
      </p>

      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          record(next ? 'dialog acildi' : 'dialog KAPANDI');
        }}
      >
        <Dialog.Trigger style={styles.primaryButton}>Yolcu bilgileri dialog'unu ac</Dialog.Trigger>
        <Dialog.Overlay style={styles.overlay} />
        <Dialog.Content style={styles.dialogContent}>
          <Dialog.Title style={styles.dialogTitle}>Yolcu bilgileri</Dialog.Title>

          <label style={styles.field}>
            <span style={styles.label}>Ad soyad</span>
            <input
              style={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <div style={styles.field}>
            <span style={styles.label}>Kabin</span>
            <Select
              value={cabin}
              onChange={(value: string) => {
                setCabin(value);
                record(`kabin secildi: ${value}`);
              }}
            >
              <Select.Trigger aria-label='Kabin' placeholder='Kabin secin' style={styles.input} />
              <Select.Content style={styles.floating}>
                {['Economy', 'Business', 'First class'].map((option) => (
                  <Select.Item key={option} value={option} label={option} style={styles.item}>
                    {option}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          <div style={styles.row}>
            <Popover>
              <Popover.Trigger style={styles.ghostButton}>Bagaj (Popover)</Popover.Trigger>
              <Popover.Content style={styles.floating}>
                <p style={styles.popoverText}>Bagaj hakki: 23 kg</p>
                <Popover.Close
                  style={styles.ghostButton}
                  onClick={() => record('popover Tamam ile kapandi')}
                >
                  Tamam
                </Popover.Close>
              </Popover.Content>
            </Popover>

            <DropdownMenu>
              <DropdownMenu.Trigger style={styles.ghostButton}>
                Islemler (Dropdown)
              </DropdownMenu.Trigger>
              <DropdownMenu.Content style={styles.floating}>
                <DropdownMenu.Item
                  style={styles.item}
                  onSelect={() => record('dropdown: Koltuk sec')}
                >
                  Koltuk sec
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  style={styles.item}
                  onSelect={() => record('dropdown: Yemek ekle')}
                >
                  Yemek ekle
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>

          <div style={styles.actions}>
            <Dialog.Close style={styles.primaryButton}>Kaydet</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      <div style={styles.log} aria-live='polite'>
        <strong>Olay kaydi</strong>
        {log.length === 0 ? (
          <span style={styles.muted}>Henuz olay yok.</span>
        ) : (
          log.map((entry, index) => <span key={index}>{entry}</span>)
        )}
      </div>
    </section>
  );
}

const font = 'Inter, Arial, sans-serif';

const button: CSSProperties = {
  fontFamily: font,
  border: '1px solid #d1d5db',
  borderRadius: 8,
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: 14,
};

const styles: Record<string, CSSProperties> = {
  section: {
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    background: '#ffffff',
  },
  sectionTitle: { margin: '0 0 8px', fontSize: 18 },
  sectionText: { margin: '0 0 12px', color: '#4b5563', fontSize: 14 },
  primaryButton: { ...button, background: '#111827', color: '#ffffff' },
  ghostButton: { ...button, background: '#ffffff', color: '#111827' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.5)' },
  dialogContent: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(92vw, 420px)',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    padding: 16,
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
    display: 'grid',
    gap: 12,
    fontFamily: font,
    color: '#1f2937',
  },
  dialogTitle: { margin: 0, fontSize: 18 },
  field: { display: 'grid', gap: 4 },
  label: { fontSize: 13, fontWeight: 600 },
  input: { ...button, cursor: 'text', textAlign: 'left', background: '#ffffff', color: '#111827' },
  floating: {
    zIndex: 10,
    fontFamily: font,
    color: '#1f2937',
    minWidth: 180,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 6,
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.18)',
  },
  item: { padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  row: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  popoverText: { margin: '4px 6px 8px', fontSize: 14 },
  actions: { display: 'flex', justifyContent: 'flex-end' },
  log: {
    marginTop: 12,
    display: 'grid',
    gap: 2,
    fontFamily: 'ui-monospace, Menlo, monospace',
    fontSize: 13,
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 10,
  },
  muted: { color: '#6b7280' },
};
