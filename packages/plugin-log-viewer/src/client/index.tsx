import { Plugin } from '@tachybase/client';

import { lang } from './locale';
import { LogsDownloader } from './LogsDownloader';

export class PluginLogViewer extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('system-services.log-viewer', {
      title: lang('Log Viewer'),
      icon: 'FileTextOutlined',
      Component: LogsDownloader,
    });
  }
}

export default PluginLogViewer;
