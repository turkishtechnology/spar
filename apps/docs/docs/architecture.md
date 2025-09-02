---
sidebar_position: 2
---

# Proje Mimarisi

## 1. Amaç ve Genel Yaklaşım

Headless komponent kütüphanemiz, erişilebilirlik, performans, modülerlik ve sürdürülebilirlik odaklı olarak geliştirilecektir. Tüm mimari ve teknik kararlar, ekip içi iş birliğini ve dışa açık kullanılabilirliği artıracak şekilde alınmıştır.

Bu doküman, projenin genel mimarisini, teknik kararları, geliştirme süreçlerini ve best practice'leri kapsamlı bir şekilde açıklar.

---

## 2. Komponent Mimarisi: 3 Seviyeli Yaklaşım

- **Primitives (Headless UI):** Stil içermeyen, erişilebilir, tamamen kontrol edilebilir temel bileşenler.
- **Styled Components (UI Kit):**
  - Headless paketteki primitive'lerin stillendirilmiş, kullanıma hazır halleri.
  - Headless kapsamına girmeyen, doğrudan stillendirilmiş özel UI bileşenleri.
- **Domain/Feature Components:**
  - İş alanına özgü, birden fazla styled component veya primitive'i kompoze eden, stateful ve mantık barındıran kapsamlı bileşenler/bloklar.

**Sonuç:** Maksimum esneklik, net sorumluluk sınırları, kolay bakım ve test edilebilirlik.

---

## 3. Klasör Yapısı

### 3.1 Monorepo Root Yapısı

```
headless-2/
├── 📁 apps/                          # Uygulamalar
│   └── 📁 docs/                      # Docusaurus dokümantasyon sitesi
│       ├── 📁 docs/                  # Markdown dokümantasyon dosyaları
│       ├── 📁 src/                   # Docusaurus kaynak kodları
│       ├── 📁 static/                # Statik dosyalar
│       └── docusaurus.config.ts      # Docusaurus konfigürasyonu
├── 📁 packages/                      # Paketler
│   └── 📁 headless/                  # Ana headless UI kütüphanesi
│       ├── 📁 src/                   # Kaynak kodlar
│       │   ├── 📁 components/        # Komponentler
│       │   ├── 📁 hooks/             # Custom React hooks
│       │   ├── 📁 types/             # TypeScript tip tanımları
│       │   ├── 📁 utils/             # Yardımcı fonksiyonlar
│       │   ├── 📁 __tests__/         # Test setup ve utilities
│       │   └── index.ts              # Ana export dosyası
│       ├── 📁 dist/                  # Build çıktıları
│       └── 📁 scripts/               # Build ve utility scriptleri
├── 📁 .github/                       # GitHub Actions ve workflows
├── 📁 .husky/                        # Git hooks konfigürasyonu
├── 📁 .vscode/                       # VS Code workspace ayarları
├── 📄 package.json                   # Root package.json
├── 📄 turbo.json                     # Turborepo konfigürasyonu
├── 📄 pnpm-workspace.yaml            # Pnpm workspace tanımı
├── 📄 eslint.config.js               # ESLint konfigürasyonu
├── 📄 commitlint.config.js           # Commit mesaj kuralları
└── 📄 README.md                      # Proje dokümantasyonu
```

### 3.2 Headless Package Yapısı

```
packages/headless/
├── 📁 src/
│   ├── 📁 components/                # Komponentler
│   │   ├── 📁 Button/                # Button komponenti
│   │   │   ├── 📁 __tests__/         # Komponent testleri
│   │   │   │   ├── Button.test.tsx           # Unit testler
│   │   │   │   ├── Button.a11y.test.tsx      # Accessibility testler
│   │   │   │   └── Button.integration.test.tsx # Integration testler
│   │   │   ├── Button.tsx            # Komponent implementasyonu
│   │   │   └── Button.types.ts       # TypeScript tip tanımları
│   │   └── 📁 Input/                 # Input komponenti
│   │       ├── 📁 __tests__/         # Test dosyaları
│   │       ├── Input.tsx
│   │       └── Input.types.ts
│   ├── 📁 hooks/                     # Custom React hooks
│   ├── 📁 types/                     # Global tip tanımları
│   ├── 📁 utils/                     # Yardımcı fonksiyonlar
│   ├── 📁 __tests__/                 # Test setup
│   │   └── 📁 setup/
│   │       └── jest.setup.ts         # Jest global setup
│   └── index.ts                      # Ana export dosyası
├── 📁 dist/                          # Build çıktıları (ESM/CJS)
├── 📄 package.json                   # Package metadata
├── 📄 tsconfig.json                  # TypeScript konfigürasyonu
├── 📄 jest.config.js                 # Jest test konfigürasyonu
├── 📄 rspack.config.js               # Rspack build konfigürasyonu
└── 📄 .size-limit.json               # Bundle size limitleri
```

### 3.3 Docs App Yapısı

```
apps/docs/
├── 📁 docs/                          # Markdown dokümantasyon
│   ├── intro.md                      # Başlangıç rehberi
│   ├── testing.md                    # Test stratejisi
│   ├── architecture.md               # Proje mimarisi (bu dosya)
│   └── Button.mdx                    # Komponent dokümantasyonu
├── 📁 src/                           # Docusaurus kaynak kodları
│   ├── 📁 components/                # Custom React komponentleri
│   ├── 📁 css/                       # Stil dosyaları
│   └── 📁 pages/                     # Özel sayfalar
├── 📁 static/                        # Statik dosyalar
│   ├── 📁 img/                       # Görseller
│   └── favicon.ico
├── 📄 docusaurus.config.ts           # Docusaurus konfigürasyonu
├── 📄 sidebars.ts                    # Sidebar navigasyonu
└── 📄 tsconfig.json                  # TypeScript konfigürasyonu
```

