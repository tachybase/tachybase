import { Plugin } from '../../../application/Plugin';
import { CalculatorModelProvider } from './CalculatorModelProvider';
import { CalculatorProvider } from './CalculatorProvider';

export class PluginCalculator extends Plugin {
  async load() {
    this.app.use(CalculatorProvider);
    this.app.use(CalculatorModelProvider);
  }
}

export default PluginCalculator;
