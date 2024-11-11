import { Plugin } from '../../application/Plugin';
import { DesignableSwitch } from './DesignableSwitch';

export * from './DesignableSwitch';
export * from './FormProvider';
export * from './RemoteSchemaComponent';
export * from './SchemaComponent';
export * from './SchemaComponentOptions';
export * from './SchemaComponentProvider';

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

export default SchemaComponentPlugin;
