# Plan: Paylaşılan Hook ve Utility'ler Analizi

Bu doküman 3 ayrı iyileştirme önerisini kapsar:

1. useFloatingPosition Hook
2. Compound Export Pattern
3. composeEventHandlers Utility

---

## 1. Paylaşılan Konumlandırma Hook'u (useFloatingPosition)

### Mevcut Durum

❌ **Paylaşılan hook YOK** - Her component kendi Floating UI mantığını ayrı ayrı implement ediyor.

| Component           | Dosya                   | Implementation                       |
| ------------------- | ----------------------- | ------------------------------------ |
| DropdownMenuContent | DropdownMenuContent.tsx | `getPlacement()` + inline middleware |
| TooltipContent      | TooltipContent.tsx      | `toPlacement()` + inline middleware  |
| Popover             | hooks/usePopover.ts     | `usePopover` hook + `getPlacement()` |
| SelectContent       | SelectContent.tsx       | Inline middleware                    |

### Bulunan Kod Tekrarı

**1. Placement Dönüştürme Fonksiyonları** (3 aynı implementation):

```typescript
// DropdownMenuContent.tsx - getPlacement()
// TooltipContent.tsx - toPlacement()
// Popover/utils/index.ts - getPlacement()
// Hepsi Side + Align → Floating UI Placement dönüşümü yapıyor
```

**2. Middleware Konfigürasyonu** (~50-80 satır/component duplicate):

- `offset`, `flip`, `shift`, `arrow`, `size`, `hide` patterns
- Collision boundary handling
- Aynı prop patterns: `sideOffset`, `alignOffset`, `avoidCollisions`, `collisionBoundary`, `collisionPadding`

**3. Auto-update Setup**: Her component manuel `autoUpdate` çağırıyor.

**Toplam Tekrar**: ~200+ satır duplicate kod

### Global Headless Kütüphaneleri

**Radix UI**: Paylaşılan **Popper** primitive (`@radix-ui/react-popper`):

- `Popper.Root`, `Popper.Anchor`, `Popper.Content`, `Popper.Arrow` sağlar
- Tüm floating componentler (Tooltip, DropdownMenu, Popover, Select, ContextMenu, HoverCard) bu primitive'i kullanır
- CSS variables: `--radix-*-content-available-width`, `--radix-*-content-transform-origin`

**Ariakit**: Unified positioning system:

- Tüm positioning props (`gutter`, `placement`, `flip`, `slide`, `overlap`, `overflowPadding`, `fitViewport`) tutarlı
- Tek `updatePosition` callback pattern

### Önerilen API

```typescript
export interface UseFloatingPositionOptions {
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionBoundary?: Element | Element[] | null;
  collisionPadding?: number | Partial<Record<Side, number>>;
  arrowRef?: RefObject<HTMLElement | null>;
  hideWhenDetached?: boolean;
}

export const useFloatingPosition = (
  referenceRef: RefObject<HTMLElement | null>,
  options: UseFloatingPositionOptions,
) => {
  // Consolidated Floating UI logic
  return {
    x,
    y,
    strategy,
    refs,
    placement,
    middlewareData,
    arrowData,
    floatingStyles,
  };
};
```

### Öneri

✅ **Kesinlikle Oluşturulmalı**

**Faydalar:**

- ~200+ satır duplicate kod eliminasyonu
- Tutarlı positioning API tüm componentlerde
- Tek noktada bakım ve bug fix
- Radix/Ariakit patterns ile uyumlu

---

## 2. Compound Export Pattern

### Mevcut Durum

⚠️ Sadece **named exports** var, dot notation **yok**.

```typescript
// Mevcut pattern (tüm componentlerde aynı)
export { Accordion } from './Accordion';
export { Accordion as AccordionRoot } from './Accordion';
export { AccordionItem } from './AccordionItem';
export { AccordionTrigger } from './AccordionTrigger';
export { AccordionContent } from './AccordionContent';
```

### Coding Standards Beklentisi

`coding-standards.instructions.md` dosyasında **dual export pattern** tanımlı ama uygulanmamış:

```typescript
// BEKLENTİ (coding standards'a göre):
const AccordionCompound = Accordion as typeof Accordion & {
  Root: typeof Accordion;
  Item: typeof AccordionItem;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
};

AccordionCompound.Root = Accordion;
AccordionCompound.Item = AccordionItem;
AccordionCompound.Trigger = AccordionTrigger;
AccordionCompound.Content = AccordionContent;

export {
  AccordionCompound as Accordion, // Dot notation
  AccordionItem, // Named export (tree-shakeable)
  Accordion as AccordionRoot, // Explicit alias
};
```

### Global Headless Kütüphaneleri

**Radix UI (Mevcut Pattern)**:

```tsx
import { DropdownMenu } from 'radix-ui';

// Dot notation kullanımı
<DropdownMenu.Root>
  <DropdownMenu.Trigger />
  <DropdownMenu.Content>
    <DropdownMenu.Item />
  </DropdownMenu.Content>
</DropdownMenu.Root>;
```

