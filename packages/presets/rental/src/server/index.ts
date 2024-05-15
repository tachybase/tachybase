import PresetTachyBase from '@tachybase/preset-tachybase';
import _ from 'lodash';

export class PluginRental extends PresetTachyBase {
  #builtInPlugins = ['approval-mobile', 'core'];

  get builtInPlugins() {
    return super.builtInPlugins.concat(this.#builtInPlugins);
  }

  #localPlugins = ['rental>=0.21.0'];

  get localPlugins() {
    return super.localPlugins.concat(this.#localPlugins);
  }
}

export default PluginRental;
