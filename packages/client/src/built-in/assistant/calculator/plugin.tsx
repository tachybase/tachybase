import { Plugin } from '../../../application/Plugin';
import { CalculatorModalProvider } from './CalculatorModalProvider';
import { CalculatorProvider } from './CalculatorProvider';

export class PluginCalculator extends Plugin {
  async load() {
    this.app.use(CalculatorProvider);
    this.app.use(CalculatorModalProvider);
  }
}

export default PluginCalculator;
