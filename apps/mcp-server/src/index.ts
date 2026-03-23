import { logger } from './utils/logger.js';

const args = process.argv.slice(2);
const transportName = args[0] || 'stdio';

async function run() {
  try {
    switch (transportName) {
      case 'stdio':
        await import('./transports/stdio.js');
        break;
      case 'http':
        await import('./transports/http.js');
        break;
      default:
        logger.error(`Unknown transport: ${transportName}`);
        logger.info('Available transports: stdio, http');
        process.exit(1);
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

await run();

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection:', reason);
  process.exit(1);
});
