import { ISchema } from '@tachybase/schema';
import { uid } from '@nocobase/utils/client';

export const createTabSearchBlockSchema = (options: {
  collectionName: string;
  dataSource: string;
  blockType: string;
}): ISchema => {
  const { collectionName, dataSource, blockType } = options;
  return {
    type: 'void',
    'x-decorator': 'TabSearchProvider',
    'x-decorator-props': {
      collection: collectionName,
      dataSource,
      blockType,
    },
    // 这个工具栏本来就没什么特别的作用，就是用于显示名称、模板名称，用这个没问题
    'x-toolbar': 'BlockSchemaToolbar',
    // FIXME 模板在当前这个 provider 下是不支持的，要么添加相关的代码，要么这个 settings 用自己的
    'x-settings': 'blockSettings:filterCollapse',
    'x-component': 'CardItem',
    'x-filter-targets': [],
    properties: {
      [uid()]: {
        type: 'void',
        'x-action': 'tabSearch',
        'x-initializer': 'tabSearch:configureFields',
        'x-component': 'TabSearch',
      },
    },
  };
};
