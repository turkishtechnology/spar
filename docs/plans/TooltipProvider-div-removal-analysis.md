# Plan: TooltipProvider div Sarmalayıcıyı Kaldır

**TL;DR**: TooltipProvider içindeki `<div data-tooltip-provider>` wrapper'ı headless standartlarına aykırı. Tüm popüler headless kütüphaneleri (Radix UI, Ariakit, React Aria) Provider'da DOM element render etmiyor. **Kaldırılması önerilir.**

---

## Mevcut Durum

```tsx
// TooltipProvider.tsx - Şu anki hali
return (
  <TooltipProviderContext.Provider value={contextValue}>
    <div data-tooltip-provider='' data-skip-delay={isOpenDelayed ? 'true' : 'false'}>
      {children}
    </div>
  </TooltipProviderContext.Provider>
);
```

---

## Global Headless Kütüphaneleri Karşılaştırması

| Kütüphane         | Provider DOM Element Ekler mi? |
| ----------------- | ------------------------------ |
| Radix UI          | ❌ Hayır                       |
| Ariakit           | ❌ Hayır                       |
| React Aria        | ❌ Hayır (Provider yok)        |
| **Spar (mevcut)** | ⚠️ **Evet - div ekliyor**      |

### Radix UI

```tsx
<Tooltip.Provider delayDuration={800}>{children}</Tooltip.Provider>
```

→ DOM'a ekstra element **eklemez**, sadece React Context Provider döner.

### Ariakit

```tsx
<TooltipProvider>{children}</TooltipProvider>
```

→ DOM'a ekstra element **eklemez**, sadece context sağlar.

### React Aria (Adobe)

→ TooltipProvider yok, `TooltipTrigger` direkt kullanılır. DOM'a ekstra wrapper **eklemez**.

---

## Sorunlar

1. **Headless standartlarına aykırı** - Hiçbir popüler headless kütüphanesi Provider'da DOM element render etmiyor
2. **`data-skip-delay` gereksiz** - Bu bilgi zaten context'te (`isOpenDelayed`) mevcut
3. **Layout sorunları** - Ekstra div flex/grid layout'ları bozabilir
4. **Zero styling opinion** - Headless = DOM'a minimum müdahale

---

## Önerim: Kaldır

**Hedeflenen kod:**

```tsx
// TooltipProvider.tsx - Olması gereken hali
return (
  <TooltipProviderContext.Provider value={contextValue}>{children}</TooltipProviderContext.Provider>
);
```

---

## Yapılması Gerekenler

1. `TooltipProvider.tsx` dosyasından div wrapper'ı kaldır
2. Testleri güncelle (eğer `[data-tooltip-provider]` selector kullanılıyorsa)
3. Dökümantasyonu kontrol et

---

## Risk Değerlendirmesi

| Risk               | Seviye | Açıklama                                                                       |
| ------------------ | ------ | ------------------------------------------------------------------------------ |
| Breaking Change    | Düşük  | Kullanıcılar `[data-tooltip-provider]` selector'ını CSS'te kullanıyor olabilir |
| Test Failures      | Orta   | Testlerde bu selector varsa güncellenmeli                                      |
| Layout Değişikliği | Düşük  | Pozitif etki - gereksiz div kalkacak                                           |

---

## Sonuç

Bu değişiklik yapılmalı. Headless kütüphane prensipleri ve global standartlarla uyumlu hale getirmek için div wrapper kaldırılmalı.
