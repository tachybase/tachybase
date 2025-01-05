import { isMainThread } from 'node:worker_threads';
import path from 'path';
import { Plugin } from '@tachybase/server';

import { afterCreate, afterDestroy, afterUpdate } from './hooks';

export default class PluginActionLogs extends Plugin {
  async afterAdd() {
    if (!isMainThread) {
      // 给工作线程也加监听钩子
      this.addAuditListener();
    }
  }

  async beforeLoad() {
    if (isMainThread) {
      this.addAuditListener();
    }
  }

  async addAuditListener() {
    this.db.on('afterCreate', (model, options) => {
      afterCreate(model, options, this);
    });
    this.db.on('afterUpdate', (model, options) => {
      afterUpdate(model, options, this);
    });
    this.db.on('afterDestroy', (model, options) => {
      afterDestroy(model, options, this);
    });
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

  async handleSyncMessage(message: Readonly<any>): Promise<void> {
    if (message?.type === 'auditLog') {
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
        reloadCols: false,
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
