import { Plugin } from '@tachybase/client';
import { ProductDetail } from './pages/ProductDetail';
import { ShareProduct } from './components/ShareProduct';

export class PluginSancongtouClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.addRoutes();
    this.app.addComponents({
      ShareProduct,
    });
    console.log(this.app);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
  }

  addRoutes() {
    this.app.router.add('sancongtou/detail', {
      path: '/mobile/products/detail',
      Component: ProductDetail,
    });
  }
}

export default PluginSancongtouClient;
