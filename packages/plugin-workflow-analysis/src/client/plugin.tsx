import { Plugin } from '@tachybase/client';

import { NAMESPACE } from './locale';
import { ExecutionsProvider, JobsProvider } from './WorkflowAnalysisProvider';

class PluginWorkflowAnalysisClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('business-components.executionanalysis', {
      title: `{{t("Executions analysis", { ns: "${NAMESPACE}" })}}`,
      icon: 'FileSearchOutlined',
      Component: ExecutionsProvider,
      sort: 99,
      aclSnippet: 'pm.business-components.executionanalysis',
    });
    this.app.systemSettingsManager.add('business-components.jobanalysis', {
      title: `{{t("Jobs analysis", { ns: "${NAMESPACE}" })}}`,
      icon: 'FileSearchOutlined',
      Component: JobsProvider,
      sort: 100,
      aclSnippet: 'pm.business-components.jobanalysis',
    });
  }
}

export default PluginWorkflowAnalysisClient;
