import { Socket } from 'net';
import chalk from 'chalk';
import { execa, Options } from 'execa';
import fastGlob from 'fast-glob';
import { dirname, join, resolve, sep } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { existsSync, mkdirSync, cpSync, writeFileSync } from 'fs';
import { config } from 'dotenv';
import {
  unlinkSync,
  symlinkSync,
  existsSync as _existsSync,
  rmSync,
  cpSync as _cpSync,
  copyFileSync,
  readFileSync,
  writeFileSync as _writeFileSync,
} from 'fs';

export function isPackageValid(pkg: string) {
  try {
    import.meta.resolve(join(process.cwd(), pkg));
    return true;
  } catch (error) {
    return false;
  }
}

export function hasCorePackages() {
  const coreDir = resolve(process.cwd(), 'packages/core/build');
  return existsSync(coreDir);
}

export function hasTsNode() {
  return isPackageValid('ts-node/dist/bin');
}

export function isDev() {
  if (process.env.APP_ENV === 'production') {
    return false;
  }
  return hasTsNode();
}

export const isProd = () => {
  const { APP_PACKAGE_ROOT } = process.env;
  const file = `${APP_PACKAGE_ROOT}/lib/index.js`;
  if (!existsSync(resolve(process.cwd(), file))) {
    console.log('For production environment, please build the code first.');
    console.log();
    console.log(chalk.yellow('$ pnpm build'));
    console.log();
    process.exit(1);
  }
  return true;
};

export function nodeCheck() {
  if (!hasTsNode()) {
    console.log('Please install all dependencies');
    console.log(chalk.yellow('$ pnpm install'));
    process.exit(1);
  }
}

export function run(command: string, args?: string[], options?: Options<any>) {
  if (command === 'tsx') {
    command = 'node';
    args = ['./node_modules/tsx/dist/cli.mjs'].concat(args || []);
  }
  return execa(command, args, {
    shell: true,
    stdio: 'inherit',
    ...options,
    env: {
      ...process.env,
      ...(options?.env ?? {}),
    },
  });
}

interface IPortReachableOptions {
  timeout: number;
  host: string;
}

export async function isPortReachable(port: string, options: Partial<IPortReachableOptions> = {}) {
  const timeout = options.timeout ?? 1000;
  const host = options.host ?? '';
  const promise = new Promise<void>((resolve, reject) => {
    const socket = new Socket();

    const onError = () => {
      socket.destroy();
      reject();
    };

    socket.setTimeout(timeout);
    socket.once('error', onError);
    socket.once('timeout', onError);

    socket.connect(Number(port), host, () => {
      socket.end();
      resolve();
    });
  });

  try {
    await promise;
    return true;
  } catch (_) {
    return false;
  }
}

export async function postCheck(opts: { port?: string }) {
  const port = opts.port || process.env.APP_PORT || '';
  const result = await isPortReachable(port);
  if (result) {
    console.error(chalk.red(`post already in use ${port}`));
    process.exit(1);
  }
}

export async function runInstall() {
  const { APP_PACKAGE_ROOT, SERVER_TSCONFIG_PATH } = process.env;

  if (!SERVER_TSCONFIG_PATH) {
    throw new Error('SERVER_TSCONFIG_PATH is empty.');
  }

  if (isDev()) {
    const argv = [
      '--tsconfig',
      SERVER_TSCONFIG_PATH,
      '-r',
      'tsconfig-paths/register',
      `${APP_PACKAGE_ROOT}/src/index.ts`,
      'install',
      '-s',
    ];
    await run('tsx', argv);
  } else if (isProd()) {
    const file = `${APP_PACKAGE_ROOT}/lib/index.js`;
    const argv = [file, 'install', '-s'];
    await run('node', argv);
  }
}

