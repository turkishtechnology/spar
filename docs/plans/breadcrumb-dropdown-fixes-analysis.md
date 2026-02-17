# Plan: Breadcrumb Position Algılama ve DropdownMenu Focus Trap

Bu doküman 2 ayrı iyileştirme önerisini kapsar:

1. Breadcrumb displayName Kontrolünü Refaktör Et
2. DropdownMenu Modal Moduna Focus Trap Ekle

---

## 1. Breadcrumb Position Algılamasını Refaktör Et

### Mevcut Durum

❌ **Kritik Bug** - `displayName` kullanımı production'da bozuk.

#### Mevcut Implementation

```tsx
// BreadcrumbList.tsx
Children.map(children, (child, index) => {
  const childType = child.type as { displayName?: string };
  if (childType.displayName === 'BreadcrumbSeparator') {
    return child; // Skip separator
  }
  // Position calculation based on index
});
```

### Tespit Edilen Problemler

| Sorun                          | Açıklama                                                            | Şiddet    |
| ------------------------------ | ------------------------------------------------------------------- | --------- |
| **Production Build Stripping** | Bundlers (Terser, esbuild, SWC) `displayName`'i production'da siler | 🔴 Kritik |
| **Yanlış Index Hesaplama**     | Separator'lar `index`'e dahil, pozisyon hesaplaması bozuk           | 🔴 Kritik |
| **Minification**               | Function names ve `displayName` mangled olabilir                    | 🔴 Yüksek |
| **Kullanıcı Customization**    | Wrapper component'ler `displayName`'i kaybeder                      | 🟡 Orta   |

### Kanıt: Bozuk Pozisyon Mantığı

```tsx
<BreadcrumbList>
  <BreadcrumbItem>Home</BreadcrumbItem> {/* index: 0 → 'first' ✅ */}
  <BreadcrumbSeparator>/</BreadcrumbSeparator> {/* index: 1 → skipped */}
  <BreadcrumbItem>Products</BreadcrumbItem> {/* index: 2 → 'middle' ✅ */}
  <BreadcrumbSeparator>/</BreadcrumbSeparator> {/* index: 3 → skipped */}
  <BreadcrumbItem>Current</BreadcrumbItem> {/* index: 4 → childCount=5, 'middle' ❌ YANLIŞ! */}
</BreadcrumbList>
```

`childCount` separator'ları içeriyor, bu yüzden son item 'last' yerine 'middle' olarak hesaplanıyor!

### Global Kütüphane Karşılaştırması

| Yaklaşım                 | Kütüphane         | Pros                  | Cons                |
| ------------------------ | ----------------- | --------------------- | ------------------- |
| **Context registration** | Radix UI, Ariakit | En temiz pattern      | Daha kompleks       |
| **Symbol marker**        | Custom            | Build-safe, explicit  | Biraz daha kod      |
| **`data-*` attribute**   | React Aria        | Her child ile çalışır | DOM erişimi gerekir |
| **Explicit prop**        | Headless UI       | Basit, açık           | Daha az otomatik    |

### Önerilen Çözüm: Symbol Marker

**Neden Symbol?**

- Production build'de **strip edilmez**
- TypeScript ile type-safe yapılabilir
- Minification'dan etkilenmez

#### Implementation

```typescript
// constants.ts veya types.ts
export const IS_SEPARATOR = Symbol('spar.breadcrumb.separator');

// BreadcrumbSeparator.tsx
export const BreadcrumbSeparator = ({ children, ...props }) => {
  return <span role="presentation" aria-hidden="true" {...props}>{children}</span>;
};
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';
(BreadcrumbSeparator as any)[IS_SEPARATOR] = true;

// BreadcrumbList.tsx
const isSeparator = (child: ReactElement) => (child.type as any)?.[IS_SEPARATOR] === true;

// 1. Önce children'ı filter et
const allChildren = Children.toArray(children);
const items = allChildren.filter(
  (child) => isValidElement(child) && !isSeparator(child as ReactElement)
);
const itemCount = items.length;

// 2. Sonra doğru pozisyon hesapla
let itemIndex = 0;
const enhancedChildren = allChildren.map((child) => {
  if (!isValidElement(child)) return child;

  if (isSeparator(child)) {
    return child; // Separator olduğu gibi döndür
  }

  // BreadcrumbItem için pozisyon hesapla
  const position = itemIndex === 0
    ? 'first'
    : itemIndex === itemCount - 1
      ? 'last'
      : 'middle';

  itemIndex++;

  return cloneElement(child, { position, index: itemIndex - 1 });
});
```

### Alternatif: Context Registration Pattern

```typescript
// Radix UI tarzı - daha robust ama daha kompleks
const BreadcrumbContext = createContext<{
  registerItem: (id: string) => number;
  unregisterItem: (id: string) => void;
  itemCount: number;
}>({ ... });

// Her BreadcrumbItem kendini register eder
const BreadcrumbItem = ({ children }) => {
  const { registerItem, unregisterItem, itemCount } = useBreadcrumbContext();
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const idx = registerItem(id);
    setIndex(idx);
    return () => unregisterItem(id);
  }, []);

  const position = index === 0 ? 'first' : index === itemCount - 1 ? 'last' : 'middle';
  // ...
};
```

### Yapılması Gerekenler

1. `IS_SEPARATOR` Symbol constant oluştur
2. `BreadcrumbSeparator`'a Symbol marker ekle
3. `BreadcrumbList`'te children filter mantığını düzelt
4. Pozisyon hesaplamasını fix et
5. Testleri güncelle

