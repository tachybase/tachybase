import { Plugin } from '../../application';
import { DesignableSwitch } from './DesignableSwitch';

export class SchemaComponentPlugin extends Plugin {
  async load() {
    this.addComponents();
  }

  addComponents() {
    this.app.addComponents({
      DesignableSwitch,
    });
  }
}
