import { Plugin } from '@tachybase/client';

import { lang } from './locale';
import { TrackingConfigPane } from './TrackingConfigPane';
import { TrackingLogPane } from './TrackingLogPane';
import { TrackingStatisticsPane } from './TrackingStatisticsPane';

class ModuleInstrumentationClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('system-services.custom-instrumentation', {
      icon: 'BarChartOutlined',
      title: lang('Custom Instrumentation'),
    });
    this.app.systemSettingsManager.add('system-services.custom-instrumentation.instrumentation-log', {
      icon: 'FileOutlined',
      title: lang('Instrumentation log'),
      Component: TrackingLogPane,
      aclSnippet: 'pm.system-services.custom-instrumentation.instrumentation-log',
    });
    this.app.systemSettingsManager.add('system-services.custom-instrumentation.serverTrackingConfig', {
      icon: 'SlidersOutlined',
      title: lang('Server tracking configuration'),
      Component: TrackingConfigPane,
      aclSnippet: 'pm.system-services.custom-instrumentation.serverTrackingConfig',
    });
    this.app.systemSettingsManager.add('system-services.custom-instrumentation.trackingStatistics', {
      icon: 'PieChartOutlined',
      title: lang('Tracking statistics'),
      Component: TrackingStatisticsPane,
      aclSnippet: 'pm.system-services.custom-instrumentation.trackingStatistics',
    });
  }
}

export default ModuleInstrumentationClient;