### Öncelik

🔴 **Yüksek** - Production'da bozuk, kritik bug.

---

## 2. DropdownMenu Modal Moduna Focus Trap Ekle

### Mevcut Durum

⚠️ **Kısmen Eksik** - Tab handling var ama true focus trap yok.

#### Mevcut Implementation Durumu

| Özellik               | Durum        | Açıklama                          |
| --------------------- | ------------ | --------------------------------- |
| `modal` prop          | ✅ Var       | Default `true`                    |
| Tab key handling      | ✅ Var       | Menu items arasında navigate eder |
| Focus restoration     | ✅ Var       | Kapanınca trigger'a döner         |
| Pointer outside close | ✅ Var       | Çalışıyor                         |
| Escape key close      | ✅ Var       | Çalışıyor                         |
| **True Focus Trap**   | ❌ **Eksik** | Focus boundary prevention yok     |

#### Mevcut Tab Handling

```tsx
// DropdownMenuContent.tsx
case 'Tab':
  if (menu.modal) {
    event.preventDefault();
    if (event.shiftKey) {
      highlightPrevious();
    } else {
      highlightNext();
    }
    return;
  }
```

Bu sadece Tab key'i yakalar ve menu items arasında döner. Ama **true focus trap** değil çünkü:

- Programmatik focus attempt'leri engellenmiyor
- Global document listener yok
- Tüm focusable elementler değil, sadece menu items

### Dialog ile Karşılaştırma

| Özellik                      | Dialog                         | DropdownMenu               |
| ---------------------------- | ------------------------------ | -------------------------- |
| `trapFocus` prop             | ✅ Var                         | ❌ Yok                     |
| Tab cycling (all focusables) | ✅ Var                         | ❌ Sadece menu items       |
| Global keydown listener      | ✅ `document.addEventListener` | ❌ Sadece content üzerinde |
| Dynamic focusable query      | ✅ `querySelectorAll`          | ❌ Statik item list        |

### Dialog'un Focus Trap Implementation'ı

```tsx
// DialogContent.tsx
useEffect(() => {
  if (!isOpen || !modal || !trapFocus) return;

  const contentElement = contentRef.current;
  if (!contentElement) return;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusableElements = contentElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const focusableArray = Array.from(focusableElements) as HTMLElement[];

    if (focusableArray.length === 0) return;

    const firstElement = focusableArray[0];
    const lastElement = focusableArray[focusableArray.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isOpen, modal, trapFocus]);
```

### Dependency Seçenekleri

| Seçenek                   | Pros                                            | Cons                    |
| ------------------------- | ----------------------------------------------- | ----------------------- |
| **Custom implementation** | Zero dependency, Dialog pattern mevcut          | Daha fazla kod          |
| **focus-trap-react**      | Robust, edge case handling (iframe, shadow DOM) | +3KB gzipped dependency |

**Not**: `focus-trap-react` şu anda **kurulu değil**.

### Önerilen Çözüm: Custom Implementation

Dialog'daki pattern'i kopyala ve DropdownMenu'ye uyarla:

#### Types Güncellemesi

```typescript
// types.ts - DropdownMenuContentOwnProps
export interface DropdownMenuContentOwnProps {
  // ... existing props

  /**
   * Whether to trap focus within the menu when modal
   * @defaultValue true (when modal=true)
   */
  trapFocus?: boolean;
}
```

#### Implementation

```typescript
// DropdownMenuContent.tsx
useEffect(() => {
  if (!menu.open || !menu.modal || trapFocus === false) return;

  const contentElement = contentRef.current;
  if (!contentElement) return;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    // Menu items için focus trap
    const focusables = contentElement.querySelectorAll(
      '[role="menuitem"]:not([aria-disabled="true"]), ' +
        '[role="menuitemcheckbox"]:not([aria-disabled="true"]), ' +
        '[role="menuitemradio"]:not([aria-disabled="true"])',
    );

    const focusableArray = Array.from(focusables) as HTMLElement[];
    if (focusableArray.length === 0) return;

    const firstElement = focusableArray[0];
    const lastElement = focusableArray[focusableArray.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [menu.open, menu.modal, trapFocus]);
```

### DropdownMenu vs Dialog Focus Trap Farkı

Önemli fark: DropdownMenu'de focus trap **sadece menu items** için olmalı, Dialog'daki gibi tüm focusable elementler için değil. Çünkü:

- Menu items `role="menuitem"` ile işaretli
- Arrow key navigation mevcut
- Tab key zaten menu navigation için kullanılıyor

### Yapılması Gerekenler

1. `DropdownMenuContentOwnProps`'a `trapFocus` prop ekle
2. `DropdownMenuContent`'e focus trap effect ekle
3. Mevcut Tab key handling ile entegre et (çakışma olmasın)
4. Testler ekle

### Öncelik

🟡 **Orta** - Mevcut Tab handling çoğu case'i karşılıyor, ama WAI-ARIA tam uyumluluk için gerekli.

---

## Özet

| Madde                       | Şiddet    | Önerilen Çözüm                  | Effort |
| --------------------------- | --------- | ------------------------------- | ------ |
| **Breadcrumb displayName**  | 🔴 Kritik | Symbol marker + filter children | Orta   |
| **DropdownMenu Focus Trap** | 🟡 Orta   | Dialog pattern'i kopyala        | Düşük  |

### Uygulama Sırası

1. **İlk**: Breadcrumb - Production'da bozuk, acil düzeltilmeli
2. **İkinci**: DropdownMenu Focus Trap - WAI-ARIA uyumluluk için
