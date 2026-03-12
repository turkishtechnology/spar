import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadDocs, isComponentDoc, extractCodeBlocks } from './utils/docs.js';
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
const docs = loadDocs(DOCS_DIR);

export function createServer(): McpServer {
  const server = new McpServer(
    {
      name: 'spar-docs',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    },
  );

  server.registerTool(
    'list_components',
    {
      description: 'List all available Spar UI components with their descriptions',
      inputSchema: {},
    },
    async () => {
      const components = Array.from(docs.values())
        .filter((d) => isComponentDoc(d.name))
        .map((d) => ({
          name: d.name,
          description: d.description,
        }));

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(components, null, 2) }],
      };
    },
  );

  server.registerTool(
    'get_component_documentation',
    {
      description:
        'Get complete documentation for a specific Spar component including props, examples, and keyboard interactions',
      inputSchema: {
        componentName: z.string().describe('Component name (e.g., "Button", "Dialog", "Tabs")'),
      },
    },
    async ({ componentName }) => {
      const doc = docs.get(componentName.toLowerCase());

      if (!doc || !isComponentDoc(doc.name)) {
        const available = Array.from(docs.values())
          .filter((d) => isComponentDoc(d.name))
          .map((d) => d.name)
          .join(', ');
        const errorMsg = `Component "${componentName}" not found. Available components: ${available}`;
        logger.warn(`get_component_documentation: ${errorMsg}`);
        return {
          content: [{ type: 'text' as const, text: errorMsg }],
          isError: true,
        };
      }

      return {
        content: [{ type: 'text' as const, text: doc.content }],
      };
    },
  );

  server.registerTool(
    'get_component_examples',
    {
      description: 'Get code examples for a specific Spar component',
      inputSchema: {
        componentName: z.string().describe('Component name (e.g., "Button", "Dialog", "Tabs")'),
      },
    },
    async ({ componentName }) => {
      const doc = docs.get(componentName.toLowerCase());

      if (!doc || !isComponentDoc(doc.name)) {
        const available = Array.from(docs.values())
          .filter((d) => isComponentDoc(d.name))
          .map((d) => d.name)
          .join(', ');
        const errorMsg = `Component "${componentName}" not found. Available components: ${available}`;
        logger.warn(`get_component_examples: ${errorMsg}`);
        return {
          content: [{ type: 'text' as const, text: errorMsg }],
          isError: true,
        };
      }

      const examples = extractCodeBlocks(doc.content);
      const text =
        examples.length > 0
          ? examples
              .map((code, i) => `## Example ${i + 1}\n\n\`\`\`tsx\n${code}\n\`\`\``)
              .join('\n\n')
          : `No code examples found for ${doc.name}.`;

      return {
        content: [{ type: 'text' as const, text }],
      };
    },
  );

  server.registerTool(
    'get_getting_started',
    {
      description:
        'Get introduction and installation guide for Spar (complete getting started bundle)',
      inputSchema: {},
    },
    async () => {
      const introduction = docs.get('introduction');
      const installation = docs.get('installation');

      const parts: string[] = [];
      if (introduction) parts.push(`# Introduction\n\n${introduction.content}`);
      if (installation) parts.push(`# Installation\n\n${installation.content}`);

      if (parts.length === 0) {
        logger.warn('get_getting_started: Getting started content not found.');
        return {
          content: [{ type: 'text' as const, text: 'Getting started content not found.' }],
          isError: true,
        };
      }

      return {
        content: [{ type: 'text' as const, text: parts.join('\n\n---\n\n') }],
      };
    },
  );

  server.registerTool(
    'search_components',
    {
      description: 'Search across Spar component documentation for specific terms or concepts',
      inputSchema: {
        query: z
          .string()
          .describe(
            'Search query (e.g., "focus management", "keyboard navigation", "polymorphic", "controlled")',
          ),
      },
    },
    async ({ query }) => {
      const results: Array<{ component: string; matches: string[] }> = [];
      const queryLower = query.toLowerCase();

      for (const [, doc] of docs) {
        const lines = doc.content.split('\n');
        const matchingContexts: string[] = [];
        const seen = new Set<number>();

        for (let i = 0; i < lines.length; i++) {
          if (lines[i]!.toLowerCase().includes(queryLower) && !seen.has(i)) {
            const start = Math.max(0, i - 2);
            const end = Math.min(lines.length, i + 3);

            for (let j = start; j < end; j++) seen.add(j);

            const context = lines.slice(start, end).join('\n');
            matchingContexts.push(context);
          }
        }

        if (matchingContexts.length > 0) {
          results.push({ component: doc.name, matches: matchingContexts });
        }
      }

      if (results.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `No results found for "${query}"` }],
        };
      }

      const text = results
        .map((r) => `## ${r.component}\n\n${r.matches.join('\n\n---\n\n')}`)
        .join('\n\n');

      return {
        content: [{ type: 'text' as const, text }],
      };
    },
  );

  for (const [key, doc] of docs) {
    server.registerResource(
      key,
      `spar://components/${key}`,
      { description: doc.description, mimeType: 'text/markdown' },
      async () => ({
        contents: [
          {
            uri: `spar://components/${key}`,
            text: doc.content,
            mimeType: 'text/markdown',
          },
        ],
      }),
    );
  }

  return server;
}
