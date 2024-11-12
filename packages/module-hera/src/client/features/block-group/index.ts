import { Plugin } from '@tachybase/client';

import { tval } from '../../locale';
import { GroupBlock } from './GroupBlock';
import { GroupBlockConfigure } from './GroupBlockConfigure';
import {
  GroupBlockInitializer,
  GroupBlockProvider,
  groupBlockSettings,
  GroupBlockToolbar,
} from './GroupBlockInitializer';

export class PluginGroupBlock extends Plugin {
  async load() {
    this.app.schemaInitializerManager.addItem('page:addBlock', 'dataBlocks.groupBlock', {
      title: tval('Group'),
      Component: 'GroupBlockInitializer',
    });
    this.schemaSettingsManager.add(groupBlockSettings);
    this.app.addComponents({
      GroupBlock,
      GroupBlockConfigure,
      GroupBlockInitializer,
      GroupBlockProvider,
      GroupBlockToolbar,
    });
  }
}
