import { isMainThread, parentPort, workerData } from 'worker_threads';
import { parseDatabaseOptionsFromEnv } from '@tachybase/database';
import { getLoggerLevel, getLoggerTransport } from '@tachybase/logger';
import { Application, ApplicationOptions, AppLoggerOptions } from '@tachybase/server';

import { WorkerEvent } from './workerTypes';

// TODO: 另起一个文件夹
const loggerOptions = {
  system: {
    transports: getLoggerTransport(),
    level: getLoggerLevel(),
  },
  request: {
    transports: getLoggerTransport(),
    level: getLoggerLevel(),
  },
} as AppLoggerOptions;

const handleWorkerMessages = (app: Application) => {
  if (isMainThread) {
    return;
  }
  parentPort.postMessage({
    event: WorkerEvent.Started,
  });
  parentPort.on('message', async (message) => {
    app.logger.info('[worker] input', message);
    const { reqId, event } = message;
    if (event === WorkerEvent.PluginMethod) {
      try {
        const { plugin, method, params } = message.values;
        const appPlugin = app.pm.get(plugin);
        const result = await appPlugin[method](params);
        app.logger.info(`[worker] output ${result}`);
        parentPort.postMessage({
          event,
          reqId,
          result,
        });
      } catch (error) {
        app.logger.error('[worker] error', error);
        parentPort.postMessage({
          event,
          reqId,
          error,
        });
      }
    } else {
      app.logger.error('[worker] invalid message', message);
      parentPort.postMessage({
        event,
        reqId,
        error: 'invalid message',
      });
    }
  });
};

export const main = async () => {
  const start = Date.now();
  const applicationOptions = {
    database: await parseDatabaseOptionsFromEnv(),
    plugins: [...workerData.plugins],
    logger: loggerOptions,
  } as ApplicationOptions;
  const app = new Application(applicationOptions);
  await app.load({
    skipDbPluigns: true,
  });

  await app.start({
    dbSync: false,
    quickstart: true,
    checkInstall: false,
  });
  app.logger.info('[worker] app has been started');

  // 工作线程部分逻辑代码
  handleWorkerMessages(app);
};

// 支持直接通过 npx tsx --tsconfig ./tsconfig.server.json -r tsconfig-paths/register ./packages/module-worker-thread/src/server/worker.ts 测试启动
main();
