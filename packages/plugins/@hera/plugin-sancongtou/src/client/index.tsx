import { Plugin } from '@nocobase/client';
import { TestComponent } from './components/Test';
import { ProductDetail } from './pages/ProductDetail';

export class PluginSancongtouClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.addRoutes();
    console.log(this.app);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
  }

  addRoutes() {
    this.app.router.add('pages/outlink', {
      path: '/outlink',
      Component: TestComponent,
    });

    this.app.router.add('sancongtou/detail', {
      path: '/products/detail',
      Component: ProductDetail,
    });
  }
}

export default PluginSancongtouClient;
