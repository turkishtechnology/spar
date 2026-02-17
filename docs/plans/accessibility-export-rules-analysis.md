# Plan: Erişilebilirlik ve Export/API Kuralları Analizi

Bu doküman 2 ana kategoriyi analiz eder:

1. Erişilebilirlik Temel Kuralları (5 madde)
2. Export/Public API Kuralları (2 madde)

---

## Part 1: Erişilebilirlik Temel Kuralları

### Genel Durum: ✅ **Mükemmel (%95+)**

Spar erişilebilirlik konusunda **global standartlarla tam uyumlu**.

---

### 1.1 Klavye Erişilebilirliği ✅

**Durum**: %100 Uyumlu

| Component    | tabIndex            | onKeyDown                | Compliance |
| ------------ | ------------------- | ------------------------ | ---------- |
| Button       | ✅ Mevcut           | ✅ Space/Enter           | ✅         |
| Checkbox     | ✅ Via Button       | ✅ Via Button            | ✅         |
| Switch       | ✅ Via Button       | ✅ Mevcut                | ✅         |
| Dialog       | ✅ Focus trap       | ✅ Escape handling       | ✅         |
| DropdownMenu | ✅ Collection items | ✅ Arrow/Home/End/Escape | ✅         |
| Select       | ✅ tabIndex=-1      | ✅ Full navigation       | ✅         |
| Tabs         | ✅ Mevcut           | ✅ Arrow keys            | ✅         |
| Accordion    | ✅ Mevcut           | ✅ Arrow keys            | ✅         |

**Keyboard Navigation Pattern:**

```tsx
switch (key) {
  case 'ArrowDown':
    highlightNext();
    break;
  case 'ArrowUp':
    highlightPrevious();
    break;
  case 'Home':
    highlightFirst();
    break;
  case 'End':
    highlightLast();
    break;
  case 'Escape':
    closeMenu();
    break;
  case 'Enter':
    selectItem();
    break;
}
```

---

### 1.2 WAI-ARIA Attributes ✅

**Durum**: %100 Uyumlu

| Component    | ARIA Roles                                              | ARIA Attributes                                                     |
| ------------ | ------------------------------------------------------- | ------------------------------------------------------------------- |
| Dialog       | `dialog` / `alertdialog`                                | `aria-modal`, `aria-labelledby`, `aria-describedby`                 |
| DropdownMenu | `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio` | `aria-expanded`, `aria-haspopup`, `aria-controls`                   |
| Switch       | `switch`                                                | `aria-checked`, `aria-disabled`                                     |
| Checkbox     | `checkbox`                                              | `aria-checked` (true/false/mixed), `aria-disabled`, `aria-required` |
| Tabs         | `tablist`, `tab`, `tabpanel`                            | `aria-selected`, `aria-controls`, `aria-labelledby`                 |
| Tooltip      | `tooltip`                                               | `aria-describedby` on trigger                                       |
| Popover      | `dialog` (when modal)                                   | `aria-modal`, etc.                                                  |
| Select       | `listbox`, `option`, `combobox`                         | `aria-expanded`, `aria-activedescendant`                            |

---

### 1.3 Focus Yönetimi ✅

**Durum**: %100 Uyumlu - Kapatmada focus geri yükleniyor.

| Component    | Focus on Open          | Focus on Close          | Trap Focus          |
| ------------ | ---------------------- | ----------------------- | ------------------- |
| Dialog       | ✅ `autoFocus`         | ✅ `restoreFocusRef`    | ✅ `trapFocus` prop |
| DropdownMenu | ✅ via `focusStrategy` | ✅ `triggerRef.focus()` | ✅ Modal mode       |
| Popover      | ✅ `autoFocus`         | ✅ `restoreFocusRef`    | ✅ Optional         |
| Tooltip      | ✅ N/A (hover-only)    | ✅ N/A                  | ❌ N/A              |
| Select       | ✅ Content focus       | ✅ `triggerRef.focus()` | ❌ N/A              |

**Focus Restoration Pattern:**

```tsx
useEffect(() => {
  if (!isOpen && wasOpen) {
    const elementToFocus = finalFocusElement || restoreFocusRef.current;
    if (elementToFocus) {
      elementToFocus.focus();
    }
  }
}, [isOpen]);
```

---

### 1.4 jest-axe Testleri ✅

**Durum**: %100 Uyumlu

✅ **jest-axe kurulu**: `"jest-axe": "^10.0.0"`

✅ **15 a11y test dosyası mevcut:**

