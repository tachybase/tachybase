import { Plugin } from '@tachybase/client';

import { lang } from './locale';
import { LogsDownloader } from './LogsDownloader';

export class PluginLoggerClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.systemSettingsManager.add('system-services.' + 'logger', {
      title: lang('Logger'),
      icon: 'FileTextOutlined',
      Component: LogsDownloader,
    });
  }
}

export default PluginLoggerClient;
