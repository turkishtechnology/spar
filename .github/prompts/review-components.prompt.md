# Component Review Prompt

Amaç: Seçilen Glide headless bileşen(ler)inin geçmişte tanımlanmış tüm kurallara (accessibility, headlesslık, composition, tip güvenliği, test/dokümantasyon ayrımı vb.) tam uyumunu denetlemek ve eksikler için bir düzeltme planı üretmek. Kısmi inceleme yok; her zaman tüm başlıklar değerlendirilir.

## Referans Talimat Dosyaları

İnceleme sırasında **mutlaka** aşağıdaki talimat dosyalarını referans al:

1. **Ana Talimat**: `.github/copilot-instructions.md`
   - Core Rules (Headless Only, Accessibility First, TypeScript Strict, Tree-Shakeable)
   - Component Structure (Simple/Compound patterns)
   - Task-Specific Instructions referansları

2. **Accessibility**: `.github/instructions/accessibility-guidelines.instructions.md`
   - WCAG 2.2 AA compliance
   - ARIA Authoring Practices Guide (APG) patterns
   - Keyboard support patterns
   - Focus management
   - Screen reader support

3. **Coding Standards**: `.github/instructions/coding-standards.instructions.md`
   - TypeScript Standards
   - Component Props Pattern
   - File Organization (separate files rule)
   - Module Exports (dual export pattern)
   - State Management
   - ARIA Attributes Standards

4. **Testing**: `.github/instructions/testing-guidelines.instructions.md`
   - Coverage Requirements (90%)
   - Test Structure (3 files: unit, a11y, integration)
   - jest-axe mandatory zero violations
   - Pre-test linting requirements

5. **Documentation**: `.github/instructions/docs-guidelines.instructions.md`
   - Documentation Structure
   - LiveCode integration (single demo)
   - AnatomyViewer usage
   - Code Examples (progressive, headless)
   - API Reference Tables (Props, Events, ARIA for each compound part)
   - Global Keyboard Interactions table

## Girdi Örnekleri

- "Button için inceleme yap"
- "Accordion ve Tabs komponentlerini değerlendir"
- "Tooltip'i erişilebilirlik ve test açısından kontrol et" (not: yine tüm başlıklar raporlanır)
- "DropdownMenu, Popover ve Tooltip'i karşılaştır" (aynı raporda ayrı bloklar)
- "Switch ve Checkbox'ta a11y sorunlarını bul" (tüm kategoriler yine değerlendirilir)

İçerikten component adlarını/klasörlerini çıkar ve ilgili dizinleri `packages/glide/src/components/<Name>` varsay.

## Değerlendirme Başlıkları

Her başlık için ilgili talimat dosyasına referans ver ve detaylı kuralları oradan al:

### 1. Accessibility
**Referans**: `accessibility-guidelines.instructions.md`
- ARIA Authoring Practices Guide (APG) pattern uyumu
- Mandatory keyboard support (Tab, Shift+Tab, Enter, Space, Escape, Arrows, Home/End)
- ARIA attributes (role, aria-label, aria-labelledby, aria-expanded, aria-controls, vb.)
- Focus management (visible indicators, trap, restore)
- Screen reader announcements (aria-live regions)
- WCAG 2.2 AA compliance (contrast ratios, perceivable, operable, understandable, robust)

### 2. Prop Kalitesi & Tip Güvenliği
**Referans**: `coding-standards.instructions.md` (TypeScript Standards, Component Props Pattern)
- Explicit types in `types.ts`
- No `any` usage (strict mode)
- `React.AriaAttributes` for ARIA props
- Discriminated unions for complex states
- No redundant `children` declaration (inherited from HTMLAttributes)
- Proper generic usage
- Callback signatures consistency

### 3. Composition Yapısı
**Referans**: `coding-standards.instructions.md` (File Organization Standards)
- **File Separation Rule**: Her logical component ayrı dosyada
- Tek dosyada çoklu component tanımı yok
- Simple vs Compound component patterns
- Context yapısı minimal (gereksiz nesting yok)

