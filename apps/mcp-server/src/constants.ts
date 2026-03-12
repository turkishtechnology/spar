import type { Implementation } from '@modelcontextprotocol/sdk/types.js';

export const SERVER_HOST = process.env.HOST || '127.0.0.1';
export const SERVER_PORT = +(process.env.PORT || '3001');
export const SERVER_INFO = {
  name: 'spar-docs',
  version: '0.1.0',
  description: 'Spar UI component documentation MCP server',
} satisfies Implementation;
