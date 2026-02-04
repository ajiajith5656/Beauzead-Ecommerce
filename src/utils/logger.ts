/**
 * Production-safe logger utility
 * - In development: logs to console
 * - In production: sends to monitoring service (Sentry)
 */

import * as Sentry from '@sentry/react';

const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

// Initialize Sentry for production error tracking
if (isProduction && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1, // 10% of transactions
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      // Filter out sensitive data
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }
      return event;
    },
  });
}

export const logger = {
  /**
   * Log informational messages (development only)
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[INFO]', ...args);
    }
  },

  /**
   * Log debug messages (development only)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  },

  /**
   * Log warning messages
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
    if (isProduction) {
      Sentry.captureMessage(args.join(' '), 'warning');
    }
  },

  /**
   * Log error messages and send to monitoring
   */
  error: (error: Error | string, context?: Record<string, any>) => {
    if (isDevelopment) {
      console.error('[ERROR]', error, context);
    }
    
    if (isProduction) {
      if (error instanceof Error) {
        Sentry.captureException(error, {
          extra: context,
        });
      } else {
        Sentry.captureMessage(error, {
          level: 'error',
          extra: context,
        });
      }
    }
  },

  /**
   * Log authentication events
   */
  auth: (event: string, userId?: string) => {
    if (isDevelopment) {
      console.log('[AUTH]', event, userId);
    }
    if (isProduction) {
      Sentry.addBreadcrumb({
        category: 'auth',
        message: event,
        level: 'info',
        data: { userId },
      });
    }
  },

  /**
   * Log API calls
   */
  api: (method: string, endpoint: string, status?: number) => {
    if (isDevelopment) {
      console.log('[API]', method, endpoint, status);
    }
    if (isProduction && status && status >= 400) {
      Sentry.addBreadcrumb({
        category: 'api',
        message: `${method} ${endpoint}`,
        level: status >= 500 ? 'error' : 'warning',
        data: { status },
      });
    }
  },

  /**
   * Set user context for error tracking
   */
  setUser: (user: { id: string; email?: string; role?: string } | null) => {
    if (isProduction) {
      Sentry.setUser(user);
    }
  },
};

export default logger;
