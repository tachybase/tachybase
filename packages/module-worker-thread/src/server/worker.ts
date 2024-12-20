import { isMainThread, parentPort, workerData } from 'worker_threads';
import { CollectionModel, FieldModel } from '@tachybase//module-collection/src/server/models';
import { parseDatabaseOptionsFromEnv } from '@tachybase/database';
import { getLoggerLevel, getLoggerTransport } from '@tachybase/logger';
import { CollectionRepository } from '@tachybase/module-collection';
import PluginUsersServer from '@tachybase/module-user';
import { Application, ApplicationOptions, AppLoggerOptions } from '@tachybase/server';
import { uid } from '@tachybase/utils';

import { WorkerEvent } from './workerTypes';

const loggerOptions = {
  system: {
    transports: getLoggerTransport(),
    level: 'info',
  },
  request: {
    transports: getLoggerTransport(),
    level: 'info',
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
  const appName = workerData.appName || 'main';
  try {
    const applicationOptions = {
      // TODO
      name: `worker-${appName}-${uid()}`,
      database: await parseDatabaseOptionsFromEnv(),
      // plugins: [...workerData.plugins],
      logger: loggerOptions,
    } as ApplicationOptions;
    const app = new Application(applicationOptions);
    app.logger.info('[worker] app boot');
    // only add, not load, start
    await app.pm.initPlugins();

    app.db.registerRepositories({
      CollectionRepository,
    });
    app.db.registerModels({
      CollectionModel,
      FieldModel,
    });

    const userPluginName = await app.pm.get(PluginUsersServer).name;
    // 必备插件 (users表,和一些字段信息的表 TODO: 可能会有遗漏的)
    const pluginNames = [userPluginName];
    for (const [P, plugin] of app.pm.getPlugins()) {
      if (plugin.name.startsWith('field-')) {
        pluginNames.push(plugin.name);
      }
    }

    for (const pluginName of pluginNames) {
      const plugin = app.pm.get(pluginName);
      await plugin.beforeLoad();
    }
    for (const pluginName of pluginNames) {
      const plugin = app.pm.get(pluginName);
      await plugin.load();
    }
    for (const [P, plugin] of app.pm.getPlugins()) {
      if (pluginNames.includes(plugin.name)) {
        continue;
      }
      if (!plugin.enabled) {
        continue;
      }
      await plugin.loadCollections();
      // TODO: feature的inject可能有问题
      // for (const feature of plugin.featureInstances) {
      //   await feature.load();
      // }
    }
    await app.db.getRepository<CollectionRepository>('collections').load();

    app.logger.info('[worker] app has been started');
    // 工作线程部分逻辑代码
    handleWorkerMessages(app);
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
};

// 支持直接通过 npx tsx --tsconfig ./tsconfig.server.json -r tsconfig-paths/register ./packages/module-worker-thread/src/server/worker.ts 测试启动
main();
