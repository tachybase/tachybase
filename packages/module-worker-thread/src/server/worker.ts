import { isMainThread, parentPort, workerData } from 'worker_threads';
import { getLoggerLevel, getLoggerTransport } from '@tachybase/logger';
import CollectionManagerPlugin, { CollectionRepository } from '@tachybase/module-collection';
import PluginUsersServer from '@tachybase/module-user';
import { Application, ApplicationOptions, AppLoggerOptions } from '@tachybase/server';
import { Container, uid } from '@tachybase/utils';

import { WorkerEvent } from './workerTypes';

const loggerOptions = {
  system: {
    transports: getLoggerTransport(),
    level: getLoggerLevel(), // TODO: 后续考虑是否提到info
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
  let app: Application;
  const appName = workerData.appName || 'main';
  try {
    const applicationOptions = {
      name: `worker-${appName}-${uid()}`,
      database: workerData.databaseOptions,
      logger: loggerOptions,
    } as ApplicationOptions;
    app = new Application(applicationOptions);
    app.logger.info('[worker] app boot');

    // for Inject
    Container.reset();
    Container.set({ id: 'db', value: app.db });
    Container.set({ id: 'app', value: app });
    Container.set({ id: 'logger', value: app.logger });

    await loadPlugins(app);

    app.logger.info('[worker] app has been started');
    // 工作线程部分逻辑代码
    handleWorkerMessages(app);
  } catch (err) {
    app?.logger?.error('[worker] Failed to start worker:', err);
    // Attempt cleanup
    try {
      await app?.db?.close();
    } catch (cleanupErr) {
      app?.logger?.error('[worker] Cleanup failed:', cleanupErr);
    }
    process.exit(-1);
  }
};

async function loadPlugins(app: Application) {
  // only add, not load, start
  await app.pm.initPlugins();

  // TODO: 这里不该特殊处理
  const userPluginName = app.pm.get(PluginUsersServer).name;
  // 必备插件,为了数据下载,部分插件需要load (users表,和一些字段信息的表 TODO: 可能会有遗漏的)
  const loadPlugins = [userPluginName];
  for (const [P, plugin] of app.pm.getPlugins()) {
    if (plugin.name.startsWith('field-')) {
      loadPlugins.push(plugin.name);
    }
  }
  loadPlugins.push(app.pm.get(CollectionManagerPlugin).name);

  for (const pluginName of loadPlugins) {
    const plugin = app.pm.get(pluginName);
    try {
      await plugin.beforeLoad();
    } catch (error) {
      app.logger.error(`Failed to execute beforeLoad for plugin ${pluginName}:`, error);
      throw error;
    }
  }
  for (const [P, plugin] of app.pm.getPlugins()) {
    if (!plugin.enabled) {
      continue;
    }
    await plugin.loadCollections();
    if (!loadPlugins.includes(plugin.name)) {
      continue;
    }
    await plugin.load();
    for (const feature of plugin.featureInstances) {
      await feature.load();
    }
  }

  // 为了用户自定义表都能下载,备份, 之前只有afterStart才能调用
  await app.db.getRepository<CollectionRepository>('collections').load();
}

// TODO: 支持直接通过 npx tsx --tsconfig ./tsconfig.server.json -r tsconfig-paths/register ./packages/module-worker-thread/src/server/worker.ts 测试启动
main();
