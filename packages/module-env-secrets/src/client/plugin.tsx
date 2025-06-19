import { Plugin } from '@tachybase/client';

import EnvironmentPage from './components/EnvironmentPage';
import { EnvironmentVariablesAndSecretsProvider } from './EnvironmentVariablesAndSecretsProvider';
import { useGetEnvironmentVariables } from './utils';

export class PluginEnvironmentVariablesClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('system-services.environment', {
      title: this.t('Variables and secrets'),
      icon: 'TableOutlined',
      Component: EnvironmentPage,
      aclSnippet: 'pm.system-services.env-secrets',
    });
    this.app.addGlobalVar('$env', useGetEnvironmentVariables);
    this.app.use(EnvironmentVariablesAndSecretsProvider);
  }
}

export default PluginEnvironmentVariablesClient;
