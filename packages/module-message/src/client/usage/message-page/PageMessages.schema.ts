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
          'x-component': 'ViewTableMessagesWrapper',
        },
      },
    },
  },
};
