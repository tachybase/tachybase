import { Plugin } from '@tachybase/client';

import { PasswordInput, validatePasswordStrength } from './components/PasswordInput';
import { PasswordStrengthIndicator } from './components/PasswordStrengthIndicator';
import { usePasswordValidator } from './hooks/usePasswordValidator';

export { PasswordInput, validatePasswordStrength } from './components/PasswordInput';
export { PasswordStrengthIndicator } from './components/PasswordStrengthIndicator';
export { usePasswordValidator } from './hooks/usePasswordValidator';

export class PasswordPolicyClientPlugin extends Plugin {
  async load() {
    // 注册组件
    this.app.registerComponents({
      PasswordInput: PasswordInput,
      PasswordStrengthIndicator: PasswordStrengthIndicator,
    });
  }
}

export default async function (options = {}) {
  return new PasswordPolicyClientPlugin(options);
}
