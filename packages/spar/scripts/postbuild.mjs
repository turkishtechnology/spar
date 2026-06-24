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
// 2) Generate per-component sub-path entrypoints with their own "use client"
//    directives. Reads src/components/*/index.ts automatically.
// ---------------------------------------------------------------------------

function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function parseComponentIndex(filePath) {
  const content = readFileSync(filePath, 'utf-8');

  const typeExports = [];
  const typeRegex = /^export\s+type\s*\{([^}]+)\}\s*from\s*'\.\/types';/gm;
  let typeMatch;
  while ((typeMatch = typeRegex.exec(content)) !== null) {
    const names = typeMatch[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    typeExports.push(...names);
  }

  const compoundExports = {};
  const compoundParents = new Set();
  const compoundRegex = /^(\w+)\.(\w+)\s*=\s*(\w+);/gm;
  let match;
  while ((match = compoundRegex.exec(content)) !== null) {
    const [, parentName, shortName, fullName] = match;
    compoundExports[shortName] = fullName;
    compoundParents.add(parentName);
  }
  for (const parent of compoundParents) {
    compoundExports[parent] = parent;
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
    return { exports: compoundExports, hooks, typeExports };
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

  // Also capture local re-export lists that carry no module specifier, e.g.
  //   export { Toaster, Toast, ToastRoot };
  // Components like Toast expose a plain-object namespace (rather than the
  // callable `Ns.Part = X` pattern that hits the compound branch above), so
  // their public names land here. Each name is re-exported from the package
  // barrel via `export *`, so it belongs in the sub-path entry too.
  const localRegex = /^export\s*\{([^}]+)\}\s*;/gm;
  while ((match = localRegex.exec(content)) !== null) {
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

  return { exports: namedMap, hooks, typeExports };
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

function generateDTS(exports, hooks, typeExports) {
  const parts = [buildExportClause(exports)];
  if (hooks.length > 0) parts.push(hooks.join(', '));
  const typeClause =
    typeExports.length > 0 ? `export type { ${typeExports.join(', ')} } from './index';\n` : '';
  return `export { ${parts.join(', ')} } from './index';\n${typeClause}`;
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

  const { exports, hooks, typeExports } = parseComponentIndex(indexPath);
  if (Object.keys(exports).length === 0) continue;

  const kebabName = toKebabCase(dir);
  writeFileSync(resolve(distDir, `${kebabName}.mjs`), generateESM(exports, hooks));
  writeFileSync(resolve(distDir, `${kebabName}.cjs`), generateCJS(exports, hooks));
  writeFileSync(resolve(distDir, `${kebabName}.d.ts`), generateDTS(exports, hooks, typeExports));

  generated++;
}

console.log(`Generated sub-path exports for ${generated} components`);
