/* global console */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const componentsDir = resolve(__dirname, '../src/components');
const distDir = resolve(__dirname, '../dist');

// ---------------------------------------------------------------------------
// 1) Prepend "use client" to main bundle files
// ---------------------------------------------------------------------------

const USE_CLIENT = '"use client";\n';
const bundleFiles = ['index.cjs', 'index.esm.js'];

for (const file of bundleFiles) {
  const filePath = resolve(distDir, file);
  const content = readFileSync(filePath, 'utf-8');

  if (!content.startsWith('"use client"')) {
    writeFileSync(filePath, USE_CLIENT + content);
    console.log(`Added "use client" directive to ${file}`);
  }
}

// ---------------------------------------------------------------------------
// 2) Generate per-component sub-path exports for RSC compatibility
//    Reads src/components/*/index.ts automatically — no static mapping needed.
// ---------------------------------------------------------------------------

function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function parseComponentIndex(filePath) {
  const content = readFileSync(filePath, 'utf-8');

  const compoundExports = {};
  const compoundRegex = /^(\w+)\.(\w+)\s*=\s*(\w+);/gm;
  let match;
  while ((match = compoundRegex.exec(content)) !== null) {
    const [, , shortName, fullName] = match;
    compoundExports[shortName] = fullName;
  }

  const hooks = [];
  const hookRegex = /^export\s*\{([^}]+)\}\s*from\s*'\.\/hooks'/gm;
  while ((match = hookRegex.exec(content)) !== null) {
    const names = match[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    hooks.push(...names);
  }

  if (Object.keys(compoundExports).length > 0) {
    return { exports: compoundExports, hooks };
  }

  const singleExports = [];
  const singleRegex = /^export\s*\{([^}]+)\}\s*from\s*'\.\/(?!hooks|types)/gm;
  while ((match = singleRegex.exec(content)) !== null) {
    const names = match[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    singleExports.push(...names);
  }

  const namedMap = {};
  for (const name of singleExports) {
    namedMap[name] = name;
  }

  return { exports: namedMap, hooks };
}

function buildExportClause(exports) {
  return Object.entries(exports)
    .map(([shortName, fullName]) =>
      shortName === fullName ? fullName : `${fullName} as ${shortName}`,
    )
    .join(', ');
}

function generateESM(exports, hooks) {
  const parts = [buildExportClause(exports)];
  if (hooks.length > 0) parts.push(hooks.join(', '));
  return `"use client";\nexport { ${parts.join(', ')} } from './index.esm.js';\n`;
}

function generateCJS(exports, hooks) {
  const allEntries = [...Object.entries(exports), ...hooks.map((h) => [h, h])];
  const assigns = allEntries
    .map(([shortName, fullName]) =>
      shortName === fullName
        ? `exports.${fullName} = _spar.${fullName};`
        : `exports.${shortName} = _spar.${fullName};`,
    )
    .join('\n');
  return `"use client";\nconst _spar = require('./index.cjs');\n${assigns}\n`;
}

function generateDTS(exports, hooks) {
  const parts = [buildExportClause(exports)];
  if (hooks.length > 0) parts.push(hooks.join(', '));
  return `export { ${parts.join(', ')} } from './index';\n`;
}

function discoverComponents() {
  const barrelPath = resolve(componentsDir, 'index.ts');
  const content = readFileSync(barrelPath, 'utf-8');

  const dirs = [];
  const dirRegex = /export\s*\*\s*from\s*'\.\/(\w+)'/g;
  let match;
  while ((match = dirRegex.exec(content)) !== null) {
    dirs.push(match[1]);
  }
  return dirs;
}

mkdirSync(distDir, { recursive: true });

const componentDirs = discoverComponents();
let generated = 0;

for (const dir of componentDirs) {
  const indexPath = resolve(componentsDir, dir, 'index.ts');
  if (!existsSync(indexPath)) continue;

  const { exports, hooks } = parseComponentIndex(indexPath);
  if (Object.keys(exports).length === 0) continue;

  const kebabName = toKebabCase(dir);
  writeFileSync(resolve(distDir, `${kebabName}.mjs`), generateESM(exports, hooks));
  writeFileSync(resolve(distDir, `${kebabName}.cjs`), generateCJS(exports, hooks));
  writeFileSync(resolve(distDir, `${kebabName}.d.ts`), generateDTS(exports, hooks));

  generated++;
}

console.log(`Generated sub-path exports for ${generated} components`);
