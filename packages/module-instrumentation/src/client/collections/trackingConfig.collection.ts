import { ISchema } from '@tachybase/schema';

import { NAMESPACE, tval } from '../locale';

export const trackingConfigCollection = {
  name: 'trackingConfig',
  fields: [
    {
      interface: 'input',
      type: 'string',
      name: 'resourceName',
      uiSchema: {
        type: 'string',
        title: tval('Resource name'),
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'string',
      name: 'title',
      uiSchema: {
        type: 'string',
        title: '{{t("Title")}}',
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'string',
      name: 'action',
      uiSchema: {
        type: 'string',
        title: `{{t("Action", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Input',
        'x-component-props': {},
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'boolean',
      type: 'boolean',
      name: 'apiConfig',
      uiSchema: {
        type: 'boolean',
        title: tval('Api audit'),
        'x-component': 'Checkbox',
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'json',
      name: 'trackingOptions',
      uiSchema: {
        type: 'json',
        title: tval('Tracking options'),
        'x-component': 'Json',
        'x-component-props': {
          style: {
            height: '100px',
          },
        },
      } as ISchema,
    },
  ],
};
