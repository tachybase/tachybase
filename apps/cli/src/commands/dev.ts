import { Command } from 'commander';
import { getPortPromise } from 'portfinder';

import { nodeCheck, postCheck, promptForTs, run } from '../util';

export default (cli: Command) => {
  const { APP_PACKAGE_ROOT } = process.env;
  cli
    .command('dev')
    .option('-p, --port [port]')
    .option('--proxy-port [port]')
    .option('--client')
    .option('--server')
    .option('--rs')
    .option('--db-sync')
    .option('--inspect [port]')
    .allowUnknownOption()
    .action(async (opts) => {
      promptForTs();
      const { SERVER_TSCONFIG_PATH } = process.env;
      // @ts-ignore
      process.env.IS_DEV_CMD = true;

      if (!SERVER_TSCONFIG_PATH) {
        throw new Error('SERVER_TSCONFIG_PATH is not set.');
      }

      if (process.argv.includes('-h') || process.argv.includes('--help')) {
        run('ts-node', [
          '-P',
          SERVER_TSCONFIG_PATH,
          '-r',
          'tsconfig-paths/register',
          `${APP_PACKAGE_ROOT}/src/index.ts`,
          ...process.argv.slice(2),
        ]);
        return;
      }

      const { port, client, server, inspect, rs } = opts;

      if (port) {
        process.env.APP_PORT = opts.port;
      }

      const { APP_PORT } = process.env;

      let clientPort = 0;
      let serverPort = 0;

      if (APP_PORT) {
        clientPort = Number(APP_PORT);
      }

      nodeCheck();

      await postCheck(opts);

      if (server) {
        serverPort = Number(APP_PORT!);
      } else if (!server && !client) {
        serverPort = await getPortPromise({
          port: 1 * clientPort + 10,
        });
      }

      if (server || !client) {
        console.log('starting server', serverPort);

        const filteredArgs = process.argv.filter(
          (item, i) => !item.startsWith('--inspect') && !(process.argv[i - 1] === '--inspect' && Number.parseInt(item)),
        );

        const argv = [
          'watch',
          ...(inspect ? [`--inspect=${inspect === true ? 9229 : inspect}`] : []),
          '--ignore=./storage/plugins/**',
          '--tsconfig',
          SERVER_TSCONFIG_PATH,
          '-r',
          'tsconfig-paths/register',
          `${APP_PACKAGE_ROOT}/src/index.ts`,
          'start',
          ...filteredArgs.slice(3),
          `--port=${serverPort}`,
        ];

        if (opts.dbSync) {
          argv.push('--db-sync');
        }

        const runDevServer = () => {
          run('tsx', argv, {
            env: {
              APP_PORT: serverPort + '',
            },
          }).catch((err) => {
            if (err.exitCode === 100) {
              console.log('Restarting server...');
              runDevServer();
            } else {
              console.error(err);
            }
          });
        };

        runDevServer();
      }

      if (client || !server) {
        const getDevEnvironment = (clientPort: number, proxyPort: number) => ({
          PORT: clientPort + '',
          APP_ROOT: `${APP_PACKAGE_ROOT}/client`,
          WEBSOCKET_URL:
            process.env.WEBSOCKET_URL || (proxyPort ? `ws://localhost:${proxyPort}${process.env.WS_PATH}` : undefined),
          PROXY_TARGET_URL: process.env.PROXY_TARGET_URL || (proxyPort ? `http://127.0.0.1:${proxyPort}` : undefined),
        });

        if (rs) {
          console.log('starting client', 1 * clientPort);
          const proxyPort = opts.proxyPort || serverPort;
          console.log('proxy port', proxyPort);
          const env = getDevEnvironment(clientPort, proxyPort);
          run('rsbuild', ['dev', '--open', '-r', 'apps/app-rs', '--port', clientPort + ''], { env });
        } else {
          console.log('starting client', 1 * clientPort);
          const proxyPort = opts.proxyPort || serverPort;
          console.log('proxy port', proxyPort);
          const env = getDevEnvironment(clientPort, proxyPort);
          run('umi', ['dev'], { env });
        }
      }
    });
};
