import { ISchema } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

interface OptionsType {
  collection: string;
  dataSource: string;
  blockType: string;
}

export function createSchemaImageSearchBlock(options: OptionsType): ISchema {
  const { collection, dataSource, blockType } = options;
  return {
    type: 'void',
    // TODO: 困惑, 这里不能直接用 DataBlockProvider, 因为它没有collection和dataSource属性
    'x-decorator': 'ImageSearchProvider',
    'x-decorator-props': {
      collection,
      dataSource,
      blockType,
    },
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': 'blockSettings:filterCollapse',
    'x-component': 'CardItem',
    'x-filter-targets': [],
    properties: {
      [uid()]: {
        type: 'void',
        'x-action': 'imageSearch',
        'x-initializer': 'ImageSearchView:configureFields',
        'x-component': 'ImageSearchView',
      },
    },
  };
}