export async function runAppCommand(command: string, args = []) {
  const { APP_PACKAGE_ROOT, SERVER_TSCONFIG_PATH } = process.env;

  if (!SERVER_TSCONFIG_PATH) {
    throw new Error('SERVER_TSCONFIG_PATH is not set');
  }

  if (isDev()) {
    const argv = [
      '--tsconfig',
      SERVER_TSCONFIG_PATH,
      '-r',
      'tsconfig-paths/register',
      `${APP_PACKAGE_ROOT}/src/index.ts`,
      command,
      ...args,
    ];
    await run('tsx', argv);
  } else if (isProd()) {
    const argv = [`${APP_PACKAGE_ROOT}/lib/index.js`, command, ...args];
    await run('node', argv);
  }
}

export function promptForTs() {
  console.log(chalk.green('WAIT: ') + 'TypeScript compiling...');
}

export async function updateJsonFile(target: string, fn: any) {
  const content = await readFile(target, 'utf-8');
  const json = JSON.parse(content);
  await writeFile(target, JSON.stringify(fn(json), null, 2), 'utf-8');
}

export async function getVersion() {
  const { stdout } = await execa('npm', ['v', '@nocobase/app-server', 'versions']);
  const versions = new Function(`return (${stdout})`)();
  return versions[versions.length - 1];
}

export function generateAppDir() {
  const appPkgPath = dirname(dirname(new URL(import.meta.resolve('@nocobase/app/src/index.ts')).pathname));
  const appDevDir = resolve(process.cwd(), './storage/.app-dev');
  if (isDev() && !hasCorePackages() && appPkgPath.includes('node_modules')) {
    if (!existsSync(appDevDir)) {
      // @ts-ignore
      mkdirSync(appDevDir, { force: true, recursive: true });
      cpSync(appPkgPath, appDevDir, {
        recursive: true,
        force: true,
      });
    }
    process.env.APP_PACKAGE_ROOT = appDevDir;
  } else {
    process.env.APP_PACKAGE_ROOT = appPkgPath;
  }
  buildIndexHtml();
}

export async function genTsConfigPaths() {
  try {
    unlinkSync(resolve(process.cwd(), 'node_modules/.bin/tsx'));
    symlinkSync(
      resolve(process.cwd(), 'node_modules/tsx/dist/cli.mjs'),
      resolve(process.cwd(), 'node_modules/.bin/tsx'),
      'file',
    );
  } catch (error) {
    //
  }

  const cwd = process.cwd();
  const cwdLength = cwd.length;
  const paths: Record<string, string[]> = {
    '@@/*': ['.dumi/tmp/*'],
  };
  const packages = fastGlob.sync(['packages/*/*/package.json', 'packages/*/*/*/package.json'], {
    absolute: true,
    onlyFiles: true,
  });

  await Promise.all(
    packages.map(async (packageFile) => {
      const packageJsonName = JSON.parse(await readFile(packageFile, 'utf-8')).name;
      const packageDir = dirname(packageFile);
      const relativePath = packageDir
        .slice(cwdLength + 1)
        .split(sep)
        .join('/');
      paths[`${packageJsonName}/client`] = [`${relativePath}/src/client`];
      paths[`${packageJsonName}/package.json`] = [`${relativePath}/package.json`];
      paths[packageJsonName] = [`${relativePath}/src`];
      if (packageJsonName === '@nocobase/test') {
        paths[`${packageJsonName}/server`] = [`${relativePath}/src/server`];
        paths[`${packageJsonName}/e2e`] = [`${relativePath}/src/e2e`];
      }
      if (packageJsonName === '@nocobase/plugin-workflow-test') {
        paths[`${packageJsonName}/e2e`] = [`${relativePath}/src/e2e`];
      }
    }),
  );
  const tsConfigJsonPath = join(cwd, './tsconfig.paths.json');
  const content = { compilerOptions: { paths } };
  writeFileSync(tsConfigJsonPath, JSON.stringify(content, null, 2), 'utf-8');

  return content;
}

