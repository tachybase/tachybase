import { Plugin } from '@tachybase/server';

import { DateOnlyField } from './DateOnlyField';

export class PluginFieldDateOnlyServer extends Plugin {
  async afterAdd() {
    this.db.registerFieldTypes({
      dateOnly: DateOnlyField,
    });
  }

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
