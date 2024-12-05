import { Application } from '@tachybase/server';

export default function mergeApplicationStartEnvs(appName: string, mainApp: Application, options: any, startEnvs: any) {
  if (typeof startEnvs === 'string') {
    const envs = startEnvs.trim().split('\n');
    startEnvs = {};
    for (const env of envs) {
      const [key, value] = env.split('=');
      startEnvs[key] = value;
    }
  }
  if (startEnvs && Object.keys(startEnvs).length !== 0) {
    // TODO: 因为环境变量和对应的配置项无法直接平铺，所以需要逐个匹配，以后或许有更好的解决方案
    if (startEnvs.APP_KEY) {
      options = {
        ...options,
        authManager: {
          jwt: {
            secret: startEnvs.APP_KEY,
          },
        },
      };
      delete startEnvs.APP_KEY;
    }
    if (startEnvs.API_BASE_PATH) {
      options.resourcer.prefix = startEnvs.API_BASE_PATH;
      delete startEnvs.API_BASE_PATH;
    }
    if (startEnvs.DB_DIALECT) {
      options.database.dialect = startEnvs.DB_DIALECT;
      delete startEnvs.DB_DIALECT;
    }
    if (startEnvs.DB_STORAGE) {
      options.database.storage = startEnvs.DB_STORAGE;
      delete startEnvs.DB_STORAGE;
    }
    if (startEnvs.DB_TABLE_PREFIX) {
      options.database.tablePrefix = startEnvs.DB_TABLE_PREFIX;
      delete startEnvs.DB_TABLE_PREFIX;
    }
    if (startEnvs.DB_HOST) {
      options.database.host = startEnvs.DB_HOST;
      delete startEnvs.DB_HOST;
    }
    if (startEnvs.DB_PORT) {
      options.database.port = parseInt(startEnvs.DB_PORT);
      delete startEnvs.DB_PORT;
    }
    if (startEnvs.DB_DATABASE) {
      options.database.database = startEnvs.DB_DATABASE;
      delete startEnvs.DB_DATABASE;
    }
    if (startEnvs.DB_USER) {
      options.database.username = startEnvs.DB_USER;
      delete startEnvs.DB_USER;
    }
    if (startEnvs.DB_PASSWORD) {
      options.database.password = startEnvs.DB_PASSWORD;
      delete startEnvs.DB_PASSWORD;
    }
    if (startEnvs.DB_UNDERSCORED) {
      options.database.underscored = startEnvs.DB_UNDERSCORED === 'true';
      delete startEnvs.DB_UNDERSCORED;
    }
    if (startEnvs.DB_TIMEZONE) {
      options.database.timezone = startEnvs.DB_TIMEZONE;
      delete startEnvs.DB_TIMEZONE;
    }
    if (startEnvs.DB_SCHEMA) {
      options.database.schema = startEnvs.DB_SCHEMA;
      delete startEnvs.DB_SCHEMA;
    }
    if (startEnvs.CACHE_DEFAULT_STORE) {
      options.cacheManager.defaultStore = startEnvs.CACHE_DEFAULT_STORE;
      delete startEnvs.CACHE_DEFAULT_STORE;
    }
    if (startEnvs.CACHE_MEMORY_MAX) {
      options.cacheManager.stores.memory.max = parseInt(startEnvs.CACHE_MEMORY_MAX);
      delete startEnvs.CACHE_MEMORY_MAX;
    }

    if (Object.keys(startEnvs).length !== 0) {
      mainApp.logger.warn(`Application ${appName} has unsupported startEnvs: ${JSON.stringify(startEnvs)}`);
    }
  }
  return options;
}
