import fs from 'fs';
import path from 'path';
import { logger } from './logger.js';

export interface ComponentDoc {
  name: string;
  description: string;
  content: string;
}

export function isComponentDoc(name: string): boolean {
  return /^[A-Z]/.test(name);
}

export function loadDocFromFile(filePath: string): ComponentDoc {
  const content = fs.readFileSync(filePath, 'utf-8');
  const name = path.basename(filePath, '.md');
  const descMatch = content.match(/^description:\s*(.+)$/m);
  const description = descMatch?.[1] ?? '';
  return { name, description, content };
}

export function extractCodeBlocks(content: string): string[] {
  const blocks: string[] = [];
  const regex = /```(?:tsx?|jsx?|javascript)\s*\n([\s\S]*?)```/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const code = m[1]?.trim();
    if (code) blocks.push(code);
  }
  return blocks;
}

export function loadDocs(docsDir: string): Map<string, ComponentDoc> {
  const docs = new Map<string, ComponentDoc>();

  if (!fs.existsSync(docsDir)) {
    logger.warn(`Docs directory not found: ${docsDir}`);
    return docs;
  }

  const componentsDir = path.join(docsDir, 'components');
  if (fs.existsSync(componentsDir)) {
    const componentFiles = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.md'));
    for (const file of componentFiles) {
      const doc = loadDocFromFile(path.join(componentsDir, file));
      docs.set(doc.name.toLowerCase(), doc);
    }
  }

  const rootFiles = fs.readdirSync(docsDir).filter((f) => {
    const fullPath = path.join(docsDir, f);
    return f.endsWith('.md') && fs.statSync(fullPath).isFile();
  });
  for (const file of rootFiles) {
    const doc = loadDocFromFile(path.join(docsDir, file));
    docs.set(doc.name.toLowerCase(), doc);
  }

  return docs;
}