**Radix ayrıca individual imports destekler:**

```typescript
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@radix-ui/react-dropdown-menu';
```

### Etkilenen Componentler

~10 compound component güncellenmeli:

- Accordion
- Collapsible
- Dialog
- DropdownMenu
- Popover
- Select
- Tabs
- Tooltip
- Radio (RadioGroup)
- Breadcrumb

### Öneri

⚠️ **Orta Öncelik - Dikkatli Migration Gerekir**

**Faydalar:**

- Radix UI conventions ile uyum
- IDE autocomplete ile daha iyi keşfedilebilirlik (`Accordion.` yazınca tüm parts görünür)
- Named exports ile tree-shaking korunur

**Dikkat Edilecekler:**

- Mevcut pattern çalışıyor; değişiklik DX iyileştirmesi
- Tüm compound component index dosyaları güncellenmeli
- Dökümantasyon güncellemesi gerekir

---

## 3. composeEventHandlers Utility

### Mevcut Durum

❌ **Utility YOK** - `utils/index.ts` boş:

```typescript
// packages/spar/src/utils/index.ts
export {};
```

### Mevcut Event Handler Pattern

Componentler manuel olarak user handler'ları çağırıyor:

```typescript
// 20+ lokasyonda bulunan pattern:
const handleClick = useCallback(
  (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    setIsOpen(!isOpen);
    onClick?.(event); // Manuel çağrı
  },
  [disabled, isOpen, setIsOpen, onClick],
);
```

**Bu pattern'i kullanan dosyalar:**

- AccordionTrigger.tsx
- CollapsibleTrigger.tsx
- DialogTrigger.tsx
- DropdownMenuTrigger.tsx
- PopoverTrigger.tsx
- SelectTrigger.tsx
- TabsTrigger.tsx
- TooltipTrigger.tsx
- Button.tsx
- Checkbox.tsx
- Switch.tsx
- Ve 10+ daha fazla lokasyon

### Global Headless Kütüphaneleri

**Radix UI**: `@radix-ui/primitive` içinde `composeEventHandlers`:

```typescript
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}
```

**Kullanım:**

```typescript
onClick={composeEventHandlers(props.onClick, () => context.onOpenChange(true))}
```

**Önemli Özellik**: `event.defaultPrevented` kontrol eder - kullanıcı `preventDefault()` çağırırsa internal handler çalışmaz.

### Önerilen Implementation

```typescript
// packages/spar/src/utils/composeEventHandlers.ts

/**
 * Composes multiple event handlers into a single handler.
 * Respects defaultPrevented - if external handler calls preventDefault(),
 * internal handler will be skipped (unless checkForDefaultPrevented is false).
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  externalHandler?: (event: E) => void,
  internalHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
): (event: E) => void {
  return (event: E) => {
    externalHandler?.(event);
    if (!checkForDefaultPrevented || !event.defaultPrevented) {
      internalHandler?.(event);
    }
  };
}
```

### Kullanım Örneği

**Önce:**

```typescript
const handleClick = useCallback(
  (event: React.MouseEvent) => {
    if (disabled) return;
    toggle();
    onClick?.(event);
  },
  [disabled, toggle, onClick],
);

return <button onClick={handleClick} />;
```

**Sonra:**

```typescript
return (
  <button
    onClick={composeEventHandlers(onClick, () => {
      if (!disabled) toggle();
    })}
  />
);
```

### Öneri

✅ **Kesinlikle Oluşturulmalı**

**Faydalar:**

- Boilerplate azaltımı (20+ component etkilenir)
- Kullanıcıların `preventDefault()` ile internal behavior'ı engelleyebilmesi
- Major library'ler ile standart pattern
- Daha öngörülebilir event flow

---

## Özet ve Öncelik Sıralaması

| #   | Madde                   | Öncelik    | Etki                    | Zorluk |
| --- | ----------------------- | ---------- | ----------------------- | ------ |
| 1   | `composeEventHandlers`  | **Yüksek** | 20+ component           | Düşük  |
| 2   | `useFloatingPosition`   | **Yüksek** | 4 component, ~200 satır | Orta   |
| 3   | Compound Export Pattern | **Orta**   | ~10 component           | Orta   |

### Önerilen Uygulama Sırası

1. **İlk**: `composeEventHandlers` - Hızlı kazanım, geniş etki, düşük risk
2. **İkinci**: `useFloatingPosition` - En büyük kod azaltımı
3. **Üçüncü**: Compound Export Pattern - DX iyileştirmesi, dikkatli migration gerekir

---

## Sonuç

Bu 3 iyileştirme:

- Global headless kütüphaneleri (Radix UI, Ariakit) ile uyumlu
- Kod tekrarını önemli ölçüde azaltır
- Developer experience'ı iyileştirir
- Breaking change **değil** - internal implementation değişiklikleri
