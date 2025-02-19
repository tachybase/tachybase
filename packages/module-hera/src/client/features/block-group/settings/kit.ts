import { Plugin } from '@tachybase/client';

import { GroupBlockSettings } from './GroupBlock.setting';
import { GroupBlockConfigure } from './GroupBlockConfigure';

export class KitGroupBlockSetting extends Plugin {
  async load() {
    this.schemaSettingsManager.add(GroupBlockSettings);

    this.app.addComponents({
      GroupBlockConfigure,
    });
  }
}
