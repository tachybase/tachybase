import { Plugin } from '@tachybase/client';

import { GroupBlockToolbar } from './GroupBlock.toolbar';

export class KitGroupBlockToolbar extends Plugin {
  async load() {
    this.app.addComponents({
      GroupBlockToolbar,
    });
  }
}
