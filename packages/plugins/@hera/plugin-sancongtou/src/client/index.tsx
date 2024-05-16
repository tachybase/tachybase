import React from 'react';
import { GridCard, Plugin } from '@tachybase/client';
import { ProductDetail } from './pages/ProductDetail';
import { ShareProduct } from './custom-components/ShareProduct';
import { ShowDetail } from './custom-components/ShowDetail';
import { getPathProductDetail } from './utils/path';
import { ProductDetailWrapper } from './pages/ProductDetailWrapper';

const GridCardDe = (props) => {
  <GridCard.Decorator {...props}>{props.children}</GridCard.Decorator>;
};
export class PluginSancongtouClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
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
      Component: ProductDetailWrapper,
    });
  }
}

export default PluginSancongtouClient;