### 4. Headlesslık
**Referans**: `copilot-instructions.md` (Core Rules - Headless Only)
- Zero styling opinions
- No CSS imports
- No className forcing
- No inline style patterns (sadece optional className pass-through)
- Behavior-only props

### 5. State & Mantık Ayrımı
**Referans**: `coding-standards.instructions.md` (State Management, Component Architecture)
- Controlled + Uncontrolled support (`value` + `defaultValue` + `onChange`)
- Proper cleanup (event listeners, timeouts, observers)
- No global mutations in render
- `useItemRegistry` usage (keyboard navigation için)
- RefObject<T> kullanımı (MutableRefObject değil)

### 6. Export & Tree-shake
**Referans**: `coding-standards.instructions.md` (Module Exports)
- Named exports only
- No side effects (no top-level subscriptions)
- `index.ts` sadece re-export
- **Dual export pattern** (compound + named exports)
- No generic aliases (Root, Item, Trigger) - component-specific names

### 7. Test Kapsamı
**Referans**: `testing-guidelines.instructions.md`
- 3 test files: `Component.test.tsx`, `Component.a11y.test.tsx`, `Component.integration.test.tsx`
- Coverage %90+ (statements, branches, functions, lines)
- jest-axe mandatory (zero violations)
- Pre-test linting (`pnpm lint`) ve type checking
- User behavior testing (not implementation)

### 8. Dokümantasyon Uyum
**Referans**: `docs-guidelines.instructions.md`
- **LiveCode**: Single interactive demo (basic inline styles for visibility)
- **AnatomyViewer**: data-glide-part attributes, parts array with descriptions
- **API Reference**: Her compound part için 3 tablo (Props, Events, ARIA)
- **Code Examples**: Progressive, headless, static markdown blocks with line highlighting
- **Global Keyboard Interactions**: Complete keyboard behavior table
- Structure, Data Flow explanation

### 9. Performans
**Referans**: `coding-standards.instructions.md` (Performance Guidelines)
- Context değerleri granular (büyük value objesi yok)
- Gerekli yerlerde memoization (useCallback, useMemo)
- Anonymous function usage azaltılmış
- Early returns for conditional rendering

### 10. Kod Standartları
**Referans**: `coding-standards.instructions.md` (Naming Conventions, Code Style)
- Arrow functions kullanımı
- Event handler naming (`handle` prefix)
- Boolean props (`is/has/should/can` prefix)
- Function size (50+ lines warning)
- Single responsibility
- Error handling (early return, console.warn patterns)

### 11. Düzen ve Format Tutarlılığı
**Referans**: Mevcut dosya yapısı ve proje standartları
- **Naming Pattern Uyumu**: Mevcut component naming convention'ına uygun
- **Import Sıralaması**: Proje genelindeki gruplaşmaya uygun (React, external, internal)
- **Code Structure**: Benzer component'lerin organizasyon pattern'lerini takip
- **Comment Style**: Mevcut JSDoc veya inline comment style'ı ile tutarlı
- **Spacing ve Indentation**: Prettier/ESLint konfigürasyonuna uygun
- **Export Pattern**: Aynı kategorideki component'lerin export pattern'ini takip (dual export consistency)

Çıktı Yapısı:
```
REVIEW_SUMMARY:
  component: Accordion
  status: needs-improvement | compliant | partial
  score: 83/100
  findings:
    - [Accessibility][High] Trigger'da Enter + Space birlikte test edilmiyor.
    - [Types][Medium] onChange callback parametresi union yerine generic olabilir.
  missingArtifacts:
    - tests: Accordion.a11y.test.tsx
  plan:
    - step: Add keyboard handling for Space key in AccordionTrigger. (High)
      file: packages/glide/src/components/Accordion/AccordionTrigger.tsx
      rationale: WCAG klavye erişimi.
    - step: Create a11y test for Enter/Space toggling. (High)
      file: packages/glide/src/components/Accordion/__tests__/Accordion.a11y.test.tsx
    - step: Refactor onChange to use generic value type. (Medium)
```

