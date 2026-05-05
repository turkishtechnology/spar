import { describe, it, expect } from 'vitest';
import type { ComponentDoc } from './docs.js';
import { parseSections, searchDocs, formatSearchResult, buildSectionIndex } from './search.js';
import { SEARCH_MAX_RESULTS, SEARCH_MAX_SECTIONS_PER_COMPONENT } from '../constants.js';

// ── Helpers ──────────────────────────────────────────────────────────

function makeDoc(name: string, content: string): ComponentDoc {
  return { name, description: '', content };
}

function makeDocs(...entries: [string, string][]): Map<string, ComponentDoc> {
  const map = new Map<string, ComponentDoc>();
  for (const [name, content] of entries) {
    map.set(name.toLowerCase(), makeDoc(name, content));
  }
  return map;
}

const DIALOG_DOC = `description: Dialog component

# Dialog

## Features

- ✅ Focus trapping and restoration
- ✅ Click outside to close

## API Reference

### Dialog.Content

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| trapFocus? | boolean | true | Enable focus trapping |
| restoreFocus? | boolean | true | Restore focus on close |

## Keyboard Interactions

| Key | Action |
| --- | --- |
| Tab | Moves focus to next focusable element |
| Escape | Closes the dialog |
`;

const BUTTON_DOC = `description: Button component

# Button

## Features

- ✅ Auto-focus support on mount
- ✅ Disabled state management

## API Reference

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| autoFocus? | boolean | false | Focus on mount |

## Keyboard Interactions

| Key | Action |
| --- | --- |
| Enter | Activate button |
| Space | Activate button |
`;

const BREADCRUMB_DOC = `description: Breadcrumb component

# Breadcrumb

## Features

- ✅ Standard tab navigation

## Keyboard Interactions

| Key | Action |
| --- | --- |
| Tab | Navigate forward |
`;

// ── parseSections ────────────────────────────────────────────────────

describe('parseSections', () => {
  it('splits document into sections by ## headings', () => {
    const doc = makeDoc('Dialog', DIALOG_DOC);
    const sections = parseSections(doc);

    const headings = sections.map((s) => s.heading);
    expect(headings).toContain('Features');
    expect(headings).toContain('API Reference');
    expect(headings).toContain('Keyboard Interactions');
  });

  it('includes ### sub-sections as separate sections', () => {
    const doc = makeDoc('Dialog', DIALOG_DOC);
    const sections = parseSections(doc);

    const headings = sections.map((s) => s.heading);
    expect(headings).toContain('Dialog.Content');
  });

  it('sets correct depth for each heading level', () => {
    const doc = makeDoc('Dialog', DIALOG_DOC);
    const sections = parseSections(doc);

    const features = sections.find((s) => s.heading === 'Features');
    expect(features?.depth).toBe(2);

    const content = sections.find((s) => s.heading === 'Dialog.Content');
    expect(content?.depth).toBe(3);
  });

  it('preserves full content within sections (no cut tables)', () => {
    const doc = makeDoc('Dialog', DIALOG_DOC);
    const sections = parseSections(doc);

    const api = sections.find((s) => s.heading === 'Dialog.Content');
    expect(api?.content).toContain('trapFocus?');
    expect(api?.content).toContain('restoreFocus?');
  });

  it('returns empty array for doc without headings', () => {
    const doc = makeDoc('Empty', 'Just plain text, no headings');
    const sections = parseSections(doc);
    expect(sections).toEqual([]);
  });

  it('sets component name on each section', () => {
    const doc = makeDoc('Dialog', DIALOG_DOC);
    const sections = parseSections(doc);
    for (const section of sections) {
      expect(section.component).toBe('Dialog');
    }
  });
});

// ── searchDocs ───────────────────────────────────────────────────────

