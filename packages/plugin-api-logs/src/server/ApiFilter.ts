import Database from '@tachybase/database';

export class ApiFilter {
  db: Database;
  // 白名单
  whiteList: { name: string; action: string }[] = [];
  blackList: { name: string; action: string }[] = [];

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
          this.whiteList.push({ name: item.name, action: item.action });
        } else {
          this.blackList.push({ name: item.name, action: item.action });
        }
      }
      console.log('White List:', this.whiteList);
      console.log('Black List:', this.blackList);
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
    return this.whiteList.some((item) => item.name === resourceName && item.action === actionName);
  }
}
