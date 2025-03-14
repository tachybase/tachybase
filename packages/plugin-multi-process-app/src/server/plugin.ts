import { Plugin } from '@tachybase/server';

import proxy from 'koa-proxies';

export class MultiProcessAppServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    const repo = this.db.getRepository('process_apps');
    const appList = await repo.find();
    const middlewares: Record<number, any> = {};
    for (const appItem of appList) {
      const proxyFunc = proxy('/', {
        target: appItem.host,
        changeOrigin: true,
      });
      this.app.use(proxyFunc);
      middlewares[appItem.id] = proxyFunc;
    }
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default MultiProcessAppServer;