| Component    | Test Dosyası                 |
| ------------ | ---------------------------- |
| Accordion    | `Accordion.a11y.test.tsx`    |
| Breadcrumb   | `Breadcrumb.a11y.test.tsx`   |
| Button       | `Button.a11y.test.tsx`       |
| Checkbox     | `Checkbox.a11y.test.tsx`     |
| Collapsible  | `Collapsible.a11y.test.tsx`  |
| Dialog       | `Dialog.a11y.test.tsx`       |
| DropdownMenu | `DropdownMenu.a11y.test.tsx` |
| Input        | `Input.a11y.test.tsx`        |
| Label        | `Label.a11y.test.tsx`        |
| Popover      | `Popover.a11y.test.tsx`      |
| Radio        | `Radio.a11y.test.tsx`        |
| Select       | `Select.a11y.test.tsx`       |
| Switch       | `Switch.a11y.test.tsx`       |
| Tabs         | `Tabs.a11y.test.tsx`         |
| Tooltip      | `Tooltip.a11y.test.tsx`      |

**Test Pattern:**

```tsx
describe('jest-axe Compliance', () => {
  it('passes accessibility checks in default state', async () => {
    const { container } = render(<Checkbox>Subscribe</Checkbox>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

### 1.5 Escape Tuşu Handling ✅

**Durum**: %100 Uyumlu - Tüm overlay'ler Escape ile kapanıyor.

| Component    | Escape Handler       | Focus Restoration        |
| ------------ | -------------------- | ------------------------ |
| Dialog       | ✅ `onEscapeKeyDown` | ✅ Via `restoreFocusRef` |
| DropdownMenu | ✅ `handleKeyDown`   | ✅ `triggerRef.focus()`  |
| Popover      | ✅ `handleKeyDown`   | ✅ `restoreFocusRef`     |
| Tooltip      | ✅ `handleKeyDown`   | ✅ N/A                   |
| Select       | ✅ `handleKeyDown`   | ✅ `triggerRef.focus()`  |

**Escape Handling Pattern:**

```tsx
const handleKeyDown = useCallback(
  (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onEscapeKeyDown?.(event.nativeEvent);
      if (!event.defaultPrevented) {
        setIsOpen(false);
      }
    }
  },
  [onEscapeKeyDown, setIsOpen],
);
```

---

## Part 2: Export/Public API Kuralları

### Genel Durum: ⚠️ **İyileştirme Gerekli (%60)**

---

### 2.1 Çift Export Kalıbı (index.ts)

**Beklenen Pattern:**

```typescript
// 1. Nokta notasyonu için compound export
export { ComponentCompound as Component };

// 2. Tree-shaking için named export'lar
export { ComponentPart1, ComponentPart2 };

// 3. Root alias
export { Component as ComponentRoot };
```

**Mevcut Durum:**

| Özellik          | Durum     | Açıklama                                     |
| ---------------- | --------- | -------------------------------------------- |
| Root Export      | ✅ %100   | `export { Accordion }`                       |
| Root Alias       | ✅ %100   | `export { Accordion as AccordionRoot }`      |
| Parts Export     | ✅ %100   | `export { AccordionItem, AccordionTrigger }` |
| **Dot Notation** | ❌ **%0** | `Accordion.Item` YOK                         |

**Mevcut Pattern (Tüm Componentlerde):**

```typescript
// Accordion/index.ts
export { Accordion } from './Accordion';
export { Accordion as AccordionRoot } from './Accordion';
export { AccordionItem } from './AccordionItem';
export { AccordionTrigger } from './AccordionTrigger';
export { AccordionContent } from './AccordionContent';
```

**Eksik: Dot Notation Compound Export**

Radix UI tarzı kullanım şu an mümkün değil:

```tsx
// Bu çalışmıyor ❌
<Accordion.Root>
  <Accordion.Item>
    <Accordion.Trigger />
    <Accordion.Content />
  </Accordion.Item>
</Accordion.Root>

// Bu çalışıyor ✅
<Accordion>
  <AccordionItem>
    <AccordionTrigger />
    <AccordionContent />
  </AccordionItem>
</Accordion>
```

**Etkilenen Componentler (10 adet):**

- Accordion
- Dialog
- DropdownMenu
- Tooltip
- Tabs
- Select
- Popover
- Radio
- Collapsible
- Breadcrumb

### Global Kütüphane Karşılaştırması

**Radix UI Pattern:**

```typescript
// Named exports (tree-shakeable)
export const Dialog = Root;
export const DialogTrigger = Trigger;
export const DialogContent = Content;

// Compound export (dot notation)
const DialogPrimitive = {
  Root,
  Trigger,
  Portal,
  Content,
};

