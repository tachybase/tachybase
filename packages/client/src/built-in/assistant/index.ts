import { Plugin } from '../../application/Plugin';
import { AssistantProvider } from './Assistant.provider';

export * from './context';
export * from './Assistant.provider';

export class PluginAssistant extends Plugin {
  async afterLoad() {
    this.app.use(AssistantProvider);
  }
}
