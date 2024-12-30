import path from 'path';
import { Plugin } from '@tachybase/server';

import { afterCreate, afterDestroy, afterUpdate } from './hooks';

export default class PluginActionLogs extends Plugin {
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
      const AuditLog = this.db.getCollection('auditLogs');
      // 此处改为异步创建
      // TODO: 优化性能，可以考虑批量插入, 但是需要中间存储,考虑存储到本地文件,批量插入
      await AuditLog.repository.create({
        values,
        hooks: false,
      });
    }
  }
}
