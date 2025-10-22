# Component Review Instructions

Bu dosya `review-components.prompt.md` kullanılarak bileşen incelemesi yapılırken izlenecek işlem adımlarını tanımlar.

## 0. Referans Ta## 6. Tutarlılık Notu
- Terminoloji İngilizce başlık + Türkçe açıklama karması: Category tagleri İngilizce, açıklama Türkçe.
- Refactor önerileri mevcut dosya düzenine uyumlu olmalı; benzer component'lerdeki pattern'leri takip et.

## 7. Örnek Finding

**HIGH Priority:**
```
**[Accessibility]** TooltipTrigger Escape ile kapatma davranışı eksik.
- **Ref:** `accessibility-guidelines.instructions.md` - Mandatory Rules - Keyboard Support
```

**LOW Priority:**
```
**[Format]** Import sıralaması mevcut component pattern'i ile uyumsuz (React imports önce olmalı).
- **Ref:** Mevcut proje yapısı
```

Hazır olduğunda prompt çalıştırıldığında bu talimat setine göre değerlendirme üret. Dosya değişikliği yapma; sadece rapor. Kısmi veya STRICT mod kavramı yok; tüm kategoriler zorunlu.osyaları

Bileşen incelemesi sırasında aşağıdaki talimat dosyaları referans alınmalıdır:
- **Accessibility**: `.github/instructions/accessibility-guidelines.instructions.md`
- **Coding Standards**: `.github/instructions/coding-standards.instructions.md`
- **Testing**: `.github/instructions/testing-guidelines.instructions.md`
- **Documentation**: `.github/instructions/docs-guidelines.instructions.md`

Bu dosyalar, her kategori için detaylı kurallar ve best practice'leri içerir.

## 1. Hazırlık
- Kullanıcı doğal dilde ifade verebilir (örn. "Button için yap", "Accordion ve Tabs'i kontrol et").
- Metinden component adlarını ayıkla: PascalCase veya kelime listesi -> `packages/glide/src/components/<Name>` dizinine eşle.
- Eşleşmeyen adlar için raporda `missing component path` uyarısı üret.
- Her path için parça dosyalarını listele (`*Root.tsx`, `*Trigger.tsx`, vb.) ve `types.ts`, `index.ts`, `__tests__` klasör varlığını not al.
- **Mevcut Düzen Analizi**: İncelenecek her dosyanın mevcut formatını, naming pattern'lerini ve code style'ını not al.

## 2. İnceleme Akışı (Her Bileşen)
Sıralı kontrol uygula; her başlık için bulguları (finding) severity ile kaydet.

### A. Accessibility
**Referans**: `accessibility-guidelines.instructions.md`

- ARIA Authoring Practices Guide (APG) pattern uyumu
- Klavye desteklenen tuşlar: Tab, Shift+Tab, Enter, Space, Escape, Arrow keys (gerekiyorsa). Eksik olanları işaretle.
- aria-* ilişkileri: `aria-controls`, `aria-labelledby`, `aria-expanded`, `role` kullanımı doğru mu.
- Odak yönetimi: Programatik `focus()` veya roving tab index ihtiyacında context kullanımı.
- Live region veya announcement gerekliyse (örn. dynamic content) var mı/yok mu.
- WCAG 2.2 AA uyumu (contrast, focus indicators, screen reader support).

### B. Prop & Tip Kalitesi
**Referans**: `coding-standards.instructions.md` (TypeScript Standards, Props Interface Template)

