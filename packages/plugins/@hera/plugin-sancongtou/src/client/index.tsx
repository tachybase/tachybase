import { Plugin } from '@nocobase/client';
import { TestComponent } from './components/Test';

export class PluginSancongtouClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    console.log(this.app);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    this.app.router.add('pages/outlink', {
      path: '/outlink',
      Component: TestComponent,
    });
  }
}

export default PluginSancongtouClient;
