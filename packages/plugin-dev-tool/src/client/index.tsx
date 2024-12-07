import { Plugin } from '@tachybase/client';

import { MiddlewareToolPane } from './middlewarePane';

export class PluginDevToolClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.systemSettingsManager.add('devTool', {
      title: `{{t("Dev tool")}}`,
      icon: 'ToolOutlined',
    });
    this.app.systemSettingsManager.add('devTool.middleware', {
      title: `{{t('Middleware')}}`,
      icon: 'CodeOutlined',
      Component: MiddlewareToolPane,
    });
  }
}

export default PluginDevToolClient;
