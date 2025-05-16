import { NoticeType } from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

import { NAMESPACE } from '../locale';

export const trackingLogCollection = {
  name: 'trackingEvents',
  fields: [
    {
      name: 'id',
      interface: 'id',
      type: 'bigInt',
      autoIncrement: true,
      uiSchema: {
        type: 'number',
        title: '{{t("ID")}}',
        'x-component': 'InputNumber',
        'x-read-pretty': true,
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'string',
      name: 'key',
      uiSchema: {
        type: 'string',
        title: `{{t("Instrumentation key", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Input',
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'string',
      name: 'type',
      uiSchema: {
        type: 'string',
        title: `{{t("Instrumentation type", { ns: "${NAMESPACE}" })}}`,
        'x-component': 'Input',
      } as ISchema,
    },
    {
      interface: 'input',
      type: 'jsonb',
      name: 'values',
      uiSchema: {
        type: 'object',
        title: `{{t("Instrumentation values", { ns: "${NAMESPACE}" })}}`,
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
