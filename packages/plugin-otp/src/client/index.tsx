import { Plugin } from '@tachybase/client';

import { NAMESPACE } from './locale';
import { VerificationProviders } from './VerificationProviders';

export class PluginOtp extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('system-services.' + NAMESPACE, {
      icon: 'CheckCircleOutlined',
      title: `{{t("OTP Providers", { ns: "${NAMESPACE}" })}}`,
      Component: VerificationProviders,
      aclSnippet: 'pm.verification.providers',
    });
  }
}

export default PluginOtp;
