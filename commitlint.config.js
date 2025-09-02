export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Yeni özellik
        'fix', // Bug düzeltmesi
        'docs', // Dokümantasyon değişikliği
        'style', // Kod formatı değişikliği (boşluk, virgül vs.)
        'refactor', // Ne bug fix ne de feature eklemeyen kod değişikliği
        'perf', // Performans iyileştirmesi
        'test', // Test ekleme veya mevcut testleri düzeltme
        'build', // Build sistemi veya external dependencies
        'ci', // CI konfigürasyon dosyaları ve scriptleri
        'chore', // Kaynak kodu etkilemeyen diğer değişiklikler
        'revert', // Önceki commit'i geri alma
        'wip', // Work in progress (geçici commit)
        'conflict',
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-empty': [0, 'never'], // Scope zorunlu değil
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-min-length': [2, 'always', 3],
    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
};
