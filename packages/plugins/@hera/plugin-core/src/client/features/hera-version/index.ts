import { Plugin } from '@nocobase/client';
import { HeraVersionProvider } from './HeraVersion.provider';

export class PluginHeraVersion extends Plugin {
  async load() {
    this.app.use(HeraVersionProvider);
  }
}