## Puanlama Sistemi

Başlangıç skoru: 100 (tüm kategoriler her zaman dahildir)

**Severity Bazlı Düşüş:**
- **High**: -8 (Accessibility violations, test eksiklikleri, public API hataları)
- **Medium**: -4 (Performans optimizasyonları, tip iyileştirmeleri)
- **Low**: -2 (Kod düzeni, naming conventions)
- **Critical Missing Artifact**: -10 (a11y test dosyası, root component, types.ts)

**Örnekler:**
- Missing `Component.a11y.test.tsx`: -10 (Critical) + -8 (High - a11y compliance yok)
- Klavye navigation eksik: -8 (High)
- Type `any` kullanımı: -4 (Medium)
- Import sıralaması düzensiz: -2 (Low)

Normalize işlemi yok; skor doğrudan 0-100 aralığında kalır.

## Önceliklendirme Kriterleri

**High Priority:**
- Accessibility kırılımları (APG pattern violations)
- Test eksiklikleri (özellikle a11y tests)
- Public API hataları (type safety issues)
- Headless principle violations (styling opinions)

**Medium Priority:**
- Performans optimizasyonları
- Type iyileştirmeleri
- Documentation eksiklikleri
- Export pattern uyumsuzlukları

**Low Priority:**
- Kozmetik düzenlemeler
- Naming convention improvements
- File organization tweaks

## Çıktı Yapısı

**Format Kuralları:**
- Markdown formatında yaz (başlıklar, listeler, kod blokları)
- Her bileşen için ayrı H2 başlığı (`## Component Review: Accordion`)
- Kod dosyalarını backtick içinde göster (`file.tsx`)
- Severity işaretçileri: `[HIGH]`, `[MEDIUM]`, `[LOW]`
- Okunabilir boşluklar ve düzenli girinti
- Bold kullan önemli başlıklar için

### Her Component İçin Markdown Blok

```markdown
## Component Review: **Accordion**

**Status:** Needs Improvement  
**Score:** 83/100

---

### Findings

#### HIGH PRIORITY (2)

1. **[Accessibility]** Trigger'da Enter + Space birlikte test edilmiyor.
   - **Ref:** `accessibility-guidelines.instructions.md` - Keyboard Support

2. **[Documentation]** AnatomyViewer eksik, data-glide-part attributes yok.
   - **Ref:** `docs-guidelines.instructions.md` - AnatomyViewer Integration

#### MEDIUM PRIORITY (1)

1. **[Types]** onChange callback parametresi union yerine generic olabilir.
   - **Ref:** `coding-standards.instructions.md` - TypeScript Standards

---

### Missing Artifacts

- **Tests:** `Accordion.a11y.test.tsx`
- **Docs:** Global Keyboard Interactions table

---

### Action Plan

#### HIGH PRIORITY ACTIONS

**1. Add keyboard handling for Space key**
- **File:** `packages/glide/src/components/Accordion/AccordionTrigger.tsx`
- **Rationale:** WCAG klavye erişimi gereksinimi
- **Reference:** `accessibility-guidelines.instructions.md`

**2. Create a11y test for Enter/Space toggling**
- **File:** `packages/glide/src/components/Accordion/__tests__/Accordion.a11y.test.tsx`
- **Rationale:** jest-axe mandatory testing
- **Reference:** `testing-guidelines.instructions.md`

**3. Add AnatomyViewer with data-glide-part attributes**
- **File:** `apps/docs/docs/Components/Accordion.mdx`
- **Rationale:** Required documentation structure
- **Reference:** `docs-guidelines.instructions.md`

#### MEDIUM PRIORITY ACTIONS

**4. Refactor onChange to use generic value type**
- **File:** `packages/glide/src/components/Accordion/types.ts`
- **Rationale:** Type safety improvement
- **Reference:** `coding-standards.instructions.md` - TypeScript Standards

---
```

