import { isMainThread } from 'worker_threads';
import { InjectedPlugin, Plugin } from '@tachybase/server';

import { WORKER_COUNT, WORKER_COUNT_SUB } from './constants';
import { WorkerManager } from './workerManager';
import { WorkerWebController } from './workerWebController';

@InjectedPlugin({
  Controllers: [WorkerWebController],
})
export class ModuleWorkerThreadServer extends Plugin {
  async afterAdd() {}

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

    // 启动时创建工作线程的数量
    const workerCount = this.app.name === 'main' ? WORKER_COUNT : WORKER_COUNT_SUB;
    this.app.on('afterStart', async () => {
      if (this.app.worker) {
        await this.app.worker.clear();
      }
      this.app.worker = new WorkerManager(this.app, workerCount);
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

    // 严格控制管理员才能设置
    this.app.acl.registerSnippet({
      name: `pm.system-services.${this.name}`,
      actions: ['worker_thread:*'],
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
