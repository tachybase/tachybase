import { Plugin } from '../../application/Plugin';
import { RemoteSchemaTemplateManagerPlugin } from '../../schema-templates/SchemaTemplateManagerProvider';
import { AdminLayout } from './AdminLayout';

export class AdminLayoutPlugin extends Plugin {
  async afterAdd() {
    await this.app.pm.add(RemoteSchemaTemplateManagerPlugin);
  }
  async load() {
    this.app.addComponents({ AdminLayout });
  }
}
