import { COLLECTION_NAME_MESSAGES } from '../../../common/collections/messages';

export const getSchemaTableMessagesWrapper = (props?) => {
  const { params } = props || {};
  return {
    type: 'void',
    name: 'message-table',
    'x-uid': 'message-table',
    'x-decorator': 'Messages-ProviderCollectionMessages',
    'x-decorator-props': {
      collection: COLLECTION_NAME_MESSAGES,
      action: 'list',
      params,
    },
    'x-component': 'CardItem',
    'x-acl-action': 'messages:list',
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': 'blockSettings:table',
    properties: {
      block: {
        type: 'void',
        'x-component': 'Messages-ViewTableMessages',
      },
    },
  };
};
