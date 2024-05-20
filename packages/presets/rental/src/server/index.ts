import PresetTachyBase from '@tachybase/preset-tachybase';
import _ from 'lodash';

export class PluginRental extends PresetTachyBase {
  #builtInPlugins = ['approval-mobile', 'core', 'homepage', 'external-data-source'];

  get builtInPlugins() {
    return super.builtInPlugins.concat(this.#builtInPlugins);
  }

  #localPlugins = ['rental>=0.21.0', 'field-markdown-vditor>=0.21.0', 'comments>=0.21.0'];

  get localPlugins() {
    return super.localPlugins.concat(this.#localPlugins);
  }
}

export default PluginRental;
