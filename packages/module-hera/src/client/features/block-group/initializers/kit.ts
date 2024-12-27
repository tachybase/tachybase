import { Plugin } from '@tachybase/client';

import { tval } from '../../../locale';
import { GroupBlockInitializer } from './GroupBlock.initializer';

export class KitGroupBlockInitializer extends Plugin {
  async load() {
    this.app.schemaInitializerManager.addItem('page:addBlock', 'dataBlocks.groupBlock', {
      title: tval('Group'),
      Component: GroupBlockInitializer,
    });
  }
}
