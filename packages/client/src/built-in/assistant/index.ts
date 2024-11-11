import { Plugin } from '../../application/Plugin';
import { AssistantProvider } from './Assistant.provider';
import { CalculatorProvider } from './calculator/CalculatorProvider';
import { SearchAndJumpProvider } from './search-and-jump';

export class PluginAssistant extends Plugin {
  async load() {
    this.app.use(SearchAndJumpProvider);
    this.app.use(CalculatorProvider);
    this.app.use(AssistantProvider);
  }
}
