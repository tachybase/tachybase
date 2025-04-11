import { ISchema } from '@tachybase/schema';

import { NAMESPACE, tval } from '../locale';

export const statisticsConfigCollection = {
  name: 'statisticsConfig',
  fields: [
    {
      interface: 'input',
      type: 'string',
      name: 'title',
      uiSchema: {
        type: 'string',
        title: tval('Title'),
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'json',
      name: 'statisticsOptions',
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
