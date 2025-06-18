import { useColumnSchema, useDesignable, useTranslation } from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';

import { NAMESPACE } from '../constants';
import { TextCopyButtonNode } from './TextCopyButton';

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
      checked: !!schema['x-component-props']?.enableCopier,
      onChange: async (checked) => {
        // TODO: Need to optimize, current implementation doesn't handle existing addonAfter cases
        if (checked) {
          field.componentProps.addonAfter = TextCopyButtonNode;
          _.set(schema, 'x-component-props.addonAfter', '{{TextCopyButtonNode}}');
          _.set(schema, 'x-component-props.enableCopier', true);
        } else {
          field.componentProps.addonAfter = null;
          _.unset(schema, 'x-component-props.addonAfter');
          _.unset(schema, 'x-component-props.enableCopier');
        }

        await dn.emit('patch', {
          schema: {
            'x-uid': schema['x-uid'],
            'x-component-props': {
              ...schema['x-component-props'],
            },
          },
        });
      },
    };
  },
};
