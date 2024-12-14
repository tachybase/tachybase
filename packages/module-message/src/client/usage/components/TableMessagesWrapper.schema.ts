import { uid } from '@tachybase/utils/client';

import { COLLECTION_NAME_MESSAGES } from '../../../common/messages.collection';

export const getSchemaTableMessagesWrapper = (props?) => {
  const { params } = props || {};
  const id = uid();
  return {
    name: id,
    type: 'void',
    'x-uid': id,
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
