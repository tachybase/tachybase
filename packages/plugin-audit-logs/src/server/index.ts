import { isMainThread } from 'node:worker_threads';
import path from 'path';
import { Plugin } from '@tachybase/server';

import { afterCreate, afterDestroy, afterUpdate } from './hooks';

export default class PluginActionLogs extends Plugin {
  async afterAdd() {
    if (isMainThread) {
      return;
    }
    // TODO: 测试工作线程这个钩子能不能正常触发
    this.db.on('afterCreate', afterCreate);
    this.db.on('afterUpdate', (model, options) => {
      afterUpdate(model, options, this);
    });
    this.db.on('afterDestroy', afterDestroy);
  }

  async beforeLoad() {
    this.db.on('afterCreate', afterCreate);
    this.db.on('afterUpdate', (model, options) => {
      afterUpdate(model, options, this);
    });
    this.db.on('afterDestroy', afterDestroy);
  }

  async load() {
    await this.importCollections(path.resolve(__dirname, 'collections'));

    this.db.addMigrations({
      namespace: 'audit-logs',
      directory: path.resolve(__dirname, './migrations'),
      context: {
        plugin: this,
      },
    });
  }

  async handleSyncMessage(message: any): Promise<void> {
    if (message.type === 'auditLog') {
      const { values } = message;
      if (!isMainThread || !this.app.worker?.available) {
        this.workerCreateAuditLog(values);
        return;
      }
      // 此处不await, 不阻塞主线程, TODO: 后续考虑批量,通过文件收集起来
      this.app.worker.callPluginMethod({
        plugin: this.name,
        method: 'workerCreateAuditLog',
        params: values,
      });
    }
  }

  async workerCreateAuditLog(values: any) {
    const repo = this.db.getRepository('auditLogs');
    repo.create({
      values,
      hooks: false,
    });
  }
}
