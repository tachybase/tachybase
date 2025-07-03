import { useColumnSchema, useDesignable, useTranslation } from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';

import { NAMESPACE } from '../constants';

export const enableCopierSettingItem = {
  name: 'enableCopier',
  type: 'switch' as const,
  useComponentProps() {
    const { dn } = useDesignable();
    const { t } = useTranslation(NAMESPACE);
    const { fieldSchema: tableFieldSchema } = useColumnSchema();
    const fieldSchema = useFieldSchema();
    const field = useField();
    const schema = tableFieldSchema || fieldSchema;

    return {
      title: t('Display copy button'),
      checked: schema['x-component'] === 'ViewTextCopyWrapper',
      onChange: async (checked) => {
        if (checked) {
          if (schema['x-component']) {
            const sourceComponentName = schema['x-component'];
            _.set(schema, 'x-component-props.textCopyChildren', sourceComponentName);
          }

          await dn.emit('patch', {
            schema: {
              'x-uid': schema['x-uid'],
              'x-component': 'ViewTextCopyWrapper',
              'x-component-props': {
                ...schema['x-component-props'],
              },
            },
          });
        } else {
          _.set(schema, 'x-component', schema['x-component-props']?.['textCopyChildren']);
          _.unset(schema, 'x-component-props.textCopyChildren');

          await dn.emit('patch', {
            schema: {
              'x-uid': schema['x-uid'],
              'x-component': schema['x-component-props']?.['textCopyChildren'],
              'x-component-props': {
                ...schema['x-component-props'],
              },
            },
          });
        }
        dn.refresh();
      },
    };
  },
};
