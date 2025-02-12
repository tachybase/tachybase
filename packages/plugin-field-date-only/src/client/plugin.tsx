import { Plugin } from '@tachybase/client';

import { DateOnlyFieldInterface } from './DateOnlyFieldInterface';

class PluginFieldDateOnlyClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    console.log(this.app);
    // 注册仅日期字段
    this.app.dataSourceManager.addFieldInterfaces([DateOnlyFieldInterface]);
  }
}

export default PluginFieldDateOnlyClient;
