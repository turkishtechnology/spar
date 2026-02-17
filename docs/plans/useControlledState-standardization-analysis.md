# Plan: useControlledState Kullanımını Standartlaştır

**TL;DR**: Sadece 3 component değil, **8 component** `useControlledState` hook'unu kullanmıyor. Global headless kütüphaneleri (Radix UI, React Aria) tüm componentlerde bu pattern'i standart olarak kullanıyor. **Tüm componentlerde standartlaştırılmalı.**

---

## Mevcut Durum - Spar Componentleri

| Component        | useControlledState Kullanıyor mu? | Notlar                                      |
| ---------------- | --------------------------------- | ------------------------------------------- |
| **Dialog**       | ✅ Evet                           | -                                           |
| **Tabs**         | ✅ Evet                           | -                                           |
| **RadioGroup**   | ✅ Evet                           | -                                           |
| **Accordion**    | ❌ Hayır                          | Manuel `isControlled` + `useState`          |
| **DropdownMenu** | ❌ Hayır                          | Manuel `isControlled` + `useState`          |
| **Tooltip**      | ❌ Hayır                          | Manuel `isControlled` + `useState`          |
| **Collapsible**  | ❌ Hayır                          | Manuel `isControlled` + `useState`          |
| **Select**       | ❌ Hayır                          | 2 state: `open` + `value` - ikisi de manuel |
| **Popover**      | ❌ Hayır                          | `usePopover` hook içinde manuel             |
| **Checkbox**     | ❌ Hayır                          | Manuel `isControlled` + `useState`          |
| **Switch**       | ❌ Hayır                          | `useSwitch` hook içinde manuel              |

---

## Global Headless Kütüphaneleri Karşılaştırması

### Radix UI

`useControllableState` hook'u kullanıyor - **TÜM componentlerde standart**.

### React Aria (Adobe)

`useControlledState` hook'u var ve **tüm componentlerde** kullanılıyor.

### Ariakit

Store pattern kullanıyor ama controlled/uncontrolled mantığı **her yerde tutarlı**.

---

## Mevcut Hook İmplementasyonu

```typescript
// packages/spar/src/hooks/useControlledState.ts
export function useControlledState<T>(
  controlledValue: T | undefined,
  defaultValue: T | undefined,
  onChange: ((value: T) => void) | undefined,
): [T | undefined, (value: T) => void];
```

Hook zaten mevcut ve doğru çalışıyor. Sadece yaygınlaştırılması gerekiyor.

---

## Manuel Pattern vs useControlledState

### Manuel Pattern (Mevcut - Tutarsız)

```typescript
// Her componentte tekrar edilen kod
const isControlled = controlledValue !== undefined;
const [internalValue, setInternalValue] = useState(defaultValue);
const value = isControlled ? controlledValue : internalValue;

const handleChange = useCallback(
  (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  },
  [isControlled, onChange],
);
```

### useControlledState (Hedef - Tutarlı)

```typescript
// Tek satır, temiz, standart
const [value, setValue] = useControlledState(controlledValue, defaultValue, onChange);
```

---

## Orijinal Plan vs Gerçek Durum

| Orijinal Plan                                  | Gerçek Durum                      |
| ---------------------------------------------- | --------------------------------- |
| 3 component (Accordion, DropdownMenu, Tooltip) | **8 component** refaktör edilmeli |

---

## Refaktör Edilecek Componentler

### Öncelik 1 - Basit (Tek State)

1. **Accordion** - `value` state
2. **DropdownMenu** - `open` state
3. **Tooltip** - `open` state
4. **Collapsible** - `open` state
5. **Popover** - `open` state (usePopover içinde)
6. **Checkbox** - `checked` state
7. **Switch** - `checked` state (useSwitch içinde)

### Öncelik 2 - Kompleks (Çoklu State)

8. **Select** - `open` + `value` (2 ayrı useControlledState çağrısı)

---

## Örnek Refaktör

### Collapsible - Önce

```typescript
const [internalOpen, setInternalOpen] = useState(defaultOpen);
const isControlled = controlledOpen !== undefined;
const isOpen = isControlled ? controlledOpen : internalOpen;

const toggle = useCallback(() => {
  if (disabled) return;
  const nextOpen = !isOpen;
  if (!isControlled) {
    setInternalOpen(nextOpen);
  }
  onOpenChange?.(nextOpen);
}, [disabled, isOpen, isControlled, onOpenChange]);
```

### Collapsible - Sonra

```typescript
const [isOpen, setIsOpen] = useControlledState(controlledOpen, defaultOpen, onOpenChange);

const toggle = useCallback(() => {
  if (disabled) return;
  setIsOpen(!isOpen);
}, [disabled, isOpen, setIsOpen]);
```

---

## Faydalar

1. **Kod Tekrarı Azalır** - Her componentte 10+ satır yerine 1 satır
2. **Tutarlılık** - Tüm componentler aynı pattern'i kullanır
3. **Hata Riski Azalır** - Tek bir yerde test edilmiş mantık
4. **Global Standartlara Uyum** - Radix UI, React Aria ile aynı yaklaşım
5. **Bakım Kolaylığı** - Değişiklik gerekirse tek yerde yapılır

---

## Sonuç

Orijinal plandaki 3 component yerine **8 component** refaktör edilmeli. Bu değişiklik:

- Breaking change **değil**
- Public API **değişmez**
- Sadece internal implementation iyileştirilir
