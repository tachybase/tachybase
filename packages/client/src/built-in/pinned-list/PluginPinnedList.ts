import { Plugin } from '../../application';
import { PinnedPluginListProvider } from './PinnedPluginListProvider';

export class PluginPinnedList extends Plugin {
  async load() {
    this.app.use(PinnedPluginListProvider, this.options.config);
  }
}
