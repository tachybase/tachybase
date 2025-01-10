import { isMainThread } from 'node:worker_threads';
import path from 'path';
import { Transaction } from '@tachybase/database';
import { Plugin } from '@tachybase/server';

import { afterCreate, afterDestroy, afterUpdate } from './hooks';

export default class PluginActionLogs extends Plugin {
  private logsBuffer: any[] = []; // 用于存储消息的缓冲区
  private logsTimer: NodeJS.Timeout = null;
  private logsDebounce = 5_00;

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
      // 收集消息到缓冲区
      this.logsBuffer.push(message.values);
      // 如果已有处理定时器，跳过重新设置
      if (this.logsTimer) return;
      // 设置处理定时器
      this.logsTimer = setTimeout(() => {
        const targetList = [...this.logsBuffer];
        this.logsTimer = null; // 重置定时器引用
        if (!targetList.length) {
          return;
        }
        this.logsBuffer = []; // 清空缓冲区
        this.handleBatchLogs(targetList); // 处理合并后的消息
      }, this.logsDebounce); // 使用 debounce 时间或默认值
    }
  }

  async handleBatchLogs(values: Readonly<any>[], transaction?: Transaction) {
    // 此处不await, 不阻塞主线程, TODO: 后续考虑批量,通过文件收集起来
    if (!isMainThread || !this.app.worker?.available) {
      await this.workerCreateAuditLog(values);
    } else {
      await this.app.worker.callPluginMethod({
        plugin: this.name,
        method: 'workerCreateAuditLog',
        params: values,
        reloadCols: false,
        inputLog: {
          length: values.length,
        },
      });
    }
  }

  async workerCreateAuditLog(values: any[], transaction?: Transaction) {
    const auditLogRepo = this.db.getRepository('auditLogs');
    const auditChangeRepo = this.db.getRepository('auditChanges');

    values.forEach((value, index) => (value.sort = index));
    // 批量插入 auditLogs，只返回 id
    const insertedLogs = await auditLogRepo.model.bulkCreate(values, {
      individualHooks: false, // 禁用逐条钩子调用
      transaction, // 使用事务
      returning: ['id'], // 仅返回 id 字段
    });

    // 构造 changes 数据
    const changes = [];
    insertedLogs.forEach((log, index) => {
      const value = values[index];
      if (!value.changes) {
        return;
      }
      for (const change of value.changes) {
        changes.push({
          ...change,
          auditLogId: log.id,
        });
      }
    });

    // 批量插入 auditChanges
    if (changes.length > 0) {
      await auditChangeRepo.model.bulkCreate(changes, {
        individualHooks: false, // 禁用逐条钩子调用
        transaction, // 使用事务
      });
    }
  }
}
