import { Plugin } from '../../application/Plugin';
import { AssistantListProvider, AssistantProvider } from './Assistant.provider';
import { CalculatorProvider } from './calculator/CalculatorProvider';
import { SearchAndJumpProvider } from './search-and-jump';

export * from './context';
export * from './Assistant.provider';

export class PluginAssistant extends Plugin {
  async load() {
    this.app.use(SearchAndJumpProvider);
    this.app.use(CalculatorProvider);
    this.app.use(AssistantListProvider, this.options.config);
  }

  async afterLoad() {
    this.app.use(AssistantProvider);
  }
}
