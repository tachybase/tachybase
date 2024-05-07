import { Plugin } from '@nocobase/client';
import { ModeHighlightProvider } from './ModeHighlight.provider';

export class PluginModeHighlight extends Plugin {
  async load() {
    this.app.use(ModeHighlightProvider);
  }
}