- Public prop'lar `types.ts` içinde mi tanımlı.
- `any`, `unknown` gereksiz kullanımı var mı.
- Callback imzaları (ör. `onChange(value: T)`), generic veya discriminated union ihtiyacına göre uygun mu.
- Default prop değerleri headless davranışı bozuyor mu.
- ARIA attribute types `React.AriaAttributes` kullanımı.
- `children` props redundant declaration yok mu (HTMLAttributes'tan gelir).

### C. Composition
**Referans**: `coding-standards.instructions.md` (File Organization Standards, Module Exports)

- Her parça ayrı dosyada mı (Root, Trigger, Content, vs.).
- İç içe context yapısı minimal mi, fazlalık var mı.
- Dot notation export (index.ts) doğru mu (dual export pattern).
- Generic aliases (Root, Item, Trigger) kullanılmıyor mu (component-specific names gerekli).

### D. Headlesslık
**Referans**: `copilot-instructions.md` (Core Rules - Headless Only)

- Stil, className zorlaması, inline style pattern yok mu (yalnızca opsiyonel `className` pass-through serbest).
- A11y için gerekli attribute eklerken stil eklenmemeli.
- Zero styling opinions, CSS imports yok.

### E. State & Mantık Ayrımı
**Referans**: `coding-standards.instructions.md` (State Management, Component Architecture)

- Kontrolsüz + kontrollü kullanım seçeneği (örn. `value` + `defaultValue` + `onChange`).
- Cleanup: event listener / timeout / observer kaldırılıyor mu.
- Yan etki: render dışında global mutasyon yok.
- `useItemRegistry` kullanımı uygun mu (keyboard navigation gereken durumlarda).

### F. Export & Tree-shake
**Referans**: `coding-standards.instructions.md` (Module Exports)

- Named exports, side-effect (örn. top-level subscription) yok.
- `index.ts` sadece yeniden export içeriyor.
- Dual export pattern (compound + named exports).

### G. Test Kapsamı
**Referans**: `testing-guidelines.instructions.md`

- Dosyalar: `<Comp>.test.tsx`, `<Comp>.a11y.test.tsx`, `<Comp>.integration.test.tsx`.
- Temel senaryolar: render, prop değişimi, klavye etkileşimi, a11y attribute assertion.
- jest-axe testleri zero violations.
- Coverage %90+ (statements, branches, functions, lines).
- Pre-test linting (`pnpm lint`) ve type checking.

### H. Dokümantasyon
**Referans**: `docs-guidelines.instructions.md`

- Anatomy bölümü mevcut (her parça listelenmiş, AnatomyViewer kullanımı).
- Props tablosu (her public prop açıklanmış - her compound part için 3 tablo: Props, Events, ARIA).
- Usage örneği (en az bir controlled veya un-controlled varyant).
- LiveCode demo (single interactive example).
- Code Examples (progressive, headless, static markdown blocks).
- Erişilebilirlik notu (kritik rol/aria vurgusu).
- Global Keyboard Interactions tablosu.

### I. Performans
**Referans**: `coding-standards.instructions.md` (Performance Guidelines)

- Gereksiz context genişliği (aşırı büyük value objesi) var mı.
- Memoizasyon (`useCallback`, `useMemo`) gerçekten gerekli yerlerde mi.
- Re-render tetikleyen anon fonksiyonlar azaltılmış mı.
- Early returns conditional rendering için kullanılıyor mu.

### J. Kod Standartları
**Referans**: `coding-standards.instructions.md` (Naming Conventions, Code Style, Component Architecture)

- Fonksiyon boyutu: 50+ satır tek fonksiyon uyarı.
- Tek sorumluluk: karmaşık dallanmalar ayıklanmalı.
- Hata durumları (örn. invalid prop kombinasyonu) early return veya `console.warn` (opsiyonel) pattern.
- Arrow functions kullanımı.
- Event handler naming (`handle` prefix).
- Boolean props naming (`is/has/should/can` prefix).

### K. Düzen ve Format Tutarlılığı
**Referans**: Mevcut dosya yapısı ve proje standartları

- **Naming Pattern Uyumu**: Mevcut component'teki naming convention'a uygun olmalı (örn. `AccordionItem` varsa `AccordionNewPart` pattern'i kullan).
- **Import Sıralaması**: Mevcut dosyadaki import gruplamasına (React, external libs, internal) uygun olmalı.
- **Code Structure**: Benzer component'lerdeki dosya organizasyonu pattern'lerini takip et.
- **Comment Style**: Varsa mevcut JSDoc veya inline comment style'ına uyumlu olmalı.
- **Spacing ve Indentation**: Proje genelindeki prettier/eslint konfigürasyonuna uygun.
- **Export Pattern**: Aynı kategorideki diğer component'lerin export pattern'ini takip et (dual export varsa devam ettir).

## 3. Puanlama
Başlangıç skoru: 100 (tüm kategoriler her zaman dahildir).
- High: -8
- Medium: -4
- Low: -2
- Kritik eksik artifact (a11y test, root parça, types.ts): -10 ek.

**Önemli**: Düzen ve format tutarlılığı (K kategorisi) genellikle Low severity olarak değerlendirilir, ancak mevcut yapıyla ciddi çelişkiler varsa Medium olabilir.

Normalize işlemi yok; skor doğrudan 0-100 aralığında kalır.

## 4. Çıktı Formatı

**Format Kuralları:**
- Markdown formatında yaz (başlıklar, listeler, kod blokları, tablolar)
- Her bileşen için ayrı H2 başlığı (`## Component Review: ComponentName`)
- Kod dosyalarını backtick içinde göster (`file.tsx`)
- Severity işaretçileri: `[HIGH]`, `[MEDIUM]`, `[LOW]`
- Okunabilir boşluklar ve düzenli girinti
- Bold kullan önemli başlıklar için

### Component Review Bloğu

```markdown
## Component Review: **ComponentName**

**Status:** Needs Improvement | Compliant | Partial  
**Score:** <number>/100

---

### Findings

#### HIGH PRIORITY (count)
1. **[Category]** Açıklama.
   - **Ref:** `dosya.instructions.md` - Section

#### MEDIUM PRIORITY (count)
1. **[Category]** Açıklama.
   - **Ref:** `dosya.instructions.md` - Section

#### LOW PRIORITY (count)
1. **[Category]** Açıklama.
   - **Ref:** `dosya.instructions.md` - Section

---

### Missing Artifacts
- **Tests:** `Component.a11y.test.tsx`
- **Docs:** Missing section

---

### Action Plan

#### HIGH PRIORITY ACTIONS

**1. Action title**
- **File:** `path/to/file.tsx`
- **Rationale:** Neden gerekli
- **Reference:** `dosya.instructions.md`

#### MEDIUM PRIORITY ACTIONS

**2. Action title**
- **File:** `path/to/file.tsx`
- **Rationale:** Neden gerekli
- **Reference:** `dosya.instructions.md`

---
```

### Global Plan ve Next Actions

```markdown
## Global Refactoring Plan

### HIGH PRIORITY
**1. Action title**
- **Rationale:** Neden
- **Reference:** `dosya.instructions.md`

### MEDIUM PRIORITY
**2. Action title**
- **Rationale:** Neden
- **Reference:** `dosya.instructions.md`

---

## Next Actions (Top 5)

1. **[HIGH]** Action açıklaması
2. **[HIGH]** Action açıklaması
3. **[MEDIUM]** Action açıklaması
4. **[HIGH]** Action açıklaması
5. **[LOW]** Action açıklaması

---

### Summary Statistics

| Metric | Value |
|--------|-------|
| **Total Components Reviewed** | N |
| **Average Score** | N/100 |
| **High Priority Issues** | N |
| **Medium Priority Issues** | N |
| **Low Priority Issues** | N |
| **Missing Artifacts** | N |

---
```

## 5. Önceliklendirme Kriterleri
- High: Accessibility kırılımı, test eksikliği, public API hatası.
- Medium: Performans optimizasyonu, tip iyileştirmesi.
- Low: Kozmetik düzen, dosya yeniden sıralama.

## 6. Plan Üretim Kuralları
- Her High issue için en az bir net dosya + eylem.
- İlgisiz veya belirsiz öneri yok; her adım "değişiklik tek cümle" formatında.
- 10'dan fazla adım varsa en kritik ilk 10, kalanları "backlog" alt listesine taşı.

## 7. Sınırlamalar
- Stil ekleme, docs yazma veya test dosyası oluşturma bu aşamada yapılmaz; sadece plan.
- Kod örnekleri gerekiyorsa kısa diff ipucu şeklinde (örn. `+ onKeyDown => handleSpace(event)`), tam dosya içeriği değil.

## 8. Tutarlılık Notu
- Terminoloji İngilizce başlık + Türkçe açıklama karması: Category tagleri İngilizce, açıklama Türkçe.

## 9. Örnek Finding
`[Accessibility][High] TooltipTrigger Escape ile kapatma davranışı eksik.`

Hazır olduğunda prompt çalıştırıldığında bu talimat setine göre değerlendirme üret. Dosya değişikliği yapma; sadece rapor. Kısmi veya STRICT mod kavramı yok; tüm kategoriler zorunlu.
