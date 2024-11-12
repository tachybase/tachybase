import React from 'react';
import { Plugin, SchemaComponent, useCollectionManager } from '@tachybase/client';
import { MPage } from '@tachybase/plugin-mobile-client/client';

import { useParams } from 'react-router-dom';

import { CardDetailProvider } from './CardDetail.provider';
import { useScopeCardDetail } from './CardDetail.scope';
import { CardDetailView } from './CardDetail.view';

// THINK: plugin的注册,应该每个组件自己管自己的, 提高内聚性, 就近原则;
// 或者单独写一个轻量的给组件用的 plugin, 用于注册
// 这里暂时用 SC 的前缀 表明这一用途, schema component
// 对于那些零散的组件, 都在共同的文件夹根目录声明
// 尝试, 注册部分直接放在 schema 文件里, 会不会更好一些?
// 那么把转化部分也放进来, 会不会更好? 尝试一下
// 注册部分和转化部分, 都是样板代码, 心智模式无需关注, 只需关注 schema 的声明实现
// 声明部分, 是数据和视图的桥梁, 数据通过 context, provider 提供. 在 component 里消费

// 声明部分
// THINK: 代码逻辑部分写在这里, 会明显导致卡顿甚至卡死, 需要思考为什么? 目前还是将 provider 外移
const useSchema = () => {
  // const params = useParams();
  // const { collection: collectionName } = params;
  // const cm = useCollectionManager();
  // const collection = cm.getCollection(collectionName);
  // const primaryKey = collection.getPrimaryKey();

  return {
    type: 'void',
    'x-designer': 'MPage.Designer',
    'x-component': 'MPage',
    'x-component-props': {},
    properties: {
      DetailView: {
        type: 'void',
        // 'x-decorator-props': {
        //   dataSource: 'main',
        //   collection: collection,
        //   action: 'get',
        //   params: {
        //     appends: ['main_images'],
        //     filterByTk: params[primaryKey],
        //   },
        // },
        'x-decorator': 'page.provider.CardDetailProvider',
        'x-use-component-props': 'useScopeCardDetail',
        'x-component': 'page.view.CardDetailView',
      },
    },
  };
};

// 注册部分
export class SCCardDetail extends Plugin {
  async load() {
    this.app.addComponents({
      'page.provider.CardDetailProvider': CardDetailProvider,
      'page.view.CardDetailView': CardDetailView,
    });
    // THINK: 这里不能声明成形如: page.scope.useScopeCardDetail 的形式, 底层没有做处理.
    // 也没想好这里的标准应该是什么? 也许需要归类?
    this.app.addScopes({
      useScopeCardDetail: useScopeCardDetail,
    });
  }
}

// 转化部分
export const CardDetailSC = () => {
  const schema = useSchema();
  return (
    <SchemaComponent
      components={{
        MPage,
      }}
      schema={schema}
    />
  );
};
