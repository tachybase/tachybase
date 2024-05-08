import { getLoggerLevel, getLoggerTransport } from '@tachybase/logger';
import { AppLoggerOptions } from '@tachybase/server';

export default {
  request: {
    transports: getLoggerTransport(),
    level: getLoggerLevel(),
  },
  system: {
    transports: getLoggerTransport(),
    level: getLoggerLevel(),
  },
} as AppLoggerOptions;
