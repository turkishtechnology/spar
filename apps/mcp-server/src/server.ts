import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadDocs, isComponentDoc, extractSection, DOC_SECTIONS } from './utils/docs.js';
import { logger } from './utils/logger.js';
import { SERVER_INFO } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
const docs = loadDocs(DOCS_DIR);

export function createServer(): McpServer {
  const server = new McpServer(
    {
      name: SERVER_INFO.name,
      version: SERVER_INFO.version,
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
    'get_component_docs',
    {
      description:
        'Get documentation for a specific Spar component. Returns full documentation by default, or a specific section when the section parameter is provided.',
      inputSchema: {
        componentName: z.string().describe('Component name (e.g., "Button", "Dialog", "Tabs")'),
        section: z
          .enum(DOC_SECTIONS)
          .optional()
          .describe(
            'Optional section to retrieve: "live-demo", "features", "import", "anatomy", "examples", "api", "keyboard". Omit for full documentation.',
          ),
      },
    },
    async ({ componentName, section }) => {
      const doc = docs.get(componentName.toLowerCase());

      if (!doc || !isComponentDoc(doc.name)) {
        const available = Array.from(docs.values())
          .filter((d) => isComponentDoc(d.name))
          .map((d) => d.name)
          .join(', ');
        const errorMsg = `Component "${componentName}" not found. Available components: ${available}`;
        logger.warn(`get_component_docs: ${errorMsg}`);
        return {
          content: [{ type: 'text' as const, text: errorMsg }],
          isError: true,
        };
      }

      if (section) {
        const sectionContent = extractSection(doc.content, section);
        if (!sectionContent) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Section "${section}" not found in ${doc.name}. Available sections: ${DOC_SECTIONS.join(', ')}`,
              },
            ],
            isError: true,
          };
        }
        return {
          content: [{ type: 'text' as const, text: sectionContent }],
        };
      }

      return {
        content: [{ type: 'text' as const, text: doc.content }],
      };
    },
  );

  server.registerTool(
    'get_setup_guide',
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
        logger.warn('get_setup_guide: Setup guide not found.');
        return {
          content: [{ type: 'text' as const, text: 'Setup guide not found.' }],
          isError: true,
        };
      }

      return {
        content: [{ type: 'text' as const, text: parts.join('\n\n---\n\n') }],
      };
    },
  );

  server.registerTool(
    'search_docs',
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