### Global Plan (Componentler Arası)

```markdown
## Global Refactoring Plan

### MEDIUM PRIORITY

**1. Consolidate shared aria utilities**
- **Create:** `hooks/useAriaIds.ts`
- **Rationale:** DRY principle, code reusability
- **Reference:** `coding-standards.instructions.md`

### HIGH PRIORITY

**2. Introduce test helper for keyboard events**
- **Rationale:** Standardize keyboard testing
- **Reference:** `testing-guidelines.instructions.md`

**3. Update all docs to include Global Keyboard Interactions table**
- **Rationale:** Required documentation section
- **Reference:** `docs-guidelines.instructions.md`

---
```

### Next Actions Summary

```markdown
## Next Actions (Top 5)

1. **[HIGH]** Fix all High severity accessibility issues (APG compliance)
2. **[HIGH]** Create missing a11y test files (jest-axe mandatory)
3. **[MEDIUM]** Implement dual export pattern for all compound components
4. **[HIGH]** Add Global Keyboard Interactions to all documentation
5. **[LOW]** Run `pnpm lint` and fix all violations

---

### Summary Statistics

| Metric | Value |
|--------|-------|
| **Total Components Reviewed** | 1 |
| **Average Score** | 83/100 |
| **High Priority Issues** | 2 |
| **Medium Priority Issues** | 1 |
| **Low Priority Issues** | 0 |
| **Missing Artifacts** | 2 |

---
```

## Plan Üretim Kuralları

- Her High issue için en az bir net dosya + eylem
- İlgisiz veya belirsiz öneri yok
- Her adım "değişiklik tek cümle" formatında
- 10'dan fazla adım varsa en kritik ilk 10, kalanları "backlog" alt listesine
- **Her plan item'da ilgili talimat dosyasına referans ver**

## Sınırlamalar

- Stil ekleme, docs yazma veya test dosyası oluşturma bu aşamada yapılmaz; sadece plan
- Kod örnekleri gerekiyorsa kısa diff ipucu şeklinde (örn. `+ onKeyDown => handleSpace(event)`), tam dosya içeriği değil
- Tüm kategoriler zorunlu değerlendirilir (kısmi veya STRICT mod kavramı yok)

## İnceleme Süreci

1. **Talimat Dosyalarını Oku**: Önce ilgili `.github/instructions/*.instructions.md` dosyalarını oku
2. **Component Analizi**: `packages/glide/src/components/<Name>` içeriğini incele
3. **Mevcut Düzeni İncele**: İncelenecek dosyanın (component, test, docs) mevcut formatına ve düzenine bak
4. **Her Kategori İçin**: İlgili talimat dosyasındaki kurallara göre değerlendir
5. **Finding Format**: `[Category][Severity] Açıklama. (Ref: ilgili-dosya.instructions.md - section)`
6. **Plan Üret**: Her issue için actionable step + dosya + rationale (talimat referansıyla)
7. **Düzen Uyumu**: Refactor önerileri mevcut dosya düzenine uyumlu olmalı (naming patterns, structure, formatting)

## Örnek Finding Format

```
[Accessibility][High] TooltipTrigger Escape ile kapatma davranışı eksik. 
(Ref: accessibility-guidelines.instructions.md - Mandatory Rules - Keyboard Support)
```

**Notlar:**
- Category tagleri İngilizce, açıklama Türkçe
- Her finding mutlaka bir talimat dosyasına referans vermeli
- Mikro kozmetik iyileştirmeler (örn. import sıralaması) yalnızca anlamlı etki yaratmıyorsa raporlanmayabilir