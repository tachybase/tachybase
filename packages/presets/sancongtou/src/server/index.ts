import PresetTachyBase from '@tachybase/preset-tachybase';
import _ from 'lodash';

export class PluginSancongtou extends PresetTachyBase {
  #builtInPlugins = ['approval-mobile', 'core'];

  get builtInPlugins() {
    return super.builtInPlugins.concat(this.#builtInPlugins);
  }

  #localPlugins = ['sancongtou>=0.21.0'];

  get localPlugins() {
    return super.localPlugins.concat(this.#localPlugins);
  }
}

export default PluginSancongtou;
