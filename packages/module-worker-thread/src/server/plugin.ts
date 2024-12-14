import path from 'path';
import { isMainThread } from 'worker_threads';
import PluginACL from '@tachybase/module-acl';
import CollectionManagerPlugin from '@tachybase/module-collection';
import { Plugin } from '@tachybase/server';
import { fsExists } from '@tachybase/utils';

import PluginCoreServer from '@hera/plugin-core';

import { WorkerManager } from './workerManager';

export class ModuleWorkerThreadServer extends Plugin {
  async afterAdd() {
    this.app.workerPlugins = new Set();
    if (!isMainThread) {
      this.app.registerWorker = (plugin: string) => {};
      return;
    } else {
      this.app.workerPlugins.add(this.name);
      this.app.registerWorker = (plugin: string) => {
        this.app.workerPlugins.add(plugin);
      };
    }
  }

  async beforeLoad() {
    if (!isMainThread) {
      return;
    }
  }

  async load() {
    // upgrade 命令不再调用工作线程
    if (!isMainThread) {
      // 只能在主线程创建工作线程,防止工作线程无限循环
      return;
    }
    this.app.on('afterStart', async () => {
      // 备份恢复可能有问题
      if (this.app.worker) {
        await this.app.worker.clear();
      }
      // FIXME: 这种判断方式不太优雅
      const isDev = await fsExists(path.resolve(__dirname, './worker.ts'));
      const names = this.app.pm.getAliases();
      this.app.registerWorker(this.app.pm.get(CollectionManagerPlugin).name);
      // 遇到field开头的插件, 也注册到worker
      for (const name of names) {
        if (name.startsWith('field')) {
          this.app.registerWorker(name);
        }
      }

      // hera字体
      if (this.app.pm.get(PluginCoreServer).enabled) {
        // TODO: 由于hera加载部门表会多对多关联roles
        this.app.registerWorker(this.app.pm.get(PluginACL).name);
        this.app.registerWorker(this.app.pm.get(PluginCoreServer).name);
      }

      this.app.worker = new WorkerManager(this.app, isDev);
      // 这里不再阻塞主线程的start
      this.app.worker.initWorkers();
    });

    // app (重启/恢复备份)关闭后清理掉工作线程
    this.app.on('beforeStop', async () => {
      if (!isMainThread) {
        return;
      }
      if (this.app.worker?.available) {
        await this.app.worker.clear();
      }
    });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {
    if (!isMainThread) {
      return;
    }
    // 清理工作线程, 非同步调用可能会导致工作线程无法正常退出
    await this.app.worker.clear();

    this.app.worker = null;
  }

  async remove() {}
}

export default ModuleWorkerThreadServer;
