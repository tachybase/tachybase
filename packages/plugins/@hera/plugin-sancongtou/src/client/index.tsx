import { Plugin } from '@tachybase/client';

// import { ProductDetail } from './pages/ProductDetail.1';
import { ShareProduct } from './custom-components/ShareProduct';
import { ShowDetail } from './custom-components/ShowDetail';
import { CardDetailSC, SCCardDetail } from './pages/CardDetail.schema';
import { getPathProductDetail } from './utils/path';

export class PluginSancongtouClient extends Plugin {
  async afterAdd() {
    await this.app.pm.add(SCCardDetail);
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    this.addRoutes();

    this.app.addComponents({
      // 自定义字段组件
      // GridCard: {
      //   ...GridCard,
      //   // @ts-ignore
      //   // Decorator: GridCardDe,
      // },
      ShowDetail,
      ShareProduct,
    });
    // console.log(this.app);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
  }

  addRoutes() {
    // this.app.router.add('sancongtou/detail', {
    //   path: '/mobile/products/detail',
    //   Component: ProductDetail,
    // });
    this.app.router.add('mobile.productDetail', {
      path: getPathProductDetail({
        name: ':name',
        dataSource: ':dataSource',
        collection: ':collection',
        id: ':id',
      }),
      Component: CardDetailSC,
    });
  }
}

export default PluginSancongtouClient;
