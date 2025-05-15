import './intercept';
// builtin modules for deps
import 'dayjs';
import '@tachybase/utils';
import '@tachybase/telemetry';
import '@tachybase/acl';
import '@tachybase/logger';
import '@tachybase/cache';
import '@tachybase/schema';
import '@tachybase/resourcer';
import '@tachybase/evaluators';
import '@tachybase/database';
import '@tachybase/data-source';
import '@tachybase/auth';
import '@tachybase/actions';
import 'lodash';
import 'async-mutex';
import 'jsonwebtoken';
import 'cache-manager';
import 'sequelize';
import 'umzug';
import 'mathjs';
import 'winston';
import 'winston-daily-rotate-file';
import 'koa';
import '@koa/cors';
import 'multer';
import '@koa/multer';
import 'koa-bodyparser';
import 'axios';
import 'react';
import 'i18next';

import fs from 'node:fs';
import path, { resolve } from 'node:path';
import { Gateway } from '@tachybase/server';

import { config } from 'dotenv';

import { getConfig } from './config';

Error.stackTraceLimit = process.env.ERROR_STACK_TRACE_LIMIT ? +process.env.ERROR_STACK_TRACE_LIMIT : 10;

function parseEnv(name: string) {
  if (name === 'DB_UNDERSCORED') {
    if (process.env.DB_UNDERSCORED === 'true') {
      return 'true';
    }
    if (process.env.DB_UNDERSCORED) {
      return 'true';
    }
    return 'false';
  }
}

function initEnv() {
  const env = {
    APP_ENV: 'development',
    APP_KEY: 'test-jwt-secret',
    APP_PORT: 3000,
    API_BASE_PATH: '/api/',
    DB_DIALECT: 'sqlite',
    DB_STORAGE: 'storage/db/tachybase.sqlite',
    DB_TIMEZONE: '+00:00',
    DB_UNDERSCORED: parseEnv('DB_UNDERSCORED'),
    DEFAULT_STORAGE_TYPE: 'local',
    RUN_MODE: 'engine',
    LOCAL_STORAGE_DEST: 'storage/uploads',
    PLUGIN_STORAGE_PATH: resolve(process.cwd(), 'storage/plugins'),
    MFSU_AD: 'none',
    WS_PATH: '/ws',
    SOCKET_PATH: 'storage/gateway.sock',
    NODE_MODULES_PATH: resolve(process.cwd(), 'node_modules'),
    PM2_HOME: resolve(process.cwd(), './storage/.pm2'),
    PLUGIN_PACKAGE_PREFIX: '@tachybase/plugin-,@tachybase/preset-,@tachybase/module-,@hera/plugin-,@hera/module-',
    SERVER_TSCONFIG_PATH: './tsconfig.server.json',
    PLAYWRIGHT_AUTH_FILE: resolve(process.cwd(), 'storage/playwright/.auth/admin.json'),
    CACHE_DEFAULT_STORE: 'memory',
    CACHE_MEMORY_MAX: 2000,
    PLUGIN_STATICS_PATH: '/static/plugins/',
    LOGGER_BASE_PATH: 'storage/logs',
    APP_SERVER_BASE_URL: '',
    APP_PUBLIC_PATH: '/',
  };

  config({
    path: resolve(process.cwd(), process.env.APP_ENV_PATH || '.env'),
  });

  for (const key in env) {
    if (!process.env[key]) {
      // @ts-ignore
      process.env[key] = env[key];
    }
  }

  if (!process.env.__env_modified__ && process.env.APP_PUBLIC_PATH) {
    const publicPath = process.env.APP_PUBLIC_PATH.replace(/\/$/g, '');
    const keys = ['API_BASE_PATH', 'WS_PATH', 'PLUGIN_STATICS_PATH'];
    for (const key of keys) {
      process.env[key] = publicPath + process.env[key];
    }
    // @ts-ignore
    process.env.__env_modified__ = true;
  }

  if (!process.env.__env_modified__ && process.env.APP_SERVER_BASE_URL && !process.env.API_BASE_URL) {
    process.env.API_BASE_URL = process.env.APP_SERVER_BASE_URL + process.env.API_BASE_PATH;
    // @ts-ignore
    process.env.__env_modified__ = true;
  }
}

initEnv();

const baseDir = process.cwd();

const distPath = path.join(baseDir, 'apps/app-rs/dist/index.html');
const clientPath = path.join(baseDir, 'client/index.html');

let servePath = '';

if (fs.existsSync(distPath)) {
  console.log(`Found: ${distPath}`);
  servePath = path.join(baseDir, 'apps/app-rs/dist');
} else if (fs.existsSync(clientPath)) {
  console.log(`Found: ${clientPath}`);
  servePath = path.join(baseDir, 'client');
} else {
  if (!process.env.SERVE_PATH) {
    throw new Error('Neither dist nor client index.html found.');
  }
}

if (!process.env.SERVE_PATH) {
  process.env.SERVE_PATH = servePath;
}

const run = async () => {
  Gateway.getInstance().run({
    mainAppOptions: (await getConfig()) as any,
  });
};

run();
