import { Plugin } from '@tachybase/client';

import { HeraVersionProvider } from './HeraVersion.provider';

export class PluginHeraVersion extends Plugin {
  async load() {
    this.app.use(HeraVersionProvider);
  }
}
