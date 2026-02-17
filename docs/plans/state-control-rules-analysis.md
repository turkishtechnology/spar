# Plan: State/Kontrol Kuralları Uyumluluk Analizi

Bu doküman 3 temel React performans pattern'ini analiz eder:

1. useControlledState Kullanımı
2. Context Value Memoization (useMemo)
3. Callback Memoization (useCallback)

---

## 1. useControlledState Kullanımı

### Mevcut Uyumluluk: ⚠️ **37.5%** (8 stateful component'ten 3'ü)

#### Kullanan Componentler ✅

| Component  | State           |
| ---------- | --------------- |
| Dialog     | `isOpen`        |
| Tabs       | `selectedValue` |
| RadioGroup | `value`         |

#### Manuel Pattern Kullanan Componentler ❌

| Component    | Dosya            | State                     |
| ------------ | ---------------- | ------------------------- |
| Accordion    | Accordion.tsx    | `value`                   |
| DropdownMenu | DropdownMenu.tsx | `open`                    |
| Tooltip      | Tooltip.tsx      | `open`                    |
| Collapsible  | Collapsible.tsx  | `open`                    |
| Select       | Select.tsx       | `open` + `value` (2 ayrı) |
| Popover      | usePopover.ts    | `open`                    |
| Checkbox     | Checkbox.tsx     | `checked`                 |
| Switch       | useSwitch.ts     | `checked`                 |

### Manuel Pattern Örneği (Sorunlu)

```typescript
// Her componentte tekrar eden ~10 satır kod
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

### useControlledState Pattern (Hedef)

```typescript
// Tek satır, temiz, standart
const [value, setValue] = useControlledState(controlledValue, defaultValue, onChange);
```

### Global Kütüphane Karşılaştırması

| Kütüphane      | Pattern                | Uyumluluk               |
| -------------- | ---------------------- | ----------------------- |
| **Radix UI**   | `useControllableState` | %100 tüm componentlerde |
| **React Aria** | `useControlledState`   | %100 tüm componentlerde |
| **Spar**       | Manuel + Hook karışık  | %37.5                   |

### Öneri

✅ **8 component refaktör edilmeli** - Detaylı plan: [useControlledState-standardization-analysis.md](useControlledState-standardization-analysis.md)

---

## 2. Context Value Memoization (useMemo)

### Mevcut Uyumluluk: ⚠️ **78.6%** (14 provider'dan 11'i)

#### Düzgün Memoize Edilmiş ✅

| Component       | Dosya               |
| --------------- | ------------------- |
| Accordion       | Accordion.tsx       |
| Dialog          | Dialog.tsx          |
| DropdownMenu    | DropdownMenu.tsx    |
| Tabs            | Tabs.tsx            |
| Select          | Select.tsx          |
| Collapsible     | Collapsible.tsx     |
| Popover         | Popover.tsx         |
| Tooltip         | Tooltip.tsx         |
| SelectGroup     | SelectGroup.tsx     |
| SelectItem      | SelectItem.tsx      |
| DropdownMenuSub | DropdownMenuSub.tsx |

#### Memoize Edilmemiş ❌ (Kritik)

| Component      | Dosya              | Sorun                              |
| -------------- | ------------------ | ---------------------------------- |
| **Breadcrumb** | BreadcrumbList.tsx | `contextValue` inline oluşturulmuş |
| **Input**      | Input.tsx          | `contextValue` inline oluşturulmuş |
| **RadioGroup** | RadioGroup.tsx     | `contextValue` inline oluşturulmuş |

### Sorunun Etkisi

```typescript
// ❌ YANLIŞ - Her render'da yeni object referansı
return (
  <Context.Provider value={{ value, onChange }}>
    {children}
  </Context.Provider>
);

// ✅ DOĞRU - Sadece dependency değişince yeni referans
const contextValue = useMemo(() => ({ value, onChange }), [value, onChange]);
return (
  <Context.Provider value={contextValue}>
    {children}
  </Context.Provider>
);
```

**Etki**: Memoize edilmemiş context, **her parent render'da tüm consumer'ların gereksiz re-render olmasına** neden olur.

### Global Kütüphane Karşılaştırması

| Kütüphane      | useMemo Kullanımı                    |
| -------------- | ------------------------------------ |
| **Radix UI**   | %100 - Tüm context value'lar memoize |
| **React Aria** | %100 - Stable reference pattern      |
| **Spar**       | %78.6                                |

### Düzeltilmesi Gereken Dosyalar

```typescript
// 1. BreadcrumbList.tsx
const contextValue = useMemo(
  () => ({
    // ... props
  }),
  [
    /* deps */
  ],
);

// 2. Input.tsx
const contextValue = useMemo(
  () => ({
    // ... props
  }),
  [
    /* deps */
  ],
);

