import { type ComponentDoc, isComponentDoc } from './docs.js';
import {
  SEARCH_MAX_RESULTS,
  SEARCH_MAX_SECTIONS_PER_COMPONENT,
  SEARCH_MAX_SECTION_LINES,
} from '../constants.js';

// ── Types ────────────────────────────────────────────────────────────

export interface DocSection {
  component: string;
  heading: string;
  depth: number;
  content: string;
}

export type Relevance = 'high' | 'medium' | 'low';

export interface SearchMatch {
  component: string;
  heading: string;
  content: string;
  relevance: Relevance;
  matchCount: number;
}

export interface SearchResult {
  query: string;
  totalComponents: number;
  totalMatches: number;
  results: Array<{
    component: string;
    matches: SearchMatch[];
    totalMatches: number;
  }>;
  truncated: boolean;
}

// ── Section parser ───────────────────────────────────────────────────

const HEADING_RE = /^(#{2,4})\s+(.+)$/;

/**
 * Splits a Markdown document into sections based on headings (##, ###, ####).
 * Each section contains everything from its heading until the next heading of
 * equal or higher level, preserving full content without cutting tables or
 * code blocks.
 */
export function parseSections(doc: ComponentDoc): DocSection[] {
  const lines = doc.content.split('\n');
  const sections: DocSection[] = [];
  let current: { heading: string; depth: number; start: number } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const match = HEADING_RE.exec(lines[i]!);
    if (match) {
      const depth = match[1]!.length; // 2, 3, or 4
      const heading = match[2]!.trim();

      // Close previous section
      if (current) {
        sections.push({
          component: doc.name,
          heading: current.heading,
          depth: current.depth,
          content: lines.slice(current.start, i).join('\n').trim(),
        });
      }

      current = { heading, depth, start: i };
    }
  }

  // Close last section
  if (current) {
    sections.push({
      component: doc.name,
      heading: current.heading,
      depth: current.depth,
      content: lines.slice(current.start).join('\n').trim(),
    });
  }

  return sections;
}

/**
 * Pre-parses and caches sections on each doc.
 * Call once after `loadDocs` to avoid re-parsing on every search.
 */
export function buildSectionIndex(docs: Map<string, ComponentDoc>): void {
  for (const [, doc] of docs) {
    doc.sections = parseSections(doc);
  }
}

// ── Word boundary matching (#1) ──────────────────────────────────────

function buildWordBoundaryRegex(query: string): RegExp {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // If query contains spaces (multi-word), match as exact phrase with word boundaries
  // Otherwise, match single word with word boundaries
  return new RegExp(`\\b${escaped}\\b`, 'gi');
}

