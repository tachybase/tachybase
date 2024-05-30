import { Plugin } from '@tachybase/client';

import { ContextMenuProvider } from './ContextMenu.provider';

export class PluginContextMenu extends Plugin {
  async load() {
    this.app.use(ContextMenuProvider);
  }
}
