import type { Project } from '@pnpm/workspace.find-packages';
import chalk from 'chalk';
import execa from 'execa';

import { buildCjs } from './buildCjs';
import { buildClient } from './buildClient';
import { buildDeclaration } from './buildDeclaration';
import { buildEsm } from './buildEsm';
import { buildPlugin } from './buildPlugin';
import {
  CORE_APP,
  CORE_CLIENT,
  ESM_PACKAGES,
  getCjsPackages,
  getPluginPackages,
  getPresetsPackages,
  PACKAGES_PATH,
  ROOT_PATH,
} from './constant';
import { signals } from './stats';
import { tarPlugin } from './tarPlugin';
import {
  getPackageJson,
  getPkgLog,
  getUserConfig,
  PkgLog,
  readFromCache,
  toUnixPath,
  UserConfig,
  writeToCache,
} from './utils';
import { getPackages } from './utils/getPackages';

const BUILD_ERROR = 'build-error';

export async function build(pkgs: string[]) {
  console.log(`build node version: ${process.version}`);
  const messages = [];
  signals.on('build:errors', (message) => {
    messages.push(message);
  });
  const isDev = process.argv.includes('--development');
  process.env.NODE_ENV = isDev ? 'development' : 'production';

  let packages = await getPackages(pkgs);
  const cachePkg = readFromCache(BUILD_ERROR);
  if (process.argv.includes('--retry') && cachePkg?.pkg) {
    packages = packages.slice(packages.findIndex((item) => item.manifest.name === cachePkg.pkg));
  }
  if (packages.length === 0) {
    let msg = '';
    if (pkgs.length) {
      msg = `'${pkgs.join(', ')}' did not match any packages`;
    } else {
      msg = 'No package matched';
    }
    console.warn(chalk.yellow(`[@tachybase/build]: ${msg}`));
    return;
  }

  const pluginPackages = getPluginPackages(packages);
  const cjsPackages = getCjsPackages(packages);
  const presetsPackages = getPresetsPackages(packages);

  // core/*
  await buildPackages(cjsPackages, 'lib', buildCjs, messages);
  const clientCore = packages.find((item) => item.dir === CORE_CLIENT);
  if (clientCore) {
    await buildPackage(clientCore, 'es', buildClient);
  }
  const esmPackages = cjsPackages.filter((pkg) => ESM_PACKAGES.includes(pkg.manifest.name));
  await buildPackages(esmPackages, 'es', buildEsm, messages);

  // plugins/*、samples/*
  await buildPackages(pluginPackages, 'dist', buildPlugin, messages);

  // presets/*
  await buildPackages(presetsPackages, 'lib', buildCjs, messages);

  // writeToCache(BUILD_ERROR, { messages });

  // throw error before umi build
  if (messages.length > 0) {
    console.log('❌ build errors:');
    messages.forEach((message) => {
      console.log('🐛 ', message);
    });

    throw new Error('build error.');
  }

  // core/app
  const appClient = packages.find((item) => item.dir === CORE_APP);
  if (appClient) {
    await runScript(['rsbuild', 'build', '-r', 'apps/app-web'], ROOT_PATH);
  }
}

export async function buildPackages(
  packages: Project[],
  targetDir: string,
  doBuildPackage: (cwd: string, userConfig: UserConfig, sourcemap: boolean, log?: PkgLog) => Promise<any>,
  errorMessage = [],
) {
  for await (const pkg of packages) {
    if (errorMessage.length === 0) {
      writeToCache(BUILD_ERROR, { pkg: pkg.manifest.name });
    }
    try {
      await buildPackage(pkg, targetDir, doBuildPackage);
    } catch (error) {
      signals.emit('build:errors', error);
    }
  }
}

export async function buildPackage(
  pkg: Project,
  targetDir: string,
  doBuildPackage: (cwd: string, userConfig: UserConfig, sourcemap: boolean, log?: PkgLog) => Promise<any>,
) {
  const sourcemap = process.argv.includes('--sourcemap');
  const noDeclaration = process.argv.includes('--no-dts');
  const hasTar = process.argv.includes('--tar');
  const onlyTar = process.argv.includes('--only-tar');

  const log = getPkgLog(pkg.manifest.name);
  const packageJson = getPackageJson(pkg.dir);

  if (onlyTar) {
    await tarPlugin(pkg.dir, log);
    return;
  }

  log(`${chalk.bold(toUnixPath(pkg.dir.replace(PACKAGES_PATH, '').slice(1)))} build start`);

  const userConfig = getUserConfig(pkg.dir);
  // prebuild
  if (packageJson?.scripts?.prebuild) {
    log('prebuild');
    await runScript(['prebuild'], pkg.dir);
    await packageJson.prebuild(pkg.dir);
  }
  if (userConfig.beforeBuild) {
    log('beforeBuild');
    await userConfig.beforeBuild(log);
  }

  // build source
  await doBuildPackage(pkg.dir, userConfig, sourcemap, log);

  // build declaration
  if (!noDeclaration) {
    log('build declaration');
    await buildDeclaration(pkg.dir, targetDir);
  }

  // postbuild
  if (packageJson?.scripts?.postbuild) {
    log('postbuild');
    await runScript(['postbuild'], pkg.dir);
  }

  if (userConfig.afterBuild) {
    log('afterBuild');
    await userConfig.afterBuild(log);
  }

  // tar
  if (hasTar) {
    await tarPlugin(pkg.dir, log);
  }

  // empty line
  console.log();
}

function runScript(args: string[], cwd: string, envs: Record<string, string> = {}) {
  return execa('pnpm', args, {
    cwd,
    stdio: 'inherit',
    env: {
      ...process.env,
      ...envs,
      sourcemap: process.argv.includes('--sourcemap') ? 'sourcemap' : undefined,
      NODE_ENV: process.env.NODE_ENV || 'production',
    },
  });
}
