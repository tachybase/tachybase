import { execSync } from 'node:child_process';
import { cpus } from 'node:os';

import chalk from 'chalk';
import { Command } from 'commander';
import treeKill from 'tree-kill';

import { isPortReachable, run } from '../util';
import { pTest } from './p-test';

/**
 * 检查服务是否启动成功
 */
const checkServer = async (duration = 1000, max = 60 * 10) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const timer = setInterval(async () => {
      if (count++ > max) {
        clearInterval(timer);
        return reject(new Error('Server start timeout.'));
      }

      const url = `${process.env.APP_BASE_URL}/api/__health_check`;

      try {
        const response = await fetch(url);
        if (response.status === 200) {
          clearInterval(timer);
          resolve(true);
        }
      } catch (error) {
        console.error('Request error:', error);
      }
    }, duration);
  });
};

/**
 * 检查 UI 是否启动成功
 * @param duration
 */
const checkUI = async (duration = 1000, max = 60 * 10) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const timer = setInterval(async () => {
      if (count++ > max) {
        clearInterval(timer);
        return reject(new Error('UI start timeout.'));
      }

      try {
        const response = await fetch(`${process.env.APP_BASE_URL}/__umi/api/bundle-status`);
        const result = (await response.json()) as any;
        if (result === 'ok') {
          clearInterval(timer);
          resolve(true);
          return;
        }
        if (result.bundleStatus.done) {
          clearInterval(timer);
          resolve(true);
        }
      } catch (error) {
        console.error('Request error:', error);
      }
    }, duration);
  });
};

async function appReady() {
  console.log('check server...');
  await checkServer();
  console.log('server is ready, check UI...');
  await checkUI();
  console.log('UI is ready.');
}

async function runApp(options = {}) {
  console.log('installing...');
  await run('tego', ['install', '-f']);
  if (await isPortReachable(process.env.APP_PORT!)) {
    console.log('app started');
    return;
  }
  console.log('starting...');
  run('tachybase', [process.env.APP_ENV === 'production' ? 'start' : 'dev'], options);
}

process.on('SIGINT', async () => {
  treeKill(process.pid, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log(chalk.yellow('Force killing...'));
    }
    process.exit();
  });
});

const commonConfig = {
  stdio: 'inherit',
};

const runCodegenSync = () => {
  try {
    execSync(
      `npx playwright codegen --load-storage=storage/playwright/.auth/codegen.auth.json ${process.env.APP_BASE_URL} --save-storage=storage/playwright/.auth/codegen.auth.json`,
      // @ts-ignore
      commonConfig,
    );
  } catch (err: any) {
    if (err.message.includes('auth.json')) {
      execSync(
        `npx playwright codegen ${process.env.APP_BASE_URL} --save-storage=storage/playwright/.auth/codegen.auth.json`,
        // @ts-ignore
        commonConfig,
      );
    } else {
      console.error(err);
    }
  }
};

const filterArgv = () => {
  const arr = process.argv.slice(4);
  const argv = [];
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    if (element === '--url') {
      index++;
      continue;
    }
    if (element.startsWith('--url=')) {
      continue;
    }
    if (element === '--skip-reporter') {
      continue;
    }
    if (element === '--build') {
      continue;
    }
    if (element === '--production') {
      continue;
    }
    argv.push(element);
  }
  return argv;
};

export default (cli: Command) => {
  const e2e = cli.command('e2e').hook('preAction', () => {
    if (process.env.APP_BASE_URL) {
      process.env.APP_BASE_URL = process.env.APP_BASE_URL.replace('localhost', '127.0.0.1');
      console.log('APP_BASE_URL:', process.env.APP_BASE_URL);
    }
  });

  e2e
    .command('test')
    .allowUnknownOption()
    .option('--url [url]')
    .option('--skip-reporter')
    .option('--build')
    .option('--production')
    .action(async (options) => {
      // @ts-ignore
      process.env.__E2E__ = true;
      if (options.production) {
        process.env.APP_ENV = 'production';
      }
      if (options.build) {
        process.env.APP_ENV = 'production';
        await run('pnpm', ['build']);
      }
      if (options.skipReporter) {
        // @ts-ignore
        process.env.PLAYWRIGHT_SKIP_REPORTER = true;
      }
      if (options.url) {
        process.env.APP_BASE_URL = options.url.replace('localhost', '127.0.0.1');
      } else {
        await runApp({
          stdio: 'ignore',
        });
      }
      await appReady();
      await run('npx', ['playwright', 'test', ...filterArgv()]);
      process.exit();
    });

  e2e
    .command('codegen')
    .allowUnknownOption()
    .option('--url [url]')
    .action(async (options) => {
      if (options.url) {
        process.env.APP_BASE_URL = options.url.replace('localhost', '127.0.0.1');
      } else {
        await runApp({
          stdio: 'ignore',
        });
      }
      await appReady();
      runCodegenSync();
    });

  e2e
    .command('start-app')
    .option('--production')
    .option('--build')
    .option('--port [port]')
    .action(async (options) => {
      // @ts-ignore
      process.env.__E2E__ = true;
      if (options.build) {
        await run('pnpm', ['build']);
      }
      if (options.production) {
        process.env.APP_ENV = 'production';
      }
      if (options.port) {
        process.env.APP_PORT = options.port;
      }
      runApp();
    });

  e2e.command('reinstall-app').action(async (options) => {
    await run('tego', ['install', '-f'], options);
  });

  e2e.command('install-deps').action(async () => {
    await run('npx', ['playwright', 'install', '--with-deps']);
  });

  e2e
    .command('p-test')
    .option('--stop-on-error')
    .option('--build')
    .option('--concurrency [concurrency]', '', cpus().length + '')
    .option(
      '--match [match]',
      'Only the files matching one of these patterns are executed as test files. Matching is performed against the absolute file path. Strings are treated as glob patterns.',
      'packages/**/__e2e__/**/*.test.ts',
    )
    .option('--ignore [ignore]', 'Skip tests that match the pattern. Strings are treated as glob patterns.', undefined)
    .action(async (options) => {
      // @ts-ignore
      process.env.__E2E__ = true;
      if (options.build) {
        process.env.APP_ENV = 'production';
        await run('pnpm', ['build']);
      }
      await pTest({ ...options, concurrency: 1 * options.concurrency });
    });
};
