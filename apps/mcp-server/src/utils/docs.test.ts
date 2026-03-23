import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  isComponentDoc,
  loadDocFromFile,
  extractCodeBlocks,
  loadDocs,
  extractSection,
  DOC_SECTIONS,
} from './docs.js';

describe('isComponentDoc', () => {
  it('returns true for names starting with uppercase', () => {
    expect(isComponentDoc('Button')).toBe(true);
    expect(isComponentDoc('Dialog')).toBe(true);
    expect(isComponentDoc('Accordion')).toBe(true);
  });

  it('returns false for names starting with lowercase', () => {
    expect(isComponentDoc('button')).toBe(false);
    expect(isComponentDoc('introduction')).toBe(false);
    expect(isComponentDoc('installation')).toBe(false);
  });
});

describe('loadDocFromFile', () => {
  it('loads doc with description from file', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-test-'));
    const filePath = path.join(tmpDir, 'Button.md');
    const content = `description: A clickable button component

# Button

Some content here.
\`\`\`tsx
<Button>Click me</Button>
\`\`\`
`;
    fs.writeFileSync(filePath, content, 'utf-8');

    const doc = loadDocFromFile(filePath);
    expect(doc.name).toBe('Button');
    expect(doc.description).toBe('A clickable button component');
    expect(doc.content).toContain('# Button');
    expect(doc.content).toContain('Some content here.');

    fs.rmSync(tmpDir, { recursive: true });
  });

  it('handles missing description', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-test-'));
    const filePath = path.join(tmpDir, 'Test.md');
    fs.writeFileSync(filePath, '# Test\n\nNo description line.', 'utf-8');

    const doc = loadDocFromFile(filePath);
    expect(doc.name).toBe('Test');
    expect(doc.description).toBe('');
    expect(doc.content).toContain('# Test');

    fs.rmSync(tmpDir, { recursive: true });
  });
});

describe('extractCodeBlocks', () => {
  it('extracts tsx code blocks', () => {
    const content = `
Some text
\`\`\`tsx
const x = 1;
\`\`\`
More text
\`\`\`tsx
<Button>Click</Button>
\`\`\`
`;
    const blocks = extractCodeBlocks(content);
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toBe('const x = 1;');
    expect(blocks[1]).toBe('<Button>Click</Button>');
  });

  it('extracts jsx and javascript blocks', () => {
    const content = `
\`\`\`jsx
<Component />
\`\`\`
\`\`\`javascript
console.log('hi');
\`\`\`
`;
    const blocks = extractCodeBlocks(content);
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toBe('<Component />');
    expect(blocks[1]).toBe("console.log('hi');");
  });

  it('returns empty array when no code blocks', () => {
    const content = 'Just plain text, no code.';
    expect(extractCodeBlocks(content)).toEqual([]);
  });
});

describe('loadDocs', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'loadDocs-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('returns empty map when docs dir does not exist', () => {
    const docs = loadDocs(path.join(tmpDir, 'nonexistent'));
    expect(docs.size).toBe(0);
  });

  it('loads component docs from components subdir', () => {
    const componentsDir = path.join(tmpDir, 'components');
    fs.mkdirSync(componentsDir, { recursive: true });
    fs.writeFileSync(
      path.join(componentsDir, 'Button.md'),
      'description: Button component\n\n# Button\n\nContent.',
      'utf-8',
    );

    const docs = loadDocs(tmpDir);
    expect(docs.size).toBeGreaterThanOrEqual(1);
    expect(docs.has('button')).toBe(true);
    const doc = docs.get('button')!;
    expect(doc.name).toBe('Button');
    expect(doc.description).toBe('Button component');
  });

  it('loads root-level md files', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'introduction.md'),
      'description: Intro\n\n# Introduction\n\nWelcome.',
      'utf-8',
    );

    const docs = loadDocs(tmpDir);
    expect(docs.has('introduction')).toBe(true);
    expect(docs.get('introduction')!.name).toBe('introduction');
  });
});

describe('DOC_SECTIONS', () => {
  it('contains all expected section keys', () => {
    expect(DOC_SECTIONS).toEqual([
      'live-demo',
      'features',
      'import',
      'anatomy',
      'examples',
      'api',
      'keyboard',
    ]);
  });
});

describe('extractSection', () => {
  const sampleDoc = [
    '# Button',
    '',
    'Some intro text.',
    '',
    '## Live Demo',
    '',
    'Here is a live demo.',
    '',
    '## Features',
    '',
    '- Feature one',
    '- Feature two',
    '',
    '## Import',
    '',
    '```tsx',
    "import { Button } from '@spar/ui';",
    '```',
    '',
    '## Keyboard Interactions',
    '',
    '| Key | Action |',
    '| --- | ------ |',
    '| Enter | Activate |',
  ].join('\n');

  it('extracts a section between two headings (happy path)', () => {
    const result = extractSection(sampleDoc, 'features');
    expect(result).not.toBeNull();
    expect(result).toContain('## Features');
    expect(result).toContain('- Feature one');
    expect(result).toContain('- Feature two');
    // Should not bleed into the next section
    expect(result).not.toContain('## Import');
  });

  it('extracts the first section correctly', () => {
    const result = extractSection(sampleDoc, 'live-demo');
    expect(result).not.toBeNull();
    expect(result).toContain('## Live Demo');
    expect(result).toContain('Here is a live demo.');
    expect(result).not.toContain('## Features');
  });

  it('extracts the last section at EOF', () => {
    const result = extractSection(sampleDoc, 'keyboard');
    expect(result).not.toBeNull();
    expect(result).toContain('## Keyboard Interactions');
    expect(result).toContain('| Enter | Activate |');
  });

  it('returns null for a section that does not exist', () => {
    const result = extractSection(sampleDoc, 'anatomy');
    expect(result).toBeNull();
  });

  it('returns null for a missing section in empty content', () => {
    const result = extractSection('', 'features');
    expect(result).toBeNull();
  });

  it('returns trimmed content without leading/trailing whitespace', () => {
    const result = extractSection(sampleDoc, 'import');
    expect(result).not.toBeNull();
    expect(result).toBe(result!.trim());
  });

  it('handles a document with only one matching section', () => {
    const minimal = '## Features\n\n- Only feature';
    const result = extractSection(minimal, 'features');
    expect(result).not.toBeNull();
    expect(result).toContain('## Features');
    expect(result).toContain('- Only feature');
  });
});