### 3.4 Test Yapısı

```
📁 __tests__/
├── 📁 setup/                         # Test setup dosyaları
│   └── jest.setup.ts                 # Jest global setup
└── 📁 components/                    # Komponent testleri
    ├── 📁 Button/
    │   ├── Button.test.tsx           # Unit testler
    │   ├── Button.a11y.test.tsx      # Accessibility testler
    │   └── Button.integration.test.tsx # Integration testler
    └── 📁 Input/
        ├── Input.test.tsx
        ├── Input.a11y.test.tsx
        └── Input.integration.test.tsx
```

### 3.5 Naming Conventions

- **Dosya İsimleri:** PascalCase (komponentler), camelCase (utilities)
- **Klasör İsimleri:** camelCase (genel), PascalCase (komponentler)
- **Test Dosyaları:** `*.test.tsx`, `*.a11y.test.tsx`, `*.integration.test.tsx`
- **Tip Dosyaları:** `*.types.ts`
- **Index Dosyaları:** `index.ts` (barrel exports)

**Sonuç:** Tutarlı, öngörülebilir ve ölçeklenebilir klasör yapısı. Kolay navigasyon ve geliştirme deneyimi.

---

## 4. Monorepo ve Build Yönetimi

- **Turborepo:** Build işlemlerini orchestrate eder (incremental build, caching, task dependency graph).
- **Pnpm Workspaces:** Bağımlılıkları yönetir (hard link ile node_modules paylaşımı, tek komutla install, versiyon uyumsuzluklarını minimize etme).
- Her paketin kendi `package.json` ve build scriptleri olur.

**Sonuç:** Hızlı pipeline, sürdürülebilir bağ yönetimi, tek kaynaktan yönetim ve zaman tasarrufu.

---

## 5. Kod Kalitesi ve Otomasyon Araçları

- **Commitlint:** Commit mesajlarının Conventional Commits standardına uygunluğunu otomatik olarak doğrular. Proje köküne commitlint konfigürasyonu eklenir ve CI/CD süreçlerinde commit mesajı doğrulaması zorunlu tutulur.
- **Husky:** Git hook'larını yönetir. Commit ve push öncesinde otomatik kontrollerin (lint, test, format) çalıştırılması için yapılandırılır.
- **Lint-staged:** Sadece staged dosyalar üzerinde lint ve format işlemlerinin çalıştırılmasını sağlar.
- **Prettier:** Kodun otomatik olarak biçimlendirilmesi için kullanılır.
- **ESLint:** Kodun belirlenen kurallara uygunluğunu denetler.
- Tüm bu araçlar merkezi bir konfigürasyon paketi (örn. `@tk/dev-configs`) ile yönetilir.

**Sonuç:** Kod kalitesi, yazım tutarlılığı ve otomasyon süreçleri güvence altına alınır. Hızlı, güvenli ve sürdürülebilir geliştirme ortamı sağlanır.

---

## 6. Sürümleme ve Değişiklik Yönetimi

- **Semantic Versioning (SemVer):** `MAJOR.MINOR.PATCH` formatı kullanılır. (Bkz: https://semver.org/)
- **Changelog:** Proje kökünde `CHANGELOG.md` tutulur. Kategoriler: Added, Changed, Deprecated, Removed, Fixed, Security. Her sürümde yapılan değişiklikler bu dosyada manuel güncellenir. (Bkz: https://keepachangelog.com/en/1.1.0/)

**Sonuç:** Kullanıcılar değişiklikleri kolayca takip eder, sürüm geçişleri öngörülebilir olur.

---

## 7. Bundler Olarak Rspack Kullanımı

- **Rspack:** Rust tabanlı, Webpack'e benzer yapılandırma ile çok daha hızlı build süreleri sunar.
- ESM ve CJS formatlarında çıktı üretir, React/TypeScript/CSS Modules desteğiyle minimum ek yapılandırma gerektirir.

**Sonuç:** Build süreleri ciddi oranda kısalır, Webpack tecrübesi kolayca aktarılır, modern ve hızlı geliştirme ortamı sağlanır.

---

## 8. Test Stratejisi

- **Jest** ve **React Testing Library:** Birim ve entegrasyon testleri için.
- **Chromatic:** Görsel regresyon testi için (opsiyonel, maliyet nedeniyle varsayılan değil).
- Testler CI/CD süreçlerinde otomatik çalışır. Storybook örnekleri test senaryosu olarak da kullanılabilir.

**Sonuç:** Refactor süreçlerinde güven, otomatik testler, görsel hata ve uyumsuzlukların erken tespiti.

---

## 9. Playground ve Geliştirme Ortamı

- Componentlerin izole şekilde denenmesi ve hızlı iterasyon için bağımsız bir "playground" uygulaması (Vite veya Next.js tabanlı).
- Playground sadece development ortamında çalışır, build/deploy pipeline'larında dışlanır.

**Sonuç:** Developer experience iyileşir, görsel hata ve uyumsuzluklar erken fark edilir.

---

## 10. Dokümantasyon Entegrasyonu

- **Docusaurus:** Sistem mimarisi, katkı rehberi, theming ve token yönetimi.
- Ortak `apps/docs/docs/` klasöründe markdown dosyaları tutulur, iki platform da bu dosyaları okur.
- CI/CD sürecine GitHub Actions ile build ve deploy otomasyonu eklenir.
