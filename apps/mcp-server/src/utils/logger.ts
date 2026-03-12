/**
 * Logger utility for MCP server
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LoggerOptions {
  level?: LogLevel;
  transport?: string;
}

class Logger {
  private level: LogLevel;
  private transport: string;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? LogLevel.INFO;
    this.transport = options.transport ?? 'stdio';
  }

  private shouldLog(level: LogLevel) {
    return level >= this.level;
  }

  private formatMessage(level: string, message: string, data?: unknown) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  private writeLog(level: LogLevel, levelStr: string, message: string, data?: unknown) {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(levelStr, message, data);

    if (this.transport === 'stdio') {
      process.stderr.write(formattedMessage + '\n');
    } else {
      // eslint-disable-next-line no-console -- intentional for non-stdio transport
      console.log(formattedMessage);
    }
  }

  debug(message: string, data?: unknown) {
    this.writeLog(LogLevel.DEBUG, 'DEBUG', message, data);
  }

  info(message: string, data?: unknown) {
    this.writeLog(LogLevel.INFO, 'INFO', message, data);
  }

  warn(message: string, data?: unknown) {
    this.writeLog(LogLevel.WARN, 'WARN', message, data);
  }

  error(message: string, data?: unknown) {
    this.writeLog(LogLevel.ERROR, 'ERROR', message, data);
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  setTransport(transport: string) {
    this.transport = transport;
  }
}

export const logger = new Logger({
  level: process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL, 10) : LogLevel.INFO,
});

export default logger;
