import { Plugin } from '@tachybase/client';

import { NAMESPACE } from './locale';
import { VerificationProviders } from './VerificationProviders';

export class VerificationPlugin extends Plugin {
  async load() {
    this.app.pluginSettingsManager.add(NAMESPACE, {
      icon: 'CheckCircleOutlined',
      title: `{{t("Verification", { ns: "${NAMESPACE}" })}}`,
      Component: VerificationProviders,
      aclSnippet: 'pm.verification.providers',
    });
  }
}

export default VerificationPlugin;
