import { Plugin, tval } from '@nocobase/client';

class PluginCommon extends Plugin {
  async afterAdd() {}
  async beforeLoad() {}

  async load() {
    // 扩展原移动端插件的 block 类型
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', 'filterBlocks', {
      title: tval('Filter blocks'),
      type: 'itemGroup',
      children: [],
    });
  }
}

export default PluginCommon;