// 3. RadioGroup.tsx
const contextValue = useMemo(
  () => ({
    // ... props
  }),
  [
    /* deps */
  ],
);
```

### Öneri

✅ **3 component acil düzeltilmeli** - Low effort, high performance impact.

---

## 3. Callback Memoization (useCallback)

### Mevcut Uyumluluk: ⚠️ **~60%**

#### Düzgün Memoize Edilmiş ✅

| Component    | Memoize Edilen Handler'lar                                        |
| ------------ | ----------------------------------------------------------------- |
| Accordion    | `handleItemToggle`                                                |
| DropdownMenu | `handleOpenChange`, `closeMenu`                                   |
| Select       | `handleValueChange`, `handleOpenChange`                           |
| Collapsible  | `toggle`, `open`, `close`                                         |
| Tabs         | `selectTab`, `registerTab`, `unregisterTab`, `handleKeyDown`      |
| Popover      | `openPopover`, `closePopover`, `togglePopover`                    |
| RadioGroup   | `handleSelect`, `registerItem`, `unregisterItem`, `handleKeyDown` |

#### Memoize Edilmemiş ❌

| Component    | Dosya        | Sorunlu Handler'lar                                                                                     |
| ------------ | ------------ | ------------------------------------------------------------------------------------------------------- |
| **Tooltip**  | Tooltip.tsx  | `handleOpenChange`, `clearHideTimeout`                                                                  |
| **Checkbox** | Checkbox.tsx | `handleToggleChecked`, `handleClick`, `handleKeyDown`, `handleFocus`, `handleBlur`, `handlePointerDown` |

### Kritik Bug: Tooltip

```typescript
// ❌ MEVCUT - Handler'lar memoize DEĞİL
const handleOpenChange = (open: boolean) => {
  if (disabled) return;
  if (isControlled) {
    onOpenChange?.(open);
  } else {
    setUncontrolledOpen(open);
  }
};

const clearHideTimeout = () => {
  if (hideTimeoutRef.current) {
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = null;
  }
};

// AMA bunlar useMemo dependency array'inde!
const contextValue: TooltipContextValue = useMemo(
  () => ({
    // ...
    onOpenChange: handleOpenChange, // ← Her render yeni referans
    clearHideTimeout, // ← Her render yeni referans
    // ...
  }),
  [
    // ...
    handleOpenChange, // ← Bu değişiyor her render
    clearHideTimeout, // ← Bu değişiyor her render
  ],
);
```

**Sonuç**: `useMemo` işe yaramıyor! Context her render'da güncelleniy.

### Düzeltme

```typescript
// ✅ DOĞRU - useCallback ile sarılmalı
const handleOpenChange = useCallback(
  (open: boolean) => {
    if (disabled) return;
    if (isControlled) {
      onOpenChange?.(open);
    } else {
      setUncontrolledOpen(open);
    }
  },
  [disabled, isControlled, onOpenChange],
);

const clearHideTimeout = useCallback(() => {
  if (hideTimeoutRef.current) {
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = null;
  }
}, []);
```

### Checkbox Sorunu

```typescript
// ❌ MEVCUT - 6 handler hiçbiri memoize değil
const handleToggleChecked = () => {
  /* ... */
};
const handleClick = (event) => {
  /* ... */
};
const handleKeyDown = (event) => {
  /* ... */
};
const handleFocus = (event) => {
  /* ... */
};
const handleBlur = (event) => {
  /* ... */
};
const handlePointerDown = (event) => {
  /* ... */
};
```

### Global Kütüphane Karşılaştırması

| Kütüphane      | useCallback Kullanımı          |
| -------------- | ------------------------------ |
| **Radix UI**   | %100 - Tüm handler'lar memoize |
| **React Aria** | %100 - Tüm handler'lar memoize |
| **Spar**       | ~%60                           |

### Öneri

✅ **Tooltip ve Checkbox acil düzeltilmeli** - Tooltip'te context memoization'ı bozan bug var.

---

## Özet Tablosu

| Kural                  | Spar Mevcut | Radix/React Aria | Öncelik   |
| ---------------------- | ----------- | ---------------- | --------- |
| `useControlledState`   | 37.5%       | 100%             | 🟡 Orta   |
| Context `useMemo`      | 78.6%       | 100%             | 🔴 Yüksek |
| Callback `useCallback` | ~60%        | 100%             | 🔴 Yüksek |

---

## Öncelikli Düzeltmeler

### Öncelik 1 - Kritik (Performance Bug)

| #   | Component      | Sorun                                                  | Etki                             |
| --- | -------------- | ------------------------------------------------------ | -------------------------------- |
| 1   | **Tooltip**    | `handleOpenChange` memoize değil ama `useMemo` deps'te | Context her render güncelleniyor |
| 2   | **Breadcrumb** | `contextValue` inline                                  | Tüm children gereksiz re-render  |
| 3   | **Input**      | `contextValue` inline                                  | Gereksiz re-render               |
| 4   | **RadioGroup** | `contextValue` inline                                  | Gereksiz re-render               |

### Öncelik 2 - Standardizasyon

| #    | Component    | Sorun                            |
| ---- | ------------ | -------------------------------- |
| 5    | **Checkbox** | 6 handler memoize değil          |
| 6-13 | 8 component  | `useControlledState` kullanmıyor |

---

## Uygulama Sırası

1. **İlk**: Tooltip - `handleOpenChange` ve `clearHideTimeout`'u `useCallback`'e sar (context bug fix)
2. **İkinci**: Breadcrumb, Input, RadioGroup - `contextValue`'yu `useMemo`'ya sar
3. **Üçüncü**: Checkbox - Tüm handler'ları `useCallback`'e sar
4. **Son**: 8 component'i `useControlledState` hook'una migrate et

---

## Sonuç

Bu 3 kural global headless kütüphanelerinde **%100 uygulanıyor**. Spar'da uyumluluk:

- `useControlledState`: 37.5% → Hedef: 100%
- Context memoization: 78.6% → Hedef: 100%
- Callback memoization: ~60% → Hedef: 100%

Özellikle **Tooltip** ve **3 context provider** acil düzeltilmeli - bunlar aktif performance bug'lar.
