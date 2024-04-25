import { ISchema } from '@nocobase/schema';
import { uid } from '@nocobase/utils/client';

interface OptionsType {
  collectionName: string;
  dataSource: string;
  blockType: string;
}

export function createSchemaImageSearchBlock(options: OptionsType): ISchema {
  const { collectionName: collection, dataSource, blockType } = options;
  return {
    type: 'void',
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
