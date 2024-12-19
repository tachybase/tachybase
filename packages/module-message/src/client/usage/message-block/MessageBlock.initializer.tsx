import { tval } from '@tachybase/client';

import { COLLECTION_NAME_MESSAGES } from '../../../common/collections/messages';

export const initializerName = 'otherBlocks.messages';

export const initializerMessageBlock = {
  name: 'messageBlock',
  type: 'item',
  title: tval('Site Messages'),
  icon: 'BellOutlined',
  Component: 'Messages-ViewBlockInitItem',
  collection: COLLECTION_NAME_MESSAGES,
  params: {
    appends: [],
  },
};
