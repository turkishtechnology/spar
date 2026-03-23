import { logger } from './logger.js';
import { SERVER_INFO } from '../constants.js';

export const logServerInfo = (endpoint?: string) => {
  logger.info(`${SERVER_INFO.name} v${SERVER_INFO.version} starting...`);
  logger.info(`Description: ${SERVER_INFO.description}`);
  logger.info('Transport: streamable-http');
  if (endpoint) logger.info(`Endpoint: ${endpoint}`);
  logger.info(
    'Available tools: list_components, get_component_documentation, get_getting_started, search_components',
  );
};
