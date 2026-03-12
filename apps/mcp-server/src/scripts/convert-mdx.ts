import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { convertMdxToMd } from '../utils/mdx-converter.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const DOCS_SOURCE = path.resolve(PROJECT_ROOT, '../docs/docs');
const DOCS_OUTPUT = path.resolve(PROJECT_ROOT, 'docs');

function main() {
  if (!fs.existsSync(DOCS_OUTPUT)) {
    fs.mkdirSync(DOCS_OUTPUT, { recursive: true });
  }

  const COMPONENTS_OUTPUT = path.join(DOCS_OUTPUT, 'components');
  fs.mkdirSync(COMPONENTS_OUTPUT, { recursive: true });

  const componentsDir = path.join(DOCS_SOURCE, 'Components');

  if (!fs.existsSync(componentsDir)) {
    logger.error(`Source directory not found: ${componentsDir}`);
    process.exit(1);
  }

  const mdxFiles = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.mdx'));
  logger.info(`Converting ${mdxFiles.length} MDX files to MD...`);

  for (const file of mdxFiles) {
    const inputPath = path.join(componentsDir, file);
    const outputFile = file.replace('.mdx', '.md');
    const outputPath = path.join(COMPONENTS_OUTPUT, outputFile);

    const content = fs.readFileSync(inputPath, 'utf-8');
    const converted = convertMdxToMd(content);

    fs.writeFileSync(outputPath, converted, 'utf-8');
    logger.info(`  ✓ ${file} → components/${outputFile}`);

    const oldRootPath = path.join(DOCS_OUTPUT, outputFile);
    if (fs.existsSync(oldRootPath)) {
      fs.unlinkSync(oldRootPath);
    }
  }

  const EXCLUDED_ROOT_DOCS = ['overview'];

  const topLevelMdFiles = fs.readdirSync(DOCS_SOURCE).filter((f) => {
    if (!f.endsWith('.md')) return false;
    const baseName = path.basename(f, '.md');
    return !EXCLUDED_ROOT_DOCS.includes(baseName);
  });

  for (const file of topLevelMdFiles) {
    const inputPath = path.join(DOCS_SOURCE, file);
    const outputPath = path.join(DOCS_OUTPUT, file);

    const content = fs.readFileSync(inputPath, 'utf-8');
    fs.writeFileSync(outputPath, content, 'utf-8');
    logger.info(`  ✓ ${file} (copied)`);
  }

  const existingOverview = path.join(DOCS_OUTPUT, 'overview.md');
  if (fs.existsSync(existingOverview)) {
    fs.unlinkSync(existingOverview);
  }

  logger.info(
    `\nDone! ${mdxFiles.length + topLevelMdFiles.length} files written to ${DOCS_OUTPUT}`,
  );
}

main();
