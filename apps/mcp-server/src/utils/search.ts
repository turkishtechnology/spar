const MAX_CONTEXTS_PER_DOC = 5;
const MAX_RESULTS = 8;
const SIMILARITY_THRESHOLD = 0.4;

export interface SearchMatch {
  context: string;
  score: number;
}

export interface SearchResult {
  component: string;
  totalMatches: number;
  bestScore: number;
  matches: SearchMatch[];
}

// ── Similarity ──────────────────────────────────────────────────

function bigrams(str: string): Set<string> {
  const s = str.toLowerCase();
  const out = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
  return out;
}

function diceCoefficient(a: string, b: string): number {
  const setA = bigrams(a);
  const setB = bigrams(b);
  if (setA.size === 0 && setB.size === 0) return 1;
  let intersection = 0;
  for (const bg of setA) if (setB.has(bg)) intersection++;
  return (2 * intersection) / (setA.size + setB.size);
}

function scoreWords(lineWords: string[], queryWords: string[]): number {
  let total = 0;
  for (const qw of queryWords) {
    let best = 0;
    for (const lw of lineWords) {
      if (lw === qw) {
        best = 1;
        break;
      }
      if (lw.includes(qw) || qw.includes(lw)) {
        best = Math.max(best, 0.8);
        continue;
      }
      const dice = diceCoefficient(lw, qw);
      best = Math.max(best, dice);
    }
    total += best;
  }
  return total / queryWords.length;
}

function scoreLine(line: string, queryWords: string[]): number {
  const lineWords = line
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
  if (lineWords.length === 0) return 0;
  return scoreWords(lineWords, queryWords);
}

// ── Context Window ──────────────────────────────────────────────

type LineKind = 'heading' | 'table' | 'code-fence' | 'prose';

function classifyLine(line: string): LineKind {
  const trimmed = line.trimStart();
  if (trimmed.startsWith('#')) return 'heading';
  if (trimmed.startsWith('|') || trimmed.startsWith('---')) return 'table';
  if (trimmed.startsWith('```')) return 'code-fence';
  return 'prose';
}

function resolveContext(lines: string[], hitIndex: number): { start: number; end: number } {
  const kind = classifyLine(lines[hitIndex]!);

  switch (kind) {
    case 'heading':
      return {
        start: hitIndex,
        end: Math.min(lines.length, hitIndex + 3),
      };

    case 'table': {
      let start = hitIndex;
      while (start > 0 && classifyLine(lines[start - 1]!) === 'table') start--;
      if (start > 0 && classifyLine(lines[start - 1]!) === 'heading') start--;
      let end = hitIndex + 1;
      while (end < lines.length && classifyLine(lines[end]!) === 'table') end++;
      return { start, end };
    }

    case 'code-fence': {
      let start = hitIndex;
      while (start > 0 && !lines[start - 1]!.trimStart().startsWith('```')) start--;
      if (start > 0) start--;
      let end = hitIndex + 1;
      while (end < lines.length && !lines[end - 1]!.trimStart().startsWith('```')) end++;
      if (end < lines.length) end++;
      const maxCodeLines = 15;
      if (end - start > maxCodeLines) {
        const mid = hitIndex;
        start = Math.max(start, mid - Math.floor(maxCodeLines / 2));
        end = Math.min(end, start + maxCodeLines);
      }
      return { start, end };
    }

    default:
      return {
        start: Math.max(0, hitIndex - 3),
        end: Math.min(lines.length, hitIndex + 4),
      };
  }
}

// ── Search ──────────────────────────────────────────────────────

export function searchDocs(
  docs: Map<string, { name: string; content: string }>,
  query: string,
): SearchResult[] {
  const queryWords = query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  if (queryWords.length === 0) return [];

  const results: SearchResult[] = [];

  for (const [, doc] of docs) {
    const lines = doc.content.split('\n');
    const scored: Array<{ index: number; score: number }> = [];

    for (let i = 0; i < lines.length; i++) {
      const s = scoreLine(lines[i]!, queryWords);
      if (s >= SIMILARITY_THRESHOLD) {
        scored.push({ index: i, score: s });
      }
    }

    if (scored.length === 0) continue;

    scored.sort((a, b) => b.score - a.score);

    const usedLines = new Set<number>();
    const matches: SearchMatch[] = [];
    let bestScore = 0;

    for (const hit of scored) {
      if (matches.length >= MAX_CONTEXTS_PER_DOC) break;
      if (usedLines.has(hit.index)) continue;

      const { start, end } = resolveContext(lines, hit.index);

      let overlap = false;
      for (let j = start; j < end; j++) {
        if (usedLines.has(j)) {
          overlap = true;
          break;
        }
      }
      if (overlap) continue;

      for (let j = start; j < end; j++) usedLines.add(j);

      matches.push({
        context: lines.slice(start, end).join('\n'),
        score: hit.score,
      });

      bestScore = Math.max(bestScore, hit.score);
    }

    if (matches.length > 0) {
      results.push({
        component: doc.name,
        totalMatches: scored.length,
        bestScore,
        matches,
      });
    }
  }

  results.sort((a, b) => {
    if (Math.abs(b.bestScore - a.bestScore) > 0.1) return b.bestScore - a.bestScore;
    return b.totalMatches - a.totalMatches;
  });

  return results.slice(0, MAX_RESULTS);
}

export function formatSearchResults(query: string, results: SearchResult[]): string {
  if (results.length === 0) return `No results found for "${query}"`;

  const summary = `Found matches in ${results.length} document(s), sorted by relevance.\n`;

  const body = results
    .map((r) => {
      const shown = r.matches.length;
      const extra = r.totalMatches > shown ? ` (showing top ${shown} of ${r.totalMatches})` : '';
      const header = `## ${r.component} — ${r.totalMatches} match${r.totalMatches !== 1 ? 'es' : ''}${extra}`;
      const snippets = r.matches.map((m) => m.context).join('\n\n---\n\n');
      return `${header}\n\n${snippets}`;
    })
    .join('\n\n');

  return `${summary}\n${body}`;
}
