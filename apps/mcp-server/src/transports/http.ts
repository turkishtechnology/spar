import { app, transports } from '../app.js';
import { logger } from '../utils/logger.js';
import { logServerInfo } from '../utils/helpers.js';
import { SERVER_HOST, SERVER_PORT } from '../constants.js';

app.listen(SERVER_PORT, SERVER_HOST, () => {
  logServerInfo(`http://${SERVER_HOST}:${SERVER_PORT}/mcp`, 'streamable-http');
  logger.info(`Health: http://${SERVER_HOST}:${SERVER_PORT}/health`);
});

async function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down...`);
  for (const sid in transports) {
    await transports[sid]!.close();
    delete transports[sid];
  }
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
