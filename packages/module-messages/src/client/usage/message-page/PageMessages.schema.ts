import { COLLECTION_NAME_MESSAGES } from '../../../common/messages.collection';
import { lang } from '../../locale';

export const schemaPageMessages = {
  type: 'void',
  properties: {
    page: {
      type: 'void',
      'x-component': 'Page',
      title: lang('Site Messages'),
      properties: {
        messages: {
          type: 'void',
          'x-decorator': 'ProviderCollectionMessages',
          'x-decorator-props': {
            collection: COLLECTION_NAME_MESSAGES,
            action: 'list',
            params: {
              pageSize: 20,
              sort: ['-createdAt'],
            },
            rowKey: 'id',
            showIndex: true,
            dragSort: false,
            disableTemplate: true,
          },
          'x-component': 'CardItem',
          'x-acl-action': 'messages:list',
          'x-toolbar': 'BlockSchemaToolbar',
          'x-settings': 'blockSettings:table',
          properties: {
            block: {
              type: 'void',
              'x-component': 'ViewTableMessages',
            },
          },
        },
      },
    },
  },
};
