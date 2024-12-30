import { Plugin } from '../../application/Plugin';
import { AssistantListProvider, AssistantProvider } from './Assistant.provider';

export * from './context';
export * from './Assistant.provider';

export class PluginAssistant extends Plugin {
  async load() {
    this.app.use(AssistantListProvider, this.options.config);
  }

  async afterLoad() {
    this.app.use(AssistantProvider);
  }
}
