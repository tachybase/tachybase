import { Plugin } from '@tachybase/server';

export class PluginFieldDateOnlyServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {}

  async install() {
    // 安装时的操作
  }

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginFieldDateOnlyServer;
