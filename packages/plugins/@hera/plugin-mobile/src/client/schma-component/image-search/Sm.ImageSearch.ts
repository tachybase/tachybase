import { ISchema } from '@nocobase/schema';
import { uid } from '@nocobase/utils/client';

interface OptionsType {
  collectionName: string;
  dataSource: string;
  blockType: string;
}

export function createSchemaImageSearchBlock(options: OptionsType): ISchema {
  const { collectionName, dataSource, blockType } = options;

  return {
    type: 'void',
    //   'x-decorator': 'ImageSearchProvider',
    'x-decorator-props': {
      collection: collectionName,
      dataSource,
      blockType,
    },
    'x-toolbar': 'BlockSchemaToolbar',
    // FIXME: 模板在当前这个 provider 下是不支持的，要么添加相关的代码，要么这个 settings 用自己的
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
}