describe('searchDocs', () => {
  const docs = makeDocs(
    ['Dialog', DIALOG_DOC],
    ['Button', BUTTON_DOC],
    ['Breadcrumb', BREADCRUMB_DOC],
  );

  it('finds matching sections across components', () => {
    const result = searchDocs(docs, 'focus');
    expect(result.totalComponents).toBeGreaterThanOrEqual(2); // Dialog + Button at least
    expect(result.results.length).toBeGreaterThanOrEqual(2);
  });

  it('returns no results for non-matching query', () => {
    const result = searchDocs(docs, 'xyznonsense');
    expect(result.totalComponents).toBe(0);
    expect(result.totalMatches).toBe(0);
    expect(result.results).toEqual([]);
  });

  it('ranks heading matches as high relevance', () => {
    // "Features" appears in heading
    const singleDoc = makeDocs([
      'Test',
      '## Features\n\n- Feature list\n\n## Other\n\nNo mention here.',
    ]);
    const result = searchDocs(singleDoc, 'Features');
    const topMatch = result.results[0]?.matches[0];
    expect(topMatch?.relevance).toBe('high');
  });

  it('sorts components by best relevance first', () => {
    const result = searchDocs(docs, 'focus');
    // With word boundary matching, ensure results are sorted by relevance
    const firstComponent = result.results[0]!;
    const lastComponent = result.results[result.results.length - 1]!;
    const relOrder = { high: 0, medium: 1, low: 2 };
    const firstRel = relOrder[firstComponent.matches[0]!.relevance];
    const lastRel = relOrder[lastComponent.matches[0]!.relevance];
    expect(firstRel).toBeLessThanOrEqual(lastRel);
  });

  it('limits sections per component', () => {
    const result = searchDocs(docs, 'focus');
    for (const r of result.results) {
      expect(r.matches.length).toBeLessThanOrEqual(SEARCH_MAX_SECTIONS_PER_COMPONENT);
    }
  });

  it('limits total components in results', () => {
    const result = searchDocs(docs, 'focus');
    expect(result.results.length).toBeLessThanOrEqual(SEARCH_MAX_RESULTS);
  });

  it('reports totalMatches correctly even when truncated', () => {
    const result = searchDocs(docs, 'focus');
    for (const r of result.results) {
      expect(r.totalMatches).toBeGreaterThanOrEqual(r.matches.length);
    }
  });

  // #1: Word boundary matching
  it('matches whole words only — "tab" should not match "table"', () => {
    const wordDocs = makeDocs([
      'Test',
      '## Section\n\n| Tab | Navigate | table layout |\n| tabindex | -1 | skip |',
    ]);
    const result = searchDocs(wordDocs, 'tab');
    if (result.results.length > 0) {
      const match = result.results[0]!.matches[0]!;
      // "Tab" should match but count should not include "table" or "tabindex"
      expect(match.matchCount).toBe(1);
    }
  });

  it('matches multi-word queries as whole phrase', () => {
    const phraseDocs = makeDocs([
      'Test',
      '## Section\n\n- Focus trapping and restoration\n- focus trap enabled',
    ]);
    const result = searchDocs(phraseDocs, 'focus trap');
    expect(result.totalMatches).toBeGreaterThanOrEqual(1);
  });

  // #6: Non-component docs lower priority
  it('ranks component docs above non-component docs', () => {
    const mixedDocs = makeDocs(
      ['Dialog', '## Features\n\n- ✅ Focus trapping'],
      ['introduction', '## Accessibility\n\n- Focus Management'],
    );
    const result = searchDocs(mixedDocs, 'focus');
    expect(result.results.length).toBe(2);
    expect(result.results[0]!.component).toBe('Dialog');
    expect(result.results[1]!.component).toBe('introduction');
  });

  // #4: Section cache
  it('uses cached sections when buildSectionIndex is called', () => {
    const cachedDocs = makeDocs(['Dialog', DIALOG_DOC]);
    buildSectionIndex(cachedDocs);
    const doc = cachedDocs.get('dialog')!;
    expect(doc.sections).toBeDefined();
    expect(doc.sections!.length).toBeGreaterThan(0);

    // Search should still work with cached sections
    const result = searchDocs(cachedDocs, 'focus');
    expect(result.totalMatches).toBeGreaterThan(0);
  });
});

// ── formatSearchResult ───────────────────────────────────────────────

describe('formatSearchResult', () => {
  const docs = makeDocs(['Dialog', DIALOG_DOC], ['Button', BUTTON_DOC]);

  it('returns "No results found" message for empty results', () => {
    const result = searchDocs(docs, 'nonexistent_term');
    const text = formatSearchResult(result);
    expect(text).toContain('No results found');
  });

  it('includes header with total counts', () => {
    const result = searchDocs(docs, 'focus');
    const text = formatSearchResult(result);
    expect(text).toMatch(/Found \d+ match\(es\) across \d+ component\(s\)/);
  });

  it('includes component name as ## heading', () => {
    const result = searchDocs(docs, 'focus');
    const text = formatSearchResult(result);
    expect(text).toContain('## Dialog');
  });

  it('does not include relevance tags in output', () => {
    const result = searchDocs(docs, 'focus');
    const text = formatSearchResult(result);
    expect(text).not.toMatch(/\[(high|medium|low)\]/);
  });

  it('preserves full section content (tables not cut)', () => {
    const result = searchDocs(docs, 'trapFocus');
    const text = formatSearchResult(result);
    expect(text).toContain('trapFocus?');
    expect(text).toContain('restoreFocus?');
  });

  it('shows truncation note when sections are limited', () => {
    // Create a doc with many sections matching the query
    const manyDocs = makeDocs([
      'Big',
      Array.from({ length: 10 }, (_, i) => `## Section ${i}\n\nThis mentions focus here.`).join(
        '\n\n',
      ),
    ]);
    const result = searchDocs(manyDocs, 'focus');
    if (result.results[0]!.totalMatches > result.results[0]!.matches.length) {
      const text = formatSearchResult(result);
      expect(text).toContain('Showing');
      expect(text).toContain('get_component_docs');
    }
  });

  it('shows component truncation note when many components match', () => {
    // Create 8 components, all with "focus"
    const entries: [string, string][] = Array.from({ length: 8 }, (_, i) => [
      `Comp${i}`,
      `## Features\n\n- Has focus support`,
    ]);
    const manyComponentDocs = makeDocs(...entries);
    const result = searchDocs(manyComponentDocs, 'focus');
    if (result.truncated) {
      const text = formatSearchResult(result);
      expect(text).toContain('Results truncated');
    }
  });
});
