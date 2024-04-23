import { Plugin } from '@nocobase/client';
import { AssistantProvider } from './Assistant.provider';

export class PluginAssistant extends Plugin {
  async load() {
    this.app.use(AssistantProvider);
  }
}
