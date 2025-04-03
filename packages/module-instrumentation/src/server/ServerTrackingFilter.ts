import Database, { Transaction } from '@tachybase/database';

export class ServerTrackingFilter {
  db: Database;
  // 白名单
  whiteList: { resourceName: string; action: string }[] = [];
  blackList: { resourceName: string; action: string }[] = [];

  constructor(database: Database) {
    this.db = database;
    this.load().catch(console.error);
    this.addRefreshListener().catch(console.error);
  }

  // app.start的时候从数据库apiLogsConfig保存到whiteList和blackList
  async load(transaction?: Transaction) {
    try {
      const apiConfigs = await this.db.getRepository('serverTrackingConfig').find({ transaction });
      this.whiteList = [];
      this.blackList = [];
      for (const item of apiConfigs) {
        if (item.apiConfig) {
          this.whiteList.push({ resourceName: item.resourceName, action: item.action });
        } else {
          this.blackList.push({ resourceName: item.resourceName, action: item.action });
        }
      }
    } catch (error) {
      console.error('Failed to load API filter lists:', error);
    }
  }

  async addRefreshListener() {
    this.db.on('serverTrackingConfig.afterSave', async (model, options) => {
      await this.load(options.transaction);
    });
    this.db.on('serverTrackingConfig.afterDestroy', async (model, options) => {
      await this.load(options.transaction);
    });
  }

  check(resourceName: string, actionName: string): boolean {
    return this.whiteList.some((item) => item.resourceName === resourceName && item.action === actionName);
  }
}
