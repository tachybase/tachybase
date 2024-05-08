import PresetTachyBase from '@tachybase/preset-tachybase';
import _ from 'lodash';

export class PluginRental extends PresetTachyBase {
  #builtInPlugins = ['approval-mobile', 'core', 'rental', 'mobile-client', 'sancongtou'];

  get builtInPlugins() {
    return super.builtInPlugins.concat(this.#builtInPlugins);
  }
}

export default PresetTachyBase;
