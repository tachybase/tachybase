import PresetTachyBase from '@tachybase/preset-tachybase';
import _ from 'lodash';

export class PluginMini extends PresetTachyBase {
  #builtInPlugins = [
    'data-source-manager',
    'error-handler',
    'collection-manager',
    'ui-schema-storage',
    'file-manager',
    'system-settings',
    'client',
    'auth',
    'verification',
    'users',
    'acl',
    'multi-app-manager',
  ];

  #localPlugins = [];

  get builtInPlugins() {
    return this.#builtInPlugins;
  }

  get localPlugins() {
    return this.#localPlugins;
  }
}

export default PluginMini;
