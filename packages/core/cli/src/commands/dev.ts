import { Command } from 'commander';
import { run, postCheck, nodeCheck, promptForTs } from '../util';
import { getPortPromise } from 'portfinder';

export default (cli: Command) => {
  const { APP_PACKAGE_ROOT } = process.env;
  cli
    .command('dev')
    .option('-p, --port [port]')
    .option('--client')
    .option('--server')
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

      const { port, client, server, inspect } = opts;

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
          port: 1 * clientPort + 1,
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
            if (err.exitCode == 100) {
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
        console.log('starting client', 1 * clientPort);
        run('umi', ['dev'], {
          env: {
            PORT: clientPort + '',
            APP_ROOT: `${APP_PACKAGE_ROOT}/client`,
            WEBSOCKET_URL:
              process.env.WEBSOCKET_URL ||
              (serverPort ? `ws://localhost:${serverPort}${process.env.WS_PATH}` : undefined),
            PROXY_TARGET_URL:
              process.env.PROXY_TARGET_URL || (serverPort ? `http://127.0.0.1:${serverPort}` : undefined),
          },
        });
      }
    });
};
