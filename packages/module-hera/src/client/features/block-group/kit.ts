import { Plugin } from '@tachybase/client';

import { GroupBlock } from './GroupBlock';
import { GroupBlockProvider } from './GroupBlock.provider';
import { KitGroupBlockInitializer } from './initializers/kit';
import { KitGroupBlockSetting } from './settings/kit';
import { KitGroupBlockToolbar } from './toolbars/kit';

export class PluginGroupBlock extends Plugin {
  async afterAdd() {
    await this.app.pm.add(KitGroupBlockInitializer);
    await this.app.pm.add(KitGroupBlockSetting);
    await this.app.pm.add(KitGroupBlockToolbar);
  }

  async load() {
    this.app.addComponents({
      GroupBlockProvider,
      GroupBlock,
    });
  }
}
