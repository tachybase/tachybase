import { ISchema } from '@tachybase/schema';

import { tval } from '../locale';

export const historyConfigCollection = {
  name: 'trackingHistoryOptions',
  fields: [
    {
      interface: 'input',
      type: 'string',
      name: 'title',
      uiSchema: {
        type: 'string',
        title: tval('Statistics title'),
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'json',
      name: 'historyOptions',
      uiSchema: {
        type: 'json',
        title: tval('Statistics options'),
        'x-component': 'Json',
        'x-component-props': {
          style: {
            height: '150px',
          },
        },
      } as ISchema,
    },
  ],
};
