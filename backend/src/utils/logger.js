/**
 * Logger utility with configurable debug levels
 * Levels: ERROR, WARN, INFO, DEBUG
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

// Get log level from environment variable, default to INFO
const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

const formatMessage = (level, context, message, data) => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `[${context}]` : '';
  const dataStr = data ? ` ${JSON.stringify(data)}` : '';
  return `${timestamp} ${level} ${contextStr} ${message}${dataStr}`;
};

class Logger {
  constructor(context = '') {
    this.context = context;
  }

  error(message, data) {
    if (currentLevel >= LOG_LEVELS.ERROR) {
      console.error(
        `${colors.red}${formatMessage('ERROR', this.context, message, data)}${colors.reset}`
      );
    }
  }

  warn(message, data) {
    if (currentLevel >= LOG_LEVELS.WARN) {
      console.warn(
        `${colors.yellow}${formatMessage('WARN', this.context, message, data)}${colors.reset}`
      );
    }
  }

  info(message, data) {
    if (currentLevel >= LOG_LEVELS.INFO) {
      console.log(
        `${colors.blue}${formatMessage('INFO', this.context, message, data)}${colors.reset}`
      );
    }
  }

  debug(message, data) {
    if (currentLevel >= LOG_LEVELS.DEBUG) {
      console.log(
        `${colors.gray}${formatMessage('DEBUG', this.context, message, data)}${colors.reset}`
      );
    }
  }
}

// Create logger instances for different modules
const createLogger = (context) => new Logger(context);

module.exports = { createLogger, LOG_LEVELS };
