import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from '../server.js';
import { logger } from '../utils/logger.js';
import { logServerInfo } from '../utils/helpers.js';

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  const server = createServer();

  await server.connect(transport);

  logServerInfo(undefined, 'stdio');

  process.on('SIGINT', async () => {
    logger.info('Received SIGINT, shutting down...');
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, shutting down...');
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  logger.error('Failed to start stdio server:', error);
  process.exit(1);
});
