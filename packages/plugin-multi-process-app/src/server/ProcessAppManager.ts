import { Repository } from '@tachybase/database';
import Application from '@tachybase/server';

import Koa from 'koa';
import proxy from 'koa-proxies';

import { getPidByPort, runCommand, runCommandAsync } from './utils';

export class ProcessAppManager {
  private pidMap: Record<number, number> = {};
  private middlewares: Record<number, Koa.Middleware> = {};

  private repo: Repository;
  transportMap: Record<string, number> = {};

  constructor(public mainApp: Application) {
    this.repo = this.mainApp.db.getRepository('process_apps');
  }

  // app,afterStart之后要启动子应用
  async afterStart() {
    const appList = await this.repo.find({
      filter: {
        enabled: true,
      },
    });
    for (const appItem of appList) {
      const proxyFunc = proxy('/', {
        target: appItem.host,
        changeOrigin: true,
      });
      this.mainApp.use(proxyFunc);
      this.middlewares[appItem.id] = proxyFunc;
    }

    this.mainApp.use(async (ctx, next) => {
      const host = ctx.host; // 获取请求的 Host，如 api.example.com

      const subdomains = Object.keys(this.transportMap);
      // 查找匹配的 target
      const matchedRule = subdomains.find((subdomain) => new RegExp(`^${subdomain}\\.`).test(host));

      const target = `http://127.0.0.1:${this.transportMap[matchedRule]}`;

      if (matchedRule) {
        return proxy('/', {
          target,
          changeOrigin: true,
        })(ctx, next);
      }

      return next();
    });
  }

  async addListener() {}

  async startApp(remote: string, localPath: string, branch: string = 'main', prId = 0) {
    // TODO: git clone加速
    if (remote) {
      await runCommand(`git clone --branch ${branch} --single-branch ${remote} ${localPath}`);
    }
    const APP_PORT = `${prId + 15_000}`;
    const DB_DATABASE = `pr_${prId}`;
    // TODO: install 加速
    await runCommand(`pnpm install && pnpm build`, localPath);
    const pid = await runCommandAsync('pnpm', ['start', '--quickstart'], localPath, {
      DB_DATABASE,
      APP_PORT,
    });
    const insertRecord = await this.repo.create({
      values: {
        enabled: true,
        pid,
        database: DB_DATABASE,
        port: +APP_PORT,
        remote,
        branch,
        cname: `${prId}`,
      },
    });
    // 保存到数据库, 并指定端口,数据库
    this.pidMap[insertRecord.id] = pid;
  }

  async refreshApp(remote: string, localPath: string, branch: string = 'main', prId = 0) {}

  async stopApp(id: number) {
    const repo = this.mainApp.db.getRepository('process_apps');
    let pid = this.pidMap[id];
    if (!pid) {
      const appItem = await repo.findOne({
        filter: {
          id: true,
        },
      });
      const port = appItem.port;
      if (!port) {
        return;
      }
      pid = await getPidByPort(port);
    }

    if (!pid) {
      this.mainApp.logger.error(`can not find pid, id: ${id}`);
    }

    try {
      process.kill(pid);
    } catch (e) {
      this.mainApp.logger.error(e);
      return;
    }

    await repo.destroy({
      filter: {
        id,
      },
    });
    delete this.pidMap[id];
  }
}
