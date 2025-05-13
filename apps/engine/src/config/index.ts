import { telemetryOptions as telemetry } from '@tachybase/telemetry';

import { cacheManager } from './cache';
import { parseDatabaseOptions } from './database';
import logger from './logger';
import plugins from './plugins';

export async function getConfig() {
  return {
    database: {
      ...(await parseDatabaseOptions()),
      dialectModule: require('sqlite3'),
    } as any,
    resourcer: {
      prefix: process.env.API_BASE_PATH,
    },
    plugins,
    cacheManager,
    logger,
    telemetry,
    perfHooks: process.env.ENABLE_PERF_HOOKS ? true : false,
  };
}
