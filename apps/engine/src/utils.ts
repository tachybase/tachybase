import { createHash } from 'node:crypto';
import fs, {
  cpSync as _cpSync,
  existsSync as _existsSync,
  writeFileSync as _writeFileSync,
  createWriteStream,
} from 'node:fs';
import { mkdir, unlink } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';

import yoctoSpinner from '@socketregistry/yocto-spinner/index.cjs';
import { config } from 'dotenv';
import npmRegistryFetch from 'npm-registry-fetch';
import * as tar from 'tar';

const modules = [
  'acl',
  'app-info',
  'auth',
  'backup',
  'cloud-component',
  'collection',
  'cron',
  'data-source',
  'error-handler',
  'event-source',
  'file',
  'message',
  'pdf',
  'ui-schema',
  'user',
  'web',
  'worker-thread',
  'instrumentation',
  'workflow',
  'env-secrets',
  'hera', // FIXME: refactor later
  'multi-app',
];

const defaultPlugins = [
  'action-bulk-edit',
  'action-bulk-update',
  'action-custom-request',
  'action-duplicate',
  'action-export',
  'action-import',
  'action-print',
  'block-calendar',
  'block-charts',
  'block-gantt',
  'block-kanban',
  'block-presentation',
  'field-china-region',
  'field-formula',
  'field-sequence',
  'field-encryption',
  'log-viewer',
  'otp',
  'full-text-search',
  'password-policy',
  'auth-pages',
  'manual-notification',
];

function initEnvFile(name: string) {
  const envPath = resolve(name, '.env');
  if (!fs.existsSync(envPath)) {
    fs.copyFileSync(resolve(__dirname, '../presets/.env.example'), envPath);
    console.log('.env file created.');
  } else {
    console.log('.env file already exists.');
  }
}

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

export function parseEnvironment() {
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
    NODE_MODULES_PATH: fs.existsSync(resolve('plugins', 'node_modules'))
      ? resolve('plugins', 'node_modules')
      : resolve('node_modules'),
    PM2_HOME: resolve(process.cwd(), './storage/.pm2'),
    PLUGIN_PACKAGE_PREFIX: '@tachybase/plugin-,@tachybase/module-',
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
      process.env[key] = env[key];
    }
  }

  if (!process.env.__env_modified__ && process.env.APP_PUBLIC_PATH) {
    const publicPath = process.env.APP_PUBLIC_PATH.replace(/\/$/g, '');
    const keys = ['API_BASE_PATH', 'WS_PATH', 'PLUGIN_STATICS_PATH'];
    for (const key of keys) {
      process.env[key] = publicPath + process.env[key];
    }
    process.env.__env_modified__ = '1';
  }

  if (!process.env.__env_modified__ && process.env.APP_SERVER_BASE_URL && !process.env.API_BASE_URL) {
    process.env.API_BASE_URL = process.env.APP_SERVER_BASE_URL + process.env.API_BASE_PATH;
    process.env.__env_modified__ = '1';
  }

  if (!process.env.SERVE_PATH) {
    const servePath = guessServePath();
    if (!servePath) {
      throw new Error('SERVE_PATH not found');
    }
    process.env.SERVE_PATH = servePath;
  }
}

export function guessServePath() {
  const distPath = resolve('apps/app-web/dist/index.html');
  const clientPath = resolve('client/index.html');
  const nodeModulePath = resolve(process.env.NODE_MODULES_PATH, '@tachybase/app-web/dist/index.html');

  if (fs.existsSync(distPath)) {
    return resolve('apps/app-web/dist');
  } else if (fs.existsSync(clientPath)) {
    return resolve('client');
  } else if (fs.existsSync(nodeModulePath)) {
    return resolve(process.env.NODE_MODULES_PATH, '@tachybase/app-web/dist');
  }

  return false;
}

async function getTarballUrl(pkgName, version = 'latest') {
  const info = await npmRegistryFetch.json(`/${pkgName}/${version}`, {
    query: { fullMetadata: true },
  });
  return info.dist.tarball;
}

export async function downloadTar(packageName: string, target: string) {
  const url = await getTarballUrl(packageName);
  const tarballFile = join(target, '..', `${createHash('md5').update(packageName).digest('hex')}-tarball.gz`);
  await mkdir(dirname(tarballFile), { recursive: true });
  const writer = createWriteStream(tarballFile);
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch tarball: ${response.statusText}`);
  }

  // 使用 pipeline 将 response.body 写入文件
  await pipeline(response.body as any, writer);

  await mkdir(target, { recursive: true });
  await tar.x({
    file: tarballFile,
    gzip: true,
    cwd: target,
    strip: 1,
    k: true,
  });

  await unlink(tarballFile);
}

export async function prepare(name: string, plugins = defaultPlugins) {
  if (fs.existsSync(name)) {
    console.log(`project folder ${name} already exists, exit now.`);
    return;
  }
  fs.mkdirSync(name);
  initEnvFile(name);

  const prefix = `${name}/plugins/node_modules`;
  // 安装前端代码
  console.log('🚀 ~ start download ~ front end files');
  const spinner = yoctoSpinner({ text: `Loading @tachybase/app-web` }).start();
  await downloadTar('@tachybase/app-web', `${prefix}/@tachybase/app-web`);
  spinner.success();
  console.log();

  console.log('🚀 ~ start download ~ required modules');
  // 安装必须得模块
  const moduleNames = modules.map((moduleName) => `@tachybase/module-${moduleName}`);
  let index = 1;
  for (const moduleName of moduleNames) {
    const spinner = yoctoSpinner({ text: `[${index++}/${moduleNames.length}] Loading ${moduleName}` }).start();
    await downloadTar(moduleName, `${prefix}/${moduleName}`);
    spinner.success();
  }
  console.log();

  console.log('🚀 ~ start download ~ plugins');
  // 安装可选的模块，由参数指定
  index = 1;
  const pluginNames = plugins.map((pluginName: string) => `@tachybase/plugin-${pluginName}`);
  for (const pluginName of pluginNames) {
    const spinner = yoctoSpinner({ text: `[${index++}/${pluginNames.length}] Loading ${pluginName}` }).start();
    await downloadTar(pluginName, `${prefix}/${pluginName}`);
    spinner.success();
  }
  console.log();
}
