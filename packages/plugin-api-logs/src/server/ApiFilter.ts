import Database from '@tachybase/database';

export class ApiFilter {
  db: Database;
  // 白名单
  whiteList: { resourceName: string; action: string }[] = [];
  blackList: { resourceName: string; action: string }[] = [];

  constructor(database: Database) {
    this.db = database;
    this.addRefreshListener();
  }

  // app.start的时候从数据库apiLogsConfig保存到whiteList和blackList
  async load() {
    try {
      const apiConfigs = await this.db.getRepository('apiLogsConfig').find();
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
    this.db.on('apiLogsConfig.afterSave', () => {
      this.load();
    });
  }

  check(resourceName: string, actionName: string): boolean {
    return this.whiteList.some((item) => item.resourceName === resourceName && item.action === actionName);
  }
}
