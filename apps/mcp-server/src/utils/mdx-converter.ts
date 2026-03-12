interface LiveCodeBlock {
  start: number;
  end: number;
  code: string;
}

/**
 * Finds LiveCode JSX blocks while correctly handling backtick-delimited
 * template literals that may contain self-closing JSX tags (`/>`).
 */
function extractLiveCodeBlocks(content: string): LiveCodeBlock[] {
  const blocks: LiveCodeBlock[] = [];
  let searchFrom = 0;

  while (true) {
    const startIdx = content.indexOf('<LiveCode', searchFrom);
    if (startIdx === -1) break;

    let inBacktick = false;
    let pos = startIdx + '<LiveCode'.length;
    let endIdx = -1;

    while (pos < content.length - 1) {
      if (content[pos] === '`') {
        inBacktick = !inBacktick;
      } else if (!inBacktick && content[pos] === '/' && content[pos + 1] === '>') {
        endIdx = pos + 2;
        break;
      }
      pos++;
    }

    if (endIdx === -1) break;

    const block = content.substring(startIdx, endIdx);

    const codeMatch = block.match(/code=\{`([\s\S]*?)`\}/);
    blocks.push({
      start: startIdx,
      end: endIdx,
      code: codeMatch?.[1] ?? '',
    });

    searchFrom = endIdx;
  }

  return blocks;
}

function convertLiveCode(content: string): string {
  const blocks = extractLiveCodeBlocks(content);
  let result = content;

  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i]!;
    let replacement = '';

    if (block.code) {
      replacement += '```tsx\n' + block.code.trim() + '\n```\n';
    }

    result = result.substring(0, block.start) + replacement + result.substring(block.end);
  }

  return result;
}

function convertAnatomyViewer(content: string): string {
  return content.replace(/<AnatomyViewer[\s\S]*?<\/AnatomyViewer>/g, (match) => {
    const partRegex = /name:\s*'([^']*)'\s*,\s*label:\s*'([^']*)'\s*,\s*description:\s*'([^']*)'/g;
    const parts: Array<{ name: string; label: string; description: string }> = [];

    let m;
    while ((m = partRegex.exec(match)) !== null) {
      parts.push({ name: m[1]!, label: m[2]!, description: m[3]! });
    }

    if (parts.length === 0) return '';

    let table = '| Part | Description |\n| --- | --- |\n';
    for (const part of parts) {
      table += `| ${part.label} | ${part.description} |\n`;
    }

    return table;
  });
}

/**
 * Removes top-level JSX import statements while preserving
 * import lines that appear inside markdown fenced code blocks.
 */
function removeTopLevelImports(content: string): string {
  const lines = content.split('\n');
  const output: string[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
    }

    if (!inCodeBlock && /^import\s+/.test(line)) {
      continue;
    }

    output.push(line);
  }

  return output.join('\n');
}

export function convertMdxToMd(content: string): string {
  let result = content;

  result = removeTopLevelImports(result);

  result = convertLiveCode(result);

  result = convertAnatomyViewer(result);

  result = result.replace(/^<div\s+className='[^']*'>\s*$/gm, '');
  result = result.replace(/^<\/div>\s*$/gm, '');

  result = result.replace(/\{'([^']*)'\}/g, '$1');

  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim() + '\n';
}