export function generatePlaywrightPath(clean = false) {
  try {
    const playwright = resolve(process.cwd(), 'storage/playwright/tests');
    if (clean && _existsSync(playwright)) {
      rmSync(dirname(playwright), { force: true, recursive: true });
    }
    if (!_existsSync(playwright)) {
      const testPkg = require.resolve('@nocobase/test/package.json');
      _cpSync(resolve(dirname(testPkg), 'playwright/tests'), playwright, { recursive: true });
    }
  } catch (error) {
    // empty
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

export function buildIndexHtml(force = false) {
  const file = `${process.env.APP_PACKAGE_ROOT}/dist/client/index.html`;
  if (!_existsSync(file)) {
    return;
  }
  const tpl = `${process.env.APP_PACKAGE_ROOT}/dist/client/index.html.tpl`;
  if (force && _existsSync(tpl)) {
    rmSync(tpl);
  }
  if (!_existsSync(tpl)) {
    copyFileSync(file, tpl);
  }
  const data = readFileSync(tpl, 'utf-8');
  const replacedData = data
    .replace(/\{\{env.APP_PUBLIC_PATH\}\}/g, process.env.APP_PUBLIC_PATH ?? '')
    .replace(/\{\{env.API_BASE_URL\}\}/g, process.env.API_BASE_URL ?? process.env.API_BASE_PATH ?? '')
    .replace(/\{\{env.WS_URL\}\}/g, process.env.WEBSOCKET_URL ?? '')
    .replace(/\{\{env.WS_PATH\}\}/g, process.env.WS_PATH ?? '')
    .replace('src="/umi.', `src="${process.env.APP_PUBLIC_PATH}umi.`);
  _writeFileSync(file, replacedData, 'utf-8');
}

export function initEnv() {
  const env = {
    APP_ENV: 'development',
    APP_KEY: 'test-jwt-secret',
    APP_PORT: 13000,
    API_BASE_PATH: '/api/',
    DB_DIALECT: 'sqlite',
    DB_STORAGE: 'storage/db/nocobase.sqlite',
    DB_TIMEZONE: '+00:00',
    DB_UNDERSCORED: parseEnv('DB_UNDERSCORED'),
    DEFAULT_STORAGE_TYPE: 'local',
    LOCAL_STORAGE_DEST: 'storage/uploads',
    PLUGIN_STORAGE_PATH: resolve(process.cwd(), 'storage/plugins'),
    MFSU_AD: 'none',
    WS_PATH: '/ws',
    SOCKET_PATH: 'storage/gateway.sock',
    NODE_MODULES_PATH: resolve(process.cwd(), 'node_modules'),
    PM2_HOME: resolve(process.cwd(), './storage/.pm2'),
    PLUGIN_PACKAGE_PREFIX: '@nocobase/plugin-,@nocobase/plugin-sample-,@nocobase/preset-',
    SERVER_TSCONFIG_PATH: './tsconfig.server.json',
    PLAYWRIGHT_AUTH_FILE: resolve(process.cwd(), 'storage/playwright/.auth/admin.json'),
    CACHE_DEFAULT_STORE: 'memory',
    CACHE_MEMORY_MAX: 2000,
    PLUGIN_STATICS_PATH: '/static/plugins/',
    LOGGER_BASE_PATH: 'storage/logs',
    APP_SERVER_BASE_URL: '',
    APP_PUBLIC_PATH: '/',
  };

  if (
    !process.env.APP_ENV_PATH &&
    process.argv[2] &&
    ['test', 'test:client', 'test:server'].includes(process.argv[2])
  ) {
    if (_existsSync(resolve(process.cwd(), '.env.test'))) {
      process.env.APP_ENV_PATH = '.env.test';
    }
  }

  if (!process.env.APP_ENV_PATH && process.argv[2] === 'e2e') {
    // 用于存放 playwright 自动生成的相关的文件
    generatePlaywrightPath();
    if (!_existsSync('.env.e2e') && _existsSync('.env.e2e.example')) {
      const env = readFileSync('.env.e2e.example');
      _writeFileSync('.env.e2e', env);
    }
    if (!_existsSync('.env.e2e')) {
      throw new Error('Please create .env.e2e file first!');
    }
    process.env.APP_ENV_PATH = '.env.e2e';
  }

  config({
    path: resolve(process.cwd(), process.env.APP_ENV_PATH || '.env'),
  });

  if (process.argv[2] === 'e2e' && !process.env.APP_BASE_URL) {
    process.env.APP_BASE_URL = `http://127.0.0.1:${process.env.APP_PORT}`;
  }

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