function countWordMatches(text: string, regex: RegExp): number {
  regex.lastIndex = 0;
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

// ── Relevance scoring ────────────────────────────────────────────────

function scoreSection(
  section: DocSection,
  wordRegex: RegExp,
): { relevance: Relevance; matchCount: number } | null {
  const matchCount = countWordMatches(section.content, wordRegex);
  if (matchCount === 0) return null;

  const inHeading = countWordMatches(section.heading, wordRegex) > 0;

  let relevance: Relevance;
  if (inHeading) {
    relevance = 'high';
  } else if (matchCount >= 3) {
    relevance = 'high';
  } else if (matchCount >= 2) {
    relevance = 'medium';
  } else {
    relevance = 'low';
  }

  return { relevance, matchCount };
}

// ── Search ───────────────────────────────────────────────────────────

const RELEVANCE_ORDER: Record<Relevance, number> = { high: 0, medium: 1, low: 2 };

export function searchDocs(docs: Map<string, ComponentDoc>, query: string): SearchResult {
  const componentResults: SearchResult['results'] = [];
  const wordRegex = buildWordBoundaryRegex(query);

  for (const [, doc] of docs) {
    // #4: Use cached sections if available, otherwise parse on-the-fly
    const sections = doc.sections ?? parseSections(doc);
    const matches: SearchMatch[] = [];

    for (const section of sections) {
      const score = scoreSection(section, wordRegex);
      if (score) {
        matches.push({
          component: doc.name,
          heading: section.heading,
          content: section.content,
          relevance: score.relevance,
          matchCount: score.matchCount,
        });
      }
    }

    if (matches.length > 0) {
      // Sort: high → medium → low, then by matchCount desc
      matches.sort((a, b) => {
        const rel = RELEVANCE_ORDER[a.relevance] - RELEVANCE_ORDER[b.relevance];
        return rel !== 0 ? rel : b.matchCount - a.matchCount;
      });

      componentResults.push({
        component: doc.name,
        matches: matches.slice(0, SEARCH_MAX_SECTIONS_PER_COMPONENT),
        totalMatches: matches.length,
      });
    }
  }

  // #6: Sort components — component docs first, non-component docs last
  componentResults.sort((a, b) => {
    const aIsComponent = isComponentDoc(a.component) ? 0 : 1;
    const bIsComponent = isComponentDoc(b.component) ? 0 : 1;
    if (aIsComponent !== bIsComponent) return aIsComponent - bIsComponent;

    const aTop = a.matches[0]!;
    const bTop = b.matches[0]!;
    const rel = RELEVANCE_ORDER[aTop.relevance] - RELEVANCE_ORDER[bTop.relevance];
    return rel !== 0 ? rel : b.totalMatches - a.totalMatches;
  });

  const totalComponents = componentResults.length;
  const totalMatches = componentResults.reduce((sum, r) => sum + r.totalMatches, 0);
  const truncated = totalComponents > SEARCH_MAX_RESULTS;
  const limited = componentResults.slice(0, SEARCH_MAX_RESULTS);

  return { query, totalComponents, totalMatches, results: limited, truncated };
}

// ── Content trimming (#5: multi-cluster) ─────────────────────────────

/**
 * Trims a section's content to the most relevant lines around matches.
 * Supports multiple clusters when matches are spread across the section.
 */
function trimContent(content: string, query: string): string {
  const lines = content.split('\n');
  if (lines.length <= SEARCH_MAX_SECTION_LINES) return content;

  const wordRegex = buildWordBoundaryRegex(query);

  // Find lines that contain the query
  const matchIndices: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (countWordMatches(lines[i]!, wordRegex) > 0) {
      matchIndices.push(i);
    }
  }

  if (matchIndices.length === 0) return content;

  // Group nearby match lines into clusters (within 3 lines of each other)
  const clusters: Array<{ start: number; end: number }> = [];
  let clusterStart = matchIndices[0]!;
  let clusterEnd = matchIndices[0]!;

  for (let i = 1; i < matchIndices.length; i++) {
    if (matchIndices[i]! - clusterEnd <= 3) {
      clusterEnd = matchIndices[i]!;
    } else {
      clusters.push({ start: clusterStart, end: clusterEnd });
      clusterStart = matchIndices[i]!;
      clusterEnd = matchIndices[i]!;
    }
  }
  clusters.push({ start: clusterStart, end: clusterEnd });

  // Budget lines across clusters
  const contextPerCluster = Math.max(3, Math.floor(SEARCH_MAX_SECTION_LINES / clusters.length));
  const parts: string[] = [];
  let lastEnd = -1;

  for (const cluster of clusters) {
    const half = Math.floor(contextPerCluster / 2);
    const start = Math.max(0, cluster.start - half);
    const end = Math.min(lines.length, cluster.end + half + 1);

    if (start > lastEnd + 1) {
      parts.push('...');
    }

    parts.push(lines.slice(start, end).join('\n'));
    lastEnd = end - 1;
  }

  if (lastEnd < lines.length - 1) {
    parts.push(`...\n_(${lines.length - lastEnd - 1} more lines)_`);
  }

  return parts.join('\n');
}

// ── Formatter ────────────────────────────────────────────────────────

export function formatSearchResult(result: SearchResult): string {
  if (result.results.length === 0) {
    return `No results found for "${result.query}"`;
  }

  const header = `Found ${result.totalMatches} match(es) across ${result.totalComponents} component(s) for "${result.query}":`;

  const body = result.results.map((r) => {
    const componentHeader = `## ${r.component}`;
    const sections = r.matches.map((m) => {
      const trimmed = trimContent(m.content, result.query);
      return `### ${m.heading}\n\n${trimmed}`;
    });

    const note =
      r.totalMatches > r.matches.length
        ? `\n\n> Showing ${r.matches.length} of ${r.totalMatches} sections. Use \`get_component_docs\` for full ${r.component} documentation.`
        : '';

    return `${componentHeader}\n\n${sections.join('\n\n')}${note}`;
  });

  let text = `${header}\n\n${body.join('\n\n')}`;

  if (result.truncated) {
    const hidden = result.totalComponents - result.results.length;
    text += `\n\n---\n> Results truncated: ${hidden} more component(s) matched. Narrow your query or use \`get_component_docs\` for a specific component.`;
  }

  return text;
}
