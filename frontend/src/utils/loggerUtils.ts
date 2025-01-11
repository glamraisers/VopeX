import { v4 as uuidv4 } from 'uuid';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  stack?: string;
}

export class LoggerUtils {
  // Configuration for logger
  private static config = {
    level: LogLevel.INFO,
    enableConsole: true,
    enableRemoteLogging: false,
    remoteLogEndpoint: '/api/logs'
  };

  // Log storage
  private static logs: LogEntry[] = [];

  // Maximum number of logs to store
  private static MAX_LOGS = 1000;

  // Configure logger
  static configure(options: {
    level?: LogLevel;
    enableConsole?: boolean;
    enableRemoteLogging?: boolean;
    remoteLogEndpoint?: string;
  }) {
    this.config = { ...this.config, ...options };
  }

  // Base logging method
  private static log(
    level: LogLevel, 
    message: string, 
    context?: Record<string, any>
  ): LogEntry {
    // Check log level
    if (this.shouldLog(level)) {
      const logEntry: LogEntry = {
        id: uuidv4(),
        timestamp: Date.now(),
        level,
        message,
        context,
        stack: new Error().stack
      };

      // Store log entry
      this.storeLogs(logEntry);

      // Console logging
      if (this.config.enableConsole) {
        this.consoleLog(logEntry);
      }

      // Remote logging
      if (this.config.enableRemoteLogging) {
        this.remoteLog(logEntry);
      }

      return logEntry;
    }
  }

  // Determine if log should be recorded
  private static shouldLog(level: LogLevel): boolean {
    const logLevels = [
      LogLevel.ERROR, 
      LogLevel.WARN, 
      LogLevel.INFO, 
      LogLevel.DEBUG
    ];
    
    return logLevels.indexOf(level) <= logLevels.indexOf(this.config.level);
  }

  // Store log entries
  private static storeLogs(entry: LogEntry): void {
    // Maintain log size limit
    if (this.logs.length >= this.MAX_LOGS) {
      this.logs.shift();
    }
    this.logs.push(entry);
  }

  // Console logging with styling
  private static consoleLog(entry: LogEntry): void {
    const styles = {
      [LogLevel.ERROR]: 'color: red; font-weight: bold',
      [LogLevel.WARN]: 'color: orange',
      [LogLevel.INFO]: 'color: blue',
      [LogLevel.DEBUG]: 'color: gray'
    };

    console.log(
      `%c[${entry.level}] ${entry.message}`, 
      styles[entry.level],
      entry.context || {}
    );
  }

  // Remote logging
  private static async remoteLog(entry: LogEntry): Promise<void> {
    try {
      await fetch(this.config.remoteLogEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.error('Remote logging failed', error);
    }
  }

  // Public logging methods
  static error(
    message: string, 
    context?: Record<string, any>
  ): LogEntry {
    return this.log(LogLevel.ERROR, message, context);
  }

  static warn(
    message: string, 
    context?: Record<string, any>
  ): LogEntry {
    return this.log(LogLevel.WARN, message, context);
  }

  static info(
    message: string, 
    context?: Record<string, any>
  ): LogEntry {
    return this.log(LogLevel.INFO, message, context);
  }

  static debug(
    message: string, 
    context?: Record<string, any>
  ): LogEntry {
    return this.log(LogLevel.DEBUG, message, context);
  }

  // Performance tracking
  static time(label: string): void {
    console.time(label);
  }

  static timeEnd(label: string): void {
    console.timeEnd(label);
  }

  // Retrieve logs
  static getLogs(
    options?: {
      level?: LogLevel;
      limit?: number;
      since?: number;
    }
  ): LogEntry[] {
    let filteredLogs = [...this.logs];

    if (options?.level) {
      filteredLogs = filteredLogs.filter(
        log => log.level === options.level
      );
    }

    if (options?.since) {
      filteredLogs = filteredLogs.filter(
        log => log.timestamp >= options.since
      );
    }

    if (options?.limit) {
      filteredLogs = filteredLogs.slice(-options.limit);
    }

    return filteredLogs;
  }

  // Clear logs
  static clearLogs(): void {
    this.logs = [];
  }

  // Error tracking and reporting
  static trackError(
    error: Error, 
    context?: Record<string, any>
  ): LogEntry {
    return this.log(LogLevel.ERROR, error.message, {
      ...context,
      stack: error.stack
    });
  }

  // Audit logging
  static audit(
    action: string, 
    details?: Record<string, any>
  ): LogEntry {
    return this.log(LogLevel.INFO, `AUDIT: ${action}`, {
      auditDetails: details
    });
  }
}

// Configure logger
LoggerUtils.configure({
  level: LogLevel.DEBUG,
  enableConsole: true,
  enableRemoteLogging: process.env.NODE_ENV === 'production'
});

// Example usage
export const logger = LoggerUtils;

// Usage examples
logger.info('Application started', { 
  version: '1.0.0', 
  environment: process.env.NODE_ENV 
});

logger.error('Database connection failed', {
  connectionString: 'redacted',
  errorCode: 500
});

try {
  // Some risky operation
  logger.time('complexOperation');
  // ... operation code
  logger.timeEnd('complexOperation');
} catch (error) {
  logger.trackError(error);
}