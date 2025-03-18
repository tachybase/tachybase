import { Command } from 'commander';
import { getPortPromise } from 'portfinder';
import zmq from 'zeromq';

import { nodeCheck, postCheck, run } from '../util';

function addElectronCommand(name: string, cli: Command) {
  cli.command(name).action(async (opts) => {
    if (name === 'electron:dev') {
      await runElectronDev(opts);
    } else if (name === 'electron:build') {
      await runElectronBuild(opts);
    } else if (name === 'electron:start') {
      await runElectronStart(opts);
    }
  });
}

async function runElectronDev(opts: any) {
  const { APP_SERVER_ROOT, APP_CLIENT_ROOT, SERVER_TSCONFIG_PATH, APP_ELECTRON_ROOT } = process.env;
  // @ts-ignore
  process.env.IS_DEV_CMD = true;
  const { port, client, server, inspect, rs } = opts;

  if (port) {
    process.env.APP_PORT = opts.port;
  }

  const { APP_PORT } = process.env;

  let clientPort = Number(APP_PORT) || 3000;
  let serverPort = Number(APP_PORT) || 3001;

  if (client) {
    clientPort = client;
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
      `${APP_SERVER_ROOT}/src/index.ts`,
      'start',
      ...filteredArgs.slice(3),
      `--port=${serverPort}`,
    ] as string[];

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
    const runClient = () => {
      const getDevEnvironment = (clientPort: number, proxyPort: number) => ({
        PORT: clientPort + '',
        NO_OPEN: opts.open ? undefined : '1',
        WEBSOCKET_URL:
          process.env.WEBSOCKET_URL || (proxyPort ? `ws://localhost:${proxyPort}${process.env.WS_PATH}` : undefined),
        PROXY_TARGET_URL: process.env.PROXY_TARGET_URL || (proxyPort ? `http://127.0.0.1:${proxyPort}` : undefined),
      });

      const proxyPort = opts.proxyPort || serverPort || clientPort + 10;
      console.log('starting client', 1 * clientPort, 'proxy port', proxyPort);
      const env = getDevEnvironment(clientPort, proxyPort);
      run('rsbuild', ['dev', '-r', APP_CLIENT_ROOT as string], { env });
    };

    async function runMqServer() {
      const sock = new zmq.Reply();

      await sock.bind('tcp://*:' + process.env.IPC_DEV_PORT);
      for await (const [msg] of sock) {
        runClient();
        sock.close();
      }
    }

    if (opts.waitServer) {
      runMqServer();
    } else {
      runClient();
    }
  }

  setTimeout(() => {
    run('electron', [APP_ELECTRON_ROOT as string], {
      env: {
        ...process.env,
        APP_PORT: APP_PORT,
      },
    });
  }, 1000);
}

async function runElectronBuild(opts: any) {
  // TODO: implement
}

async function runElectronStart(opts: any) {
  // TODO: implement
}

export default (cli: Command) => {
  addElectronCommand('electron:dev', cli);
  addElectronCommand('electron:build', cli);
};
