import type { Implementation } from '@modelcontextprotocol/sdk/types.js';

const defaultHost = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
export const SERVER_HOST = process.env.HOST ?? defaultHost;
export const SERVER_PORT = +(process.env.PORT || '3001');
export const SEARCH_MAX_RESULTS = 5;
export const SEARCH_MAX_SECTIONS_PER_COMPONENT = 3;
export const SEARCH_MAX_SECTION_LINES = 15;

export const SERVER_INFO = {
  name: 'spar-mcp',
  version: '0.1.0',
  description: 'Spar UI component documentation MCP server',
} satisfies Implementation;