export default DialogPrimitive;

// Kullanım seçenekleri:
// import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
// VEYA
// import DialogPrimitive from '@radix-ui/react-dialog';
// <DialogPrimitive.Root>
```

### Önerilen Düzeltme

```typescript
// Accordion/index.ts - Güncellenmeli
import { Accordion as AccordionRoot } from './Accordion';
import { AccordionItem } from './AccordionItem';
import { AccordionHeader } from './AccordionHeader';
import { AccordionTrigger } from './AccordionTrigger';
import { AccordionContent } from './AccordionContent';

// Dot notation compound
const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

// Exports
export { Accordion }; // Compound (dot notation)
export { AccordionRoot }; // Explicit root
export { AccordionItem }; // Tree-shakeable
export { AccordionHeader };
export { AccordionTrigger };
export { AccordionContent };
```

---

### 2.2 Internal Type'ların Export Edilmemesi

**Kural:** `@internal` JSDoc ile işaretli type'lar export edilmemeli.

**Mevcut Durum:**

| Component    | @internal Var            | Export Ediliyor mu? | Durum    |
| ------------ | ------------------------ | ------------------- | -------- |
| Dialog       | ✅ `DialogContextValue`  | ⚠️ **EVET**         | ❌ İhlal |
| Tooltip      | ✅ `TooltipContextValue` | ⚠️ **EVET**         | ❌ İhlal |
| Popover      | ✅ `PopoverContextValue` | ⚠️ **EVET**         | ❌ İhlal |
| Select       | ✅ `SelectContextValue`  | ⚠️ **EVET**         | ❌ İhlal |
| DropdownMenu | ✅ @internal             | ✅ Export edilmiyor | ✅ OK    |
| Accordion    | ✅ @internal             | ✅ Export edilmiyor | ✅ OK    |
| Tabs         | ✅ @internal             | ✅ Export edilmiyor | ✅ OK    |

**İhlal Örneği:**

```typescript
// Dialog/index.ts - YANLIŞ
export type {
  DialogProps,
  DialogTriggerProps,
  DialogContextValue, // ❌ @internal ama export ediliyor!
} from './types';

// types.ts
/** @internal */
export interface DialogContextValue {
  // ...
}
```

### Düzeltilmesi Gereken Dosyalar

1. **Dialog/index.ts** → `DialogContextValue` export'unu kaldır
2. **Tooltip/index.ts** → `TooltipContextValue` export'unu kaldır
3. **Popover/index.ts** → `PopoverContextValue` export'unu kaldır
4. **Select/index.ts** → `SelectContextValue` export'unu kaldır

---

## Özet Tablosu

| Kategori            | Kural                   | Spar    | Radix UI | Öncelik   |
| ------------------- | ----------------------- | ------- | -------- | --------- |
| **Erişilebilirlik** | Klavye Erişilebilirliği | ✅ %100 | ✅ %100  | ✅ Tamam  |
|                     | WAI-ARIA Attributes     | ✅ %100 | ✅ %100  | ✅ Tamam  |
|                     | Focus Yönetimi          | ✅ %100 | ✅ %100  | ✅ Tamam  |
|                     | jest-axe Testleri       | ✅ %100 | ✅ %100  | ✅ Tamam  |
|                     | Escape Tuşu             | ✅ %100 | ✅ %100  | ✅ Tamam  |
| **Export/API**      | Root + Alias + Parts    | ✅ %100 | ✅ %100  | ✅ Tamam  |
|                     | Dot Notation Export     | ❌ %0   | ✅ %100  | 🟡 Orta   |
|                     | @internal Type Export   | ⚠️ %60  | ✅ %100  | 🔴 Yüksek |

---

## Yapılması Gerekenler

### Öncelik 1 - Yüksek: Internal Type Export İhlalleri

4 dosyadan ContextValue export'larını kaldır:

```typescript
// Dialog/index.ts - DialogContextValue KALDIR
// Tooltip/index.ts - TooltipContextValue KALDIR
// Popover/index.ts - PopoverContextValue KALDIR
// Select/index.ts - SelectContextValue KALDIR
```

### Öncelik 2 - Orta: Dot Notation Export Ekle

10 compound component için Object.assign pattern ekle.

---

## Sonuç

**Erişilebilirlik**: ✅ Mükemmel - Radix UI ve React Aria ile aynı seviyede.

**Export/API**: ⚠️ İyileştirme gerekli

- Internal type export ihlalleri düzeltilmeli (4 dosya)
- Dot notation export eklenebilir (opsiyonel, DX iyileştirmesi)
