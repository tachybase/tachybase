import { Plugin } from '@tachybase/server';

import { validator } from './middlewares/validator';

export class PluginValidatorServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    // 目前只有resourcer之后才能通过ctx.action获取到resourceName和actionName
    // TODO: 在authorization之前执行的好处是不用用户验证先验证参数,坏处是容易被测试窥探数据结构
    this.app.resourcer.use(validator, { tag: 'validator', after: 'acl' });
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginValidatorServer;
