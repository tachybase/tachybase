import { Plugin } from '@tachybase/client';

import { ClientTrackingPane } from './InstrumentationPane';
import { lang } from './locale';
import { ServerTrackingConfigPane } from './serverTrackingConfigPane';
import { TrackingStatisticsPane } from './TrackingStatisticsPane';

class ModuleInstrumentationClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.app.systemSettingsManager.add('system-services.custom-instrumentation', {
      icon: 'SettingOutlined',
      title: lang('Custom Instrumentation'),
      // Component: InstrumentationPane,
      // aclSnippet: 'pm.system-services.custom-instrumentation',
    });
    this.app.systemSettingsManager.add('system-services.custom-instrumentation.instrumentation-log', {
      icon: 'SettingOutlined',
      title: lang('Instrumentation log'),
      Component: ClientTrackingPane,
      aclSnippet: 'pm.system-services.custom-instrumentation.instrumentation-log',
    });
    this.app.systemSettingsManager.add('system-services.custom-instrumentation.serverTrackingConfig', {
      icon: 'SettingOutlined',
      title: lang('Server tracking configuration'),
      Component: ServerTrackingConfigPane,
      aclSnippet: 'pm.system-services.custom-instrumentation.serverTrackingConfig',
    });
    this.app.systemSettingsManager.add('system-services.custom-instrumentation.trackingStatistics', {
      icon: 'SettingOutlined',
      title: lang('tracking statistics'),
      Component: TrackingStatisticsPane,
      aclSnippet: 'pm.system-services.custom-instrumentation.trackingStatistics',
    });
  }
}

export default ModuleInstrumentationClient;
