import { ISchema } from '@nocobase/schema';
import { uid } from '@nocobase/schema';

interface EditFormBlockOptions {
  dataSource: string;
  /** 如果传了 association 就不需要再传 collectionName 了 */
  collectionName?: string;
  association?: string;
  templateSchema?: ISchema;
  /**
   * 如果为 true，则表示当前创建的区块 record 就是 useRecord 返回的 record
   */
  isCurrent?: boolean;
}

export function createEditFormBlockUISchema(options: EditFormBlockOptions): ISchema {
  const { collectionName, dataSource, association, templateSchema } = options;
  const resourceName = association || collectionName;
  const isCurrentObj = options.isCurrent ? { 'x-is-current': true } : {};

  if (!dataSource) {
    throw new Error('dataSource are required');
  }

  return {
    type: 'void',
    'x-acl-action-props': {
      skipScopeCheck: false,
    },
    'x-acl-action': `${resourceName}:update`,
    'x-decorator': 'FormBlockProvider',
    'x-use-decorator-props': 'useEditFormBlockDecoratorProps',
    'x-decorator-props': {
      action: 'get',
      dataSource,
      collection: collectionName,
      association,
    },
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': 'blockSettings:editForm',
    'x-component': 'CardItem',
    ...isCurrentObj,
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'FormV2',
        'x-use-component-props': 'useEditFormBlockProps',
        properties: {
          grid: templateSchema || {
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': 'form:configureFields',
            properties: {},
          },
          [uid()]: {
            type: 'void',
            'x-initializer': 'editForm:configureActions',
            'x-component': 'ActionBar',
            'x-component-props': {
              layout: 'one-column',
              style: {
                marginTop: 24,
              },
            },
          },
        },
      },
    },
  };
}
