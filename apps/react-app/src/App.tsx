import { useState, type CSSProperties } from 'react';
import { Dialog } from '@turkish-technology/spar';

function App() {
  const [controlledOpen, setControlledOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [nonModalOpen, setNonModalOpen] = useState(false);
  const [pageClicks, setPageClicks] = useState(0);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dialog Test Sayfasi</h1>
        <p style={styles.subtitle}>
          Spar Dialog bileseninin temel, controlled ve modal/non-modal kullanimlarini test edin.
        </p>
      </header>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>1) Basic Dialog (Uncontrolled)</h2>
        <p style={styles.sectionText}>En temel kullanim: trigger ile acilir, close ile kapanir.</p>
        <Dialog.Root>
          <Dialog.Trigger style={styles.primaryButton}>Basic Dialog Ac</Dialog.Trigger>
          <Dialog.Overlay style={styles.overlay} />
          <Dialog.Content style={styles.dialogContent}>
            <Dialog.Title style={styles.dialogTitle}>Basit Dialog</Dialog.Title>
            <Dialog.Description style={styles.dialogDescription}>
              Bu ornek, Dialog bileseninin uncontrolled kullanimini gosterir.
            </Dialog.Description>
            <div style={styles.actions}>
              <Dialog.Close style={styles.ghostButton}>Kapat</Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>2) Controlled Dialog</h2>
        <p style={styles.sectionText}>
          Acik/kapali durumunu React state ile disaridan yonetebilirsiniz.
        </p>
        <div style={styles.row}>
          <button
            style={styles.primaryButton}
            onClick={() => setControlledOpen(true)}
            type='button'
          >
            Disaridan Ac
          </button>
          <button style={styles.ghostButton} onClick={() => setControlledOpen(false)} type='button'>
            Disaridan Kapat
          </button>
        </div>
        <Dialog.Root open={controlledOpen} onOpenChange={setControlledOpen}>
          <Dialog.Trigger style={styles.primaryButton}>Trigger ile Ac</Dialog.Trigger>
          <Dialog.Overlay style={styles.overlay} />
          <Dialog.Content style={styles.dialogContent}>
            <Dialog.Title style={styles.dialogTitle}>Controlled Dialog</Dialog.Title>
            <Dialog.Description style={styles.dialogDescription}>
              Bu pencere <code>open</code> ve <code>onOpenChange</code> ile kontrol edilir.
            </Dialog.Description>
            <div style={styles.actions}>
              <button
                style={styles.primaryButton}
                onClick={() => setControlledOpen(false)}
                type='button'
              >
                Kaydet ve Kapat
              </button>
              <Dialog.Close style={styles.ghostButton}>Iptal</Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>3) Modal ve Non-Modal Davranisi</h2>
        <p style={styles.sectionText}>
          Modal dialog arka plan etkilesimini bloklar. Non-modal acikken sayfayla etkilesim devam
          eder.
        </p>
        <div style={styles.row}>
          <button style={styles.primaryButton} onClick={() => setModalOpen(true)} type='button'>
            Modal Ac
          </button>
          <button style={styles.primaryButton} onClick={() => setNonModalOpen(true)} type='button'>
            Non-Modal Ac
          </button>
          <button
            style={styles.ghostButton}
            onClick={() => setPageClicks((v) => v + 1)}
            type='button'
          >
            Sayfa Tiklama Sayaci: {pageClicks}
          </button>
        </div>

        <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
          <Dialog.Overlay style={styles.overlay} />
          <Dialog.Content style={styles.dialogContent}>
            <Dialog.Title style={styles.dialogTitle}>Modal Dialog</Dialog.Title>
            <Dialog.Description style={styles.dialogDescription}>
              Bu dialog acikken arka plan tiklamalari engellenir.
            </Dialog.Description>
            <div style={styles.actions}>
              <Dialog.Close style={styles.ghostButton}>Kapat</Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Root>

        <Dialog.Root modal={false} open={nonModalOpen} onOpenChange={setNonModalOpen}>
          <Dialog.Content style={styles.nonModalContent}>
            <Dialog.Title style={styles.dialogTitle}>Non-Modal Dialog</Dialog.Title>
            <Dialog.Description style={styles.dialogDescription}>
              Bu dialog acikken sayfadaki sayac butonuna tiklamaya devam edebilirsiniz.
            </Dialog.Description>
            <div style={styles.actions}>
              <Dialog.Close style={styles.ghostButton}>Kapat</Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    fontFamily: 'Inter, Arial, sans-serif',
    color: '#1f2937',
    maxWidth: 900,
    margin: '0 auto',
    padding: '32px 20px 56px',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    margin: '0 0 8px',
    fontSize: 30,
  },
  subtitle: {
    margin: 0,
    color: '#4b5563',
    fontSize: 15,
  },
  section: {
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    background: '#ffffff',
  },
  sectionTitle: {
    margin: '0 0 8px',
    fontSize: 18,
  },
  sectionText: {
    margin: '0 0 12px',
    color: '#4b5563',
    fontSize: 14,
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  primaryButton: {
    border: '1px solid #d1d5db',
    background: '#111827',
    color: '#ffffff',
    borderRadius: 8,
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: 14,
  },
  ghostButton: {
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#111827',
    borderRadius: 8,
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: 14,
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(17, 24, 39, 0.5)',
  },
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
  },
  nonModalContent: {
    position: 'fixed',
    right: 16,
    bottom: 16,
    width: 'min(90vw, 360px)',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    padding: 16,
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.18)',
  },
  dialogTitle: {
    margin: '0 0 8px',
    fontSize: 18,
  },
  dialogDescription: {
    margin: 0,
    fontSize: 14,
    color: '#4b5563',
  },
  actions: {
    marginTop: 14,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
  },
};

export default App;
